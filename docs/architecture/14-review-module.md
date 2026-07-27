# Review Module Specification

## Overview

The Review Module displays authentic visitor testimonials to increase trust and credibility for Nyalian Tourism Village.

The module provides social proof by showcasing visitor experiences, ratings, and feedback.

All review data is loaded from JSON files.

Visitors cannot submit reviews directly in Version 1.

## Related Architecture Documents

This document defines the Review module architecture.

Related documents:

- 07-json-schema.md
- 08-content-management.md
- 09-features.md
- 11-destination-module.md
- 12-tour-package-module.md

Reviews MAY be associated with destinations and tour packages while following the shared content architecture.

---

# Module Goals

The Review Module should allow visitors to:

- Read authentic visitor reviews
- View average ratings
- Understand visitor experiences
- Build confidence before visiting
- Explore reviews across destinations and tourism packages

---

# Module Architecture

```text
Review Module

│

├── Review Summary

├── Review Listing

├── Featured Reviews

├── Rating Distribution

└── Review Carousel
```

---

# Data Source

```text
data/reviews/reviews.json
```

Reviews may optionally reference:

```text
data/destinations/destinations.json

data/packages/packages.json
```

---

# Review Relationships

Each review may belong to:

- A destination
- A tourism package
- The village in general

The relationship should use IDs instead of duplicated information.

---

# Review Structure

Each review contains

- Visitor Name
- Visitor Country
- Avatar
- Rating
- Visit Date
- Comment
- Related Destination (optional)
- Related Package (optional)

---

# Review Summary

Display

- Average Rating
- Total Reviews
- Recommendation Percentage

Example

```text
★★★★☆

4.8 / 5

Based on 142 Reviews
```

---

# Rating Distribution

Display the percentage of each rating.

Example

```text
★★★★★ 82%

★★★★☆ 14%

★★★☆☆ 3%

★★☆☆☆ 1%

★☆☆☆☆ 0%
```

Display using horizontal progress bars.

---

# Featured Reviews

Purpose

Highlight the best visitor testimonials.

Display

- Visitor Avatar
- Visitor Name
- Country
- Rating
- Short Comment

Maximum

```text
6 reviews
```

---

# Review Listing

Display reviews in a responsive grid.

Each review card contains

- Avatar
- Visitor Name
- Country
- Rating
- Visit Date
- Comment

---

# Review Card

Each review should display

```text
Avatar

Visitor Name

Country

★★★★★

Visit Date

Comment
```

Long comments should be truncated.

Provide

```text
Read More
```

when necessary.

---

# Review Carousel

Used on

- Homepage
- Destination Detail
- Package Detail

Features

- Auto-play
- Manual Navigation
- Swipe Support
- Responsive Layout

---

# Destination Reviews

When viewing a destination,

display only reviews related to that destination.

Example

```text
Destination

↓

Load destinationId

↓

Filter Reviews

↓

Display Reviews
```

---

# Package Reviews

When viewing a tourism package,

display only reviews related to that package.

---

# Search

Version 1

No search functionality.

Future versions may support review search.

---

# Sorting

Supported

- Newest
- Highest Rating

Default

Newest First

---

# Pagination

Optional.

Recommended only when review count exceeds

```text
12 reviews
```

---

# Loading State

Display

Review Skeleton Cards

Avoid blank spaces.

---

# Empty State

Display

Illustration

Heading

```text
No reviews available.
```

Description

```text
Visitor reviews will appear here.
```

---

# Error State

Handle

- Missing JSON
- Invalid Review Data
- Missing Avatar

Display user-friendly fallback UI.

---

# Avatar Handling

If no avatar exists,

display initials inside a circular placeholder.

Example

```text
JD
```

---

# Rating Display

Display ratings using

- Filled Stars
- Numeric Rating

Example

```text
★★★★★

4.8 / 5
```

Support

```text
0.0

↓

5.0
```

---

# Comment Length

Recommended maximum

```text
250 characters
```

Long comments should collapse automatically.

---

# Accessibility

Support

- Screen Readers
- Keyboard Navigation
- Proper Labels

Stars should include accessible text.

Example

```text
Rated 5 out of 5 stars
```

---

# Performance

Implement

- Lazy Rendering
- Static Rendering
- Optimized Avatar Images

---

# Responsive Layout

Desktop

```text
3-column grid
```

Tablet

```text
2-column grid
```

Mobile

```text
Single-column layout
```

---

# Component Structure

```text
ReviewSection

│

├── ReviewSummary

├── RatingDistribution

├── FeaturedReviews

├── ReviewGrid

├── ReviewCard

└── ReviewCarousel
```

---

# Data Flow

```text
Load reviews.json

↓

Filter by Context

↓

Calculate Average Rating

↓

Calculate Rating Distribution

↓

Sort Reviews

↓

Render Components
```

---

# SEO

Review data should be included in structured data when applicable.

Support

- Aggregate Rating
- Review Schema

This improves search engine visibility.

---

# Future Enhancements

Possible future features

- User Review Submission
- Google Reviews Integration
- Review Images
- Review Likes
- Verified Visitor Badge
- AI Sentiment Analysis
- Review Translation

These features should integrate without changing the current module architecture.

---

# Module Principles

The Review Module should always prioritize

- Authenticity
- Credibility
- Readability
- Accessibility
- Performance
- Reusability
- Scalability

Reviews should help visitors build confidence and make informed decisions before visiting Nyalian Tourism Village.