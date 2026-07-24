# Phase 5 — Image Management

> Part of the Nyalian Tourism Village Admin Dashboard — Implementation Roadmap.
> **Source of truth:** The 20 documents in `/docs/admin` (`01-admin-overview.md` through `20-api-articles.md`). Nothing in this document overrides them.
> This file follows the same organizational format as the finalized `01-phase-1-foundation.md`, `02-phase-2-authentication.md`, `03-phase-3-shared-admin-components.md`, and `04-phase-4-article-crud.md`.
> Cross-phase material (documentation notes, dependency graph, global implementation rules, development conventions, verification principles) lives in `00-overview-and-cross-phase-reference.md` and is referenced here, not repeated.

---

## Metadata

**Phase Name:** Phase 5 — Image Management

**Objective:** Implement the complete image management pipeline for Articles — upload endpoint, content-type/magic-number validation, the full Sharp processing pipeline (resize, compress, convert to WebP), safe server-generated filenames, per-article directory management, cover/content image replacement with archival, and integration of the article record's `coverImage` field and inline-image alt text — per `14-article-image.md`, `06-security.md` §5, §7–9, and `20-api-articles.md` §9.

**Dependencies:** Phase 1 (shell, routing) and Phase 3 (shared components — specifically the Task 3.7 `image-uploader.tsx` client-side shell) complete. Phase 2 (authentication) complete — the upload endpoint is protected via `require-session.ts` (Task 2.7). Phase 4 (Article CRUD) complete — `article-form.tsx` (Task 4.7), the Articles service (Task 4.4), and the `/api/admin/articles/[id]` `PUT` endpoint (Task 4.6) already exist and this phase integrates into them.

**Related Architecture Documents:** `14-article-image.md` (whole document) · `06-security.md` §5, §7–9 · `04-storage-strategy.md` §4, §9 · `13-article-editor.md` §9 · `17-article-validation.md` §7 · `19-api-overview.md` §6–7 · `20-api-articles.md` §9, §11 · `11-admin-components.md` §3.7 (component reuse, no duplication).

**Expected Deliverables:** See "Files to create" and "Files to modify" below.

**Verification Checklist:** See "Manual verification checklist" below.

**Completion Criteria:** See "Completion criteria" below.

---

## Phase Detail

**Expected outcome:** An administrator can upload a cover image for an article and upload inline content images from within the article form. Every uploaded file is validated by actual file content (not extension or declared MIME type), rejected if it is not a supported image format, rejected if it exceeds the size limit, and — if valid — automatically resized, compressed, and converted to WebP via Sharp before being written to a dedicated per-article folder under a system-generated filename. The client never supplies or influences the stored filename. Replacing a cover image retains the previous file as an archive rather than deleting it. The article record's `coverImage` field is updated only after a successful upload, via the existing Phase 4 `PUT` endpoint. Alt text is captured and stored alongside each image reference. No unprocessed or unvalidated file is ever written to `/public/images/articles/`.

**Scope Interpretation Notes (read before implementing — these resolve real tensions between in-scope and out-of-scope items in this phase's brief; none of them introduce a new architecture decision, each is derived directly from the cited section):**

1. **Upload size limit: 5 MB, not 2 MB.** `06-security.md` §8 states a 2 MB maximum, while `14-article-image.md` §6, `17-article-validation.md` §7, and `20-api-articles.md` §9 all state 5 MB. This is a known, already-flagged conflict (`00-overview-and-cross-phase-reference.md`, Documentation Note 3), which resolves in favor of **5 MB** because it is the Articles-module-specific figure and is repeated consistently across three documents against one cross-cutting outlier. This phase implements 5 MB. This value should be treated as flagged, not silently final — see the Self-Review section below.
2. **Maximum cover image dimensions: 1600×900.** Only `06-security.md` §8 states explicit maximum dimensions; no module-specific document contradicts this figure (the conflict in Note 1 above is about upload *size*, not *dimensions*). This phase enforces 1600×900 as the resize ceiling for cover images, per `06-security.md` §8 and the Sharp pipeline referenced in `05-deployment.md` §7. Content (inline) images use the same resize ceiling in the absence of a documented separate figure, since no document specifies a distinct dimension limit for inline images.
3. **Old images are archived, not deleted, on replacement — this phase does not implement `04-storage-strategy.md` §9's "delete the previous file" line.** `14-article-image.md` §5 states explicitly and specifically for Articles: "Old images are never automatically deleted... the previous file remains in the article's folder as an archive," and that archived files "are only removed when the administrator explicitly deletes them (e.g. via the Media Library, `18-media-library.md`)" — a capability out of scope for this phase and deferred to Phase 6. The general `04-storage-strategy.md` §9 line about deleting a previous file after replacement is superseded for Articles specifically by the more specific, explicitly-locked `14-article-image.md` §5, consistent with `04-storage-strategy.md` §5's statement that module-specific documentation governs module-specific fields and behavior. This phase implements archival (no delete-on-replace).
4. **The client-side uploader shell (`image-uploader.tsx`, Phase 3 Task 3.7) is reused, not reimplemented.** Task 3.7 explicitly deferred "any upload pipeline wiring, magic-number detection, or server-side processing" to this phase while building the drag-and-drop/preview/client-side-warning shell itself. This phase wires that existing component to the real upload endpoint; it does not rebuild drag-and-drop, click-to-browse, or preview rendering.
5. **`article-form.tsx` (Phase 4, Task 4.7) is extended, not duplicated.** Phase 4 explicitly built the article form without a Cover Image field (`04-phase-4-article-crud.md`, Scope Note 4 and "Things that must NOT be changed"). This phase adds the Cover Image field (and inline-image insertion trigger) to the existing form component in place, per `13-article-editor.md` §9's framing of the editor's image entry points as "the same pipeline," not a separate mechanism.
6. **No Tiptap.** `13-article-editor.md` §9 frames inline image uploads as happening "inside the Tiptap editor," but Tiptap itself remains out of scope (deferred with the rest of `13-article-editor.md` §5's toolbar, per Phase 4's Scope Note 2, not reversed by this phase). This phase implements the inline-content-image **upload endpoint path and numbering logic** (`type: "content"` per `20-api-articles.md` §9) and a minimal insertion trigger into the existing plain-textarea `content` field (inserting the returned image URL as plain text/markdown-style reference at the cursor or field end), so the pipeline is real and testable without Tiptap. The rich toolbar-driven insertion experience is re-wired without changing the upload contract when Tiptap is introduced in a later phase.
7. **No Publish/Unpublish integration.** `14-article-image.md` §7 references a publish-time alt-text warning defined in `15-article-publishing.md`, which remains entirely out of scope. This phase stores alt text but implements no publish-time check of any kind.

**Prerequisites:** Phase 1 complete (admin shell, routing). Phase 2 complete (`require-session.ts` available for API route protection). Phase 3 complete (`image-uploader.tsx` shell exists in `/components/admin/`). Phase 4 complete (`Article` type, Zod schema, Articles service, CRUD API routes, and `article-form.tsx` all exist and are functional).

**Files to create:**
- `/lib/upload/file-type-guard.ts`
- `/lib/upload/image-pipeline.ts`
- `/lib/upload/filename.ts`
- `/lib/upload/paths.ts`
- `/app/api/admin/articles/upload-image/route.ts`

**Files to modify:**
- `/lib/modules/articles/schema.ts` (add `coverImage` path-namespace validation, per `17-article-validation.md` §7)
- `/components/admin/articles/article-form.tsx` (add Cover Image field using the Phase 3 `image-uploader.tsx`; add inline content-image insertion trigger)

**Dependency order:**
1. `/lib/upload/file-type-guard.ts` — no dependencies within this phase.
2. `/lib/upload/filename.ts` — no dependencies within this phase.
3. `/lib/upload/paths.ts` — no dependencies within this phase.
4. `/lib/upload/image-pipeline.ts` — depends on 1–3.
5. `/app/api/admin/articles/upload-image/route.ts` — depends on 1–4, plus Phase 2's `require-session.ts` and Phase 4's Articles service (to resolve `slug` → confirm the article exists).
6. `/lib/modules/articles/schema.ts` modification — depends on 5 existing (so the accepted `coverImage` shape matches what the endpoint actually returns).
7. `/components/admin/articles/article-form.tsx` modification — depends on 5 and 6, plus Phase 3's `image-uploader.tsx`.

**Things that must NOT be changed:**
- No file outside `/lib/upload/`, `/app/api/admin/articles/upload-image/`, and the two named modifications above is created or touched.
- No `fs` write to `/public/images/` occurs outside `/lib/upload/`, per the Global Implementation Rule in `00-overview-and-cross-phase-reference.md` §5.
- No previous image file is deleted on replacement (Scope Note 3) — archival only.
- No Media Library page, image browser, or bulk-management UI (`18-media-library.md` is out of scope — Phase 6).
- No orphan-image detection or cleanup logic (Phase 6).
- No Tiptap integration or toolbar changes (Scope Note 6; deferred).
- No SEO fields, `seo.ogImage`, or SEO metadata wiring (`16-article-seo.md` is out of scope).
- No publish/unpublish endpoint, status-transition logic, or alt-text publish-time warning (`15-article-publishing.md` is out of scope; Scope Note 7).
- No preview, search, filtering, or dashboard statistics wiring.
- No `image-uploader.tsx` reimplementation — the existing Phase 3 component is imported and configured, not rebuilt (Scope Note 4).
- No Phase 1, 2, or 3 file is modified.
- No Phase 4 file is modified except the two explicitly listed above.

**Manual verification checklist:**
- [ ] Uploading a valid JPG, JPEG, PNG, or WEBP file as a cover image succeeds and returns a `/images/articles/{slug}/cover.webp` URL.
- [ ] Uploading a non-image file (e.g. a `.pdf`, or a `.exe` renamed to `.jpg`) is rejected with `422 VALIDATION_ERROR`, based on actual file content, not the extension.
- [ ] Uploading a file over 5 MB is rejected with `400 BAD_REQUEST` before any processing occurs.
- [ ] Uploading to a `slug` that does not correspond to an existing article returns `404 NOT_FOUND`.
- [ ] The stored file is always `.webp`, regardless of the original uploaded format.
- [ ] A cover image wider or taller than 1600×900 is resized down; a smaller image is not upscaled.
- [ ] Replacing an existing cover image does not delete the previous file — both `cover.webp`'s prior bytes (renamed/archived per the system's collision-avoidance behavior) and the new file are inspectable on disk after the operation (see Task 5.4 for the exact archival mechanism).
- [ ] Inline content images are saved as `article-1.webp`, `article-2.webp`, etc., sequentially numbered per article folder, never colliding with an existing file.
- [ ] The client-supplied filename is never used to construct the stored path or filename, under any circumstance.
- [ ] A manipulated/unexpected `slug` value (e.g. containing `../`) sent directly to the API is rejected rather than resolving outside `/public/images/articles/`.
- [ ] Alt text submitted with an upload is returned in the response and is persisted when the article record is subsequently updated.
- [ ] The upload endpoint rejects unauthenticated requests with `401`.
- [ ] The existing `image-uploader.tsx` component (Phase 3) is used as-is inside `article-form.tsx`'s new Cover Image field — no duplicate drag-and-drop implementation exists.

**Possible risks:**
- The 5 MB vs. 2 MB size-limit conflict (Scope Note 1) is implemented per the roadmap's documented resolution, but remains a genuine unresolved contradiction between `06-security.md` and three other documents — confirm before production per `00-overview-and-cross-phase-reference.md` §5 and §7.3.
- Sequential inline-image numbering (`article-1.webp`, `article-2.webp`, ...) must scan the existing folder for the next free index rather than tracking count in the JSON record, since archived-but-unreferenced files can exist in the folder per Scope Note 3 — an in-memory or record-based counter would eventually collide with an archived file.
- Because old images are archived rather than deleted, an article's image folder can grow without bound across many replacements; this is intentional per `14-article-image.md` §5 and is explicitly deferred to the Media Library (Phase 6) for administrator-driven cleanup — this phase must not "fix" that by deleting old files.
- Concurrent uploads to the same article's folder (e.g. two inline images added in quick succession) must not be assigned the same sequential filename — the filename-selection step must be safe against this, consistent with the write-serialization principle in `04-storage-strategy.md` §8.2.

**Completion criteria:** All Phase 5 tasks below are complete, the Manual verification checklist passes, no file outside `/lib/upload/`, `/app/api/admin/articles/upload-image/`, and the two named Phase 4 modifications is created or touched, and no Phase 1, 2, or 3 file is modified.

---

## Tasks

Each task below is scoped to be implemented — and turned into a single implementation prompt — independently, in the order presented.

### Task 5.1 — File-type verification guard

**Objective:** Implement a utility that inspects a file's actual binary content (magic numbers) to determine its real type, rejecting anything that is not JPG, JPEG, PNG, or WEBP regardless of filename or declared MIME type, per `06-security.md` §7 and `14-article-image.md` §6.

**Files involved:** `/lib/upload/file-type-guard.ts` (create).

**Dependencies:** None — first task in this phase.

**Implementation notes:**
- Uses the **file-type** package to detect the real file type from a `Buffer`/stream, per `06-security.md` §7 and `19-api-overview.md`/`20-api-articles.md` §9.
- Exports a function that returns whether the detected type is one of the four accepted formats (jpg, jpeg, png, webp) and, if not, a rejection reason — it does not itself throw or produce an HTTP response; that is the route handler's responsibility (Task 5.5).
- Never trusts the `file.name`, `file.type` (declared MIME), or the multipart field's content-type header — detection reads only the actual bytes.
- A file that cannot be decoded/detected at all (corrupted or truncated) is treated as invalid, per `14-article-image.md` §6.

**Verification checklist:**
- [ ] A genuine JPG, PNG, and WEBP file are each correctly identified as valid.
- [ ] A text file renamed with a `.jpg` extension is correctly identified as invalid.
- [ ] A corrupted/truncated image file is correctly identified as invalid, not as a crash.
- [ ] The function's decision does not reference `file.name` or any client-declared MIME type anywhere in its logic.

**Completion criteria:** Task 5.1 is complete when `/lib/upload/file-type-guard.ts` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 5.2 — Safe filename generation utility

**Objective:** Implement the deterministic, collision-avoiding filename strategy defined in `14-article-image.md` §4 — `cover.webp` for cover images, and sequentially numbered `article-1.webp`, `article-2.webp`, ... for inline content images — never using any part of the client-supplied filename.

**Files involved:** `/lib/upload/filename.ts` (create).

**Dependencies:** None — independent of Task 5.1, but typically implemented alongside it.

**Implementation notes:**
- Exports a function for the cover case that always returns the literal `cover.webp` (fixed slot, per `14-article-image.md` §4).
- Exports a function for the content-image case that, given the article's existing image folder, determines the next free sequential index by scanning the folder's existing filenames matching the `article-N.webp` pattern (not by trusting a count passed in from the caller or stored in the JSON record — per the Possible Risks note in Phase Detail above, archived files can exist that are no longer referenced by the article).
- Pure with respect to its inputs where possible; the folder-scanning step is the only filesystem read this utility performs, and it performs no writes.
- The original client-supplied filename is never read by this utility at all — it accepts only the upload `type` (`"cover"` | `"content"`) and the target folder path.

**Verification checklist:**
- [ ] Cover case always returns `cover.webp`, regardless of any input filename.
- [ ] Content case returns `article-1.webp` for an empty folder.
- [ ] Content case returns `article-3.webp` when `article-1.webp` and `article-2.webp` already exist, even if one of them is no longer referenced by the article's current `content`.
- [ ] No code path in this file reads or references the client-supplied original filename.

**Completion criteria:** Task 5.2 is complete when `/lib/upload/filename.ts` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 5.3 — Safe path construction utility

**Objective:** Implement the server-side path-construction utility that builds the per-article image folder path from validated, known-safe components only (article `slug`) and guarantees the resolved path always stays within `/public/images/articles/`, preventing path traversal, per `14-article-image.md` §8 and `06-security.md` §9.

**Files involved:** `/lib/upload/paths.ts` (create).

**Dependencies:** None — independent of Tasks 5.1–5.2, but typically implemented alongside them.

**Implementation notes:**
- Exports a function that, given a `slug`, returns the absolute folder path `public/images/articles/{slug}/`, and a function that resolves a filename within that folder to a full file path.
- Validates the `slug` against the same safe-slug format already enforced by the Articles module (`04-storage-strategy.md` §6, reusing the existing slug format rather than inventing a new one) before using it to construct any path — a `slug` containing path-traversal sequences (e.g. `../`) or characters outside the expected safe format is rejected by this utility, not merely by an upstream check.
- After construction, resolves the final absolute path and confirms it is still located inside the intended base media directory before returning it, per `06-security.md` §9's "all write operations are confirmed to resolve within the intended base directory" requirement — this is a defense-in-depth check independent of the slug-format validation.
- Also exports (or reuses, per Task 5.2) a directory-creation helper that ensures the per-article folder exists before a write, without erroring if it already exists.
- Performs no image processing and no upload handling itself — path/directory concerns only.

**Verification checklist:**
- [ ] A well-formed `slug` resolves to the expected `public/images/articles/{slug}/` path.
- [ ] A `slug` containing `../` or other traversal sequences is rejected outright, never silently normalized and used.
- [ ] The resolved path is confirmed to remain inside `public/images/articles/` before being returned.
- [ ] Requesting the folder for a slug whose folder does not yet exist creates it without error; requesting it again when it already exists does not error.

**Completion criteria:** Task 5.3 is complete when `/lib/upload/paths.ts` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 5.4 — Sharp image processing pipeline

**Objective:** Implement the ordered processing pipeline defined in `14-article-image.md` §3 — validate, resize, compress, convert to WebP, save — composing Tasks 5.1–5.3, and implement the archival behavior for cover image replacement per `14-article-image.md` §5 (Scope Note 3).

**Files involved:** `/lib/upload/image-pipeline.ts` (create).

**Dependencies:** Tasks 5.1 (file-type guard), 5.2 (filename generation), and 5.3 (path construction) complete — this task composes all three.

**Implementation notes:**
- Pipeline order, exactly per `14-article-image.md` §3: (1) validate using Task 5.1's guard and the 5 MB size limit (Scope Note 1); (2) resize to the applicable maximum dimensions (1600×900, per Scope Note 2) using **Sharp**, only downscaling — never upscaling an image smaller than the ceiling; (3) compress via Sharp; (4) convert to WebP via Sharp regardless of the original format; (5) save the processed buffer to disk using Task 5.2's filename and Task 5.3's path.
- No unprocessed file is ever written to disk, per `14-article-image.md` §3 and the Global Implementation Rule in `00-overview-and-cross-phase-reference.md` §5 ("every uploaded image passes through the full Sharp pipeline").
- A file that fails Task 5.1's validation, or that Sharp itself fails to decode (corrupted file), stops the pipeline before any write occurs and surfaces a typed rejection reason for the route handler (Task 5.5) to translate into the correct error response.
- **Archival on cover replacement (Scope Note 3):** because the target filename for a cover image is always the fixed `cover.webp` slot (Task 5.2), a straight overwrite would destroy the previous file — which `14-article-image.md` §5 requires to be retained as an archive. Before writing a new `cover.webp`, this pipeline checks whether a `cover.webp` already exists in the target folder; if it does, the existing file is renamed to an archived filename (e.g. a timestamp- or counter-suffixed name such as `cover-archived-{timestamp}.webp`) rather than being deleted or overwritten, and only then is the newly processed file written to `cover.webp`. This preserves the fixed-slot naming contract in `14-article-image.md` §4 for the *current* cover while satisfying the no-delete archival rule in §5.
- Content-image uploads never overwrite an existing file, since Task 5.2 always assigns the next free sequential index — no archival rename is needed for that path.
- Returns the public URL (`/images/articles/{slug}/{filename}.webp`) and the filename actually written, for the route handler to include in the response.

**Verification checklist:**
- [ ] A valid image passes through all five pipeline steps in order and results in exactly one new `.webp` file on disk.
- [ ] An invalid file (wrong type or corrupted) results in zero files written, at any stage.
- [ ] An oversized image is resized down to fit within 1600×900; an image already smaller is not upscaled.
- [ ] A JPG, PNG, and WEBP input each result in a WEBP output file.
- [ ] Uploading a second cover image for the same article does not delete the first — the previous `cover.webp` is renamed/archived, not lost, and the new upload becomes the active `cover.webp`.
- [ ] Uploading a second and third content image for the same article produces `article-2.webp` and `article-3.webp` without touching `article-1.webp`.

**Completion criteria:** Task 5.4 is complete when `/lib/upload/image-pipeline.ts` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 5.5 — `POST /api/admin/articles/upload-image` Route Handler

**Objective:** Implement the upload endpoint exactly per `20-api-articles.md` §9, composing Tasks 5.1–5.4 and protected by the shared session check from Phase 2.

**Files involved:** `/app/api/admin/articles/upload-image/route.ts` (create).

**Dependencies:** Task 5.4 (pipeline) complete. Phase 2 Task 2.7 (`require-session.ts`) complete. Phase 4's Articles service (`getArticleBySlug`-equivalent lookup, or an existing lookup by `slug`) complete, to confirm the target article exists before accepting the upload.

**Implementation notes:**
- Begins with the shared `require-session.ts` check (`19-api-overview.md` §8); unauthenticated requests return `401 UNAUTHORIZED` per the standard error envelope.
- Accepts `multipart/form-data` with exactly the fields defined in `20-api-articles.md` §9: `file`, `slug`, `type` (`"cover"` | `"content"`), `alt` (optional).
- Looks up the article by `slug` via the existing Phase 4 service; if no article matches, returns `404 NOT_FOUND` before any file processing occurs.
- Runs the uploaded file through Task 5.4's pipeline. On a type/corruption failure, returns `422 VALIDATION_ERROR`. On a size-limit failure, returns `400 BAD_REQUEST` — checked before Sharp processing begins, per `20-api-articles.md` §9's error table.
- On success, returns the exact response shape from `20-api-articles.md` §9: `{ success: true, data: { url, alt } }`.
- Does **not** itself update `/content/articles.json` — per `20-api-articles.md` §9, "for `type: \"cover\"`, the response is used by the client to update the article's `coverImage` field via a subsequent `PUT` request." This endpoint's sole responsibility is file validation, processing, and storage; persisting the reference into the article record is a separate, already-existing Phase 4 `PUT` call triggered by the client (Task 5.7).
- Logs the upload action (success or rejection) consistent with `06-security.md` §12's CRUD-adjacent logging expectations, excluding any file content from the log.

**Verification checklist:**
- [ ] Request without a session returns `401`.
- [ ] Request with an unknown `slug` returns `404` before any processing.
- [ ] Request with an invalid/corrupted file returns `422` with field-mapped error detail.
- [ ] Request with a file over 5 MB returns `400` without invoking the Sharp pipeline.
- [ ] A valid request returns `200`/`201`-appropriate success with the exact `{ success: true, data: { url, alt } }` shape.
- [ ] The endpoint never writes to `/content/articles.json` directly.

**Completion criteria:** Task 5.5 is complete when `/app/api/admin/articles/upload-image/route.ts` exists as described and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 5.6 — `coverImage` path-namespace validation in the Articles schema

**Objective:** Extend the existing Articles Zod schema so that `coverImage`, when present, is validated as a path within the expected `/images/articles/{slug}/` namespace rather than an arbitrary string, per `17-article-validation.md` §7.

**Files involved:** `/lib/modules/articles/schema.ts` (modify — existing Phase 4 file).

**Dependencies:** Task 5.5 (upload endpoint) complete, so the accepted path shape matches exactly what the endpoint returns.

**Implementation notes:**
- Adds validation to the existing `coverImage` field (already present as an unused optional field per Phase 4, Scope Note 4) so that a non-empty value must match the `/images/articles/{slug}/...` namespace pattern.
- This is additive to the existing schema — no other field, validation rule, or the draft-save/publish-level structure established in Phase 4 is altered.
- Rejecting an arbitrary or externally supplied path is a server-side authoritative check; it does not depend on where the value came from, consistent with `06-security.md` §5's "client-side validation is never trusted alone."
- Does not add a `seo.ogImage` equivalent — `seo` remains entirely out of this phase's schema, per Phase 4 Scope Note 4 and this phase's own Scope Note 7.

**Verification checklist:**
- [ ] A `coverImage` value matching the expected `/images/articles/{slug}/...` shape is accepted.
- [ ] A `coverImage` value pointing outside `/images/articles/` (e.g. an arbitrary external URL or an unrelated path) is rejected.
- [ ] All previously passing Phase 4 schema tests (title/slug/category requirements, draft-save permissiveness) continue to pass unchanged.

**Completion criteria:** Task 5.6 is complete when the modification to `/lib/modules/articles/schema.ts` is in place and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 5.7 — Wire Cover Image field and inline content-image upload into the article form

**Objective:** Extend the existing `article-form.tsx` (Phase 4, Task 4.7) with a Cover Image field built on the existing `image-uploader.tsx` shell (Phase 3, Task 3.7), and a minimal inline content-image insertion trigger for the plain-textarea `content` field, wiring both to the Task 5.5 upload endpoint.

**Files involved:** `/components/admin/articles/article-form.tsx` (modify — existing Phase 4 file).

**Dependencies:** Task 5.5 (upload endpoint) and Task 5.6 (schema update) complete. Phase 3's `image-uploader.tsx` and Phase 4's `article-form.tsx` complete.

**Implementation notes:**
- Adds a Cover Image field to `article-form.tsx` that renders the existing `image-uploader.tsx` in its single-image configuration (per Task 3.7's "configurable for single (cover) vs. multiple (content) image use cases"), passing the current article's `slug` so the uploader knows which folder to target.
- On successful upload (`type: "cover"`), the returned `url` is set as the form's `coverImage` value and the returned/entered `alt` text is retained alongside it; the field's alt-text input is optional, per `14-article-image.md` §7.
- The actual persistence of `coverImage` into `/content/articles.json` happens through the existing Phase 4 save flow (the form's existing submit → `PUT`/`POST` to `/api/admin/articles*`), not through a separate save action introduced by this task — consistent with Task 5.5's note that the upload endpoint itself never writes the article record.
- Adds a minimal inline content-image insertion control (a button using the same `image-uploader.tsx` shell in its multiple/content configuration) that, on successful upload (`type: "content"`), inserts the returned `url` into the existing plain-textarea `content` field at the cursor position or at the end of the field's current value (Scope Note 6) — no Tiptap toolbar, node, or WYSIWYG rendering is introduced.
- Does not add a Status toggle, SEO section, or any field outside Cover Image and the content-image insertion trigger — every other part of `article-form.tsx` from Phase 4 remains unchanged.
- Client-side, non-authoritative feedback (wrong type/oversized file) continues to come from the existing `image-uploader.tsx` shell per its Task 3.7 behavior; this task does not duplicate that logic, only connects the shell's selected-file callback to a real request against Task 5.5's endpoint.

**Verification checklist:**
- [ ] The Cover Image field renders using the existing `image-uploader.tsx` component, with no duplicated drag-and-drop/preview implementation inside `article-form.tsx`.
- [ ] Selecting and uploading a valid cover image updates the form's `coverImage` value and shows the resulting image preview.
- [ ] Selecting an invalid file surfaces the existing client-side warning from `image-uploader.tsx`, and a server-side rejection (e.g. a corrupted file that passes client checks) surfaces the `422`/`400` error from Task 5.5 in the form.
- [ ] Saving the form after a successful cover upload persists `coverImage` via the existing Phase 4 save flow, verified by reloading the edit page and seeing the same cover image.
- [ ] Uploading a content image inserts its returned URL into the `content` textarea without altering any other field.
- [ ] No Tiptap component, toolbar, or dependency is introduced anywhere in this file.

**Completion criteria:** Task 5.7 is complete when the modification to `/components/admin/articles/article-form.tsx` is in place and every Verification checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

## Testing Checklist

✓ A valid JPG, JPEG, PNG, or WEBP cover image uploads successfully and is converted to WebP

✓ A valid content image uploads successfully, is converted to WebP, and is assigned the next sequential `article-N.webp` filename

✓ A non-image file, regardless of extension or declared MIME type, is rejected before processing

✓ A corrupted image file is rejected before processing, with no partial file written

✓ A file over 5 MB is rejected before Sharp processing begins

✓ A cover image over 1600×900 is resized down; a smaller image is not upscaled

✓ Replacing a cover image archives the previous file rather than deleting it

✓ The client-supplied filename never determines the stored filename or path, under any input

✓ A manipulated `slug` value (path traversal attempt) is rejected by the path-construction utility, not merely by an upstream check

✓ Alt text is accepted, returned by the upload endpoint, and persisted through the existing article save flow

✓ `POST /api/admin/articles/upload-image` rejects unauthenticated requests with `401`

✓ The upload endpoint never writes to `/content/articles.json` directly — only the existing `PUT`/`POST` article endpoints do

✓ No new drag-and-drop/preview component is created — the Phase 3 `image-uploader.tsx` is reused as-is

✓ No file is written to `/public/images/` from any code path outside `/lib/upload/`

---

## Completion Criteria

Phase 5 is complete when:
- Every task (5.1–5.7) is complete and its Verification checklist passes.
- The phase-wide Manual verification checklist (Phase Detail) passes.
- The Testing Checklist above passes in full.
- No file outside `/lib/upload/` and `/app/api/admin/articles/upload-image/` was created.
- No file outside `/lib/modules/articles/schema.ts` and `/components/admin/articles/article-form.tsx` was modified.
- No Phase 1, 2, or 3 file was modified.
- No other Phase 4 file (types, service, CRUD routes, article-columns, list/create/edit pages) was modified.

---

## Phase 5 Boundary — STOP HERE

Phase 5 ends with Task 5.7. Phase 5 must NOT implement:

- Media Library UI, image browser, or any page under a `/admin/media`-style route (Phase 6)
- Orphan image detection or bulk image management (Phase 6)
- Deletion of archived/orphaned image files — this phase only ever adds files, per `14-article-image.md` §5 and Scope Note 3
- Tiptap rich text editor configuration or toolbar (deferred, Scope Note 6 — still plain textarea, with only a minimal insertion trigger added)
- SEO metadata fields, `seo.ogImage`, or Next.js metadata wiring (`16-article-seo.md` is out of scope)
- Publish/Unpublish workflow, status-transition endpoints, or the alt-text publish-time warning (`15-article-publishing.md` is out of scope, Scope Note 7)
- Preview
- Search, Filtering, or Dashboard statistics
- Any future module (Destinations, Tour Packages, Gallery, FAQ, UMKM, Homepage)

These belong to later phases and are out of scope for this document.

---

## Self-Review

**Against previous roadmap phases:**
- No file created in Phase 1, 2, or 3 is modified or duplicated. The one Phase 3 component this phase depends on (`image-uploader.tsx`) is consumed as-is, never reimplemented (Scope Note 4).
- Of Phase 4's files, only `/lib/modules/articles/schema.ts` and `/components/admin/articles/article-form.tsx` are modified, and both modifications are additive extensions (a new namespace-validation rule; a new form field and insertion trigger) — no existing Phase 4 field, endpoint, or component behavior is altered or removed.
- The upload endpoint reuses Phase 2's `require-session.ts` rather than reimplementing session verification, consistent with every other protected route in Phases 4 and this phase.
- The archived-file numbering approach in Task 5.2 accounts for the exact scenario Phase 4's Task 4.4 already anticipated (an article's image folder may contain more files than the record currently references).

**Against the 20 architecture documents:**
- The processing pipeline order (Task 5.4) matches `14-article-image.md` §3 exactly: validate → resize → compress → convert to WebP → save.
- Filename generation (Task 5.2) matches `14-article-image.md` §4 exactly: fixed `cover.webp` slot, sequentially numbered `article-N.webp` for content images, client filename discarded entirely.
- Storage layout (Task 5.3) matches `04-storage-strategy.md` §4 and `14-article-image.md` §5: `public/images/articles/{slug}/`.
- Archival-not-deletion behavior (Task 5.4) matches `14-article-image.md` §5 exactly, resolving its tension with the general `04-storage-strategy.md` §9 line per Scope Note 3.
- Validation (Task 5.1, Task 5.5) matches `06-security.md` §7 and `14-article-image.md` §6: file-type-package magic-number detection, formats limited to jpg/jpeg/png/webp, corrupted files rejected before processing.
- The upload endpoint (Task 5.5) matches `20-api-articles.md` §9's route, request fields, behavior, response shape, and error table exactly.
- Path-traversal and filename-trust protections (Task 5.3) match `06-security.md` §9 and `14-article-image.md` §8 exactly.
- `coverImage` namespace validation (Task 5.6) matches `17-article-validation.md` §7 exactly.
- Alt text handling (Task 5.7) matches `14-article-image.md` §7 exactly: optional, captured at upload — with the publish-time warning correctly left to a later phase per Scope Note 7.
- Component reuse (Task 5.7) matches `11-admin-components.md` §3.7 and Phase 3 Task 3.7's explicit deferral of "upload pipeline wiring" to this phase.

**No scope overlap with Phase 6+:** Media Library, image browsing, orphan detection, and bulk management are named explicitly in the Phase 5 Boundary section above and appear nowhere in any task. Deletion of image files is never performed by this phase — every task that touches the filesystem only ever creates or renames-to-archive, never deletes, which is the precise line `18-media-library.md`-driven deletion (Phase 6) sits on the other side of.

**No duplicated implementation:** Each of the 7 tasks produces a distinct file or a distinct, non-overlapping modification to an existing file, with no responsibility repeated across tasks (type-checking, filename generation, path safety, pipeline orchestration, route handling, schema validation, and UI wiring are each owned by exactly one task).

**No contradictions introduced:** The two genuine tensions in the source documents that touch this phase — the 5 MB vs. 2 MB size limit (Scope Note 1) and the archive-vs-delete-on-replace behavior (Scope Note 3) — are both resolved explicitly, each grounded in a specific cited section rather than invented, and each is flagged (not silently buried) as a point to reconfirm before production, consistent with how `00-overview-and-cross-phase-reference.md` §3 and §7.3 already treat the size-limit conflict.

**What I could not verify:** As with previous phases, I do not have independent access to a running repository — this self-review is a documentation-level consistency check against the architecture documents and previously finalized roadmap phases, not a code-level test run.

If this is consistent with your expectations, I'll wait for your review before creating Phase 6.