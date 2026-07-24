# 07 - Environment Variables

## 1. Purpose

This document defines the environment variables required by the Admin Dashboard, their purpose, validation rules, and secret-handling requirements. It operationalizes the secrets management principles defined in `06-security.md` and supports the authentication design in `03-authentication.md` and the deployment process in `05-deployment.md`. The decisions in this document are locked for v1 and must be implemented exactly as specified.

## 2. Environment Variables

### 2.1 Required

| Variable | Purpose |
|---|---|
| `ADMIN_USERNAME` | The single administrator's login username, used by the authentication flow defined in `03-authentication.md`. |
| `ADMIN_PASSWORD_HASH` | The bcrypt hash of the administrator's password, used to verify login attempts. Never the plaintext password. |
| `SESSION_SECRET` | Cryptographically secure secret used to sign the server-side session ID cookie, per `03-authentication.md`, Section 7. Used only for server-side session signing. |
| `NEXT_PUBLIC_SITE_URL` | The canonical public base URL of the deployed site, used for constructing absolute URLs, revalidation targets, and SEO metadata (`16-article-seo.md`). Exposed to the client, as indicated by the `NEXT_PUBLIC_` prefix. |

No other environment variables are defined for v1.

## 3. Startup Validation

- All environment variables are validated **during application startup**, before the server begins accepting requests.
- Validation is implemented using **Zod**, in a dedicated module: `/lib/env.ts`.
- If any required variable is **missing or invalid**, the application **fails immediately** with a clear, descriptive startup error identifying which variable failed and why. The application must never start in a partially configured state.

## 4. Secrets

The following values are **secrets** and must **never be committed to Git**:

- `ADMIN_PASSWORD_HASH`
- `SESSION_SECRET`

Production values are **configured directly on the hosting platform**, not stored in a committed file. Local development uses `.env.local`, which is excluded from version control. Only a placeholder-only `.env.example` (Section 6) is committed to the repository.

## 5. SESSION_SECRET Requirements

- `SESSION_SECRET` is **required**.
- `SESSION_SECRET` must be generated using a **cryptographically secure random string**.
- **Minimum length: 32 characters.**
- `SESSION_SECRET` is used **only for server-side session signing**. **JWT is not used anywhere.**
- The value must be unique per environment (development and production must not share the same secret).
- Rotating `SESSION_SECRET` invalidates all existing sessions, requiring re-login — an acceptable and expected response to a suspected security incident (`03-authentication.md`, Section 11).

## 6. Production Rules

- **Production must use HTTPS.** The application assumes HTTPS is always in effect in production, consistent with `05-deployment.md`, Section 9, and `06-security.md`, Section 10.
- **Production must not use default secrets.** `SESSION_SECRET` and `ADMIN_PASSWORD_HASH` must be generated specifically for the production environment; development values must never be reused in production.
- **Production must not expose server-only variables to the client.** Only `NEXT_PUBLIC_SITE_URL` is available to client-side code. `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, and `SESSION_SECRET` remain server-only and are never referenced from client-side code or bundled into client JavaScript.
- **Production values are configured directly on the hosting platform.** Local development uses `.env.local`.

## 7. Example Configuration

An `.env.example` file is committed to the repository, containing only placeholders — never real values:

```
NEXT_PUBLIC_SITE_URL=https://example.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<bcrypt_hash>
SESSION_SECRET=<random_secret>
```

## 8. Summary

The Admin Dashboard requires four environment variables: `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, and `NEXT_PUBLIC_SITE_URL`. All variables are validated at startup using Zod, in a dedicated `/lib/env.ts` module, with the application failing immediately if any required variable is missing or invalid. `ADMIN_PASSWORD_HASH` and `SESSION_SECRET` are treated as secrets, kept out of Git entirely, configured directly on the hosting platform in production, and never exposed to the client.