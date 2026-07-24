# 20 - API Articles

## 1. Purpose

This document defines the concrete API contract for the Articles module, applying the shared conventions established in `19-api-overview.md` to the Articles data model defined in `12-articles.md`. It is the reference implementation other modules' future API documentation will follow.

## 2. Base Route

```
/api/admin/articles
```

All endpoints below require a valid **server-side session**, referenced by an HTTP-only cookie, per `03-authentication.md`. **No JWT** is used. The only unauthenticated endpoint in the system is the login endpoint (`POST /api/admin/login`, per `19-api-overview.md`, Section 8) — every endpoint listed in this document requires authentication.

**All timestamps returned by this API use ISO 8601 UTC format** (e.g. `2026-07-10T09:15:00.000Z`). Clients must treat all timestamps as UTC and perform any timezone conversion on the client side if needed.

## 3. List Articles

**`GET /api/admin/articles`**

Query parameters (per `19-api-overview.md`, Section 5):

| Parameter | Description |
|---|---|
| `page` | Page number (default 1) |
| `limit` | Records per page (default 20, max 100) |
| `search` | Matches against `title` |
| `sort` | Field to sort by (e.g. `updatedAt`, `title`) |
| `order` | Sort direction (`asc` or `desc`) |

Response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "a1b2c3",
        "slug": "festival-nyalian-2026",
        "title": "Festival Nyalian 2026",
        "excerpt": "A short summary of the festival...",
        "status": "published",
        "coverImage": "/images/articles/festival-nyalian-2026/cover.webp",
        "category": "Events",
        "updatedAt": "2026-07-10T09:15:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

> Note: list responses return a summary projection of each article (excluding full `content` and `seo` detail) to keep listing payloads lightweight, consistent with the Data Table's needs (`12-articles.md`, Section 4).

## 4. Get Single Article

**`GET /api/admin/articles/:id`**

Returns the full article record, including `content` and `seo`, used to populate the editor in edit mode (`13-article-editor.md`).

```json
{
  "success": true,
  "data": {
    "id": "a1b2c3",
    "slug": "festival-nyalian-2026",
    "title": "Festival Nyalian 2026",
    "excerpt": "A short summary of the festival...",
    "content": "<p>Full sanitized HTML content...</p>",
    "coverImage": "/images/articles/festival-nyalian-2026/cover.webp",
    "coverImageAlt": "Traditional dance performance at the village square",
    "status": "published",
    "publishedAt": "2026-06-01T08:00:00.000Z",
    "author": "Admin",
    "category": "Events",
    "seo": {
      "metaTitle": null,
      "metaDescription": null,
      "ogImage": null,
      "canonicalUrl": null,
      "noIndex": false
    },
    "createdAt": "2026-05-28T10:00:00.000Z",
    "updatedAt": "2026-07-10T09:15:00.000Z"
  }
}
```

Errors: `404` / `NOT_FOUND` if no article with the given `id` exists.

## 5. Create Article

**`POST /api/admin/articles`**

The request body is validated using **Zod** before any business logic executes; invalid requests are rejected immediately. If `content` is present, it is sanitized using **sanitize-html** before being saved. Draft-level validation applies unless `status: "published"` is explicitly submitted, in which case publish-level validation applies (Section 8).

```json
{
  "title": "New Article Title",
  "slug": "new-article-title",
  "category": "Culture",
  "excerpt": "",
  "content": "",
  "author": "Admin",
  "status": "draft"
}
```

Response: `201 Created`, with the full created record in the standard success envelope (`19-api-overview.md`, Section 6.1), including the server-generated `id`, `createdAt`, and `updatedAt`. The article's JSON record is written using an **atomic write** (`04-storage-strategy.md`, Section 8).

Errors:
- `422` / `VALIDATION_ERROR` — e.g. missing `title`, `slug`, or `category`. Example response with multiple field errors:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "errors": [
      {
        "field": "title",
        "message": "Title is required"
      },
      {
        "field": "slug",
        "message": "Slug is already in use"
      },
      {
        "field": "category",
        "message": "Category must be one of: Events, Culture, Travel, News"
      }
    ]
  }
}
```

- `409` / `CONFLICT` — `slug` already in use (when not caught during schema validation).

## 6. Update Article

**`PUT /api/admin/articles/:id`**

Accepts the full article record (as edited in the editor), validated using the same Zod schema and sanitize-html step as creation. `id`, `createdAt` are preserved server-side regardless of request body content; `updatedAt` is refreshed automatically. The write uses the same atomic write pattern as creation.

Response: `200 OK`, with the full updated record.

Errors: same as Create (Section 5), plus `404` / `NOT_FOUND` if `id` does not exist.

## 7. Delete Article

**`DELETE /api/admin/articles/:id`**

Deletes the article record and its associated image folder, per `12-articles.md`, Section 5.4, and `14-article-image.md`.

Response:

```json
{
  "success": true,
  "data": { "deleted": true }
}
```

Errors: `404` / `NOT_FOUND` if `id` does not exist.

## 8. Publish / Unpublish Article

**`POST /api/admin/articles/:id/publish`**
**`POST /api/admin/articles/:id/unpublish`**

Dedicated action endpoints, separate from the general `PUT` update endpoint, reflecting the explicit, distinct nature of status transitions defined in `15-article-publishing.md`, Section 3. No request body is required.

**Publishing requires the following fields to be present and valid:**

- `title`
- `slug`
- `category`
- `content`
- `coverImage`
- `coverImage` alt text
- `publishedAt` (publish date)

**Drafts may remain incomplete** — none of the above are required to save a draft (`17-article-validation.md`, Section 4).

Behavior:
- `publish` validates the fields above using Zod; on success, sets `status: published`, sets `publishedAt` if not already set, and triggers public-site revalidation per `15-article-publishing.md`, Section 6.
- `unpublish` sets `status: draft`, leaves `publishedAt` unchanged, and triggers revalidation so the article is promptly removed from public listings/detail pages.

Response: `200 OK`, with the full updated record.

**Example publish response:**

```json
{
  "success": true,
  "data": {
    "id": "a1b2c3",
    "slug": "festival-nyalian-2026",
    "title": "Festival Nyalian 2026",
    "excerpt": "A short summary of the festival...",
    "content": "<p>Full sanitized HTML content...</p>",
    "coverImage": "/images/articles/festival-nyalian-2026/cover.webp",
    "coverImageAlt": "Traditional dance performance at the village square",
    "status": "published",
    "publishedAt": "2026-07-10T14:30:00.000Z",
    "author": "Admin",
    "category": "Events",
    "seo": {
      "metaTitle": null,
      "metaDescription": null,
      "ogImage": null,
      "canonicalUrl": null,
      "noIndex": false
    },
    "createdAt": "2026-05-28T10:00:00.000Z",
    "updatedAt": "2026-07-10T14:30:00.000Z"
  }
}
```

**Example unpublish response:**

```json
{
  "success": true,
  "data": {
    "id": "a1b2c3",
    "slug": "festival-nyalian-2026",
    "title": "Festival Nyalian 2026",
    "excerpt": "A short summary of the festival...",
    "content": "<p>Full sanitized HTML content...</p>",
    "coverImage": "/images/articles/festival-nyalian-2026/cover.webp",
    "coverImageAlt": "Traditional dance performance at the village square",
    "status": "draft",
    "publishedAt": "2026-07-10T14:30:00.000Z",
    "author": "Admin",
    "category": "Events",
    "seo": {
      "metaTitle": null,
      "metaDescription": null,
      "ogImage": null,
      "canonicalUrl": null,
      "noIndex": false
    },
    "createdAt": "2026-05-28T10:00:00.000Z",
    "updatedAt": "2026-07-10T15:45:00.000Z"
  }
}
```

Errors:
- `422` / `VALIDATION_ERROR` on `publish`, with an `errors` array listing every unmet publish requirement (e.g. missing `coverImage`), per `17-article-validation.md`, Section 10.
- `404` / `NOT_FOUND` if `id` does not exist.

## 9. Upload Article Image

**`POST /api/admin/articles/upload-image`**

Accepts `multipart/form-data` with:

| Field | Description |
|---|---|
| `file` | The image file being uploaded |
| `slug` | The target article's slug, used to determine the storage folder (`public/images/articles/{slug}/`) |
| `type` | `"cover"` or `"content"`, determining storage naming per `14-article-image.md`, Section 4 |
| `alt` | Optional alt text accompanying the image |

Behavior:
- **Accepted formats**: jpg, jpeg, png, webp. All other file types are rejected.
- File type is validated using **file-type**, based on actual file content, not the extension or declared MIME type.
- **Maximum upload size: 5 MB.** Files exceeding this are rejected before processing.
- Accepted files are processed using **Sharp** and **converted to WebP** before being written to `public/images/articles/{slug}/`, per `14-article-image.md`, Sections 3–4.
- For `type: "cover"`, the response is used by the client to update the article's `coverImage` field via a subsequent `PUT` request; the previous cover image is retained as an archive, per `14-article-image.md`, Section 5.

Response:

```json
{
  "success": true,
  "data": {
    "url": "/images/articles/festival-nyalian-2026/cover.webp",
    "alt": "Traditional dance performance at the village square"
  }
}
```

Errors:
- `422` / `VALIDATION_ERROR` — invalid file type or corrupted file. Implementation-specific code: `IMAGE_TYPE_INVALID`. Example:

```json
{
  "success": false,
  "error": {
    "code": "IMAGE_TYPE_INVALID",
    "message": "File type not supported. Accepted formats: jpg, jpeg, png, webp"
  }
}
```

- `400` / `BAD_REQUEST` — file exceeds the 5 MB limit. Implementation-specific code: `IMAGE_TOO_LARGE`. Example:

```json
{
  "success": false,
  "error": {
    "code": "IMAGE_TOO_LARGE",
    "message": "File size exceeds 5 MB limit"
  }
}
```

- `422` / `VALIDATION_ERROR` — image processing (e.g. Sharp WebP conversion) fails. Implementation-specific code: `IMAGE_PROCESSING_FAILED`. Example:

```json
{
  "success": false,
  "error": {
    "code": "IMAGE_PROCESSING_FAILED",
    "message": "Failed to process image"
  }
}
```

- `404` / `NOT_FOUND` — no article exists with the given `slug`.

## 10. Storage

- Article records are stored as **JSON** in `/content/articles.json`, per `04-storage-strategy.md`.
- Images are stored inside `public/images/articles/{slug}/`.
- All writes (record and image) use **atomic writes**, per `04-storage-strategy.md`, Section 8.

## 11. Internal Server Error Policy

Any `500` response (Internal Server Error) returned by the Articles API must adhere to the following policy to prevent information leakage:

- **No stack traces** in the response body or error message.
- **No filesystem paths** (e.g. `/home/user/project/...` or `C:\path\to\file`).
- **No exception messages** or internal implementation details (e.g. database connection strings, library versions, function names).
- The error response must be generic and user-facing (e.g. `"An unexpected error occurred. Please try again later."`).
- Internal error details must be logged server-side only, with sufficient information for debugging by developers and operators, but never returned to the client.

This policy ensures that API errors do not expose information that could aid an attacker in reconnaissance or exploitation.

## 12. Endpoint Summary

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/admin/articles` | List articles (paginated, searchable, sortable) |
| `GET` | `/api/admin/articles/:id` | Get a single article |
| `POST` | `/api/admin/articles` | Create a new article |
| `PUT` | `/api/admin/articles/:id` | Update an article |
| `DELETE` | `/api/admin/articles/:id` | Delete an article |
| `POST` | `/api/admin/articles/:id/publish` | Publish an article |
| `POST` | `/api/admin/articles/:id/unpublish` | Unpublish an article |
| `POST` | `/api/admin/articles/upload-image` | Upload a cover or content image |

## 13. Reference Pattern for Future Modules

This endpoint set demonstrates the complete API surface a content module built on the shared conventions in `19-api-overview.md` is expected to expose: standard CRUD endpoints, one or more dedicated action endpoints for meaningful state transitions (here, publish/unpublish), and an upload sub-route for media handling. Future modules with similar needs (e.g. Tour Packages, UMKM) are expected to expose an equivalent, analogously named set of endpoints under their own `/api/admin/{module}` base path.

## 14. Summary

The Articles API exposes standard CRUD endpoints alongside dedicated publish/unpublish and image upload actions, all built on the shared request/response conventions, error format, and authentication enforcement defined in `19-api-overview.md`. This completes the Articles module's documentation set and establishes the reference API pattern for every future module in the Admin Dashboard.