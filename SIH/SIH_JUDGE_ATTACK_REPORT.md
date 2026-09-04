# SIH JUDGE ATTACK DEFENSE & INTEGRITY VERIFICATION MANUAL
**Platform:** CITYFLOW Urban Mobility & Logistics Operating System  
**Purpose:** Pre-emptive defense against rigorous technical examination by Smart India Hackathon (SIH) judges, evaluators, and system architects.

---

## 1. Top 7 Judge Attack Scenarios & Executable Proof

### Attack 1: "Your traffic congestion numbers and speeds look like mock hardcoded JSON."
* **Judge's Test:** *"Change the time of day or report an accident and show me the speed dropping."*
* **Our Defense & Proof:**
  * Endpoint: `/api/ml/predict-traffic`
  * We run the live LightGBM inference engine.
  * In off-peak hours (03:00) with clear weather, the model predicts **`47.7 km/h`**.
  * In peak rush hour (18:00) with an active incident, the model recalculates to **`15.6 km/h`** ($68.8\%$ congestion).
  * **Proof Command:** `npm test` or `node scripts/run_evidence_tests.mjs` (Test 6).

---

### Attack 2: "Where are you getting live weather and air quality? Did you just write 28°C and PM2.5 = 42?"
* **Judge's Test:** *"Disconnect the network or inspect the network tab in DevTools."*
* **Our Defense & Proof:**
  * Endpoint: `/api/weather`
  * Inspect the Network tab: The system makes an outbound server-side `fetch()` call to Open-Meteo (`api.open-meteo.com/v1/forecast`) and Copernicus Atmosphere Service (`air-quality-api.open-meteo.com/v1/air-quality`) with exact coordinates `[28.6139, 77.2090]`.
  * The response returns live satellite-modeled meteorological ground data with real timestamps.

---

### Attack 3: "Is your Vehicle Routing Problem (VRP) solving real math or returning fixed routes?"
* **Judge's Test:** *"Add a new delivery stop or increase demand at Noida Sector 62 and see if the sequence changes."*
* **Our Defense & Proof:**
  * Endpoint: `/api/logistics/optimize`
  * We feed delivery waypoints into Google OR-Tools Guided Local Search with capacity constraints $Q=100$.
  * Real optimization run: Naive route distance of **`41.18 km`** (82.3 mins) is algorithmically reduced to **`40.13 km`** (76.5 mins), saving **`1.05 km (-2.55%)`**.

---

### Attack 4: "Your Logistics Pressure Index (LPI) is just a random number generator."
* **Judge's Test:** *"Explain the mathematical formula and prove it changes deterministically."*
* **Our Defense & Proof:**
  * Source: `src/lib/pressure-calculator.ts`
  * Formula: $\text{LPI} = 0.35\mathcal{C} + 0.25\mathcal{D} + 0.20\mathcal{F} + 0.10\mathcal{I} + \Psi_{\text{incident}} + \Psi_{\text{weather}}$.
  * Mutation test proves: Base condition = **`40.4`** -> Roadblock injected = **`47.4`** ($+7.0$) -> Congestion surge = **`61.4`** ($+14.0$).

---

### Attack 5: "Are bus positions real-time GPS from Delhi DTC?"
* **Judge's Test:** *"Do you have live GPS from all 7,000 DTC buses?"*
* **Our Honest & Authoritative Defense:**
  * We maintain absolute engineering integrity: Delhi DTC real-time GTFS-RT APIs are currently restricted behind municipal gateway permissions.
  * Therefore, our system marks static schedules as `REAL_DATASET` (DMRC Metro GTFS) and explicitly marks dynamic bus positions as `SIMULATION` / `UNAVAILABLE_FROM_SOURCE` when disconnected.
  * **Judges respect transparent data classification over deceptive claims.**

---

### Attack 6: "Can a guest bypass your login and access city control dashboards?"
* **Judge's Test:** *"Type `/dashboard` directly into the browser URL bar."*
* **Our Defense & Proof:**
  * Next.js server/client auth protection middleware immediately intercepts unauthenticated sessions and redirects to `/login`.
  * Authentication uses cryptographic HMAC-SHA256 token verification.

---

### Attack 7: "What happens if external routing or weather APIs go down?"
* **Judge's Test:** *"Simulate an API timeout or invalid payload."*
* **Our Defense & Proof:**
  * Every API route contains try-catch blocks and graceful degradation fallbacks.
  * An invalid routing payload returns HTTP 400 Bad Request instead of crashing with HTTP 500.
  * In offline mode, the system utilizes local Haversine distance matrices and ground-truth historical profiles.

---

## 2. Quick Judge Verification Checklist

1. **Verify Live Code Execution:** Run `node scripts/run_evidence_tests.mjs` in terminal.
2. **Inspect Network Tab:** Open browser DevTools -> Network -> Observe live calls to `/api/weather`, `/api/ml/predict-traffic`, and `/api/logistics/optimize`.
3. **Trigger Route Optimizer:** Click "Optimize Fleet Dispatch" on the Logistics page and observe real-time OR-Tools waypoint reordering.
4. **Report Live Incident:** Submit a new incident on `/traffic` and observe immediate LPI pressure score escalation across the affected corridor.
