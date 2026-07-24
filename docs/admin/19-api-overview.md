# 19 - API Overview

## 1. Purpose

This document defines the general design conventions for the Admin Dashboard's internal API — the Route Handlers that every module, including Articles, is built on. It establishes a single, consistent API pattern so that `20-api-articles.md` (and any future module's API documentation) can focus on module-specific detail without redefining shared conventions.

This document operationalizes the API layer responsibilities defined in `02-admin-architecture.md`, Section 5.2.

## 2. API Style

The Admin Dashboard uses a **REST-style API** implemented via Next.js Route Handlers, scoped entirely to internal, authenticated admin use:

- **JSON request/response**, encoded in **UTF-8** — all requests and responses use `application/json`, except file upload endpoints, which accept `multipart/form-data` for the file portion of the request (Section 14).
- **Version prefix**: every admin API route is served under `/api/admin/`. There is no additional version segment (e.g. no `/api/v1/`) in v1, since the API is internal and evolves together with the single frontend that consumes it.
- **Not a public API** — every route under `/api/admin/` requires a valid authenticated session (Section 8), with the sole exception of `POST /api/admin/login`.

## 3. Route Structure Convention

Per the module contract defined in `02-admin-architecture.md`, Section 6, every module's API routes follow the same structure:

```
/api/admin/{module}              GET (list), POST (create)
/api/admin/{module}/[id]         GET (read one), PUT (update), DELETE
```

Additional module-specific sub-routes (e.g. an image upload endpoint) follow the same base path with an added segment, documented in that module's own API reference (e.g. `20-api-articles.md`).

This structure is identical across modules — a future Destinations module exposes `/api/admin/destinations` and `/api/admin/destinations/[id]` following exactly this same shape, requiring no new routing pattern to be designed.

## 4. HTTP Methods & Semantics

| Method | Purpose | Idempotent |
|---|---|---|
| `GET` | Retrieve a list or a single record; never causes side effects | Yes |
| `POST` | Create a new record, or trigger a dedicated action endpoint (e.g. login, publish, unpublish) | No |
| `PUT` | Fully update an existing record | Yes |
| `DELETE` | Remove an existing record | Yes |

- **`PATCH` is not used in v1.** Updates are always submitted as a complete record via `PUT`, keeping the update contract simple and consistent with how the editor forms submit full record state (per `13-article-editor.md`).
- **State changes use dedicated `POST` endpoints**, not the general `PUT` update endpoint — e.g. `POST /api/admin/articles/[id]/publish` and `POST /api/admin/articles/[id]/unpublish` (`20-api-articles.md`, Section 8), keeping explicit state transitions separate from routine field updates.

## 5. Request Format

- Every request is validated using **Zod** before any business logic executes; invalid input is rejected before the request reaches module service logic (Section 6).
- List endpoints accept query parameters for pagination, search, and sorting, using a consistent naming convention across modules:

| Parameter | Purpose |
|---|---|
| `page` | Page number (1-indexed) |
| `limit` | Number of records per page |
| `search` | Free-text search term, applied to module-defined searchable fields |
| `sort` | Field to sort by |
| `order` | Sort direction (`asc` or `desc`) |

## 6. Standard Response Format

Every endpoint uses the same two response shapes — no module or endpoint deviates from this structure.

### 6.1 Success Response

```json
{
  "success": true,
  "data": { /* single record, array of records, or action result */ }
}
```

List endpoints nest pagination metadata inside `data` (Section 9). Single-record endpoints (`GET /[id]`, `POST`, `PUT`) return the record directly under `data`. `DELETE` and dedicated action endpoints (e.g. publish/unpublish) return the relevant result (e.g. `{ "success": true, "data": { "deleted": true } }`).

### 6.2 Error Response

```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Human-readable summary",
  "errors": [
    { "field": "fieldName", "message": "Field-specific message" }
  ]
}
```

- `errors` is included only for validation-type failures (Section 7); other error types (authentication, not found, server error) omit it.
- This structure is used for **every endpoint**, with no per-module or per-endpoint variation, allowing shared frontend utilities (e.g. the Data Table component, `11-admin-components.md`, Section 3.2) to consume any module's API responses generically.

## 7. HTTP Status Codes & Error Codes

The API uses the following HTTP status codes consistently across every endpoint:

| HTTP Status | Meaning |
|---|---|
| 200 | OK — successful `GET`, `PUT`, `DELETE`, or action request |
| 201 | Created — successful `POST` creating a new record |
| 400 | Bad Request — malformed request (e.g. invalid JSON, missing required parameter) |
| 401 | Unauthorized — no valid session present |
| 403 | Forbidden — authenticated, but not permitted to perform this action (reserved for future role-based access, per `03-authentication.md`, Section 9) |
| 404 | Not Found — requested record does not exist |
| 409 | Conflict — e.g. slug uniqueness collision |
| 422 | Validation Error — request body failed Zod schema or business-rule validation |
| 500 | Internal Server Error — unexpected server-side failure; details are logged server-side only, per `06-security.md`, Section 13 |

Each status pairs with a matching `code` value in the error response body (Section 6.2):

| HTTP Status | `code` |
|---|---|
| 400 | `BAD_REQUEST` |
| 401 | `UNAUTHORIZED` |
| 403 | `FORBIDDEN` |
| 404 | `NOT_FOUND` |
| 409 | `CONFLICT` |
| 422 | `VALIDATION_ERROR` |
| 500 | `INTERNAL_ERROR` |

Every module reuses this same status/code mapping rather than inventing module-specific error codes for equivalent situations, keeping frontend error handling generic.

## 8. Authentication Enforcement

- **All admin endpoints require authentication, except `POST /api/admin/login`.**
- Authentication uses a **server-side session referenced by an HTTP-only cookie**, per `03-authentication.md`. **No JWT** is used anywhere in the API.
- Every Route Handler under `/api/admin/` (excluding `POST /api/admin/login`) begins with the shared session-verification step before any module-specific logic executes.
- This check is implemented as a shared, reusable utility applied uniformly across module route handlers, not reimplemented per module, ensuring no route can accidentally be left unprotected.
- CSRF and origin verification (per `06-security.md`, Section 5) are applied at this same shared layer for all state-changing methods.

## 9. Pagination

- List endpoints are paginated by default; there is no "return all records" mode exposed via the API, preventing unbounded response sizes as content volume grows.
- Default `limit` and maximum allowable `limit` are defined centrally (e.g. default 20, max 100) and enforced server-side regardless of what the client requests.
- List endpoint responses return the following inside `data` (per Section 6.1):

```json
{
  "success": true,
  "data": {
    "items": [ /* array of records */ ],
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

## 10. Revalidation Side Effects

- Certain write operations (e.g. publishing an article, per `15-article-publishing.md`, Section 6) trigger public-site revalidation as a side effect of an otherwise standard `PUT`/`POST` request.
- This side effect is handled within the module's service layer (`02-admin-architecture.md`, Section 5.4), not the shared API layer, since which routes trigger revalidation — and which public paths are affected — is module-specific knowledge.

## 11. Rate Limiting

- Rate limiting (per `06-security.md`, Section 4) is applied primarily to the login endpoint in v1.
- The shared API layer is designed to allow rate limiting to be extended to other sensitive or resource-intensive endpoints (e.g. upload endpoints) in the future without changing the underlying route structure.

## 12. Security

Consistent with `06-security.md`, the API layer never exposes the following in any response, log line, or error message returned to the client:

- Password hashes.
- The session-signing secret.
- Filesystem paths.
- Internal stack traces.

All user-facing error messages are sanitized before being returned (Section 6.2); detailed error information is logged server-side only, per `06-security.md`, Section 13.

## 13. File Upload

- Upload requests use `multipart/form-data`.
- Uploaded file type is validated using **file-type**, based on actual file content, not the declared MIME type or filename extension.
- Accepted images are processed using **Sharp** before being written to storage, per `14-article-image.md`, Sections 3 and 6.
- Invalid or rejected files are never passed to the storage layer.

## 14. Module API Contract Summary

Every module is expected to document its specific API surface (exact fields, module-specific sub-routes, and any deviations from these defaults) in its own dedicated API reference document, following the pattern established by `20-api-articles.md` for the Articles module. This overview document is the shared baseline all module API documentation builds upon.

## 15. Summary

The Admin Dashboard's internal API follows a consistent, REST-like pattern across all modules: uniform route structure, HTTP method semantics, request/response envelopes, error codes, pagination, and shared authentication/authorization enforcement. This consistency allows both the frontend's shared components and any future module's API implementation to follow one predictable contract rather than requiring bespoke handling per module.