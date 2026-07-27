# Phase 6 — Media Library

> Part of the Nyalian Tourism Village Admin Dashboard — Implementation Roadmap.
> **Source of truth:** The 20 documents in `/docs/admin` (`01-admin-overview.md` through `20-api-articles.md`). Nothing in this document overrides them.
> This file follows the same organizational format as the finalized `01-phase-1-foundation.md` through `05-phase-5-image-management.md`.
> Cross-phase material (documentation notes, dependency graph, global implementation rules, development conventions, verification principles) lives in `00-overview-and-cross-phase-reference.md` and is referenced here, not repeated.

---

## Metadata

**Phase Name:** Phase 6 — Media Library

**Objective:** Implement a unified, cross-module Media Library interface at `/admin/media` for browsing all uploaded images, viewing metadata, detecting which images are currently used (referenced) vs. orphaned, and safely deleting orphaned images, per `18-media-library.md`.

**Dependencies:** Phase 1 (shell, routing), Phase 3 (shared components: Page Header, Search & Filter Bar, Dialog, Empty State, Loading Skeleton), and Phase 4 (Article CRUD to generate images through) complete. Phase 5 (image upload and storage pipeline) complete — this phase builds the management interface on top of the files Phase 5 creates.

**Related Architecture Documents:** `18-media-library.md` (whole document) · `04-storage-strategy.md` §4 (folder structure) · `14-article-image.md` §4–5 (storage naming, archival) · `11-admin-components.md` (component reuse) · `10-admin-navigation.md` §6 (shared navigation config) · `19-api-overview.md` §6–7 (API response/error format) · `06-security.md` §9 (path traversal protection).

**Expected Deliverables:** See "Files to create" below.

**Verification Checklist:** See "Manual verification checklist" below.

**Completion Criteria:** See "Completion criteria" below.

---

## Phase Detail

**Expected outcome:** An administrator can navigate to `/admin/media` and view a responsive grid of all images stored under `/public/images` across all modules (initially only Articles, but automatically extensible to future modules). Each image displays a thumbnail preview, filename, upload date, file size, dimensions, originating module, and a usage status badge showing either `Used` (with the referencing entity name, e.g. "Cover image on article: 'Pantai Nyalian'") or `Unused (Orphan)`. A click opens a detail dialog with full-size preview and metadata. Only unused (orphaned) images can be deleted — deletion requires confirmation, and the file is removed from disk if confirmed. A search/filter bar allows filtering by filename, module, and upload date. List, detail, and delete operations are read-time computed from the filesystem and JSON content files; no separate media index is maintained.

**Scope Interpretation Notes (read before implementing — these resolve real tensions between in-scope and out-of-scope items; none introduce a new architecture decision):**

1. **Usage detection is a read-time computation, not a background job or index.** `18-media-library.md` §6 states explicitly: "This is a **read-time computation**, not a background job or a separate index." Every time the Media Library list loads or a user views an image's detail, the service queries the filesystem for all images under `/public/images/` and cross-references every file path against every JSON content file (Articles) to determine `Used` vs. `Unused` status. No background task, no separate database table, no scheduled sync job.

2. **Deletion is restricted to orphaned images, enforced server-side.** `18-media-library.md` §7 states: "The system must never allow deletion if the image is still referenced, regardless of the entry point (Media Library UI or API) — this check is enforced server-side at the point of deletion, not only in the UI." Attempting to delete a used image returns `409 CONFLICT` or `400 BAD_REQUEST`, even if the UI prevents the button from being clickable.

3. **The Media Library does NOT provide upload functionality.** `18-media-library.md` §1 and §8 state clearly: "does not itself accept uploads independent of a module record" and "Media Library intentionally does **not** duplicate upload functionality tied to a specific entity." Upload happens only in the Article Editor (Phase 5); the Media Library is view/manage only.

4. **Module filtering uses a fixed, extensible registry, not dynamic module discovery.** `18-media-library.md` §4.2 references "the same module registry concept introduced in `09-admin-dashboard.md`." For Phase 6, this phase creates a shared module registry utility used by both the dashboard (Phase 1) and the Media Library (this phase), defining which modules exist and where their images are stored. Future modules that follow the storage convention automatically appear in the filter, but the registry itself is a curated list, not a filesystem scan for directories.

5. **No alt-text display or editing.** `14-article-image.md` §7 captures alt text, but `18-media-library.md` does not mention it anywhere in its specification. This phase does not display, filter by, or allow editing of alt text — that concern is scoped to the per-article editor (Phase 5) only.

6. **Delete action uses the shared Confirm Delete dialog from Phase 3, not a custom confirmation.** Per `18-media-library.md` §5, "using the shared Confirm Delete dialog (`11-admin-components.md`, Section 3.6)." Task 6.X reuses the component; it does not build a new confirmation UI.

**Prerequisites:** Phase 1 complete (admin shell, routing). Phase 3 complete (Page Header, Search & Filter Bar, Dialog, Empty State, Loading Skeleton all exist in `/components/admin/`). Phase 4 complete (articles exist to generate test images). Phase 5 complete (images are uploaded and stored; the `/public/images/articles/` folder structure exists with actual files).

**Files to create:**
- `/lib/modules/media/types.ts`
- `/lib/modules/media/module-registry.ts`
- `/lib/modules/media/filesystem.ts`
- `/lib/modules/media/usage-detector.ts`
- `/lib/modules/media/service.ts`
- `/app/api/admin/media/route.ts`
- `/app/api/admin/media/[id]/route.ts`
- `/components/admin/media/media-grid-item.tsx`
- `/components/admin/media/media-detail-dialog.tsx`
- `/app/(admin)/admin/media/page.tsx`
- `/app/(admin)/admin/media/loading.tsx`
- `/app/(admin)/admin/media/error.tsx`

**Files to modify:**
- `/lib/modules/media/module-registry.ts` — used by Phase 1's dashboard (Task 1.8) to populate the module placeholder cards. This phase creates the utility; Phase 1's dashboard can optionally use it for consistency (or remain unchanged and return to update it if required by other phases).

**Things that must NOT be changed:**
- No file created in Phase 1, 2, 3, 4, or 5 is modified, except the optional registry integration noted above.
- No upload endpoint is added — Phase 5 is the sole upload pathway.
- No filesystem write to `/public/images/` occurs outside Task 6.X's delete operation.
- No alt-text display, edit, or validation related to Media Library (that is Article Editor scope).
- No Media Library upload form or drag-and-drop.
- No background job, index, or scheduled sync.
- No image processing or Sharp usage (Phase 5 only).
- Do not modify navigation config — navigation entry is added via phase 1's existing mechanism or via a separate update to `navigation.json`, not hardcoded.

**Manual verification checklist:**
- [ ] `/admin/media` renders a responsive thumbnail grid of all images in `/public/images/articles/`.
- [ ] Each thumbnail displays filename, upload date, file size, dimensions, module name, and usage status.
- [ ] Clicking a thumbnail opens the detail dialog with full-size preview and metadata.
- [ ] The detail dialog correctly identifies a used image (showing "Cover image on article: 'Title'") and an orphaned image (showing "Unused (Orphan)").
- [ ] The Delete button in the detail dialog is disabled for used images and enabled for orphaned images.
- [ ] Confirming deletion of an orphaned image removes the file from `/public/images/articles/` and updates the list.
- [ ] Attempting to delete a used image (via API directly, simulating a bypass) returns a rejection error.
- [ ] Filtering by module shows only Articles (Phase 6, before future modules join).
- [ ] Searching by filename filters the grid correctly.
- [ ] List page shows Empty State when no images exist; shows Loading Skeleton while fetching; shows error state if a read fails.
- [ ] No upload form or uploader is present on the Media Library page.

**Possible risks:**
- Usage detection performance: scanning all JSON content files on every list view load becomes slow as article count grows. Per Scope Note 1, this is acceptable for v1's scale; if article count grows, the read-time computation can be replaced with a background job or indexed lookup without changing the external API contract.
- Orphaned detection edge case: an image referenced in an article's `content` field as markdown/plain-text image reference (inserted by Phase 5's content-image insertion, per Phase 5 Scope Note 6) must be correctly parsed to detect as "used" — regex/parsing logic in Task 6.4 must handle the exact format Phase 5 uses.
- Concurrent delete: if an article is deleted in one browser tab while the Media Library list is open in another, the usage detection may not reflect the image's orphan status until the user refreshes. Per Scope Note 1 (no background job), this is expected behavior, not a bug.

**Completion criteria:** All Phase 6 tasks below are complete, the Manual verification checklist passes, no filesystem write occurs outside the delete operation in the delete API route, all usage detection is read-time computed, and no code outside `/lib/modules/media/`, `/app/api/admin/media/`, and `/components/admin/media/` plus `/app/(admin)/admin/media/` is touched (except the optional registry integration noted above).

---

## Tasks

Each task below is scoped to be implemented — and turned into a single implementation prompt — independently, in the order presented.

### Task 6.1 — Media types

**Objective:** Define TypeScript types for the Media Library domain — `MediaItem`, `MediaUsageStatus`, `MediaDetail`, etc. — covering both filesystem-level image metadata and usage/orphan detection results.

**Files involved:** `/lib/modules/media/types.ts` (create).

**Dependencies:** None — first task in this phase.

**Implementation notes:** `MediaItem` represents a single image file with filename, upload date (derived from filesystem stat), file size, dimensions (from Sharp metadata), module origin, and usage status. `MediaUsageStatus` is a union of `"used"` (with an optional `referenceInfo` field listing the referencing entity, e.g. `{ type: "article-cover", title: "..." }`) and `"orphan"`. No special types for alt text (out of scope, Scope Note 5).

**Verification checklist:**
- [ ] `MediaItem` type includes all fields listed above with correct optionality.
- [ ] `MediaUsageStatus` correctly represents both used and orphaned states.
- [ ] No `any` used anywhere in the file.

**Completion criteria:** Task 6.1 is complete when `/lib/modules/media/types.ts` exists as described and both Verification checklist items pass.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 6.2 — Module registry utility

**Objective:** Build a shared utility that defines which modules exist in the system, where their images are stored, and where their content JSON files live — used by both the Media Library (this phase) and optionally by the dashboard (Phase 1) for extensibility, per `18-media-library.md` §4.2 and Scope Note 4.

**Files involved:** `/lib/modules/media/module-registry.ts` (create).

**Dependencies:** None — independent of other Phase 6 tasks, but used by Tasks 6.4 and later.

**Implementation notes:** Export a registry constant or function (e.g. `getModuleRegistry()`) returning an array of module definitions, each containing: `name` (e.g. `"Articles"`), `path` (e.g. `"articles"`), `imagesDir` (e.g. `/public/images/articles`), `contentFile` (e.g. `/content/articles.json`). Hard-coded for Phase 6 (only Articles); designed to be extended with new entries as future modules are added.

**Verification checklist:**
- [ ] Registry includes Articles with correct paths.
- [ ] Registry structure supports easy addition of future modules without touching other code.

**Completion criteria:** Task 6.2 is complete when `/lib/modules/media/module-registry.ts` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 6.3 — Filesystem scanning utility

**Objective:** Build utilities to read the `/public/images/` directory structure, extract file metadata (filename, size, modification date, dimensions), and return a flat list of all image objects, per `18-media-library.md` §3 and `04-storage-strategy.md` §4.

**Files involved:** `/lib/modules/media/filesystem.ts` (create).

**Dependencies:** None — independent of other Phase 6 tasks, but used by Task 6.4 (usage detector).

**Implementation notes:** Exports functions like `scanImagesForModule(modulePath)` or `getAllImages()` that iterate `/public/images/{module}/...`, read file stats (size, mtime), extract image dimensions (using Sharp or a lightweight package that only reads image headers without processing), and return an array of `MediaItem`-shaped objects. Handles errors gracefully (permission denied, corrupted EXIF headers) without crashing. Returns empty array if a module's image directory doesn't exist yet.

**Verification checklist:**
- [ ] Correctly reads files from `/public/images/articles/` when images exist.
- [ ] Returns empty array if the directory doesn't exist.
- [ ] Correctly extracts dimensions from WebP files (the format Phase 5 produces).
- [ ] Errors during file reading (permission denied, etc.) are caught and logged, not thrown.

**Completion criteria:** Task 6.3 is complete when `/lib/modules/media/filesystem.ts` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 6.4 — Usage detector service

**Objective:** Build the core read-time usage detection logic that cross-references every image path found on the filesystem against every module's JSON content file, determining which images are currently referenced (used) and which are orphaned, per `18-media-library.md` §6.

**Files involved:** `/lib/modules/media/usage-detector.ts` (create).

**Dependencies:** Tasks 6.2 (module-registry) and 6.3 (filesystem) complete — this task composes both to detect usage.

**Implementation notes:**
- `detectUsage(mediaItems: MediaItem[]): Promise<MediaItem[]>` — takes a flat list of images from the filesystem and, for each one, searches all module JSON content files for a reference to that image's path.
- For Articles specifically: check the `coverImage` field (exact match against the stored path) and parse the `content` field for inline-image references (exact match against the format Phase 5 uses when inserting images, per Phase 5 Scope Note 6 — likely markdown or HTML `<img src="/public/images/...">` format).
- Returns the same array of items, but with each item's `usageStatus` set to `"used"` (with referenceInfo: `{ type: "article-cover", entityId: "...", title: "..." }`) or `"orphan"`.
- If an image is referenced by multiple articles or multiple times within an article, set `usageStatus: "used"` once (not duplicated per reference).

**Verification checklist:**
- [ ] An image matching an article's `coverImage` field is marked as `used` with correct referenceInfo.
- [ ] An image embedded in an article's `content` field (in the format Phase 5 produces) is marked as `used`.
- [ ] An image with no references anywhere is marked as `orphan`.
- [ ] If an image is referenced by multiple articles, it is still marked as `used` once, not duplicated.

**Completion criteria:** Task 6.4 is complete when `/lib/modules/media/usage-detector.ts` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 6.5 — Media service layer

**Objective:** Compose the filesystem scanner (Task 6.3) and usage detector (Task 6.4) into a high-level service that the API routes (Task 6.6+) call, maintaining a clean boundary between data-access logic and request handling.

**Files involved:** `/lib/modules/media/service.ts` (create).

**Dependencies:** Tasks 6.2 (module-registry), 6.3 (filesystem), and 6.4 (usage-detector) complete.

**Implementation notes:**
- `listMedia(filters?: { module?: string; searchText?: string; sortBy?: string })` — fetches all images, detects usage, applies filters (module, filename search, date sort), and returns the filtered list.
- `getMediaDetail(filename: string)` — fetches metadata for a single image, detects its usage, and returns full detail.
- `deleteMediaIfOrphan(filename: string)` — checks usage; if `orphan`, deletes the file from disk and returns success; if `used`, throws an error with a clear message (error code, not exception type).

**Verification checklist:**
- [ ] `listMedia()` returns all images with usage status computed.
- [ ] `listMedia()` with `module: "Articles"` filters to only images in `/public/images/articles/`.
- [ ] `listMedia()` with `searchText: "cover"` filters by filename.
- [ ] `deleteMediaIfOrphan()` on an orphaned image removes the file.
- [ ] `deleteMediaIfOrphan()` on a used image returns an error, does not delete.

**Completion criteria:** Task 6.5 is complete when `/lib/modules/media/service.ts` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 6.6 — `GET /api/admin/media` Route Handler

**Objective:** Implement the paginated media list endpoint, per `19-api-overview.md` §6–9, returning all images with usage status, searchability, and filtering support.

**Files involved:** `/app/api/admin/media/route.ts` (create).

**Dependencies:** Task 6.5 (media service) complete. Phase 2 Task 2.7 (`require-session.ts`) complete.

**Implementation notes:**
- Begins with the shared `require-session.ts` check; unauthenticated requests return `401`.
- `GET` accepts query parameters: `page`, `limit` (defaults and maxes per `19` §9), `module`, `search`, `sortBy`.
- Calls `listMedia(filters)` from the service, wraps results in the standard paginated envelope: `{ success: true, data: { items, total, page, limit, totalPages } }`.
- Returns `200` on success.

**Verification checklist:**
- [ ] `GET` without a session returns `401`.
- [ ] `GET` returns the paginated envelope shape exactly.
- [ ] `GET` with `module=articles` filters correctly.
- [ ] `GET` with `search=cover` filters by filename.
- [ ] Default and maximum `limit` values are enforced server-side.

**Completion criteria:** Task 6.6 is complete when `/app/api/admin/media/route.ts` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 6.7 — `GET /api/admin/media/[id]` and `DELETE /api/admin/media/[id]` Route Handler

**Objective:** Implement detail fetch and orphan-only delete endpoints, per `19-api-overview.md` §4, §6–8.

**Files involved:** `/app/api/admin/media/[id]/route.ts` (create).

**Dependencies:** Task 6.5 (media service) complete. Phase 2 Task 2.7 (`require-session.ts`) complete.

**Implementation notes:**
- Both methods begin with the shared session check; unauthenticated requests return `401`.
- `GET` — returns the image detail with usage status under `data`. Returns `404 NOT_FOUND` if the file does not exist.
- `DELETE` — calls `deleteMediaIfOrphan(filename)` from the service. If the image is orphaned, deletes the file and returns `200` with `{ deleted: true }` under `data`. If the image is used, returns `409 CONFLICT` with an error envelope explaining the image is in use and must be removed from its referencing entity first (per `18-media-library.md` §7).

**Verification checklist:**
- [ ] `GET` on a non-existent filename returns `404`.
- [ ] `GET` on an existing image returns the detail with correct usage status.
- [ ] `DELETE` on an orphaned image deletes the file and returns success.
- [ ] `DELETE` on a used image returns `409 CONFLICT` without deleting.

**Completion criteria:** Task 6.7 is complete when `/app/api/admin/media/[id]/route.ts` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 6.8 — Media grid item component

**Objective:** Build a reusable card component displaying a single media item's thumbnail, filename, and metadata, clickable to open the detail dialog.

**Files involved:** `/components/admin/media/media-grid-item.tsx` (create).

**Dependencies:** Phase 3 (no specific dependency, but follows the same design system and component patterns).

**Implementation notes:** A card component with thumbnail preview (using `next/image`), filename, upload date, file size, dimensions, module label, and usage status badge. The status badge uses the shared Status Badge component (Phase 3 Task 3.8) styled for "Used" vs. "Orphan" states. Clicking the card triggers a callback to open the detail dialog (logic in the parent page, Task 6.9).

**Verification checklist:**
- [ ] Thumbnail displays correctly for WebP images.
- [ ] All metadata fields render.
- [ ] Status badge is visually distinct for used vs. orphan states.
- [ ] Click handler fires correctly.

**Completion criteria:** Task 6.8 is complete when `/components/admin/media/media-grid-item.tsx` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 6.9 — Media detail dialog component

**Objective:** Build a modal dialog component (reusing Phase 3's shared Dialog) showing full-size image preview, complete metadata, usage status with referencing entity name, and a Delete button (disabled for used images, enabled for orphaned images).

**Files involved:** `/components/admin/media/media-detail-dialog.tsx` (create).

**Dependencies:** Task 6.8 (media-grid-item) — dialog is called by the parent page when a grid item is clicked. Phase 3's Dialog and Confirm Delete components.

**Implementation notes:** Dialog displays the full image, filename, upload date, file size, dimensions, module, and usage status. If used, shows "Used as [type] on [entity name]" and the Delete button is visually disabled (`disabled` prop) and not clickable. If orphaned, the Delete button is enabled and, on click, opens the shared Confirm Delete dialog (Phase 3 Task 3.6) asking for confirmation. On confirmation, calls the `DELETE /api/admin/media/[id]` endpoint, shows a success Toast, and closes the detail dialog.

**Verification checklist:**
- [ ] Dialog displays the correct image and metadata.
- [ ] Delete button is disabled for used images.
- [ ] Delete button is enabled for orphaned images.
- [ ] Clicking Delete on an orphaned image opens the Confirm Delete dialog.
- [ ] Confirming deletion triggers the API call and shows a success Toast.

**Completion criteria:** Task 6.9 is complete when `/components/admin/media/media-detail-dialog.tsx` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 6.10 — Media Library list page

**Objective:** Build `/admin/media`, composing Page Header, Search & Filter Bar, responsive media grid (via Task 6.8 components), detail dialog (via Task 6.9), Empty State, and Loading Skeleton, per `18-media-library.md` §4.

**Files involved:**
- `/app/(admin)/admin/media/page.tsx` (create)
- `/app/(admin)/admin/media/loading.tsx` (create)
- `/app/(admin)/admin/media/error.tsx` (create)

**Dependencies:** Tasks 6.6 (list API), 6.8 (grid-item component), and 6.9 (detail dialog) complete.

**Implementation notes:** Page Header title "Media Library." Search & Filter Bar supports filename search and module filter (pre-populated from the module registry, Task 6.2). Grid layout using Task 6.8 components. Clicking a grid item opens the detail dialog (Task 6.9). Refresh button to re-fetch the media list. `loading.tsx` uses Phase 3's Loading Skeleton (grid variant). `error.tsx` handles a failed fetch. Empty State shown when zero images exist.

**Verification checklist:**
- [ ] List renders correctly with existing images.
- [ ] Empty State renders when zero images exist.
- [ ] Loading Skeleton renders during the server fetch.
- [ ] Error state renders if the API call fails.
- [ ] Clicking an image opens the detail dialog.
- [ ] Search filters by filename.
- [ ] Module filter works.

**Completion criteria:** Task 6.10 is complete when all three files exist as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 6.11 — Navigation integration

**Objective:** Add the Media Library entry to the shared navigation configuration (`navigation.json` or the navigation config used by the Phase 1 sidebar), grouping it under "Content" alongside Articles, per `18-media-library.md` §4 and `10-admin-navigation.md`.

**Files involved:** The shared navigation config file (exact location per `10-admin-navigation.md` — likely something like `/lib/admin/navigation.ts` or `/public/navigation.json`).

**Dependencies:** Phase 1 (admin shell, navigation config) complete. Task 6.10 (Media Library page route exists).

**Implementation notes:** Add an entry with label "Media Library," icon (images or media icon), and route `/admin/media`. Place it under a "Content" section, after Articles if a section structure exists, or at the same hierarchy level as Articles. This ensures the Media Library appears in the sidebar as a navigable destination per `18-media-library.md` §4.

**Verification checklist:**
- [ ] Media Library appears in the navigation sidebar.
- [ ] Clicking the Media Library nav entry navigates to `/admin/media`.

**Completion criteria:** Task 6.11 is complete when the navigation integration is done and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

## Testing Checklist

✓ Media list loads and displays all images from `/public/images/articles/`

✓ Images are correctly identified as used (referencing an article's cover or content) or orphaned

✓ Search by filename filters the grid

✓ Filter by module shows only Articles (before future modules are added)

✓ Clicking an image opens the detail dialog

✓ Detail dialog shows full preview and all metadata

✓ Delete button is disabled for used images

✓ Delete button is enabled for orphaned images

✓ Confirming deletion of an orphaned image removes the file from disk

✓ Attempting to delete a used image returns a `409 CONFLICT` error

✓ `/admin/media` route appears in the sidebar navigation

✓ List, detail, and delete operations use only read-time computed usage, no index or background job

✓ All `/api/admin/media*` routes reject unauthenticated requests with `401`

✓ List page shows correct loading, empty, and error states

---

## Completion Criteria

Phase 6 is complete when:
- Every task (6.1–6.11) is complete and its Verification checklist passes.
- The phase-wide Manual verification checklist (Phase Detail) passes.
- The Testing Checklist above passes in full.
- No file outside `/lib/modules/media/`, `/app/api/admin/media/`, and `/components/admin/media/`, plus `/app/(admin)/admin/media/` and the navigation config, was created or modified.
- No Phase 1, 2, 3, 4, or 5 file was modified (except the optional registry integration noted above).
- All usage detection is read-time computed; no separate index, background job, or scheduled sync exists.

---

## Phase 6 Boundary — STOP HERE

Phase 6 ends with Task 6.11. Phase 6 must NOT implement:

- Image upload or any upload endpoint (Phase 5 only)
- Image processing, Sharp integration, or format conversion (Phase 5 only)
- Alt text display, edit, or validation (Article Editor scope, Phase 5)
- Rich Text Editor configuration or Tiptap integration (deferred)
- SEO metadata fields or Next.js metadata wiring (deferred)
- Publish/Unpublish workflow or status-transition endpoints (deferred)
- Preview
- Search indexing
- Dashboard statistics wiring
- Any future module (Destinations, Tour Packages, Gallery, FAQ, UMKM, Homepage)

These belong to later phases and are out of scope for this document.

---

## Self-Review

**Against previous roadmap phases:**
- No file created in Phase 1, 2, 3, 4, or 5 is modified or duplicated. The reused components from Phase 3 (Page Header, Search & Filter Bar, Dialog, Empty State, Loading Skeleton, Status Badge, Confirm Delete Dialog) are consumed as-is.
- Every API route reuses Phase 2's `require-session.ts` rather than reimplementing session verification.
- The Media Library operates purely on top of Phase 5's file storage output (images at `/public/images/articles/{slug}/`) and Phase 4's Article data model; no new image storage paths or formats are introduced.

**Against the 20 architecture documents:**
- Page layout (Task 6.10) matches `18-media-library.md` §4.1 exactly: Page Header, Search & Filter Bar, responsive thumbnail grid.
- Data source (Tasks 6.3–6.4) matches `18-media-library.md` §3 exactly: filesystem scan + JSON content cross-reference, no separate index.
- Usage detection (Task 6.4) matches `18-media-library.md` §6 exactly: read-time computation.
- Delete restrictions (Task 6.7) match `18-media-library.md` §7 exactly: orphaned-only deletion, enforced server-side.
- Module filtering (Task 6.6) matches `18-media-library.md` §4.2 and references the registry concept from `09-admin-dashboard.md`.
- Image metadata display (Task 6.9) matches `18-media-library.md` §5 exactly: filename, upload date, file size, dimensions, module, usage status.
- Navigation integration (Task 6.11) matches `18-media-library.md` §4 and `10-admin-navigation.md` §6 exactly: entry under "Content" in the sidebar.
- Component reuse (Task 6.9) matches `11-admin-components.md` §3.6: Confirm Delete dialog reused as-is.
- No upload functionality (Scope Note 3) matches `18-media-library.md` §1, §8 exactly.

**No scope overlap with future phases:** No future module (Gallery, FAQ, UMKM, Destinations, Tour Packages, Homepage) is implemented or referenced. No upload, processing, or SEO wiring. No background jobs or index maintenance. The Media Library remains a view/browse/delete tool, not an upload tool.

**No duplicated implementation:** Each of the 11 tasks produces a distinct file or a distinct, non-overlapping modification, with no responsibility repeated across tasks (types, module registry, filesystem scanning, usage detection, service layer, list API, delete API, grid item component, detail dialog, list page, and navigation are each owned by exactly one task).

**No contradictions introduced:** The one point that could otherwise introduce ambiguity — whether usage detection should be a background job or read-time computation (Scope Note 1) — is resolved explicitly, grounded in `18-media-library.md` §6, and flagged as a performance consideration for future v2+ work.

**What I could not verify:** As with previous phases, I do not have independent access to a running repository — this self-review is a documentation-level consistency check against the architecture documents and previously finalized roadmap phases, not a code-level test run.

If this is consistent with your expectations, I'll wait for your review before creating the final roadmap phase.