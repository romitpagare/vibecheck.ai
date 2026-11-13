import os
import numpy as np
import librosa

# GTZAN 10 canonical genres
GTZAN_GENRES = [
    "blues",
    "classical",
    "country",
    "disco",
    "hiphop",
    "jazz",
    "metal",
    "pop",
    "reggae",
    "rock"
]

FEATURE_NAMES = [
    "chroma_stft_mean", "chroma_stft_var",
    "rms_mean", "rms_var",
    "spectral_centroid_mean", "spectral_centroid_var",
    "spectral_bandwidth_mean", "spectral_bandwidth_var",
    "rolloff_mean", "rolloff_var",
    "zero_crossing_rate_mean", "zero_crossing_rate_var",
    "harmony_mean", "harmony_var",
    "perceptr_mean", "perceptr_var",
    "tempo"
]
for i in range(1, 21):
    FEATURE_NAMES.extend([f"mfcc{i}_mean", f"mfcc{i}_var"])

def extract_audio_features(file_path: str, duration: float = 30.0, offset: float = 0.0):
    """
    Extracts 57 standardized acoustic features matching GTZAN audio representation:
    - Chroma STFT (mean, var)
    - RMS Energy (mean, var)
    - Spectral Centroid (mean, var)
    - Spectral Bandwidth (mean, var)
    - Spectral Rolloff (mean, var)
    - Zero Crossing Rate (mean, var)
    - Harmony & Perceptual Components (mean, var)
    - Tempo (BPM)
    - 20 MFCCs (mean, var for each)
    """
    try:
        y, sr = librosa.load(file_path, duration=duration, offset=offset, sr=22050, mono=True)
    except Exception as e:
        raise ValueError(f"Failed to decode audio file {file_path}: {str(e)}")

    if len(y) < sr * 1.0:
        raise ValueError("Audio segment is too short for reliable feature extraction (must be at least 1 second).")

    # 1. Chroma STFT
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    chroma_mean = float(np.mean(chroma))
    chroma_var = float(np.var(chroma))

    # 2. RMS Energy
    rms = librosa.feature.rms(y=y)
    rms_mean = float(np.mean(rms))
    rms_var = float(np.var(rms))

    # 3. Spectral Centroid
    cent = librosa.feature.spectral_centroid(y=y, sr=sr)
    cent_mean = float(np.mean(cent))
    cent_var = float(np.var(cent))

    # 4. Spectral Bandwidth
    spec_bw = librosa.feature.spectral_bandwidth(y=y, sr=sr)
    spec_bw_mean = float(np.mean(spec_bw))
    spec_bw_var = float(np.var(spec_bw))

    # 5. Spectral Rolloff
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    rolloff_mean = float(np.mean(rolloff))
    rolloff_var = float(np.var(rolloff))

    # 6. Zero Crossing Rate
    zcr = librosa.feature.zero_crossing_rate(y)
    zcr_mean = float(np.mean(zcr))
    zcr_var = float(np.var(zcr))

    # 7. Harmonic and Percussive components
    y_harm, y_perc = librosa.effects.hpss(y)
    harm_mean = float(np.mean(y_harm))
    harm_var = float(np.var(y_harm))
    perc_mean = float(np.mean(y_perc))
    perc_var = float(np.var(y_perc))

    # 8. Tempo
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    tempo_val = librosa.feature.tempo(onset_envelope=onset_env, sr=sr)
    tempo = float(tempo_val[0]) if hasattr(tempo_val, '__len__') else float(tempo_val)

    # 9. 20 MFCCs
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
    mfcc_feats = []
    for i in range(20):
        mfcc_feats.append(float(np.mean(mfcc[i])))
        mfcc_feats.append(float(np.var(mfcc[i])))

    vector = [
        chroma_mean, chroma_var,
        rms_mean, rms_var,
        cent_mean, cent_var,
        spec_bw_mean, spec_bw_var,
        rolloff_mean, rolloff_var,
        zcr_mean, zcr_var,
        harm_mean, harm_var,
        perc_mean, perc_var,
        tempo
    ] + mfcc_feats

    feature_dict = {
        "chroma_mean": chroma_mean,
        "rms_mean": rms_mean,
        "spectral_centroid_mean": cent_mean,
        "spectral_bandwidth_mean": spec_bw_mean,
        "spectral_rolloff_mean": rolloff_mean,
        "zero_crossing_rate_mean": zcr_mean,
        "tempo": round(tempo, 1)
    }

    return np.array(vector, dtype=np.float32), feature_dict
