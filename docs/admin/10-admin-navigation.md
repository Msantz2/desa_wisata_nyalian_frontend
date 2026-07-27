# 10 - Admin Navigation

## 1. Purpose

This document defines how navigation works within the Admin Dashboard: the structure of the sidebar, how navigation entries are configured, how active states are determined, and how new modules register themselves into navigation without modifying shared layout code. It builds directly on the shell layout defined in `08-admin-layout.md` and the module registry concept introduced in `09-admin-dashboard.md`.

## 2. Navigation Philosophy

Navigation is **configuration-driven, not hardcoded**. The sidebar does not contain module-specific markup; instead, it renders a list of navigation entries sourced from a central navigation configuration. This ensures that:

- Adding a new module (e.g. Destinations) means adding one configuration entry, not editing sidebar component code.
- The navigation structure stays consistent and predictable as the number of modules grows.
- Ordering, grouping, and labeling of modules can be adjusted centrally without touching individual module implementations.

## 3. Navigation Configuration Structure

A single navigation configuration file (e.g. `/lib/navigation/config.ts`) defines all sidebar entries. Each entry follows a consistent shape:

| Field | Description |
|---|---|
| `key` | Unique identifier, matching the module's registry key from `09-admin-dashboard.md` where applicable |
| `label` | Display text shown in the sidebar |
| `href` | Target route for the navigation link |
| `icon` | Icon reference (from the project's icon set, used consistently with shadcn/ui conventions) |
| `group` | Optional grouping label (see Section 5) |
| `order` | Numeric value controlling display order within its group |

Example (illustrative structure, not implementation code):

```
[
  { key: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: "layout-dashboard", group: "General", order: 1 },
  { key: "articles", label: "Articles", href: "/admin/articles", icon: "newspaper", group: "Content", order: 1 }
]
```

Future modules append their own entry to this same list (e.g. `{ key: "destinations", label: "Destinations", href: "/admin/destinations", icon: "map-pin", group: "Content", order: 2 }`), without altering the sidebar rendering logic.

## 4. Sidebar Rendering Behavior

- The sidebar component iterates over the navigation configuration and renders one link per entry, grouped and ordered as defined.
- The currently active entry is determined by matching the current route against each entry's `href` (including matching nested routes, e.g. `/admin/articles/123/edit` is considered part of the `articles` entry), and is visually highlighted using `aria-current="page"` and a distinct style state.
- Navigation entries are rendered using Next.js's client-side navigation (`Link`) to preserve the persistent shell and avoid full page reloads, per `08-admin-layout.md`.

## 5. Grouping Strategy

To keep the sidebar readable as more modules are added, navigation entries are organized into logical groups rather than a single flat list. Anticipated groups:

| Group | Contents |
|---|---|
| General | Dashboard home |
| Content | Articles, and future content modules (Destinations, Tour Packages, Gallery, FAQ, UMKM) |
| Site | Homepage management (future) |
| Account | Logout, admin profile (if introduced later) |

Grouping is configuration-driven (via the `group` field), so reorganizing modules between groups is a configuration change. This structure prevents the sidebar from becoming an unstructured, ever-growing flat list as modules are added over time.

## 6. Breadcrumbs

- Nested views within a module (e.g. an article's edit page) display a breadcrumb trail in the header area (per `08-admin-layout.md`, Section 3.2), e.g. `Articles / Edit "Pantai Nyalian"`.
- Breadcrumb generation follows a consistent pattern per module: `{Module Label} / {Contextual Action or Entity Title}`, so each module implements the same breadcrumb convention rather than inventing its own.
- Breadcrumbs are derived from route segments and, where needed, a lightweight lookup of the current entity's display name (e.g. article title), fetched by the page itself rather than the shared layout.

## 7. Mobile & Collapsed Navigation

- On smaller viewports, the sidebar collapses into an off-canvas drawer, toggled from the header (per `08-admin-layout.md`, Section 6).
- The same navigation configuration drives both the desktop sidebar and the mobile drawer, ensuring the two never fall out of sync.
- Group headers remain visible in the collapsed/drawer view to preserve orientation on smaller screens.

## 8. Access-Aware Navigation (Future Extensibility)

Although v1 has a single Admin role with full access, the navigation configuration is designed to support role-based visibility later without structural changes:

- Each navigation entry may optionally declare a `requiredRole` (or equivalent permission marker), defaulting to "any authenticated admin" in v1.
- When role-based access control is introduced (per `03-authentication.md`, Section 9), the sidebar rendering logic filters entries based on the current session's role — a filtering step added to the existing rendering logic, not a redesign of it.

## 9. Relationship to the Module Registry

The navigation configuration and the module registry described in `09-admin-dashboard.md` serve related but distinct purposes:

| Concern | Owned by |
|---|---|
| Sidebar link structure, grouping, ordering | Navigation configuration (`10-admin-navigation.md`) |
| Dashboard summary cards and quick actions | Module registry (`09-admin-dashboard.md`) |

Both are configuration-driven and typically updated together when a new module is introduced, but they remain separate concerns so that navigation structure (e.g. reordering the sidebar) can change independently of dashboard summary behavior, and vice versa.

## 10. Adding a New Module to Navigation (Reference Checklist)

When a future module (e.g. Destinations) is introduced, navigation integration consists of:

1. Adding one entry to the navigation configuration (Section 3).
2. Assigning it to the appropriate group (Section 5).
3. Confirming its route exists under `/app/(admin)/admin/{module}`, per `02-admin-architecture.md`.

No changes to the sidebar component, header component, or shell layout are required.

## 11. Summary

Admin navigation is entirely configuration-driven: a single, centrally maintained list of entries defines the sidebar's links, grouping, order, and (in the future) role visibility. Both desktop and mobile navigation render from this same configuration, ensuring consistency. This approach allows new modules to be added to the navigation surface through configuration alone, directly supporting the scalability principles established in `01-admin-overview.md` and `02-admin-architecture.md`.