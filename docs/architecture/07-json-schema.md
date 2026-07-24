# JSON Data Schema

## Overview

This document defines the structure of every JSON file used in the Nyalian Tourism Village Website.

The website uses JSON as the only data source.

All content displayed on the website must originate from these JSON files.

Every JSON file should be strongly typed and validated using TypeScript interfaces.

---

## Related Architecture Documents

This document defines the canonical JSON schema used throughout the website. All content structures, modules, and content management processes MUST conform to the schemas defined here.

The following documents extend or consume these schemas:

- **08-content-management.md** — Defines how JSON content files are created, organized, validated, loaded, updated, and maintained throughout the project lifecycle.

Content modules using these schemas:

- **11-destination-module.md** — Defines the destination data model and consumes the Destination-related JSON schemas.
- **12-tour-package-module.md** — Defines the tour package data model and consumes the Tour Package JSON schemas.
- **13-blog-module.md** — Defines the blog article data model and consumes the Blog JSON schemas.
- **14-review-module.md** — Defines the review and testimonial data model and consumes the Review JSON schemas.
- **15-faq-module.md** — Defines the frequently asked questions data model and consumes the FAQ JSON schemas.
- **16-google-maps.md** — Defines map locations and geographic information that reference the shared JSON schema where applicable.
- **17-video-gallery.md** — Defines the video gallery data model and consumes the Video Gallery JSON schemas.
- **18-share-feature.md** — Defines social sharing metadata that references shared content structures defined by this document.

All modules MUST treat this document as the single source of truth for JSON schema definitions. Module-specific documents MAY extend the schema through additional constraints or usage rules but MUST NOT redefine or duplicate the schema itself.

---

# Data Directory

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

---

# destinations.json

Stores every tourism destination.

## Schema

```typescript
{
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;

  location: {
    village: string;
    district: string;
    regency: string;
    province: string;
    address: string;
    latitude: number;
    longitude: number;
  };

  images: string[];

  videos: string[];

  facilities: string[];

  operatingHours: {
    open: string;
    close: string;
  };

  ticketPrice: {
    adult: number;
    child: number;
  };

  rating: number;

  totalReviews: number;

  featured: boolean;
}
```

---

# packages.json

Stores tourism packages.

## Schema

```typescript
{
  id: string;
  slug: string;
  name: string;

  category: string;

  shortDescription: string;

  description: string;

  thumbnail: string;

  gallery: string[];

  price: number;

  duration: string;

  capacity: string;

  itinerary: string[];

  included: string[];

  excluded: string[];

  destinations: string[];

  rating: number;

  featured: boolean;
}
```

---

# articles.json

Stores blog articles.

## Schema

```typescript
{
  id: string;

  slug: string;

  title: string;

  excerpt: string;

  content: string;

  coverImage: string;

  category: string;

  author: string;

  publishedAt: string;

  tags: string[];

  featured: boolean;
}
```

---

# reviews.json

Stores visitor testimonials.

## Schema

```typescript
{
  id: string;

  visitorName: string;

  visitorCountry: string;

  avatar: string;

  rating: number;

  comment: string;

  visitDate: string;
}
```

---

# faq.json

Stores frequently asked questions.

## Schema

```typescript
{
  id: string;

  category: string;

  question: string;

  answer: string;
}
```

---

# videos.json

Stores tourism videos.

## Schema

```typescript
{
  id: string;

  title: string;

  description: string;

  thumbnail: string;

  youtubeId: string;

  category: string;
}
```

---

# navigation.json

Stores navigation menu.

## Schema

```typescript
{
  id: string;

  label: string;

  href: string;

  order: number;
}
```

---

# settings.json

Stores website configuration.

## Schema

```typescript
{
  siteName: string;

  tagline: string;

  description: string;

  email: string;

  phone: string;

  whatsapp: string;

  address: string;

  googleMapsEmbed: string;

  socialMedia: {

    instagram: string;

    facebook: string;

    youtube: string;

    tiktok: string;
  };
}
```

---

# village.json

Stores village profile.

## Schema

```typescript
{
  name: string;

  philosophy: string;

  history: string;

  vision: string;

  mission: string[];

  tourismPotential: string[];

  heroImage: string;

  gallery: string[];
}
```

---

# General Rules

Every JSON file must:

- Be UTF-8 encoded.
- Use camelCase for property names.
- Use lowercase filenames.
- Have unique IDs.
- Have unique slugs.
- Contain no duplicated data.
- Be human-readable.

---

# ID Convention

IDs should follow a consistent format.

Examples

```text
DST001

PKG001

ART001

FAQ001

REV001

VID001
```

---

# Slug Convention

Slugs should be:

- lowercase
- hyphen-separated
- unique
- SEO-friendly

Example

```text
tukad-melangit

cultural-tour-package

best-time-to-visit-nyalian
```

---

# Image Rules

All image paths should be relative.

Example

```text
/images/destinations/tukad-melangit/hero.jpg
```

Never store absolute URLs unless the image is hosted externally.

---

# Video Rules

Use YouTube IDs instead of full URLs.

Correct

```text
dQw4w9WgXcQ
```

Incorrect

```text
https://youtube.com/watch?v=dQw4w9WgXcQ
```

---

# Date Format

Use ISO 8601.

Example

```text
2026-07-18
```

---

# Currency

Store currency as numbers only.

Correct

```json
250000
```

Incorrect

```json
"Rp250.000"
```

Currency formatting should be handled in the frontend.

---

# Rating

Ratings use a 5-point scale.

```text
0.0

↓

5.0
```

Allow one decimal place.

Example

```text
4.8
```

---

# Naming Rules

Use descriptive names.

Correct

```text
Nyalian Waterfall
```

Avoid abbreviations.

---

# Data Relationships

```text
Package
    │
    ├── references
    ▼
Destination IDs

Destination
    │
    ├── references
    ▼
Video IDs

Homepage
    │
    ├── references
    ▼
Featured Destinations

Articles
    │
    ├── tags
    ▼
Categories
```

---

# Future Expansion

The schema is designed to support future additions without breaking existing data.

Possible future fields include:

- multilingual content
- weather information
- booking availability
- AI-generated summaries
- visitor statistics
- event schedules
- accessibility information

Backward compatibility should always be maintained.

## Schema Ownership

The JSON schemas defined in this document are the canonical data contracts for the project.

All feature modules MUST consume these schemas instead of redefining them.

Future modules SHOULD extend existing schemas whenever possible to preserve compatibility and maintain a single source of truth for the application's content model.