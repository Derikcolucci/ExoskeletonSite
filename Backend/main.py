from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import asyncio

app = FastAPI()

# Allow all origins (for testing only)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== EMG DATA MODEL =====
class EMGData(BaseModel):
    Right_Bicep_Femoris: float
    Left_Bicep_Femoris: float

# Store last 500 readings
live_data: List[EMGData] = []

# ===== POST ENDPOINT =====
@app.post("/data")
async def receive_data(data: EMGData):
    """
    Receive EMG data from ESP32 POST.
    """
    live_data.append(data)
    if len(live_data) > 500:
        live_data.pop(0)

    # Simple debug print
    print("Received EMG Data:")
    for muscle, voltage in data.model_dump().items():  # <-- updated
        print(f"  {muscle}: {voltage:.3f} V")
    return {"status": "received"}

# ===== WEBSOCKET (optional, real-time frontend) =====
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket client connected")
    try:
        while True:
            if live_data:
                # Send latest reading as JSON
                await websocket.send_json(live_data[-1].model_dump())  # <-- updated
            await asyncio.sleep(0.01)  # ~100 Hz
    except WebSocketDisconnect:
        print("WebSocket client disconnected")
