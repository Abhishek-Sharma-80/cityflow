# SECURITY & DATA GOVERNANCE AUDIT — CITYFLOW AI

## 1. Security Architecture Overview
CityFlow AI enforces enterprise-grade security standards designed to protect civic mobility infrastructure telemetry, municipal traffic controls, and citizen incident reports.

---

## 2. Security Controls & Protections

### A. Environment Variables & Secret Protection
- **No Private Keys Exposed in Client Code:** Server-side API keys (`GEMINI_API_KEY`, database credentials, upstream tokens) are strictly stored in `.env.local` and accessed exclusively via Next.js backend API routes (`/api/...`).
- **Client-Side Safe Variables:** Only public configuration parameters (such as `NEXT_PUBLIC_APP_NAME` or map styling tokens) use the `NEXT_PUBLIC_` prefix.

### B. Input Validation & Sanitization
- **Geocoding & Coordinate Validation:** All spatial coordinates received by API endpoints (`/api/routing`, `/api/infrastructure`, `/api/incidents`) are strictly validated against numeric boundary ranges (`lat` within [-90, 90], `lng` within [-180, 180]).
- **Incident Text Sanitization:** User descriptions and titles are sanitized to prevent Cross-Site Scripting (XSS) and injection attacks.
- **VRP Payload Constraints:** Fleet sizes and stop counts are bounded ($N \le 100$) to prevent denial-of-service (DoS) via algorithmic complexity attacks on the solver.

### C. Upstream API Timeout & Error Handling
- **Non-Blocking Fetch Calls:** All external API requests (Open-Meteo, OSRM, Overpass) use explicit `AbortSignal.timeout(3000)` timeouts to prevent hung threads or connection pool exhaustion.
- **Graceful Degradation:** When upstream services fail, APIs return structured error payloads without exposing raw stack traces or internal server paths.

### D. CORS & Rate Limiting Strategy
- CORS headers restrict API access to authorized domains in production.
- Upstream requests (e.g. Open-Meteo, OSM Overpass) adhere strictly to fair-use rate limits and implement Next.js ISR/caching to prevent spamming public infrastructure.

---

## 3. Incident Data Governance & Privacy
- Citizen incident reports contain no Personally Identifiable Information (PII).
- Location markers are snapped to public road segments to protect residential privacy.