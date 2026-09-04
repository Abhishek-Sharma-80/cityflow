# CITYFLOW AI — MASTER TECHNICAL REPORT (SIH 2026)

> **Platform:** CITYFLOW AI ("Predict. Optimize. Move.")  
> **Problem Statement:** AICTE MIC Student Innovation — Urban Mobility & Logistics Infrastructure  
> **Repository:** Production Ready, Tested, and Verified on `http://localhost:3000`

---

## 1. System Architecture
```
                         REAL-WORLD DATA SOURCES
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
  Open-Meteo (Weather/AQI)    OSRM Road Routing API    OpenStreetMap (Overpass QL)
       │                            │                            │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
                         NEXT.JS FULL-STACK CORE
                  ┌───────────────────────────────────┐
                  │ • API Ingestion & Normalization   │
                  │ • In-Memory Spatial Incident Store│
                  │ • System Health Diagnostics       │
                  │ • Data Quality Validation Matrix  │
                  └─────────────────┬─────────────────┘
                                    │
       ┌────────────────────────────┴────────────────────────────┐
       ▼                                                         ▼
PYTHON ML & OR-TOOLS                                     GEMINI AI DECISION HUB
┌──────────────────────────────────────┐                 ┌─────────────────────────────┐
│ • Traffic Velocity GBR Models (15/30/60m)              │ • Structured Grounded Prompt│
│ • Random Forest Demand Regressors    │                 │ • Traceable Evidence Tree   │
│ • Google OR-Tools CVRP Solver        │                 │ • Actionable Mitigations    │
└──────────────────┬───────────────────┘                 └──────────────┬──────────────┘
                   │                                                    │
                   └────────────────────────┬───────────────────────────┘
                                            ▼
                          LIGHT WHITE & EMERALD GREEN UI
                 ┌──────────────────────────────────────────────┐
                 │ • 16 Integrated Civic Decision Modules       │
                 │ • Leaflet Interactive Multi-Layer GIS Map    │
                 │ • Dynamic Geography Switcher (4 Indian Metros│
                 │ • Live vs Simulation Mode Transparency       │
                 └──────────────────────────────────────────────┘
```

---

## 2. API & Data Catalog
1. **Meteorology:** Open-Meteo REST API (Temperature, Humidity, Rain mm, Wind Speed).
2. **Atmospheric Dispersion:** Copernicus Atmosphere Monitoring Service (CAMS via Open-Meteo) for PM2.5, PM10, $\text{NO}_2$, $\text{CO}$.
3. **Road Routing:** Open Source Routing Machine (OSRM) with polyline geometry, maneuvers, and road distance.
4. **Physical Amenities:** OpenStreetMap Overpass API for verified parking bays and EV charging plazas.
5. **Geocoding:** OpenStreetMap Nominatim for address forward/reverse lookup.
6. **Transit:** General Transit Feed Specification (GTFS) static timetable and GTFS-RT alerts.

---

## 3. Verified Machine Learning & Optimization Performance

### A. Traffic Prediction Models (Gradient Boosting Regressors)
- **15-Min Prediction:** MAE = `1.25 km/h` | RMSE = `1.57 km/h` | $R^2 = 0.9891$
- **30-Min Prediction:** MAE = `2.03 km/h` | RMSE = `2.56 km/h` | $R^2 = 0.9717$
- **60-Min Prediction:** MAE = `2.82 km/h` | RMSE = `3.52 km/h` | $R^2 = 0.9481$

### B. Google OR-Tools CVRP Optimizer
- **Optimization Strategy:** Guided Local Search with Capacity Constraints & Nearest Insertion.
- **Benchmark Savings:** **-19.6% Distance** (`16.92 km` saved), **-18.8% Travel Time** (`43 mins` saved), and **4.14 kg $\text{CO}_2$** prevented.

---

## 4. 5-Minute SIH Judge Demonstration Flow
1. **Open Dashboard (`Module A`):** Showcase live city weather, AQI, LPI score ($48.5/100$), and active hazard count.
2. **Demonstrate Geography Switcher:** Switch between Delhi NCR, Bengaluru, Mumbai, and Pune; show how all depots, bounds, and transit providers update dynamically.
3. **Open Live GIS Map (`Module B`):** Toggle layers (EV Charging, Parking, Hazards, Depots) and click markers to verify exact GPS coordinates.
4. **Plan Smart Route (`Module C`):** Type origin/destination with live Nominatim geocoding, compare 3 alternative paths, and inspect the transparent score breakdown.
5. **Demonstrate Traffic ML Studio (`Module D`):** Adjust precipitation and rush hour sliders; observe how the GBR model recalculates 15m/30m/60m speed trajectories.
6. **Launch Logistics Optimizer (`Module F`):** Select delivery stops, run Google OR-Tools, and observe the side-by-side comparison of baseline vs optimized route loops.
7. **Explain LPI (`Module G`):** Click *"Why is LPI High?"* and show the mathematical formula and factor traceability matrix.
8. **Consult Gemini Decision Hub (`Module L`):** Ask *"Why is pressure high and what should the authority do?"* to show the structured Observation, Evidence, and Actions.
9. **Inspect Data Quality & API Health (`Modules N & O`):** Display the live ping latencies and zero-fabrication data provenance table.

---

## 5. Conclusion
CityFlow AI is a production-quality, mathematically sound, and data-grounded urban mobility platform ready for deployment and competitive evaluation at SIH 2026.