# CITYFLOW AI — AUTHENTICATION & SECURITY AUDIT (PHASE 3)

## 1. Authentication Architecture
CityFlow AI implements a secure, stateless authentication and session management architecture adhering to zero-trust principles:

- **Password Cryptography:** Passwords are never stored in plaintext. They are salted with 128-bit cryptographic salts and hashed using HMAC-SHA256 / PBKDF2 before storage in the secure user repository.
- **Session Token Security:** Signed HMAC-SHA256 bearer tokens containing `userId`, `role`, and expiration timestamp (`expiresAt` = 24 hours).
- **Session Restoration:** Tokens are validated client-side and verified server-side on protected API routes.
- **Controlled SIH Demo Sandbox:** 1-Click SIH Judge Demo credentials load pre-seeded authorized profiles marked with `isDemo: true` without exposing raw secrets in client-side code.

---

## 2. Default Seeded Accounts (For SIH Presentation)

| Role | Account Email | Name | Department / Affiliation |
|---|---|---|---|
| **AUTHORITY** | `authority@cityflow.ai` | Dr. Rajesh Sharma | Delhi Traffic Police Command & SCATS Network |
| **LOGISTICS_OPERATOR** | `logistics@cityflow.ai` | Priya Menon | Last-Mile Distribution Fleet Management |
| **CITIZEN** | `citizen@cityflow.ai` | Amit Kumar | Registered Commuter & Civic Contributor |

---

## 3. Server-Side Authentication Endpoints

| Endpoint | Method | Auth Required? | Purpose |
|---|---|---|---|
| `/api/auth/login` | POST | Public | Validates email & password hash; returns signed session token. |
| `/api/auth/register` | POST | Public | Validates password complexity policy; registers new user. |
| `/api/auth/demo` | POST | Public | Initializes pre-configured judge demo session with role assignment. |
| `/api/auth/logout` | POST | Bearer Token | Invalides session and logs audit event. |
| `/api/auth/audit-logs` | GET | Authority Token | Returns chronological system audit logs (Authority only). |

---

## 4. Audit Logging Engine
All security-critical actions are recorded in the system audit repository:
- `LOGIN` & `LOGOUT` events
- `DEMO_ACCESS` invocations
- `REGISTER` user creations
- `REPORT_INCIDENT` hazard submissions
- `RUN_VRP_OPTIMIZER` fleet calculations
- `AUTHORITY_MITIGATION_TRIGGER` green-wave and diversion directives