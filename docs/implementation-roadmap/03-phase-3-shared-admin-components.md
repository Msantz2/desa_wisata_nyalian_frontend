# Phase 3 — Shared Admin Components

> Part of the Nyalian Tourism Village Admin Dashboard — Implementation Roadmap.
> **Source of truth:** The 20 documents in `/docs/admin` (`01-admin-overview.md` through `20-api-articles.md`). Nothing in this document overrides them.
> This file follows the same organizational format as the finalized `01-phase-1-foundation.md` and `02-phase-2-authentication.md`. No technical content is invented — every task below is derived directly from `11-admin-components.md`.
> Cross-phase material (documentation notes, dependency graph, global implementation rules, development conventions, verification principles) lives in `00-overview-and-cross-phase-reference.md` and is referenced here, not repeated.

---

## Metadata

**Phase Name:** Phase 3 — Shared Admin Components

**Objective:** Build the generic, module-agnostic component library that every module (Articles now, future modules — Destinations, Tour Packages, Gallery, FAQ, UMKM, Homepage — later) composes its screens from, per `11-admin-components.md`.

**Dependencies:** Phase 1 (shell, layout) complete — see `00-overview-and-cross-phase-reference.md` §4 for the full dependency graph. Phase 2 is not strictly required for most of this phase, but the Toast/Notification and Dialog components (Tasks 3.10, 3.6) are easiest to manually verify once at least one authenticated route exists.

**Related Architecture Documents:** `11-admin-components.md` (whole document) · `08-admin-layout.md` §7 (loading/error states) · `06-security.md` §5 (client-side validation is UX-only, never authoritative) · `01-admin-overview.md` (module-scalability goal, referenced by `11` §7).

**Expected Deliverables:** See "Files to create" below.

**Verification Checklist:** See "Manual verification checklist" below.

**Completion Criteria:** See "Completion criteria" below.

---

## Phase Detail

**Expected result:** A `/components/admin/` library containing Page Header, Data Table, Pagination, Search & Filter Bar, Form primitives, Dialog/Modal (+ Confirm Delete variant), Image Uploader (client-side shell only — backend pipeline is Phase 5), Status Badge, Empty State, Toast/Notification, and Loading Skeleton — each usable and verifiable with mock data/props, with no knowledge of "Articles" or any other specific module baked in anywhere (`11` §2).

**Prerequisites:** Phase 1 complete (admin shell, sidebar, header, navigation config already exist — this phase's components render inside that shell for manual verification, per `11` §1, which builds on `08-admin-layout.md`).

**Files to create:**
- `/components/admin/page-header.tsx`
- `/components/admin/data-table.tsx`
- `/components/admin/pagination.tsx`
- `/components/admin/search-filter-bar.tsx`
- `/components/admin/form/` (text-input, textarea, select, switch, date-picker wrappers)
- `/components/admin/dialog.tsx`
- `/components/admin/confirm-delete-dialog.tsx`
- `/components/admin/image-uploader.tsx`
- `/components/admin/status-badge.tsx`
- `/components/admin/empty-state.tsx`
- `/components/admin/toast.tsx` (or toast provider/hook wiring shadcn's primitive)
- `/components/admin/loading-skeleton.tsx`

**Files to modify:** None required. (`/app/(admin)/admin/dashboard/page.tsx`'s Task 1.8 placeholder MAY optionally be upgraded to consume Empty State / Loading Skeleton once available — this is explicitly optional and not required for this phase's completion criteria; if done, it is the only file this phase may touch outside `/components/admin/`.)

**Implementation Note — Folder/File Organization:** The exact folder and file organization within `/components/admin/` (e.g. whether form primitives live in a `/components/admin/form/` subdirectory, whether utilities are co-located, etc.) is implementation-defined and not prescriptive — the implementer may choose any internal structure that makes sense. What IS prescribed and immutable is the documented public API of each component (props, behavior, contract) and the architectural constraint that every component remains module-agnostic and reusable across all modules. Reorganizing internals does not change the external contract.

**Things that must NOT be changed:**
- No component may reference "article," "articles.json," or any module-specific field name (`11` §2, §5) — genericity is the entire point of this phase.
- Do not create a parallel, module-specific table/form/dialog implementation later "for speed" — Phase 4 must reuse these components, not duplicate them (`11` §5).
- Client-side validation in form components is UX-only, never authoritative (`06` §5; `11` §3.5) — do not implement any server-trust logic here.
- Do not modify anything in Phase 1's or Phase 2's files, routes, or components — this phase only adds new files under `/components/admin/`.
- Do not implement the image upload backend pipeline (magic-number detection, Sharp processing, storage) — Task 3.7 is the client-side selector/preview shell only; the pipeline is Phase 5.

**Manual verification checklist:**
- [ ] Data Table renders with mock columns/rows/actions, including sortable columns, pagination, empty state, and loading state.
- [ ] Confirm Delete dialog shows the target entity's name/title and requires explicit confirmation.
- [ ] Toast fires on a mock success and a mock error trigger, styled distinctly.
- [ ] All interactive components are keyboard-navigable with visible focus states (`11` §6).
- [ ] Status Badge renders at least two variants (e.g. mock "Published"/"Draft") without color being the only signal (readable text alongside color).
- [ ] Every component renders correctly using only mock/sample data passed via props — no import of anything from `/lib/modules/*` anywhere in this phase's code.
- [ ] Dialog components trap focus (Tab cycles through dialog controls only) and support ESC-key close.
- [ ] All form inputs have associated labels, help text, and error messaging.
- [ ] Search & Filter Bar renders filters and search input with no backend fetching; changes emit via callbacks only.
- [ ] Data Table receives all data via props; no API calls or fetching occur inside the component.
- [ ] Image Uploader provides file selection and preview only; no HTTP requests, FormData submission, or persistence.
- [ ] All components support keyboard navigation and screen reader usage.

**Possible risks:**
- Over-fitting a component to Articles' exact needs during this phase (e.g. hardcoding a "status" concept as Published/Draft only) instead of keeping it generic (`11` §3.8 requires it generalize to future modules' own status concepts).
- Under-building the Data Table's contract (columns/actions as props) such that Phase 4 has to modify the shared component instead of just supplying config — verify the props contract before moving to Phase 4.
- Building Image Uploader's client-side validation messaging in a way that implies it is authoritative — must stay clearly a UX convenience layer only (`06` §5; `11` §3.7).

**Completion criteria:** Every component in this phase renders and behaves correctly using only mock/sample data passed via props, the Manual verification checklist passes, and no code in this phase imports anything from `/lib/modules/*`.

---

## Shared Component Design Principles

Every component in this phase adheres to the following architectural principles, which are non-negotiable and immutable across all tasks:

1. **Presentation Only** — Components render UI exclusively. They never fetch data, call APIs, access the filesystem, or perform business logic.
2. **Props-Driven** — All component behavior is controlled via React props. No internal state that depends on external data sources. Components are predictable and testable in isolation with mock data.
3. **Reusable Across Modules** — Every component is module-agnostic and must remain usable by Articles (Phase 4), Media Library (Phase 6), and all future modules without modification.
4. **Accessible by Default** — Components support keyboard navigation, focus management, focus trapping (where applicable), ESC-key close for modals/dialogs, semantic HTML, proper ARIA attributes, and screen reader compatibility.
5. **No API Access** — Components never make HTTP requests, never call Route Handlers, never resolve API data. API calling belongs to pages, server components, or service layers.
6. **No Filesystem Access** — Components never read or write to the filesystem. All file operations belong to server-side utilities or Route Handlers.
7. **No Module-Specific Knowledge** — Components never import from `/lib/modules/*`, never reference module names, never assume a specific data schema. Modules compose these components; components do not know about modules.

---

## Tasks

Each task below is scoped to be implemented — and turned into a single implementation prompt — independently. Suggested order (per `11`'s internal dependencies — simple/independent components first, Data Table after its sub-dependencies exist): 3.1 → 3.9 → 3.11 → 3.8 → 3.3 → 3.2 → 3.4 → 3.5 → 3.6 → 3.10 → 3.7.

### Task 3.1 — Page Header

**Objective:** Build a consistent page title/description/breadcrumb/primary-action slot component, used atop every future module's list, create, and edit views.

**Prerequisites:** Phase 3 prerequisites apply (Phase 1 complete). No dependency on another Phase 3 task.

**Related Architecture Documents:** `11-admin-components.md` §3.1; `10-admin-navigation.md` §6 (breadcrumb)

**Files to create:**
- `/components/admin/page-header.tsx` — props: `title`, `description?`, `breadcrumb?`, `action?` (slot for e.g. a "New Article" button).

**Files to modify:** None.

**Expected Result:** Reusable header component with no module-specific knowledge.

**Verification Checklist:**
- [ ] Renders correctly with and without optional props.
- [ ] The `action` slot accepts an arbitrary button/element.

**Completion Criteria:** Task 3.1 is complete when `/components/admin/page-header.tsx` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 3.2 — Data Table

**Objective:** Build a generic, reusable table component used for every module's list view: column definitions supplied by the consuming module (label, data accessor, optional custom cell renderer), sorting on sortable columns, row-level actions supplied by the consuming module, and integration with Pagination (Task 3.3), Empty State (Task 3.9), and Loading Skeleton (Task 3.11). The Data Table receives all data exclusively through props and never performs any data fetching, API calls, or business logic.

**Prerequisites:** Tasks 3.3 (Pagination), 3.9 (Empty State), and 3.11 (Loading Skeleton) complete — Data Table integrates all three.

**Related Architecture Documents:** `11-admin-components.md` §3.2, §6 (accessibility — semantic `table`/`th`/`td` structure)

**Files to create:**
- `/components/admin/data-table.tsx`

**Files to modify:** None.

**Expected Result:** Table component with zero knowledge of any specific module's data shape, receiving all data through props and never fetching from any external source.

**Implementation Scope — Data Table Contract:** The Data Table component must:
- Accept row data exclusively via props (never fetch).
- Accept column definitions via props (label, accessor, optional custom renderer).
- Accept action definitions via props (edit, delete, custom row actions).
- Accept sorting/pagination state via props (current sort, current page, etc.).
- Emit sorting and pagination changes via callbacks (never directly mutate parent state).
- Render sorted/paginated rows exactly as supplied by the consuming page/parent.
- Render Empty State (Task 3.9) and Loading Skeleton (Task 3.11) only when explicitly passed the `isLoading` or `isEmpty` prop.
- Never import from `/lib/modules/*` or any module-specific location.
- Never make HTTP requests or access APIs.

**Verification Checklist:**
- [ ] Renders correctly with a mock dataset.
- [ ] Sorting toggles correctly on a sortable column.
- [ ] Shows Empty State when given zero rows.
- [ ] Shows Loading Skeleton when in a loading prop state.
- [ ] Uses semantic table markup (`11` §6).

**Completion Criteria:** Task 3.2 is complete when `/components/admin/data-table.tsx` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 3.3 — Pagination

**Objective:** Build a standalone pagination control on a simple contract (current page, total pages/items, page size, change handler), usable independently or embedded inside the Data Table.

**Prerequisites:** Phase 3 prerequisites apply. No dependency on another Phase 3 task.

**Related Architecture Documents:** `11-admin-components.md` §3.3

**Files to create:**
- `/components/admin/pagination.tsx`

**Files to modify:** None.

**Expected Result:** Component usable standalone or embedded in Data Table, independent of any specific module's data shape.

**Verification Checklist:**
- [ ] Page-change handler fires with correct page numbers at boundaries (first/last page).

**Completion Criteria:** Task 3.3 is complete when `/components/admin/pagination.tsx` exists as described and the Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 3.4 — Search & Filter Bar

**Objective:** Build a shared text-search + configurable filter controls component, rendered generically from a filter-definition prop, placed above a Data Table. This is a UI-only component that emits filter changes via callbacks; it performs no fetching, server-side filtering, or business logic.

**Prerequisites:** Phase 3 prerequisites apply. No dependency on another Phase 3 task.

**Related Architecture Documents:** `11-admin-components.md` §3.4

**Files to create:**
- `/components/admin/search-filter-bar.tsx`

**Files to modify:** None.

**Expected Result:** Component accepting a list of filter definitions (e.g. a select-type status filter) plus a text-search input, with no module-specific knowledge, emitting filter/search changes via props-supplied callbacks.

**Implementation Scope — Search & Filter Bar Contract:** The Search & Filter Bar component must:
- Accept filter definitions via props (type, label, options, etc.).
- Accept current search/filter values via props.
- Render a text-search input field.
- Render filter controls (selects, checkboxes, etc.) based on filter definitions.
- Emit search/filter changes via callbacks, never fetch or trigger any data loading itself.
- Never import from `/lib/modules/*` or any module-specific location.
- Never make HTTP requests or access APIs.
- Never assume what filters are available — accept them entirely via props.

**Verification Checklist:**
- [ ] Renders a mock status filter + text search.
- [ ] Change handlers fire with the correct values.
- [ ] No fetching or API calls are initiated by this component.

**Completion Criteria:** Task 3.4 is complete when `/components/admin/search-filter-bar.tsx` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 3.5 — Form Components

**Objective:** Build shared, styled wrappers around shadcn/ui form elements — text input, textarea, select, switch/toggle, date picker — each with consistent label placement, help text, and inline validation error display, wired for schema-driven error display (actual schemas are supplied per module later).

**Prerequisites:** Phase 3 prerequisites apply. No dependency on another Phase 3 task.

**Related Architecture Documents:** `11-admin-components.md` §3.5; `02-admin-architecture.md` §5.3 (shared validation approach); `06-security.md` §5 (client-side validation is UX-only, never authoritative)

**Files to create:**
- `/components/admin/form/` — text input, textarea, select, switch/toggle, and date picker wrapper components.

**Files to modify:** None.

**Expected Result:** Form primitive set intended to be used identically by every future module's forms.

**Implementation Scope — Form Components:** The form component primitives in this task must:
- Accept a label, help text, error message, and value exclusively via props.
- Emit onChange callbacks when the user edits the field.
- Display inline error messages when provided (from server-side validation errors, never generated client-side).
- Client-side validation feedback is UX-only, non-authoritative (per `06-security.md` §5; no red-underline alone implies server rejection).
- Never import from `/lib/modules/*` or any module-specific location.
- Never make HTTP requests, call APIs, or perform authorization checks.

**Date Picker Note:** The date picker wrapper is built as shared infrastructure for future modules (e.g. a Gallery module with media date fields, an Events module with dates). Phase 4 (Articles CRUD) does not require a date field and therefore will not consume this component. Its inclusion in Phase 3 is forward-compatible infrastructure, not a Phase 4 dependency.

**Verification Checklist:**
- [ ] Each primitive displays a label, optional help text, and an inline error message when passed a mock error.
- [ ] No primitive performs or implies authoritative (server-trust) validation.

**Completion Criteria:** Task 3.5 is complete when `/components/admin/form/` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 3.6 — Dialog / Modal + Confirm Delete variant

**Objective:** Build a shared dialog component on shadcn/ui's dialog primitive, used for confirmations, quick-view previews, and lightweight secondary forms, plus a standardized Confirm Delete dialog variant that shows the target entity's name/title and requires explicit confirmation before a destructive action.

**Prerequisites:** Phase 3 prerequisites apply. No dependency on another Phase 3 task. (Easiest to manually verify once at least one authenticated route exists, per this phase's Dependencies note — not a hard code dependency.)

**Related Architecture Documents:** `11-admin-components.md` §3.6

**Files to create:**
- `/components/admin/dialog.tsx`
- `/components/admin/confirm-delete-dialog.tsx` — props: entity label/title, confirm handler.

**Files to modify:** None.

**Expected Result:** Generic dialog plus a delete-confirmation variant intended for reuse by every module's destructive actions.

**Accessibility Requirements — Dialog/Modal:** Both dialog components must implement full keyboard and accessibility support:
- Focus is trapped inside the dialog while open (no tab-focus escape to the page behind).
- Pressing ESC closes the dialog.
- Initial focus is placed on an appropriate element (e.g. Cancel button in Confirm Delete, or the first input in a form dialog).
- Dialog is marked with `role="dialog"` or `role="alertdialog"` (alertdialog for destructive confirmations like delete).
- Dialog title is associated via `aria-labelledby`.
- If there's body content, it's associated via `aria-describedby`.
- Screen readers announce the dialog as open when it appears.

**Verification Checklist:**
- [ ] Confirm Delete dialog shows the passed entity name.
- [ ] Confirm and cancel handlers fire correctly.
- [ ] Focus is trapped inside the dialog while open (Tab cycles through buttons only).
- [ ] Pressing ESC closes the dialog.
- [ ] Screen readers correctly identify the dialog and its purpose.

**Completion Criteria:** Task 3.6 is complete when both files exist as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 3.7 — Image Uploader (client-side shell only)

**Objective:** Build a drag-and-drop + click-to-browse image selector with client-side preview and basic client-side type/size validation, as a UX convenience layer only. This task implements the UI shell, file-selection mechanism, and preview only — it does NOT implement any actual file upload, HTTP requests, API integration, FormData submission, filesystem access, or persistence. It emits a selected-file event/callback for the consuming module to handle later.

**Prerequisites:** Phase 3 prerequisites apply. No dependency on another Phase 3 task.

**Related Architecture Documents:** `11-admin-components.md` §3.7; `06-security.md` §5, §7, §8 (authoritative server-side validation happens later, in Phase 5 — this task's client-side checks are non-authoritative)

**Files to create:**
- `/components/admin/image-uploader.tsx` — configurable for single (cover) vs. multiple (content) image use cases.

**Files to modify:** None.

**Expected Result:** Reusable uploader shell, not yet connected to any real upload endpoint.

**Implementation Scope — Image Uploader:** The Image Uploader component must:
- Accept props: `onFileSelected` callback, `mode` (single vs. multiple), `maxSize` bytes.
- Render drag-and-drop zone + click-to-browse file input.
- On file selection (via drag or click), extract File object(s) and pass to `onFileSelected` callback via props.
- Render a preview of the selected image(s) using `<img>` with File URL created via `URL.createObjectURL()` — this is client-side preview only, with no fetch or persistence.
- Perform client-side type/size validation and display a warning if files fail (e.g. "File must be JPG, PNG, or WebP and under 5 MB") — this is UX feedback only, never server-trust logic.
- **NEVER** submit FormData, make fetch/POST requests, or call any API endpoint.
- **NEVER** access the filesystem (no `fs` module, no server-side file operations).
- **NEVER** persist files anywhere — only emit the selected File object to the parent.
- **NEVER** implement magic-number detection, compression, resizing, or any processing — Phase 5 only.
- Never import from `/lib/modules/*` or any module-specific location.

**Verification Checklist:**
- [ ] Drag-and-drop selection works.
- [ ] Click-to-browse selection works.
- [ ] Client-side preview renders after selection.
- [ ] A wrong file type or oversized file shows a client-side warning, clearly non-authoritative.
- [ ] No HTTP requests are made by this component.
- [ ] No files are written to disk or persisted in any way.
- [ ] The `onFileSelected` callback receives the File object(s) and can pass them to a parent component to handle upload.

**Completion Criteria:** Task 3.7 is complete when `/components/admin/image-uploader.tsx` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 3.8 — Status Badge

**Objective:** Build a small, consistent status indicator component, configurable by label/variant, generalized beyond Articles' Published/Draft states to any future module's own status concept.

**Prerequisites:** Phase 3 prerequisites apply. No dependency on another Phase 3 task.

**Related Architecture Documents:** `11-admin-components.md` §3.8, §6 (accessibility — not color-only)

**Files to create:**
- `/components/admin/status-badge.tsx`

**Files to modify:** None.

**Expected Result:** Badge component accepting arbitrary label/variant props.

**Verification Checklist:**
- [ ] Renders at least two mock variants distinguishably.
- [ ] Status is conveyed by readable text alongside color, not color alone.

**Completion Criteria:** Task 3.8 is complete when `/components/admin/status-badge.tsx` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 3.9 — Empty State

**Objective:** Build a consistent empty-list pattern component: icon/illustration, message, and a primary action, reused identically by every module's list view when zero records exist.

**Prerequisites:** Phase 3 prerequisites apply. No dependency on another Phase 3 task.

**Related Architecture Documents:** `11-admin-components.md` §3.9

**Files to create:**
- `/components/admin/empty-state.tsx`

**Files to modify:** None.

**Expected Result:** Component reused by every module's list view when zero records exist.

**Verification Checklist:**
- [ ] Renders with a mock message and action.
- [ ] The action button fires its handler.

**Completion Criteria:** Task 3.9 is complete when `/components/admin/empty-state.tsx` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 3.10 — Toast / Notification (Sonner)

**Objective:** Build a global, shared success/error notification mechanism using the official shadcn/ui **Sonner** toast library, triggered via one shared client-side utility so every module gets identical timing/visual behavior. Use Sonner exclusively; do not implement a custom toast system.

**Prerequisites:** Phase 3 prerequisites apply. No dependency on another Phase 3 task. (Easiest to manually verify once at least one authenticated route exists, per this phase's Dependencies note — not a hard code dependency.)

**Related Architecture Documents:** `11-admin-components.md` §3.10

**Files to create:**
- `/components/admin/toast-provider.tsx` (Sonner provider wrapper, placed at app root)
- `/lib/admin/use-toast.ts` (custom hook or utility function wrapping Sonner's API, exported as a shared trigger)

**Files to modify:** None (or `/app/(admin)/layout.tsx` or app root to wrap with the Sonner provider, if not yet present).

**Expected Result:** App-wide Sonner toast provider plus a shared trigger utility exported for every module to import and call.

**Toast Implementation Requirements:**
- Use Sonner (`sonner` package on npm) as the exclusive toast system.
- Do not implement a custom toast system or use a different library.
- Export a shared trigger utility (e.g. `useToast()` hook or `toast()` function) that wraps Sonner's `toast()` API.
- Support at least `success`, `error`, and `loading` toast types (per Sonner's built-in types).
- Configure Sonner with sensible defaults: auto-dismiss after ~3 seconds for success/error, consistent positioning (e.g. top-right).
- All modules (Articles, Media Library, future modules) import and use this shared trigger, never invoke Sonner directly.

**Verification Checklist:**
- [ ] Mock success toast fires with distinct styling (green, success icon).
- [ ] Mock error toast fires with distinct styling (red, error icon).
- [ ] Both auto-dismiss consistently after a few seconds.
- [ ] The shared trigger utility is used consistently across all modules, never Sonner invoked directly elsewhere.

**Completion Criteria:** Task 3.10 is complete when the Sonner provider and shared trigger utility exist as described, Sonner is the exclusive toast system in the codebase, and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

### Task 3.11 — Loading Skeleton

**Objective:** Build shared skeleton-loading placeholders for tables, forms, and cards, used during route-level loading states, to avoid layout shift and provide consistent perceived performance across modules.

**Prerequisites:** Phase 3 prerequisites apply. No dependency on another Phase 3 task.

**Related Architecture Documents:** `11-admin-components.md` §3.11; `08-admin-layout.md` §7 (loading & error states)

**Files to create:**
- `/components/admin/loading-skeleton.tsx` — table, form, and card variants.

**Files to modify:** None.

**Expected Result:** Skeleton variants ready to be dropped into route `loading.tsx` files by later phases.

**Verification Checklist:**
- [ ] No layout shift occurs when a skeleton is swapped for real content of the same approximate shape.
- [ ] All three variants (table/form/card) render correctly with mock dimensions.

**Completion Criteria:** Task 3.11 is complete when `/components/admin/loading-skeleton.tsx` exists as described and every Verification Checklist item passes.

**STOP HERE. Wait for user approval before continuing.**

---

## Phase 3 Boundary — STOP HERE

Phase 3 ends with Task 3.11. 

**Before beginning Phase 4 implementation:**
1. Perform a complete self-review confirming that all 11 tasks are complete and every Verification Checklist item passes.
2. Verify consistency with the 20 architecture documents, especially `11-admin-components.md` §1–7, `08-admin-layout.md` §7, and `06-security.md` §5.
3. Verify consistency with all previous roadmap phases (Phase 1, Phase 2) — no Phase 1 or Phase 2 files were modified; no components were duplicated.
4. Confirm that every component adheres to the Shared Component Design Principles (Presentation Only, Props-Driven, Reusable, Accessible, No API Access, No Filesystem Access, No Module-Specific Knowledge).
5. Wait for explicit approval to proceed to Phase 4.

**Phase 3 must NOT implement:**

- Any module-specific component (Articles-specific table, form, or dialog)
- The image upload backend pipeline (magic-number detection, Sharp processing, storage path generation) — Phase 5 only
- Article CRUD, Media Library, Publishing, API endpoints, Dashboard data wiring, or any other Phase 4+ feature
- Any change to Phase 1 or Phase 2 files, routes, or components
- Any custom toast system; Sonner is the exclusive implementation
- Image Uploader upload functionality, HTTP requests, FormData, or file persistence

These belong to later phases and are out of scope for this document.