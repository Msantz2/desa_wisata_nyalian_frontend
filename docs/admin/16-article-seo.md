# 16 - Article SEO

## 1. Purpose

This document defines the SEO metadata capabilities of the Articles module: which fields are captured, how they fall back to existing content when left blank, and how they integrate with Next.js's metadata rendering on the public site. It builds on the data model in `12-articles.md` and the editor layout in `13-article-editor.md`.

## 2. SEO Data Model

The `seo` object referenced in `12-articles.md`, Section 3, contains the following optional fields:

| Field | Type | Description |
|---|---|---|
| `metaTitle` | string | Overrides the default page `<title>` for the article; falls back to `title` if empty. |
| `metaDescription` | string | Overrides the default meta description; falls back to `excerpt` if empty. |
| `ogImage` | string (file path) | Overrides the social-sharing preview image; falls back to `coverImage` if empty. |
| `canonicalUrl` | string (URL) | Optional canonical URL override, used only in cases where the article's content is intentionally duplicated from or syndicated to another source. |
| `noIndex` | boolean | If `true`, instructs search engines not to index the article (e.g. for soft-launched or low-value content); defaults to `false`. |

All SEO fields are optional at the data level — an article can be validly published with no `seo` object at all, relying entirely on fallback behavior (Section 3).

## 3. Fallback Strategy

To minimize editorial burden, every SEO field has a sensible automatic fallback so admins are never required to fill in duplicate information:

| SEO Field | Falls back to |
|---|---|
| `metaTitle` | `title` |
| `metaDescription` | `excerpt` |
| `ogImage` | `coverImage` |
| `canonicalUrl` | The article's own canonical public URL (derived from its `slug`) |
| `noIndex` | `false` (indexable by default) |

This fallback logic is implemented once, centrally, in the public site's metadata-generation code — not duplicated per article — so it applies consistently and remains easy to adjust.

## 4. Editor Experience

Per `13-article-editor.md`, Section 3, SEO fields are presented in a **collapsible "SEO Metadata" section** within the editor's side panel, kept visually secondary to the primary content fields:

- Each SEO field's input displays the fallback value as placeholder text when left empty, so the admin can see exactly what will be used if they don't provide an override (e.g. the `metaTitle` input shows the current `title` as placeholder text).
- A live character count is shown for `metaTitle` and `metaDescription` against recommended length guidance (Section 5), helping the admin avoid truncation in search results without hard-blocking longer input.
- The `ogImage` field reuses the shared Image Uploader component (`11-admin-components.md`, Section 3.7; `14-article-image.md`), defaulting to a preview of the current `coverImage` when no override is set.

## 5. Length & Format Guidance

Client-side guidance (not hard validation failures, per `17-article-validation.md`) is shown for:

| Field | Recommended length |
|---|---|
| `metaTitle` | Up to ~60 characters, to avoid truncation in search engine results |
| `metaDescription` | Up to ~155–160 characters, for the same reason |

These are treated as **recommendations surfaced in the UI**, not hard limits enforced by validation, since search engines' actual display behavior varies and overly strict enforcement could block legitimate content.

## 6. Rendering on the Public Site

- The public site's article detail route generates page metadata using Next.js's built-in metadata capabilities (e.g. a route-level `generateMetadata` function), reading the article's `seo` object (with fallbacks applied per Section 3) at request/build time.
- Generated metadata includes, at minimum: `<title>`, meta description, canonical link, and Open Graph tags (`og:title`, `og:description`, `og:image`) for social sharing previews.
- If `noIndex` is `true`, the corresponding `robots` meta directive (`noindex`) is included in the generated metadata.

## 7. Structured Data (Future Consideration)

- Version 1 does not generate structured data (e.g. JSON-LD `Article` schema) automatically.
- The `seo` data model is intentionally structured (rather than a single free-text blob) so that structured data generation could be added later, mapping existing fields (`metaTitle`, `metaDescription`, `coverImage`/`ogImage`, `publishedAt`, `author`) directly into a schema.org representation without requiring new admin-facing fields.

## 8. Relationship to Cover Image and Alt Text

- `ogImage` intentionally reuses the same file-storage pattern as `coverImage` (`14-article-image.md`), stored under the article's image folder when explicitly overridden, keeping SEO image handling consistent with the rest of the module's image lifecycle rather than introducing a separate upload pathway.
- Alt text captured for the cover image (`14-article-image.md`, Section 8) is distinct from `metaDescription` — alt text serves accessibility and image-search purposes, while `metaDescription` serves general search-result and share-preview purposes. Both are optional but recommended.

## 9. Validation Boundaries

- SEO fields are validated for format where applicable (e.g. `canonicalUrl` must be a well-formed URL if provided) but are not required for saving a draft or publishing an article, per the field-level rules defined in `17-article-validation.md`.
- This keeps SEO metadata as an enhancement layer rather than a publishing blocker, appropriate for a small editorial team that may not always have SEO-specific input ready at publish time.

## 10. Extensibility for Future Modules

The optional-field-with-automatic-fallback pattern established here is intended to generalize to any future public-facing module requiring discoverability (e.g. Destinations, Tour Packages), allowing those modules to adopt the same `seo` object shape and fallback approach rather than designing SEO handling independently.

## 11. Summary

Articles carry an optional, structured SEO metadata object with automatic fallbacks to existing content fields (title, excerpt, cover image), presented in the editor as a secondary, non-blocking section with helpful length guidance. Metadata is rendered on the public site through Next.js's built-in metadata generation, keeping SEO handling centralized, consistent, and easy to extend to future modules.