# Component Library Specification

## Overview

This document defines every reusable component used throughout the Nyalian Tourism Village Website.

The project follows a component-driven architecture.

Every UI element should be built from reusable components whenever possible.

Before creating a new component, always check whether an existing component can be reused.

---

# Component Principles

All components should be:

- Reusable
- Modular
- Responsive
- Accessible
- Lightweight
- Easy to maintain
- Strongly typed

Every component should have a single responsibility.

Avoid duplicate implementations.

---

# Component Categories

The component library is divided into the following categories.

- Layout Components
- Shared Components
- UI Components
- Home Components
- Destination Components
- Package Components
- Article Components
- Review Components
- FAQ Components
- Gallery Components
- Map Components
- Form Components

---

## Related Architecture Documents

This document defines the reusable UI component architecture used throughout the website. The following documents provide the architectural context that governs how these components are designed, composed, and used.

- **02-design-system.md** — Defines the project's visual design language, including color palette, typography, spacing, iconography, design tokens, and styling principles that every component MUST follow.

- **05-ui-pages.md** — Defines how reusable components are composed into complete application pages and describes the responsibility of each page within the website architecture.

- **22-ui-ux-rules.md** — Defines interaction patterns, accessibility requirements, responsive behavior, usability standards, and visual consistency rules that every component MUST comply with.

Components defined in this document MUST remain reusable, presentation-focused, and consistent with the Design System, page architecture, and UI/UX standards defined in the documents above.

---

# Layout Components

Layout components define the overall page structure.

## Navbar

Purpose

Display the main navigation.

Features

- Logo
- Navigation Links
- Mobile Menu
- Sticky Navigation

---

## Footer

Purpose

Display footer information.

Content

- Quick Links
- Contact Information
- Social Media
- Copyright

---

## MobileMenu

Purpose

Responsive navigation menu.

---

## Breadcrumb

Purpose

Display page hierarchy.

Example

```text
Home
>
Destinations
>
Tukad Melangit
```

---

## ScrollToTop

Purpose

Allow users to quickly return to the top of the page.

---

# Shared Components

Reusable across all pages.

## SectionTitle

Displays section headings.

Props

- title
- subtitle

---

## SectionContainer

Provides consistent spacing and width.

---

## EmptyState

Displayed when no content exists.

---

## ErrorState

Displayed when content fails to load.

---

## LoadingSkeleton

Displayed while loading data.

---

## Badge

Displays labels.

Examples

- Nature
- Culture
- Popular
- New

---

## SocialShare

Share page to:

- WhatsApp
- Facebook
- X
- Copy Link

---

## BackButton

Navigate to the previous page.

---

# UI Components

Generic UI components.

## Button

Variants

- Primary
- Secondary
- Outline
- Ghost

---

## Card

Base card component.

Used for:

- Destinations
- Packages
- Articles
- Reviews

---

## Input

Text input.

---

## SearchInput

Search field.

---

## Textarea

Multi-line input.

---

## Select

Dropdown component.

---

## Accordion

Expandable content.

Used by FAQ.

---

## Dialog

Modal window.

---

## Pagination

Navigation between pages.

---

## Tabs

Tabbed interface.

---

## Tooltip

Hover information.

---

## Skeleton

Loading placeholder.

---

# Home Components

Components used exclusively on the homepage.

## Hero

Main landing section.

Contains

- Background Image
- Heading
- Description
- CTA

---

## HighlightSection

Displays village advantages.

---

## FeaturedDestinations

Displays selected destinations.

---

## FeaturedPackages

Displays featured tourism packages.

---

## GalleryPreview

Homepage gallery.

---

## VideoPreview

Homepage video section.

---

## ReviewPreview

Homepage review section.

---

## ArticlePreview

Homepage article section.

---

## FAQPreview

Homepage FAQ section.

---

## CTASection

Final call-to-action section.

---

# Destination Components

## DestinationCard

Displays destination summary.

Content

- Image
- Name
- Category
- Short Description

---

## DestinationGrid

Responsive destination layout.

---

## DestinationInfo

Detailed destination information.

---

## FacilityList

Displays available facilities.

Examples

- Parking
- Toilet
- Restaurant
- Prayer Room

---

## DestinationGallery

Image gallery.

---

## DestinationVideo

Embedded destination videos.

---

## RelatedDestinations

Suggest similar destinations.

---

## DestinationMap

Google Maps section.

---

## DestinationHeader

Hero section for destination detail.

---

# Package Components

## PackageCard

Displays package summary.

---

## PackageGrid

Responsive package layout.

---

## PackageInfo

Detailed package information.

---

## PackagePrice

Pricing information.

---

## PackageFacilities

Displays included facilities.

---

## ItineraryTimeline

Displays travel itinerary.

---

## ReservationCTA

WhatsApp reservation button.

---

# Article Components

## ArticleCard

Displays article summary.

---

## ArticleGrid

Responsive article layout.

---

## ArticleHeader

Article hero section.

---

## ArticleContent

Markdown content renderer.

---

## RelatedArticles

Suggest related content.

---

# Review Components

## ReviewCard

Displays visitor testimonial.

---

## ReviewCarousel

Carousel of reviews.

---

## RatingSummary

Displays average rating.

---

# FAQ Components

## FAQAccordion

Expandable FAQ list.

---

## FAQSearch

Search FAQ.

---

## FAQCategory

Category selector.

---

# Gallery Components

## ImageGallery

Responsive gallery.

---

## Lightbox

Fullscreen image viewer.

---

## VideoGallery

Displays tourism videos.

---

## VideoCard

Individual video item.

---

# Map Components

## GoogleMap

Embedded map.

---

## DirectionButton

Open Google Maps navigation.

---

## LocationInfo

Displays address and coordinates.

---

# Form Components

## SearchForm

Search destinations.

---

## ReservationForm

Collect booking information.

---

## ContactCard

Displays contact information.

---

# Component Props

Every component should define:

- Interface
- Props
- Default values
- Optional properties

Use TypeScript interfaces.

Avoid using `any`.

---

# Component Naming

Use PascalCase.

Examples

```text
DestinationCard.tsx

Hero.tsx

SectionTitle.tsx

PackageCard.tsx
```

---

# Styling Rules

Every component should follow the Design System.

Use:

- Tailwind CSS
- Consistent spacing
- Consistent typography
- Consistent colors

Avoid inline styling.

---

# Accessibility

Every interactive component should support:

- Keyboard navigation
- Focus state
- Screen readers

Buttons must include accessible labels.

Images must include descriptive alt text.

---

# Responsive Behavior

Every component should work on:

- Mobile
- Tablet
- Laptop
- Desktop

Mobile-first implementation is required.

---

# Reusability Rules

Before creating a new component:

1. Check whether an existing component already solves the problem.

2. Extend existing components before creating new ones.

3. Avoid duplicate UI implementations.

---

# Component Composition

Pages should be composed from reusable components.

Example

```text
Home Page

Navbar

↓

Hero

↓

HighlightSection

↓

FeaturedDestinations

↓

FeaturedPackages

↓

GalleryPreview

↓

VideoPreview

↓

ReviewPreview

↓

ArticlePreview

↓

FAQPreview

↓

CTASection

↓

Footer
```

---

# Future Components

Reserved for future development.

Examples

- AIChatWidget
- BookingCalendar
- EventTimeline
- FavoriteButton
- WeatherWidget
- AnalyticsDashboard

These components should be designed to integrate with the existing architecture without major refactoring.