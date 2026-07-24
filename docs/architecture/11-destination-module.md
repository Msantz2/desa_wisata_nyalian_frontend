# Destination Module Specification

## Overview

The Destination Module is the core feature of the Nyalian Tourism Village Website.

Its purpose is to provide visitors with complete information about every tourism destination available in Nyalian Village.

This module is designed to be reusable, scalable, SEO-friendly, and easy to maintain.

All destination data is loaded from JSON files.

## Related Architecture Documents

This document defines the Destination module architecture.

The following documents provide supporting architecture for this module:

- **07-json-schema.md** — Defines the canonical JSON schema used by destination content.
- **08-content-management.md** — Defines the shared content lifecycle and management workflow.
- **09-features.md** — Defines the functional requirements implemented by this module.
- **10-search-filter.md** — Defines search, filtering, and discovery behavior for destination content.
- **14-review-module.md** — Defines visitor review functionality associated with destinations.
- **16-google-maps.md** — Defines geographic location and map integration for destinations.
- **18-share-feature.md** — Defines social sharing behavior and metadata generation.

The Destination module MUST remain consistent with these supporting architecture documents.

---

# Module Goals

The Destination Module should allow visitors to:

- Explore destinations
- Search destinations
- Filter destinations
- View detailed information
- Browse galleries
- Watch videos
- Open Google Maps
- Share destinations
- Contact administrators via WhatsApp

---

# Module Architecture

```text
Destination Module

│

├── Destination Listing

├── Destination Detail

├── Search

├── Filter

├── Gallery

├── Videos

├── Google Maps

├── Related Destinations

├── Share

└── WhatsApp CTA
```

---

# Data Source

```text
data/destinations.json
```

Optional supporting data

```text
data/videos.json

data/reviews.json
```

---

# Route Structure

Listing Page

```text
/destinations
```

Detail Page

```text
/slug
/destinations/[slug]
```

Example

```text
/destinations/tukad-melangit
```

---

# Destination Listing

Purpose

Display all available tourism destinations.

Features

- Responsive Grid
- Search
- Category Filter
- Facility Filter
- Sorting
- Pagination

---

# Destination Card

Each destination card should display

- Thumbnail
- Name
- Category
- Short Description
- Rating
- Location
- Featured Badge (optional)

Card click

↓

Navigate to

```text
/destinations/[slug]
```

---

# Destination Detail

Purpose

Provide complete information about a destination.

---

# Destination Detail Layout

```text
Hero Banner

↓

Breadcrumb

↓

Overview

↓

Description

↓

Facilities

↓

Operating Hours

↓

Ticket Information

↓

Gallery

↓

Video Gallery

↓

Google Maps

↓

Related Destinations

↓

Share

↓

WhatsApp CTA
```

---

# Hero Banner

Content

- Hero Image
- Destination Name
- Category
- Rating

Optional

Background overlay.

---

# Overview Section

Displays

- Name
- Category
- Short Description
- Location
- Rating

---

# Description

Displays

Complete destination information.

Supports

- Paragraphs
- Lists

---

# Facilities

Display as badges or icons.

Examples

- Parking

- Toilet

- Restaurant

- Prayer Room

- Viewing Deck

- Guide

---

# Operating Hours

Example

```text
Monday - Sunday

08:00 - 18:00
```

---

# Ticket Information

Display

Adult

Child

Free Entry (if applicable)

Currency formatting handled by frontend.

---

# Gallery

Responsive image gallery.

Supports

- Grid
- Lightbox
- Lazy Loading

---

# Video Gallery

Display YouTube videos.

Information

- Thumbnail
- Title

Videos should be embedded.

---

# Google Maps

Display

- Interactive Map
- Address
- Coordinates
- Open in Google Maps Button

---

# Related Destinations

Display 3–4 similar destinations.

Similarity may be determined by

- Category
- Nearby Location
- Featured Status

---

# Social Sharing

Allow visitors to share.

Platforms

- WhatsApp
- Facebook
- X
- Copy Link

---

# WhatsApp CTA

Button

```text
Book Now
```

or

```text
Contact via WhatsApp
```

Pre-filled message

Example

```text
Hello,

I would like more information about Tukad Melangit.

Thank you.
```

---

# Search

Search fields

- Name
- Category
- Description

Case-insensitive.

---

# Filters

Supported

Category

Facilities

Featured

---

# Sorting

Supported

- Featured

- Alphabetical

- Highest Rating

---

# Pagination

Recommended

9 destinations per page.

---

# Loading State

Display

Skeleton Cards

Avoid blank pages.

---

# Empty State

Illustration

Heading

```text
No destinations found.
```

Button

```text
Reset Filters
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

Each destination page should generate

Title

Example

```text
Tukad Melangit | Nyalian Tourism Village
```

Description

Open Graph Image

Canonical URL

Structured Data

---

# Accessibility

Support

- Keyboard Navigation

- Screen Readers

- Alt Text

- Semantic HTML

---

# Performance

Implement

- Lazy Loading Images

- Image Optimization

- Static Rendering

- Dynamic Metadata

---

# Responsive Layout

Desktop

```text
2-column layout
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
DestinationPage

│

├── HeroBanner

├── Breadcrumb

├── DestinationInfo

├── FacilityList

├── TicketCard

├── Gallery

├── VideoGallery

├── GoogleMap

├── RelatedDestinations

├── SocialShare

└── WhatsAppCTA
```

---

# Data Flow

```text
JSON

↓

Load Data

↓

Validate Slug

↓

Render Page

↓

Load Gallery

↓

Load Videos

↓

Load Related Destinations

↓

Display CTA
```

---

# Future Enhancements

The module is designed to support future features.

Possible additions

- Visitor Statistics
- Live Weather
- Accessibility Information
- Audio Guide
- AR Navigation
- Favorite Destinations
- Nearby Attractions
- Event Schedule

Future features should integrate without changing the current module architecture.

---

# Module Principles

The Destination Module should always prioritize:

- Rich visual presentation
- Clear information hierarchy
- Fast performance
- Responsive design
- Accessibility
- SEO
- Reusability
- Scalability

All destination-related functionality should remain encapsulated within this module.