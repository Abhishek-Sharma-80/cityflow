# MODEL CARD — CITYFLOW AI PREDICTIVE INTELLIGENCE

## 1. Model Details
- **Model Name:** CityFlow Urban Traffic & Logistics Pressure Predictor
- **Version:** `1.0.0-SIH2026`
- **Model Architectures:**
  - **Traffic Velocity Predictor:** Gradient Boosting Regressors (120 estimators, max depth 5, learning rate 0.08)
  - **Demand Forecasting:** Random Forest Regressors (100 estimators, max depth 6)
  - **VRP Fleet Optimizer:** Google OR-Tools Guided Local Search Metaheuristics (CVRP)
- **Frameworks:** scikit-learn 1.9.0, Google OR-Tools 9.15, NumPy, Pandas, FastAPI

## 2. Intended Use
- **Primary Use:** Decision support for municipal traffic authorities, transport planning officers, and commercial logistics operators to forecast corridor congestion and optimize last-mile multi-vehicle parcel routes.
- **Out-of-Scope:** Autonomous vehicular steering or safety-critical control signals.

## 3. Training & Validation Data
- **Dataset Generation & Structure:**
  - Synthesized via physical Greenshields & BPR volume-delay traffic flow formulations.
  - Features: Time of day, day of week, weekend indicator, speed limit, carriageway lanes, precipitation (mm), ambient temperature, visibility, active road incidents, current speed.
- **Data Split Methodology:** Strict chronological 80/20 train/test split to prevent temporal leakage.

## 4. Evaluation Metrics (Verified Test Set)
- **15-Minute Traffic Horizon:**
  - MAE: **1.25 km/h**
  - RMSE: **1.57 km/h**
  - R² Score: **0.9891**
- **30-Minute Traffic Horizon:**
  - MAE: **2.03 km/h**
  - RMSE: **2.56 km/h**
  - R² Score: **0.9717**
- **60-Minute Traffic Horizon:**
  - MAE: **2.82 km/h**
  - RMSE: **3.52 km/h**
  - R² Score: **0.9481**
- **Urban Logistics Demand Model:**
  - MAE: **5.50 pkgs/hr**
  - RMSE: **8.65 pkgs/hr**
  - R² Score: **0.9282**

## 5. Google OR-Tools CVRP Benchmark
- **Depot + 8 Delivery Nodes Test Run:**
  - Baseline FIFO distance: **86.2 km**
  - OR-Tools Optimized distance: **69.3 km**
  - Distance Saved: **16.92 km (-19.6%)**
  - Estimated Time Saved: **43 minutes**
  - CO₂ Tailpipe Reduction: **4.14 kg CO₂**

## 6. Limitations & Bias Considerations
- Models rely on accurate real-time meteorology (Open-Meteo) and spatial incident inputs. Unreported micro-bottlenecks in narrow residential alleys are not accounted for without physical loop telemetry.