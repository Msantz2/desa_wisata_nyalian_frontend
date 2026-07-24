# 17 - Article Validation

## 1. Purpose

This document consolidates the validation rules for the Articles module, referenced but not fully detailed in `12-articles.md`, `13-article-editor.md`, `14-article-image.md`, `15-article-publishing.md`, and `16-article-seo.md`. It applies the general validation architecture defined in `02-admin-architecture.md`, Section 5.3, and the input-handling principles in `06-security.md`, Section 3, to the specific fields of the Articles data model.

## 2. Validation Architecture Recap

- **Zod is the official validation library** for the Articles module, consistent with the project-wide validation standard defined in `06-security.md`, Section 5.
- **The same Zod schema is used on both client and server whenever possible**, minimizing the risk of the two layers drifting out of sync.
- **Client-side validation** provides immediate UX feedback (e.g. disabling actions, inline hints) but is **never trusted** as a security or integrity control.
- **Server-side validation is mandatory** and is the **final authority** before any write operation — every save request is fully re-validated server-side regardless of what the client already checked.
- The Articles module defines its schema in a dedicated location (`/lib/modules/articles/schema.ts`, per `02-admin-architecture.md`, Section 6), separate from shared, cross-module validation utilities.

## 3. Two Validation Levels

Consistent with `15-article-publishing.md`, Section 4.3, the Articles module enforces **two distinct validation levels**:

| Level | Applied when | Strictness |
|---|---|---|
| Draft-save validation | Creating or updating an article while `status` remains `draft` | Permissive — allows incomplete content to be saved |
| Publish validation | Transitioning an article to `status: published` | Strict — requires a complete, publishable record |

Both levels share the same underlying field-level rules (Section 4); the difference lies in **which fields are required** at each level, not in the format rules applied to fields that are present.

## 4. Field-Level Validation Rules

| Field | Format rules | Required to save draft | Required to publish |
|---|---|---|---|
| `title` | Non-empty string; max length (e.g. 150 characters) | Yes | Yes |
| `slug` | Lowercase, kebab-case, alphanumeric with hyphens only; max length (e.g. 100 characters); must be unique across all articles (Section 5) | Yes | Yes |
| `category` | Non-empty string; max length (e.g. 50 characters) | Yes | Yes |
| `content` | Sanitized HTML string (`13-article-editor.md`, Section 5) | No | Yes |
| `coverImage` | Valid stored image path, produced only via the validated upload flow (`14-article-image.md`) | No | Yes |
| `coverImage.alt` | Alt text string | Recommended, not required | Yes |
| `publishedAt` | ISO 8601 timestamp; system-managed | — | Yes |
| `status` | Enum: `draft` or `published` | `draft` | `published` |
| `excerpt` | Non-empty string; max length (e.g. 300 characters) | No | Yes |
| `author` | String; max length (e.g. 100 characters) | No | No |
| `seo.metaTitle` | String; recommended max length ~60 characters (guidance only, per `16-article-seo.md`, Section 5) | No | No |
| `seo.metaDescription` | String; recommended max length ~155–160 characters (guidance only) | No | No |
| `seo.ogImage` | Valid stored image path if provided | No | No |
| `seo.canonicalUrl` | Well-formed URL if provided | No | No |
| `seo.noIndex` | Boolean | No | No |

Exact numeric limits shown are illustrative defaults and may be tuned during implementation, but must be defined once in the shared Zod schema rather than enforced inconsistently across the UI, API, and data access layers.

## 5. Slug Validation

- The slug must be **lowercase** and **kebab-case** (alphanumeric segments separated by single hyphens, no leading/trailing/duplicate hyphens).
- The slug is **generated automatically from the title** and remains **editable** by the administrator before publishing, per `13-article-editor.md`, Section 4.
- The slug must be **unique across all articles**; uniqueness is **checked server-side**, at the data access layer, immediately before writing (per `04-storage-strategy.md`, Section 6), in addition to any earlier schema-level format checks — a defense-in-depth measure against race conditions between the initial check and the actual write.
- On collision, the API returns a field-specific validation error (`slug already in use`), which the editor surfaces inline next to the slug field, rather than a generic failure message.

## 6. Sanitization

Before saving, the `content` field is sanitized using **sanitize-html**, per `13-article-editor.md`, Section 10, and `06-security.md`, Section 6:

- Unsafe tags are removed.
- Unsafe attributes are removed.
- This prevents XSS via stored article content.

Sanitization is treated as a validation-adjacent step: content is sanitized **before** the resulting value is checked against schema rules (e.g. the "required to publish" check applies to sanitized output, not raw input), preventing a payload of only disallowed tags from passing as valid content.

## 7. Image Validation

- Only **jpg, jpeg, png, and webp** files are accepted at upload time.
- File type is validated using **file-type**, based on actual file content — **fake extensions are rejected** even if the filename or declared MIME type appears valid.
- **Maximum upload size: 5 MB.**
- **Invalid files are rejected before storage** — a file that fails type or size validation is never passed to the Sharp processing pipeline defined in `14-article-image.md`.
- `coverImage` and `seo.ogImage` are never validated as arbitrary strings; they are only ever set as a result of a successful, validated upload through this pipeline.
- The schema layer validates that these fields, if present, reference a path within the expected `/public/images/articles/{slug}/` namespace — rejecting any attempt to set an arbitrary or externally supplied path directly through the API.

## 8. Error Response Format

API validation failures follow a consistent, structured shape (applied consistently across all modules per `19-api-overview.md`):

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "...",
  "errors": [
    { "field": "slug", "message": "This slug is already in use." },
    { "field": "coverImage", "message": "A cover image is required to publish this article." }
  ]
}
```

This structure allows the editor to map errors directly to individual form fields (`13-article-editor.md`, Section 10) rather than displaying only a generic failure message.

## 9. Client-Side Validation Behavior

- The editor performs client-side checks mirroring Section 4's rules, reusing the same Zod schema per Section 2.
- Client-side checks provide immediate inline feedback (e.g. disabling the Publish action until required fields are filled) but never suppress the corresponding server-side check — every save request is still fully validated server-side regardless of client-side state.

## 10. Validation Failure Handling in Publish Flow

- Attempting to publish an article that fails publish-level validation does not change its `status`; it remains `draft`, and the admin is shown the complete list of unmet requirements (per `15-article-publishing.md`, Section 4.3), rather than a single error at a time, so the admin can address all issues in one pass.

## 11. Extensibility for Future Modules

The two-tier (draft-save vs. publish/finalize) validation pattern, the shared error response shape, and the "images validated only through their upload pipeline" rule are intended as the reference validation pattern for any future module with a similar draft/published or incomplete/complete lifecycle (e.g. Tour Packages, UMKM listings), rather than being redesigned per module.

## 12. Summary

Article validation is enforced server-side through a shared schema, applied at two distinct strictness levels depending on whether an article is being saved as a draft or transitioned to published. Field-level rules cover format, length, uniqueness, and safe image referencing, with structured, field-mapped error responses enabling clear, actionable feedback in the editor.