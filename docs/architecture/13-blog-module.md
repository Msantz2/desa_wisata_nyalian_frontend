# Blog Module Specification

## Overview

The Blog Module provides informative and engaging content related to Nyalian Tourism Village.

Its primary purpose is to educate visitors, improve SEO performance, and promote local tourism through articles, travel guides, cultural stories, and village news.

All article content is loaded from JSON files.

## Related Architecture Documents

This document defines the Blog module architecture.

Related documents:

- 07-json-schema.md
- 08-content-management.md
- 09-features.md
- 18-share-feature.md
- 19-seo.md

Blog content MUST comply with the SEO architecture defined in `19-seo.md`.

---

# Module Goals

The Blog Module should allow visitors to:

- Browse tourism-related articles
- Search articles
- Filter articles by category
- Read full article content
- Discover related articles
- Share articles
- Explore tourism information

---

# Module Architecture

```text
Blog Module

│

├── Article Listing

├── Article Detail

├── Search

├── Category Filter

├── Pagination

├── Related Articles

├── Social Sharing

└── Featured Articles
```

---

# Data Source

```text
data/articles/articles.json
```

Optional supporting data

```text
data/articles/categories.json
```

---

# Route Structure

Article Listing

```text
/articles
```

Article Detail

```text
/articles/[slug]
```

Example

```text
/articles/best-time-to-visit-nyalian
```

---

# Article Listing

Purpose

Display all published articles.

Features

- Search
- Category Filter
- Featured Articles
- Pagination
- Sorting

---

# Article Card

Each article card displays

- Cover Image
- Title
- Category
- Publication Date
- Author
- Reading Time
- Short Excerpt

Click

↓

Navigate to

```text
/articles/[slug]
```

---

# Featured Articles

Featured articles should appear at the top of the listing page.

Display

- Large Cover Image
- Title
- Category
- Reading Time
- Short Description

Maximum

```text
3 articles
```

---

# Article Detail

Purpose

Display the complete article.

---

# Article Detail Layout

```text
Hero Banner

↓

Breadcrumb

↓

Article Metadata

↓

Article Content

↓

Image Gallery (Optional)

↓

Related Articles

↓

Share Buttons

↓

Back to Articles
```

---

# Hero Banner

Display

- Cover Image
- Article Title
- Category
- Publication Date

---

# Article Metadata

Display

- Author
- Published Date
- Reading Time
- Category
- Tags

---

# Article Content

Supports

- Headings
- Paragraphs
- Bullet Lists
- Numbered Lists
- Images
- Quotes

Content should remain easy to read.

---

# Reading Time

Estimated automatically.

Example

```text
5 min read
```

---

# Tags

Display article tags.

Examples

- Culture
- Waterfall
- Adventure
- Travel Tips
- Local Food

Tags are clickable.

---

# Image Gallery

Optional.

Display additional images related to the article.

Supports

- Responsive Grid
- Lightbox

---

# Related Articles

Display

3–4 related articles.

Similarity determined by

- Category
- Tags

---

# Social Sharing

Supported platforms

- WhatsApp
- Facebook
- X
- Copy Link

---

# Search

Search fields

- Title
- Category
- Tags

Search should be

- Case-insensitive
- Instant
- Client-side

---

# Category Filter

Examples

- Travel Guide
- Culture
- Events
- Nature
- Local News

Categories should be generated dynamically from JSON.

---

# Sorting

Supported

- Newest
- Oldest
- Alphabetical

Default

Newest First

---

# Pagination

Recommended

9 articles per page.

---

# Loading State

Display

Article Skeleton Cards

Avoid blank pages.

---

# Empty State

Display

Illustration

Heading

```text
No articles found.
```

Button

```text
Reset Search
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

Every article should generate

- Unique Title
- Meta Description
- Open Graph Image
- Canonical URL
- Structured Data

The article title should include relevant tourism keywords when appropriate.

---

# Accessibility

Support

- Keyboard Navigation
- Screen Readers
- Semantic HTML
- Proper Heading Hierarchy
- Alt Text for Images

---

# Performance

Implement

- Static Rendering
- Lazy Loading Images
- Optimized Images
- Dynamic Metadata

---

# Responsive Layout

Desktop

```text
Centered reading layout
```

Tablet

```text
Adaptive width
```

Mobile

```text
Single-column reading layout
```

Long paragraphs should be avoided.

---

# Component Structure

```text
ArticlePage

│

├── HeroBanner

├── Breadcrumb

├── ArticleMetadata

├── ArticleContent

├── ImageGallery

├── RelatedArticles

├── SocialShare

└── BackButton
```

---

# Data Flow

```text
Load articles.json

↓

Validate Slug

↓

Load Article

↓

Find Related Articles

↓

Render Page

↓

Display Share Buttons
```

---

# Recommended Article Categories

- Travel Guide
- Nature
- Culture
- Village News
- Local Events
- Culinary
- Adventure
- Educational Tourism

Categories should remain flexible and configurable through JSON.

---

# Future Enhancements

Possible future features

- Article Search Suggestions
- Table of Contents
- Reading Progress Bar
- Article Bookmark
- Recommended Reading
- AI Article Summary
- Multi-language Articles

Future features should integrate without changing the existing module architecture.

---

# Module Principles

The Blog Module should always prioritize

- Readability
- Valuable Information
- SEO Optimization
- Fast Performance
- Accessibility
- Responsive Design
- Reusability
- Scalability

Articles should provide meaningful information that helps visitors understand and appreciate Nyalian Tourism Village before planning their visit.