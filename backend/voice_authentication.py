import numpy as np
import librosa, pickle, os
from datetime import datetime
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings("ignore")


class VoiceAuthenticator:
    def __init__(self, models_dir="voice_models"):
        self.models_dir = models_dir
        self.sample_rate = 16000
        self.duration = 5
        os.makedirs(self.models_dir, exist_ok=True)

    # --------------------------------------------------------
    # 🔍 Extract MFCC + deltas
    # --------------------------------------------------------
    def extract_features(self, audio_path):
        try:
            y, sr = librosa.load(audio_path, sr=self.sample_rate)
            if y is None or len(y) == 0:
                print("⚠ Empty audio.")
                return None
            mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            mfcc_d = librosa.feature.delta(mfcc)
            mfcc_dd = librosa.feature.delta(mfcc, order=2)
            feats = np.vstack([mfcc, mfcc_d, mfcc_dd]).T
            print(f"Extracted features shape: {feats.shape}")
            return feats
        except Exception as e:
            print("❌ Error extracting features:", e)
            return None

    # --------------------------------------------------------
    # 🧩 Register (train + save model)
    # --------------------------------------------------------
    def register_from_file(self, sid, path):
        try:
            feats = self.extract_features(path)
            if feats is None:
                return False

            scaler = StandardScaler()
            feats_scaled = scaler.fit_transform(feats)

            gmm = GaussianMixture(
                n_components=16, covariance_type="diag",
                max_iter=200, random_state=42
            )
            gmm.fit(feats_scaled)

            data = {
                "gmm": gmm,
                "scaler": scaler,
                "student_id": sid,
                "registration_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

            out_path = os.path.join(self.models_dir, f"{sid}_voice.pkl")
            with open(out_path, "wb") as f:
                pickle.dump(data, f)

            print(f"✅ Model saved for {sid} → {out_path}")
            return True

        except Exception as e:
            print("❌ Registration error:", e)
            return False

    # --------------------------------------------------------
    # ✅ Verify (compare score)
    # --------------------------------------------------------
    def verify_from_file(self, sid, path, threshold=-100):
        model_path = os.path.join(self.models_dir, f"{sid}_voice.pkl")
        if not os.path.exists(model_path):
            print(f"❌ No voice model found for {sid}")
            return False

        with open(model_path, "rb") as f:
            data = pickle.load(f)

        gmm = data["gmm"]
        scaler = data["scaler"]

        feats = self.extract_features(path)
        if feats is None:
            return False

        feats_scaled = scaler.transform(feats)
        score = gmm.score(feats_scaled)

        print(f"Verification Score: {score:.2f} | Threshold: {threshold}")
        return bool(score > threshold)
