import json
from typing import Dict

def parse_emg_data(raw_data: str) -> Dict[str, float]:
    """
    Convert raw JSON string from ESP32 to a dict with voltage.
    """
    try:
        data = json.loads(raw_data)
        voltage = float(data.get("voltage", 0.0))
        return {"voltage": voltage}
    except json.JSONDecodeError:
        return {"voltage": 0.0}
