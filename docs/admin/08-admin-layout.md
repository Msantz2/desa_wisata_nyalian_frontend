# 08 - Admin Layout

## 1. Purpose

This document defines the structural UI layout of the Admin Dashboard — the persistent shell (navigation, header, content area) shared across all admin pages and modules. It builds on the routing structure defined in `02-admin-architecture.md` and sets the foundation for `09-admin-dashboard.md`, `10-admin-navigation.md`, and `11-admin-components.md`.

## 2. Layout Philosophy

The Admin Dashboard uses a **persistent application shell** pattern: a fixed structural frame (sidebar, header) that remains stable across navigation, while only the inner content area changes per route. This is implemented using Next.js App Router's nested layout system, so the shell is defined once and automatically wraps every admin route.

Design goals for the layout:

- **Consistency** — every module (Articles today, Destinations/Gallery/etc. later) is presented inside the same shell, so the interface feels unified regardless of which module is being managed.
- **Predictability** — navigation, current location, and available actions are always visible; the admin never loses context while working.
- **Scalability** — the shell must accommodate a growing number of navigation entries (as modules are added) without redesign.
- **Simplicity** — the layout favors clarity and efficiency for a small operational team over dense, feature-heavy dashboard patterns.

## 3. Layout Composition

The admin shell is composed of three primary regions:

```
┌─────────────────────────────────────────────┐
│                  Top Header                   │
├───────────┬───────────────────────────────────┤
│           │                                   │
│  Sidebar  │           Content Area             │
│           │                                   │
│           │                                   │
└───────────┴───────────────────────────────────┘
```

### 3.1 Sidebar
- Persistent vertical navigation listing all available modules (Articles in v1; future modules appended as they are added).
- Highlights the currently active module/section.
- Collapsible on smaller viewports (see Section 6).
- Structure and content are driven by a shared navigation configuration, detailed in `10-admin-navigation.md`, so adding a module to the sidebar is a configuration change, not a layout change.

### 3.2 Top Header
- Displays contextual information: current page/module title, breadcrumb (optional, for nested views such as an article editor).
- Hosts admin account controls: current admin identity and a logout action.
- May host global actions in the future (e.g. notifications), without requiring structural changes to the layout.

### 3.3 Content Area
- Renders the active route's page content (dashboard home, module list views, module forms, etc.).
- Owns its own internal scrolling, independent of the sidebar/header, so the shell frame remains fixed while content scrolls.
- Enforces consistent internal spacing/padding conventions so individual pages don't need to redefine page-level layout spacing.

## 4. Route-to-Layout Mapping

Following the route grouping defined in `02-admin-architecture.md`:

```
/app/(admin)
  layout.tsx        → renders the admin shell (Sidebar + Header + content slot)
  /admin
    /login
      page.tsx       → intentionally rendered WITHOUT the shell (see Section 5)
    /dashboard
      page.tsx
    /articles
      page.tsx
      /new
        page.tsx
      /[id]/edit
        page.tsx
```

- The shell layout (`layout.tsx`) wraps every route under `/admin` **except** `/admin/login`.
- Each module's pages are nested under the shared shell, inheriting sidebar/header automatically — a new module simply adds its own route folder without touching the shell layout.

## 5. Login Page Exception

The `/admin/login` route is intentionally excluded from the shell layout:

- It has no sidebar or authenticated header, since no session exists yet at that point.
- It is implemented as a separate, minimal layout (e.g. centered card, no navigation), reflecting its distinct purpose and unauthenticated state.
- This separation is handled through Next.js route group/layout nesting, keeping the authenticated shell and the public login view cleanly isolated — consistent with the middleware-based route protection defined in `03-authentication.md`, Section 7.

## 6. Responsive Behavior

- **Desktop (primary target)** — full sidebar visible alongside content, since the Admin Dashboard is expected to be used primarily on desktop/laptop devices by village tourism staff.
- **Tablet/smaller viewports** — sidebar collapses into a toggleable drawer/off-canvas panel, accessible via a menu control in the header, preserving usability without permanently sacrificing content width.
- **Mobile** — supported as a secondary experience (e.g. for quick checks or minor edits), with the same collapsible sidebar pattern and stacked, single-column content area.

Responsive breakpoints follow Tailwind CSS's default breakpoint scale, keeping the implementation consistent with the rest of the project's styling conventions.

## 7. Loading & Error States

- **Route-level loading state**: each route segment may define its own `loading.tsx`, shown within the content area only — the shell (sidebar/header) never unmounts or flashes during navigation between admin pages, preserving a stable, app-like feel.
- **Route-level error state**: each route segment may define its own `error.tsx` boundary, contained within the content area, so a failure in one module's page does not break the shell or navigation to other modules.
- **Empty states**: list views (e.g. "no articles yet") use a consistent empty-state pattern defined in `11-admin-components.md`, rather than each module inventing its own.

## 8. Theming & Visual Foundation

- Built with Tailwind CSS utility classes and shadcn/ui components, matching the existing project stack.
- The Admin Dashboard uses a **distinct, consistent visual identity from the public site** where appropriate (e.g. a neutral, functional admin theme), while still sharing the project's base design tokens (colors, typography scale, spacing) to avoid maintaining two unrelated design systems.
- Dark mode is not required for v1 but the layout should not structurally prevent it from being added later (e.g. shadcn/ui's theming approach should remain compatible if introduced in the future).

## 9. Accessibility Considerations

- Sidebar navigation and header controls are keyboard-navigable and expose appropriate semantic roles/labels (e.g. `nav`, `aria-current` for the active module).
- Sufficient color contrast is maintained for all shell elements, per standard accessibility guidelines, since the dashboard is a functional tool used repeatedly by operational staff.
- Focus states are visible for all interactive shell elements (navigation links, header controls).

## 10. Extensibility for Future Modules

The layout is designed so that adding a new module (e.g. Destinations) requires only:

1. Adding a new route folder under `/app/(admin)/admin/{module}`, inheriting the existing shell layout automatically.
2. Registering the module in the shared navigation configuration (`10-admin-navigation.md`).

No changes to `layout.tsx`, the header, or the sidebar's structural implementation are required to support a new module — fulfilling the scalability principle established in `01-admin-overview.md` and `02-admin-architecture.md`.

## 11. Summary

The Admin Dashboard uses a persistent shell layout — sidebar, header, and content area — implemented via Next.js nested layouts, applied to all authenticated admin routes except the login page. The shell is intentionally decoupled from any individual module's content, ensuring that navigation, structure, and visual consistency remain stable as new modules are introduced over time.