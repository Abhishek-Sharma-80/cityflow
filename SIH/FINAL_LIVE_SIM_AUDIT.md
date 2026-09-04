# FINAL LIVE VS SIM MODE SEGREGATION AUDIT
**Platform:** CITYFLOW Urban Mobility & Logistics Operating System  
**Audit Scope:** Isolation of Live Telemetry from Simulation Sandboxes and Visual Tagging  
**Verdict:** **PASS**

---

## 1. Segregation Policy

To prevent synthetic test values from contaminating operational decision-making, CITYFLOW implements a strict dual-mode operational architecture:

```
+----------------------------------------------------------------------------------------------------+
| OPERATIONAL MODE | DATA SOURCES PERMITTED                          | VISUAL IDENTIFIERS            |
+------------------+-------------------------------------------------+-------------------------------+
| LIVE MODE        | REAL_API, REAL_DATABASE, REAL_DATASET,          | Emerald "LIVE" badge          |
|                  | CALCULATED_FROM_REAL_DATA,                      | Real timestamp display        |
|                  | ML_PREDICTION_FROM_REAL_DATA                    | No synthetic injections       |
+------------------+-------------------------------------------------+-------------------------------+
| SIMULATION MODE  | Sandbox sliders, synthetic stress tests,        | Amber "SIMULATION MODE" banner|
|                  | custom incident injection, hypothetical floods  | Explicit simulation watermark  |
+------------------+-------------------------------------------------+-------------------------------+
```

---

## 2. Visual Flagging & UI Guarantees

1. **Simulation Banner (`src/components/SimulationBanner.tsx`):**
   When the user toggles into Simulation Mode, a full-width high-visibility amber warning banner is rendered across the top of every screen:
   > *"SIMULATION SANDBOX ACTIVE — Operating on synthetic scenario parameters for stress testing."*

2. **Public Transit GPS Transparency:**
   Because Delhi DTC bus GPS feeds are currently restricted behind municipal authorization, the Transit interface (`src/components/modules/TransitModule.tsx`) explicitly states:
   - **GTFS Static Schedule:** Active
   - **Live Bus GPS Tracking:** `Unavailable from Source Feed`
   - **GTFS-RT Service Bulletins:** Active Schedule

3. **Landing Page Disclaimers:**
   Benchmark numbers displayed on the landing page (e.g., *24% Congestion Reduction*) include an explicit footnote:
   > *"Illustrative prototype benchmarks based on simulated Greater Delhi peak hours."*

---

## 3. Mode Enforcement Verification

* **Header Propagation:** The selected mode is passed via the `x-system-mode` HTTP header to backend API routes.
* **Leakage Prevention:** Live API routes (`/api/weather`, `/api/traffic`, `/api/incidents`) do not return simulation data when `x-system-mode: live` is asserted.
