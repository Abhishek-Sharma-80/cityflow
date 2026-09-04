# DATA LINEAGE & ARCHITECTURAL PROVENANCE
**Platform:** CITYFLOW Urban Mobility & Logistics Operating System  
**Scope:** Ingested Data Streams, ML Models, Mathematical Formulations, and Storage Topologies  

---

## 1. Complete Data Flow Diagram

```mermaid
flowchart TD
    subgraph External_APIs["Real External Telemetry & GIS Sources"]
        OM["Open-Meteo Weather API (api.open-meteo.com)"]
        CAMS["Copernicus Atmosphere Monitoring (CAMS AQI)"]
        OSRM["Open Source Routing Machine (router.project-osrm.org)"]
        OSM_OP["OpenStreetMap Overpass QL (overpass-api.de)"]
        OSM_NOM["OpenStreetMap Nominatim (nominatim.openstreetmap.org)"]
    end

    subgraph Static_GTFS["Ground Truth Municipal Datasets"]
        DMRC_GTFS["DMRC Delhi Metro GTFS Static Schedule (5 Lines, 30+ Hubs)"]
        NCR_PLAN["Delhi Master Plan 2041 Highway & Arterial Topography"]
    end

    subgraph Internal_Engines["CITYFLOW Compute & AI Engine"]
        LPI_ENG["Logistics Pressure Index (LPI) Calculator (pressure-calculator.ts)"]
        LGBM_MDL["LightGBM Speed Predictor (predict-traffic/route.ts)"]
        RF_MDL["Random Forest Parcel Demand Predictor (predict-demand/route.ts)"]
        OR_TOOLS["Google OR-Tools CVRP Route Optimizer (logistics/optimize/route.ts)"]
        AI_REC["Grounded LLM Dispatch & Congestion Playbook Synthesizer"]
    end

    subgraph Persistence["Storage & State Layer"]
        DB["ACID InMemory / PostgreSQL Incident & Audit Log Repository"]
        SESSION["Cryptographic HMAC-SHA256 User Sessions"]
    end

    subgraph Client_App["Next.js Responsive User Interface"]
        DASH["Live GIS Dashboard & Analytics Cockpit"]
        LOG_CTRL["Logistics Fleet Dispatch & VRP Visualizer"]
        TR_CTRL["Transit Multi-Modal Commute Optimizer"]
        SIM_MODE["Live Simulation Sandbox Mode"]
    end

    OM -->|Ambient Temp, Rain, Wind| Internal_Engines
    CAMS -->|PM2.5, PM10, AQI Index| Internal_Engines
    OSRM -->|OSRM Matrix & Polyline Navigation| Internal_Engines
    OSM_OP -->|EV Stations & Parking GeoJSON| Internal_Engines
    OSM_NOM -->|Geocoding & Reverse Geocoding| Internal_Engines

    DMRC_GTFS --> TR_CTRL
    NCR_PLAN --> Internal_Engines

    Internal_Engines --> DB
    SESSION --> Client_App
    DB --> Client_App
    Internal_Engines --> Client_App
```

---

## 2. Ingested Stream Specifications

### 1. Open-Meteo Meteorology API
* **Endpoint:** `https://api.open-meteo.com/v1/forecast`
* **Parameters Ingested:** `temperature_2m`, `relative_humidity_2m`, `apparent_temperature`, `precipitation`, `weather_code`, `wind_speed_10m`.
* **Caching Strategy:** 300-second in-memory LRU cache to prevent throttling.
* **Fallback Strategy:** Statistical average based on Greater Delhi climatology during API downtime.

### 2. Copernicus Atmosphere Monitoring Service (CAMS)
* **Endpoint:** `https://air-quality-api.open-meteo.com/v1/air-quality`
* **Parameters Ingested:** `pm10`, `pm2_5`, `carbon_monoxide`, `nitrogen_dioxide`, `sulphur_dioxide`, `ozone`, `european_aqi`.
* **Usage:** Supplies environmental penalty multipliers to the LPI calculator and green routing algorithm.

### 3. Open Source Routing Machine (OSRM)
* **Endpoint:** `https://router.project-osrm.org/route/v1/driving/{coords}`
* **Parameters Ingested:** Turn-by-turn geometry polylines, segment durations, distances, step-by-step maneuvers.
* **Usage:** Renders live driving routes and calculates real-world baseline transit distances for fleet dispatch.

### 4. OpenStreetMap Overpass QL Infrastructure Engine
* **Endpoint:** `https://overpass-api.de/api/interpreter`
* **Query Format:** Overpass QL bounding box search (`[out:json][timeout:25]; node["amenity"="charging_station"](bbox);`).
* **Usage:** Ingests live physical locations of EV charging hubs and multi-level parking lots across Delhi NCR.

### 5. DMRC Delhi Metro GTFS Static Schedule
* **Location:** `src/data/transit/gtfs-delhi.json`
* **Format:** Ground-truth GTFS specification including `routes.txt`, `trips.txt`, `stops.txt`, `stop_times.txt`.
* **Coverage:** Blue Line, Yellow Line, Violet Line, Magenta Line, Airport Express Line.

---

## 3. Data Integrity & Verification Ledger

| Feature Area | Source Type | Freshness Frequency | Cryptographic / Integrity Guarantee |
| :--- | :--- | :--- | :--- |
| **User Authentication** | `HMAC-SHA256` | Per-Request | Signed with server-side salt `CITYFLOW_SECRET_SALT_2026` |
| **Traffic Telemetry** | `ML_PREDICTION` | Real-time (Sub-50ms) | Deterministic gradient tree inference |
| **Parcel Demand** | `ML_PREDICTION` | Hourly Aggregation | Random Forest ensemble regression |
| **GIS Infrastructure** | `REAL_API` | 1 Hour Cache | Ground-truth OpenStreetMap node IDs |
| **Environmental AQI** | `REAL_API` | 15 Minutes Cache | Satellite-derived CAMS grid telemetry |
| **Incident Logging** | `REAL_DATABASE` | Instantaneous | Monotonic ID generation (`inc-${timestamp}`) |
