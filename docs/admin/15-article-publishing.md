# 15 - Article Publishing

## 1. Purpose

This document defines the publishing workflow for Articles: how content moves between draft and published states, what checks apply at publish time, and how a publish action propagates to the public website. It builds on the data model in `12-articles.md` and the editor behavior in `13-article-editor.md`.

## 2. Publishing States

As defined in `12-articles.md`, Section 6, an article exists in one of two states:

| State | Meaning | Visible on public site? |
|---|---|---|
| `draft` | Work in progress; not finalized | No |
| `published` | Finalized and live | Yes |

Version 1 intentionally uses a simple two-state model. Additional states (e.g. `scheduled`, `archived`) are noted as potential future enhancements (Section 9) but are out of scope for v1.

## 3. Separation of Save and Publish

Consistent with `13-article-editor.md`, Section 7, saving an article and changing its publishing state are **distinct, explicit actions**:

- **Save** persists the current content regardless of status, allowing safe iterative editing of both drafts and already-published articles.
- **Publish / Unpublish** is a deliberate status transition, triggered by its own control in the editor's side panel (per `13-article-editor.md`, Section 3), not an implicit side effect of saving.

This separation prevents accidental publication of incomplete content and prevents accidental unpublishing of live content during routine edits.

## 4. Publish Action

### 4.1 Trigger
- The admin toggles or confirms a "Publish" action from the editor's Status control.
- If publishing for the first time, the admin is presented with a confirmation step (using the shared Dialog component, `11-admin-components.md`, Section 3.6) summarizing what will become publicly visible.

### 4.2 Server-Side Effects
On a successful publish action:

1. `status` is set to `published`.
2. `publishedAt` is set to the current timestamp **only if it was previously `null`** (i.e. the original first-publish date is preserved across subsequent edits, even if the article is unpublished and republished later).
3. `updatedAt` is refreshed, per the standard record convention (`04-storage-strategy.md`, Section 5).
4. The record is persisted via the standard atomic write path (`04-storage-strategy.md`, Section 8).

### 4.3 Publish-Time Validation
Before allowing a transition to `published`, the system enforces a stricter validation pass than the one applied to saving a draft (detailed further in `17-article-validation.md`), including at minimum:

- `title`, `slug`, `excerpt`, and `content` are non-empty.
- `coverImage` is present.
- Alt text is present for the cover image (per `14-article-image.md`, Section 8), or the admin is explicitly warned and asked to confirm before proceeding without it.

If publish-time validation fails, the article remains in `draft`, and the admin is shown a clear, actionable list of what must be completed before publishing — distinct from the more permissive validation that allows saving incomplete drafts.

## 5. Unpublish Action

- An admin may transition a `published` article back to `draft` at any time via the same Status control.
- Unpublishing does **not** clear `publishedAt`, preserving the historical record of when the article was first made public (Section 4.2).
- Unpublishing immediately removes the article from public visibility, subject to the propagation mechanism in Section 6.
- Unpublishing does not delete any data; it is fully reversible by publishing again.

## 6. Propagation to the Public Site

Per the rendering strategy defined in `05-deployment.md`, Section 3:

- On a successful publish or unpublish action, the Articles API route triggers revalidation of the affected public routes (the article's own detail page and any listing pages that include it), so the change is reflected promptly without waiting for a scheduled rebuild.
- If the public site instead uses server-side rendering for article content (an alternative option noted in `05-deployment.md`), propagation is immediate by nature of not being cached, and no explicit revalidation step is required.
- Draft articles are never included in any public data-fetching path (listing queries and detail routes on the public site explicitly filter to `status: published`), providing a second layer of protection beyond revalidation timing — a draft is never accidentally exposed even if revalidation is delayed.

## 7. Listing & Ordering of Published Articles

- Published articles are ordered on the public site by `publishedAt` (most recent first) by default, giving a stable, predictable ordering that is not affected by later edits (which only update `updatedAt`).
- This distinction between `publishedAt` (controls ordering/visibility history) and `updatedAt` (reflects last edit) is preserved specifically to support this behavior.

## 8. Permissions

- In v1, any authenticated admin may publish or unpublish any article, consistent with the single-role model defined in `03-authentication.md`.
- The module is designed so that a future role (e.g. an Editor role permitted to create/edit drafts but not publish) could be introduced by adding an authorization check around the publish/unpublish action specifically, without restructuring the publishing workflow itself.

## 9. Future Enhancements (Out of Scope for v1)

The following are explicitly not part of v1 but are compatible extensions of this design:

- **Scheduled publishing** — setting a future `publishedAt` and having the system automatically transition status at that time, which would require a background/cron mechanism not currently part of the architecture.
- **Archived state** — a third status for retiring content from public view without treating it as an active draft.
- **Publish-approval workflow** — a review/approval step between draft and published, relevant if multiple contributor roles are introduced.

## 10. Summary

Articles move between `draft` and `published` states through an explicit, separately-triggered action from saving, with stricter validation applied at publish time and a preserved first-publish timestamp across any later unpublish/republish cycles. Publishing propagates to the public site through the revalidation mechanism defined in `05-deployment.md`, while draft content is structurally excluded from all public data paths regardless of revalidation timing.