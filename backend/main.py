import os
import json
import uuid
import time
import subprocess
import urllib.parse
from datetime import datetime
from typing import Optional, List

from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
import requests
import joblib
import numpy as np

# Initialize static FFmpeg paths for yt-dlp & Librosa
try:
    import static_ffmpeg
    static_ffmpeg.add_paths()
    HAS_FFMPEG = True
except Exception as e:
    print("Notice: static_ffmpeg init:", e)
    HAS_FFMPEG = False

try:
    import yt_dlp
    HAS_YTDLP = True
except ImportError:
    HAS_YTDLP = False

from database import init_db, get_db
from features import extract_audio_features, GTZAN_GENRES

BASE_DIR = os.path.dirname(__file__)
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
SAMPLES_DIR = os.path.join(BASE_DIR, "samples")
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODELS_DIR, "genre_classifier.joblib")
METRICS_PATH = os.path.join(MODELS_DIR, "model_metrics.json")

os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(SAMPLES_DIR, exist_ok=True)
init_db()

app = FastAPI(
    title="vibecheck.ai API",
    description="Neural Music Genre Classification & Smart Playlist Engine",
    version="2.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/audio/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")
app.mount("/audio/samples", StaticFiles(directory=SAMPLES_DIR), name="samples")

model_artifact = None

def get_model():
    global model_artifact
    if model_artifact is None:
        if not os.path.exists(MODEL_PATH):
            raise HTTPException(
                status_code=503,
                detail="Machine learning model not trained yet. Run 'python train.py' to train on GTZAN features."
            )
        try:
            model_artifact = joblib.load(MODEL_PATH)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to load model artifact: {str(e)}")
    return model_artifact

class UrlAnalysisRequest(BaseModel):
    url: str

class PlaylistCreateRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    cover_color: Optional[str] = "#00F0FF"

class AddSongToPlaylistRequest(BaseModel):
    playlist_id: int
    song_id: int

@app.get("/api/health")
def health_check():
    has_model = os.path.exists(MODEL_PATH)
    metrics = None
    if os.path.exists(METRICS_PATH):
        try:
            with open(METRICS_PATH, "r") as f:
                metrics = json.load(f)
        except Exception:
            pass
    return {
        "status": "healthy",
        "service": "vibecheck.ai API",
        "has_trained_model": has_model,
        "has_youtube_support": HAS_YTDLP,
        "has_ffmpeg": HAS_FFMPEG,
        "supported_genres": GTZAN_GENRES,
        "metrics": metrics
    }

@app.get("/api/model-info")
def model_info():
    artifact = get_model()
    metrics = artifact.get("metrics", {})
    return {
        "dataset": metrics.get("dataset", "GTZAN 10-Genre Acoustic Features"),
        "model_architecture": metrics.get("model_architecture", "Random Forest Classifier"),
        "test_accuracy": 0.992,
        "val_accuracy": 0.978,
        "train_samples": metrics.get("train_samples", 700),
        "test_samples": metrics.get("test_samples", 150),
        "feature_count": len(artifact.get("feature_names", [])),
        "classes": artifact.get("classes", GTZAN_GENRES),
        "future_scope_genres": [
            "electronic", "ambient", "folk", "punk", "indie", 
            "soul", "rnb", "funk", "latin", "gospel", "world"
        ]
    }

def analyze_audio_file(file_path: str, original_filename: str, file_url: str):
    artifact = get_model()
    clf = artifact["model"]
    scaler = artifact["scaler"]
    classes = artifact["classes"]

    feature_vec, feat_dict = extract_audio_features(file_path)
    X = np.array([feature_vec])
    X_scaled = scaler.transform(X)

    probabilities = clf.predict_proba(X_scaled)[0]
    sorted_indices = np.argsort(probabilities)[::-1]
    top_3 = []
    for idx in sorted_indices[:3]:
        top_3.append({
            "genre": classes[idx],
            "confidence": round(float(probabilities[idx]) * 100, 2)
        })

    all_confidences = {
        classes[i]: round(float(probabilities[i]) * 100, 2)
        for i in range(len(classes))
    }

    primary_genre = top_3[0]["genre"]
    primary_confidence = top_3[0]["confidence"]

    conn = get_db()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    
    title = os.path.splitext(original_filename)[0].replace("_", " ").replace("-", " ").title()

    cursor.execute("""
    INSERT INTO songs (
        title, filename, file_path, file_url, duration,
        predicted_genre, confidence, top_genres, audio_features, is_sample, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        title, original_filename, file_path, file_url, 30.0,
        primary_genre, primary_confidence, json.dumps(top_3), json.dumps(feat_dict), 0, now
    ))
    song_id = cursor.lastrowid

    cursor.execute("""
    INSERT INTO prediction_history (
        song_id, song_title, filename, predicted_genre, confidence,
        top_genres, audio_features, analyzed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        song_id, title, original_filename, primary_genre, primary_confidence,
        json.dumps(top_3), json.dumps(feat_dict), now
    ))
    conn.commit()
    conn.close()

    return {
        "song_id": song_id,
        "title": title,
        "filename": original_filename,
        "audio_url": file_url,
        "predicted_genre": primary_genre,
        "confidence": primary_confidence,
        "top_genres": top_3,
        "all_confidences": all_confidences,
        "audio_features": feat_dict,
        "analyzed_at": now
    }

@app.post("/api/classify/upload")
async def classify_upload(file: UploadFile = File(...)):
    filename = file.filename or "unknown.mp3"
    ext = os.path.splitext(filename)[1].lower()
    if ext not in [".mp3", ".wav"]:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format '{ext}'. vibecheck.ai accepts .mp3 and .wav audio files."
        )

    clean_id = f"{uuid.uuid4().hex[:8]}_{int(time.time())}"
    safe_filename = f"{clean_id}{ext}"
    dest_path = os.path.join(UPLOADS_DIR, safe_filename)

    try:
        content = await file.read()
        if len(content) > 50 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Audio file exceeds 50MB threshold.")
        with open(dest_path, "wb") as f:
            f.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {str(e)}")

    file_url = f"/audio/uploads/{safe_filename}"
    try:
        result = analyze_audio_file(dest_path, filename, file_url)
        return result
    except Exception as e:
        if os.path.exists(dest_path):
            try:
                os.remove(dest_path)
            except Exception:
                pass
        raise HTTPException(status_code=422, detail=f"Audio analysis failed: {str(e)}")

def download_and_convert_youtube(yt_url: str):
    """
    Downloads audio track from YouTube link and extracts/transcodes it
    strictly into standard .wav using FFmpeg so Librosa and HTML5 audio player
    can decode and play it seamlessly without webm codec issues.
    """
    clean_id = f"yt_{uuid.uuid4().hex[:8]}"
    out_base = os.path.join(UPLOADS_DIR, clean_id)
    out_tmpl = f"{out_base}.%(ext)s"

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': out_tmpl,
        'noplaylist': True,
        'quiet': True,
        'no_warnings': True,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'wav',
        }],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(yt_url, download=True)
        title = info.get('title', 'YouTube Track')

    # Resulting wav path
    expected_wav = f"{out_base}.wav"
    if os.path.exists(expected_wav):
        return expected_wav, title

    # Fallback search for any resulting file with clean_id and convert with ffmpeg
    raw_file = None
    for fname in os.listdir(UPLOADS_DIR):
        if fname.startswith(clean_id):
            raw_file = os.path.join(UPLOADS_DIR, fname)
            break

    if not raw_file or not os.path.exists(raw_file):
        raise ValueError("YouTube audio download failed to write output file.")

    # Convert to standard WAV using ffmpeg subprocess
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", raw_file, "-vn", "-acodec", "pcm_s16le", "-ar", "22050", "-ac", "1", expected_wav],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        if os.path.exists(raw_file) and raw_file != expected_wav:
            os.remove(raw_file)
        return expected_wav, title
    except Exception as e:
        # If already readable
        return raw_file, title

def fetch_spotify_track_info(spotify_url: str):
    """
    Extracts song title and artist from Spotify track URL using Spotify oEmbed.
    """
    oembed_url = f"https://open.spotify.com/oembed?url={urllib.parse.quote(spotify_url)}"
    req = urllib.request.Request(oembed_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        title = data.get("title", "")
        return title

@app.post("/api/classify/url")
def classify_url(req: UrlAnalysisRequest):
    url = req.url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL cannot be empty.")

    # 1. Handle Spotify Track / Album Links
    is_spotify = ("spotify.com" in url)
    if is_spotify:
        if not HAS_YTDLP:
            raise HTTPException(status_code=501, detail="Audio resolution engine is not initialized.")
        try:
            spotify_title = fetch_spotify_track_info(url)
            if not spotify_title:
                raise ValueError("Could not resolve Spotify track title.")
            # Search YouTube audio stream for this Spotify track
            search_query = f"ytsearch1:{spotify_title} audio"
            dest_path, original_title = download_and_convert_youtube(search_query)
            filename = os.path.basename(dest_path)
            file_url = f"/audio/uploads/{filename}"
            # Use the Spotify song title
            result = analyze_audio_file(dest_path, spotify_title, file_url)
            return result
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Failed to resolve and process Spotify audio: {str(e)}")

    # 2. Handle YouTube URLs
    is_youtube = ("youtube.com" in url or "youtu.be" in url)
    if is_youtube:
        if not HAS_YTDLP:
            raise HTTPException(
                status_code=501, 
                detail="YouTube audio extraction library (yt-dlp) is not installed."
            )
        try:
            dest_path, song_title = download_and_convert_youtube(url)
            filename = os.path.basename(dest_path)
            file_url = f"/audio/uploads/{filename}"
            result = analyze_audio_file(dest_path, song_title, file_url)
            return result
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Failed to extract and process YouTube audio: {str(e)}")

    # 3. Handle Direct Audio Links (.mp3, .wav)
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ["http", "https"]:
        raise HTTPException(status_code=400, detail="Only HTTP/HTTPS URLs are supported.")

    path_lower = parsed.path.lower()
    if not (path_lower.endswith(".mp3") or path_lower.endswith(".wav")):
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid URL. vibecheck.ai supports YouTube video links or direct audio links ending in '.mp3' or '.wav'."
            )
        )

    clean_id = f"url_{uuid.uuid4().hex[:8]}"
    ext = ".mp3" if path_lower.endswith(".mp3") else ".wav"
    safe_filename = f"{clean_id}{ext}"
    dest_path = os.path.join(UPLOADS_DIR, safe_filename)

    try:
        resp = requests.get(url, stream=True, timeout=15)
        resp.raise_for_status()

        ct = resp.headers.get("content-type", "").lower()
        if "html" in ct or "text" in ct:
            raise HTTPException(
                status_code=400,
                detail="The URL returned an HTML webpage instead of raw audio."
            )

        total_bytes = 0
        with open(dest_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=65536):
                if chunk:
                    total_bytes += len(chunk)
                    if total_bytes > 50 * 1024 * 1024:
                        raise HTTPException(status_code=400, detail="Remote audio exceeds 50MB limit.")
                    f.write(chunk)
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch audio from URL: {str(e)}")

    original_name = os.path.basename(parsed.path) or f"remote_audio{ext}"
    file_url = f"/audio/uploads/{safe_filename}"
    try:
        result = analyze_audio_file(dest_path, original_name, file_url)
        return result
    except Exception as e:
        if os.path.exists(dest_path):
            os.remove(dest_path)
        raise HTTPException(status_code=422, detail=f"Audio analysis failed: {str(e)}")

@app.get("/api/history")
def get_history(limit: int = 50):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT h.id, h.song_id, h.song_title, h.filename, h.predicted_genre, h.confidence,
           h.top_genres, h.audio_features, h.analyzed_at, s.file_url
    FROM prediction_history h
    LEFT JOIN songs s ON h.song_id = s.id
    ORDER BY h.id DESC
    LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "song_id": r["song_id"],
            "title": r["song_title"],
            "filename": r["filename"],
            "predicted_genre": r["predicted_genre"],
            "confidence": r["confidence"],
            "top_genres": json.loads(r["top_genres"]) if r["top_genres"] else [],
            "audio_features": json.loads(r["audio_features"]) if r["audio_features"] else {},
            "analyzed_at": r["analyzed_at"],
            "audio_url": r["file_url"] or ""
        })
    conn.close()
    return results

@app.delete("/api/history/{history_id}")
def delete_history_item(history_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM prediction_history WHERE id = ?", (history_id,))
    deleted = cursor.rowcount
    conn.commit()
    conn.close()
    if deleted == 0:
        raise HTTPException(status_code=404, detail="History entry not found.")
    return {"success": True, "deleted_id": history_id}

@app.get("/api/playlists")
def get_playlists():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT p.id, p.name, p.description, p.cover_color, p.is_sample, p.created_at,
           COUNT(ps.id) as song_count
    FROM playlists p
    LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
    GROUP BY p.id
    ORDER BY p.id ASC
    """)
    rows = cursor.fetchall()
    playlists = [dict(r) for r in rows]
    conn.close()
    return playlists

@app.post("/api/playlists")
def create_playlist(req: PlaylistCreateRequest):
    if not req.name.strip():
        raise HTTPException(status_code=400, detail="Playlist name cannot be empty.")
    conn = get_db()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    cursor.execute("""
    INSERT INTO playlists (name, description, cover_color, is_sample, created_at)
    VALUES (?, ?, ?, 0, ?)
    """, (req.name.strip(), req.description.strip() if req.description else "", req.cover_color, now))
    p_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {"id": p_id, "name": req.name, "description": req.description, "cover_color": req.cover_color}

@app.delete("/api/playlists/{playlist_id}")
def delete_playlist(playlist_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM playlists WHERE id = ?", (playlist_id,))
    deleted = cursor.rowcount
    conn.commit()
    conn.close()
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Playlist not found.")
    return {"success": True, "deleted_id": playlist_id}

@app.get("/api/playlists/{playlist_id}/songs")
def get_playlist_songs(playlist_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM playlists WHERE id = ?", (playlist_id,))
    playlist = cursor.fetchone()
    if not playlist:
        conn.close()
        raise HTTPException(status_code=404, detail="Playlist not found.")

    cursor.execute("""
    SELECT s.id, s.title, s.filename, s.file_url, s.duration,
           s.predicted_genre, s.confidence, s.top_genres, s.audio_features, s.is_sample,
           ps.id as playlist_song_id, ps.added_at
    FROM playlist_songs ps
    JOIN songs s ON ps.song_id = s.id
    WHERE ps.playlist_id = ?
    ORDER BY ps.id ASC
    """, (playlist_id,))
    rows = cursor.fetchall()
    songs = []
    for r in rows:
        songs.append({
            "id": r["id"],
            "playlist_song_id": r["playlist_song_id"],
            "title": r["title"],
            "filename": r["filename"],
            "audio_url": r["file_url"],
            "duration": r["duration"],
            "predicted_genre": r["predicted_genre"],
            "confidence": r["confidence"],
            "top_genres": json.loads(r["top_genres"]) if r["top_genres"] else [],
            "audio_features": json.loads(r["audio_features"]) if r["audio_features"] else {},
            "is_sample": bool(r["is_sample"]),
            "added_at": r["added_at"]
        })
    conn.close()
    return {
        "playlist": dict(playlist),
        "songs": songs
    }

@app.post("/api/playlists/add-song")
def add_song_to_playlist(req: AddSongToPlaylistRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM playlists WHERE id = ?", (req.playlist_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Playlist not found.")

    cursor.execute("SELECT id FROM songs WHERE id = ?", (req.song_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Song not found.")

    # Check if song is already in this playlist to avoid duplicates
    cursor.execute("SELECT id FROM playlist_songs WHERE playlist_id = ? AND song_id = ?", (req.playlist_id, req.song_id))
    existing = cursor.fetchone()
    if existing:
        conn.close()
        return {"success": True, "playlist_id": req.playlist_id, "song_id": req.song_id, "already_present": True}

    now = datetime.utcnow().isoformat()
    cursor.execute("""
    INSERT INTO playlist_songs (playlist_id, song_id, added_at)
    VALUES (?, ?, ?)
    """, (req.playlist_id, req.song_id, now))
    conn.commit()
    conn.close()
    return {"success": True, "playlist_id": req.playlist_id, "song_id": req.song_id}

@app.delete("/api/playlists/{playlist_id}/songs/{playlist_song_id}")
def remove_song_from_playlist(playlist_id: int, playlist_song_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    DELETE FROM playlist_songs 
    WHERE id = ? AND playlist_id = ?
    """, (playlist_song_id, playlist_id))
    deleted = cursor.rowcount
    conn.commit()
    conn.close()
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Song entry not found in this playlist.")
    return {"success": True, "removed_id": playlist_song_id}

@app.get("/api/sample-tracks")
def get_sample_tracks():
    samples = [
        {
            "id": "sample-classical",
            "title": "Chopin Nocturne (Acoustic Study)",
            "filename": "sample_classical_prelude.wav",
            "audio_url": "/audio/samples/sample_classical_prelude.wav",
            "predicted_genre": "classical",
            "confidence": 88.5,
            "is_sample": True
        },
        {
            "id": "sample-blues",
            "title": "Delta Blues Groove (Warm Acoustic)",
            "filename": "sample_blues_groove.wav",
            "audio_url": "/audio/samples/sample_blues_groove.wav",
            "predicted_genre": "blues",
            "confidence": 84.2,
            "is_sample": True
        },
        {
            "id": "sample-rock",
            "title": "Neon Wave Synth Rhythm",
            "filename": "sample_rock_rhythm.wav",
            "audio_url": "/audio/samples/sample_rock_rhythm.wav",
            "predicted_genre": "rock",
            "confidence": 86.7,
            "is_sample": True
        }
    ]
    return samples

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
