# 09 - Admin Dashboard (Home)

## 1. Purpose

This document defines the purpose, content, and structure of the Admin Dashboard's home page — the landing view an admin sees at `/admin/dashboard` immediately after login. It builds on the shell layout defined in `08-admin-layout.md`.

## 2. Role of the Dashboard Home Page

The dashboard home page is the **orientation point** of the Admin Dashboard: a summary view that helps the admin quickly understand the current state of the site's content and jump into common tasks, without requiring them to already know where each module lives.

It is intentionally **not** a module's list view (e.g. not the Articles list) — it is a cross-module overview, designed from v1 to scale as more modules are added, even though only Articles exists today.

## 3. Goals

- Give the admin an at-a-glance summary of content status (e.g. how many articles exist, how many are drafts vs. published).
- Surface **recent activity** so the admin can quickly resume or review recent work.
- Provide **quick actions** for the most common tasks (e.g. "New Article") without navigating through the sidebar first.
- Establish a **card/section-based structure** that naturally extends to future modules (e.g. a "Destinations" summary card) without redesigning the page.

## 4. Page Structure

The dashboard home page is composed of the following sections, rendered within the shell's content area (per `08-admin-layout.md`):

```
┌─────────────────────────────────────────────┐
│ Page Heading ("Dashboard")                    │
├─────────────────────────────────────────────┤
│ Summary Cards (per module)                    │
├─────────────────────────────────────────────┤
│ Quick Actions                                 │
├─────────────────────────────────────────────┤
│ Recent Activity                               │
└─────────────────────────────────────────────┘
```

### 4.1 Summary Cards

- One summary card per active module, showing key counts relevant to that module.
- For v1, a single **Articles** card displays:
  - Total number of articles.
  - Number of published articles.
  - Number of draft articles.
- Each card links directly to that module's list view.
- Cards are rendered from a **module registry** (the same configuration referenced in `10-admin-navigation.md`), so a future module (e.g. Destinations) automatically gains a dashboard summary card once it registers its own summary data provider — no changes to the dashboard page itself are required.

### 4.2 Quick Actions

- A small set of shortcut actions for the most frequent tasks, e.g.:
  - "New Article" → navigates directly to the Articles creation form (`/admin/articles/new`).
- Quick actions are also driven by the module registry, so each module can optionally contribute one primary quick action (e.g. "New Destination" in the future) without the dashboard page needing module-specific code.

### 4.3 Recent Activity

- A chronological list of the most recent content changes across modules (e.g. "Article 'Pantai Nyalian' published — 2 hours ago").
- Sourced from the audit/logging mechanism defined in `06-security.md`, Section 11, filtered to content-mutation events relevant to an editorial audience (create, update, publish, delete).
- Limited to a small, recent window (e.g. the last 10–15 events) to keep the dashboard lightweight; a full activity history is not part of v1 scope.
- Because this section reads from the shared logging mechanism rather than each module's own data file, it automatically includes future modules' activity once they adopt the same logging convention — no per-module dashboard integration is required beyond that.

## 5. Data Requirements

The dashboard home page aggregates lightweight summary data rather than full content records:

| Section | Data needed | Source |
|---|---|---|
| Summary Cards | Counts (total, published, draft) per module | Each module's data access service (`02-admin-architecture.md`, Section 5.4), via a lightweight summary function |
| Quick Actions | Static configuration (label, icon, target route) | Module registry configuration |
| Recent Activity | Recent mutation log entries | Shared logging mechanism (`06-security.md`, Section 11) |

Because summary data is derived from existing module services rather than a separate aggregation store, there is no duplicated data to keep in sync — consistent with the single-source-of-truth principle in `01-admin-overview.md`.

## 6. Module Registry Pattern

To keep the dashboard scalable, each module exposes a small, standardized descriptor consumed by the dashboard (and by navigation, per `10-admin-navigation.md`):

| Field | Description |
|---|---|
| `key` | Unique module identifier (e.g. `"articles"`) |
| `label` | Display name (e.g. `"Articles"`) |
| `listRoute` | Path to the module's list view |
| `createRoute` | Path to the module's creation form (if applicable) |
| `getSummary()` | Function returning summary counts for the dashboard card |

The dashboard home page renders one card and (optionally) one quick action per registered module descriptor, iterating over the registry rather than hardcoding module-specific markup. Adding a future module to the dashboard is therefore limited to registering its descriptor — not modifying the dashboard page itself.

## 7. Empty & Initial States

- If a module has no content yet (e.g. zero articles), its summary card reflects zero counts clearly (not treated as an error state) and its quick action remains prominent to encourage first-content creation.
- If no activity exists yet (e.g. immediately after initial setup), the Recent Activity section displays a simple, friendly empty-state message rather than an empty list with no explanation.

## 8. Performance Considerations

- Summary counts are computed from each module's existing JSON data (per `04-storage-strategy.md`); given the expected content scale, this is inexpensive and does not require caching in v1.
- Should the number of modules or content volume grow significantly, summary computation may be optimized (e.g. lightweight caching with short-lived revalidation) without affecting the dashboard page's structure or the module registry contract.

## 9. Summary

The Admin Dashboard home page provides a cross-module overview — summary counts, quick actions, and recent activity — built on a module registry pattern so that today's single Articles module and tomorrow's additional modules (Destinations, Gallery, FAQ, UMKM, Homepage) are represented consistently without requiring changes to the dashboard page's structure or logic.