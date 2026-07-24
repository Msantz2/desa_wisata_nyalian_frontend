# Tour Package Module Specification

## Overview

The Tour Package Module manages all tourism packages offered by Nyalian Tourism Village.

Its primary purpose is to help visitors understand the available travel experiences, compare package options, and contact the tourism administrator for reservations.

All package information is loaded from JSON files.

## Related Architecture Documents

This document defines the Tour Package module architecture.

Related documents:

- 07-json-schema.md
- 08-content-management.md
- 09-features.md
- 10-search-filter.md
- 18-share-feature.md

Tour Packages MAY reference Destination content but MUST remain an independent module.

---

# Module Goals

The Tour Package Module should allow visitors to:

- Explore available tourism packages
- Search packages
- Filter packages
- Compare package information
- View detailed itineraries
- Understand pricing and inclusions
- Discover destinations included in each package
- Contact the administrator via WhatsApp

---

# Module Architecture

```text
Tour Package Module

│

├── Package Listing

├── Package Detail

├── Search

├── Filter

├── Sorting

├── Itinerary

├── Gallery

├── Included Services

├── Excluded Services

├── Related Packages

└── WhatsApp CTA
```

---

# Data Source

```text
data/packages/packages.json
```

Referenced Data

```text
data/destinations/destinations.json
```

Packages reference destination IDs instead of duplicating destination information.

---

# Route Structure

Package Listing

```text
/packages
```

Package Detail

```text
/packages/[slug]
```

Example

```text
/packages/cultural-tour-package
```

---

# Package Listing

Purpose

Display all available tourism packages.

Features

- Search
- Category Filter
- Duration Filter
- Price Filter
- Sorting
- Pagination

---

# Package Card

Each package card displays

- Thumbnail
- Package Name
- Category
- Short Description
- Duration
- Starting Price
- Rating
- Featured Badge (optional)

Clicking the card opens

```text
/packages/[slug]
```

---

# Package Detail

Purpose

Provide complete information about a tourism package.

---

# Package Detail Layout

```text
Hero Banner

↓

Breadcrumb

↓

Package Overview

↓

Price Information

↓

Duration & Capacity

↓

Package Highlights

↓

Included Services

↓

Excluded Services

↓

Itinerary Timeline

↓

Included Destinations

↓

Gallery

↓

Related Packages

↓

Share

↓

WhatsApp CTA
```

---

# Hero Banner

Content

- Hero Image
- Package Name
- Category
- Duration
- Starting Price

---

# Package Overview

Displays

- Package Name
- Short Description
- Category
- Rating
- Duration
- Capacity

---

# Price Information

Display

- Starting Price
- Currency
- Notes

Example

```text
Starting from

Rp 250,000 / person
```

Currency formatting should be handled in the frontend.

---

# Duration

Examples

```text
Half Day

Full Day

2 Days 1 Night
```

---

# Capacity

Examples

```text
1–5 People

6–10 People

10–20 People
```

---

# Package Highlights

Display key selling points.

Examples

- Traditional Balinese Experience
- Local Guide
- Scenic Rice Terraces
- Authentic Village Activities

---

# Included Services

Examples

- Tour Guide
- Entrance Tickets
- Lunch
- Transportation
- Mineral Water
- Documentation

---

# Excluded Services

Examples

- Personal Expenses
- Accommodation
- Insurance
- Dinner

---

# Itinerary Timeline

Display activities in chronological order.

Example

```text
08:00

Meet at Nyalian Village

↓

09:00

Visit Waterfall

↓

11:00

Traditional Craft Workshop

↓

13:00

Lunch

↓

15:00

Rice Field Trekking
```

Use a vertical timeline component.

---

# Included Destinations

Display destinations referenced by ID.

Each destination should appear as a clickable card.

Click

↓

Navigate to

```text
/destinations/[slug]
```

---

# Gallery

Responsive image gallery.

Supports

- Grid
- Lightbox
- Lazy Loading

---

# Related Packages

Display

3–4 similar packages.

Similarity based on

- Category
- Duration
- Featured Status

---

# Social Sharing

Supported platforms

- WhatsApp
- Facebook
- X
- Copy Link

---

# WhatsApp CTA

Button

```text
Book This Package
```

or

```text
Contact via WhatsApp
```

Example pre-filled message

```text
Hello,

I am interested in the Cultural Tour Package.

Could you please provide more information?

Thank you.
```

---

# Search

Search fields

- Package Name
- Category
- Description

Search should be

- Case-insensitive
- Instant
- Client-side

---

# Filters

Supported filters

Category

Examples

- Nature Tour
- Cultural Tour
- Educational Tour
- Adventure Tour

---

Duration

Examples

- Half Day
- Full Day
- Multi-Day

---

Price Range

Examples

- Budget
- Standard
- Premium

---

Featured

Values

- Featured
- All

---

# Sorting

Supported

- Featured
- Lowest Price
- Highest Price
- Alphabetical

---

# Pagination

Recommended

6 packages per page.

---

# Loading State

Display

Package Skeleton Cards

Avoid blank pages.

---

# Empty State

Display

Illustration

Heading

```text
No packages found.
```

Button

```text
Clear Filters
```

---

# Error State

Handle

- Missing JSON
- Invalid Slug
- Missing Images

Display user-friendly messages.

---

# SEO

Each package page should generate

Title

Example

```text
Cultural Tour Package | Nyalian Tourism Village
```

Meta Description

Open Graph Image

Canonical URL

Structured Data

---

# Accessibility

Support

- Keyboard Navigation
- Screen Readers
- Semantic HTML
- Focus Indicators

All buttons must include accessible labels.

---

# Performance

Implement

- Static Rendering
- Lazy Loading
- Image Optimization
- Dynamic Metadata

---

# Responsive Layout

Desktop

```text
Two-column layout
```

Tablet

```text
Adaptive layout
```

Mobile

```text
Single-column layout
```

---

# Component Structure

```text
PackagePage

│

├── HeroBanner

├── Breadcrumb

├── PackageOverview

├── PriceCard

├── HighlightList

├── IncludedServices

├── ExcludedServices

├── ItineraryTimeline

├── DestinationList

├── Gallery

├── RelatedPackages

├── SocialShare

└── WhatsAppCTA
```

---

# Data Flow

```text
Load packages.json

↓

Validate Slug

↓

Load Package

↓

Resolve Destination IDs

↓

Load Destination Data

↓

Render Page

↓

Display CTA
```

---

# Future Enhancements

Possible future features

- Booking Calendar
- Seasonal Pricing
- Package Comparison
- Discount Campaigns
- Promotional Badges
- Availability Status
- Customer Reviews
- Multi-language Support

These features should integrate without changing the existing module architecture.

---

# Module Principles

The Tour Package Module should always prioritize

- Clear pricing
- Easy comparison
- Transparent information
- Strong visual presentation
- Fast performance
- Accessibility
- SEO
- Reusability
- Scalability

Package information should complement destination information rather than duplicate it.