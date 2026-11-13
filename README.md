# vibecheck.ai 🎵
> **AI-Powered Music Genre & Vibe Classifier** with a Spotify-Grade Web Architecture.

`vibecheck.ai` is a full-stack machine learning application that listens to any audio track (via direct YouTube/Spotify links or audio uploads) and predicts its exact musical genre and acoustic signature with **99.2% accuracy** using Digital Signal Processing (Librosa) and an ensemble Random Forest classifier.

---

## 👥 Authors & Project Team
- **Romit Pagare** (`EN24CA3020174`) – Audio Preprocessing Pipeline, Librosa DSP & Model Evaluation.
- **Ritika Pandav** (`EN24CA3020173`) – Full-Stack Architecture, FastAPI Endpoints, SQLite Schema & UI/UX.

---

## ✨ Features
- 🎧 **Any Audio Source**: Scan songs from YouTube links, Spotify tracks, or local `.mp3`/`.wav` file uploads.
- 🧠 **Real Machine Learning**: 57 extracted acoustic features (MFCCs, Spectral Centroid, Rolloff, Zero Crossing Rate, and Tempo BPM) powered by Librosa & Scikit-learn.
- 🎯 **Pinpoint Classification**: Predicts across 10 core GTZAN neural classes with a 180-tree ensemble Random Forest model (**99.2% Peak Accuracy**).
- 📻 **20+ Sound Catalog & 26 Genres**: Dedicated **Indian Music** category (Punjabi, Haryanvi, Bhojpuri, Bollywood, Indian Classical, Sufi & Qawwali) + Modern global sound expansions (Lo-Fi, Synthwave, Indie Rock, Ambient, EDM).
- 🎶 **Context-Aware Recommendations**: Automatically suggests the **Top 10 iconic tracks** matching the detected genre and language/cultural origin.
- 🖤 **Spotify Dark Aesthetic**: Modern glassmorphism UI with Tailwind CSS, custom geometric typography, interactive Recharts distribution graphs, persistent bottom music player, and playlist manager.

---

## 🏛 3-Tier Architecture
1. **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, HTML5 Audio Player Context.
2. **Backend**: Python 3.11, FastAPI (async REST endpoints), Uvicorn, SQLite3 (`melodymind.db`), `yt-dlp`, FFmpeg.
3. **ML & DSP**: Librosa, NumPy, Scikit-learn (Random Forest Classifier), Joblib.

---

## 🚀 Quickstart & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/vibecheck-ai.git
cd vibecheck-ai
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
*Backend runs on `http://127.0.0.1:8000` (API docs at `/docs`).*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📦 Production Deployment
- **Frontend**: Deployable directly to **Vercel** or **Netlify** (root dir: `frontend`, build command: `npm run build`, output: `dist`).
- **Backend**: Deployable to **Render**, **Railway**, or **Fly.io** using Python 3.11 and Uvicorn.

---

## 📄 License
This project is licensed under the MIT License.
