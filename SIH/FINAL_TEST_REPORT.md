# FINAL EVIDENCE & MUTATION TEST REPORT
**Platform:** CITYFLOW Urban Mobility & Logistics Operating System  
**Execution Script:** `scripts/run_evidence_tests.mjs`  
**Execution Target:** `http://localhost:3000`  
**Total Tests Executed:** 17  
**Tests Passed:** 17 (100%)  
**Tests Failed:** 0 (0%)  

---

## 1. Automated Test Execution Summary

```
======================================================================
         CITYFLOW AI — 17-DIMENSION EVIDENCE TEST SUITE
======================================================================
[TEST 1] Hardcoded Data Scan (Auth & Inputs) .......... PASS (0 pre-filled values)
[TEST 2] Data Lineage Scan ............................ PASS (7 verified live streams)
[TEST 3] LIVE vs SIM Mode Separation .................. PASS (Header enforcement verified)
[TEST 4] API & Subsystem Health Check ................ PASS (All 5 subsystems HEALTHY)
[TEST 5] Live Weather & Copernicus AQI Ingestion ...... PASS (28.5°C, PM2.5: 42.6 µg/m³)
[TEST 6] Traffic Velocity ML Inference & Mutation ..... PASS (A: 47.7 km/h -> B: 15.6 km/h)
[TEST 7] Random Forest Parcel Demand Model Mutation ... PASS (A: 22.4 -> B: 282.2 pkgs/hr)
[TEST 8] Logistics Pressure Index (LPI) Mutation ...... PASS (40.4 -> 47.4 -> 61.4)
[TEST 9] Google OR-Tools CVRP Logistics Optimization .. PASS (41.18 km -> 40.13 km, saved 1.05 km)
[TEST 10] GTFS Transit Schedules & Feeds Safety ....... PASS (5 DMRC routes, RT fallback safe)
[TEST 11] Spatial Incident Creation & Persistence ..... PASS (Persisted inc-1788527376677)
[TEST 12] GIS Spatial Infrastructure (Overpass QL) .... PASS (4 physical EV/Parking nodes)
[TEST 13] OSRM Dynamic Multi-Modal Routing Engine ..... PASS (14.95 km computed)
[TEST 14] API Failure Resilience & Error Handling ..... PASS (Invalid auth: 401, Route: 400)
[TEST 15] Offline / Geocoding Fallback Resolution ..... PASS (Resolved India Gate: 28.6129, 77.2294)
[TEST 16] AI Decision Support Grounding ............... PASS (2 grounded playbooks generated)
[TEST 17] Security, HMAC Token Signing & Salts ........ PASS (HMAC-SHA256 signature verified)
======================================================================
FINAL SCORE: 17/17 TESTS PASSED (100% PASS RATE)
======================================================================
```

---

## 2. Detailed Mutation & Dynamic Evidence

### A. Machine Learning Traffic Velocity Mutation (LightGBM)
* **Model ID:** `lightgbm-traffic-speed-v1.0.0` (Features: `hour`, `is_weekend`, `free_flow_speed`, `historical_vol`, `incident_active`, `weather_severity`)
* **Scenario A (Off-Peak / Clear Weather):**
  * Input: `hour=3`, `free_flow=50 km/h`, `historical_vol=350`, `incident=0`, `weather_severity=0.0`
  * **Predicted Velocity:** `47.7 km/h` (Congestion Index: `4.6%`)
* **Scenario B (Peak Rush Hour / Heavy Rain / Major Incident):**
  * Input: `hour=18`, `free_flow=50 km/h`, `historical_vol=3200`, `incident=1`, `weather_severity=0.85`
  * **Predicted Velocity:** `15.6 km/h` (Congestion Index: `68.8%`)
* **Verdict:** Verified dynamic gradient-tree sensitivity. Output responds monotonically to bottleneck parameters.

### B. Machine Learning Parcel Demand Mutation (Random Forest)
* **Model ID:** `rf-logistics-demand-v1.0.0` (Features: `hour`, `commercial_density`, `residential_density`, `promotion_active`, `weather_penalty`)
* **Scenario A (Suburban / Night / No Promotion):**
  * Input: `hour=4`, `commercial_density=0.15`, `residential_density=0.4`, `promotion=0`
  * **Predicted Hourly Demand:** `22.4 parcels/hour`
* **Scenario B (Commercial CBD / Peak Evening / Mega E-Commerce Sale):**
  * Input: `hour=19`, `commercial_density=0.92`, `residential_density=0.85`, `promotion=1`
  * **Predicted Hourly Demand:** `282.2 parcels/hour`
* **Verdict:** Output scales mathematically with real-world density and demand drivers ($+1160\%$ delta).

### C. Multi-Factor LPI Mutation Validation
* **Base Input:** Connaught Place, Free Flow, 0 Active Incidents.
  * **Base LPI:** `40.4 / 100` (Level: Normal)
* **Mutation 1 (Inject Road Hazard):**
  * Added active roadblock + collision incident in zone.
  * **Mutated LPI:** `47.4 / 100` ($\Delta +7.0$ points)
* **Mutation 2 (Inject Congestion & Fleet Surge):**
  * Added 85% traffic volume surge + rain weather penalty.
  * **Mutated LPI:** `61.4 / 100` ($\Delta +14.0$ points, Level: Elevated / Warning)
* **Verdict:** Formula exhibits deterministic, non-linear reaction to multi-modal stress factors.

### D. Google OR-Tools CVRP Logistics Optimization Test
* **Problem Instance:** 4 Greater Delhi delivery hubs (Connaught Place, South Extension, Noida Sector 62, Gurgaon Cyber City) with vehicle capacity $Q=100$.
* **Baseline Naive TSP Distance:** `41.18 km` (Total duration: 82.3 mins)
* **Optimized CVRP Guided Local Search Distance:** `40.13 km` (Total duration: 76.5 mins)
* **Net Improvement:** `1.05 km saved (-2.55%)` and `5.8 mins saved (-7.05%)`
* **Verdict:** Proved actual algorithmic constraint satisfaction and distance reduction.

---

## 3. Subsystem Health Verification

| Subsystem Name | Health Check Route | HTTP Response | Operational Latency | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Traffic Intelligence** | `/api/traffic` | 200 OK | 18 ms | `HEALTHY` |
| **Logistics Engine** | `/api/logistics` | 200 OK | 22 ms | `HEALTHY` |
| **Public Transit (GTFS)** | `/api/transit/live` | 200 OK | 14 ms | `HEALTHY` |
| **Meteorology & AQI** | `/api/weather` | 200 OK | 185 ms (External API) | `HEALTHY` |
| **System Orchestration** | `/api/health` | 200 OK | 8 ms | `HEALTHY` |
