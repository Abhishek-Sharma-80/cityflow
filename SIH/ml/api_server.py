import os
import json
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from optimization.vrp_solver import solve_cvrp

app = FastAPI(title="CityFlow AI - Machine Learning & Optimization Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained models
traffic_models = {}
for h in ['15m', '30m', '60m']:
    p = f'ml/models/traffic_model_{h}.joblib'
    if os.path.exists(p):
        traffic_models[h] = joblib.load(p)

demand_model = None
if os.path.exists('ml/models/demand_model.joblib'):
    demand_model = joblib.load('ml/models/demand_model.joblib')

class TrafficPredictionRequest(BaseModel):
    hour: int
    day_of_week: int
    is_weekend: int
    speed_limit: float = 50.0
    lanes: int = 2
    temperature: float = 28.0
    rain_mm: float = 0.0
    visibility_km: float = 8.0
    active_incidents: int = 0
    road_work_present: int = 0
    current_speed: float

class DemandPredictionRequest(BaseModel):
    hour: int
    day_of_week: int
    is_weekend: int
    zone_type: int = 0 # 0=Commercial, 1=Residential, 2=Industrial
    rain_mm: float = 0.0

class VRPRequest(BaseModel):
    depot: Dict[str, Any]
    stops: List[Dict[str, Any]]
    num_vehicles: int = 3
    vehicle_capacity: int = 100

@app.get("/health")
def health():
    return {
        "status": "HEALTHY",
        "models_loaded": {
            "traffic_15m": "15m" in traffic_models,
            "traffic_30m": "30m" in traffic_models,
            "traffic_60m": "60m" in traffic_models,
            "demand": demand_model is not None
        }
    }

@app.post("/predict/traffic")
def predict_traffic(req: TrafficPredictionRequest):
    row = np.array([[
        req.hour, req.day_of_week, req.is_weekend, req.speed_limit, req.lanes,
        req.temperature, req.rain_mm, req.visibility_km, req.active_incidents,
        req.road_work_present, req.current_speed
    ]])
    
    res = {}
    for h in ['15m', '30m', '60m']:
        if h in traffic_models:
            speed = float(traffic_models[h].predict(row)[0])
            congestion_ratio = max(0.0, min(1.0, 1.0 - (speed / req.speed_limit)))
            res[h] = {
                "predicted_speed_kmh": round(speed, 1),
                "congestion_index": round(congestion_ratio * 100, 1),
                "category": "SEVERE" if speed < 15 else "HEAVY" if speed < 25 else "MODERATE" if speed < 40 else "FREE_FLOW"
            }
        else:
            res[h] = None
            
    return {
        "current_speed_kmh": req.current_speed,
        "speed_limit_kmh": req.speed_limit,
        "predictions": res,
        "confidence_level": 0.95
    }

@app.post("/predict/demand")
def predict_demand(req: DemandPredictionRequest):
    if not demand_model:
        raise HTTPException(status_code=500, detail="Demand model not loaded")
        
    row = np.array([[req.hour, req.day_of_week, req.is_weekend, req.zone_type, req.rain_mm]])
    pred = float(demand_model.predict(row)[0])
    
    zone_names = {0: "Commercial District", 1: "Residential Zone", 2: "Industrial / Freight Area"}
    return {
        "hour": req.hour,
        "zone": zone_names.get(req.zone_type, "Unknown"),
        "predicted_demand_pkgs_per_hr": round(pred, 1),
        "uncertainty_interval": [round(max(0, pred - 8.65), 1), round(pred + 8.65, 1)],
        "demand_level": "PEAK" if pred > 120 else "HIGH" if pred > 70 else "NORMAL"
    }

@app.post("/optimize/vrp")
def optimize_vrp(req: VRPRequest):
    return solve_cvrp(req.depot, req.stops, req.num_vehicles, req.vehicle_capacity)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)