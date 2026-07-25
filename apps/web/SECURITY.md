# 🔒 Security & Vulnerability Policy

**CampusOS AI** takes software security seriously. This document outlines our security architecture, threat model, implemented controls, and vulnerability disclosure policy.

---

## 🛡️ Supported Versions

Only the latest major release of CampusOS AI receives active security updates.

| Version | Supported | Status |
| :--- | :---: | :--- |
| **v3.0.0** | ✅ | **Active Release & Security Maintenance** |
| < v3.0.0 | ❌ | End of Life (EOL) |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability in CampusOS AI, please **do not open a public GitHub issue**.

### Reporting Process
1. Email your findings directly to the security maintainers at `security@campusos.edu` or open a [Private Security Advisory](https://github.com/Rishisharma029/campusOS/security/advisories/new).
2. Include:
   - Description of the vulnerability and attack vector.
   - Proof of Concept (PoC) code or step-by-step reproduction guide.
   - Impact assessment (e.g. privilege escalation, XSS, token leakage).
3. **Response Timeline**:
   - **Acknowledgement**: Within 24 hours.
   - **Triage & Severity Rating**: Within 72 hours.
   - **Patch Release**: High/Critical vulnerabilities will be patched within 7 business days.

---

## 🏰 Implemented Security Architecture (✅ Verified in v3.0.0)

### 1. Role-Based Access Control (RBAC)
- Strict access matrix configured across 10 roles in `RoleContext.tsx`.
- Protected route wrappers (`RoleRoute`) intercept unauthorized direct navigation attempts and redirect to `/`.

### 2. Input Validation & Type Safety
- Form payload validation via `zod` schemas (`studentSchema`, `billingSchema`).
- Strict TypeScript compilation (`npx tsc --noEmit`) enforcing zero implicit `any` types.

### 3. XSS & Code Injection Mitigation
- React JSX automatic output encoding prevents DOM XSS.
- `multiAgentOrchestrator.ts` sanitizes raw user input in response fallbacks, stripping `<script>`, `<iframe>`, and HTML attributes.
- No use of `eval()` or `dangerouslySetInnerHTML` in application code.

### 4. Storage & State Resilience
- `JSON.parse` operations in `AuthContext.tsx` and `ThemeContext.tsx` are wrapped in `try/catch` handlers with self-healing clear logic to prevent storage corruption freezes.
- `useRealtime` and `useToast` hooks return safe default context fallbacks if invoked outside provider trees.

---

## 🚧 Planned Production Security Roadmap

The following security controls are specified for backend production deployment:

1. **HttpOnly Cookies**: Transition access and refresh tokens from browser `localStorage`/`sessionStorage` to `HttpOnly`, `SameSite=Strict`, `Secure` cookies.
2. **TOTP Multi-Factor Authentication**: RFC 6238 TOTP QR code enrollment and server-side secret validation.
3. **Backend Gemini API Proxy**: Host `GEMINI_API_KEY` on server environment variables with SSE streaming to hide keys from client bundles.
4. **Rate Limiting**: API gateway rate limiting (100 req/min per IP via Redis token bucket).
