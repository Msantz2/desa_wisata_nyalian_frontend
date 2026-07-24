# 06 - Security

## 1. Purpose

This document consolidates the security practices applied across the Admin Dashboard. While authentication (`03-authentication.md`), storage (`04-storage-strategy.md`), and deployment (`05-deployment.md`) each cover security concerns specific to their domain, this document defines the cross-cutting security requirements that apply to every module, route, and layer of the system. The decisions in this document are locked for v1 and must be implemented exactly as specified.

## 2. Threat Model Summary

Given the system's profile — a single administrator, filesystem-based content, and a publicly reachable Node.js server — the primary threats considered are:

- Unauthorized access to the Admin Dashboard or its API routes.
- Malicious or malformed input leading to data corruption or injection.
- Cross-site scripting (XSS) via unsanitized article HTML.
- Cross-site request forgery (CSRF) against the authenticated admin session.
- Path traversal or arbitrary file write/read via file upload or file-handling logic.
- Brute-force attacks against the login endpoint.
- Exposure of secrets (session signing key, credentials) through misconfiguration.
- Denial of service through oversized or malformed uploads.

## 3. Authentication

Full detail is defined in `03-authentication.md`; summarized here as part of the overall security posture:

- **Single administrator only.** No multi-admin support in v1.
- Credentials (`ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`) are stored in `.env`.
- Passwords are hashed with **bcrypt**.
- Authentication uses the **server-side session architecture** defined in `03-authentication.md`.
- The authentication cookie is `HttpOnly`, `Secure`, `SameSite=Lax`.
- **JWT is not used anywhere in the system.**

## 4. Login Protection

- Brute-force protection uses an **in-memory Map**. This is the official v1 rate-limiting implementation. Multi-instance rate limiting is explicitly out of scope for v1.
- The login endpoint enforces a maximum of **5 failed login attempts**, after which authentication is **locked for 15 minutes**.
- During the lock period, further login attempts are rejected immediately, regardless of whether correct credentials are supplied.
- Login failures return a **generic error message** at all times — the response never reveals whether the username or the password was incorrect, and never reveals whether an account exists (**no user enumeration**).
- Failed attempts and lockouts are logged per Section 12, excluding any submitted password value.

## 5. Input Validation

- **All API input is validated using Zod.**
- Validation is performed on **both client and server**. The client-side Zod validation provides immediate UX feedback; the server-side Zod validation is authoritative.
- **Client-side validation is never trusted alone.** Every write request is fully re-validated server-side regardless of what the client already checked, before any data reaches the storage layer (`04-storage-strategy.md`).
- Rejected input results in a structured `400`-class response identifying the invalid field(s), per `19-api-overview.md`, Section 6.2.

## 6. HTML Sanitization

- All article HTML content is sanitized server-side using **sanitize-html** before it is saved to `/content/articles.json`.
- Sanitization is applied immediately before persistence, regardless of what the rich text editor produced client-side (`13-article-editor.md`).
- Sanitization strips disallowed tags and attributes, permitting only the formatting elements the editor's toolbar exposes.
- Plain text fields (titles, excerpts, metadata) are rendered using React's default escaping and are never inserted via mechanisms that bypass escaping.

## 7. File Upload Security

- **Only images are accepted.** No other file type is permitted through any upload endpoint.
- **MIME type validation:** The declared `Content-Type` header is checked to ensure it matches an expected image type (e.g. `image/jpeg`, `image/png`, `image/webp`). However, this validation is **not sufficient by itself** and is never trusted without magic number verification.
- **Magic number validation:** Uploaded images are validated using **actual file content (magic number detection)**, not filename or declared MIME type alone. Validation is performed using the **file-type** package, which inspects the file's binary signature and confirms it matches a permitted image format. Accepted formats: JPEG, PNG, WebP. SVG is **explicitly rejected** due to the risk of embedded scripts. If a file passes MIME type checks but fails magic number validation, it is rejected.
- **Accepted files are processed using Sharp:** All accepted images are resized, compressed, and **converted to WebP** before being written to disk (`05-deployment.md`, Section 7). This processing also **strips EXIF metadata** (including GPS, camera model, timestamps, and other embedded data) as part of the WebP conversion pipeline, ensuring no unintended metadata is exposed in the final image files.
- **Filename sanitization:** Uploaded files are never persisted using the client-supplied filename. Filenames are generated server-side (e.g. `cover.webp`, `content-1.webp`), per `04-storage-strategy.md`, Section 9, preventing filename-based attacks and collisions.
- **Invalid or corrupted files are rejected outright,** with no partial file ever written to the media directory.

For detailed upload implementation and processing pipeline specifics, see `14-article-image.md`.

## 9. Image Upload Limits

- **Maximum upload file size: 2 MB.** Uploads exceeding this size are rejected before processing.
- **Maximum cover image dimensions: 1600×900.** Uploads exceeding this are resized down by Sharp as part of processing (`05-deployment.md`, Section 7).
- **No file overwrite:** Images are stored with system-generated, collision-safe filenames within designated module media directories. Existing files are never overwritten; if a filename collision is detected, the operation fails and an error is returned.
- Uploads are stored **only inside the designated media directory** (`/public/images/{module}/...`, per `04-storage-strategy.md`, Section 4) — no upload is ever written outside this structure.

## 10. Audit Logging

**Events that MUST be logged:**

The following security-relevant and audit events must be captured and logged to provide an auditable record of all administrative actions and security events:

- **Login** — successful authentication
- **Logout** — user initiates session termination
- **Failed login** — unsuccessful authentication attempt (username or password incorrect, or lockout triggered)
- **Publish** — article or content published to the public site
- **Unpublish** — article or content unpublished
- **Delete** — article or content deleted
- **Image upload** — image file successfully uploaded
- **Permission denied** — attempt to access a protected route without a valid session

**Minimum log fields for each event:**

Every logged event must include:

| Field | Description |
|---|---|
| `timestamp` | ISO 8601 UTC timestamp of the event |
| `actor` | The authenticated user performing the action (currently always "Admin" in v1, since single-admin only) |
| `action` | The action that occurred (e.g. `LOGIN`, `CREATE_ARTICLE`, `PUBLISH`, `DELETE`, `IMAGE_UPLOAD`, `PERMISSION_DENIED`) |
| `target` | The entity affected by the action, if applicable (e.g. article id, entity slug, or null for login/logout events) |
| `ip_address` | The source IP address from which the request originated |
| `result` | Whether the action succeeded or failed (`SUCCESS` or `FAILURE`); for failed logins, always `FAILURE` |

**Logging destination and handling:**

- Logs are written to **stdout** in structured format (e.g. JSON or space-separated fields).
- The hosting process manager (`05-deployment.md`) is responsible for capturing stdout and routing it to persistent storage or a logging service.
- **Passwords and secrets are never logged**, under any circumstance.
- Logs must be retained for audit purposes according to the hosting provider's retention policy.

## 11. Filesystem Security

- **Path traversal is prevented.** Any file path derived from an identifier is validated against an expected safe format before being used to construct a filesystem path.
- **Filenames are sanitized.** Uploaded files are never persisted using the client-supplied filename; filenames are generated server-side, per `04-storage-strategy.md`, Section 9.
- **Files are never overwritten outside the media directory.** All write operations are confirmed to resolve within the intended base directory (the module's designated media folder) before being executed.

## 12. HTTPS

- **HTTPS is mandatory in production.**
- HTTPS termination is **managed by the hosting provider or reverse proxy** (`05-deployment.md`, Section 9), not by the Node.js application itself.
- Cookie security (`Secure` attribute, per `03-authentication.md`) depends on this and is only effective when HTTPS is correctly enforced at the infrastructure level.

## 13. Security Headers

The application applies the following security headers in production:

| Header | Purpose |
|---|---|
| `Content-Security-Policy` | Restricts allowed sources for scripts, styles, images, and framing, reducing XSS impact |
| `X-Frame-Options` | Mitigates clickjacking against the Admin Dashboard |
| `X-Content-Type-Options` | Prevents MIME-type sniffing |
| `Referrer-Policy` | Limits referrer information leakage |

Security headers are implemented in the **Next.js configuration**.

## 14. Error Handling

- API routes return structured, minimal error responses (per `19-api-overview.md`, Section 6.2), never exposing internal implementation details in the response body.
- Detailed error information is logged server-side only, never returned in the HTTP response body in production.

## 15. Security Responsibilities by Layer

| Layer | Security Responsibility |
|---|---|
| Middleware | Session presence/validity check for all `/admin/*` routes |
| API Route Handlers | Session verification, login rate limiting (in-memory Map) |
| Validation Layer | Zod schema validation, server-side authoritative |
| Sanitization Layer | sanitize-html on all article content before persistence |
| Upload Layer | file-type magic-number detection, Sharp processing, size/dimension limits |
| Data Access Layer | Safe path construction, filename sanitization, atomic writes |
| Application Configuration | Security headers (Next.js configuration) |
| Deployment/Infrastructure | HTTPS termination, backups |

## 16. Out of Scope for v1

The following are explicitly not implemented in v1:

- **Role-based access control (RBAC).**
- **Multi-admin support.**
- **Two-factor authentication.**

## 17. Summary

Security in the Admin Dashboard is enforced as a cross-cutting concern: bcrypt-hashed, single-admin authentication using the server-side session architecture with an `HttpOnly`, `Secure`, `SameSite=Lax` cookie and no JWT; in-memory Map rate limiting on login with enumeration-safe error responses; Zod-based validation on both client and server; sanitize-html applied to all article content before persistence; strict image-only uploads validated by magic-number detection via the file-type package, processed through Sharp into size- and dimension-constrained WebP files, with EXIF metadata stripped and MIME type verification paired with magic number detection; comprehensive audit logging of all security events and administrative actions written to stdout and handled by the hosting process manager; path-traversal-safe filesystem handling; mandatory HTTPS; security headers implemented in Next.js configuration; and structured error responses without exposing internal details. RBAC, multi-admin, and two-factor authentication are explicitly deferred beyond v1.