# Phase 4 — Article CRUD

> Part of the Nyalian Tourism Village Admin Dashboard — Implementation Roadmap.
> **Source of truth:** The 20 documents in `/docs/admin` (`01-admin-overview.md` through `20-api-articles.md`). Nothing in this document overrides them.
> This file follows the same organizational format as the finalized `01-phase-1-foundation.md`, `02-phase-2-authentication.md`, and `03-phase-3-shared-admin-components.md`.
> Cross-phase material (documentation notes, dependency graph, global implementation rules, development conventions, verification principles) lives in `00-overview-and-cross-phase-reference.md` and is referenced here, not repeated.

---

## Metadata

**Phase Name:** Phase 4 — Article CRUD

**Objective:** Implement the complete Article CRUD feature — data model, validation schema, data access service, CRUD API Route Handlers, and the list/create/edit/delete UI — as the first concrete module built on top of the Phase 1 shell and Phase 3 shared component library, per `12-articles.md`.

**Dependencies:** Phase 1 (shell, routing) and Phase 3 (shared components: Page Header, Data Table, Pagination, Search & Filter Bar, Form Components, Dialog/Confirm Delete, Status Badge, Empty State, Toast, Loading Skeleton) complete. Phase 2 (authentication) complete — every API route in this phase is protected via the shared `require-session.ts` utility built in Task 2.7.

**Related Architecture Documents:** `12-articles.md` (whole document) · `13-article-editor.md` §2–4, §6–7, §11–13 (scoped — see Scope Interpretation Notes) · `17-article-validation.md` §2–6, §8–9 · `04-storage-strategy.md` §5–9 · `19-api-overview.md` §2–8 · `20-api-articles.md` · `02-admin-architecture.md` §5–6 · `11-admin-components.md` (component reuse, no duplication).

**Expected Deliverables:** See "Files to create" below.

**Verification Checklist:** See "Manual verification checklist" below.

**Completion Criteria:** See "Completion criteria" below.

---

## Phase Detail

**Expected result:** An admin can view a list of all articles, create a new article (saved as `draft`), edit an existing article's fields, and delete an article with explicit confirmation. Every write is validated server-side with Zod and persisted to `/content/articles.json` via the atomic write pattern. Slugs are auto-generated from the title and validated for uniqueness. All CRUD operations flow through authenticated Route Handlers under `/api/admin/articles` — the UI never touches the filesystem directly, per `02-admin-architecture.md` §5.1.

**Scope Interpretation Notes (read before implementing — these resolve real tensions between in-scope and out-of-scope items in this phase's brief; none of them introduce a new architecture decision, each is derived directly from the cited section):**

1. **Status is data-model-only in this phase, not a workflow.** `13-article-editor.md` §3 and §7 attribute the Status toggle control and all status-transition behavior to `15-article-publishing.md` (out of scope for this phase). This phase therefore: creates every new article with `status: "draft"` (per `12-articles.md` §5.1), displays status via the Status Badge in the list (per `12-articles.md` §4, already built in Phase 3), and does **not** expose a Publish/Unpublish control or dedicated transition endpoint. The field exists and is readable/displayed; the transition mechanism is Phase 5+.
2. **`content` is a plain textarea in this phase, not Tiptap.** `13-article-editor.md` §5 specifies Tiptap for rich text editing, but "Rich Text Editor configuration" is explicitly out of scope for this phase. The `content` field is implemented as a plain, sanitized textarea (still passed through `sanitize-html` server-side per `17-article-validation.md` §6, since sanitization is a validation concern, not a Rich-Text-Editor-configuration concern) to keep the data model and save flow real and testable. It is swapped for the Tiptap integration in a later phase without changing the API contract.
3. **List endpoint follows the locked paginated response shape; the list page does not render interactive pagination/search/filter controls.** `19-api-overview.md` §9 mandates that list endpoints return `{ items, total, page, limit, totalPages }` — "there is no 'return all records' mode." This phase's `GET /api/admin/articles` follows that exact response shape with server-side defaults (`page=1`, default `limit`). However, since "Search," "Filtering," and "Pagination" (as UI features) are explicitly out of scope for this phase, the list page renders whatever the default first page returns with no page-change, search, or filter controls wired up (the Phase 3 Pagination and Search & Filter Bar components are not consumed by this phase's list page). This is a known, temporary limitation removed when the Search/Filter/Pagination cross-cutting phase wires the existing components to this list page.
4. **`coverImage` and `seo` exist in the type/schema surface differently.** Per this phase's brief, image fields are assumed to already exist in the model but are not implemented. `coverImage` is included in `types.ts` as an optional field (unused, no upload UI, per `12-articles.md` §3) so the shape is forward-compatible with Phase 5. The `seo` object (`16-article-seo.md`) is entirely deferred and **not** included in this phase's schema or types, since it belongs to a dedicated future SEO phase and has no data-model dependency the rest of this phase needs.

**Prerequisites:** Phase 1 complete (admin shell, routing). Phase 2 complete (`require-session.ts` available for API route protection). Phase 3 complete (Page Header, Data Table, Pagination, Search & Filter Bar, Form Components, Dialog/Confirm Delete, Status Badge, Empty State, Toast, Loading Skeleton all exist in `/components/admin/`).

**Files to create:**
- `/lib/modules/articles/types.ts`
- `/lib/modules/articles/schema.ts`
- `/lib/modules/articles/slug.ts`
- `/lib/modules/articles/service.ts`
- `/app/api/admin/articles/route.ts`
- `/app/api/admin/articles/[id]/route.ts`
- `/components/admin/articles/article-form.tsx`
- `/components/admin/articles/article-columns.tsx`
- `/app/(admin)/admin/articles/page.tsx`
- `/app/(admin)/admin/articles/loading.tsx`
- `/app/(admin)/admin/articles/error.tsx`
- `/app/(admin)/admin/articles/new/page.tsx`
- `/app/(admin)/admin/articles/[id]/edit/page.tsx`
- `/app/(admin)/admin/articles/[id]/edit/loading.tsx`
- `/app/(admin)/admin/articles/[id]/edit/error.tsx`

**Files to modify:** None. This phase does not touch any file created in Phase 1, 2, or 3.

**Things that must NOT be changed:**
- No component may be duplicated from Phase 3 — this phase's pages and forms must compose Page Header, Data Table, Pagination (unwired, see Scope Note 3), Form Components, Dialog/Confirm Delete, Status Badge, Empty State, Toast, and Loading Skeleton, never reimplement equivalents (`11` §5).
- The Admin UI never reads or writes `/content/articles.json` directly — every mutation and read goes through `/api/admin/articles` (`02-admin-architecture.md` §5.1).
- No image upload, Sharp processing, or `/public/images/articles/` file writes occur in this phase (`14-article-image.md` is out of scope).
- No Tiptap integration (`13-article-editor.md` §5 toolbar) — plain textarea only, per Scope Note 2.
- No `seo` object, no SEO metadata fields, no Next.js metadata wiring (`16-article-seo.md` is out of scope).
- No dedicated publish/unpublish endpoint or action (`15-article-publishing.md` is out of scope), per Scope Note 1.
- No `revalidatePath()` or any public-site cache invalidation call (`05-deployment.md` §6 is out of scope for this phase).
- No dashboard statistics wiring — Task 1.8's dashboard placeholder in Phase 1 is not modified.
- Do not implement Media Library, image detail dialogs, or any future-module code.

**Manual verification checklist:**
- [ ] `/admin/articles` renders the list of existing articles using the shared Data Table.
- [ ] Creating a new article via `/admin/articles/new` persists a new record to `/content/articles.json` with `status: "draft"`, a server-generated `id`, `createdAt`, and `updatedAt`.
- [ ] The slug is auto-generated from the title on creation and is editable before saving.
- [ ] Editing an existing article via `/admin/articles/[id]/edit` loads the current record and persists changes on save, with `updatedAt` refreshed and `id`/`createdAt` unchanged.
- [ ] Deleting an article via the list view's Confirm Delete dialog removes the record from `/content/articles.json`.
- [ ] A slug collision on create or update is rejected with a field-specific `409 CONFLICT` error, shown inline next to the slug field.
- [ ] The list view shows the shared Empty State when zero articles exist.
- [ ] Loading states render while the list and edit views fetch data; error states render if a fetch fails or an edited article's `id` does not exist (404).
- [ ] Every `/api/admin/articles*` route rejects unauthenticated requests with `401`, reusing Phase 2's `require-session.ts`.

**Possible risks:**
- Slug uniqueness race conditions between the initial check and the actual write — must be handled at the service layer immediately before writing, per `04-storage-strategy.md` §6 and §8.3, not only at the schema-validation step.
- Treating `content` as a plain textarea now means the stored value is still expected to be sanitized HTML-safe plain text; when Tiptap is introduced later, confirm the sanitization step (`17` §6) is not accidentally bypassed or duplicated.
- The list endpoint's locked paginated shape (Scope Note 3) could be mistaken for "pagination is done" — it is not; only the response envelope is locked, the UI controls are still deferred.

**Completion criteria:** All Phase 4 tasks below are complete, the Manual verification checklist passes, no filesystem access occurs from the Admin UI outside of `/api/admin/articles`, and no code outside `/lib/modules/articles/`, `/app/api/admin/articles/`, `/components/admin/articles/`, and `/app/(admin)/admin/articles/` is touched.

---

## Tasks

Each task below is scoped to be implemented — and turned into a single implementation prompt — independently, in the order presented.

### Task 4.1 — Articles TypeScript types

**Objective:** Define the `Article` type and any supporting types (e.g. `ArticleStatus`) matching the data model in `12-articles.md` §3, scoped per this phase's Interpretation Notes (no `seo` object; `coverImage` present but unused).

**Files involved:** `/lib/modules/articles/types.ts` (create).

**Dependencies:** None — first task in this phase.

**Implementation notes:** Fields: `id`, `slug`, `title`, `excerpt`, `content`, `coverImage` (optional, unused this phase), `status` (`"draft" | "published"`), `publishedAt` (`string | null`), `author` (optional), `category`, `createdAt`, `updatedAt`. No `seo` field in this phase (Scope Note 4).

**Verification checklist:**
- [ ] `Article` type compiles and matches every field listed above with correct optionality.
- [ ] No `any` used anywhere in the file.

**Completion criteria:** Task 4.1 is complete when `/lib/modules/articles/types.ts` exists as described and both Verification checklist items pass.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 4.2 — Articles Zod validation schema

**Objective:** Implement the Zod schema for the Articles module per `17-article-validation.md` §2–4, applying the **draft-save validation level** as the operative level for this phase (Scope Note 1 — publish-level strictness is deferred with the Publishing workflow).

**Files involved:** `/lib/modules/articles/schema.ts` (create).

**Dependencies:** Task 4.1 (`types.ts`) complete — schema output should align with the `Article` type.

**Implementation notes:** Required fields for draft-save, per `17` §4: `title` (non-empty, max length), `slug` (lowercase kebab-case, max length), `category` (non-empty, max length). Optional fields: `excerpt`, `content`, `author`. `status` defaults to `"draft"` and is not user-submittable through this schema (Scope Note 1 — set server-side only). Same schema is intended for use on both client (form) and server (API), per `17` §2.

**Verification checklist:**
- [ ] Schema rejects a submission missing `title`, `slug`, or `category`.
- [ ] Schema accepts a submission with only the draft-required fields present.
- [ ] Schema rejects a malformed slug (uppercase, spaces, or invalid characters).

**Completion criteria:** Task 4.2 is complete when `/lib/modules/articles/schema.ts` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 4.3 — Slug generation utility

**Objective:** Implement a pure function that derives a URL-friendly slug from a title (lowercase, hyphenated, diacritics normalized), usable both client-side (editor form, Task 4.7) and server-side (service layer, Task 4.4), per `04-storage-strategy.md` §6 and `13-article-editor.md` §4.

**Files involved:** `/lib/modules/articles/slug.ts` (create).

**Dependencies:** None — independent of Task 4.1/4.2, but typically implemented alongside them.

**Implementation notes:** Exports a single function, e.g. `generateSlug(title: string): string`. No filesystem or network access — pure string transformation only. Uniqueness checking is NOT this function's responsibility (that belongs to the service layer, Task 4.4).

**Verification checklist:**
- [ ] A title with mixed case, spaces, and diacritics produces a correct lowercase, hyphenated slug.
- [ ] Function is pure (same input always produces same output, no side effects).

**Completion criteria:** Task 4.3 is complete when `/lib/modules/articles/slug.ts` exists as described and both Verification checklist items pass.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 4.4 — Articles data access service

**Objective:** Implement the module's data access layer: reading `/content/articles.json`, and creating/updating/deleting records using the atomic write pattern, per `04-storage-strategy.md` §7–9 and `02-admin-architecture.md` §5.4.

**Files involved:** `/lib/modules/articles/service.ts` (create).

**Dependencies:** Tasks 4.1 (types), 4.2 (schema), and 4.3 (slug utility) complete — the service composes all three.

**Implementation notes:**
- `listArticles()` — reads and returns the full array (pagination slicing per Scope Note 3 may happen here or in the route handler — implement consistently with Task 4.5).
- `getArticleById(id)` — returns a single record or `null`.
- `createArticle(input)` — generates `id` (UUID) and `slug` (via Task 4.3, checked for uniqueness per `04` §6), sets `createdAt`/`updatedAt`, forces `status: "draft"` and `publishedAt: null` (Scope Note 1), writes via the atomic write pattern (`04` §8.1).
- `updateArticle(id, input)` — preserves `id`/`createdAt`, refreshes `updatedAt`, re-checks slug uniqueness if the slug changed, writes via the atomic write pattern. Does not alter `status` (Scope Note 1).
- `deleteArticle(id)` — removes the record via the atomic write pattern; attempts to remove `/public/images/articles/{id}` per `04` §9, tolerating a non-existent folder without erroring, since image upload is not implemented yet (Scope Note 4) and the folder will typically not exist in this phase.
- Write operations for `articles.json` are serialized per `04` §8.2 (in-process write queue/lock per file).
- Slug uniqueness check is a defense-in-depth step performed immediately before writing, independent of the schema-level check (`04` §8.3).

**Verification checklist:**
- [ ] Creating two articles with titles producing the same slug results in the second being rejected (or the collision surfaced as a field error, per `17` §5) — not silently overwritten.
- [ ] A failed write (simulate by triggering a validation error) leaves the existing `articles.json` file untouched.
- [ ] Deleting a record whose image folder does not exist does not throw.

**Completion criteria:** Task 4.4 is complete when `/lib/modules/articles/service.ts` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 4.5 — `GET`/`POST /api/admin/articles` Route Handler

**Objective:** Implement the list and create endpoints per `20-api-articles.md` and `19-api-overview.md` §6–9, protected by the shared session check from Phase 2.

**Files involved:** `/app/api/admin/articles/route.ts` (create).

**Dependencies:** Task 4.4 (service) complete. Phase 2 Task 2.7 (`require-session.ts`) complete.

**Implementation notes:**
- Both methods begin with the shared `require-session.ts` check (`19` §8); unauthenticated requests return `401 UNAUTHORIZED` per the standard error envelope.
- `GET` — returns the standard paginated envelope (`19` §9): `{ success: true, data: { items, total, page, limit, totalPages } }`, using server-side defaults for `page`/`limit` (Scope Note 3 — no search/sort query handling implemented this phase, only the default first page).
- `POST` — validates the request body with the Task 4.2 schema (`422 VALIDATION_ERROR` with field-mapped `errors` on failure, per `17` §8), delegates to `createArticle()`, returns `201` with the new record under `data` on success.

**Verification checklist:**
- [ ] `GET` without a session returns `401`.
- [ ] `GET` with a session returns the paginated envelope shape exactly.
- [ ] `POST` with an invalid body returns `422` with field-mapped errors.
- [ ] `POST` with a valid body returns `201` and the created record.

**Completion criteria:** Task 4.5 is complete when `/app/api/admin/articles/route.ts` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 4.6 — `GET`/`PUT`/`DELETE /api/admin/articles/[id]` Route Handler

**Objective:** Implement the read-one, update, and delete endpoints per `20-api-articles.md` and `19-api-overview.md` §4, §6–8.

**Files involved:** `/app/api/admin/articles/[id]/route.ts` (create).

**Dependencies:** Task 4.4 (service) complete. Phase 2 Task 2.7 (`require-session.ts`) complete.

**Implementation notes:**
- All three methods begin with the shared session check; unauthenticated requests return `401`.
- `GET` — returns `404 NOT_FOUND` if the `id` does not exist; otherwise the record under `data`.
- `PUT` — full-record update per `19` §4 ("Updates are always submitted as a complete record via `PUT`"); validates with the Task 4.2 schema, returns `422` on failure, `404` if the `id` does not exist, `200` with the updated record on success.
- `DELETE` — returns `404` if the `id` does not exist; otherwise deletes via `deleteArticle()` and returns `200` with `{ deleted: true }` under `data`, per `19` §6.1.

**Verification checklist:**
- [ ] `GET` on a non-existent `id` returns `404`.
- [ ] `PUT` with an invalid body returns `422` with field-mapped errors.
- [ ] `PUT` on a valid body updates the record and refreshes `updatedAt` while preserving `id`/`createdAt`.
- [ ] `DELETE` on an existing `id` removes the record and returns the standard success envelope.

**Completion criteria:** Task 4.6 is complete when `/app/api/admin/articles/[id]/route.ts` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 4.7 — Article-specific shared components

**Objective:** Build the Articles module's composition layer on top of Phase 3's shared components — a reusable article form and the Data Table column configuration — without introducing any new generic UI primitive (per `11-admin-components.md` §5).

**Files involved:**
- `/components/admin/articles/article-form.tsx` (create)
- `/components/admin/articles/article-columns.tsx` (create)

**Dependencies:** Phase 3 complete (Form Components, Page Header, Data Table, Status Badge). Tasks 4.2 (schema) and 4.3 (slug utility) complete.

**Implementation notes:**
- `article-form.tsx` — composes Phase 3's Form Components (text input, textarea, select) for `title`, `slug` (auto-generated via Task 4.3 on title change, editable, per `13` §4), `excerpt`, `content` (plain textarea per Scope Note 2), `category`, `author`. Used identically by both the create page (Task 4.9) and edit page (Task 4.10), differing only by whether initial values are empty or pre-populated. Does not render a Status toggle, Cover Image field, or SEO section (Scope Notes 1, 2, 4).
- `article-columns.tsx` — column definitions for the shared Data Table: Title (links to edit view), Status (via shared Status Badge), Category, Updated (formatted `updatedAt`), and row actions (Edit, Delete), per `12-articles.md` §4.

**Verification checklist:**
- [ ] `article-form.tsx` renders correctly with empty initial values (create mode) and with pre-populated values (edit mode).
- [ ] Editing the title auto-updates the slug field until the slug is manually edited, at which point auto-generation stops tracking further title changes (`13` §4).
- [ ] `article-columns.tsx` produces a Data Table with no knowledge duplicated from `/components/admin/data-table.tsx` — only column/action configuration.

**Completion criteria:** Task 4.7 is complete when both files exist as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 4.8 — Articles list page

**Objective:** Build `/admin/articles`, composing Page Header, Data Table (via Task 4.7's column config), Empty State, and Loading Skeleton, per `12-articles.md` §4.

**Files involved:**
- `/app/(admin)/admin/articles/page.tsx` (create)
- `/app/(admin)/admin/articles/loading.tsx` (create)
- `/app/(admin)/admin/articles/error.tsx` (create)

**Dependencies:** Task 4.5 (list API) and Task 4.7 (article-columns) complete.

**Implementation notes:** Page Header title "Articles," primary action "New Article" linking to `/admin/articles/new`. Fetches from `GET /api/admin/articles` server-side. Renders the shared Empty State when `items` is empty. No Search & Filter Bar or interactive Pagination is rendered this phase (Scope Note 3). `loading.tsx` uses the Phase 3 Loading Skeleton (table variant). `error.tsx` handles a failed fetch.

**Verification checklist:**
- [ ] List renders correctly with existing articles.
- [ ] Empty State renders when zero articles exist.
- [ ] Loading Skeleton renders during the server fetch.
- [ ] Error state renders if the API call fails.

**Completion criteria:** Task 4.8 is complete when all three files exist as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 4.9 — Article create page

**Objective:** Build `/admin/articles/new`, using Task 4.7's `article-form.tsx` in creation mode, submitting to the Task 4.5 `POST` endpoint.

**Files involved:** `/app/(admin)/admin/articles/new/page.tsx` (create).

**Dependencies:** Task 4.6's sibling, Task 4.5 (`POST` endpoint), and Task 4.7 (`article-form.tsx`) complete.

**Implementation notes:** On successful save, shows a success Toast (`11` §3.10) and redirects into edit mode for the newly created article (`13` §7 — "in create mode, the admin is transitioned into edit mode for the newly created article, avoiding accidental duplicate creation on a second save"). On validation failure, inline field errors are shown next to the relevant fields via `article-form.tsx`, plus a summary error Toast.

**Verification checklist:**
- [ ] Submitting a valid form creates the article and redirects to its edit view.
- [ ] Submitting an invalid form (e.g. missing title) shows inline field errors and does not navigate away.
- [ ] A slug collision is shown as an inline error next to the slug field, not a generic failure message.

**Completion criteria:** Task 4.9 is complete when `/app/(admin)/admin/articles/new/page.tsx` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 4.10 — Article edit page

**Objective:** Build `/admin/articles/[id]/edit`, using Task 4.7's `article-form.tsx` pre-populated with the existing record, submitting to the Task 4.6 `PUT` endpoint.

**Files involved:**
- `/app/(admin)/admin/articles/[id]/edit/page.tsx` (create)
- `/app/(admin)/admin/articles/[id]/edit/loading.tsx` (create)
- `/app/(admin)/admin/articles/[id]/edit/error.tsx` (create)

**Dependencies:** Task 4.6 (`GET`/`PUT` endpoints) and Task 4.7 (`article-form.tsx`) complete.

**Implementation notes:** Fetches the article server-side via `GET /api/admin/articles/[id]`; if not found, renders the `error.tsx` boundary (or a not-found state) rather than a broken form. On successful save, shows a success Toast; `id`/`createdAt` are never resubmitted as editable fields. The editor warns on navigating away with unsaved changes, per `13` §7 (client-side dirty-state check only, no persistence implication).

**Verification checklist:**
- [ ] Editing and saving an existing article persists the change and reflects it on return to the list view.
- [ ] Navigating to a non-existent `id` renders the error/not-found state, not a crash or blank form.
- [ ] Loading Skeleton renders while the existing record is being fetched.
- [ ] Attempting to navigate away with unsaved changes triggers a warning.

**Completion criteria:** Task 4.10 is complete when all three files exist as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 4.11 — Delete article flow wiring

**Objective:** Wire the shared Confirm Delete dialog (Phase 3, Task 3.6) into the Articles list page's row actions, calling the Task 4.6 `DELETE` endpoint.

**Files involved:** `/app/(admin)/admin/articles/page.tsx` (extends Task 4.8's file — same file, sequential).

**Dependencies:** Task 4.8 (list page) and Task 4.6 (`DELETE` endpoint) complete.

**Implementation notes:** Clicking Delete on a row opens the shared Confirm Delete dialog showing the article's title (`11` §3.6; `12` §5.4). On confirmation, calls `DELETE /api/admin/articles/[id]`, shows a success or error Toast, and refreshes the list (re-fetch or optimistic removal) without a full page reload.

**Verification checklist:**
- [ ] Confirm Delete dialog shows the correct article title before deletion.
- [ ] Confirming deletion removes the article from the list without a full page reload.
- [ ] Cancelling the dialog performs no deletion.
- [ ] A failed delete (simulate a server error) shows an error Toast and leaves the article in the list.

**Completion criteria:** Task 4.11 is complete when the delete flow is wired into `/app/(admin)/admin/articles/page.tsx` as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 4.12 — Loading, empty, and error state pass

**Objective:** Perform a consolidated pass across all Articles routes (list, create, edit) confirming loading, empty, and error states are complete and consistent, closing any gaps left by Tasks 4.8–4.11.

**Files involved:** `/app/(admin)/admin/articles/page.tsx`, `/app/(admin)/admin/articles/loading.tsx`, `/app/(admin)/admin/articles/error.tsx`, `/app/(admin)/admin/articles/new/page.tsx`, `/app/(admin)/admin/articles/[id]/edit/page.tsx`, `/app/(admin)/admin/articles/[id]/edit/loading.tsx`, `/app/(admin)/admin/articles/[id]/edit/error.tsx` (review/adjust only — no new files).

**Dependencies:** Tasks 4.8, 4.9, 4.10, and 4.11 complete.

**Implementation notes:** This is a verification-and-fix task, not a new-feature task. Confirm: no route ever renders a blank/broken screen on a slow network or a server error; every Toast-triggering action (create, update, delete, validation failure) is covered; the shared Loading Skeleton and Empty State components (Phase 3) are used consistently rather than ad hoc spinners or text.

**Verification checklist:**
- [ ] Every Articles route has a working `loading.tsx` or equivalent loading UI where it performs a server-side fetch.
- [ ] Every Articles route has a working `error.tsx` or equivalent error UI where a fetch can fail.
- [ ] The Empty State only appears on the list page when there are genuinely zero articles, never as a false-positive during loading.

**Completion criteria:** Task 4.12 is complete when every Verification checklist item passes across all Articles routes.

**STOP HERE. Wait for user approval before continuing.**

---

## Testing Checklist

✓ Article list loads and displays existing articles

✓ Creating an article persists it as `draft` with a valid, unique, auto-generated slug

✓ Editing an article persists changes and refreshes `updatedAt`

✓ Deleting an article removes it after explicit confirmation

✓ Slug collisions are rejected with a field-specific error, on both create and update

✓ All `/api/admin/articles*` routes reject unauthenticated requests with `401`

✓ Invalid submissions return `422` with field-mapped errors, surfaced inline in the form

✓ List, create, and edit routes each show correct loading, empty (list only), and error states

✓ No article route reads or writes `/content/articles.json` or `/public/images/articles/` from the client — only via `/api/admin/articles*`

---

## Completion Criteria

Phase 4 is complete when:
- Every task (4.1–4.12) is complete and its Verification checklist passes.
- The phase-wide Manual verification checklist (Phase Detail) passes.
- The Testing Checklist above passes in full.
- No file outside `/lib/modules/articles/`, `/app/api/admin/articles/`, `/components/admin/articles/`, and `/app/(admin)/admin/articles/` was created or modified.
- No Phase 1, 2, or 3 file was modified.

---

## Phase 4 Boundary — STOP HERE

Phase 4 ends with Task 4.12. Phase 4 must NOT implement:

- Image upload, image processing, or any write to `/public/images/articles/` (Phase 5)
- Media Library (Phase 6)
- Tiptap rich text editor configuration (deferred — plain textarea used instead, Scope Note 2)
- SEO metadata fields or Next.js metadata wiring (deferred, Scope Note 4)
- Publish/Unpublish workflow, dedicated status-transition endpoints, or `revalidatePath()` (deferred, Scope Note 1)
- Preview
- Interactive Search, Filtering, or Pagination UI on the Articles list (deferred, Scope Note 3 — the API response shape is implemented, the UI controls are not)
- Dashboard statistics or any change to Phase 1's dashboard page
- Any future module (Destinations, Tour Packages, Gallery, FAQ, UMKM, Homepage)

These belong to later phases and are out of scope for this document.

---

## Self-Review

**Against previous roadmap phases:**
- No file created in Phase 1, 2, or 3 is modified or duplicated. Phase 4 only adds new files under `/lib/modules/articles/`, `/app/api/admin/articles/`, `/components/admin/articles/`, and `/app/(admin)/admin/articles/`.
- Every shared component consumed (Page Header, Data Table, Form Components, Status Badge, Empty State, Loading Skeleton, Toast, Confirm Delete Dialog) is reused from Phase 3, not reimplemented.
- Every API route reuses Phase 2's `require-session.ts` rather than reimplementing session verification.

**Against the 20 architecture documents:**
- Data model (Task 4.1) matches `12-articles.md` §3, scoped per this phase's Interpretation Notes.
- Validation (Task 4.2) matches `17-article-validation.md`'s draft-save level.
- Storage (Task 4.4) follows the atomic write pattern and slug uniqueness rules in `04-storage-strategy.md` exactly.
- API contract (Tasks 4.5–4.6) matches `20-api-articles.md` and the standard response/status/code conventions in `19-api-overview.md` §6–7.
- No component in Task 4.7 duplicates a Phase 3 shared component, per `11-admin-components.md` §5.

**No scope overlap with later phases:** Image handling, Media Library, Tiptap, SEO, Publishing, and Search/Filter/Pagination UI are explicitly excluded from every task and named in the Phase 4 Boundary section above.

**No duplicated tasks:** Each of the 12 tasks produces a distinct file or file set with no overlapping responsibility.

**No contradictions:** The three points that could otherwise have contradicted this phase's own scope (status without a workflow, content without Tiptap, a list page without pagination UI against an API contract that mandates a paginated shape) are resolved explicitly in the Scope Interpretation Notes, each grounded in a specific cited section rather than invented.

**What I could not verify:** As with previous phases, I do not have independent access to a running repository — this self-review is a documentation-level consistency check against the architecture documents and previously finalized roadmap phases, not a code-level test run.

If this is consistent with your expectations, I'll wait for your review before creating Phase 5.