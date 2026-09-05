# 🔒 Security & Vulnerability Policy — CampusOS AI

**CampusOS AI** takes software security, data privacy, and cryptographic trust seriously. This document outlines our security architecture, threat model, implemented controls, and vulnerability disclosure policy for the SIH26044 Enterprise Platform.

---

## 🛡️ Supported Versions

Only active major releases of CampusOS AI receive active security patches.

| Version | Supported | Status |
| :--- | :---: | :--- |
| **v3.5.0 (SIH26044)** | ✅ | **Active Release & Full Security Maintenance** |
| **v3.0.0** | ✅ | Maintenance Mode |
| < v3.0.0 | ❌ | End of Life (EOL) |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability in CampusOS AI, please **do not open a public GitHub issue**.

### Reporting Process
1. Email your findings directly to **Rishi Sharma** at `i.rishisharma2007@gmail.com` or open a [Private Security Advisory](https://github.com/Rishisharma029/campusOS/security/advisories/new).
2. Include:
   - Description of the vulnerability and attack vector.
   - Proof of Concept (PoC) code or step-by-step reproduction guide.
   - Impact assessment (e.g. privilege escalation, XSS, token leakage, replay).
3. **Response Timeline**:
   - **Acknowledgement**: Within 24 hours.
   - **Triage & Severity Rating**: Within 48 hours.
   - **Patch Release**: High/Critical vulnerabilities will be patched within 48 to 72 hours.

---

## 🏰 Implemented Security Architecture (✅ Active in v3.5.0)

### 1. Authentication & Token Lifecycle
- **Memory-Only Access Tokens**: JWT access tokens are stored strictly in JavaScript module-level memory variables, neutralizing Cross-Site Scripting (XSS) extraction via `localStorage`.
- **Short-Lived Access Tokens**: Expire in **30 minutes**, drastically minimizing exposure windows.
- **Refresh Token Concurrency Queue**: 401 interceptor queues concurrent requests during token rotation to prevent race conditions.
- **Orphaned Auth Flag Auto-Purge**: Initialization validates that `auth_active` cannot persist without valid access/refresh tokens, breaking infinite redirect loops.
- **RFC 6238 TOTP Multi-Factor Authentication**: Backend TOTP verification engine with clock-drift checks.

### 2. Network & API Protection
- **Vite & Nginx Reverse-Proxy Isolation**: Browser requests route to relative paths (`/api/*` and `/health`), eliminating cross-origin security holes.
- **Strict CORS Policy**: Disallows wildcard origins with credentials; only explicit origins (`http://localhost:5173`, `http://127.0.0.1:5173`) are whitelisted.
- **Rate Limiting via SlowAPI**: Attached to sensitive routes:
  - `/api/v1/auth/login`: Maximum **5 requests/minute**
  - `/api/v1/auth/refresh`: Maximum **10 requests/minute**
- **Security Headers Middleware**: Enforces HSTS (1 year), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and restricted CSP directives.

### 3. Verifiable Credentials & Cryptographic Ledger (SIH26044)
- **Tamper-Evident SHA-256 Proof Hashes**: Every verified student claim (skill benchmark, certificate, internship, project, achievement) is issued an immutable proof hash (e.g., `0xCRT-...-GENOVA-PROOF`).
- **Audit Trail Inspector**: Dual-gate verification ensures claims cannot be forged client-side.

### 4. Database & ORM Security
- **SQL Injection Prevention**: 100% parameterized queries using SQLAlchemy 2.0 async ORM models.
- **Production Key Enforcement**: The server refuses to start if `SECRET_KEY` is set to the default insecure development marker or is shorter than 32 characters in production mode.

### 5. Role-Based Access Control (RBAC)
- Strict access matrix across roles (`Admin`, `Registrar`, `Accountant`, `Faculty`, `Student`).
- Dual-layer protection: `RoleRoute` components intercept unauthorized page views on the client, and FastAPI `PermissionChecker` dependencies reject unauthorized requests with HTTP `403 Forbidden` on the backend.
