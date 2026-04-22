from typing import Dict
import joblib
import os
import time
from collections import deque

# =========================
# PATH
# =========================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "activity_model.pkl")

model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print(f"[OK] Model loaded from {MODEL_PATH}")
else:
    print("[WARN] No model found")

# =========================
# STATE
# =========================
_last = {}
_motion_window = deque(maxlen=8)

_last_time = 0
_last_output = "idle"

PREDICTION_COOLDOWN = 0.2

# idle tracking
_last_idle_start = None
IDLE_TIME_SEC = 0.85

# temporal dominance (left/right lunge)
_dom_left = 0.0
_dom_right = 0.0

# =========================
# HELPERS
# =========================
def safe_div(a, b):
    return a / (b + 1e-6)

# =========================
# CLASSIFIER
# =========================
def classify_activity(row: Dict) -> str:
    global _last, _last_time, _last_output
    global _last_idle_start, _motion_window
    global _dom_left, _dom_right

    now = row.get("timestamp", time.time())

    # =========================
    # COOLDOWN
    # =========================
    if now - _last_time < PREDICTION_COOLDOWN:
        return _last_output

    # =========================
    # INPUT
    # =========================
    lk = row.get("left_knee_angle", 0.0)
    rk = row.get("right_knee_angle", 0.0)
    ls = row.get("left_shank_angle", 0.0)
    rs = row.get("right_shank_angle", 0.0)

    # =========================
    # VELOCITY
    # =========================
    lk_v = lk - _last.get("lk", lk)
    rk_v = rk - _last.get("rk", rk)
    ls_v = ls - _last.get("ls", ls)
    rs_v = rs - _last.get("rs", rs)

    def deadband(x, t=0.5):
        return 0.0 if abs(x) < t else x

    lk_v, rk_v = deadband(lk_v), deadband(rk_v)
    ls_v, rs_v = deadband(ls_v), deadband(rs_v)

    knee_motion = abs(lk_v) + abs(rk_v)
    shank_motion = abs(ls_v) + abs(rs_v)

    # =========================
    # FEATURES
    # =========================
    knee_diff = lk - rk
    shank_diff = ls - rs
    symmetry = abs(knee_diff) + abs(shank_diff)

    features = {
        "left_knee_angle": lk,
        "right_knee_angle": rk,
        "left_shank_angle": ls,
        "right_shank_angle": rs,

        "knee_diff": knee_diff,
        "shank_diff": shank_diff,

        "left_knee_angle_vel": lk_v,
        "right_knee_angle_vel": rk_v,
        "left_shank_angle_vel": ls_v,
        "right_shank_angle_vel": rs_v,

        "knee_motion": knee_motion,
        "shank_motion": shank_motion,

        "knee_dominance": knee_diff,
        "shank_dominance": shank_diff,

        "knee_shank_ratio_left": safe_div(lk, ls),
        "knee_shank_ratio_right": safe_div(rk, rs),

        "combined_motion": knee_motion + shank_motion,

        "symmetry": symmetry,
    }

    _last = {"lk": lk, "rk": rk, "ls": ls, "rs": rs}

    # =========================
    # MOTION WINDOW
    # =========================
    _motion_window.append(features["combined_motion"])

    motion_var = sum(
        abs(_motion_window[i] - _motion_window[i - 1])
        for i in range(1, len(_motion_window))
    ) if len(_motion_window) > 1 else 0

    # =========================
    # TEMPORAL LUNGE DIRECTION
    # =========================
    left_evidence = max(0, rk - lk) + max(0, rs - ls) * 0.5
    right_evidence = max(0, lk - rk) + max(0, ls - rs) * 0.5

    _dom_left = 0.9 * _dom_left + left_evidence
    _dom_right = 0.9 * _dom_right + right_evidence

    # =========================
    # RULES (PHYSICS FIRST)
    # =========================

    # SQUAT
    if lk < 120 and rk < 120 and symmetry < 15:
        pred = "squat"

    # WALKING (hard constraint)
    elif lk >= 130 and rk >= 130:
        pred = "walking"

    # LUNGE (directional)
    elif symmetry > 20 and min(lk, rk) < 130:
        if _dom_left > _dom_right:
            pred = "left_lunge"
        else:
            pred = "right_lunge"

    else:
        pred = "walking"

    # =========================
    # IDLE LOGIC (FIXED - NO LOCK)
    # =========================
    angle_change = abs(lk_v) + abs(rk_v) + abs(ls_v) + abs(rs_v)
    true_stillness = angle_change < 8 and motion_var < 10

    if true_stillness:
        if _last_idle_start is None:
            _last_idle_start = now
        elif now - _last_idle_start >= IDLE_TIME_SEC:
            pred = "idle"
    else:
        _last_idle_start = None

    # =========================
    # FORCE EXIT IDLE IF REAL MOTION EXISTS
    # =========================
    if (knee_motion + shank_motion) > 8:
        _last_idle_start = None

    # =========================
    # FINALIZE
    # =========================
    _last_time = now
    _last_output = pred

    return pred