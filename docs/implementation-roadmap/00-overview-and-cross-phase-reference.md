# Overview & Cross-Phase Reference

> Nyalian Tourism Village Admin Dashboard — Implementation Roadmap
> This is a **documentation index**, not an implementation document. It contains no coding tasks or step-by-step build instructions — those live in the phase files (`01-phase-1-foundation.md` through `07-phase-7-dashboard-polish-and-production-readiness.md`). This file exists so material that applies *across* phases isn't duplicated into every phase file.
> This is a reorganized excerpt of the original `implementation-roadmap.md` (Sections 0, 1, 9, 10, 11, 12, 13). No technical content has been added, removed, or altered — only consolidated and re-labeled for navigation.

---

## 1. Project Overview

**Status:** Planning document only. No code is generated here. The roadmap (this file plus the 7 phase files) is the input used later to generate one coding prompt per task.

**Source of truth:** The 20 documents in `/docs/admin` (`01-admin-overview.md` through `20-api-articles.md`). Nothing in the roadmap overrides them. Every task in every phase file cites the section(s) it implements.

**Phase files, in implementation order:**
1. `01-phase-1-foundation.md` — Foundation
2. `02-phase-2-authentication.md` — Authentication
3. `03-phase-3-shared-admin-components.md` — Shared Admin Components
4. `04-phase-4-article-crud.md` — Article CRUD
5. `05-phase-5-image-upload.md` — Image Upload
6. `06-phase-6-media-library.md` — Media Library
7. `07-phase-7-dashboard-polish-and-production-readiness.md` — Dashboard Polish & Production Readiness

---

## 2. Architecture Document Map

Documents referenced by number/filename across the roadmap. Where the roadmap text names a document explicitly, that title is given; where a document is cited only by number (e.g. `` `02` ``), no title is stated anywhere in the roadmap text, so none is invented here.

| # | Document | Title (as named in roadmap) |
|---|---|---|
| 01 | `01-admin-overview.md` | Admin Overview |
| 02 | `02` | *(cited by number only — no filename given in roadmap text)* |
| 03 | `03-authentication.md` | Authentication |
| 04 | `04` | *(cited by number only)* |
| 05 | `05-deployment.md` | Deployment |
| 06 | `06-security.md` | Security |
| 07 | `07-environment-variables.md` | Environment Variables — **flagged:** the copy provided in the source archive actually duplicates `05-deployment.md`'s content (title reads "# 05 - Deployment"); see Documentation Note 1 below. |
| 08 | `08` | *(cited by number only — shell/layout topics)* |
| 09 | `09-admin-dashboard.md` | Admin Dashboard |
| 10 | `10` | *(cited by number only — navigation topics)* |
| 11 | `11-admin-components.md` | Admin Components |
| 12 | `12` | *(cited by number only)* |
| 13 | `13` | *(cited by number only)* |
| 14 | `14-article-image.md` | Article Image |
| 15 | `15` | *(cited by number only)* |
| 16 | `16` | *(cited by number only)* |
| 17 | `17-article-validation.md` | Article Validation |
| 18 | `18-media-library.md` | Media Library |
| 19 | `19-api-overview.md` | API Overview |
| 20 | `20-api-articles.md` | API Articles |
| 21 | `21-api-media.md` | API Media — **does not exist** in the 20-document set. `18-media-library.md` describes Media Library UI/behavior and references deletion "via the API," but no document defines its routes. The roadmap infers routes from the `19-api-overview.md` convention; see Documentation Note 4 below. |

---

## 3. Cross-Document References (Documentation Notes & Open Items)

Gaps or internal conflicts found while reading the doc set. They don't change any architecture — they're flagged so a task isn't started on an ambiguous contract. None of these required inventing new technical decisions — they're either reconstructed from cross-references already in the docs, or explicitly flagged as inferred/unresolved so a human confirms before that specific task is turned into code.

| # | Issue | Where | Impact | Suggested handling |
|---|---|---|---|---|
| 1 | `07-environment-variables.md` in the provided archive actually contains a duplicate of `05-deployment.md`'s content (title reads "# 05 - Deployment"), not an environment-variable reference. | `07-environment-variables.md` | Task 1.2 and Phase 5's env-validation-adjacent work can't cite an exact variable table (types, optionality, defaults). | Env vars used in this roadmap are reconstructed from cross-references in `03-authentication.md` §4/§7/§9 and the (also duplicated) deployment doc §5: `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`. **Recommend re-uploading the correct `07-environment-variables.md` before Task 1.2 is turned into a coding prompt**, in case additional variables exist. |
| 2 | Cookie `SameSite` attribute conflicts between documents: `03-authentication.md` §6.1/§11 says `SameSite=Strict`; `06-security.md` §3 says `SameSite=Lax`. Both documents are marked "locked for v1." | `03-authentication.md`, `06-security.md` | Phase 2's login route / cookie creation task needs one exact value. | Flagged, not resolved. The relevant Phase 2 task calls this out explicitly as a decision to confirm before implementation. |
| 3 | Image upload size limit conflicts: `06-security.md` §8 says **2 MB** max upload, max dimensions 1600×900; `14-article-image.md` §6, `17-article-validation.md` §7, and `20-api-articles.md` §9 all say **5 MB** max (three module-specific docs agree with each other, one cross-cutting doc disagrees). | `06-security.md` vs. `14/17/20` | Phase 5's upload limit enforcement task needs one number. | Roadmap defaults to **5 MB**, since it's the Articles-module-specific figure repeated consistently across three docs, but flags this for confirmation before that task becomes a coding prompt. |
| 4 | No `21-api-media.md` (or equivalent) exists defining the Media Library's API routes, even though `18-media-library.md` describes UI/behavior in detail and references deletion "via the API." | `18-media-library.md` | Phase 6 (Media Library) API tasks have no documented route shape to follow exactly. | Roadmap infers routes following the established convention in `19-api-overview.md` (e.g. `GET /api/admin/media`, `DELETE /api/admin/media?path=...`) — flagged as **inferred, not locked**, and called out inside the relevant Phase 6 tasks. |
| 5 | Tension between `06-security.md` §12 ("logged to **stdout**, production logging handled by the hosting process manager") and `09-admin-dashboard.md` §4.3 ("Recent Activity... sourced from the audit/logging mechanism... last 10–15 events"). Stdout consumed by an external process manager is not queryable at runtime by the Next.js app. | `06-security.md`, `09-admin-dashboard.md` | Phase 7's Recent Activity feed task cannot be implemented as literally "read recent log lines from stdout" inside the running process. | Flagged in the relevant Phase 7 task as requiring a clarifying decision (e.g. an in-process ring buffer of recent mutation events, in addition to stdout logging, without changing the logging architecture itself). Not resolved here — this is a genuine architecture question, not a wording nitpick. |
| 6 | The original requested task breakdown lists "settings" and "profile" for the final phase, but no Settings module or Admin Profile page is defined anywhere in the 20 documents. `03-authentication.md` §12 explicitly places "in-app password reset or account recovery" and multi-admin support out of scope for v1. | Whole doc set | Building a Settings/Profile page would introduce UI and possibly API surface not backed by any document. | Phase 7 **excludes** Settings and Profile pages. It implements only what's documented: dashboard data wiring, Recent Activity, security headers, accessibility, responsive polish, and performance/production readiness. If Settings/Profile are actually wanted, that needs its own architecture document first — not a Phase 7 addition. |

---

## 4. Dependency Graph

```
Phase 1 (Foundation)
  └─▶ Phase 2 (Authentication)
        └─▶ Phase 4 (Article CRUD) ──┐
  └─▶ Phase 3 (Shared Components) ───┤
                                     ├─▶ Phase 5 (Image Upload) ─┐
                                     │     ▲                    │
                                     │     └── overlaps Phase 4 ─┘
                                     │        (4.9, 4.11 need 5.4 to finish cleanly;
                                     │         5.5/5.6 need 4.7's editor shell to exist)
                                     ├─▶ Phase 6 (Media Library)  ◀── needs Phase 4 + Phase 5 data
                                     └─▶ Phase 7 (Dashboard Polish) ◀── needs ALL prior phases
```

**Task-level dependency notes not obvious from the phase graph:**
- Task 1.9 (middleware stub, Phase 1) is completed by Task 2.6 (Phase 2) — same file, sequential, not parallel-safe.
- Task 4.7 (editor shell, Phase 4) is a hard prerequisite for Tasks 4.8–4.15 (Phase 4) and for Tasks 5.5–5.6 (Phase 5) — there's nowhere to mount the Cover Image / Tiptap Image button without it.
- Task 4.3 (Articles service, Phase 4) is a hard prerequisite for every Phase 4 API route (4.4, 4.5, 4.12) and for Phase 5's image-folder-cleanup addition to `deleteArticle()`.
- Task 5.3 (storage path utility, Phase 5) is a soft prerequisite for Task 6.1 (Media Library scan, Phase 6) — reusing the same path/namespace assumptions avoids two implementations of "what counts as a valid image path."
- Task 7.1 (Phase 7) depends on Task 4.3 (Phase 4, real counts) and Task 1.6/1.8 (Phase 1, registry slot already exists structurally).
- Task 7.2 (Phase 7) is gated on a human decision (Documentation Note 5 above) independent of code readiness.

**Recommended implementation order** (cross-phase sequencing — the front-loads-highest-risk rationale applies to the whole roadmap, not one phase):
1. **Phase 1** — Tasks 1.1 → 1.2 → 1.3 → 1.6 → 1.4 → 1.5 → 1.9 → 1.7 → 1.8 (config before components that consume it; shell before shell-dependent pages).
2. **Phase 2** — Tasks 2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6 → 2.7 → 2.8 → 2.9.
3. **Phase 3** — Order is largely parallel-safe once Phase 1 is done; suggested sequence: 3.1 → 3.9 → 3.11 → 3.8 → 3.3 → 3.2 → 3.4 → 3.5 → 3.6 → 3.10 → 3.7 (build simple/independent components first, Data Table after its sub-dependencies Pagination/Empty State/Skeleton exist).
4. **Phase 4 (part A — non-image)** — 4.1 → 4.2 → 4.3 → 4.4 → 4.5 → 4.6 → 4.7 → 4.8 → 4.10 → 4.14.
5. **Phase 5** — 5.1 → 5.2 → 5.3 → 5.4 → 5.7.
6. **Phase 4 (part B — image-dependent)** — 4.9 → 4.11 → 4.12 → 4.13 → 4.15, then 5.5 → 5.6 (interleaved: the Tiptap/Cover Image UI and its upload wiring naturally happen together).
7. **Phase 6** — 6.1 → 6.2 → 6.3 → 6.4 → 6.5 → 6.6.
8. **Phase 7** — 7.3 → 7.4 → 7.5 (independent polish tasks) → 7.1 → 7.2 (data wiring, 7.2 gated on clarification) → 7.6 (final pass, last).

This order front-loads the highest-risk/highest-uncertainty items (auth, the two validation levels, the atomic write pattern) before the more mechanical UI-polish work, and resolves the flagged Documentation Notes at the earliest point each one actually blocks a task rather than all at once up front.

---

## 5. Global Implementation Rules

**This section is the single, authoritative source for global implementation rules.** No phase file restates these — each phase file links back here instead. Non-negotiable constraints that hold across every phase — not phase-specific tasks, but boundaries no phase's implementation may cross:

- No JWT, no external session store, no database, no clustering, no load balancer, no Redis exists anywhere in the implementation (`03`, `05`).
- No Settings page, Profile page, multi-admin support, or role-based access control exists anywhere in the implementation (`03` §12; `06` §15; Documentation Note 6 above).
- Every write to `/content/articles.json` goes through the atomic write + serialization pattern — no direct `fs.writeFile`/`fs.promises.writeFile` call targeting that file should exist outside `/lib/modules/articles/service.ts`.
- Every uploaded image passes through the full Sharp pipeline — no code path should write to `/public/images/` outside `/lib/upload/`.
- `sanitize-html` runs on every code path that persists `content`, not just the primary editor save path (create and update both).
- Security headers (`06` §11) must not break Tiptap, shadcn/ui, or toast rendering.
- All six Documentation Notes in Section 3 above must be explicitly resolved (not just noted) before production — especially the cookie `SameSite` value (Note 2), the image size limit (Note 3), and the Media Library API contract (Note 4).
- `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` / `SESSION_SECRET` / `NEXT_PUBLIC_SITE_URL` must be provisioned in the production environment per the bootstrap process in `03-authentication.md` §9 (or the actual `07-environment-variables.md` once it's correctly supplied).

---

## 6. Development Conventions (Contract Quick-Reference)

Lookup table so individual phase/task documents don't need to re-quote the same doc sections.

| Concern | Decision | Source |
|---|---|---|
| Stack | Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, shadcn/ui | `01` §2 |
| Storage | JSON files under `/content`, images under `/public/images/{module}/{id-or-slug}/` | `02` §4, `04` §3–4 |
| Module contract | `/app/(admin)/admin/{module}`, `/app/api/admin/{module}`, `/lib/modules/{module}/{schema,service,types}.ts`, `/content/{module}.json`, `/public/images/{module}/` | `02` §6 |
| Auth | Single admin, bcrypt password, server-side session, signed HttpOnly cookie, no JWT, 7-day sliding expiration, 5-attempt/15-min lockout | `03` |
| Validation | Zod, same schema client+server, server is authoritative, two levels (draft-save / publish) | `06` §5, `17` |
| Sanitization | `sanitize-html` on `content` before persistence | `06` §6, `13` §10 |
| Image pipeline | `file-type` (magic-number) → Sharp (resize/compress/WebP) → save under system-generated filename | `06` §7, `14` §3 |
| API shape | REST-style Route Handlers under `/api/admin/`, standard success/error envelopes, fixed status/code table, pagination shape | `19` |
| Rendering | Public site SSG, `revalidatePath()` on-demand after Article write/publish/unpublish | `05` §6 |
| Deployment | Single Node.js process, no clustering/Redis, filesystem persistence | `05` §2–3 |

---

## 7. Verification Principles

### 7.1 Testing checkpoints after every phase

| After Phase | Checkpoint |
|---|---|
| 1 | Manually navigate every stubbed route; confirm shell isolation from the public site; confirm no filesystem access happens anywhere yet. |
| 2 | Run the full Phase 2 manual verification checklist (login, lockout, logout, middleware + API protection) before writing any Phase 4 code — auth bugs are much cheaper to catch before real data exists. |
| 3 | Render each shared component in isolation with mock data (a temporary throwaway test route is fine) and run the Phase 3 checklist; do not proceed to Phase 4 until Data Table and Form Components are confirmed genuinely generic. |
| 4 | Run the full Phase 4 manual verification checklist end-to-end, including the slug-collision and sanitization edge cases — these are the two most likely places for silent contract violations. |
| 5 | Run the Phase 5 manual verification checklist, specifically confirming the old-image-archival behavior and the path-traversal guard (attempt a manipulated `slug` value directly against the API). |
| 6 | Run the Phase 6 manual verification checklist, specifically the concurrent used/unused race-condition scenario described in Phase 6's risks. |
| 7 | Run the full `05-deployment.md` §14 production checklist as the final gate before considering v1 complete. |

### 7.2 Milestones

| Milestone | Definition of done |
|---|---|
| **M1 — Skeleton Live** | Phase 1 complete: shell, navigation, login UI, dashboard skeleton all render; no auth, no data yet. |
| **M2 — Secured** | Phase 2 complete: every admin route and API route is genuinely protected; login/logout/lockout all verified. |
| **M3 — Component Library Ready** | Phase 3 complete: every shared component verified generic and reusable via mock data. |
| **M4 — Articles Functional (text-only)** | Phase 4 part A complete: full CRUD + list + validation working without image support yet. |
| **M5 — Images Working** | Phase 5 complete and Phase 4 part B complete: cover/inline images, publish/unpublish, preview, and full delete (including image folder cleanup) all working end-to-end. |
| **M6 — Media Oversight Ready** | Phase 6 complete: Media Library browsing, usage detection, and protected deletion all verified. |
| **M7 — Production Ready** | Phase 7 complete: dashboard fully data-wired, security headers applied, accessibility/responsive audited, full production checklist passed. |

### 7.3 Final implementation checklist before production

Beyond the phase-level checklists above, before this is considered production-ready:

- [ ] Every rule in **Section 5, Global Implementation Rules** holds across the whole implementation (that section is the single source for these — not restated here to avoid drift between two copies).
- [ ] All six Documentation Notes in Section 3 above have been explicitly resolved (not just noted) — especially the cookie `SameSite` value (Note 2), the image size limit (Note 3), and the Media Library API contract (Note 4).
- [ ] The `05-deployment.md` §14 production checklist is fully green in the actual target hosting environment (not just locally).
- [ ] A fresh administrator bootstrap (Section 5 of the deployment doc) has been performed at least once end-to-end on the target environment, including a successful first login.
- [ ] Daily backups of `/content` and `/public/images` are confirmed configured and a restore has been test-run at least once, per `05-deployment.md` §11.

---

## 8. Documents Used by Each Phase

Which of the 20 architecture documents each phase's tasks cite (see Section 2 above for the document map). Listed for quick cross-referencing only — full citations with section numbers (`§`) live in each phase file.

| Phase | Documents cited |
|---|---|
| 1 — Foundation | 01, 02, 03, 05, 07, 08, 09, 10 |
| 2 — Authentication | 03, 05, 06, 10, 15, 19 |
| 3 — Shared Admin Components | 06, 08, 11 |
| 4 — Article CRUD | 02, 04, 05, 06, 11, 12, 13, 15, 16, 17, 19, 20 |
| 5 — Image Upload | 04, 05, 06, 13, 14, 17, 19, 20 |
| 6 — Media Library | 18, 19, 21 *(21 does not exist — see Documentation Note 4)* |
| 7 — Dashboard Polish & Production Readiness | 05, 06, 08, 09, 11, 13 |

---

## 9. Convention: How Phase Files Reference This Document

To keep this file the single place for cross-phase material, every phase file (`01-phase-1-foundation.md` etc.) follows the same referencing convention rather than restating content:

- **Documentation Notes / conflicts** relevant to a task → cite by number, pointing to §3 above (e.g. "see Documentation Note 2, §3").
- **Dependency on another phase's task** → cite the task ID and phase, pointing to §4 above for the full graph, rather than re-describing the dependency chain.
- **Global rules** (no JWT, no DB, atomic writes, sanitization, etc.) → not restated in any phase file; phase files link to §5 above.
- **Stack/storage/module-contract/auth/validation/etc. conventions** → not restated in any phase file; phase files link to §6 above when a task relies on one of these.
- **Phase-level and task-level verification** → each phase file keeps its own concrete checklist (phase-specific pass/fail items), but the *principles and checkpoints* for what "done" means across phases live in §7 above.
- Each phase file's opening note states which architecture documents it draws from (§2/§8 above) and that cross-phase material lives here.