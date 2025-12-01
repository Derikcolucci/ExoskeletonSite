from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import asyncio

app = FastAPI()

# Allow all origins for simplicity; restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class EMGData(BaseModel):
    voltage: float

# Store the last 500 readings
live_data: List[EMGData] = []

@app.post("/data")
async def receive_data(data: EMGData):
    """
    Receive EMG data from ESP32 via POST.
    """
    live_data.append(data)
    if len(live_data) > 500:
        live_data.pop(0)
    print(f"Received voltage: {data.voltage}")  # Logs for debugging
    return {"status": "received"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Send the latest EMG data to any connected frontend client in real time.
    """
    await websocket.accept()
    print("WebSocket client connected")
    try:
        while True:
            if live_data:
                # Send the latest reading
                await websocket.send_json({"voltage": live_data[-1].voltage})
            await asyncio.sleep(0.01)  # ~100 Hz
    except WebSocketDisconnect:
        print("WebSocket client disconnected")
