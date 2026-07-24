# UI Pages Specification

## Overview

This document defines the structure, layout, and user interface specifications for every page in the Nyalian Tourism Village Website.

Each page should follow the same design system and maintain visual consistency throughout the website.

All pages should prioritize:

- Responsive Design
- Accessibility
- SEO
- Performance
- User Experience

---

## Related Architecture Documents

This document defines the application's page structure and user-facing interface. The following documents provide the supporting architecture required to implement these pages consistently:

- **06-components.md** — Defines the reusable UI components, shared layouts, and component composition used to build each page described in this document.

- **09-features.md** — Defines the functional behavior, business capabilities, and user interactions implemented by the pages documented here.

- **22-ui-ux-rules.md** — Defines the visual consistency, interaction patterns, accessibility requirements, responsive behavior, and user experience guidelines that every page MUST follow.

All page implementations MUST remain consistent with the component architecture, feature specifications, and UI/UX standards defined in the documents above.

---

# Home Page

Route

```text
/
```

## Purpose

Introduce Nyalian Tourism Village and encourage visitors to explore destinations and tourism packages.

## Layout

1. Navbar
2. Hero Section
3. Village Highlights
4. Featured Destinations
5. Featured Tourism Packages
6. Image Gallery
7. Video Gallery
8. Visitor Reviews
9. Latest Articles
10. FAQ Preview
11. Call To Action
12. Footer

## Components

- Navbar
- Hero
- HighlightCard
- DestinationCard
- PackageCard
- GalleryCarousel
- VideoCarousel
- ReviewCarousel
- ArticleCard
- FAQAccordion
- CTASection
- Footer

## Data Source

- destinations.json
- packages.json
- reviews.json
- articles.json
- videos.json
- faq.json

---

# About Page

Route

```text
/about
```

## Purpose

Provide information about Nyalian Village.

## Sections

- Hero Banner
- Village History
- Village Philosophy
- Vision & Mission
- Tourism Potential
- Cultural Heritage
- Photo Gallery
- Google Maps
- CTA

## Components

- HeroBanner
- SectionTitle
- ImageGallery
- GoogleMap
- CTASection

## Data Source

- village.json

---

# Destination Listing

Route

```text
/destinations
```

## Purpose

Display every tourism destination.

## Features

- Search
- Category Filter
- Facility Filter
- Sort
- Pagination

## Layout

1. Page Header
2. Search Bar
3. Filter Sidebar
4. Destination Grid
5. Pagination

## Components

- SearchBar
- FilterSidebar
- DestinationGrid
- DestinationCard
- Pagination

## Data Source

- destinations.json

---

# Destination Detail

Route

```text
/destinations/[slug]
```

## Purpose

Provide complete destination information.

## Layout

1. Hero Image
2. Breadcrumb
3. Destination Information
4. Description
5. Facilities
6. Operating Hours
7. Ticket Information
8. Image Gallery
9. Video Gallery
10. Google Maps
11. Related Destinations
12. Share Buttons
13. WhatsApp CTA

## Components

- HeroBanner
- Breadcrumb
- DestinationInfo
- FacilityList
- Gallery
- VideoGallery
- GoogleMap
- RelatedDestinations
- SocialShare
- ReservationCTA

## Data Source

- destinations.json

---

# Tourism Package Listing

Route

```text
/packages
```

## Purpose

Display all tourism packages.

## Features

- Search
- Filter
- Sort
- Pagination

## Layout

1. Page Header
2. Search
3. Package Grid
4. Pagination

## Components

- SearchBar
- PackageGrid
- PackageCard
- Pagination

## Data Source

- packages.json

---

# Tourism Package Detail

Route

```text
/packages/[slug]
```

## Purpose

Display complete tourism package information.

## Sections

- Hero Image
- Overview
- Price
- Duration
- Capacity
- Included
- Excluded
- Itinerary
- Gallery
- Reservation CTA

## Components

- PackageHero
- PackageInfo
- Itinerary
- Gallery
- ReservationCTA

## Data Source

- packages.json

---

# Articles

Route

```text
/articles
```

## Purpose

Display tourism-related articles.

## Features

- Search
- Categories
- Pagination

## Layout

1. Hero
2. Search
3. Categories
4. Article Grid
5. Pagination

## Components

- SearchBar
- CategoryFilter
- ArticleGrid
- ArticleCard
- Pagination

## Data Source

- articles.json

---

# Article Detail

Route

```text
/articles/[slug]
```

## Purpose

Display article content.

## Layout

1. Cover Image
2. Article Metadata
3. Article Content
4. Share Buttons
5. Related Articles

## Components

- ArticleHeader
- ArticleContent
- SocialShare
- RelatedArticles

## Data Source

- articles.json

---

# FAQ

Route

```text
/faq
```

## Purpose

Help visitors quickly find answers.

## Features

- Search
- Categories
- Accordion

## Layout

1. Hero
2. Search
3. Category Filter
4. FAQ Accordion

## Components

- FAQSearch
- FAQCategory
- FAQAccordion

## Data Source

- faq.json

---

# Plan Your Visit

Route

```text
/plan-your-visit
```

## Purpose

Help visitors prepare before visiting Nyalian Tourism Village.

## Sections

- Google Maps
- Transportation
- Directions
- Opening Hours
- Best Time to Visit
- Things to Bring
- Contact Information
- WhatsApp CTA

## Components

- GoogleMap
- DirectionCard
- InformationCard
- CTASection

## Data Source

- settings.json

---

# Common Page Structure

Every page should follow this structure.

```text
Navbar

↓

Page Header

↓

Main Content

↓

Call To Action

↓

Footer
```

---

# Common Components

Every page should reuse existing components whenever possible.

Examples:

- Navbar
- Footer
- SectionTitle
- Button
- Card
- Badge
- Breadcrumb
- Pagination
- GoogleMap
- Gallery
- Share Buttons

Avoid creating duplicate components.

---

# Responsive Behavior

Desktop

- Multi-column layout

Tablet

- Adaptive grid

Mobile

- Single-column layout

The layout should always be mobile-first.

---

# Loading States

Every page should provide:

- Loading Skeleton
- Empty State
- Error State

Loading should never display a blank page.

---

# SEO Requirements

Every page must include:

- Unique Title
- Meta Description
- Open Graph Image
- Canonical URL
- Structured Data
- Alt Text

---

# Accessibility

All pages must support:

- Keyboard navigation
- Screen readers
- Proper heading hierarchy
- Semantic HTML
- Focus indicators

---

# Page Transition

Use subtle page transitions.

Recommended:

- Fade
- Slide Up

Animation duration:

200–300ms

Avoid distracting animations.

---

# Reusability

Each page should be composed of reusable components.

Business logic should remain separate from presentation.

No page should duplicate component implementations.

Always reuse existing components whenever possible.