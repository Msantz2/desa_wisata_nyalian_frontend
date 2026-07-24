# Folder Structure

## Overview

This document defines the directory structure for the Nyalian Tourism Village Website.

The project follows the Next.js App Router architecture with a feature-oriented organization.

The folder structure should prioritize:

- Scalability
- Readability
- Reusability
- Maintainability
- Separation of concerns

Every file should have a clear responsibility.

---

# Root Structure

```text
nyalian-tourism-village/
│
├── app/
├── components/
├── data/
├── hooks/
├── lib/
├── public/
├── styles/
├── types/
├── utils/
├── docs/
│
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── README.md
```
---

# Related Architecture Documents

This document defines where files and modules are located within the project. The following documents describe how those directories are used during implementation:

- **04-routing.md** — Defines the application's routing architecture, route hierarchy, URL conventions, and navigation flow for pages located within the project structure.
- **06-components.md** — Defines the reusable UI components, shared component organization, and component responsibilities referenced by the directory structure.
- **08-content-management.md** — Defines how JSON content files are organized, managed, loaded, and maintained within the project's content directories.

The folder structure defined in this document MUST remain consistent with the routing, component organization, and content management architecture described in the documents above.

---

# app/

Contains all application routes using the Next.js App Router.

```text
app/
│
├── layout.tsx
├── page.tsx
├── loading.tsx
├── not-found.tsx
├── globals.css
│
├── about/
│   └── page.tsx
│
├── destinations/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
│
├── packages/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
│
├── articles/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
│
├── faq/
│   └── page.tsx
│
└── plan-your-visit/
    └── page.tsx
```

Responsibilities:

- Routing
- Metadata
- Layout
- Page composition

Business logic should not be placed here.

---

# components/

Contains reusable UI components.

```text
components/
│
├── layout/
│
├── ui/
│
├── home/
│
├── destination/
│
├── package/
│
├── article/
│
├── review/
│
├── faq/
│
├── gallery/
│
├── maps/
│
├── shared/
│
└── forms/
```

Every component should be reusable.

Avoid page-specific components unless necessary.

---

# components/layout/

Application layout.

```text
layout/

Navbar.tsx

Footer.tsx

MobileMenu.tsx

ScrollToTop.tsx

Breadcrumb.tsx
```

---

# components/ui/

Generic UI components.

```text
ui/

Button.tsx

Card.tsx

Badge.tsx

Input.tsx

Textarea.tsx

Dialog.tsx

Accordion.tsx

Tabs.tsx

Pagination.tsx

Skeleton.tsx

Loading.tsx
```

Prefer using shadcn/ui components.

---

# components/home/

Homepage sections.

```text
Hero.tsx

Highlights.tsx

FeaturedDestinations.tsx

PackagePreview.tsx

GalleryPreview.tsx

VideoPreview.tsx

ReviewPreview.tsx

ArticlePreview.tsx

FAQPreview.tsx

CTASection.tsx
```

---

# components/destination/

Destination-related components.

```text
DestinationCard.tsx

DestinationGrid.tsx

DestinationGallery.tsx

DestinationInfo.tsx

FacilityList.tsx

MapSection.tsx

VideoSection.tsx

ShareButtons.tsx

RelatedDestinations.tsx

SearchBar.tsx

FilterSidebar.tsx
```

---

# components/package/

Tourism package components.

```text
PackageCard.tsx

PackageGrid.tsx

PackageInfo.tsx

PackagePrice.tsx

PackageGallery.tsx

Itinerary.tsx

ReservationCTA.tsx
```

---

# components/article/

Article components.

```text
ArticleCard.tsx

ArticleGrid.tsx

ArticleContent.tsx

ArticleMetadata.tsx

RelatedArticles.tsx
```

---

# components/review/

Review components.

```text
ReviewCard.tsx

ReviewCarousel.tsx

RatingSummary.tsx
```

---

# components/faq/

FAQ components.

```text
FAQAccordion.tsx

FAQSearch.tsx

FAQCategory.tsx
```

---

# components/gallery/

Gallery components.

```text
ImageGallery.tsx

VideoGallery.tsx

Lightbox.tsx
```

---

# components/maps/

Google Maps components.

```text
GoogleMap.tsx

MapEmbed.tsx

DirectionButton.tsx
```

---

# components/shared/

Shared reusable components.

```text
SectionTitle.tsx

EmptyState.tsx

ErrorState.tsx

SocialShare.tsx

BackButton.tsx

SectionContainer.tsx
```

---

# components/forms/

Form components.

```text
SearchForm.tsx

ContactForm.tsx

ReservationForm.tsx
```

---

# data/

Contains all JSON files.

```text
data/

destinations.json

packages.json

articles.json

reviews.json

faq.json

videos.json

navigation.json

settings.json

village.json
```

The project uses JSON as the primary data source.

No database is used.

---

# hooks/

Reusable React hooks.

```text
hooks/

useSearch.ts

useFilter.ts

usePagination.ts

useWindowSize.ts

useScroll.ts
```

Custom hooks should be lightweight.

---

# lib/

Application libraries and helper modules.

```text
lib/

constants.ts

metadata.ts

navigation.ts

maps.ts
```

Avoid placing UI logic here.

---

# public/

Static assets.

```text
public/

images/

videos/

icons/

logo/

favicon.ico
```

Public assets should be optimized before deployment.

---

# styles/

Global styling.

```text
styles/

animations.css

utilities.css
```

Avoid large CSS files.

Tailwind should handle most styling.

---

# types/

Shared TypeScript types.

```text
types/

destination.ts

package.ts

article.ts

review.ts

faq.ts

video.ts

navigation.ts

settings.ts
```

Keep interfaces centralized.

---

# utils/

Reusable utility functions.

```text
utils/

formatCurrency.ts

formatDate.ts

generateSlug.ts

filterData.ts

searchData.ts

shareLink.ts
```

Utility functions should remain pure.

---

# docs/

Project documentation.

```text
docs/

00-project-overview.md

01-tech-stack.md

02-design-system.md

03-folder-structure.md

04-routing.md

05-ui-pages.md

06-components.md

07-json-schema.md

08-content-management.md

09-features.md

21-coding-guidelines.md

22-ui-ux-rules.md

prompt.md
```

AI assistants should use these files as the primary project reference.

---

# Naming Convention

Folders

```text
lowercase
```

Examples

```text
components

hooks

utils
```

---

Files

Use PascalCase for React components.

```text
DestinationCard.tsx

Hero.tsx

Navbar.tsx
```

Use camelCase for utility files.

```text
formatDate.ts

searchData.ts
```

Use lowercase for JSON files.

```text
destinations.json

packages.json
```

---

# Import Rules

Prefer absolute imports.

Example

```typescript
import DestinationCard from "@/components/destination/DestinationCard";
```

Avoid deep relative imports.

Bad

```typescript
../../../components/
```

---

# File Responsibility

Each file should have a single responsibility.

Examples:

- One component per file
- One hook per file
- One utility function per file
- One type per file

Avoid creating large files with multiple unrelated responsibilities.

---

# Project Architecture Principles

The folder structure should always prioritize:

- Modularity
- Reusability
- Scalability
- Simplicity
- Clean organization

New features should integrate into the existing structure without requiring major architectural changes.