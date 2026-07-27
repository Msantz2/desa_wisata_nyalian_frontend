# 18 - Media Library

## 1. Purpose

This document defines the Media Library: a cross-module view for browsing, managing, and reusing the images already stored under `/public/images` as part of module content (per `14-article-image.md`). The Media Library **manages uploaded images only** — it is **not a cloud storage service**, does not accept standalone uploads unrelated to a module record, and does not provide general-purpose file storage.

## 2. Media Sources

Images uploaded from the following sources **automatically appear** in the Media Library, with no separate registration step:

- The Article Editor's inline content image tool (`13-article-editor.md`, Section 9).
- The Article Editor's Cover Image field (`14-article-image.md`).
- Any future module's image upload flow, provided it follows the shared storage convention in `04-storage-strategy.md`, Section 4.

The Media Library does not replace these per-module upload flows; it is a complementary, cross-cutting view built on top of the same storage conventions, and does not itself accept uploads independent of a module record.

## 3. Data Source

The Media Library does not maintain its own separate data store. It is derived entirely from:

- The existing folder structure under `/public/images/{module}/{entity-id}/`, per the storage convention defined in `04-storage-strategy.md`, Section 4.
- Each module's JSON content file, used to resolve which image paths are currently **referenced** by an entity (e.g. an article's `coverImage`, or images embedded in its `content`).

This keeps the Media Library consistent with the single-source-of-truth principle established in `01-admin-overview.md`: there is no duplicate media index to keep in sync — the library is a computed view, not an independent dataset.

## 4. Media Library Page

Located at `/admin/media`, and included as its own entry in the shared navigation configuration (`10-admin-navigation.md`), grouped under "Content" alongside Articles and future content modules.

### 4.1 Layout

Built from shared components (`11-admin-components.md`):

```
Page Header ("Media Library")
  Search & Filter Bar (filter by module/source, text search on filename)
    Grid/Gallery View (thumbnail per image)
```

- Images are displayed as a responsive thumbnail grid rather than a data table, since visual scanning is the primary interaction pattern for a media library, unlike the record-oriented list views used elsewhere in the dashboard.
- Each media item displays the following information:
  - **Preview**
  - **Filename**
  - **Upload date**
  - **File size**
  - **Image dimensions**
  - **Module** (the originating module, e.g. "Articles")
  - **Usage status** (`Used` or `Unused (Orphan)`, per Section 6)

### 4.2 Search & Filtering

The Search & Filter Bar supports:

- **Filename** — free-text search.
- **Module** — filter by source module, using the same module registry concept introduced in `09-admin-dashboard.md`, so the filter list grows automatically as new modules with images register themselves.
- **Upload date** — filter/sort by upload date.

## 5. Image Detail View

Selecting an image opens a detail panel (using the shared Dialog component, `11-admin-components.md`, Section 3.6) showing:

- Full-size preview.
- File metadata: filename, upload date, file size, dimensions.
- **Module** — the originating module.
- **Usage status**: `Used` or `Unused (Orphan)` (Section 6), with the referencing entity named when `Used` (e.g. "Used as cover image on article: 'Pantai Nyalian'").
- A **Delete** action, enabled only when the image's usage status is `Unused (Orphan)` (Section 7).

## 6. Usage Detection

Every image has exactly one of two states:

| State | Meaning |
|---|---|
| `Used` | Currently referenced by at least one record in a module's JSON content |
| `Unused (Orphan)` | Not referenced by any current record in any module's JSON content |

Usage is determined by **checking references inside all JSON content** — cross-referencing every image path found under `/public/images/{module}/...` against the fields that store image paths (e.g. an article's `coverImage`, or images embedded in its `content`) across every module's JSON data. This is a **read-time computation**, not a background job or a separate index, keeping the feature simple and consistent with the project's lightweight, database-less architecture, and with the single-source-of-truth principle established in `01-admin-overview.md`.

## 7. Delete Rules

- **Used images cannot be deleted.** If an image is currently referenced by any record, the Delete action is disabled in the Media Library, and any deletion attempt (including via the API) is rejected.
- **Unused (Orphan) images can be deleted, after confirmation.** Deleting an unused image uses the shared Confirm Delete dialog (`11-admin-components.md`, Section 3.6) before removing the file from disk.
- **The system must never allow deletion if the image is still referenced**, regardless of the entry point (Media Library UI or API) — this check is enforced server-side at the point of deletion, not only in the UI, consistent with `06-security.md`.
- To delete a currently `Used` image, the administrator must first remove or replace the reference within the owning module's own edit flow (`14-article-image.md`), after which the image becomes `Unused (Orphan)` and eligible for deletion from the Media Library.

## 8. Relationship to Per-Module Upload Flows

| Concern | Where it happens |
|---|---|
| Uploading an image for a specific entity (e.g. an article's cover image) | Within that module's own editor, per `14-article-image.md` |
| Browsing all images across modules | Media Library (`/admin/media`) |
| Safely deleting an unreferenced image | Media Library, with usage-aware deletion protection |
| Replacing an image already in use by an entity | Within that entity's own editor (not the Media Library), so the replace-then-delete lifecycle in `14-article-image.md`, Section 6, remains the single authoritative path for in-use image changes |

The Media Library intentionally does **not** duplicate upload functionality tied to a specific entity — it is a management and oversight tool, not an alternate upload entry point for content that belongs to a module record.

## 9. Extensibility for Future Modules

- Any future module that stores images under `/public/images/{module}/...` and exposes its content via a readable JSON data source is automatically included in the Media Library's scope, provided it follows the shared storage convention from `04-storage-strategy.md`.
- No Media Library code changes are required to support a new module's images — inclusion is a natural consequence of following the established storage and module conventions, consistent with the scalability goals in `01-admin-overview.md` and `02-admin-architecture.md`.
- The future Gallery module (`01-admin-overview.md`, Section 6) is expected to be the first module where images are the primary content rather than a supporting asset; when introduced, the Media Library remains relevant as the general oversight tool, while Gallery's own module documentation would define its specific data model (e.g. captions, ordering) on top of the same shared image storage and validation foundations.

## 10. Summary

The Media Library provides a unified, computed view over all images stored across modules, without introducing a separate media data store. It supports browsing, usage inspection, and safe deletion of unreferenced images, while leaving entity-specific image upload and replacement to each module's own edit flow — extending automatically to future modules that follow the shared storage conventions already established.