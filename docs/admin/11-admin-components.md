# 11 - Admin Components

## 1. Purpose

This document defines the shared, reusable UI components that power every module in the Admin Dashboard. It establishes a common component library so that Articles in v1, and future modules (Destinations, Tour Packages, Gallery, FAQ, UMKM, Homepage), are built from the same building blocks rather than each reimplementing tables, forms, and dialogs independently.

This document builds on the shell defined in `08-admin-layout.md` and is a prerequisite for the Articles-specific documentation (`12-articles.md` onward), which will reference these components rather than redefine them.

## 2. Component Library Philosophy

- Components are built on top of **shadcn/ui** primitives and styled with **Tailwind CSS**, consistent with the existing project stack.
- Components are **generic and data-agnostic** — they accept configuration and data as props/composition, with no knowledge of a specific module (e.g. the shared data table component knows nothing about "articles" specifically).
- Components live in a shared location (e.g. `/components/admin`), separate from any module-specific component, so their reuse across modules is explicit and structural, not incidental.
- Module-specific components (e.g. an Article-specific form field) are built **using** these shared components, not as replacements for them.

## 3. Core Shared Components

### 3.1 Page Header
- Renders a consistent page title, optional description, optional breadcrumb (per `10-admin-navigation.md`, Section 6), and a slot for primary page actions (e.g. "New Article" button).
- Used at the top of every module's list, create, and edit views for visual consistency.

### 3.2 Data Table
- A generic, reusable table component used for every module's list view (e.g. Articles list, and future Destinations/Gallery/etc. lists).
- Supports, at minimum:
  - Column definitions supplied by the consuming module (label, data accessor, optional custom cell renderer).
  - Sorting on sortable columns.
  - Pagination (see Section 3.3).
  - Row-level actions (e.g. Edit, Delete), supplied by the consuming module.
  - Empty state (see Section 3.9) when no records exist.
  - Loading state while data is being fetched.
- Because the table has no built-in knowledge of "articles," any future module reuses it purely by supplying its own column and action definitions.

### 3.3 Pagination
- A standalone, reusable pagination control used by the Data Table and any other paginated view.
- Operates on a simple contract (current page, total pages/items, page size, change handler), independent of any specific module's data shape.

### 3.4 Search & Filter Bar
- A shared input pattern for text search and simple filter controls (e.g. status filter: Published/Draft), placed above a Data Table.
- Filter definitions (which fields are filterable, and how) are supplied per module; the bar itself renders generically from that configuration.

### 3.5 Form Components
- A set of shared, styled form primitives wrapping shadcn/ui form elements: text input, textarea, select, switch/toggle, date picker, and file/image upload (see Section 3.7).
- Each shared form primitive includes consistent label placement, help text, and inline validation error display, so every module's forms look and behave identically without each module re-styling its own inputs.
- Form state and validation wiring (e.g. via a schema-driven form library) follow one shared pattern across modules, aligned with the validation approach defined in `02-admin-architecture.md`, Section 5.3.

### 3.6 Dialog / Modal
- A shared dialog component (built on shadcn/ui's dialog primitive) used for confirmations, quick-view previews, and lightweight secondary forms.
- Includes a standardized **Confirm Delete** dialog variant, used consistently by every module before a destructive action is executed, showing the entity's name/title and requiring explicit confirmation.

### 3.7 Image Uploader
- A shared upload component supporting drag-and-drop and click-to-browse image selection, client-side preview, and basic client-side validation (file type/size) as a UX convenience layer in front of the authoritative server-side validation defined in `06-security.md`, Section 6.
- Configurable per use case (e.g. single cover image vs. multiple content images), reused by the Articles module (`14-article-image.md`) and intended for reuse by any future module requiring image uploads (Gallery, Destinations, UMKM, etc.).

### 3.8 Status Badge
- A small, consistent visual indicator for entity state (e.g. "Published" / "Draft"), used across list views and detail/edit views.
- Configurable by label and color/variant, so it generalizes beyond Articles' publishing states to any future module with its own status concept (e.g. a UMKM listing's "Active"/"Inactive" state).

### 3.9 Empty State
- A consistent visual pattern shown when a list view has no records: an icon/illustration, short message, and a primary action (e.g. "No articles yet — Create your first article").
- Reused identically by every module's list view.

### 3.10 Toast / Notification
- A shared, global notification mechanism (built on shadcn/ui's toast primitive) used to confirm successful actions (e.g. "Article published") and surface error messages returned from API routes.
- Triggered consistently from a shared client-side utility, so success/error feedback follows the same visual and timing pattern across all modules.

### 3.11 Loading Skeleton
- Shared skeleton-loading placeholders for tables, forms, and cards, used during route-level loading states (per `08-admin-layout.md`, Section 7) to avoid layout shift and provide consistent perceived performance across modules.

## 4. Composition Pattern

Modules compose their pages from these shared components rather than building UI from scratch. For example, an Articles list page is expected to be composed roughly as:

```
Page Header (title: "Articles", action: "New Article")
  Search & Filter Bar (status filter, text search)
    Data Table (columns: title, status badge, updatedAt; row actions: edit, delete)
      Pagination
```

The same compositional pattern applies to any future module's list page — only the column definitions, filters, and row actions change.

## 5. Consistency Rules

To keep the dashboard coherent as it scales across modules:

- Modules **must not** introduce parallel, module-specific versions of a component already covered by this shared library (e.g. no Articles-only table implementation).
- Any new, generally useful UI pattern discovered while building a module should be extracted into this shared component library rather than duplicated if a second module is likely to need it.
- Visual variants (spacing, color, typography) are controlled through shared design tokens (Tailwind config / shadcn/ui theme), not through ad hoc per-module overrides.

## 6. Accessibility

- All shared components follow accessible patterns provided by shadcn/ui and Radix primitives underneath it (keyboard navigation, focus management, ARIA attributes), inherited automatically by any module using them.
- Custom shared components (e.g. Data Table, Status Badge) are built to preserve semantic structure (e.g. proper `table`/`th`/`td` usage, readable status text alongside color) rather than relying on color alone to convey meaning.

## 7. Extensibility for Future Modules

Because every module is expected to need some combination of a list view, a create/edit form, image upload, status indication, and delete confirmation, this shared component library is the primary mechanism enabling the "add a module without changing architecture" goal from `01-admin-overview.md`:

- A new module's engineering effort is concentrated in defining its **data schema, columns, and form fields** — not in building new UI primitives.
- This keeps future modules (Destinations, Tour Packages, Gallery, FAQ, UMKM, Homepage) fast to build and visually consistent with Articles from day one.

## 8. Summary

The Admin Dashboard is built from a shared, generic component library — page headers, data tables, forms, dialogs, image uploaders, status badges, empty states, notifications, and loading skeletons — layered on shadcn/ui and Tailwind CSS. Every module, including Articles in v1 and any future module, composes its screens from these same components, ensuring visual and behavioral consistency while minimizing duplicated UI work as the dashboard scales.