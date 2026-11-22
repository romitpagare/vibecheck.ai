import os
import numpy as np
import soundfile as sf
import subprocess
import static_ffmpeg
static_ffmpeg.add_paths()

SAMPLES_DIR = os.path.join(os.path.dirname(__file__), "samples")
os.makedirs(SAMPLES_DIR, exist_ok=True)

sr = 22050
duration = 15.0 # 15 seconds of pleasant music
t = np.linspace(0, duration, int(sr * duration), endpoint=False)

def export_audio(filename_base, signal):
    # Normalize safely
    sig = signal / (np.max(np.abs(signal)) + 1e-6) * 0.8
    wav_path = os.path.join(SAMPLES_DIR, f"{filename_base}.wav")
    mp3_path = os.path.join(SAMPLES_DIR, f"{filename_base}.mp3")
    sf.write(wav_path, sig, sr)
    try:
        subprocess.run(["ffmpeg", "-y", "-i", wav_path, "-vn", "-ar", "44100", "-ac", "2", "-b:a", "192k", mp3_path], capture_output=True, check=True)
    except Exception as e:
        print("FFmpeg error:", e)
    print(f"Generated {filename_base}.wav and .mp3")

# 1. Classical Chopin-inspired Piano Nocturne (Am chord arpeggios with soft harmonics)
sig_classical = np.zeros_like(t)
chords = [
    [220.0, 261.63, 329.63, 440.0], # Am
    [174.61, 220.0, 261.63, 349.23], # F
    [196.0, 246.94, 293.66, 392.0],  # G
    [164.81, 207.65, 246.94, 329.63] # E
]
step_dur = 0.35
beat_idx = 0
for chord in chords * 3:
    for note in chord + [chord[2], chord[1]]:
        st = int(beat_idx * step_dur * sr)
        en = min(st + int(1.2 * sr), len(t))
        if en > st:
            seg_t = np.linspace(0, (en - st) / sr, en - st)
            env = np.exp(-3.5 * seg_t)
            piano = 0.6 * np.sin(2 * np.pi * note * seg_t) + 0.25 * np.sin(2 * np.pi * note * 2 * seg_t) + 0.1 * np.sin(2 * np.pi * note * 3 * seg_t)
            sig_classical[st:en] += piano * env
        beat_idx += 1
export_audio("sample_classical_prelude", sig_classical)

# 2. Delta Blues Groove (Swinging shuffle beat & walking bass)
sig_blues = np.zeros_like(t)
bpm = 110
beat = 60.0 / bpm
total_beats = int(duration / beat)
walking_notes = [110.0, 138.59, 146.83, 155.56, 164.81, 146.83, 138.59, 123.47]
for b in range(total_beats):
    st = int(b * beat * sr)
    en = min(st + int(beat * 1.2 * sr), len(t))
    if en > st:
        seg_t = np.linspace(0, (en - st) / sr, en - st)
        # bass note
        note = walking_notes[b % len(walking_notes)]
        bass = np.sin(2 * np.pi * note * seg_t) * np.exp(-3.0 * seg_t)
        # snare/hi-hat on offbeats
        drum = 0.0
        if b % 2 == 1:
            drum = np.random.normal(0, 0.15, en - st) * np.exp(-15.0 * seg_t)
        sig_blues[st:en] += bass * 0.7 + drum * 0.4
export_audio("sample_blues_groove", sig_blues)

# 3. High Energy Rock Rhythm (Driving kick, snare, punchy overdrive)
sig_rock = np.zeros_like(t)
rock_bpm = 128
r_beat = 60.0 / rock_bpm
r_beats = int(duration / r_beat)
for b in range(r_beats):
    st = int(b * r_beat * sr)
    en = min(st + int(r_beat * sr), len(t))
    if en > st:
        seg_t = np.linspace(0, (en - st) / sr, en - st)
        # Kick on 0, 2
        kick = 0.0
        if b % 2 == 0:
            kick = np.sin(2 * np.pi * 60 * np.exp(-18 * seg_t) * seg_t) * 0.8
        # Snare on 1, 3
        snare = 0.0
        if b % 2 == 1:
            snare = (np.sin(2 * np.pi * 180 * seg_t) * 0.3 + np.random.normal(0, 0.25, en - st)) * np.exp(-12 * seg_t)
        # Power chord buzz
        root = 110.0 if (b // 4) % 2 == 0 else 146.83
        guitar = np.tanh(1.5 * (np.sin(2 * np.pi * root * seg_t) + np.sin(2 * np.pi * root * 1.5 * seg_t))) * 0.4
        sig_rock[st:en] += kick + snare + guitar
export_audio("sample_rock_rhythm", sig_rock)

# 4. Lo-Fi Chill Beats (Warm 7th Rhodes chords & relaxing vinyl vibe)
sig_lofi = np.zeros_like(t)
lofi_bpm = 82
l_beat = 60.0 / lofi_bpm
l_beats = int(duration / l_beat)
# Fmaj7 -> Em7 -> Dm7 -> Cmaj7
rhodes_chords = [
    [174.61, 220.0, 261.63, 329.63],
    [164.81, 196.0, 246.94, 293.66],
    [146.83, 174.61, 220.0, 261.63],
    [130.81, 164.81, 196.0, 246.94]
]
for b in range(l_beats):
    st = int(b * l_beat * sr)
    en = min(st + int(l_beat * 1.8 * sr), len(t))
    if en > st:
        seg_t = np.linspace(0, (en - st) / sr, en - st)
        chord = rhodes_chords[(b // 2) % len(rhodes_chords)]
        chord_sig = sum(np.sin(2 * np.pi * f * seg_t) for f in chord) * 0.15 * np.exp(-1.5 * seg_t)
        # Soft lo-fi kick & rimshot
        kick = np.sin(2 * np.pi * 55 * np.exp(-12 * seg_t) * seg_t) * 0.5 if b % 2 == 0 else 0
        rim = np.random.normal(0, 0.08, en - st) * np.exp(-25 * seg_t) if b % 2 == 1 else 0
        sig_lofi[st:en] += chord_sig + kick + rim
sig_lofi += np.random.normal(0, 0.015, len(t)) # Gentle vinyl noise
export_audio("sample_lofi_chill", sig_lofi)

# 5. Punjabi Dhol Beat (Bhangra rhythmic groove with syncopated percussion)
sig_punjabi = np.zeros_like(t)
d_bpm = 104
d_beat = 60.0 / d_bpm
d_beats = int(duration / d_beat)
for b in range(d_beats):
    st = int(b * d_beat * sr)
    en = min(st + int(d_beat * sr), len(t))
    if en > st:
        seg_t = np.linspace(0, (en - st) / sr, en - st)
        # Deep bass 'dha' thump
        bass_dhol = np.sin(2 * np.pi * 75 * np.exp(-10 * seg_t) * seg_t) * 0.9 if b % 2 == 0 else 0
        # High treble 'tilli' slap with syncopation
        treble_dhol = np.sin(2 * np.pi * 420 * seg_t) * np.exp(-20 * seg_t) * 0.5
        sig_punjabi[st:en] += bass_dhol + treble_dhol
export_audio("sample_punjabi_beat", sig_punjabi)

# 6. Ambient Dream Soundscape (Ethereal sweeping harmonic pads)
sig_ambient = np.zeros_like(t)
pad_freqs = [130.81, 196.00, 261.63, 392.00, 523.25]
for freq in pad_freqs:
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.2 * t)
    sig_ambient += np.sin(2 * np.pi * freq * t) * lfo * 0.15
export_audio("sample_ambient_soundscape", sig_ambient)
