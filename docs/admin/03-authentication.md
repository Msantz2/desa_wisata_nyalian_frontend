# 03 - Authentication

## 1. Purpose

This document defines the authentication mechanism for the Admin Dashboard: how the administrator logs in, how sessions are managed, how routes are protected, and how login attempts are secured against brute-force abuse.

It builds on the architecture defined in `02-admin-architecture.md`. The decisions in this document are locked for v1 and must be implemented exactly as specified.

## 2. Scope

Version 1 of the Admin Dashboard implements:

- **A single administrator account.** No self-registration, no multi-admin support, and no role system.
- Authentication exists solely to protect the `/admin` area and its API routes.

Multi-admin support and role-based access control are explicitly out of scope for v1.

## 3. Authentication Strategy

The Admin Dashboard uses **credential-based authentication (username + password) with server-side session management**, implemented via a signed session identifier stored in an HTTP-only cookie.

- The session itself is held server-side; the cookie carries only a signed session ID, not the session payload.
- No JWT is used anywhere in the authentication flow.
- HTTP-only, signed cookies prevent the session ID from being accessed via client-side JavaScript, mitigating XSS-based session theft.
- Fully compatible with Node.js hosting (`05-deployment.md`); no dependency on edge-only or stateless-only session storage.

## 4. Credential Storage

- The single administrator's credentials are defined entirely through environment variables (per `07-environment-variables.md`):
  - `ADMIN_USERNAME` — the administrator's login username.
  - `ADMIN_PASSWORD_HASH` — a bcrypt hash of the administrator's password.
- No user record is stored on disk and no user database or JSON user store exists in v1.
- The plaintext password is never stored anywhere. Only the bcrypt hash is persisted, and only within the environment configuration.

## 5. Password Hashing

- Passwords are hashed and verified using **bcrypt**.
- Hash generation happens once, during initial deployment setup (Section 9), and the resulting hash is placed into `ADMIN_PASSWORD_HASH`.
- Login verification compares the submitted password against `ADMIN_PASSWORD_HASH` using bcrypt's comparison function. The application never derives, stores, or logs the plaintext password at any point.

## 6. Authentication Flow

### 6.1 Login

1. The administrator submits credentials via the login form at `/admin/login`.
2. The request is sent to `POST /api/admin/login`.
3. The server:
   - Validates input format (non-empty username and password).
   - Checks the login endpoint's rate limit state for the requesting IP/account (Section 8).
   - Compares the submitted username against `ADMIN_USERNAME` and the submitted password against `ADMIN_PASSWORD_HASH` using bcrypt.
   - On success, creates a new server-side session record and sets a signed, HTTP-only, `Secure`, `SameSite=Strict` cookie containing only the session ID.
   - On failure, records a failed attempt (Section 8) and returns a generic error (Section 10) — never revealing whether the username or password was incorrect.
4. The Admin UI redirects the administrator to `/admin/dashboard`.

### 6.2 Session Validation

- Every request to an admin page or admin API route resolves the session ID from the cookie and looks up the corresponding server-side session record.
- If the session ID is missing, invalid, unsigned/tampered, or expired, the request is treated as unauthenticated: page routes redirect to `/admin/login`, and API routes return `401 Unauthorized`.
- Valid sessions resolve to the single administrator identity; there is no per-session role or permission lookup in v1.

### 6.3 Logout

1. The administrator triggers logout from the dashboard UI.
2. The corresponding API route immediately invalidates the server-side session record and clears the session cookie.
3. Once invalidated, the session ID cannot be reused — a subsequent request presenting the same (now-invalidated) session ID is treated as unauthenticated.
4. The Admin UI redirects to `/admin/login`.

### 6.4 Session Lifetime

- Sessions use a **sliding expiration** of **7 days**: each authenticated request extends the session's expiration by the same 7-day window, so an actively used session does not expire mid-work, while a dormant session expires 7 days after its last activity.
- Expired sessions are treated identically to missing sessions (Section 6.2).

## 7. Session Storage

- Session records are stored server-side, in-memory, within the single Node.js process (per `05-deployment.md`), keyed by the signed session ID.
- Each session record holds: session ID, creation timestamp, last-activity timestamp (for sliding expiration), and expiration timestamp.
- The `SESSION_SECRET` used to sign the session ID cookie is stored in an environment variable (per `07-environment-variables.md`) and is never committed to source control.

## 8. Login Rate Limiting

- Login attempts are rate-limited using an **in-memory rate limiter (Map)**, keyed by IP/account, suitable for the single-instance v1 deployment (`05-deployment.md`). Distributed rate limiting across multiple instances is out of scope for v1.
- The login endpoint enforces a rate limit of **5 failed attempts**, after which the account is placed under a **15-minute temporary lock**.
- During the lock period, further login attempts are rejected immediately, without re-checking the password, with a generic rate-limit error.
- The failed-attempt counter resets on a successful login or after the 15-minute lock period elapses.
- Failed login attempts and lockout events are logged per `06-security.md`, excluding any submitted password value.

## 9. Initial Admin Setup

There is no in-app account creation flow in v1. The single administrator account is provisioned through the following bootstrap process:

1. Generate the bcrypt hash of the chosen administrator password.
2. Store `ADMIN_USERNAME` in `.env`.
3. Store `ADMIN_PASSWORD_HASH` in `.env`.
4. Store `SESSION_SECRET` in `.env`.
5. Restart the application.

### 9.1 Lost Credentials

Password reset is not included in v1. If credentials are lost:

1. Generate a new bcrypt hash for the new password.
2. Replace `ADMIN_PASSWORD_HASH` in `.env`.
3. Restart the application.

## 10. Route Protection Strategy

Two layers of protection are applied consistently across the admin area:

1. **Middleware-level protection** — a Next.js Middleware checks for a valid session on all requests matching `/admin/*` (excluding `/admin/login`) and redirects unauthenticated requests to the login page before any page code executes.
2. **API-level protection** — every Route Handler under `/api/admin/*` (excluding `POST /api/admin/login`) independently verifies the session before performing any read or write operation.

Enforcing protection at both layers ensures that direct API calls bypassing the UI cannot circumvent authentication, and that no route can accidentally be left unprotected.

## 11. Security Considerations

- **Generic error messages** — login failures never reveal whether the username or the password was incorrect, and never reveal whether a rate limit is currently in effect due to the username specifically versus the source IP.
- **No sensitive data in the session cookie** — the cookie contains only a signed session ID; the administrator identity and any session metadata remain server-side.
- **Cookie attributes** — `HttpOnly`, `Secure`, and `SameSite=Strict`, consistent with `06-security.md`, Section 5.
- **Secret rotation** — `SESSION_SECRET` can be rotated at any time; doing so invalidates all existing sessions, which is an acceptable and expected response to a suspected security incident.
- **Transport security** — authentication only operates over HTTPS in production, per `05-deployment.md` and `06-security.md`.
- **No password reset feature** — since v1 has a single, manually provisioned administrator account, password changes are performed via the bootstrap process in Section 9.1, not through an in-app reset flow.
- **No client-side trust** — the client never determines authentication state for authorization purposes; it only reflects state returned by the server after validation.

## 12. Out of Scope for v1

The following are explicitly not implemented and must not be assumed by other documents in this set:

- Multiple administrator accounts.
- Role-based access control or permission granularity.
- In-app password reset or account recovery.
- JWT-based sessions.
- Any credential storage mechanism other than `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` environment variables.

## 13. Summary

The Admin Dashboard authenticates a single, manually provisioned administrator account using bcrypt-hashed credentials stored in environment variables. Successful login creates a server-side session referenced by a signed, HTTP-only cookie with a 7-day sliding expiration; logout invalidates the session immediately. The login endpoint is protected against brute-force attempts with a 5-attempt threshold and a 15-minute lockout. All admin pages and API routes are protected at both the middleware and API layers.