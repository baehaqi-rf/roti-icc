---
trigger: always_on, model_decision
description: Comprehensive security standards covering philosophy, implementation principles, and hardening requirements.
---

# 🔒 Security Standards

**"Security is not a gate; it is the path."**

## 1. Core Philosophy

1.  **Zero Trust:** Never trust user input, internal networks, or default configurations.
2.  **Deny by Default:** Explicitly grant permissions; assume no access otherwise.
3.  **Fail Securely:** Fail closed (deny access), not open (allow access or undefined state).
4.  **Defense in Depth:** Multiple layers of controls (WAF -> AuthN -> AuthZ -> Validation -> DB).

## 2. Implementation Principles

### Authentication & Authorization (AuthN/AuthZ)
*   **Passwords:** Hash with **Argon2id** (min cost 12) or Bcrypt. Never plaintext.
*   **Tokens:**
    *   *Access Tokens:* Short-lived (15-30 mins). HS256/RS256.
    *   *Refresh Tokens:* Long-lived (7-30 days), rotated on use, stored in `HttpOnly; Secure; SameSite=Strict` cookies.
*   **RBAC:** Map permissions to Roles. Check at both Route AND Resource levels.
*   **MFA:** Required for Admin and Sensitive operations.

### Input Validation
*   **Principle:** "All Input is Evil."
*   **Mechanism:** Use Schema Validation (Zod, Pydantic) at the system boundary (Controller).
*   **Strategy:** Parse, don't validate. If it doesn't match the type, reject it.
*   **Sanitization:** Strip dangerous tags (XSS) from rich text using libraries like DOMPurify.

### Cryptography & Secrets
*   **In Transit:** TLS 1.3 preferred. HSTS enabled.
*   **At Rest:** Encrypt PII and sensitive fields in the database.
*   **Secrets:** Never commit to Git. Use Environment Variables or Secret Managers (Vault/GSM).
*   **Rotation:** Rotate long-lived keys every 90 days.

## 3. Hardening Mandates

### Supply Chain
*   **Lockfiles:** Must commit `package-lock.json` / `go.sum`.
*   **Scanning:** CI must run `npm audit` / `trufflehog`. Fail on High/Critical.
*   **Pinning:** Pin GitHub Actions to SHA1, not tags.

### Headers (Prevent XSS/Clickjacking)
*   `Content-Security-Policy`: Default `self`. No `unsafe-inline`.
*   `Strict-Transport-Security` (HSTS): `max-age=63072000; includeSubDomains`.
*   `X-Content-Type-Options`: `nosniff`.
*   `X-Frame-Options`: `DENY`.

### Common Vulnerabilities (OWASP)
*   **SQL Injection:** Zero tolerance. Use ORM or Parameterized Queries.
*   **SSRF:** Validate all user-provided URLs. Block internal IP ranges (127.0.0.1, 169.254.x.x).
*   **IDOR:** Always verify that `current_user` owns the `requested_resource_id`.

## 4. Checklist
- [ ] Inputs validated with Zod/Pydantic
- [ ] Secrets loaded from Env/Vault (not hardcoded)
- [ ] Authz checks on every endpoint
- [ ] Rate limiting enabled on public routes
- [ ] Dependencies scanned and pinned
