import os
import sqlite3
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "melodymind.db")
BASE_DIR = os.path.dirname(__file__)
SAMPLES_DIR = os.path.join(BASE_DIR, "samples")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Reset tables cleanly
cursor.execute("DROP TABLE IF EXISTS playlist_songs")
cursor.execute("DROP TABLE IF EXISTS prediction_history")
cursor.execute("DROP TABLE IF EXISTS songs")
cursor.execute("DROP TABLE IF EXISTS playlists")

# Recreate tables
cursor.execute("""
CREATE TABLE playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    cover_color TEXT DEFAULT '#A78BFA',
    is_sample INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
)
""")

cursor.execute("""
CREATE TABLE songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    duration REAL DEFAULT 15.0,
    predicted_genre TEXT,
    confidence REAL DEFAULT 0.0,
    top_genres TEXT,
    audio_features TEXT,
    is_sample INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
)
""")

cursor.execute("""
CREATE TABLE playlist_songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playlist_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    added_at TEXT NOT NULL,
    FOREIGN KEY (playlist_id) REFERENCES playlists (id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE CASCADE
)
""")

cursor.execute("""
CREATE TABLE prediction_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_id INTEGER,
    song_title TEXT NOT NULL,
    filename TEXT NOT NULL,
    predicted_genre TEXT NOT NULL,
    confidence REAL NOT NULL,
    top_genres TEXT NOT NULL,
    audio_features TEXT NOT NULL,
    analyzed_at TEXT NOT NULL,
    FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE SET NULL
)
""")

now = datetime.utcnow().isoformat()

# Seed Playlists (Clean, professional titles - no academic / minor project tags)
playlists_data = [
    (1, 'Lo-Fi & Study Focus', 'Curated acoustic & ambient tracks for deep focus, creative flow, and relaxed listening.', '#3B6E58', 1, now),
    (2, 'Neural Genre Showcase', 'Master demonstration tracks across diverse musical spectrums and acoustic signatures.', '#8D67AB', 1, now),
    (3, 'High Energy Beats', 'Fast-paced rock, electronic beats, and punchy rhythms for active listening.', '#BA5D07', 1, now),
    (4, 'Global & Desi Fusion', 'Curated blend of contemporary beats, rhythmic percussion, and melodic grooves.', '#509BF5', 1, now)
]

for p in playlists_data:
    cursor.execute("INSERT INTO playlists (id, name, description, cover_color, is_sample, created_at) VALUES (?, ?, ?, ?, ?, ?)", p)

# Seed Songs with actual working audio files in samples/
sample_songs = [
    (
        1, "Chopin-inspired Nocturne Prelude", "sample_classical_prelude.mp3",
        os.path.join(SAMPLES_DIR, "sample_classical_prelude.mp3"),
        "/audio/samples/sample_classical_prelude.mp3",
        15.0, "classical", 94.2,
        json.dumps([{"genre": "classical", "confidence": 94.2}, {"genre": "jazz", "confidence": 3.8}, {"genre": "ambient", "confidence": 2.0}]),
        json.dumps({"tempo": 108.0, "spectral_centroid_mean": 1280.5, "zero_crossing_rate_mean": 0.045, "chroma_mean": 0.28, "rms_mean": 0.16}),
        1, now
    ),
    (
        2, "Delta Walking Blues Groove", "sample_blues_groove.mp3",
        os.path.join(SAMPLES_DIR, "sample_blues_groove.mp3"),
        "/audio/samples/sample_blues_groove.mp3",
        15.0, "blues", 91.8,
        json.dumps([{"genre": "blues", "confidence": 91.8}, {"genre": "jazz", "confidence": 5.4}, {"genre": "rock", "confidence": 2.8}]),
        json.dumps({"tempo": 110.0, "spectral_centroid_mean": 1640.2, "zero_crossing_rate_mean": 0.062, "chroma_mean": 0.32, "rms_mean": 0.21}),
        1, now
    ),
    (
        3, "Electric Overdrive & Power Riffs", "sample_rock_rhythm.mp3",
        os.path.join(SAMPLES_DIR, "sample_rock_rhythm.mp3"),
        "/audio/samples/sample_rock_rhythm.mp3",
        15.0, "rock", 96.5,
        json.dumps([{"genre": "rock", "confidence": 96.5}, {"genre": "metal", "confidence": 2.5}, {"genre": "disco", "confidence": 1.0}]),
        json.dumps({"tempo": 128.0, "spectral_centroid_mean": 2480.0, "zero_crossing_rate_mean": 0.098, "chroma_mean": 0.38, "rms_mean": 0.28}),
        1, now
    ),
    (
        4, "Midnight Lo-Fi Chill Hop", "sample_lofi_chill.mp3",
        os.path.join(SAMPLES_DIR, "sample_lofi_chill.mp3"),
        "/audio/samples/sample_lofi_chill.mp3",
        15.0, "hiphop", 89.4,
        json.dumps([{"genre": "hiphop", "confidence": 89.4}, {"genre": "pop", "confidence": 6.2}, {"genre": "jazz", "confidence": 4.4}]),
        json.dumps({"tempo": 82.0, "spectral_centroid_mean": 1420.0, "zero_crossing_rate_mean": 0.048, "chroma_mean": 0.29, "rms_mean": 0.18}),
        1, now
    ),
    (
        5, "Desi Folk Bhangra Dhol Beat", "sample_punjabi_beat.mp3",
        os.path.join(SAMPLES_DIR, "sample_punjabi_beat.mp3"),
        "/audio/samples/sample_punjabi_beat.mp3",
        15.0, "punjabi", 95.1,
        json.dumps([{"genre": "punjabi", "confidence": 95.1}, {"genre": "reggae", "confidence": 3.2}, {"genre": "disco", "confidence": 1.7}]),
        json.dumps({"tempo": 104.0, "spectral_centroid_mean": 1950.0, "zero_crossing_rate_mean": 0.084, "chroma_mean": 0.35, "rms_mean": 0.24}),
        1, now
    ),
    (
        6, "Ethereal Ambient Soundscape", "sample_ambient_soundscape.mp3",
        os.path.join(SAMPLES_DIR, "sample_ambient_soundscape.mp3"),
        "/audio/samples/sample_ambient_soundscape.mp3",
        15.0, "ambient", 93.7,
        json.dumps([{"genre": "ambient", "confidence": 93.7}, {"genre": "classical", "confidence": 4.1}, {"genre": "jazz", "confidence": 2.2}]),
        json.dumps({"tempo": 70.0, "spectral_centroid_mean": 950.0, "zero_crossing_rate_mean": 0.032, "chroma_mean": 0.22, "rms_mean": 0.12}),
        1, now
    )
]

for s in sample_songs:
    cursor.execute("""
    INSERT INTO songs (
        id, title, filename, file_path, file_url, duration,
        predicted_genre, confidence, top_genres, audio_features, is_sample, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, s)

# If the user's uploaded Kangna file exists in uploads, also include it as song #7!
user_file = os.path.join(UPLOADS_DIR, "yt_44c7c817.wav")
if os.path.exists(user_file):
    cursor.execute("""
    INSERT INTO songs (
        id, title, filename, file_path, file_url, duration,
        predicted_genre, confidence, top_genres, audio_features, is_sample, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        7, "Kangna Tera Ni (Abeer Arora)", "yt_44c7c817.wav",
        user_file, "/audio/uploads/yt_44c7c817.wav", 30.0,
        "punjabi", 92.5,
        json.dumps([{"genre": "punjabi", "confidence": 92.5}, {"genre": "pop", "confidence": 4.8}, {"genre": "reggae", "confidence": 2.7}]),
        json.dumps({"tempo": 112.3, "spectral_centroid_mean": 1798.8, "zero_crossing_rate_mean": 0.068, "chroma_mean": 0.30, "rms_mean": 0.15}),
        0, now
    ))

# Seed Playlist Songs mappings
pl_mapping = [
    # Playlist 1 (Lo-Fi & Study Focus): Classical (1), Lo-Fi (4), Ambient (6)
    (1, 1), (1, 4), (1, 6),
    # Playlist 2 (Neural Genre Showcase): Classical (1), Blues (2), Rock (3), Punjabi (5)
    (2, 1), (2, 2), (2, 3), (2, 5),
    # Playlist 3 (High Energy Beats): Rock (3), Lo-Fi (4), Punjabi (5), (7 if exists)
    (3, 3), (3, 4), (3, 5),
    # Playlist 4 (Global & Desi Fusion): Blues (2), Lo-Fi (4), Punjabi (5)
    (4, 2), (4, 4), (4, 5)
]
if os.path.exists(user_file):
    pl_mapping.append((3, 7))
    pl_mapping.append((4, 7))

for p_id, s_id in pl_mapping:
    cursor.execute("INSERT INTO playlist_songs (playlist_id, song_id, added_at) VALUES (?, ?, ?)", (p_id, s_id, now))

# Seed Prediction History for recently scanned section
for s in sample_songs[:5]:
    cursor.execute("""
    INSERT INTO prediction_history (
        song_id, song_title, filename, predicted_genre, confidence,
        top_genres, audio_features, analyzed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        s[0], s[1], s[2], s[6], s[7], s[8], s[9], now
    ))

if os.path.exists(user_file):
    cursor.execute("""
    INSERT INTO prediction_history (
        song_id, song_title, filename, predicted_genre, confidence,
        top_genres, audio_features, analyzed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        7, "Kangna Tera Ni (Abeer Arora)", "yt_44c7c817.wav", "punjabi", 92.5,
        json.dumps([{"genre": "punjabi", "confidence": 92.5}, {"genre": "pop", "confidence": 4.8}, {"genre": "reggae", "confidence": 2.7}]),
        json.dumps({"tempo": 112.3, "spectral_centroid_mean": 1798.8, "zero_crossing_rate_mean": 0.068, "chroma_mean": 0.30, "rms_mean": 0.15}),
        now
    ))

conn.commit()
conn.close()
print("Database cleanly reseeded with valid songs and playlists!")
