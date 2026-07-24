# 04 - Storage Strategy

## 1. Purpose

This document defines how content data and media files are stored, structured, accessed, and safely mutated by the Admin Dashboard. It establishes the conventions that every module — Articles in v1, and future modules — must follow, consistent with the layered architecture defined in `02-admin-architecture.md`.

## 2. Storage Model Overview

The project intentionally avoids a database in v1. Instead, it uses:

- **JSON files** as the structured content store (the "system of record" for each module's data).
- **The local filesystem under `/public/images`** as the media store, so images remain directly servable by the static site without an additional media server or CDN dependency.

Both the Admin Dashboard and the public website read from these same sources — there is no synchronization step, no duplicate data store, and no export/import process between "admin data" and "site data."

## 3. Content File Location

JSON content files are stored under a dedicated top-level `/content` directory, **outside of `/public`**:

```
/content
  articles.json
  _system/
    admins.json        (if Option B from 03-authentication.md is used)
```

Rationale for keeping JSON outside `/public`:

- Files under `/public` are directly servable by the web server. Content files may include fields not intended for public exposure (e.g. internal notes, draft content, authoring metadata).
- Keeping `/content` outside `/public` ensures raw JSON is only ever exposed through controlled API routes (public-facing read APIs, if any, are explicit and deliberate — not incidental).
- The public site's data-fetching layer reads from `/content` at build time or via server-side code, not via a public static file URL.

> If a specific module later requires direct public static access to its raw JSON (e.g. for a public API), that must be an explicit, reviewed decision — not the default behavior.

## 4. Image File Location

Images remain under `/public/images`, organized per module:

```
/public/images
  /articles
    {article-id-or-slug}/
      cover.jpg
      content-1.jpg
      ...
```

Rationale:

- Images must be publicly servable by the static site, so they remain under `/public` per Next.js convention.
- Namespacing by module (`/articles`, and later `/destinations`, `/gallery`, etc.) prevents filename collisions and keeps media organized as the number of modules grows.
- Namespacing by entity (article id/slug) within each module folder keeps an article's images grouped and simplifies cleanup on deletion.

## 5. Data Structure Convention

Each module's JSON file stores an **array of records**, where each record represents one entity (e.g. one article):

```json
[
  {
    "id": "unique-id",
    "slug": "article-slug",
    "...module-specific fields": "..."
  }
]
```

Conventions applied across all modules:

| Field | Convention |
|---|---|
| `id` | Unique, immutable identifier generated at creation time (e.g. UUID). Never reused, never edited. |
| `slug` | URL-friendly identifier, derived from title, used for public routing. May be edited, but must remain unique within the module. |
| `createdAt` | ISO 8601 timestamp, set once at creation. |
| `updatedAt` | ISO 8601 timestamp, updated on every successful write. |

Module-specific fields (e.g. Articles' `title`, `content`, `coverImage`) are defined in that module's dedicated documentation (`12-articles.md` and related files) and schema (`17-article-validation.md`).

## 6. Identifier & Slug Strategy

- **`id` generation**: generated server-side at creation time using a collision-resistant method (e.g. UUID v4). The client never supplies or chooses the `id`.
- **`slug` generation**: derived automatically from the title by default (lowercase, hyphenated, diacritics normalized), but editable by the admin before publishing.
- **Uniqueness enforcement**: before persisting a create or update operation, the data access layer must verify that the resulting slug does not already exist elsewhere in the same module's dataset. Slug collisions are resolved either by rejecting the write with a validation error or by appending a numeric suffix, per module-specific rules defined later.

## 7. Read Strategy

- All reads for admin operations happen **server-side**, inside API Route Handlers or module services — never by having the client fetch the JSON file directly.
- The data access layer's read function loads the full JSON array, since content volumes for a village tourism site are expected to remain small enough that in-memory processing (filtering, sorting, pagination) is efficient without requiring a database or indexing layer.
- If a module's dataset grows large enough that this assumption no longer holds, that module's service can be optimized independently (e.g. adding lightweight indexing) without affecting the shared architecture.

## 8. Write Strategy & Data Integrity

Because multiple concurrent write requests are technically possible (e.g. two admin actions happening close together, or a slow request overlapping a new one), the write strategy must protect against race conditions and partial/corrupted writes.

### 8.1 Atomic Write Pattern

All writes to a module's JSON file follow an atomic-write pattern designed to prevent partial writes, corruption, and loss of the last known-good state:

**Write Flow:**

1. **Read the current file**: Load the existing JSON file into memory. If the file does not exist, initialize an empty array.
2. **Apply the change in memory**: Create, update, or delete the record in the in-memory array without modifying the original file.
3. **Write to temporary file**: Write the updated content to a temporary file (e.g. `articles.json.tmp`) in the same directory as the original. The temporary file name must include a collision-safe suffix (e.g. `.tmp` or `.{pid}.tmp` to avoid collisions if multiple processes run) and must reside on the same filesystem as the target file to ensure atomic rename.
4. **Flush and synchronize**: Call `fsync()` on the temporary file's file descriptor to ensure all data is written to persistent storage and not held in the OS buffer cache. Do not proceed to the next step until `fsync()` completes successfully.
5. **Atomic rename**: Rename the temporary file to the target filename (e.g. `articles.json.tmp` → `articles.json`). This rename operation is atomic at the filesystem level on POSIX-compliant systems (including Node.js hosting environments), ensuring readers never observe a half-written file.
6. **Preserve original on failure**: If any step fails (write error, fsync error, rename error), the temporary file is deleted and the original file remains untouched. The operation is aborted and an error is returned to the caller.

**Error Handling:**

- If writing to the temporary file fails, delete the temporary file and return an error without modifying the original.
- If `fsync()` fails, delete the temporary file and return an error.
- If rename fails, the temporary file is left in place temporarily, but the original file is not modified. The operation is aborted; temporary file cleanup happens at recovery time (see Section 8.4).
- In all failure cases, the original JSON file is guaranteed to be either fully intact or unmodified from before the write attempt, never left in a partial or corrupted state.

### 8.2 Write Serialization

- Write operations for a given module's JSON file are serialized (e.g. via an in-process write queue/lock per file) so that concurrent requests to modify the same file do not interleave.
- This is sufficient for the expected scale (single Node.js process, small admin team) without requiring distributed locking. If the deployment later scales to multiple Node.js instances/processes sharing the same filesystem, this assumption must be revisited (e.g. by introducing file-level locking or migrating to a database).

### 8.3 Concurrency & Race Condition Handling

**Single Node.js Process Assumption:**

v1 of the Admin Dashboard runs as a single Node.js process on a single server instance. Under this assumption, JavaScript's single-threaded event loop and in-process write serialization (Section 8.2) are sufficient to prevent race conditions and concurrent writes to the same JSON file.

**Single-Writer Policy:**

- Only one write operation may be actively writing to a module's JSON file at any given time.
- When multiple write requests arrive simultaneously or in quick succession, they are queued and processed sequentially by a per-file write lock or message queue.
- The application does not attempt to serialize writes across multiple Node.js processes or instances; such scenarios are out of scope for v1.

**Sequential Write Operations:**

- Each write operation acquires an exclusive in-memory lock before beginning the read-in-memory-apply-write-rename sequence (Section 8.1).
- The lock is held for the entire duration of the write operation, including the `fsync()` call and rename, ensuring no other write request can modify the file while one is in progress.
- Once the rename succeeds, the lock is released and the next queued write is allowed to proceed.

**Expected Behavior with Concurrent Requests:**

- If two admin users attempt to modify the same article simultaneously, the second request waits until the first write completes (i.e. until the rename succeeds).
- The second request then reads the updated file (which now includes the first user's changes) and applies its own changes on top, following the same atomic write pattern.
- Both operations complete successfully in the order they were queued; no data is lost or corrupted.

**Multi-Process Deployments (Out of Scope for v1):**

- If the application is later deployed as multiple Node.js instances or processes (e.g. via clustering or container orchestration), in-process write locks are no longer sufficient to prevent concurrent writes across instances.
- At that time, the project must either:
  - Introduce filesystem-level locking (e.g. using `fcntl`, `flock`, or a dedicated locking library) coordinating across processes, or
  - Migrate to a database or distributed consensus mechanism to ensure only one write occurs at a time.
- This revision is required before scaling beyond a single Node.js process; it is not attempted in v1.

### 8.4 Crash Recovery & Temporary File Cleanup

**Recovery After Interrupted Writes:**

If the application crashes, is forcibly terminated, or loses power during a write operation, a temporary file (e.g. `articles.json.tmp`) may be left on disk. This does not corrupt the original file because the rename (Section 8.1, step 5) never occurred.

The application must perform cleanup on startup:

- On application startup, before accepting any write requests, scan each module's content directory for temporary files matching the naming pattern (e.g. `*.tmp` or `*.{pid}.tmp`).
- Delete any temporary files found. These represent incomplete writes that were never committed via rename, so their content is discarded.
- The original JSON file is always left intact if a rename was never attempted, or was already replaced if the rename succeeded before the crash.

**Corrupted JSON Handling:**

If a JSON file is corrupted (malformed syntax, truncated content, etc.) and cannot be parsed:

- The read operation fails with a clear error message indicating the file is corrupted.
- No writes are attempted until the issue is resolved.
- The admin must either:
  - Manually restore the file from a backup (see Section 10), or
  - Contact support or manually edit the file to restore valid JSON syntax.
- Because corrupted files are always a sign of a serious problem (e.g. a filesystem error or a bug in the write logic that was not caught by fsync/rename safeguards), immediate investigation is warranted.

**Recovery Guarantee:**

The combination of atomic write semantics (Section 8.1) and temporary file cleanup ensures that:

- The original JSON file is never corrupted by a failed or interrupted write.
- At most, a temporary file is left on disk, which is harmless and cleaned up on the next application startup.
- If both the original file and any temporary files are lost or corrupted, the application falls back to backup restoration (Section 10).

### 8.5 Validation Before Write

- No data reaches the write step without first passing schema validation (see `02-admin-architecture.md`, Section 5.3, and module-specific validation docs such as `17-article-validation.md`).
- The data access layer performs a final integrity check (e.g. required fields present, `id` uniqueness, slug uniqueness) immediately before writing, independent of earlier validation, as a defense-in-depth measure.

## 9. Image Storage Strategy

- Uploaded images are validated (file type, size limits — detailed in `14-article-image.md`) before being written to disk.
- Images are saved using a **generated, collision-safe filename** (e.g. based on the entity id plus a purpose suffix, such as `cover.jpg`), avoiding direct use of the original uploaded filename to prevent path traversal or naming collisions.
- When an entity (e.g. an article) is deleted, its associated image folder is removed as part of the same deletion operation, avoiding orphaned files.
- When an image is replaced (e.g. a new cover image uploaded), the previous image file is deleted after the new one is successfully written and the JSON record is updated — never before, to avoid a state where the record references a missing file.

## 10. Backup & Recovery Considerations

Since JSON files and images are the sole system of record, backup strategy is critical:

- The hosting environment must include **regular filesystem backups** covering both `/content` and `/public/images` (coordinated with the hosting provider's backup capabilities — see `05-deployment.md`).
- Because the atomic write pattern (Section 8.1) always writes to a temporary file before renaming, a failed write never corrupts the last known-good JSON file.
- It is recommended (though not mandatory for v1) that the write process retain a rolling number of previous versions of each JSON file (e.g. `articles.json.bak`) to support quick manual recovery from accidental data loss, independent of full infrastructure backups.

## 11. Consistency Between Admin and Public Site

- The public website and the Admin Dashboard read the same `/content` files, so there is no data synchronization step to maintain.
- How quickly a change made in the Admin Dashboard becomes visible on the public site depends on the site's rendering strategy (e.g. static generation with revalidation vs. server-side rendering), which is defined in `05-deployment.md`.

## 12. Scalability of the Storage Approach

This JSON-and-filesystem approach is deliberately chosen for v1's scale (a single tourism village site, a small admin team, moderate content volume). It scales across modules cleanly because:

- Each module owns its own JSON file and image namespace, so growth in one module (e.g. Gallery) does not affect another (e.g. Articles).
- The atomic write and validation patterns are shared, generic utilities, not reimplemented per module.

Should content volume, concurrent admin usage, or query complexity grow beyond what this model comfortably supports, the data access layer (Section 5.4 of `02-admin-architecture.md`) is the sole layer that would need to change — for example, migrating to a lightweight embedded database (e.g. SQLite) or a full external database — without requiring changes to the UI, API contracts, or module structure.

## 13. Summary

Content is stored as structured JSON files under `/content`, and media is stored under `/public/images`, both organized per module. Writes are performed atomically and serialized to prevent race conditions and data corruption, with validation enforced immediately before persistence. This storage strategy preserves the project's static, database-less nature while remaining safe, predictable, and scalable across current and future modules.