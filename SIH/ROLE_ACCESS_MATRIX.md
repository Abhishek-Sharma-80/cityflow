# CITYFLOW AI — ROLE-BASED ACCESS CONTROL (RBAC) MATRIX

## 1. User Roles Overview
1. **CITIZEN:** General urban commuter seeking lowest-congestion routes, public transit schedules, and crowd-sourced hazard alerts.
2. **LOGISTICS_OPERATOR:** Commercial freight manager and fleet dispatcher optimizing multi-stop delivery routes and tracking logistics pressure.
3. **AUTHORITY:** Municipal transport commissioner and traffic police command officer monitoring citywide velocity, managing signals, and reviewing incidents.

---

## 2. Feature & Module Permission Matrix

| Module / Feature | CITIZEN | LOGISTICS_OPERATOR | AUTHORITY | Access Rationale |
|---|:---:|:---:|:---:|---|
| **Landing & Entry Flow** | ✅ Full | ✅ Full | ✅ Full | Public entry and authentication |
| **Citizen Dashboard** | ✅ Primary | ❌ | ❌ | Tailored commuter commute overview |
| **Logistics Dashboard** | ❌ | ✅ Primary | ❌ | Tailored delivery fleet operations |
| **Authority Command Center** | ❌ | ❌ | ✅ Primary | 4-Question civic operations center |
| **Live GIS Map (`Module B`)** | ✅ Full | ✅ Full | ✅ Full | Multi-layer city spatial map |
| **Smart Routing Planner (`Module C`)** | ✅ Full | ✅ Full | ✅ Full | Multi-modal OSRM routing |
| **Logistics VRP Optimizer (`Module F`)** | ❌ | ✅ Full | ✅ Full | Google OR-Tools CVRP solver |
| **Traffic ML Speed Studio (`Module D`)** | ❌ | ❌ | ✅ Full | 15m/30m/60m GBR velocity forecasts |
| **Demand Forecasting Model (`Module E`)** | ❌ | ✅ Full | ✅ Full | 24h order surge predictions |
| **Logistics Pressure Index (`Module G`)** | ❌ | ✅ Full | ✅ Full | Transparent LPI explainability |
| **Public Transit / GTFS (`Module H`)** | ✅ Full | ❌ | ✅ Full | Metro & bus schedules & headways |
| **Smart Parking & EV (`Module I`)** | ✅ Full | ✅ Full | ❌ | Parking & charging bay lookup |
| **Incident Reporting (`Module J`)** | ✅ Report & Upvote | ✅ Report & Upvote | ✅ Full Moderation | Authority can verify/resolve tickets |
| **Gemini AI Decision Hub (`Module L`)** | ❌ | ✅ View Insights | ✅ Full Diagnostics | Grounded operational AI query console |
| **Smart Real-Time Alerts (`Module M`)** | ✅ Commuter Alerts | ✅ Freight Alerts | ✅ All System Alerts | Anomaly alert subscriptions |
| **Impact & Benchmarks (`Module P`)** | ❌ | ✅ Full | ✅ Full | Experimental baseline vs optimized metrics |
| **Data Quality Center (`Module N`)** | ❌ | ❌ | ✅ Full | Data staleness & provenance matrix |
| **API Health Center (`Module O`)** | ❌ | ❌ | ✅ Full | Live ping health diagnostics |
| **System Audit Logs** | ❌ | ❌ | ✅ Full | Chronological security audit logs |

---

## 3. Server-Side Enforcement Rules
- Any unauthorized API request (such as a `CITIZEN` attempting to fetch `/api/auth/audit-logs` or execute authority moderation directives) returns an explicit `HTTP 403 Forbidden` response.