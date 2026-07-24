# 02 - Admin Architecture

## 1. Purpose

This document defines the technical architecture of the Admin Dashboard: how the system is structured, how layers interact, and how the design guarantees that future modules (Destinations, Tour Packages, Gallery, FAQ, UMKM, Homepage) can be added without changing the core architecture.

It builds directly on the goals and principles defined in `01-admin-overview.md`.

## 2. Architectural Style

The Admin Dashboard follows a **modular, layered, monolith architecture** inside the existing Next.js application — it is not a separate service. It is implemented as an authenticated sub-section of the same Next.js 15 App Router project that also serves the public tourism village website.

Key architectural characteristics:

- **App Router-based route grouping** — the admin area is isolated using a dedicated route group, separate from the public site's routes.
- **API Routes as the only data-access boundary** — the dashboard UI never reads/writes JSON or image files directly; it always goes through internal API routes (Route Handlers).
- **Module pattern** — every content type (Articles, and future modules) is implemented as a self-contained module following an identical internal structure.
- **Server-first data handling** — reading and writing content happens on the server (Route Handlers / Server Actions boundary), never trusting client-side state as the source of truth.
- **Filesystem as the persistence layer** — JSON files and local images remain the system of record, consistent with the site's existing static content model.

## 3. High-Level System Diagram (Conceptual)

```
[ Admin UI (App Router pages) ]
            │
            ▼
[ API Routes / Route Handlers (per module) ]
            │
            ▼
[ Validation Layer (schema-based) ]
            │
            ▼
[ Data Access Layer (filesystem read/write) ]
            │
            ▼
[ JSON Content Files + /public/images ]
            │
            ▼
[ Public Website (reads same JSON/images) ]
```

The public website and the Admin Dashboard are two consumers of the **same data source**, not two separate systems with synchronization logic.

## 4. Top-Level Folder Structure (Conceptual)

The exact structure will be refined in later documents (`08-admin-layout.md`, `19-api-overview.md`), but the architecture commits to the following top-level separation:

```
/app
  /(public)          → existing public-facing site routes
  /(admin)           → all admin dashboard routes, isolated route group
    /admin
      /login
      /dashboard
      /articles
      ...future modules follow the same pattern

  /api
    /admin
      /articles
      ...future modules follow the same pattern

/lib
  /modules
    /articles
      schema.ts        → validation schema
      service.ts        → data access logic (read/write JSON, images)
      types.ts           → TypeScript types
    ...future modules follow the same pattern
  /auth
  /storage
  /validation

/content
  /articles.json
  ...future module JSON files

/public
  /images
    /articles
    ...future module image folders
```

This structure enforces **one predictable pattern per module**, so adding "Destinations" later means creating a parallel `destinations` folder in each layer — not modifying shared code.

## 5. Layered Responsibilities

### 5.1 Presentation Layer (Admin UI)
- Built with React 19 Server/Client Components, Tailwind CSS, and shadcn/ui.
- Responsible only for rendering, user interaction, and client-side form validation (UX convenience, not security).
- Never accesses the filesystem directly.
- Communicates exclusively with the module's API routes.

### 5.2 API Layer (Route Handlers)
- One set of Route Handlers per module (e.g. `/api/admin/articles`).
- Responsible for:
  - Authenticating and authorizing the request.
  - Parsing input.
  - Delegating to the validation layer.
  - Delegating to the module's data access service.
  - Returning consistent, predictable JSON responses.
- Contains no direct filesystem logic — that is delegated to the data access layer.

### 5.3 Validation Layer
- Schema-based validation (e.g. using a schema library such as Zod, defined in `17-article-validation.md` for the Articles module specifically).
- Shared validation utilities live in `/lib/validation`, while module-specific schemas live inside each module's own folder.
- All validation is enforced **server-side**, regardless of any client-side validation performed for UX purposes.

### 5.4 Data Access Layer (Module Services)
- Each module exposes a `service.ts` (or equivalent) responsible for:
  - Reading the module's JSON file.
  - Writing/updating the module's JSON file.
  - Managing related image files under `/public/images/{module}`.
- This layer abstracts *how* data is persisted, so that a future migration (e.g. to a database) would only require rewriting this layer — not the API layer, UI layer, or other modules.

### 5.5 Persistence Layer
- JSON files under a dedicated `/content` directory (not directly inside `/public`, to avoid unauthenticated public exposure of raw content files where not required).
- Images under `/public/images/{module}`, since these must remain publicly servable by the static site.
- Detailed conventions are defined in `04-storage-strategy.md`.

## 6. Module Pattern (Contract)

Every module — current and future — must implement the same internal contract:

| Concern | Convention |
|---|---|
| Route group | `/app/(admin)/admin/{module}` |
| API routes | `/app/api/admin/{module}` |
| Data schema | `/lib/modules/{module}/schema.ts` |
| Data service | `/lib/modules/{module}/service.ts` |
| Types | `/lib/modules/{module}/types.ts` |
| Content storage | `/content/{module}.json` |
| Image storage | `/public/images/{module}/` |

This contract is what allows the system to scale horizontally (by adding modules) rather than vertically (by growing complexity inside a single monolithic module).

## 7. Module Interface Contract

To ensure consistency and predictability across all modules, each module exposes a standard layered interface comprising four key layers: Module Service, Storage Interface, JSON Storage Implementation, and DTOs.

### 7.1 Module Service Layer

**Responsibility:** Orchestrate business logic and coordinate data operations.

The Module Service (e.g., `articles/service.ts`) is responsible for:

- **Business Logic:** Implement all module-specific operations (e.g., creating, updating, listing, deleting content entities).
- **Input/Output Validation Integration:** Coordinate with the validation layer by calling Zod schemas and propagating validation errors up to the API layer for client response.
- **Storage Layer Delegation:** Call the Storage Interface (never files directly) to persist or retrieve data.
- **Data Transformation:** Convert between API DTOs (request/response contracts defined in Section 7.4) and storage models as needed, ensuring the storage layer remains isolated from API concerns.
- **Error Handling:** Catch storage and validation errors and propagate them as application errors for the API layer to handle.

**Constraint:** The Module Service must never access HTTP requests, responses, headers, or cookies directly. It receives only serialized data (DTOs) and returns only serialized data.

### 7.2 Storage Interface

**Responsibility:** Define the contract for persisting and retrieving data.

The Storage Interface (e.g., a simple exported object or class with methods) exposes operations such as:

- `read()` — retrieve the complete data set from storage (e.g., all articles).
- `write(data)` — persist the complete data set to storage with atomic guarantees.
- Optionally, `readById(id)` or `search()` for efficiency, depending on module needs.

**Constraint:** The Storage Interface contains no business logic, validation, or knowledge of API contracts or UI concerns. It is purely a persistence abstraction.

### 7.3 JSON Storage Implementation

**Responsibility:** Implement atomic file operations for JSON persistence.

The JSON Storage implementation (e.g., `articles/storage.ts`) handles:

- Reading and writing JSON files under `/content/{module}.json`.
- Implementing atomic write operations (e.g., write-to-temp-file-then-rename) to prevent corruption during concurrent writes.
- Managing file encoding, error handling, and filesystem-level concerns.
- Delegating image file management to utilities defined in `04-storage-strategy.md`.

**Constraint:** The JSON Storage implementation must not interpret or validate data. It treats all data as opaque bytes to be persisted. All validation occurs in the validation layer (see Section 5.3) before data reaches storage.

### 7.4 DTO (Data Transfer Object) Guidelines

DTOs define the request and response contracts between the API layer and the Service layer.

- **DTOs are independent of storage models:** A DTO may include computed fields, subset fields, or aggregated data that does not directly correspond to storage structure.
- **DTOs are validated using Zod schemas:** The validation layer validates input DTOs against Zod schemas (e.g., `CreateArticleSchema` in `17-article-validation.md`) before they are passed to the Service.
- **Storage models are independent of DTOs:** The Service transforms input DTOs to storage models and transforms storage models back to output DTOs as needed, isolating the storage layer from API concerns.
- **No circular dependencies:** A DTO is serializable to JSON and contains only plain objects; no circular references or class instances.

Example workflow:
1. API layer receives `CreateArticleRequest` DTO from client.
2. Validation layer validates the DTO against `CreateArticleSchema` (Zod).
3. Service layer transforms the validated DTO to an internal storage model.
4. Storage layer persists the model atomically.
5. Service layer transforms the persisted storage model back to `ArticleResponse` DTO.
6. API layer returns the DTO to the client.



## 8. Data Flow Example (Article Update)

1. Admin submits an edit form in `/admin/articles/[id]/edit`.
2. The Admin UI sends a `PUT` request to `/api/admin/articles/[id]`.
3. The Route Handler verifies the admin session (see `03-authentication.md`).
4. The request body is validated against the Articles schema.
5. On success, the Articles service updates the corresponding entry in `articles.json` and, if applicable, replaces associated image files.
6. The Route Handler returns a success response with the updated article data.
7. The Admin UI updates its local state/UI to reflect the change.
8. The public website reflects the change according to the rendering/revalidation strategy defined in `05-deployment.md`.

## 9. Scalability Strategy

Scalability in this project means **adding modules without modifying shared architecture**, achieved through:

1. **Consistent module contract** (Section 6) — new modules copy the pattern, they don't redesign it.
2. **Shared, generic utilities** — authentication, validation helpers, filesystem helpers, and UI primitives (tables, forms, dialogs) are built generically enough to be reused by any module.
3. **Route grouping** — the `(admin)` route group keeps all admin routes isolated from public routes, so admin growth never impacts public site routing.
4. **Decoupled data access** — because all persistence goes through a service layer, the underlying storage mechanism (JSON today) can evolve later without touching UI or API layers.
5. **Navigation and layout driven by configuration**, not hardcoded per-module markup (see `10-admin-navigation.md`), so registering a new module in the sidebar is a configuration change, not a structural one.

## 10. Technology Decisions Summary

| Concern | Decision | Rationale |
|---|---|---|
| Framework | Next.js 15 App Router | Already used by the project; supports Route Handlers, layouts, and route groups needed for this architecture |
| UI Library | React 19 + shadcn/ui + Tailwind CSS | Consistent with existing project stack |
| Data storage | JSON files on filesystem | Matches existing static content model; avoids introducing a database for v1 |
| Image storage | Local filesystem under `/public/images` | Matches existing image handling; compatible with static hosting |
| API style | Next.js Route Handlers (REST-like) | Native to the framework, no extra dependencies required |
| Hosting | Node.js hosting (e.g. Rumahweb, Hostinger, IDCloudHost) | Requires persistent filesystem write access, ruling out edge/serverless-only platforms |

## 11. Constraints Imposed by This Architecture

- The hosting environment **must support persistent filesystem writes** (ruling out purely serverless/edge deployments where the filesystem is read-only or ephemeral). This is elaborated in `05-deployment.md`.
- Because content is file-based, **concurrent writes must be handled carefully** to avoid race conditions (addressed in `04-storage-strategy.md`).
- The public site's rendering strategy must be reconciled with how quickly admin changes should appear (addressed in `05-deployment.md`).

## 12. Summary and Cross-References

### Architecture Documentation Cross-References

This architecture document provides the conceptual framework and module contract. Implementation details and specific requirements are defined in the following documents:

- **`03-authentication.md`** — Authentication and authorization architecture for the admin area, session management, and access control.
- **`04-storage-strategy.md`** — JSON storage conventions, atomic write operations, concurrent access handling, and image file management.
- **`06-security.md`** — Security requirements, input validation, output encoding, CSRF protection, and security audit guidelines.
- **`17-article-validation.md`** — Module-specific validation schemas (Zod) for the Articles module; serves as the template for validation schemas in future modules.
- **`19-api-overview.md`** — API contract specifications, Route Handler patterns, request/response formats, and error handling conventions.

Readers implementing a new module should consult these documents in addition to the module pattern defined in Section 6 and the interface contract defined in Section 7.



The Admin Dashboard is architected as a layered, module-based extension of the existing Next.js application. A strict module contract — covering routing, API, validation, data access, and storage — ensures that Articles in v1 and future modules alike follow the same predictable pattern. This allows the system to scale by addition rather than modification, fulfilling the scalability requirement defined in the project brief.