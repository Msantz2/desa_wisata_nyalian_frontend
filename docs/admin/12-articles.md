# 12 - Articles

## 1. Purpose

This document defines the Articles module: its data model, list view behavior, and CRUD lifecycle. It is the entry point for the Articles-specific documentation set and applies the shared conventions established in earlier documents — module architecture (`02-admin-architecture.md`), storage strategy (`04-storage-strategy.md`), and shared UI components (`11-admin-components.md`) — to a concrete, working module.

Deeper Articles-specific concerns are covered in dedicated documents: the content editor (`13-article-editor.md`), image handling (`14-article-image.md`), publishing workflow (`15-article-publishing.md`), SEO metadata (`16-article-seo.md`), and validation rules (`17-article-validation.md`). This document focuses on the module as a whole: its data shape and its list/CRUD behavior.

## 2. Module Role

Articles represent editorial content published on the public Nyalian Tourism Village website — news, stories, guides, or announcements related to the village. The Articles module is the **first implemented module**, and its structure serves as the reference pattern that future modules (Destinations, Tour Packages, Gallery, FAQ, UMKM, Homepage) will follow, per `02-admin-architecture.md`, Section 6.

## 3. Data Model

Each article record is stored as one entry in `/content/articles.json`, following the shared record conventions defined in `04-storage-strategy.md`, Section 5.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes (system-generated) | Unique, immutable identifier. |
| `slug` | string | Yes | URL-friendly identifier, derived from title, editable, unique within the module. |
| `title` | string | Yes | Article headline. |
| `excerpt` | string | Yes | Short summary shown in listings and previews. |
| `content` | string (rich text/HTML) | Yes | Full article body, detailed in `13-article-editor.md`. |
| `coverImage` | string (file path) | Yes for published articles | Path to the article's cover image, detailed in `14-article-image.md`. |
| `status` | enum: `draft` \| `published` | Yes | Publishing state, detailed in `15-article-publishing.md`. |
| `publishedAt` | string (ISO 8601) or `null` | Conditional | Set when the article transitions to `published`; `null` while in `draft`. |
| `author` | string | Optional | Display name of the content author/admin. |
| `category` | string | Optional | Editorial grouping (e.g. "Events", "Culture"), free-form or constrained per future refinement. |
| `seo` | object | Optional | SEO metadata fields, detailed in `16-article-seo.md`. |
| `createdAt` | string (ISO 8601) | Yes (system-generated) | Set once at creation. |
| `updatedAt` | string (ISO 8601) | Yes (system-generated) | Updated on every successful write. |

Full field-level validation rules (length limits, format constraints, required conditions) are defined in `17-article-validation.md` and are not duplicated here.

## 4. List View

The Articles list view (`/admin/articles`) is composed from the shared components defined in `11-admin-components.md`:

- **Page Header**: title "Articles", primary action "New Article" linking to `/admin/articles/new`.
- **Search & Filter Bar**: text search across `title`, and a status filter (`All` / `Published` / `Draft`).
- **Data Table** columns:
  | Column | Source | Notes |
  |---|---|---|
  | Title | `title` | Links to the edit view |
  | Status | `status` | Rendered via the shared Status Badge component |
  | Category | `category` | Optional column; blank if not set |
  | Updated | `updatedAt` | Relative or formatted date |
  | Actions | — | Edit, Delete (via shared Confirm Delete dialog) |
- **Pagination**: standard shared pagination, page size chosen based on expected content volume (e.g. 10–20 per page).
- **Empty State**: shown when no articles exist yet, prompting creation of the first article.

## 5. CRUD Lifecycle

### 5.1 Create
1. Admin selects "New Article" from the list view or the dashboard quick action (`09-admin-dashboard.md`).
2. Admin is presented with the article editor (`13-article-editor.md`) in creation mode, defaulting to `status: draft`.
3. On submit, the request is validated (`17-article-validation.md`) and, if valid, a new record is created via the atomic write pattern (`04-storage-strategy.md`, Section 8), with `id`, `createdAt`, and `updatedAt` generated server-side.
4. Admin is redirected to the list view (or the edit view of the newly created article), with a success notification (per `11-admin-components.md`, Section 3.10).

### 5.2 Read
- The list view (Section 4) provides the primary read interface.
- An individual article's full data is loaded into the editor when opening `/admin/articles/[id]/edit`.
- Reads are always performed server-side per module service conventions (`04-storage-strategy.md`, Section 7); the client never reads `articles.json` directly.

### 5.3 Update
1. Admin opens an existing article via the list view's Edit action.
2. The editor is pre-populated with the existing record's data.
3. On submit, the same validation and atomic write path as creation is used, with `updatedAt` refreshed and `id`/`createdAt` preserved unchanged.
4. If the associated image is replaced, the image lifecycle rules in `14-article-image.md` apply.

### 5.4 Delete
1. Admin triggers Delete from the list view's row actions.
2. The shared Confirm Delete dialog (`11-admin-components.md`, Section 3.6) requires explicit confirmation, displaying the article's title.
3. On confirmation, the record is removed from `articles.json` via the atomic write pattern, and its associated image folder (`/public/images/articles/{id}`) is removed as part of the same operation, per `04-storage-strategy.md`, Section 9.
4. Deletion is permanent in v1; no soft-delete or trash/recovery mechanism is included (noted as a potential future enhancement, consistent with the versioning note in `01-admin-overview.md`, Section 4).

## 6. Article States

Articles exist in one of two states at any time, detailed further in `15-article-publishing.md`:

| State | Meaning | Visible on public site? |
|---|---|---|
| `draft` | Work in progress, not finalized | No |
| `published` | Finalized and live | Yes |

## 7. Relationship to Other Documents

This document intentionally does not duplicate detail owned by the following related documents:

| Concern | Covered in |
|---|---|
| Rich text editing experience | `13-article-editor.md` |
| Cover/content image handling | `14-article-image.md` |
| Draft/publish workflow and revalidation | `15-article-publishing.md` |
| SEO metadata fields | `16-article-seo.md` |
| Field-level validation rules | `17-article-validation.md` |
| API contract for Articles | `20-api-articles.md` |

## 8. Reference Pattern for Future Modules

The Articles module demonstrates the full module contract defined in `02-admin-architecture.md`, Section 6: its own route group, API routes, schema, service, storage file, and image namespace. Future modules are expected to mirror this same structure — a list view built from shared components, a create/edit flow, and dedicated sub-documents for any concern (like publishing or SEO) significant enough to warrant its own documentation, exactly as Articles does here.

## 9. Summary

The Articles module manages editorial content through a standard CRUD lifecycle, built entirely from the shared architecture, storage, and UI conventions established in earlier documents. It stores structured records in `/content/articles.json`, manages associated images under `/public/images/articles`, and supports draft/published states — serving as the concrete reference implementation that future content modules will follow.