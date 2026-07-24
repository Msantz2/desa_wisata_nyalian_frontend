# Phase 7 — Content Workflow

> Part of the Nyalian Tourism Village Admin Dashboard — Implementation Roadmap.
> **Source of truth:** The 20 documents in `/docs/admin` (`01-admin-overview.md` through `20-api-articles.md`). Nothing in this document overrides them.
> This file follows the same organizational format as the finalized `01-phase-1-foundation.md` through `05-phase-5-image-management.md`.
> Cross-phase material (documentation notes, dependency graph, global implementation rules, development conventions, verification principles) lives in `00-overview-and-cross-phase-reference.md` and is referenced here, not repeated.

---

## Metadata

**Phase Name:** Phase 7 — Content Workflow

**Objective:** Implement the complete editorial content workflow for Articles — draft/published state transitions, publish-time validation, preview rendering, unsaved-changes handling, navigation guards, and the full integration of CRUD + Image Management + Media Library into a cohesive workflow — per `15-article-publishing.md`, with UI and API wiring per `13-article-editor.md`, `20-api-articles.md`, `17-article-validation.md`, and `18-media-library.md`.

**Dependencies:** Phase 1 (shell, routing) complete. Phase 2 (authentication) complete. Phase 3 (shared components) complete. Phase 4 (Article CRUD) complete. Phase 5 (image upload/processing/storage backend) complete. Phase 6 (Media Library page, image usage detection, orphan deletion) complete.

**Related Architecture Documents:** `15-article-publishing.md` (whole document) · `13-article-editor.md` §3, §7–8, §11–12 · `14-article-image.md` §7 (publish-time image warning) · `20-api-articles.md` §8 (publish/unpublish endpoints) · `17-article-validation.md` §3–5, §10 (two-level validation) · `18-media-library.md` §7 (orphan constraints) · `12-articles.md` §5–6 (article lifecycle) · `19-api-overview.md` (API conventions) · `11-admin-components.md` (shared Dialog, Toast components) · `06-security.md` §3–4 (session protection) · `02-admin-architecture.md` §5.2 (API layer).

**Expected Deliverables:** See "Files to create" / "Files to modify" below.

**Completion Criteria:** See "Completion criteria" below.

---

## Phase Detail

**Expected result:** An admin can edit an article in draft state and transition it to published via a confirmation dialog that validates all required fields (title, excerpt, content, cover image, cover alt text). Publishing succeeds only if all publish-level requirements are met; otherwise, a clear list of unmet requirements is shown. A published article is immediately visible on the public site (via revalidation, deferred to Phase 8). An admin can unpublish an article, reverting it to draft and removing it from public visibility. Throughout the editing session, a warning is shown if navigating away with unsaved changes. A preview mode allows viewing content as it will appear on the public site before publishing. The Media Library's orphan-detection logic enforces that an image cannot be deleted while referenced by an article.

**Scope Interpretation Notes:**

1. **Preview is rendered, not persisted.** `13-article-editor.md` §8 defines Preview as read-only. `15-article-publishing.md` has no `preview` state. Preview is client/server rendering of draft form data using public site template.

2. **Publish validation is two-level.** `17-article-validation.md` §3: draft-save permissive, publish strict. `coverImage` and `coverImageAlt` required only at publish time.

3. **Orphan handling respects Media Library.** `18-media-library.md` §7 prevents deletion of used images. Phase 7 does not implement orphan cleanup (Phase 6 responsibility); it only respects the constraint.

4. **Unsaved changes: client-side warning only.** `13-article-editor.md` §7 states "There is no autosave." Phase 7 implements navigate-away warning, not background persistence.

5. **`publishedAt` immutable once set.** `15-article-publishing.md` §4.2: preserved across unpublish/republish cycles.

6. **RBAC deferred.** `15-article-publishing.md` §8: role-based restrictions out of scope for v1.

7. **Field naming: flat `coverImageAlt`.** `20-api-articles.md` §4 uses flat shape; follow that contract, not `coverImage.alt` notation.

**Prerequisites:** All Phase 1–6 complete.

**Files to create:**
- `/components/admin/articles/publish-dialog.tsx`
- `/components/admin/articles/article-preview.tsx`
- `/components/admin/articles/unsaved-changes-context.tsx`
- `/app/(admin)/admin/articles/[id]/preview/page.tsx`
- `/app/api/admin/articles/[id]/publish/route.ts`
- `/app/api/admin/articles/[id]/unpublish/route.ts`

**Files to modify:**
- `/lib/modules/articles/schema.ts` — add publish-level validation schema.
- `/lib/modules/articles/service.ts` — add `publishArticle(id)` and `unpublishArticle(id)` functions.
- `/app/(admin)/admin/articles/[id]/edit/page.tsx` — add status toggle, publish dialog, preview link, unsaved warning integration.
- `/components/admin/articles/article-form.tsx` — call `setDirty()` on form changes, add `coverImageAlt` field.

**Things that must NOT be changed:**
- No modification to Phase 1–3 files.
- No automatic image deletion on publish/unpublish (images managed by Phase 6 Media Library).
- No separate `preview` state or `previewedAt` field.
- No autosave or background sync.
- No RBAC or role-based restrictions.
- No `revalidatePath()` implementation (Phase 8).
- No SEO, scheduled publishing, archiving, notifications, revision history.
- No changes to Media Library or Phase 4 CRUD flows.

**Manual verification checklist:**
- [ ] Draft with missing required fields cannot publish; dialog lists unmet requirements.
- [ ] Draft with all required fields publishes successfully; `publishedAt` set on first publish.
- [ ] Unpublish does not clear `publishedAt`.
- [ ] Republish preserves original `publishedAt`.
- [ ] Preview page renders article read-only using public site template.
- [ ] Editing and navigating away without saving triggers warning dialog.
- [ ] Saving article clears unsaved-changes flag; future navigation does not warn.
- [ ] Image referenced by article cannot be deleted from Media Library.
- [ ] Publish/Unpublish endpoints require session; `401` if missing.
- [ ] Publish validation failures return `422` with field-mapped error messages.

---

## Dependency Order

```
7.1 (schema publish-level validation)
  ├─▶ 7.2 (service: publishArticle/unpublishArticle)
  │     └─▶ 7.3 (routes: publish/unpublish endpoints)
  │           └─▶ 7.6 (error mapping verification pass)
  │
  ├─▶ 7.4 (unsaved changes context) — independent, can parallel
  │
  └─▶ 7.5 (preview route & component) — independent, can parallel
        
7.7 (publish dialog component) — depends only on Phase 3
  └─▶ 7.8 (editor integration: form + status + workflow)
```

---

## Tasks

### Task 7.1 — Publish-Level Validation Schema Extension

**Objective:** Extend the Articles schema from Phase 5 with stricter validation rules applied only at publish time, per `17-article-validation.md` §3–4, implementing Scope Note 2.

**Implementation steps:**

1. Open `/lib/modules/articles/schema.ts` (created in Phase 5, Task 5.6).
2. Identify the existing `draftSchema` (used for `POST /api/admin/articles` and `PUT /api/admin/articles/[id]`).
3. Keep `draftSchema` **unchanged** — it remains permissive, allowing incomplete articles to be saved.
4. Create a new `publishSchema` that extends or reuses `draftSchema`'s field definitions but with stricter required-ness:
   - `title` — required (already required at draft level).
   - `slug` — required (already required at draft level).
   - `category` — required (already required at draft level).
   - `excerpt` — required (already required at draft level).
   - `content` — required (already required at draft level).
   - `coverImage` — required at **publish level only** (was optional in draft schema, per Phase 5 Scope Note 5).
   - `coverImageAlt` — required at **publish level only** (was optional in draft schema).
5. Export both `draftSchema` and `publishSchema` as named exports.
6. Add a comment explaining the two-level validation model (draft vs. publish) with a link to `17-article-validation.md` §3.
7. Compile and verify no TypeScript errors.

**Expected outcome:**
- Draft-save validation remains unchanged and permissive (allows incomplete articles).
- Publish validation enforces all fields including image metadata.
- Both schemas coexist in the same file, clearly labeled.
- No runtime behavior change; only schema definitions added.

**Files involved:** `/lib/modules/articles/schema.ts` (modify).

**Dependencies:** Phase 5 Task 5.6 complete (schema file exists with draft schema and image fields).

**Verification:**
- [ ] `draftSchema` still validates successfully with only `title`, `slug`, `category` (no content, no images).
- [ ] `publishSchema` rejects submission with only `title`, `slug`, `category`; requires `content`, `coverImage`, `coverImageAlt`.
- [ ] TypeScript compilation passes with no `any` types.
- [ ] Both schemas can be imported independently.

**Common mistakes to avoid:**
- **Mistake:** Modifying the existing draft schema instead of creating a new publish schema. This breaks existing draft-save functionality.
  - **Prevention:** Comment clearly that `draftSchema` is immutable; create `publishSchema` as a new object.
- **Mistake:** Using nested validation (e.g. `coverImage.alt`) instead of flat `coverImageAlt` field.
  - **Prevention:** Refer to `20-api-articles.md` §4 as the source of truth for field names.
- **Mistake:** Making image fields optional in both schemas.
  - **Prevention:** Explicitly document that image fields transition from optional → required at publish time.

**Completion criteria:** Task 7.1 is complete when both schemas exist, compile with no errors, and every Verification item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 7.2 — Publish/Unpublish Service Functions

**Objective:** Add `publishArticle(id)` and `unpublishArticle(id)` functions to the Articles service, implementing state transitions and the `publishedAt` immutability requirement per `15-article-publishing.md` §4–5.

**Implementation steps:**

1. Open `/lib/modules/articles/service.ts` (created in Phase 4, extended in Phase 5).
2. Locate the existing CRUD functions: `listArticles`, `getArticleById`, `getArticleBySlug`, `createArticle`, `updateArticle`, `deleteArticle`.
3. Add `publishArticle(id: string): Promise<Article>`:
   - Validate that an article with the given `id` exists; throw `NotFoundError` if not.
   - Validate the article's data against `publishSchema` (from Task 7.1); throw `ValidationError` with field-mapped errors if validation fails.
   - Set `status: 'published'`.
   - If `publishedAt` is `null` or `undefined`, set it to `new Date()` (current timestamp).
   - If `publishedAt` is already set, **do not modify it** (preserves original publish date).
   - Refresh `updatedAt` to current timestamp (per `04-storage-strategy.md` §5).
   - Persist via the atomic write pattern (per `04-storage-strategy.md` §8.2).
   - Return the updated article record.
4. Add `unpublishArticle(id: string): Promise<Article>`:
   - Validate that an article with the given `id` exists; throw `NotFoundError` if not.
   - Set `status: 'draft'`.
   - **Do not modify `publishedAt`** — it remains unchanged (per Scope Note 5).
   - Refresh `updatedAt` to current timestamp.
   - Persist via the atomic write pattern.
   - Return the updated article record.
5. Add JSDoc comments to both functions explaining the behavior, especially `publishedAt` immutability.
6. Do not modify any existing function's signature or behavior.

**Expected outcome:**
- `publishArticle` transitions draft → published, sets `publishedAt` on first publish only.
- `unpublishArticle` transitions published → draft, preserves `publishedAt`.
- Both functions throw typed errors for validation/not-found cases (to be mapped by route handlers in Task 7.3).
- No CRUD function behavior changed; only two new functions added.

**Files involved:** `/lib/modules/articles/service.ts` (modify).

**Dependencies:** Task 7.1 (publish schema exists), Phase 4 Task 4.4 (service exists), Phase 5 Task 5.7 (`getArticleBySlug` exists).

**Verification:**
- [ ] Publishing a draft article with all required fields succeeds, sets `status: 'published'`, and sets `publishedAt`.
- [ ] Publishing a draft article missing required fields throws `ValidationError` listing missing fields.
- [ ] Unpublishing a published article succeeds, sets `status: 'draft'`, and **does not clear** `publishedAt`.
- [ ] Publishing → unpublishing → publishing preserves the original `publishedAt` from the first publish.
- [ ] Existing service functions (`listArticles`, `getArticleById`, `updateArticle`) are not affected.

**Common mistakes to avoid:**
- **Mistake:** Clearing `publishedAt` on unpublish.
  - **Prevention:** Add explicit comment/assertion that `publishedAt` is **not touched** in `unpublishArticle`.
- **Mistake:** Always updating `publishedAt` even if already set.
  - **Prevention:** Use `if (article.publishedAt === null)` guard before setting.
- **Mistake:** Not validating against `publishSchema` before publishing.
  - **Prevention:** Call schema validation explicitly; let it throw if fields are missing.
- **Mistake:** Using direct object mutation instead of atomic write.
  - **Prevention:** Follow the same atomic write pattern as `createArticle` (Phase 4, Task 4.3).

**Completion criteria:** Task 7.2 is complete when both functions exist, handle all cases correctly, and every Verification item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 7.3 — Publish/Unpublish Route Handlers

**Objective:** Implement two dedicated state-transition API endpoints per `20-api-articles.md` §8, composing the service functions from Task 7.2 with session verification, error mapping, and correct response envelopes.

**Implementation steps:**

1. Create `/app/api/admin/articles/[id]/publish/route.ts`:
   - Export an async `POST` handler function.
   - Begin with `const session = await require-session.ts()` (Phase 2 Task 2.7); return `401 UNAUTHORIZED` if missing.
   - Extract `id` from `params.id` (Next.js dynamic route param).
   - Call `publishArticle(id)` from the service (Task 7.2).
   - If successful, return `200 OK` with response envelope: `{ success: true, data: { updated article } }` per `20-api-articles.md` §8.
   - On `ValidationError`, return `422 UNPROCESSABLE_ENTITY` with response envelope: `{ success: false, code: 'VALIDATION_ERROR', message: '...', errors: [ { field, message }, ... ] }` per `19-api-overview.md` §6.2.
   - On `NotFoundError`, return `404 NOT_FOUND` with appropriate error envelope per `19-api-overview.md` §7.
   - On unexpected errors, return `500 INTERNAL_SERVER_ERROR` with generic message (log detailed error server-side only, per `06-security.md` §13).
   - Add a **TODO comment** noting where `revalidatePath()` should be added in Phase 8: `// TODO Phase 8: Add revalidatePath() for public site caching per 05-deployment.md §6`.

2. Create `/app/api/admin/articles/[id]/unpublish/route.ts`:
   - Export an async `POST` handler function.
   - Begin with session verification; return `401` if missing.
   - Extract `id` from `params.id`.
   - Call `unpublishArticle(id)` from the service (Task 7.2).
   - If successful, return `200 OK` with updated article (no validation failures possible).
   - On `NotFoundError`, return `404 NOT_FOUND`.
   - On unexpected errors, return `500 INTERNAL_SERVER_ERROR`.
   - Add the same TODO comment for `revalidatePath()`.

3. Ensure both routes:
   - Use consistent error mapping with Phase 4's `PUT /api/admin/articles/[id]` (Task 4.6).
   - Follow the API response envelope contract exactly per `20` §8 and `19-api-overview.md` §6–7.
   - Do not accept any request body (pure state-transition endpoints).
   - Return the full updated article record, not just the `id`.

**Expected outcome:**
- Two new endpoints callable via `POST`.
- Publish succeeds for draft with all required fields; fails with `422` + field-mapped errors if missing.
- Unpublish succeeds for any published article; no validation failures.
- Both require session; `401` if missing.
- Both return correct status codes and error envelopes.
- TODO comments mark where Phase 8 will add `revalidatePath()`.

**Files involved:** `/app/api/admin/articles/[id]/publish/route.ts` (create), `/app/api/admin/articles/[id]/unpublish/route.ts` (create).

**Dependencies:** Task 7.2 (service functions), Phase 2 Task 2.7 (`require-session.ts`), Phase 4 Task 4.6 (existing error mapping pattern from `PUT` endpoint).

**Verification:**
- [ ] `POST /api/admin/articles/[id]/publish` on draft with all required fields returns `200` with updated article, `status: 'published'`.
- [ ] `POST /api/admin/articles/[id]/publish` on draft missing required fields returns `422` with `errors` array listing missing fields.
- [ ] `POST /api/admin/articles/[id]/unpublish` on published article returns `200` with updated article, `status: 'draft'`.
- [ ] `POST /api/admin/articles/[id]/unpublish` on already-draft article succeeds (idempotent or explicit check — either acceptable if documented).
- [ ] Both endpoints return `404` when `id` does not exist.
- [ ] Both endpoints return `401` without a session.
- [ ] Error envelopes match `19-api-overview.md` §6–7 exactly.
- [ ] TODO comment for `revalidatePath()` present in both files.

**Common mistakes to avoid:**
- **Mistake:** Using `20-api-articles.md` §5–7's endpoint patterns (CRUD) instead of §8's state-transition pattern for these endpoints.
  - **Prevention:** Explicitly reference §8 in code comments; use dedicated routes, not parameter flags.
- **Mistake:** Accepting a request body or query parameters.
  - **Prevention:** These are pure state-transition endpoints; ignore any body/query data.
- **Mistake:** Clearing `publishedAt` in the unpublish endpoint if it's somehow added in the service.
  - **Prevention:** Verify in Task 7.2 that `unpublishArticle` does not touch `publishedAt`; the endpoint should never clear it.
- **Mistake:** Implementing `revalidatePath()` in this phase.
  - **Prevention:** Leave it as a TODO for Phase 8; do not add it yet.
- **Mistake:** Returning a different response shape than `{ success, data, code, message, errors }`.
  - **Prevention:** Copy the response shape from Phase 4's error handling (Task 4.12) and adapt it for publish-specific errors.

**Completion criteria:** Task 7.3 is complete when both route files exist, handle all error cases correctly, and every Verification item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 7.4 — Unsaved Changes Warning (Context & Hook)

**Objective:** Implement client-side dirty-state tracking and a warning dialog when navigating away with unsaved changes, per `13-article-editor.md` §7 and Scope Note 4.

**Implementation steps:**

1. Create `/components/admin/articles/unsaved-changes-context.tsx`:
   - Define a React Context to hold dirty state and navigation callbacks.
   - Export the context provider component `UnsavedChangesProvider`.
   - Export a custom hook `useUnsavedChanges()` that provides:
     - `isDirty: boolean` — current dirty state.
     - `setDirty(value: boolean): void` — setter for dirty state.

2. Implement the provider logic:
   - Use `useRouter()` from `next/router` to detect navigation attempts.
   - When the user attempts to navigate (via `router.beforePopState` or a route change event), check if `isDirty` is true.
   - If dirty, show the shared Dialog component (Phase 3 Task 3.6) with:
     - Title: "You have unsaved changes"
     - Message: "Do you want to leave without saving? Your changes will be lost."
     - Two buttons: "Cancel" (stays on page) and "Leave" (proceeds with navigation).
   - "Cancel" does nothing (dialog closes, page stays).
   - "Leave" clears `isDirty` (set to false) and allows navigation to proceed.

3. Wrap the editor page and form with `UnsavedChangesProvider` (will be done in Task 7.8).

4. The `article-form.tsx` component (Phase 4) will call `setDirty(true)` whenever any form field changes, and `setDirty(false)` when the form is successfully saved (in Task 7.8).

5. This is **client-side only**; no backend polling, no autosave, no background persistence (per Scope Note 4).

**Expected outcome:**
- Context provider and hook available for use in editor components.
- Hook returns dirty state and setter.
- Dialog shown automatically when dirty=true and user attempts navigate.
- Clean separation of concerns: context owns state/routing logic, form component owns "when to set dirty."

**Files involved:** `/components/admin/articles/unsaved-changes-context.tsx` (create).

**Dependencies:** Phase 3 Task 3.6 (Dialog component exists).

**Verification:**
- [ ] Hook is importable and usable in component.
- [ ] Calling `setDirty(true)` causes a warning dialog on navigate-away.
- [ ] Clicking "Cancel" on the dialog prevents navigation.
- [ ] Clicking "Leave" clears dirty state and allows navigation.
- [ ] After saving (setDirty(false)), navigating away does not show warning.

**Common mistakes to avoid:**
- **Mistake:** Using browser `beforeunload` event instead of Next.js router events.
  - **Prevention:** Use `useRouter()` from `next/router` and listen to route change events, which works better with Next.js's client-side routing.
- **Mistake:** Clearing dirty state in the dialog's "Leave" button before navigation completes.
  - **Prevention:** Clear dirty first (so a second navigation doesn't warn), then allow navigation.
- **Mistake:** Blocking navigation entirely instead of warning.
  - **Prevention:** Always allow "Leave" to proceed; only warn, don't block.
- **Mistake:** Not wrapping the context provider around the editor page.
  - **Prevention:** Task 7.8 will handle wrapping; document that this context must wrap the edit page for it to work.

**Completion criteria:** Task 7.4 is complete when the context file exists, provides the hook correctly, and every Verification item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 7.5 — Article Preview Route & Component

**Objective:** Implement a read-only preview page that renders the article using the public site's display template, per `13-article-editor.md` §8 and Scope Note 1.

**Implementation steps:**

1. Create `/app/(admin)/admin/articles/[id]/preview/page.tsx`:
   - This is a Server Component (default in Next.js App Router).
   - Extract `id` from `params.id`.
   - Fetch the article via `getArticleById(id)` from the Phase 4 service (Task 4.4).
   - If not found, render a 404 or error state.
   - Pass the article data to `ArticlePreview` component (step 2).
   - Include a header with a "Back to Editor" link (`/admin/articles/[id]/edit`).

2. Create `/components/admin/articles/article-preview.tsx`:
   - This is a Server or Client component (implementation choice, either is acceptable).
   - Accept props: `article` (Article record) and `onClose` (optional callback).
   - Render the article using the **same template/component used on the public site** for displaying articles.
   - Include a "Preview" label or badge to make it clear this is an admin preview, not the public site.
   - Do **not** include admin controls (edit button, delete button, etc.) — this is read-only.
   - Include a back button that navigates to the editor (`/admin/articles/[id]/edit`).
   - If the article is currently in draft state, optionally include a note: "This shows the last saved version. Unsaved form changes are not reflected here."
   - Use the shared styling from Phase 3 (headings, spacing) to match the admin dashboard aesthetic.

3. Ensure the preview:
   - Shows the **saved state** of the article, not unsaved form changes.
   - Renders all article fields: title, slug, category, excerpt, content, cover image with alt text.
   - Is read-only (no edit, delete, or state-change controls).
   - Is reachable from the edit page via a "Preview" link (Task 7.8 will add this).

**Expected outcome:**
- New route `/admin/articles/[id]/preview` accessible from the editor.
- Preview renders article read-only using public site's template.
- Clear visual distinction from public site (admin header, back button).
- No data modified; no side effects.

**Files involved:** `/app/(admin)/admin/articles/[id]/preview/page.tsx` (create), `/components/admin/articles/article-preview.tsx` (create).

**Dependencies:** Phase 4 Task 4.4 (`getArticleById` service function), Phase 4 Task 4.5 (public site article display component or template available for reuse).

**Verification:**
- [ ] `/admin/articles/[id]/preview` loads without error.
- [ ] Preview displays the article's saved title, content, images, cover alt text.
- [ ] Preview is read-only; no edit controls visible.
- [ ] Preview is clearly labeled as preview.
- [ ] Back button works and returns to editor.
- [ ] If article not found, error state or 404 is shown.

**Common mistakes to avoid:**
- **Mistake:** Creating a separate custom preview template instead of reusing the public site's article display.
  - **Prevention:** Find where the public site renders articles and import that component into the preview.
- **Mistake:** Making the preview a Client Component that fetches data in `useEffect`.
  - **Prevention:** Use Server Components (default); fetch in the page component, pass to child.
- **Mistake:** Including "Edit this article" or "Publish" buttons in the preview.
  - **Prevention:** Preview is read-only; navigation back to editor is the only action.
- **Mistake:** Showing unsaved form changes in the preview.
  - **Prevention:** Preview fetches from the database (saved state only), not from form state.

**Completion criteria:** Task 7.5 is complete when both files exist, preview renders correctly, and every Verification item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 7.6 — Error Handling & Status Mapping Verification Pass

**Objective:** Perform a consolidated review of the publish/unpublish endpoints' (Task 7.3) error handling and response mappings against `19-api-overview.md` §6–7 and `20-api-articles.md` §8, ensuring correctness before wiring into the editor.

**Implementation steps:**

1. Open the two route files created in Task 7.3.
2. For each error case defined in `20-api-articles.md` §8, verify:
   - **Missing session** → `401 UNAUTHORIZED`, code `UNAUTHORIZED`, message appropriate.
   - **Article not found** → `404 NOT_FOUND`, code `NOT_FOUND`.
   - **Publish validation failure** (missing `coverImage`, etc.) → `422 UNPROCESSABLE_ENTITY`, code `VALIDATION_ERROR`, `errors` array with field-mapped errors.
   - **Unexpected internal error** (e.g. filesystem error, database corruption) → `500 INTERNAL_SERVER_ERROR`, code `INTERNAL_ERROR`, message generic (log detailed error server-side only).
3. For each status code, verify the response body structure matches `19-api-overview.md` §6–7:
   - Success: `{ success: true, data: { ...updated article... } }`
   - Validation error: `{ success: false, code: 'VALIDATION_ERROR', message: '...', errors: [ { field: 'coverImage', message: 'required' }, ... ] }`
   - Other error: `{ success: false, code, message, errors? }`
4. Verify that no endpoint returns an error response with a stack trace, filesystem path, or internal exception details.
5. Ensure the unpublish endpoint has **no validation failures** — any article can be unpublished, so only not-found and internal-error cases apply.

**Expected outcome:**
- All error cases verified against architecture documents.
- Response shapes confirmed correct.
- No internal leakage of sensitive details.
- Ready to wire into editor UI (Task 7.8).

**Files involved:** `/app/api/admin/articles/[id]/publish/route.ts`, `/app/api/admin/articles/[id]/unpublish/route.ts` (review/adjust only — no new files).

**Dependencies:** Task 7.3 complete.

**Verification:**
- [ ] Every error case in `20-api-articles.md` §8 is testable and returns exact specified status/code.
- [ ] No response body contains internal details (stack traces, paths, exception names).
- [ ] Validation error messages are user-friendly and map to specific missing fields.
- [ ] Unpublish endpoint has no validation failures (only not-found and internal errors).

**Common mistakes to avoid:**
- **Mistake:** Checking response shapes only; ignoring error message clarity.
  - **Prevention:** Read `20-api-articles.md` §8 in full; ensure error messages are actionable for the admin.
- **Mistake:** Leaving debug logging that includes internal details.
  - **Prevention:** Log full details server-side; return only generic messages to client.
- **Mistake:** Returning `400 BAD_REQUEST` for validation errors instead of `422`.
  - **Prevention:** Use `422 UNPROCESSABLE_ENTITY` per `19-api-overview.md` §7's distinction: `400` = malformed request, `422` = well-formed but violates business logic.

**Completion criteria:** Task 7.6 is complete when all Verification items pass and both route files are confirmed correct against the architecture documents.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 7.7 — Publish Confirmation Dialog & Status Toggle UI

**Objective:** Build the editor's status field with a publish toggle/button and a confirmation dialog that summarizes what will be published and validates required fields, per `15-article-publishing.md` §4.1 and `13-article-editor.md` §3.

**Implementation steps:**

1. Create `/components/admin/articles/publish-dialog.tsx`:
   - Export `PublishDialog` component.
   - Accept props:
     - `article: Article` — current article data.
     - `onPublish: () => Promise<void>` — async callback when publish is confirmed.
     - `isLoading: boolean` — show spinner during publish.
     - `validationErrors?: FieldError[]` — array of validation failures, if any.
   - Render using the shared Dialog component (Phase 3 Task 3.6):
     - Title: "Publish Article" or "Ready to Publish?"
     - Body:
       - Summary text: "Publishing will make this article visible to all visitors on the public site."
       - Checklist of required fields:
         - ✓ Title (with value displayed, e.g. "My Article Title")
         - ✓/✗ Cover Image (with visual preview or "Not set")
         - ✓/✗ Cover Image Alt Text (with text or "Not provided")
         - ✓ Category
         - ✓ Excerpt
         - ✓ Content
       - If any field is missing, highlight it with ✗ and a brief red indicator.
   - Buttons:
     - "Cancel" — closes dialog, no action.
     - "Publish" — calls `onPublish()` callback if all fields present, disabled if missing.
   - While publishing (`isLoading=true`), show a spinner and disable the Publish button.
   - If `validationErrors` provided (returned from the server after a failed publish attempt), display them in a list below the checklist.

2. The dialog's logic for determining which fields are missing:
   - Can be done client-side (checking the form data before opening dialog) or server-side (server returns validation errors, dialog shows them).
   - Either approach is acceptable; document the chosen approach in a comment.

3. Use the shared Dialog, Button, and Icon components from Phase 3.

**Expected outcome:**
- Reusable dialog component for publish confirmation.
- Shows summary and checklist of required fields.
- Disable Publish button if required fields missing.
- Clear feedback on what's blocking publish.

**Files involved:** `/components/admin/articles/publish-dialog.tsx` (create).

**Dependencies:** Phase 3 Task 3.6 (Dialog, Button, Icon components).

**Verification:**
- [ ] Dialog displays and can be closed with Cancel button.
- [ ] Dialog shows summary of what publishing means.
- [ ] All required fields listed with checkmarks (✓) or crosses (✗).
- [ ] Publish button disabled when any required field missing.
- [ ] Clicking Publish when all fields present calls the `onPublish` callback.
- [ ] While publishing, spinner shown and button disabled.

**Common mistakes to avoid:**
- **Mistake:** Hardcoding which fields are required instead of reading from the schema.
  - **Prevention:** Either fetch the schema's required fields, or use a constant matching the `publishSchema` from Task 7.1.
- **Mistake:** Not showing a visual preview of images in the checklist.
  - **Prevention:** Display the cover image thumbnail if available; helps the admin confirm the right image is selected.
- **Mistake:** Not disabling the Publish button when fields are missing.
  - **Prevention:** Explicitly check that all required fields are non-empty before enabling the button.
- **Mistake:** Hiding the validation errors if the server returns them.
  - **Prevention:** Display the `validationErrors` array (if provided) in a separate error section below the checklist.

**Completion criteria:** Task 7.7 is complete when the component exists, renders correctly, and every Verification item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 7.8 — Editor UI Integration (Status, Publish, Preview, Unsaved Warning)

**Objective:** Integrate the publish/unpublish workflow, preview, and unsaved-changes detection into the existing article editor page, wiring components from Tasks 7.4–7.7 into the editing flow.

**Implementation steps:**

1. Modify `/app/(admin)/admin/articles/[id]/edit/page.tsx`:
   - Wrap the entire page content with `UnsavedChangesProvider` (Task 7.4) at the top level.
   - Add a **side panel** (right side of the page, below or beside the main form):
     - Display the article's current status: "Draft" or "Published".
     - Display the publish date: `publishedAt` (if published), or `createdAt` (if draft).
     - Show two buttons:
       - If `status: 'draft'`: "Publish" button (opens `PublishDialog` from Task 7.7).
       - If `status: 'published'`: "Unpublish" button (can open confirmation dialog or call endpoint directly, either is acceptable if documented).
     - Add a "Preview" link/button that opens `/admin/articles/[id]/preview` in a new tab or modal.
   - Handle the response from publish/unpublish endpoints (Task 7.3):
     - On `200`, update the local article state to reflect the new status.
     - On `422` validation error, pass the error to `PublishDialog` to display the list of missing fields.
     - On `404` or `401`, show an error toast (Phase 3 Task 3.4).

2. Modify `/components/admin/articles/article-form.tsx` (Phase 4):
   - Import `useUnsavedChanges()` hook from Task 7.4.
   - Call `setDirty(true)` whenever any form field changes (can be done via an onChange handler on the form container or on individual fields — either approach is acceptable).
   - Call `setDirty(false)` after a successful `PUT /api/admin/articles/[id]` save (already making the API call in Phase 4; just add the setDirty call after success).
   - Add a `coverImageAlt` field (if not already present from Phase 5):
     - Render as a textarea or text input below the `coverImage` field.
     - Label: "Alt Text for Cover Image" or "Cover Image Description".
     - Placeholder: "Describe the cover image for accessibility".
     - Include a note (optional): "Required to publish the article."

3. Modify `/app/(admin)/admin/articles/[id]/edit/error.tsx`:
   - This file already exists (Phase 4) to show fetch/load errors.
   - Distinguish between:
     - Load-time errors (article not found, permission denied) — show existing error boundary UI.
     - Publish validation errors (missing fields) — these come from the endpoint and are shown in the dialog (Task 7.8 step 1 handles this).
   - No changes needed if the distinction is already handled; only add comments if clarifying the error boundaries.

4. Update the editor's layout to include the side panel:
   - Left: existing form (title, slug, category, excerpt, content, cover image, cover alt, etc.).
   - Right: status display + publish/unpublish buttons + preview link.
   - On mobile, the panel can move below the form or collapse into an accordion.

**Expected outcome:**
- Editor page displays article status and publish/unpublish controls.
- Publish button opens confirmation dialog (Task 7.7).
- Unpublish button changes status (with optional confirmation).
- Preview link opens read-only preview (Task 7.5).
- Editing form and navigating away shows unsaved-changes warning (Task 7.4).
- Saving clears the unsaved-changes warning.
- All publish/unpublish errors shown to the user clearly.

**Files involved:**
- `/app/(admin)/admin/articles/[id]/edit/page.tsx` (modify)
- `/components/admin/articles/article-form.tsx` (modify)
- `/app/(admin)/admin/articles/[id]/edit/error.tsx` (modify — may only need comments)

**Dependencies:** Tasks 7.1–7.7 complete.

**Verification:**
- [ ] Status panel visible on the edit page showing "Draft" or "Published" with date.
- [ ] Publish button visible for drafts, disabled if required fields missing.
- [ ] Clicking Publish opens the confirmation dialog (Task 7.7).
- [ ] Publishing a complete draft updates status to "Published" and shows success feedback.
- [ ] Publishing a incomplete draft shows validation errors in the dialog, does not transition status.
- [ ] Unpublish button visible for published articles, successfully reverts to draft.
- [ ] Preview link opens read-only preview page.
- [ ] Editing the form and navigating away shows unsaved-changes warning.
- [ ] Saving the form clears the unsaved-changes warning.
- [ ] `coverImageAlt` field visible and functional.

**Common mistakes to avoid:**
- **Mistake:** Not wrapping the page with `UnsavedChangesProvider`.
  - **Prevention:** Add the provider wrapper at the top of the page component.
- **Mistake:** Calling `setDirty(true)` on every render instead of only on form change.
  - **Prevention:** Use onChange handlers on form fields, not in render/useEffect.
- **Mistake:** Clearing the unsaved-changes flag before the save API call succeeds.
  - **Prevention:** Call `setDirty(false)` only after the `PUT` response is successful.
- **Mistake:** Not passing validation errors from the server to the `PublishDialog`.
  - **Prevention:** Store errors in state, pass to dialog as a prop, render them in the dialog.
- **Mistake:** Hardcoding the `coverImageAlt` field's label/placeholder instead of using a constant or i18n.
  - **Prevention:** Use a comment or constant for the field label for consistency.
- **Mistake:** Implementing unpublish without a confirmation (user accidentally clicks button).
  - **Prevention:** Show a confirmation dialog for unpublish as well, or at minimum a toast asking "Are you sure?"

**Completion criteria:** Task 7.8 is complete when all three files are updated, the editor displays the status panel and buttons correctly, the workflow is functional end-to-end, and every Verification item passes.

**STOP HERE. Wait for user approval before continuing.**

---

## Testing Checklist

✓ Saving a draft with minimal fields (title, category, excerpt, content only — no cover image) succeeds; article remains in `draft` status

✓ Publishing a draft with all required fields (title, category, excerpt, content, coverImage, coverImageAlt) succeeds; status changes to `published` and `publishedAt` is set to current time

✓ Publishing a draft missing the cover image fails with a `422` response listing `coverImage` as a missing required field; dialog shows the unmet requirement

✓ Publishing a draft missing cover alt text fails with a `422` response; dialog shows `coverImageAlt` as missing

✓ Unpublishing a published article succeeds; status changes to `draft`, `publishedAt` is preserved

✓ Republishing an unpublished article (that was previously published) preserves the original `publishedAt` from the first publish date

✓ Preview page (`/admin/articles/[id]/preview`) renders the article in read-only mode using the public site's template

✓ Preview displays the saved article data (title, cover image, content), not unsaved form changes

✓ Editing the article's title in the form and navigating away (e.g., clicking back button) shows a warning dialog

✓ Clicking "Cancel" on the warning dialog prevents navigation and returns to the editor

✓ Clicking "Leave" on the warning dialog discards unsaved changes and navigates away

✓ Saving the article via the form's Save button clears the unsaved-changes flag; future navigation does not warn

✓ An image that is referenced by a published article cannot be deleted from the Media Library (delete action disabled or returns error)

✓ Publish and Unpublish endpoints (`POST /api/admin/articles/[id]/publish`, `POST /api/admin/articles/[id]/unpublish`) require a valid session; requests without a session return `401 UNAUTHORIZED`

✓ Publish endpoint returns `200 OK` with updated article record on successful publish

✓ Publish endpoint returns `422 UNPROCESSABLE_ENTITY` with `errors` array on validation failure

✓ Unpublish endpoint returns `200 OK` with updated article record on successful unpublish

---

## Manual Verification Checklist

- [ ] A draft article with missing required fields cannot transition to published; the dialog clearly lists each unmet requirement.
- [ ] A draft article with all required fields publishes successfully; the article's status changes to "Published" and `publishedAt` is set.
- [ ] Unpublishing a published article reverts it to draft status without clearing `publishedAt`.
- [ ] Republishing an article that was previously unpublished preserves the original `publishedAt`.
- [ ] The preview page renders the article read-only, using the public site's article display template.
- [ ] Editing an article and attempting to navigate away triggers a warning dialog.
- [ ] Saving the article clears the unsaved-changes warning.
- [ ] An image currently referenced by a published or draft article cannot be deleted from the Media Library.
- [ ] Both publish and unpublish endpoints require a valid session; `401` is returned if missing.
- [ ] Publish-time validation errors return `422` with field-mapped error messages.

---

## Completion Criteria

Phase 7 is complete when:

1. All 8 tasks (7.1–7.8) are implemented and each task's Verification checklist passes.
2. The Manual verification checklist above passes in full.
3. The Testing Checklist above passes in full.
4. No file outside the explicitly listed create/modify paths was created or modified.
5. No Phase 1–3 file was modified; Phase 4, 5, 6 files modified only as explicitly listed in the task breakdown.
6. Publish/Unpublish endpoints are functional and callable but **do not yet trigger `revalidatePath()`** (that is Phase 8, per the TODO comments added in Task 7.3).
7. The entire workflow (edit → publish → preview → unpublish) is functional end-to-end.

---

## Phase 7 Boundary — STOP HERE

Phase 7 ends with Task 7.8. Phase 7 must **NOT** implement:

- Dashboard statistics, dashboard data wiring, or dashboard polish (`09-admin-dashboard.md` — Phase 8+).
- Security headers, HTTPS enforcement, or production hardening (`06-security.md` §11 — Phase 8).
- Deployment, infrastructure, or environment configuration (`05-deployment.md` — Phase 8).
- `revalidatePath()`, `revalidateTag()`, or other Next.js caching/revalidation logic (`05-deployment.md` §6 — Phase 8).
- Testing, test suites, unit tests, integration tests, or test utilities — Phase 7 is implementation-only.
- Analytics, telemetry, monitoring, or error tracking.
- SEO metadata fields (og:image, meta tags, canonical URLs) beyond the existing schema (`16-article-seo.md` — deferred).
- Revision history, version comparison, soft deletes, or audit trails (`01-admin-overview.md` §4 — deferred).
- Autosave, background sync, or incremental saves (`13-article-editor.md` §13 — explicitly out of scope for v1).
- Scheduled publishing, archived state, or future-date publishing (`15-article-publishing.md` §9 — out of scope v1).
- RBAC, role-based publish restrictions, editor roles, or permission checks (`15-article-publishing.md` §8 — deferred for future phases).
- Notifications, emails, Slack messages, or external integrations on publish.
- Any modifications to the Media Library (`18-media-library.md`) or its orphan detection logic.
- Any future modules (Destinations, Tour Packages, Gallery, FAQ, UMKM, Homepage).

These belong to Phase 8 (Production Readiness) or later phases and are out of scope for this document.

---

## Self-Review

### Against Previous Roadmap Phases (00–06)

✓ **Phase 1–3 files unmodified:** No files created or modified in foundational layers.
✓ **Phase 4 extended, not replaced:** CRUD flows unchanged; only status UI and workflow added around existing create/update/delete.
✓ **Phase 5 schema extended, not replaced:** Draft schema unchanged; new publish schema added alongside it. Image upload/processing unchanged.
✓ **Phase 6 (Media Library) respected, not reimplemented:** Orphan deletion constraints acknowledged; Phase 7 does not duplicate Media Library logic, only respects the usage constraint.
✓ **Session verification reused:** Both endpoints use Phase 2's `require-session.ts` rather than reimplementing authentication.
✓ **Error mapping consistent:** Publish/Unpublish endpoints follow Phase 4's error mapping pattern for consistency.

### Against All 20 Architecture Documents

✓ **Publishing workflow (Tasks 7.2–7.3, 7.8) matches `15-article-publishing.md` §3–6:**
   - Separate save and publish actions (§3).
   - State transitions: draft ↔ published (§2, §3, §5).
   - `publishedAt` immutability across unpublish/republish (§4.2).
   - Validation levels: permissive draft, strict publish (§4.3).
   - Revalidation as a documented side effect (§6) — TODO for Phase 8.

✓ **Editor UI (Task 7.8) matches `13-article-editor.md` §3, §7–8:**
   - Status toggle visible (§3).
   - Save and publish are distinct actions (§7).
   - Unsaved changes warning on navigate-away (§7) — no autosave (§13).
   - Preview as read-only view (§8).

✓ **Preview (Task 7.5) matches `13-article-editor.md` §8:**
   - Read-only rendering using public site logic.
   - No separate persisted state.

✓ **Publish validation (Task 7.1) matches `17-article-validation.md` §3–4, §10:**
   - Two-level validation: draft permissive, publish strict (§3).
   - Specific required fields at publish time (§4).
   - Structured error responses with field mapping (§10).

✓ **API contract (Task 7.3) matches `20-api-articles.md` §8:**
   - Publish and Unpublish endpoints defined (§8).
   - Request and response shapes specified (§8).
   - Error status codes and messages (§8).

✓ **Unsaved changes (Task 7.4) matches `13-article-editor.md` §7:**
   - Warning on navigate-away.
   - No autosave.

✓ **Image constraints (Task 7.8) respect `14-article-image.md` §7 and `18-media-library.md` §7:**
   - Used images cannot be deleted (Media Library constraint).
   - Alt text required at publish time (per publish schema in Task 7.1).

✓ **Error handling (Task 7.6) matches `19-api-overview.md` §6–7:**
   - Status codes and error codes per §7.
   - Error response structure per §6.

✓ **Security (Tasks 7.3, 7.8) match `06-security.md` §3–4:**
   - Session protection on state-change endpoints.
   - No internal details in error responses (§13).

### No Scope Overlap with Phase 8+

✓ **Dashboard:** Not touched. Phase 8 will wire up dashboard statistics.
✓ **Revalidation:** TODO comments mark where `revalidatePath()` belongs; not implemented this phase.
✓ **Security hardening:** Not implemented; Phase 8 adds security headers.
✓ **Deployment:** Not touched; Phase 8 covers infrastructure.
✓ **Testing:** Not included; Phase 7 is implementation-only.
✓ **RBAC:** Not implemented; deferred per `15` §8.

### No Duplicated Responsibility

✓ Each of the 8 tasks produces a distinct file or set with no overlapping responsibility.
✓ The one cross-phase touch (article-form.tsx modified in Task 7.8 to add dirty state) is expected and documented, not a hidden duplication.
✓ Media Library orphan detection (Phase 6) is respected but not reimplemented.

### No Architectural Conflicts

✓ No new architectural decisions introduced.
✓ No changes to Phases 1–6 design.
✓ No new data models or schema changes beyond the two-level validation (Task 7.1), which is explicitly required by `17-article-validation.md` §3.
✓ Scope Note 7 documents the `coverImage.alt` vs `coverImageAlt` field naming inconsistency; Phase 7 correctly follows the API contract (`20-api-articles.md` §4), the authoritative shape.

### What Could Not Be Verified

- As with previous phases, no access to a running repository; this review is documentation-level consistency checking against the 20 architecture documents and Phases 00–06.
- Actual implementation and runtime testing deferred to developers.

### Conclusion

**Phase 7 is fully consistent with all 20 architecture documents, with all Phase 1–6 roadmaps, and is ready to become the implementation contract.**

