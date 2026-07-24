# Phase 1 — Foundation

> Part of the Nyalian Tourism Village Admin Dashboard — Implementation Roadmap.
> **Source of truth:** The 20 documents in `/docs/admin` (`01-admin-overview.md` through `20-api-articles.md`). Nothing in this document overrides them.
> This file is a reorganized excerpt of the original `implementation-roadmap.md` (Section 2, "Phase 1 — Foundation"). No technical content has been added, removed, or altered — only split into a standalone file, restructured per-task, and given organizational metadata.
> Cross-phase material (documentation notes, dependency graph, global implementation rules, development conventions, verification principles) lives in `00-overview-and-cross-phase-reference.md` and is referenced here, not repeated.

---

## Metadata

**Phase Name:** Phase 1 — Foundation

**Objective:** Stand up the admin route group, persistent shell layout, navigation shell, login page (UI only), dashboard homepage (skeleton only), and route-protection scaffolding — the structural skeleton every later phase builds inside.

**Dependencies:** None (first phase).

**Related Architecture Documents:** `01-admin-overview.md` §2, §3 · `02` §4, §5.1, §6 · `03-authentication.md` §4, §7, §9, §10 · `05-deployment.md` / `07-environment-variables.md` §5, §10 (flagged — see Documentation Note 1 in `00-overview-and-cross-phase-reference.md` §3) · `08` §2–9 · `09` §3–7 · `10` §2–7, §10.

**Expected Deliverables:** See "Files to create" and "Files to modify" below.

**Verification Checklist:** See "Manual verification checklist" below.

**Completion Criteria:** See "Completion criteria" below.

---

## Phase Detail

**Expected result:** Visiting `/admin/login` renders an unauthenticated minimal layout; visiting any other `/admin/*` route (once middleware is stubbed) renders the persistent shell (sidebar + header + content slot) with a placeholder dashboard home page. No real authentication or data wiring exists yet — that's Phase 2 onward.

**Prerequisites:** Existing Next.js 15 project with the public site already running; Tailwind CSS and shadcn/ui already configured in the project (per `01` §2); `/docs/admin` available for reference during implementation.

**Files to create:**
- `/app/(admin)/layout.tsx`
- `/app/(admin)/admin/login/layout.tsx`, `/app/(admin)/admin/login/page.tsx`
- `/app/(admin)/admin/dashboard/page.tsx`
- `/components/admin/sidebar.tsx`, `/components/admin/header.tsx`
- `/lib/navigation/config.ts`
- `/lib/env.ts`
- `middleware.ts`

**Files to modify:**
- `next.config.js`/`next.config.ts` (route group awareness, if needed)
- Root `tailwind.config` (only if admin-specific design tokens are added, per `08` §8 — should not require changes if base tokens are reused)

**Things that must NOT be changed:**
- Public site routes, layouts, or rendering logic (`01` §3, `02` §5.1) — the admin route group must be fully isolated.
- No filesystem read/write logic yet — Phase 1 is UI/routing/scaffolding only; `/content` and `/public/images` are not touched.
- Do not hardcode module-specific markup into the sidebar/header — navigation must be configuration-driven from the start (`10` §2).

**Manual verification checklist:**
- [ ] `/admin/login` renders without the sidebar/header shell.
- [ ] `/admin/dashboard` renders inside the persistent shell.
- [ ] Sidebar renders from `/lib/navigation/config.ts`, not hardcoded JSX per entry.
- [ ] Public site routes/pages are unaffected (spot-check a couple of existing public pages).
- [ ] Responsive check: sidebar collapses to a drawer below the tablet breakpoint.

**Possible risks:**
- Route group nesting conflicting with existing public route structure if `(public)` isn't already isolated the same way.
- Tailwind/shadcn theme collision between admin and public visual identity if design tokens aren't cleanly shared (`08` §8).
- Building the login page's *appearance* before Phase 2 exists can tempt someone to wire fake/local auth "temporarily" — must be avoided per Phase 2 boundaries.

**Completion criteria:** All Phase 1 tasks below are done, the manual verification checklist passes, and no admin route touches `/content` or `/public/images`.

---

## Tasks

Each task below is scoped to be implemented — and turned into a single implementation prompt — independently, in the order presented.

### Task 1.1 — Admin route group & module folder skeleton

**Objective:** Create the top-level folder structure the entire dashboard will live in, per the module contract, without any page logic yet beyond placeholders.

**Prerequisites:** Phase 1 prerequisites apply (see "Prerequisites" above). First task in Phase 1 — no dependency on another Phase 1 task.

**Related Architecture Documents:** `02` §4, §6

**Files to create:**
- `/app/(admin)/admin/login/` (route stub)
- `/app/(admin)/admin/dashboard/` (route stub)
- `/lib/modules/` (empty directory, ready for `articles/` in Phase 4)
- `/content/` (confirm it exists; create if missing — no files written into it yet)
- `/public/images/` (confirm it exists; create if missing — no files written into it yet)

**Expected Result:** Folder/file skeleton matching the conceptual structure in `02` §4; each stub page renders a placeholder heading only.

**Verification Checklist:**
- [ ] Folder structure matches `02` §4.
- [ ] No route yet performs any data access.
- [ ] App builds successfully.

**Completion Criteria:** Task 1.1 is complete when the folder/file skeleton described above exists, every item in the Verification Checklist passes, and no route touches `/content` or `/public/images` beyond confirming the directories exist.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 1.2 — Environment variable loading & validation stub

**Objective:** Create `/lib/env.ts`, validating required environment variables with Zod at startup, per the (duplicated/flagged) deployment doc's §10 reference to `/lib/env.ts`. Validates presence/shape of `ADMIN_USERNAME` (string), `ADMIN_PASSWORD_HASH` (string), `SESSION_SECRET` (string, non-empty), `NEXT_PUBLIC_SITE_URL` (URL); the app fails fast on missing/invalid values.

**Prerequisites:** Phase 1 prerequisites apply. No dependency on another Phase 1 task.

**Related Architecture Documents:** `03-authentication.md` §4, §7, §9; `05-deployment.md` / `07-environment-variables.md` §5, §10 (flagged — see Documentation Note 1, `00-overview-and-cross-phase-reference.md` §3)

**Files to create:**
- `/lib/env.ts`
- `.env.example` (local; contains every environment variable required by Phase 1 — additional variables introduced by later phases must be appended to this same file)

**Expected Result:** `/lib/env.ts` exporting a validated, typed env object; local `.env.example` containing every environment variable required by Phase 1, with additional variables introduced by later phases to be appended to the same file.

**Verification Checklist:**
- [ ] App refuses to start with a missing variable (test locally by unsetting one).
- [ ] App starts cleanly with all four variables set.

**Completion Criteria:** Task 1.2 is complete when `/lib/env.ts` and `.env.example` exist as described and both Verification Checklist items pass.

⚠️ Re-confirm the full variable list once a correct `07-environment-variables.md` is available — this task assumes only the four variables reconstructed in Documentation Note 1 (`00-overview-and-cross-phase-reference.md` §3).

**STOP HERE. Wait for user approval before continuing.**

---

### Task 1.3 — Admin shell layout (`layout.tsx`)

**Objective:** Implement the persistent shell (sidebar + header + content slot) wrapping every `/admin/*` route except `/admin/login`, composing Sidebar + Header + `{children}` content area with its own scroll region.

**Prerequisites:** Phase 1 prerequisites apply. No dependency on another Phase 1 task — the Sidebar and Header components this layout composes are built out in Tasks 1.4 and 1.5 respectively; this task establishes the layout that hosts them.

**Related Architecture Documents:** `08` §2–4, §7

**Files to create:**
- `/app/(admin)/layout.tsx`

**Expected Result:** Shell layout component; content area scrolls independently of the fixed sidebar/header.

**Verification Checklist:**
- [ ] Navigating between two placeholder admin routes never remounts/flashes the sidebar or header (`08` §7).

**Completion Criteria:** Task 1.3 is complete when `/app/(admin)/layout.tsx` exists as described and the Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 1.4 — Sidebar component

**Objective:** Build the persistent, configuration-driven sidebar. Renders grouped/ordered links from `/lib/navigation/config.ts`; highlights the active entry via `aria-current="page"`, including nested-route matching (e.g. `/admin/articles/123/edit` highlights "Articles"); collapses to an off-canvas drawer below the tablet breakpoint.

**Prerequisites:** Task 1.6 (Navigation configuration file) complete — the sidebar consumes the typed navigation config array that Task 1.6 produces.

**Related Architecture Documents:** `08` §3.1, §6, §9; `10` §2–5, §7

**Files to create:**
- `/components/admin/sidebar.tsx`

**Expected Result:** `/components/admin/sidebar.tsx` implemented as described.

**Verification Checklist:**
- [ ] Active-state highlighting works on a nested route.
- [ ] Drawer toggle works on a narrow viewport.
- [ ] Component is keyboard-navigable (`08` §9).

**Completion Criteria:** Task 1.4 is complete when `/components/admin/sidebar.tsx` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 1.5 — Header component

**Objective:** Build the top header: contextual title/breadcrumb slot, admin identity display, logout control (button only — wired to a real endpoint in Phase 2). Breadcrumb slot left empty/optional until Phase 4 supplies entity titles.

**Prerequisites:** Phase 1 prerequisites apply. No dependency on another Phase 1 task.

**Related Architecture Documents:** `08` §3.2, §6; `10` §6

**Files to create:**
- `/components/admin/header.tsx`

**Expected Result:** Header rendering page title + logout button (non-functional placeholder for now).

**Verification Checklist:**
- [ ] Header renders consistently across placeholder routes.
- [ ] Mobile drawer toggle control lives in the header (`08` §6).

**Completion Criteria:** Task 1.5 is complete when `/components/admin/header.tsx` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 1.6 — Navigation configuration file

**Objective:** Create the single source of truth for sidebar entries: `/lib/navigation/config.ts` with `dashboard` and `articles` entries (group, order, icon, href, key) per the example shape in `10` §3; leave room for a `media` entry (added in Phase 6).

**Prerequisites:** Phase 1 prerequisites apply. No dependency on another Phase 1 task.

**Related Architecture Documents:** `10` §3, §5, §10

**Files to create:**
- `/lib/navigation/config.ts`

**Expected Result:** Typed navigation config array, consumed by Task 1.4.

**Verification Checklist:**
- [ ] Adding a new dummy entry requires no changes outside this file (`10` §10).

**Completion Criteria:** Task 1.6 is complete when `/lib/navigation/config.ts` exists as described and the Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 1.7 — Login page UI (unauthenticated shell)

**Objective:** Build the `/admin/login` page's visual form (username, password, submit) with its own minimal layout, excluded from the admin shell. Submission is wired in Phase 2 (Task 2.8) — this task is UI only.

**Prerequisites:** Phase 1 prerequisites apply. No dependency on another Phase 1 task.

**Related Architecture Documents:** `08` §5

**Files to create:**
- `/app/(admin)/admin/login/layout.tsx` (minimal, centered, no nav)
- `/app/(admin)/admin/login/page.tsx` (form UI only)

**Expected Result:** Static login form, no working submit handler yet.

**Verification Checklist:**
- [ ] Route renders without sidebar/header.
- [ ] Form is keyboard-accessible and properly labeled.

**Completion Criteria:** Task 1.7 is complete when both files exist as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 1.8 — Dashboard homepage skeleton

**Objective:** Build the structural sections of `/admin/dashboard` (heading, summary cards row, quick actions row, recent activity list) with placeholder/mock data — real data wiring is Task 7.1 (Phase 7). Follows the section order in `09` §4; module registry pattern stubbed with a single hardcoded "Articles" descriptor object matching the shape in `09` §6 (real `getSummary()` wired later).

**Scope constraint (Phase 1 is UI-only):** During Phase 1, this task is static placeholder UI only. Specifically, none of the following are implemented in this task:
- No filesystem reads
- No API calls
- No JSON loading
- No module statistics
- No server actions
- No dynamic data

**Prerequisites:** Task 1.3 (Admin shell layout) complete — the dashboard page renders inside the shell.

**Related Architecture Documents:** `09` §3–7

**Files to create:**
- `/app/(admin)/admin/dashboard/page.tsx`

**Expected Result:** Dashboard page rendering all four sections with placeholder counts/empty-state copy.

**Verification Checklist:**
- [ ] Empty-state copy matches `09` §7 intent (zero counts shown cleanly, not as an error).
- [ ] Layout matches the four-section structure.
- [ ] No filesystem reads, API calls, JSON loading, module statistics, server actions, or dynamic data exist anywhere in this task's implementation — placeholder UI only.

**Completion Criteria:** Task 1.8 is complete when `/app/(admin)/admin/dashboard/page.tsx` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 1.9 — Middleware route-protection scaffold

**Objective:** Create `middleware.ts` matching `/admin/*` (excluding `/admin/login`), with the redirect-to-login branch structurally in place. The middleware must temporarily allow every request while preserving the final control-flow structure. Session validation is intentionally replaced with a clearly marked `// TODO Phase 2`. No authentication logic is implemented during Phase 1 — actual session validation logic is completed in Task 2.6 (Phase 2).

**Prerequisites:** Phase 1 prerequisites apply. No dependency on another Phase 1 task.

**Related Architecture Documents:** `03-authentication.md` §10

**Files to create:**
- `middleware.ts`

**Expected Result:** Middleware file with correct route matching, no real session logic yet.

**Verification Checklist:**
- [ ] Matcher correctly excludes `/admin/login`.
- [ ] Matcher includes all other `/admin/*` paths (verify with a couple of manual route hits).

**Completion Criteria:** Task 1.9 is complete when `middleware.ts` exists as described and every Verification Checklist item passes. Note: this same file is completed with real session-validation logic by Task 2.6 in Phase 2 — sequential, not parallel-safe (see `00-overview-and-cross-phase-reference.md` §4).

**STOP HERE. Wait for user approval before continuing.**