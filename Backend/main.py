from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import asyncio

app = FastAPI()

# Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== EMG DATA MODEL =====
class EMGPacket(BaseModel):
    timestamp: Optional[float]
    emg: List[float]           # EMG values from ESP32
    encoders: Dict[str, float] # "left_knee" and "right_knee"

# ===== LIVE DATA =====
live_data: List[Dict] = []

# Muscles we track
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

# ===== HELPERS =====
def map_emg(packet: EMGPacket) -> Dict:
    """
    Map raw EMG array to named muscles. 
    Assumes packet.emg = [LS, RS, LB, RB, LR, RR, LVL, RVL] if all channels sent.
    If only left leg sent, fill left muscles, leave right as 0.
    """
    row = {"timestamp": packet.timestamp or 0.0}
    # Initialize all muscles to 0
    for m in MUSCLES:
        row[m] = 0.0

    # Map incoming emg to muscles by length
    for i, val in enumerate(packet.emg):
        if i < len(MUSCLES):
            row[MUSCLES[i]] = val

    # Map encoder angles
    row["left_knee_angle"] = packet.encoders.get("left_knee", 0.0)
    row["right_knee_angle"] = packet.encoders.get("right_knee", 0.0)

    return row

# ===== ENDPOINTS =====
@app.post("/stream_data")
async def receive_stream(packet: EMGPacket):
    print("RAW DATA:", packet.model_dump())
    row = map_emg(packet)
    live_data.append(row)
    if len(live_data) > 500:
        live_data.pop(0)
    print("Parsed Data:")
    for k, v in row.items():
        print(f"  {k}: {v:.3f}")
    return {"status": "received"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket client connected")
    try:
        while True:
            if live_data:
                await websocket.send_json(live_data[-1])
            await asyncio.sleep(0.01)  # ~100 Hz
    except WebSocketDisconnect:
        print("WebSocket client disconnected")