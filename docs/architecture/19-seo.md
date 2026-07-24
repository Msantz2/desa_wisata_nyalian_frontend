# SEO Specification

## Overview

Search Engine Optimization (SEO) is a core requirement of the Nyalian Tourism Village Website.

The objective is to improve visibility on search engines, attract more visitors, and provide rich search results.

The website should follow modern SEO best practices while maintaining excellent performance.

## Related Architecture Documents

This document defines the SEO architecture for the website.

The following modules provide the primary SEO content:

- **11-destination-module.md** — Destination metadata and structured content.
- **12-tour-package-module.md** — Tour package metadata and discoverability.
- **13-blog-module.md** — Blog articles, structured content, and organic search strategy.

All SEO rules defined in this document MUST be implemented consistently across these modules.

---

# SEO Goals

The website should

- Rank for tourism-related keywords
- Improve local search visibility
- Generate rich search results
- Increase organic traffic
- Improve click-through rate (CTR)

---

# SEO Architecture

```text
SEO

│

├── Metadata

├── Structured Data

├── Sitemap

├── Robots

├── Canonical URL

├── Open Graph

├── Twitter Card

├── Image SEO

├── Local SEO

└── Performance
```

---

# Metadata

Every page must generate unique metadata.

Required fields

- Title
- Description
- Keywords
- Canonical URL

Example

```text
Title

Tukad Melangit | Nyalian Tourism Village

Description

Discover the beauty of Tukad Melangit, one of the most scenic natural attractions in Nyalian Tourism Village, Bali.
```

---

# Title Guidelines

Titles should

- Be unique
- Include important keywords
- Stay under 60 characters

Example

```text
Nyalian Tourism Village | Explore Nature & Culture
```

---

# Meta Description

Descriptions should

- Be unique
- Stay under 160 characters
- Encourage clicks

Avoid duplicate descriptions.

---

# Canonical URL

Every page should include a canonical URL.

Example

```text
https://nyalian-tourism.com/destinations/tukad-melangit
```

Canonical URLs prevent duplicate content issues.

---

# Open Graph

Required properties

- og:title
- og:description
- og:image
- og:url
- og:type

Example

```text
og:type = website
```

Article pages should use

```text
article
```

---

# Twitter Card

Support

```text
summary_large_image
```

Required

- Title
- Description
- Image

---

# Favicon

Include

- favicon.ico
- apple-touch-icon
- manifest.webmanifest

Support all major platforms.

---

# Sitemap

Generate automatically.

Example

```text
/

/destinations

/packages

/articles

/faq

/videos

/destinations/[slug]

/packages/[slug]

/articles/[slug]
```

The sitemap should update whenever content changes.

---

# Robots.txt

Allow search engines to crawl public pages.

Disallow

- Development routes
- Temporary pages

Example

```text
User-agent: *

Allow: /

Sitemap:

https://nyalian-tourism.com/sitemap.xml
```

---

# Structured Data

Implement JSON-LD.

Supported schemas

- Organization
- TouristDestination
- TouristAttraction
- Article
- FAQPage
- BreadcrumbList
- VideoObject
- AggregateRating

---

# Organization Schema

Include

- Name
- Logo
- Website
- Address
- Contact
- Social Media

---

# Tourist Attraction Schema

Destination pages should include

- Name
- Description
- Image
- Address
- Coordinates

---

# Article Schema

Article pages should include

- Headline
- Author
- Publish Date
- Cover Image

---

# FAQ Schema

FAQ pages should generate

FAQPage schema.

---

# Breadcrumb Schema

All detail pages should generate

BreadcrumbList schema.

Example

```text
Home

↓

Destinations

↓

Tukad Melangit
```

---

# Video Schema

Video pages should generate

VideoObject schema.

Include

- Thumbnail
- Duration
- Publish Date

---

# Aggregate Rating

Destination pages may include

AggregateRating schema.

Only use authentic review data.

---

# Local SEO

Display

- Village Address
- Phone Number
- Email
- Google Maps
- Opening Hours

Ensure consistency across all pages.

---

# Image SEO

Every image should include

- Alt Text
- Width
- Height

Image filenames should be descriptive.

Good

```text
tukad-melangit-waterfall.jpg
```

Bad

```text
IMG001.jpg
```

---

# URL Structure

URLs should be

- Short
- Readable
- Keyword-focused

Good

```text
/destinations/tukad-melangit
```

Bad

```text
/page?id=15
```

---

# Heading Structure

Each page should contain

One

```html
<h1>
```

Use

```html
<h2>

<h3>

<h4>
```

hierarchically.

Never skip heading levels.

---

# Internal Linking

Pages should link to

- Related Destinations
- Related Packages
- Related Articles

This improves crawlability.

---

# External Links

External links should

- Open in a new tab
- Use HTTPS
- Include appropriate rel attributes when necessary

---

# Mobile SEO

The website should

- Be fully responsive
- Load quickly
- Avoid layout shifts

---

# Performance

Target

Google PageSpeed

```text
90+
```

Target Core Web Vitals

- LCP < 2.5 s
- CLS < 0.1
- INP < 200 ms

---

# Lazy Loading

Use lazy loading for

- Images
- Videos

Avoid lazy loading above-the-fold content.

---

# Static Rendering

Whenever possible

Use Static Site Generation.

This improves

- Performance
- SEO
- Reliability

---

# Accessibility

Support

- Semantic HTML
- Keyboard Navigation
- Screen Readers
- Alt Text

Accessibility contributes to SEO quality.

---

# Search Indexing

Ensure

- Public pages are indexable
- Error pages are not indexed

404 pages should return the proper HTTP status.

---

# Duplicate Content

Avoid

- Duplicate titles
- Duplicate descriptions
- Duplicate URLs

Use canonical URLs consistently.

---

# Redirects

Use

301 redirects

for permanent URL changes.

Avoid redirect chains.

---

# Monitoring

Recommended tools

- Google Search Console
- Google Analytics
- Google PageSpeed Insights

Monitor

- Indexed Pages
- Search Performance
- Crawl Errors

---

# SEO Checklist

Every new page should include

- Unique Title
- Meta Description
- Canonical URL
- Open Graph
- Structured Data
- Alt Text
- Breadcrumb
- Internal Links

---

# Future Enhancements

Possible future improvements

- Multi-language SEO
- Hreflang
- AI-generated Metadata
- Rich Snippets
- Event Schema
- Product Schema
- Voice Search Optimization

Future enhancements should integrate without changing the existing architecture.

---

# Module Principles

SEO implementation should always prioritize

- Performance
- Accessibility
- Readability
- Structured Data
- Local Search Visibility
- Scalability

Every page should be discoverable, indexable, and optimized for both search engines and human visitors.