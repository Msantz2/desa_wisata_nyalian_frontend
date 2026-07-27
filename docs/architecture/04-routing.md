# Routing Structure

## Overview

This document defines the routing architecture of the Nyalian Tourism Village Website.

The application uses the Next.js App Router.

All routes should follow RESTful and SEO-friendly URL conventions.

The routing structure should be simple, descriptive, and scalable.

---

# Route Overview

| Route | Description |
|---------|-------------|
| / | Home Page |
| /about | Village Profile |
| /destinations | Destination Listing |
| /destinations/[slug] | Destination Detail |
| /packages | Tourism Packages |
| /packages/[slug] | Package Detail |
| /articles | Blog & Articles |
| /articles/[slug] | Article Detail |
| /faq | Frequently Asked Questions |
| /contact | Contact Information |
| /404 | Custom Not Found Page |

---

# Home Page

Route

```text
/
```

Purpose

The homepage serves as the primary landing page and introduces visitors to Nyalian Tourism Village.

Main Sections

- Hero Section
- Village Highlights
- Featured Destinations
- Tourism Packages
- Gallery Preview
- Video Gallery Preview
- Visitor Reviews
- Latest Articles
- FAQ Preview
- Call To Action
- Footer

Data Source

- destinations.json
- packages.json
- reviews.json
- articles.json
- videos.json
- faq.json

SEO Priority

Highest

---

# Village Profile

Route

```text
/about
```

Purpose

Introduce Nyalian Village, its history, philosophy, culture, tourism potential, and vision.

Main Sections

- Village History
- Philosophy
- Vision & Mission
- Tourism Potential
- Culture
- Local Community
- Gallery
- Google Maps

Data Source

- village.json

SEO Priority

High

---

# Destination Listing

Route

```text
/destinations
```

Purpose

Display all tourism destinations.

Features

- Search
- Category Filter
- Facility Filter
- Sort
- Pagination

Display

Destination Cards

Data Source

- destinations.json

SEO Priority

High

---

# Destination Detail

Route

```text
/destinations/[slug]
```

Purpose

Display complete information about one destination.

Main Sections

- Hero Image
- Image Gallery
- Destination Overview
- Description
- Facilities
- Operating Hours
- Ticket Information
- Google Maps
- Video Gallery
- Related Destinations
- Share Buttons
- WhatsApp CTA

Data Source

- destinations.json

Dynamic Route

Yes

SEO Priority

Highest

---

# Tourism Packages

Route

```text
/packages
```

Purpose

Display available tourism packages.

Features

- Search
- Filter
- Sort
- Package Cards

Data Source

- packages.json

SEO Priority

High

---

# Package Detail

Route

```text
/packages/[slug]
```

Purpose

Display detailed tourism package information.

Main Sections

- Hero Image
- Overview
- Price
- Duration
- Capacity
- Facilities
- Itinerary
- Included
- Excluded
- Gallery
- WhatsApp Reservation CTA

Data Source

- packages.json

Dynamic Route

Yes

SEO Priority

High

---

# Articles

Route

```text
/articles
```

Purpose

Display tourism news and educational content.

Features

- Search
- Categories
- Latest Articles
- Popular Articles

Data Source

- articles.json

SEO Priority

Highest

---

# Article Detail

Route

```text
/articles/[slug]
```

Purpose

Display full article content.

Main Sections

- Cover Image
- Metadata
- Article Content
- Related Articles
- Share Buttons

Data Source

- articles.json

Dynamic Route

Yes

SEO Priority

Highest

---

# FAQ

Route

```text
/faq
```

Purpose

Help visitors quickly find answers.

Features

- Search
- Accordion
- Categories

Data Source

- faq.json

SEO Priority

Medium

---

# Contact

Route

```text
/contact
```

Purpose

Provide communication channels for visitors.

Main Sections

- Contact Information
- WhatsApp Button
- Google Maps
- Social Media
- Operating Hours

Data Source

- settings.json

SEO Priority

Medium

---

# Custom 404

Route

```text
/404
```

Purpose

Display a user-friendly page when a route is not found.

Include

- Illustration
- Helpful Message
- Back to Home Button
- Destination Shortcut

---

# Dynamic Routes

The following pages use dynamic routing.

```text
/destinations/[slug]

/packages/[slug]

/articles/[slug]
```

Slug Example

```text
/destinations/tukad-melangit

/packages/cultural-tour

/articles/best-time-to-visit-nyalian
```

Slug Requirements

- Lowercase
- Hyphen separated
- Unique
- SEO friendly

---

# Navigation Structure

Navbar

- Home
- Destinations
- Packages
- Articles
- About
- FAQ
- Contact

Footer

- Quick Links
- Contact
- Social Media
- Google Maps
- Copyright

---

# Route Metadata

Every page must include

- Title
- Description
- Open Graph Image
- Canonical URL
- Keywords
- Structured Data

---

# Route Loading

Every page should support

- Loading Skeleton
- Error State
- Empty State

---

# URL Guidelines

URLs must

- Use lowercase
- Avoid spaces
- Use hyphens instead of underscores
- Be descriptive
- Be human-readable

Good

```text
/destinations/nyalian-waterfall

/packages/bali-cultural-tour

/articles/local-festival-2026
```

Bad

```text
/destination?id=12

/package/001

/post123
```

---

# Route Security

Protected routes are not required in Version 1 because the website does not include an authentication system.

All pages are publicly accessible.

---

# Future Routes

Reserved for future development.

```text
/booking

/dashboard

/admin

/profile

/favorites

/search

/events
```

These routes should not be implemented in Version 1 but should remain compatible with the project architecture.