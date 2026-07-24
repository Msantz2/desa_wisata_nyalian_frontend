# 13 - Article Editor

## 1. Purpose

This document defines the content editing experience for Articles — the form and rich text editing interface used to create and update article records. It builds on the data model defined in `12-articles.md` and the shared form components defined in `11-admin-components.md`. The decisions in this document are locked for v1 and must be implemented exactly as specified.

## 2. Editor Scope

The article editor is used in two modes, sharing the same layout and components:

- **Create mode** — `/admin/articles/new`, starting from an empty form.
- **Edit mode** — `/admin/articles/[id]/edit`, pre-populated with the existing article's data.

Both modes submit to the same underlying API contract (`20-api-articles.md`), differing only in whether an `id` is present.

## 3. Form Layout

The editor is composed from the shared form primitives defined in `11-admin-components.md`, Section 3.5, organized into logical sections:

```
Page Header ("New Article" / "Edit Article", Save action)
  Main Content Column
    Title (text input)
    Slug (text input, auto-generated, editable)
    Excerpt (textarea)
    Content (Tiptap rich text editor)
  Side Panel
    Status (draft/published toggle — see 15-article-publishing.md)
    Cover Image (image uploader — see 14-article-image.md)
    Category (select/text input)
    Author (text input)
    SEO Metadata (collapsible section — see 16-article-seo.md)
```

## 4. Title & Slug Behavior

- The `title` field is the primary content field and drives automatic slug generation.
- The `slug` field is **automatically generated from the title** (lowercase, hyphenated, diacritics normalized).
- The administrator **may edit the slug before publishing**. Once manually edited, auto-generation stops tracking further title changes for that session, preventing unexpected slug changes to content the admin has intentionally customized.
- Slug uniqueness is validated server-side before save, per `04-storage-strategy.md`, Section 6, with a clear inline error if a collision is detected.

## 5. Rich Text Content Editing

- The `content` field is edited using **Tiptap** as the rich text editor.
- The toolbar exposes exactly the following controls:
  - Heading (H2–H4)
  - Bold
  - Italic
  - Bullet List
  - Ordered List
  - Blockquote
  - Link
  - Image
  - Horizontal Rule
- No other formatting controls are exposed. The toolbar is intentionally constrained to these options, keeping content structurally simple and consistent with what a tourism village content site needs.
- Content is stored as sanitized HTML in the `content` field, consistent with the data model in `12-articles.md`.

## 6. Excerpt Field

- A short, plain-text summary used in list views, previews, and as a fallback for SEO description if no explicit SEO description is provided (`16-article-seo.md`).
- Length constraints follow `17-article-validation.md`.

## 7. Save Behavior

- A single **Save Draft** action persists the current form state, mapped to a Create or Update API call depending on mode (per `12-articles.md`, Section 5).
- **Save Draft is a manual action.** There is no autosave; the administrator must explicitly trigger it.
- Saving does **not** implicitly change the article's publishing status. Status changes are an explicit, separate action, detailed in `15-article-publishing.md`.
- On successful save, a success notification is shown (`11-admin-components.md`, Section 3.10) and, in create mode, the admin is transitioned into edit mode for the newly created article, avoiding accidental duplicate creation on a second save.
- On validation failure, inline field-level errors are shown next to the relevant fields, and a summary notification indicates the save did not succeed.
- The editor warns the admin if they attempt to navigate away with unsaved changes, since no autosave exists to fall back on.

## 8. Preview

- The editor provides a **Preview** action, supporting article preview **before publishing**.
- Preview rendering reuses the public site's article display logic where feasible, ensuring what the admin sees in preview closely matches the live result.
- Preview is a read-only view; no data is written as part of viewing a preview.

## 9. Image Handling Within the Editor

- Images can be **uploaded directly inside the Tiptap editor** as inline content images, in addition to the dedicated Cover Image field in the side panel (`14-article-image.md`).
- Every uploaded image — cover or inline — is processed by **Sharp** and **converted to WebP**.
- Images are **optimized (resized and compressed) before saving**, per the limits defined in `06-security.md`, Section 8, and `05-deployment.md`, Section 7.
- Uploads follow the storage and lifecycle rules defined in `14-article-image.md`; the editor's inline image tool is a client-facing entry point into that same pipeline, not a separate mechanism.

## 10. Security

- Submitted `content` HTML is **sanitized using sanitize-html** server-side before persistence, regardless of what the Tiptap editor produced client-side.
- **Unsafe HTML is rejected outright** — disallowed tags, attributes, or scripts are not silently stripped-and-accepted where their presence indicates a malformed or malicious submission; the sanitization step enforces the same allowed-element set as the toolbar in Section 5.
- Client-side editor constraints (the fixed toolbar) are a UX convenience, not the security boundary. Server-side sanitization is authoritative, per `06-security.md`, Section 6.

## 11. Validation

- **Publishing requires all mandatory fields** to be present and valid, per the publish-level validation rules in `17-article-validation.md`.
- **Drafts may contain incomplete information.** Saving a draft uses the more permissive draft-save validation level and does not require fields such as `excerpt`, `content`, or `coverImage` to be filled in.
- Server-side validation is authoritative; client-side checks provide immediate feedback only and never replace the server-side check.

## 12. Accessibility

- All editor fields are properly labeled and keyboard-navigable, consistent with the shared form component standards in `11-admin-components.md`, Section 6.
- Tiptap's toolbar controls expose accessible labels for screen readers, and formatting shortcuts do not conflict with standard browser/OS accessibility shortcuts.

## 13. Out of Scope for v1

The following are explicitly not implemented in v1:

- Revision history
- Autosave
- Collaborative editing
- Version comparison

## 14. Summary

The article editor provides a structured, two-column create/edit form built from shared form primitives, using Tiptap with a fixed nine-control toolbar for content editing. Slugs are auto-generated from the title and remain editable before publishing. Saving is a manual, explicit action with no autosave; publishing enforces full field validation while drafts remain permissive. All content HTML is sanitized server-side via sanitize-html, and all uploaded images — cover and inline — are processed through Sharp into optimized WebP files.