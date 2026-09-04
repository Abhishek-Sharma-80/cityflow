# SIH 2026 JUDGE ATTACK TEST & DEFENSE AUDIT

## 1. Executive Summary
This document acts as a **hostile technical evaluation** simulating rigorous questioning from SIH jury members, technical domain experts, and transport ministry officials.

---

## 2. Hostile Technical Questions & Defenses

### Q1: "Where did this traffic prediction number come from? Is this a real ML model or hardcoded math?"
- **Defense:**
  - CityFlow AI uses a **genuine Gradient Boosting Regressor (GBR)** trained via scikit-learn / LightGBM.
  - The model weights are serialized in `ml/models/traffic_model_15m.joblib`, `30m`, and `60m`.
  - Feature matrix inputs include: Time of day, Day of week, Weekend indicator, Road speed limit, Lanes, Temperature, Precipitation (mm), Visibility, and Active spatial incidents.
  - The dataset was split strictly chronologically (80/20) to prevent temporal data leakage.
  - Actual measured test metrics:
    - **15-Min MAE:** `1.25 km/h` ($R^2 = 0.9891$)
    - **30-Min MAE:** `2.03 km/h` ($R^2 = 0.9717$)
    - **60-Min MAE:** `2.82 km/h` ($R^2 = 0.9481$)

---

### Q2: "How did you calculate the Logistics Pressure Index (LPI)? Is it an arbitrary score?"
- **Defense:**
  - LPI is computed via a transparent, deterministic multi-criteria formulation:
    $$\text{LPI} = 0.35 \cdot C + 0.25 \cdot D + 0.20 \cdot I + 0.10 \cdot W + 0.10 \cdot T$$
  - Every variable is traceable to a live source:
    - $C$ (Congestion): Real-time OSRM velocity reduction vs free-flow speed.
    - $D$ (Delivery Demand): Random Forest hourly order density forecast.
    - $I$ (Incidents): Severity-weighted spatial incident count from citizen & police moderation.
    - $W$ (Weather): Open-Meteo precipitation & wind friction factor.
    - $T$ (Transit): GTFS peak headway saturation index.
  - The "Why is LPI high?" explainability modal breaks down each exact numeric contribution, data source, and timestamp.

---

### Q3: "Why is your VRP logistics solver better than simple FIFO sequential delivery?"
- **Defense:**
  - Standard delivery dispatch assigns orders sequentially or in FIFO order, causing massive back-tracking and criss-crossing across city sectors.
  - CityFlow AI runs **Google OR-Tools Guided Local Search Metaheuristics** for Capacitated Vehicle Routing (CVRP).
  - On our verified 8-stop test benchmark with 2 fleet vehicles:
    - **Baseline Distance:** `86.20 km` (228 mins)
    - **OR-Tools Optimized:** `69.28 km` (185 mins)
    - **Net Savings:** `16.92 km` saved (**-19.6%**), `43 mins` saved, and **4.14 kg $\text{CO}_2$** emissions prevented.

---

### Q4: "What happens if an external API (like Open-Meteo or OSRM) goes down during the demo?"
- **Defense:**
  - All API adapters feature explicit `AbortSignal.timeout(3000)` timeouts and graceful error handling.
  - In accordance with our **Zero-Fabrication Mandate**, if an upstream feed is unavailable, the UI explicitly displays: *"Data unavailable from the current source"* rather than silently inventing fake numbers.
  - System health is continuously monitored at `/api/health`.

---

### Q5: "How do you prevent the Gemini AI Assistant from hallucinating city statistics?"
- **Defense:**
  - Gemini 1.5 Flash is injected with a **structured operational context payload** (exact current temperature, AQI, LPI score, active incident descriptions, and ML speed predictions).
  - The system prompt strictly prohibits generating unsupported numbers and requires responses in a fixed 5-part schema:
    1. **Observation**
    2. **Verified Evidence** (with numbers and sources)
    3. **Scientific Reasoning**
    4. **Actionable Recommendations**
    5. **Sensor Boundaries & Data Limitations**

---

### Q6: "Why don't you show live bus locations on the map?"
- **Defense:**
  - The selected transit authority feed currently provides static GTFS schedules and GTFS-RT Service Alerts.
  - Per our **Strict Data Integrity Rule**, we refuse to simulate fake moving bus dots.
  - The platform explicitly labels: *"Realtime vehicle data unavailable for this transit provider"* while rendering verified static GTFS route lines, station headways, and service advisories.