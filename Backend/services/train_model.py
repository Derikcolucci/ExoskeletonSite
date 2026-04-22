import pandas as pd
import joblib
import os
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# =========================
# PATH
# =========================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_PATH = os.path.join(BASE_DIR, "recordings", "exoskeleton_dataset.csv")
MODEL_OUTPUT = os.path.join(BASE_DIR, "models", "activity_model.pkl")

# =========================
# LOAD
# =========================
df = pd.read_csv(DATA_PATH)
df = df.sort_values("timestamp")

# =========================
# CLEAN
# =========================
for col in ["left_knee_angle", "right_knee_angle", "left_shank_angle", "right_shank_angle"]:
    df[col] = df[col].interpolate().bfill().ffill()

# =========================
# CORE FEATURES (KEEP IT SIMPLE NOW)
# =========================
df["knee_diff"] = df["left_knee_angle"] - df["right_knee_angle"]
df["shank_diff"] = df["left_shank_angle"] - df["right_shank_angle"]

# velocities
for col in ["left_knee_angle", "right_knee_angle", "left_shank_angle", "right_shank_angle"]:
    df[col + "_vel"] = df[col].diff().fillna(0)

# motion
df["knee_motion"] = df["left_knee_angle_vel"].abs() + df["right_knee_angle_vel"].abs()
df["shank_motion"] = df["left_shank_angle_vel"].abs() + df["right_shank_angle_vel"].abs()

# =========================
# CRITICAL BIOMECHANICAL FEATURES
# =========================

# squat indicator (symmetry + both knees low)
df["symmetry"] = abs(df["left_knee_angle"] - df["right_knee_angle"]) + \
                 abs(df["left_shank_angle"] - df["right_shank_angle"])

df["knee_min"] = df[["left_knee_angle", "right_knee_angle"]].min(axis=1)

# walking constraint helper
df["walking_violation"] = df["knee_min"] < 130

# dominance (lunge key signal)
df["knee_dominance"] = df["left_knee_angle"] - df["right_knee_angle"]
df["shank_dominance"] = df["left_shank_angle"] - df["right_shank_angle"]

# =========================
# FEATURE SET
# =========================
FEATURES = [
    "left_knee_angle",
    "right_knee_angle",
    "left_shank_angle",
    "right_shank_angle",

    "knee_diff",
    "shank_diff",

    "left_knee_angle_vel",
    "right_knee_angle_vel",
    "left_shank_angle_vel",
    "right_shank_angle_vel",

    "knee_motion",
    "shank_motion",

    "knee_dominance",
    "shank_dominance",

    "symmetry",
]

LABEL = "label"

df = df.dropna(subset=FEATURES + [LABEL])

X = df[FEATURES]
y = df[LABEL]

# =========================
# TRAIN
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(
    n_estimators=400,
    max_depth=14,
    min_samples_leaf=2,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# =========================
# EVAL
# =========================
pred = model.predict(X_test)

print(classification_report(y_test, pred))

# =========================
# SAVE
# =========================
os.makedirs(os.path.dirname(MODEL_OUTPUT), exist_ok=True)
joblib.dump(model, MODEL_OUTPUT)

print("Saved model to:", MODEL_OUTPUT)