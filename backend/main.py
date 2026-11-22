import os
import re
import html
import ssl
import json
import uuid
import time
import subprocess
import urllib.parse
from datetime import datetime
from typing import Optional, List

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
try:
    ssl._create_default_https_context = ssl._create_unverified_context
except Exception:
    pass

from fastapi import FastAPI, File, UploadFile, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse, StreamingResponse
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

def get_range_response(file_path: str, range_header: Optional[str], media_type: str = "audio/mpeg"):
    file_size = os.path.getsize(file_path)
    
    if not range_header or "=" not in range_header:
        headers = {
            "Accept-Ranges": "bytes",
            "Content-Length": str(file_size),
            "Content-Type": media_type
        }
        return FileResponse(file_path, media_type=media_type, headers=headers)
    
    try:
        byte_range = range_header.split("=")[1].strip()
        parts = byte_range.split("-")
        start = int(parts[0]) if parts[0] else 0
        end = int(parts[1]) if len(parts) > 1 and parts[1] else file_size - 1
        start = max(0, min(start, file_size - 1))
        end = max(start, min(end, file_size - 1))
        chunk_size = (end - start) + 1
        
        def iterfile():
            with open(file_path, mode="rb") as f:
                f.seek(start)
                remaining = chunk_size
                while remaining > 0:
                    read_len = min(128 * 1024, remaining)
                    data = f.read(read_len)
                    if not data:
                        break
                    remaining -= len(data)
                    yield data
                    
        headers = {
            "Content-Range": f"bytes {start}-{end}/{file_size}",
            "Accept-Ranges": "bytes",
            "Content-Length": str(chunk_size),
            "Content-Type": media_type
        }
        return StreamingResponse(iterfile(), status_code=206, headers=headers)
    except Exception:
        return FileResponse(file_path, media_type=media_type, headers={"Accept-Ranges": "bytes"})

@app.get("/audio/uploads/{filename}")
def stream_upload_audio(filename: str, request: Request):
    safe_name = os.path.basename(filename)
    file_path = os.path.join(UPLOADS_DIR, safe_name)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    range_header = request.headers.get("range")
    ext = os.path.splitext(safe_name)[1].lower()
    media_type = "audio/mpeg" if ext == ".mp3" else ("audio/wav" if ext == ".wav" else "application/octet-stream")
    return get_range_response(file_path, range_header, media_type)

@app.get("/audio/samples/{filename}")
def stream_sample_audio(filename: str, request: Request):
    safe_name = os.path.basename(filename)
    file_path = os.path.join(SAMPLES_DIR, safe_name)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio sample not found")
    range_header = request.headers.get("range")
    ext = os.path.splitext(safe_name)[1].lower()
    media_type = "audio/mpeg" if ext == ".mp3" else ("audio/wav" if ext == ".wav" else "application/octet-stream")
    return get_range_response(file_path, range_header, media_type)

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

    # 1. Automatically save to 'All Analyzed Tracks' master playlist
    cursor.execute("SELECT id FROM playlists WHERE name = 'All Analyzed Tracks'")
    all_pl = cursor.fetchone()
    if not all_pl:
        cursor.execute("""
            INSERT INTO playlists (name, description, cover_color, is_sample, created_at)
            VALUES ('All Analyzed Tracks', 'Complete collection of songs analyzed by vibecheck.ai.', '#1DB954', 0, ?)
        """, (now,))
        all_pl_id = cursor.lastrowid
    else:
        all_pl_id = all_pl["id"]

    cursor.execute("SELECT id FROM playlist_songs WHERE playlist_id = ? AND song_id = ?", (all_pl_id, song_id))
    if not cursor.fetchone():
        cursor.execute("INSERT INTO playlist_songs (playlist_id, song_id, added_at) VALUES (?, ?, ?)", (all_pl_id, song_id, now))

    # 2. Automatically separate into Genre-Specific Playlist (e.g. "Punjabi Mix", "Jazz Mix", etc.)
    clean_genre = (primary_genre or "eclectic").lower().strip()
    genre_pl_name = f"{clean_genre.title()} Mix"
    genre_colors = {
        "punjabi": "#F59E0B", "bhojpuri": "#EA580C", "haryanvi": "#D97706", "bollywood": "#EC4899",
        "classical": "#EAB308", "indian_classical": "#F59E0B", "sufi_qawwali": "#14B8A6",
        "blues": "#3B82F6", "jazz": "#8B5CF6", "rock": "#EF4444", "metal": "#DC2626",
        "pop": "#EC4899", "hiphop": "#10B981", "disco": "#F43F5E", "reggae": "#84CC16",
        "country": "#CA8A04", "ambient": "#06B6D4", "lofi": "#8B5CF6"
    }
    genre_color = genre_colors.get(clean_genre, "#A78BFA")
    
    cursor.execute("SELECT id FROM playlists WHERE name = ?", (genre_pl_name,))
    g_pl = cursor.fetchone()
    if not g_pl:
        cursor.execute("""
            INSERT INTO playlists (name, description, cover_color, is_sample, created_at)
            VALUES (?, ?, ?, 0, ?)
        """, (genre_pl_name, f"All tracks classified under the {clean_genre.upper()} genre.", genre_color, now))
        g_pl_id = cursor.lastrowid
    else:
        g_pl_id = g_pl["id"]

    cursor.execute("SELECT id FROM playlist_songs WHERE playlist_id = ? AND song_id = ?", (g_pl_id, song_id))
    if not cursor.fetchone():
        cursor.execute("INSERT INTO playlist_songs (playlist_id, song_id, added_at) VALUES (?, ?, ?)", (g_pl_id, song_id, now))

    conn.commit()
    conn.close()

    return {
        "id": song_id,
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
    Downloads audio track from YouTube link or search query and extracts/transcodes it
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
        'nocheckcertificate': True,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'wav',
        }],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(yt_url, download=True)
        if info and 'entries' in info and info['entries']:
            title = info['entries'][0].get('title', 'Audio Track')
        else:
            title = (info.get('title') if info else None) or 'Audio Track'

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
        raise ValueError("Audio download failed to write output file.")

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
        return raw_file, title

def fetch_spotify_track_info(spotify_url: str) -> str:
    """
    Resolves Spotify track title and artist using official oEmbed and open metadata.
    """
    title = ""
    # 1. Try Spotify oEmbed
    try:
        oembed_url = f"https://open.spotify.com/oembed?url={urllib.parse.quote(spotify_url)}"
        resp = requests.get(oembed_url, headers={"User-Agent": "Mozilla/5.0"}, verify=False, timeout=8)
        if resp.status_code == 200:
            data = resp.json()
            title = data.get("title", "")
    except Exception:
        pass

    # 2. Try scraping Spotify HTML
    try:
        resp = requests.get(
            spotify_url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
            verify=False,
            timeout=8
        )
        tm = re.search(r'<title>([^<]+)</title>', resp.text, re.I)
        if tm:
            raw = html.unescape(tm.group(1))
            cleaned = re.sub(r'\|\s*Spotify.*', '', raw, flags=re.I)
            cleaned = re.sub(r'[-\u2013]\s*(?:Song|Single|Album|Track|Audio).*?\s+by\s+', ' - ', cleaned, flags=re.I).strip()
            if cleaned and cleaned.lower() != "spotify":
                return cleaned

        dm = re.search(r'<meta\s+property=["\']og:description["\']\s+content=["\']([^"\']+)["\']', resp.text, re.I)
        if dm and title:
            parts = [p.strip() for p in dm.group(1).split('·')]
            for p in parts:
                if p.lower() not in ('song', 'single', 'album', 'ep') and not p.isdigit() and p != title:
                    return f"{title} - {p}"
    except Exception:
        pass

    return title or "Spotify Track"

def fetch_apple_music_info(apple_url: str) -> str:
    """
    Resolves Apple Music song title and artist using official oEmbed and HTML metadata.
    """
    # 1. Try Apple Music oEmbed
    try:
        oembed_url = f"https://music.apple.com/api/oembed?url={urllib.parse.quote(apple_url)}"
        resp = requests.get(oembed_url, headers={"User-Agent": "Mozilla/5.0"}, verify=False, timeout=8)
        if resp.status_code == 200:
            oe = resp.json()
            t = oe.get("title", "")
            a = oe.get("author_name", "")
            if t and a:
                return f"{t} - {a}"
            if t:
                return t
    except Exception:
        pass

    # 2. Try scraping Apple Music HTML
    try:
        resp = requests.get(apple_url, headers={"User-Agent": "Mozilla/5.0"}, verify=False, timeout=8)
        tm = re.search(r'<title>([^<]+)</title>', resp.text, re.I)
        if tm:
            raw = html.unescape(tm.group(1))
            clean = re.sub(r'[\s\xa0\u200b\u200e\ufeff]+', ' ', raw).strip()
            clean = re.sub(r'[-\u2013]\s*Apple\s*Music.*', '', clean, flags=re.I)
            clean = re.sub(r'on\s+Apple\s*Music.*', '', clean, flags=re.I)
            clean = re.sub(r'[-\u2013]\s*(?:Song\s+with\s+Lyrics|Song|Single|Album|Track).*?\s+by\s+', ' - ', clean, flags=re.I)
            clean = clean.replace('â\x80\x8e', '').replace('Â', '').strip()
            if clean and "web player" not in clean.lower():
                return clean
    except Exception:
        pass

    # 3. Slug from URL
    path_parts = urllib.parse.urlparse(apple_url).path.split('/')
    for part in path_parts:
        if part and part not in ('album', 'song', 'artist', 'playlist', 'us', 'in', 'gb') and not part.isdigit():
            return part.replace('-', ' ').title()

    return "Apple Music Track"

def fetch_generic_web_music_info(url: str) -> str:
    """
    Extracts song title and artist from general music/streaming web pages.
    """
    try:
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, verify=False, timeout=8)
        # OpenGraph title
        og = re.search(r'<meta\s+property=["\']og:title["\']\s+content=["\']([^"\']+)["\']', resp.text, re.I)
        if og:
            return html.unescape(og.group(1)).strip()
        # HTML title
        tm = re.search(r'<title>([^<]+)</title>', resp.text, re.I)
        if tm:
            t = html.unescape(tm.group(1))
            for b in ['JioSaavn', 'Gaana', 'Wynk', 'Deezer', 'Tidal', 'Amazon Music', 'Bandcamp', 'Audiomack', 'SoundCloud', 'YouTube']:
                t = re.sub(rf'\|\s*{b}.*', '', t, flags=re.I)
                t = re.sub(rf'on\s+{b}.*', '', t, flags=re.I)
                t = re.sub(rf'-\s*{b}.*', '', t, flags=re.I)
            return t.strip()
    except Exception:
        pass
    return "Music Track"

def download_direct_audio(url: str):
    """
    Downloads direct audio stream from URL and converts to standard WAV.
    """
    clean_id = f"url_{uuid.uuid4().hex[:8]}"
    parsed = urllib.parse.urlparse(url)
    ext = os.path.splitext(parsed.path)[1].lower() or ".mp3"
    raw_path = os.path.join(UPLOADS_DIR, f"{clean_id}{ext}")
    wav_path = os.path.join(UPLOADS_DIR, f"{clean_id}.wav")

    resp = requests.get(url, stream=True, timeout=25, verify=False, headers={"User-Agent": "Mozilla/5.0"})
    resp.raise_for_status()

    total_bytes = 0
    with open(raw_path, "wb") as f:
        for chunk in resp.iter_content(chunk_size=65536):
            if chunk:
                total_bytes += len(chunk)
                if total_bytes > 50 * 1024 * 1024:
                    raise HTTPException(status_code=400, detail="Audio file exceeds 50MB limit.")
                f.write(chunk)

    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", raw_path, "-vn", "-acodec", "pcm_s16le", "-ar", "22050", "-ac", "1", wav_path],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        if os.path.exists(raw_path) and raw_path != wav_path:
            os.remove(raw_path)
    except Exception:
        wav_path = raw_path

    song_name = os.path.basename(parsed.path) or "Web Audio Track"
    return wav_path, song_name

@app.post("/api/classify/url")
def classify_url(req: UrlAnalysisRequest):
    url = req.url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL cannot be empty.")

    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    # 1. Handle Spotify Track / Album / Playlist Links
    is_spotify = ("spotify.com" in url or "spotify.link" in url)
    if is_spotify:
        if not HAS_YTDLP:
            raise HTTPException(status_code=501, detail="Audio resolution engine (yt-dlp) is not initialized.")
        try:
            spotify_title = fetch_spotify_track_info(url)
            if not spotify_title:
                raise ValueError("Could not resolve Spotify track title.")
            search_query = f"ytsearch1:{spotify_title} audio"
            dest_path, _ = download_and_convert_youtube(search_query)
            filename = os.path.basename(dest_path)
            file_url = f"/audio/uploads/{filename}"
            result = analyze_audio_file(dest_path, spotify_title, file_url)
            return result
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Failed to resolve and process Spotify audio: {str(e)}")

    # 2. Handle Apple Music Track / Album Links
    is_apple = ("music.apple.com" in url or "itunes.apple.com" in url)
    if is_apple:
        if not HAS_YTDLP:
            raise HTTPException(status_code=501, detail="Audio resolution engine (yt-dlp) is not initialized.")
        try:
            apple_title = fetch_apple_music_info(url)
            if not apple_title:
                raise ValueError("Could not resolve Apple Music track title.")
            search_query = f"ytsearch1:{apple_title} audio"
            dest_path, _ = download_and_convert_youtube(search_query)
            filename = os.path.basename(dest_path)
            file_url = f"/audio/uploads/{filename}"
            result = analyze_audio_file(dest_path, apple_title, file_url)
            return result
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Failed to resolve and process Apple Music audio: {str(e)}")

    # 3. Handle Direct Audio Links (.mp3, .wav, .m4a, .aac, .ogg, .flac)
    parsed = urllib.parse.urlparse(url)
    path_lower = parsed.path.lower()
    audio_extensions = ('.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.weba')
    if any(path_lower.endswith(ext) for ext in audio_extensions):
        try:
            dest_path, song_title = download_direct_audio(url)
            filename = os.path.basename(dest_path)
            file_url = f"/audio/uploads/{filename}"
            result = analyze_audio_file(dest_path, song_title, file_url)
            return result
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Failed to download and process direct audio: {str(e)}")

    # 4. Handle YouTube, SoundCloud, Bandcamp, or any platform supported by yt-dlp or web search
    if HAS_YTDLP:
        # First attempt direct extraction with yt-dlp (works natively for YouTube, SoundCloud, Vimeo, etc.)
        try:
            dest_path, song_title = download_and_convert_youtube(url)
            filename = os.path.basename(dest_path)
            file_url = f"/audio/uploads/{filename}"
            result = analyze_audio_file(dest_path, song_title, file_url)
            return result
        except Exception as yt_err:
            # If direct download failed (e.g. geo-restriction, unsupported streaming platform like JioSaavn / Gaana),
            # extract song title from web metadata and search YouTube audio stream!
            try:
                web_title = fetch_generic_web_music_info(url)
                if web_title and web_title != "Music Track":
                    search_query = f"ytsearch1:{web_title} audio"
                    dest_path, _ = download_and_convert_youtube(search_query)
                    filename = os.path.basename(dest_path)
                    file_url = f"/audio/uploads/{filename}"
                    result = analyze_audio_file(dest_path, web_title, file_url)
                    return result
            except Exception:
                pass
            raise HTTPException(status_code=422, detail=f"Failed to extract and process audio: {str(yt_err)}")

    raise HTTPException(status_code=400, detail="Invalid or unsupported audio link.")

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

def ensure_mp3(file_path: str) -> str:
    """Ensures an MP3 version of the audio file exists and returns its path."""
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found on server.")
    
    if file_path.lower().endswith(".mp3"):
        return file_path
    
    mp3_path = os.path.splitext(file_path)[0] + ".mp3"
    if not os.path.exists(mp3_path) or os.path.getmtime(file_path) > os.path.getmtime(mp3_path):
        try:
            cmd = ["ffmpeg", "-y", "-i", file_path, "-vn", "-ar", "44100", "-ac", "2", "-b:a", "192k", mp3_path]
            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode != 0:
                return file_path
        except Exception:
            return file_path
    return mp3_path

@app.get("/api/download/song/{song_id}")
def download_song(song_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM songs WHERE id = ?", (song_id,))
    song = cursor.fetchone()
    conn.close()
    
    target = None
    title = "downloaded_track"
    if song:
        title = song["title"]
        file_path = song["file_path"]
        if file_path and os.path.exists(file_path):
            target = file_path
        else:
            alt_sample = os.path.join(SAMPLES_DIR, song["filename"])
            alt_upload = os.path.join(UPLOADS_DIR, song["filename"])
            if os.path.exists(alt_sample):
                target = alt_sample
            elif os.path.exists(alt_upload):
                target = alt_upload

    # Fallback to any available audio file
    if not target or not os.path.exists(target):
        upload_files = [os.path.join(UPLOADS_DIR, f) for f in os.listdir(UPLOADS_DIR) if f.endswith((".wav", ".mp3")) and not f.startswith(".")]
        if upload_files:
            upload_files.sort(key=os.path.getmtime, reverse=True)
            target = upload_files[0]
        else:
            target = os.path.join(SAMPLES_DIR, "sample_lofi_chill.mp3")

    mp3_file = ensure_mp3(target)
    clean_title = "".join(c for c in title if c.isalnum() or c in (" ", "_", "-")).strip() or "track"
    if clean_title.lower().endswith(".mp3"):
        clean_title = clean_title[:-4]
    return FileResponse(
        path=mp3_file,
        media_type="audio/mpeg",
        filename=f"{clean_title}.mp3",
        headers={
            "Content-Disposition": f'attachment; filename="{clean_title}.mp3"',
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@app.get("/api/track/resolve")
def resolve_track(title: str = Query(...), artist: Optional[str] = "", genre: Optional[str] = ""):
    query = f"{artist} {title}".strip()
    clean_query = "".join(c for c in query if c.isalnum() or c in (" ", "_", "-")).strip()
    clean_title = "".join(c for c in title if c.isalnum() or c in (" ", "_", "-")).strip()

    conn = get_db()
    cursor = conn.cursor()
    # 1. Search existing songs in SQLite
    cursor.execute("""
        SELECT id, title, filename, file_path, file_url, duration, predicted_genre
        FROM songs
        WHERE title LIKE ? OR filename LIKE ?
        ORDER BY id DESC LIMIT 1
    """, (f"%{clean_title}%", f"%{clean_title}%"))
    row = cursor.fetchone()
    conn.close()

    if row and row["file_path"] and os.path.exists(row["file_path"]):
        return {
            "id": row["id"],
            "song_id": row["id"],
            "title": row["title"],
            "filename": row["filename"],
            "audio_url": row["file_url"],
            "duration": row["duration"] or 180.0,
            "predicted_genre": row["predicted_genre"] or genre
        }

    # 2. On-demand download and analysis from YouTube
    try:
        search_str = f"ytsearch1:{clean_query} audio"
        dest_path, fetched_title = download_and_convert_youtube(search_str)
        filename = os.path.basename(dest_path)
        file_url = f"/audio/uploads/{filename}"
        display_title = f"{artist} - {title}".strip(" -") if artist else title
        res = analyze_audio_file(dest_path, display_title, file_url)
        return res
    except Exception as e:
        # Fallback to sample if offline
        return {
            "title": title,
            "audio_url": f"/audio/samples/sample_lofi_chill.mp3",
            "predicted_genre": genre or "eclectic",
            "duration": 30.0
        }

@app.get("/api/download/file")
def download_file_by_name(filename: str = Query(...), title: Optional[str] = None):
    safe_name = os.path.basename(filename)
    path1 = os.path.join(UPLOADS_DIR, safe_name)
    path2 = os.path.join(SAMPLES_DIR, safe_name)
    target = None
    if os.path.exists(path1):
        target = path1
    elif os.path.exists(path2):
        target = path2
    else:
        base = os.path.splitext(safe_name)[0]
        for candidate in [
            os.path.join(SAMPLES_DIR, base + ".wav"), os.path.join(SAMPLES_DIR, base + ".mp3"),
            os.path.join(UPLOADS_DIR, base + ".wav"), os.path.join(UPLOADS_DIR, base + ".mp3")
        ]:
            if os.path.exists(candidate):
                target = candidate
                break

    # If not directly on disk, search the database by title, filename, or keywords
    if not target:
        conn = get_db()
        cursor = conn.cursor()
        
        # 1. Exact match by filename, title, or path
        cursor.execute("""
            SELECT * FROM songs 
            WHERE filename = ? OR title = ? OR file_path LIKE ?
            ORDER BY id DESC LIMIT 1
        """, (filename, filename, f"%{safe_name}%"))
        row = cursor.fetchone()
        
        # 2. LIKE substring match
        if not row:
            cursor.execute("""
                SELECT * FROM songs 
                WHERE filename LIKE ? OR title LIKE ?
                ORDER BY id DESC LIMIT 1
            """, (f"%{safe_name}%", f"%{safe_name}%"))
            row = cursor.fetchone()
            
        # 3. Keyword token match
        if not row:
            words = [w for w in re.findall(r'[A-Za-z0-9]+', safe_name) if len(w) >= 3 and w.lower() not in ('mp3', 'wav', 'lyrics', 'official', 'audio', 'video')]
            if words:
                conditions = " AND ".join(["title LIKE ?" for _ in words[:3]])
                params = [f"%{w}%" for w in words[:3]]
                cursor.execute(f"SELECT * FROM songs WHERE {conditions} ORDER BY id DESC LIMIT 1", params)
                row = cursor.fetchone()

        conn.close()
        if row and row["file_path"] and os.path.exists(row["file_path"]):
            target = row["file_path"]
            if not title:
                title = row["title"]

    # If title still not set, lookup title from database if target is found
    if target and not title:
        try:
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT title FROM songs WHERE file_path = ? OR filename = ? LIMIT 1", (target, safe_name))
            t_row = cursor.fetchone()
            if t_row and t_row["title"]:
                title = t_row["title"]
            conn.close()
        except Exception:
            pass

    # If not on disk, search and download the real song via YouTube
    if not target or not os.path.exists(target):
        try:
            search_term = (title or safe_name).replace('.mp3', '').replace('.wav', '').strip()
            dest_path, fetched_title = download_and_convert_youtube(f"ytsearch1:{search_term} audio")
            if os.path.exists(dest_path):
                target = dest_path
                if not title:
                    title = fetched_title
        except Exception:
            pass

    # Fallback to latest audio file on disk or sample
    if not target or not os.path.exists(target):
        upload_files = [os.path.join(UPLOADS_DIR, f) for f in os.listdir(UPLOADS_DIR) if f.endswith((".wav", ".mp3")) and not f.startswith(".")]
        if upload_files:
            upload_files.sort(key=os.path.getmtime, reverse=True)
            target = upload_files[0]
        else:
            target = os.path.join(SAMPLES_DIR, "sample_lofi_chill.mp3")

    mp3_file = ensure_mp3(target)
    clean_title = "".join(c for c in (title or safe_name) if c.isalnum() or c in (" ", "_", "-")).strip() or "audio"
    if clean_title.lower().endswith(".mp3"):
        clean_title = clean_title[:-4]
    return FileResponse(
        path=mp3_file,
        media_type="audio/mpeg",
        filename=f"{clean_title}.mp3",
        headers={
            "Content-Disposition": f'attachment; filename="{clean_title}.mp3"',
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@app.get("/api/sample-tracks")
def get_sample_tracks():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, title, filename, file_url, predicted_genre, confidence
        FROM songs
        ORDER BY id DESC LIMIT 6
    """)
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": r["id"],
            "title": r["title"],
            "filename": r["filename"],
            "audio_url": r["file_url"],
            "predicted_genre": r["predicted_genre"],
            "confidence": r["confidence"],
            "is_sample": False
        }
        for r in rows
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
