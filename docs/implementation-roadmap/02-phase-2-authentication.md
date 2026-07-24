# Phase 2 — Authentication

> Part of the Nyalian Tourism Village Admin Dashboard — Implementation Roadmap.
> **Source of truth:** The 20 documents in `/docs/admin` (`01-admin-overview.md` through `20-api-articles.md`). Nothing in this document overrides them.
> This file is a reorganized excerpt of the original `implementation-roadmap.md` (Section 3, "Phase 2 — Authentication"). No technical content has been added, removed, or altered — only split into a standalone file, restructured per-task, and given organizational metadata, following the same format as the finalized `01-phase-1-foundation.md`.
> Cross-phase material (documentation notes, dependency graph, global implementation rules, development conventions, verification principles) lives in `00-overview-and-cross-phase-reference.md` and is referenced here, not repeated.

---

## Metadata

**Phase Name:** Phase 2 — Authentication

**Objective:** Implement the full credential-based, server-side session authentication system: login, logout, session storage, cookie handling, rate limiting, and enforcement at both the middleware and API layers.

**Dependencies:** Phase 1 (route/shell/middleware scaffold, env validation) — see `00-overview-and-cross-phase-reference.md` §4 for the full dependency graph.

**Related Architecture Documents:** `03-authentication.md` §2–12 · `05-deployment.md` §3–4 · `06-security.md` §3–4 · `10` (extension-point references) · `19-api-overview.md` §6, §8.

**Expected Deliverables:** See "Files to create" and "Files to modify" below.

**Verification Checklist:** See "Manual verification checklist" below.

**Completion Criteria:** See "Completion criteria" below.

---

## Phase Detail

**Expected result:** An admin can log in with `ADMIN_USERNAME`/the password matching `ADMIN_PASSWORD_HASH`, receive a signed HttpOnly session cookie, be redirected to `/admin/dashboard`, and have every other `/admin/*` route and every `/api/admin/*` route (except login) reject unauthenticated access. Logout invalidates the session immediately. 5 failed attempts trigger a 15-minute lock.

**Prerequisites:** Phase 1 complete (shell, login page UI, middleware scaffold, `/lib/env.ts`).

**Files to create:**
- `/lib/auth/session.ts`
- `/lib/auth/password.ts`
- `/lib/auth/rate-limit.ts`
- `/lib/auth/require-session.ts` (shared API-layer check)
- `/app/api/admin/login/route.ts`
- `/app/api/admin/logout/route.ts`

**Files to modify:**
- `middleware.ts` (complete the Phase 1 stub from Task 1.9)
- `/app/(admin)/admin/login/page.tsx` (wire submit handler)
- `/components/admin/header.tsx` (wire logout button)

**Things that must NOT be changed:**
- No JWT anywhere (`03` §3, §12; `06` §3; `19` §8) — session identifier only, resolved server-side.
- No user database/JSON user store — credentials remain solely `ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH` env vars (`03` §4, §12).
- No in-app registration or password reset flow (`03` §9.1, §12).
- No external session store (Redis, DB) — in-memory, single-process only (`03` §7; `05` §3–4).
- Login error messages must stay generic — never reveal whether username or password was wrong, and never reveal lockout cause specificity (`03` §11; `06` §4).

**Manual verification checklist:**
- [ ] Correct credentials → session cookie set, redirect to `/admin/dashboard`.
- [ ] Incorrect password → generic error, no field-specific hint.
- [ ] 5 consecutive failures → account locked for 15 minutes; further attempts rejected without checking the password.
- [ ] Logout clears the cookie and invalidates the session server-side (a reused cookie value is rejected afterward).
- [ ] Visiting any `/admin/*` route without a session redirects to `/admin/login`.
- [ ] Calling any `/api/admin/*` route without a session returns `401` with the standard error envelope.
- [ ] Session persists across requests for 7 days of activity (spot-check sliding expiration logic in code/tests, not by waiting 7 real days).

**Authentication Testing Checklist:**

✓ Login succeeds with correct credentials

✓ Login fails with incorrect password

✓ Login fails with unknown username

✓ Protected admin pages require authentication

✓ Public website remains fully accessible

✓ /api/admin routes require authentication

✓ Logout destroys the session

✓ Session cookie is removed after logout

✓ Expired session redirects to login

✓ Session persists correctly within the configured lifetime

**Possible risks:**
- `SameSite` attribute conflict (Documentation Note 2, `00-overview-and-cross-phase-reference.md` §3) — must be resolved with a human decision before Task 2.4 is coded, or the cookie may behave inconsistently with what `03` or `06` each assume elsewhere.
- In-memory session/rate-limit state resets on process restart — acceptable per `03`/`05`, but worth confirming the team understands this (e.g. a deploy logs everyone out).
- Timing attacks on login comparison — bcrypt's compare function is timing-safe for the hash comparison itself; ensure the username check doesn't short-circuit in a way that leaks timing differences.

**Completion criteria:** All Phase 2 tasks complete, checklist passes, and every route from Phase 1 is now genuinely protected (no more `// TODO Phase 2` markers).

---

## Tasks

Each task below is scoped to be implemented — and turned into a single implementation prompt — independently, in the order presented.

### Task 2.1 — Session management utility

**Objective:** Build an in-memory server-side session store with create/get/invalidate operations and sliding 7-day expiration. This task implements only the storage primitive — it does not implement cookie creation, password verification, or rate limiting (Tasks 2.2–2.4), and does not wire itself into middleware or any API route (Tasks 2.6–2.7); those belong to later tasks in this phase.

**Prerequisites:** Phase 2 prerequisites apply (Phase 1 complete). First task in Phase 2 — no dependency on another Phase 2 task.

**Related Architecture Documents:** `03-authentication.md` §6.2, §6.4, §7

**Files to create:**
- `/lib/auth/session.ts` — `createSession()`, `getSession(id)`, `invalidateSession(id)`, internal Map keyed by signed session ID, each record holding `id`, `createdAt`, `lastActivityAt`, `expiresAt`.

**Files to modify:** None.

**Expected Result:** Typed session store module, single administrator identity only (no role field needed beyond a constant).

**Verification Checklist:**
- [ ] Creating a session and reading it back returns the same record.
- [ ] `lastActivityAt` extends on access.
- [ ] Expired sessions return `null`/`undefined`.

**Completion Criteria:** Task 2.1 is complete when `/lib/auth/session.ts` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 2.2 — Password verification utility

**Objective:** Implement bcrypt-based comparison of a submitted password against `ADMIN_PASSWORD_HASH`. No hashing of new passwords at runtime — hash generation is a deployment-time bootstrap step (`03` §9), not application code. This task does not implement session creation, rate limiting, or the login route itself; those are Tasks 2.1, 2.3, and 2.4.

**Password handling rules (explicit — no implementation ambiguity):**
- Never store plaintext passwords.
- Never compare plaintext passwords directly.
- Always hash passwords using bcrypt.
- Always verify passwords using `bcrypt.compare()`.
- Password hashes are generated before deployment and stored according to the architecture documents.

**Prerequisites:** Phase 2 prerequisites apply (`ADMIN_PASSWORD_HASH` already validated by Phase 1 Task 1.2's `/lib/env.ts`). No dependency on another Phase 2 task.

**Related Architecture Documents:** `03-authentication.md` §5

**Files to create:**
- `/lib/auth/password.ts` — `verifyPassword(plain: string): Promise<boolean>`.

**Files to modify:** None.

**Expected Result:** Single utility function.

**Verification Checklist:**
- [ ] Correct password returns `true`.
- [ ] Incorrect password returns `false`.
- [ ] The function never logs the plaintext input.

**Completion Criteria:** Task 2.2 is complete when `/lib/auth/password.ts` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 2.3 — Login rate limiter

**Objective:** Build an in-memory Map-based rate limiter: 5 failed attempts → 15-minute lock, keyed by IP/account. This task implements only the rate-limiting primitive — it does not implement the login route that calls it (Task 2.4).

**Prerequisites:** Phase 2 prerequisites apply. No dependency on another Phase 2 task.

**Related Architecture Documents:** `03-authentication.md` §8; `06-security.md` §4

**Files to create:**
- `/lib/auth/rate-limit.ts` — `recordFailedAttempt(key)`, `isLocked(key)`, `resetAttempts(key)`.

**Files to modify:** None.

**Expected Result:** Rate limiter module, single-process, no external store.

**Verification Checklist:**
- [ ] 5 failures lock the key.
- [ ] A 6th attempt is rejected without a password check.
- [ ] The lock clears after 15 minutes (verify via a shortened test window or by inspecting expiry logic) or on a successful login.

**Completion Criteria:** Task 2.3 is complete when `/lib/auth/rate-limit.ts` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 2.4 — `POST /api/admin/login` route handler

**Objective:** Wire input validation, rate-limit check, password verification, session creation, and cookie setting into the login endpoint. Validates non-empty username/password (Zod), checks lock state (Task 2.3), verifies credentials (Task 2.2), creates a session (Task 2.1) on success, sets the session cookie (see "Session cookie requirements" below), records failed attempts on failure, returns the standard error envelope (`19` §6.2) with a generic message either way. This task does not implement logout, middleware enforcement, or UI wiring — those are Tasks 2.5, 2.6, and 2.8.

**Session cookie requirements (explicit — no implementation ambiguity):** The session cookie must specify:
- `HttpOnly`
- `Secure` in production
- `SameSite=Lax`
- `Path=/`
- Sliding expiration (7 days)

**Phase 2 login scope (explicit — no implementation ambiguity):** Phase 2 DOES NOT implement:
- Remember Me
- Forgot Password
- Password Reset
- User Registration
- Multiple Admin Accounts
- OAuth
- Social Login
- MFA / Two-Factor Authentication

These are intentionally out of scope.

**Prerequisites:** Tasks 2.1 (session creation), 2.2 (password verification), and 2.3 (rate limiter) complete — this route composes all three.

**Related Architecture Documents:** `03-authentication.md` §6.1, §11; `06-security.md` §3–4; `19-api-overview.md` §6

**Files to create:**
- `/app/api/admin/login/route.ts`

**Files to modify:** None.

**Expected Result:** Working login endpoint.

**Verification Checklist:**
- [ ] Correct credentials → session cookie set, response indicates success (redirect handled by Task 2.8's UI wiring).
- [ ] Incorrect password → generic error, no field-specific hint.
- [ ] 5 consecutive failures → account locked for 15 minutes; further attempts rejected without checking the password.
- [ ] Response uses the standard error envelope (`19` §6.2) with a generic message on every failure path.

**Completion Criteria:** Task 2.4 is complete when `/app/api/admin/login/route.ts` exists as described and every Verification Checklist item passes.

⚠️ Confirm the cookie's `SameSite` value (`Strict` vs `Lax`) before implementing this task — see Documentation Note 2, `00-overview-and-cross-phase-reference.md` §3. This is flagged, not resolved, by the roadmap.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 2.5 — `POST /api/admin/logout` route handler

**Objective:** Invalidate the current session and clear the cookie. This task does not implement middleware enforcement or UI wiring — those are Tasks 2.6 and 2.8.

**Prerequisites:** Task 2.1 (session store) complete — logout invalidates a session via `invalidateSession()`.

**Related Architecture Documents:** `03-authentication.md` §6.3

**Files to create:**
- `/app/api/admin/logout/route.ts`

**Files to modify:** None.

**Expected Result:** Working logout endpoint.

**Verification Checklist:**
- [ ] Cookie cleared client-side.
- [ ] Reusing the old session ID afterward is treated as unauthenticated.

**Completion Criteria:** Task 2.5 is complete when `/app/api/admin/logout/route.ts` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 2.6 — Middleware session enforcement (completes Task 1.9)

**Objective:** Replace the Phase 1 placeholder in `middleware.ts` with real session validation: missing/invalid/expired session → redirect to `/admin/login`. This task completes the scaffold Task 1.9 built in Phase 1 (same file); it does not implement API-layer session verification — that is Task 2.7.

**Middleware protection scope (explicit — no implementation ambiguity):**

Middleware MUST protect only:
- `/admin/*`
- `/api/admin/*`

Middleware MUST NEVER protect public pages, including:
- `/`
- `/destinations`
- `/packages`
- `/blog`
- `/gallery`
- `/contact`
- any other public visitor page

**Middleware responsibilities (explicit — no implementation ambiguity):**

Middleware is responsible ONLY for:
- verifying authentication session
- allowing or denying access

Middleware must NEVER:
- read article JSON files
- access dashboard statistics
- load module data
- perform authorization/business logic
- access storage

Keep middleware lightweight.

**Prerequisites:** Task 2.1 (session store) complete — middleware resolves the cookie via `getSession()`. Also requires Task 1.9 (Phase 1 middleware scaffold) already in place.

**Related Architecture Documents:** `03-authentication.md` §6.2, §10

**Files to create:** None.

**Files to modify:**
- `middleware.ts` (complete the Phase 1 stub — remove the `// TODO Phase 2` marker and the temporary "allow every request" behavior)

**Expected Result:** Fully protected `/admin/*` route group.

**Verification Checklist:**
- [ ] Direct navigation to a protected route with no cookie redirects to `/admin/login`.
- [ ] Direct navigation to a protected route with a valid cookie does not redirect.

**Completion Criteria:** Task 2.6 is complete when `middleware.ts` no longer contains the Phase 1 placeholder and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 2.7 — Shared API-layer session verification utility

**Objective:** Build one reusable check applied at the start of every `/api/admin/*` handler (except login), returning `401` on failure — implemented once, not per-route. This task does not apply the utility to any module route, since no module (Articles, Media) exists yet — that wiring happens in Phase 4 onward, when those routes are created.

**Prerequisites:** Task 2.1 (session store) complete — the utility resolves sessions the same way middleware does.

**Related Architecture Documents:** `03-authentication.md` §10; `19-api-overview.md` §8

**Files to create:**
- `/lib/auth/require-session.ts`

**Files to modify:** None.

**Expected Result:** Shared utility ready for Phase 4+ API routes to import (no module routes exist to apply it to yet besides login/logout, which are exempt/self-contained).

**Verification Checklist:**
- [ ] Utility returns unauthenticated for a missing session.
- [ ] Utility returns unauthenticated for an invalid session.
- [ ] Utility returns unauthenticated for an expired session.
- [ ] Utility resolves the single admin identity for a valid session.

**Completion Criteria:** Task 2.7 is complete when `/lib/auth/require-session.ts` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 2.8 — Wire login/logout UI to the real endpoints

**Objective:** Connect the Phase 1 login form and header logout button to the endpoints built in this phase. This task only wires existing Phase 1 UI to Phase 2 endpoints — it does not change the visual design of the login page or header established in Phase 1.

**Prerequisites:** Tasks 2.4 (login route) and 2.5 (logout route) complete.

**Related Architecture Documents:** `03-authentication.md` §6.1, §6.3

**Files to create:** None.

**Files to modify:**
- `/app/(admin)/admin/login/page.tsx` (submit handler: calls Task 2.4's endpoint, handles generic error display, redirects on success)
- `/components/admin/header.tsx` (logout button: calls Task 2.5's endpoint, redirects to `/admin/login`)

**Expected Result:** End-to-end working login/logout flow through the actual UI.

**Verification Checklist:**
- [ ] Full manual login → dashboard → logout → redirected-to-login cycle works through the browser, not just via direct API calls.

**Completion Criteria:** Task 2.8 is complete when both files are modified as described and the Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 2.9 — Confirm role-verification scope (no-code clarifying task)

**Objective:** Explicitly confirm in code comments/PR description that v1 has no role system — session resolution yields a single fixed admin identity, with the extension point for a future role check documented at the two places a future role would need to plug in. This is a documentation/comment task only — it introduces no functional change and must not add any role-check logic.

**Prerequisites:** Task 2.7 (`require-session.ts`) complete. The second comment location (the future publish/unpublish action) does not exist until Phase 4 creates it — that half of this task's scope carries forward and is completed when Phase 4's publish/unpublish action is implemented, per the original roadmap's own phrasing ("the future publish/unpublish action location (Phase 4)").

**Related Architecture Documents:** `03-authentication.md` §2, §12; `10` §8; `15` §8

**Files to create:** None.

**Files to modify:**
- `/lib/auth/require-session.ts` (short comment noting the future authorization extension point)
- *(deferred to Phase 4)* the future publish/unpublish action location, per `10` §8 and `15` §8

**Expected Result:** Two short, clearly marked comments; no new logic. One is added now in `require-session.ts`; the other is added when Phase 4 creates the relevant file.

**Verification Checklist:**
- [ ] The `require-session.ts` comment is present, short, and clearly marked as a future extension point.
- [ ] Reviewer confirms no role-check code was accidentally introduced (out of scope per `03` §12).

**Completion Criteria:** Task 2.9's Phase 2 portion is complete when the `require-session.ts` comment exists as described and both Verification Checklist items pass. The Phase 4 portion of this task is tracked there, not here.

**STOP HERE. Wait for user approval before continuing.**

---

## Phase 2 Boundary — STOP HERE

Phase 2 ends with Task 2.9. Phase 2 must NOT implement any of the following:

- Dashboard functionality
- Article CRUD
- Media Library
- Image Upload
- Article Editor
- Publishing Workflow
- SEO
- API CRUD
- Analytics
- Any Phase 3+ feature

These belong to later phases and are out of scope for this document.