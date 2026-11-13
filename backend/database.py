import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "melodymind.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_db()
    cursor = conn.cursor()

    # Playlists table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS playlists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        cover_color TEXT DEFAULT '#3B6E58',
        is_sample INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    )
    """)

    # Songs table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        filename TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_url TEXT NOT NULL,
        duration REAL DEFAULT 0.0,
        predicted_genre TEXT,
        confidence REAL DEFAULT 0.0,
        top_genres TEXT, -- JSON string of top 3 genres with probabilities
        audio_features TEXT, -- JSON string of extracted acoustic features
        is_sample INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    )
    """)

    # Playlist items (join table)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS playlist_songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playlist_id INTEGER NOT NULL,
        song_id INTEGER NOT NULL,
        added_at TEXT NOT NULL,
        FOREIGN KEY (playlist_id) REFERENCES playlists (id) ON DELETE CASCADE,
        FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE CASCADE
    )
    """)

    # Prediction history
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS prediction_history (
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

    conn.commit()

    # Seed sample playlists if empty
    cursor.execute("SELECT COUNT(*) as count FROM playlists")
    count = cursor.fetchone()["count"]
    if count == 0:
        now = datetime.utcnow().isoformat()
        cursor.execute("""
        INSERT INTO playlists (name, description, cover_color, is_sample, created_at)
        VALUES 
        ('Campus Study Chill', 'Curated acoustic & ambient tracks for late-night college study sessions.', '#3B6E58', 1, ?),
        ('Minor Project Demo Reel', 'GTZAN demonstration tracks across diverse musical spectrums.', '#B45339', 1, ?),
        ('High Energy Rhythms', 'Fast-paced rock, metal, and electronic beats for active listening.', '#4A5560', 1, ?)
        """, (now, now, now))
        conn.commit()

    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at", DB_PATH)
