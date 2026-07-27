# 01 - Admin Overview

## 1. Purpose

This document defines the purpose, scope, and guiding principles of the Admin Dashboard for the Nyalian Tourism Village website. It serves as the foundation reference for all subsequent architecture, workflow, and module documentation.

The Admin Dashboard exists to give non-technical content operators a safe, structured interface to manage content that currently lives as static JSON files and local images inside the Next.js project — without requiring a database migration or manual file editing.

## 2. Background & Context

The Nyalian Tourism Village website is a static, content-driven site built with:

- **Next.js 15 (App Router)**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **JSON-based content** (no database)
- **Local images** stored under `/public/images`

Content was previously edited directly by developers through the codebase. As the site grows (Articles, Destinations, Tour Packages, Gallery, FAQ, UMKM listings, Homepage sections, etc.), direct file editing becomes error-prone, non-scalable, and inaccessible to non-technical staff (e.g. village tourism management staff).

The Admin Dashboard solves this by introducing a controlled, authenticated interface that reads and writes the same JSON/image data sources the public site already consumes — with no change to how the public site renders content.

## 3. Goals

- Provide a **CRUD interface** for managing structured content.
- Preserve the site's existing **static, JSON-based content model** (no forced database adoption).
- Ensure the dashboard is **modular and scalable**, so new content types can be added without re-architecting the system.
- Keep the **public website's rendering logic untouched** — the dashboard only manages the data the public site already reads.
- Enforce **authentication and access control** so only authorized administrators can modify content.
- Maintain **data integrity** through validation before any write operation.
- Support deployment on **standard Node.js hosting providers** (e.g. Rumahweb, Hostinger, IDCloudHost), avoiding dependency on serverless-only or edge-only platforms.

## 4. Non-Goals (Out of Scope for v1)

- Multi-tenant support (multiple villages/organizations).
- Role-based permission granularity beyond a single Admin role.
- Real-time collaborative editing.
- Full database migration (e.g. PostgreSQL, MongoDB) — this may be revisited in a future major version, but is not part of the current architecture.
- Content versioning / rollback history (may be considered as a future module).
- Third-party CMS integration.

## 5. Scope of Version 1

The first version of the Admin Dashboard manages **one module only: Articles**, including:

- Create, Read, Update, Delete (CRUD) operations for articles.
- Article content editing.
- Image handling for article cover/content images.
- Publishing state management (draft/published).
- Basic SEO metadata fields.
- Validation of article data before persistence.

Although v1 only implements the Articles module, the entire dashboard **must be architected as if more modules already exist**, so that adding a new module later is a matter of extension, not redesign.

## 6. Planned Future Modules

The following modules are anticipated in future versions and must be accounted for when designing shared architecture (layout, navigation, storage strategy, API structure, components):

| Module | Description |
|---|---|
| Destinations | Tourist destination listings within the village |
| Tour Packages | Bookable or informational tour package listings |
| Gallery | Photo/media showcase not tied to articles |
| FAQ | Frequently asked questions content |
| UMKM | Local micro-business (UMKM) directory/profiles |
| Homepage | Manageable homepage sections (hero, highlights, etc.) |

These modules are **not implemented in v1**, but the architecture defined in this documentation set must not require breaking changes to accommodate them.

## 7. Core Design Principles

1. **Module Isolation** — Each content type (Articles, Destinations, etc.) is treated as an independent module with its own data schema, validation rules, and API routes, following a consistent shared pattern.
2. **Single Source of Truth** — The dashboard reads and writes the same JSON files consumed by the public site. No duplicate or shadow data store.
3. **Predictable File & Folder Conventions** — New modules follow the same folder, naming, and routing conventions established by the Articles module, enabling copy-pattern scalability.
4. **Separation of Concerns** — UI layer, validation layer, and data access layer are distinct and independently testable.
5. **Progressive Enhancement, Not Overengineering** — v1 avoids introducing infrastructure (databases, external services) not yet justified by actual requirements, while not blocking future adoption.
6. **Security by Default** — All write operations require authentication; all input is validated server-side regardless of client-side checks.
7. **Static-Site Compatibility** — All dashboard operations must remain compatible with the public site continuing to run as a statically-served, JSON-driven Next.js application.

## 8. High-Level Workflow

1. An authenticated admin logs into the Admin Dashboard.
2. The admin navigates to a module (v1: Articles).
3. The admin performs a CRUD action through the dashboard UI.
4. The action is sent to an internal API route.
5. The API route validates the request, then reads/writes the corresponding JSON file (and image files, if applicable) on the server's filesystem.
6. The public website reflects the updated content on next build/request, depending on the rendering strategy defined in later documents.

## 9. Document Set Overview

This overview is the first of a structured documentation series. Subsequent documents will define:

- System and folder architecture
- Authentication mechanism
- Storage strategy for JSON content and images
- Deployment considerations for Node.js hosting
- Security practices
- Environment variable management
- Admin UI structure (layout, navigation, components)
- Articles module in full detail (editor, images, publishing, SEO, validation)
- Media library
- API design and reference

Each document builds on this overview and must remain consistent with the goals, scope, and principles defined here.

## 10. Summary

The Admin Dashboard is a scalable, authenticated management layer built on top of the existing static, JSON-based Nyalian Tourism Village website. Version 1 delivers full Articles management while establishing architectural conventions intended to support future modules such as Destinations, Tour Packages, Gallery, FAQ, UMKM, and Homepage management — without requiring structural rewrites.