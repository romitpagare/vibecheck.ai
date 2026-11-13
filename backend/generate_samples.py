"""
Generates lightweight clean WAV sample audio tracks for offline testing and demoing:
1. Classical / Piano arpeggio
2. Jazz / Blues chord progression
3. Rock / Electronic synth rhythm
All saved into backend/samples/ as standard playable 16-bit WAV files.
"""

import os
import numpy as np
import soundfile as sf

SAMPLES_DIR = os.path.join(os.path.dirname(__file__), "samples")
os.makedirs(SAMPLES_DIR, exist_ok=True)

sr = 22050
duration = 8.0 # 8 seconds of clean musical audio
t = np.linspace(0, duration, int(sr * duration), endpoint=False)

def generate_samples():
    # 1. Classical Nocturne / Arpeggio (Soft sine waves with decay)
    # A minor chord arpeggios: A3 (220Hz), C4 (261.63Hz), E4 (329.63Hz), A4 (440Hz)
    notes = [220.0, 261.63, 329.63, 440.0, 329.63, 261.63]
    classical_sig = np.zeros_like(t)
    note_dur = 0.5
    for i, note in enumerate(notes * 3):
        start_idx = int(i * note_dur * sr)
        end_idx = min(start_idx + int(note_dur * 1.5 * sr), len(t))
        seg_len = end_idx - start_idx
        if seg_len > 0:
            env = np.exp(-3.0 * np.linspace(0, 1.5, seg_len))
            seg_t = np.linspace(0, 1.5, seg_len)
            tone = 0.4 * np.sin(2 * np.pi * note * seg_t) + 0.1 * np.sin(2 * np.pi * note * 2 * seg_t)
            classical_sig[start_idx:end_idx] += tone * env
    classical_sig = np.clip(classical_sig / (np.max(np.abs(classical_sig)) + 1e-6) * 0.7, -1.0, 1.0)
    sf.write(os.path.join(SAMPLES_DIR, "sample_classical_prelude.wav"), classical_sig, sr)

    # 2. Blues / Jazz walking bass & brassy harmonics
    blues_notes = [146.83, 164.81, 174.61, 196.00, 220.0, 196.00, 174.61, 164.81]
    blues_sig = np.zeros_like(t)
    beat_dur = 0.5
    for i, note in enumerate(blues_notes * 2):
        start_idx = int(i * beat_dur * sr)
        end_idx = min(start_idx + int(beat_dur * sr), len(t))
        seg_len = end_idx - start_idx
        if seg_len > 0:
            env = np.exp(-4.0 * np.linspace(0, 1.0, seg_len))
            seg_t = np.linspace(0, 1.0, seg_len)
            tone = 0.5 * np.sin(2 * np.pi * note * seg_t) + 0.25 * np.sin(2 * np.pi * note * 3 * seg_t)
            blues_sig[start_idx:end_idx] += tone * env
    blues_sig = np.clip(blues_sig / (np.max(np.abs(blues_sig)) + 1e-6) * 0.75, -1.0, 1.0)
    sf.write(os.path.join(SAMPLES_DIR, "sample_blues_groove.wav"), blues_sig, sr)

    # 3. High Energy Synth / Rock Pulse (Distorted square & punchy beat)
    rock_sig = np.zeros_like(t)
    bpm = 130
    beat_len = 60.0 / bpm
    total_beats = int(duration / beat_len)
    for b in range(total_beats):
        st = int(b * beat_len * sr)
        en = min(st + int(0.25 * sr), len(t))
        if en > st:
            pulse_t = np.linspace(0, 0.25, en - st)
            kick = np.sin(2 * np.pi * 65 * np.exp(-15 * pulse_t) * pulse_t)
            rock_sig[st:en] += kick * 0.8
    # Add energetic synth lead
    lead = 0.3 * np.sign(np.sin(2 * np.pi * 330 * t)) * (0.5 + 0.5 * np.sin(2 * np.pi * 4 * t))
    rock_sig = np.clip((rock_sig + lead) / 1.5, -1.0, 1.0)
    sf.write(os.path.join(SAMPLES_DIR, "sample_rock_rhythm.wav"), rock_sig, sr)

    print("Sample audio files generated in", SAMPLES_DIR)

if __name__ == "__main__":
    generate_samples()
