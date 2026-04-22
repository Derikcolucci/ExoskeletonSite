from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import asyncio
import threading
import serial
import json
import time

from services.activity_classifier import classify_activity

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# SERIAL CONFIG
# =========================
SERIAL_PORT = "COM5"
BAUD_RATE = 115200

ser = None

# =========================
# DATA MODEL
# =========================
class EMGPacket(BaseModel):
    timestamp: Optional[float]
    emg: List[float]
    encoders: Dict[str, float]

# =========================
# LIVE STORAGE
# =========================
live_data = []
current_activity = "idle"

# =========================
# FEATURE MAP
# =========================
MUSCLES = [
    "Left_Semitendinosus",
    "Right_Semitendinosus",
    "Left_Bicep_Femoris",
    "Right_Bicep_Femoris",
    "Left_Rectus_Femoris",
    "Right_Rectus_Femoris",
    "Left_Vastus_Lateralis",
    "Right_Vastus_Lateralis",
]

# =========================
# FEATURE ENGINEERING (CRITICAL FIX)
# =========================
def build_features(row: Dict, prev_row: Dict = None) -> Dict:
    """
    Converts raw packet into ML-ready features.
    """

    # --- base copy ---
    features = dict(row)

    # --- angle relationships ---
    features["knee_diff"] = row["left_knee_angle"] - row["right_knee_angle"]
    features["shank_diff"] = row["left_shank_angle"] - row["right_shank_angle"]

    # --- velocity (time-aware) ---
    if prev_row and "timestamp" in row and "timestamp" in prev_row:
        dt = max(row["timestamp"] - prev_row["timestamp"], 1e-3)

        features["left_knee_vel"] = (row["left_knee_angle"] - prev_row["left_knee_angle"]) / dt
        features["right_knee_vel"] = (row["right_knee_angle"] - prev_row["right_knee_angle"]) / dt

        features["left_shank_vel"] = (row["left_shank_angle"] - prev_row["left_shank_angle"]) / dt
        features["right_shank_vel"] = (row["right_shank_angle"] - prev_row["right_shank_angle"]) / dt
    else:
        features["left_knee_vel"] = 0.0
        features["right_knee_vel"] = 0.0
        features["left_shank_vel"] = 0.0
        features["right_shank_vel"] = 0.0

    # --- motion intensity ---
    features["knee_motion"] = abs(features["left_knee_vel"]) + abs(features["right_knee_vel"])
    features["shank_motion"] = abs(features["left_shank_vel"]) + abs(features["right_shank_vel"])

    return features


# =========================
# MAP FUNCTION
# =========================
def map_emg(packet: dict) -> Dict:
    row = {"timestamp": packet.get("timestamp", time.time())}

    # initialize EMG
    for m in MUSCLES:
        row[m] = 0.0

    emg = packet.get("emg", [])
    for i, val in enumerate(emg):
        if i < len(MUSCLES):
            row[MUSCLES[i]] = val

    enc = packet.get("encoders", {})

    row["left_knee_angle"] = enc.get("left_knee", 0.0)
    row["right_knee_angle"] = enc.get("right_knee", 0.0)
    row["left_shank_angle"] = enc.get("left_shank", 0.0)
    row["right_shank_angle"] = enc.get("right_shank", 0.0)

    return row


# =========================
# CORE PROCESSOR
# =========================
def process_packet(packet: dict):
    global current_activity

    raw_row = map_emg(packet)

    # get previous row for velocity
    prev_row = live_data[-1] if live_data else None

    # FEATURE ENGINEERING (FIX)
    feature_row = build_features(raw_row, prev_row)

    live_data.append(feature_row)

    if len(live_data) > 500:
        live_data.pop(0)

    # CLASSIFICATION (FIXED)
    current_activity = classify_activity(feature_row)

    print("Activity:", current_activity)


# =========================
# SERIAL THREAD
# =========================
def serial_reader():
    global ser

    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        time.sleep(2)
        print("[OK] Serial connected")
    except Exception as e:
        print("[ERROR] Serial failed:", e)
        return

    while True:
        try:
            line = ser.readline().decode(errors="ignore").strip()

            if not line:
                continue

            packet = json.loads(line)

            print("RAW:", packet)

            process_packet(packet)

        except json.JSONDecodeError:
            print("[BAD JSON]", line)

        except Exception as e:
            print("[SERIAL ERROR]", e)


# =========================
# POST STREAM (OPTIONAL)
# =========================
@app.post("/stream_data")
async def receive_stream(packet: EMGPacket):
    process_packet(packet.model_dump())
    return {"status": "received", "activity": current_activity}


# =========================
# WEBSOCKET STREAM
# =========================
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connected")

    try:
        while True:
            if live_data:
                output = live_data[-1].copy()
                output["current_activity"] = current_activity
                await websocket.send_json(output)

            await asyncio.sleep(0.01)

    except WebSocketDisconnect:
        print("WebSocket disconnected")


# =========================
# STARTUP
# =========================
@app.on_event("startup")
def start_serial():
    thread = threading.Thread(target=serial_reader, daemon=True)
    thread.start()
    print("[OK] Serial thread started")