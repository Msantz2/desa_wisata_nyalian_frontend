# Performance Specification

## Overview

Performance is a core requirement of the Nyalian Tourism Village Website.

The website should provide a fast, smooth, and responsive experience across desktop and mobile devices.

Since the application uses Next.js with static JSON content, performance optimization should be built into the architecture rather than added later.

## Related Architecture Documents

This document defines the website performance architecture.

The following documents contribute directly to performance:

- **06-components.md** — Reusable component architecture affecting rendering efficiency.
- **10-search-filter.md** — Search and filtering mechanisms affecting runtime performance.
- **17-video-gallery.md** — Video loading, optimization, and media delivery considerations.

All performance optimizations MUST remain consistent with these supporting architecture documents.

---

# Performance Goals

The website should achieve:

- Fast initial loading
- Smooth page transitions
- Minimal JavaScript execution
- Optimized media delivery
- Excellent Core Web Vitals

---

# Target Scores

Recommended Lighthouse Scores

| Category | Target |
|----------|--------|
| Performance | 95+ |
| Accessibility | 95+ |
| Best Practices | 100 |
| SEO | 100 |

---

# Core Web Vitals

Target metrics

Largest Contentful Paint (LCP)

```text
< 2.5 seconds
```

Interaction to Next Paint (INP)

```text
< 200 ms
```

Cumulative Layout Shift (CLS)

```text
< 0.1
```

---

# Rendering Strategy

Use Static Site Generation (SSG) whenever possible.

Recommended

```text
Home

Destinations

Destination Detail

Packages

Package Detail

Articles

Article Detail

FAQ

Videos

Village Profile
```

Avoid unnecessary client-side rendering.

---

# Server Components

Default to React Server Components.

Only use Client Components when required.

Examples

Client Components

- Search
- Filters
- Carousel
- Lightbox
- Share Button

Everything else should remain Server Components.

---

# JavaScript Strategy

Minimize JavaScript execution.

Avoid

- Large libraries
- Duplicate dependencies
- Unnecessary state management

Prefer

- Native APIs
- Lightweight utilities

---

# Code Splitting

Enable automatic code splitting.

Large components should be dynamically imported.

Examples

- Video Player
- Image Lightbox
- Google Maps
- Carousel

Recommended

```typescript
dynamic(() => import(...))
```

---

# Image Optimization

All images should use

```text
next/image
```

Requirements

- Responsive images
- Automatic resizing
- Lazy loading
- Modern formats
- Proper sizing

Never use plain HTML img tags unless absolutely necessary.

---

# Image Formats

Preferred

- WebP
- AVIF

Fallback

- JPEG
- PNG

Avoid oversized images.

---

# Lazy Loading

Lazy load

- Gallery Images
- Videos
- Maps
- Below-the-fold Images

Do not lazy load hero images.

---

# Font Optimization

Use

```text
next/font
```

Avoid loading fonts from external CDNs.

Minimize font weights.

Recommended

2–3 font weights maximum.

---

# CSS Strategy

Prefer

- Tailwind CSS
- Utility-first styling

Avoid

- Large CSS files
- Unused CSS
- Global overrides

---

# Animation

Animations should be subtle.

Maximum duration

```text
300 ms
```

Avoid

- Heavy animations
- Infinite animations
- Layout-triggering animations

Prefer

- Opacity
- Transform

---

# Media Optimization

Videos

Use YouTube embeds.

Do not host large video files.

Images

Compress before deployment.

---

# JSON Optimization

Keep JSON files

- Small
- Structured
- Normalized

Avoid duplicated data.

Reference IDs whenever possible.

---

# Search Performance

Search should execute in memory.

Use memoization.

Example

```typescript
useMemo()
```

Avoid repeated filtering.

---

# Pagination

Paginate

- Destinations
- Packages
- Articles
- Videos

Avoid rendering large datasets simultaneously.

---

# Bundle Size

Recommended

Initial JavaScript

```text
< 200 KB
```

Individual page bundles

```text
< 150 KB
```

---

# Dependency Management

Avoid installing libraries unless necessary.

Before adding a package,

consider

- Native browser APIs
- Existing utilities
- Next.js built-in features

---

# Caching

Static assets should be cached aggressively.

Examples

- Images
- Fonts
- Icons

JSON files should use immutable caching where appropriate.

---

# Route Prefetching

Enable automatic route prefetching.

Users should experience near-instant navigation.

---

# Network Requests

Minimize requests.

Because content is local JSON,

avoid unnecessary API calls.

---

# Skeleton Loading

Use skeleton placeholders for

- Gallery
- Cards
- Videos

Avoid loading spinners whenever possible.

---

# Error Boundaries

Implement graceful error handling.

Examples

- Missing JSON
- Broken Images
- Invalid Routes

Display meaningful fallback UI.

---

# Accessibility Performance

Interactive elements should remain responsive.

Target

```text
<100 ms
```

for visible UI feedback.

---

# Responsive Performance

Performance should remain excellent on

- Desktop
- Tablet
- Mobile

Avoid loading desktop-sized assets on mobile devices.

---

# Performance Budget

Recommended limits

JavaScript

```text
< 200 KB
```

CSS

```text
< 100 KB
```

Hero Image

```text
< 300 KB
```

Gallery Image

```text
< 200 KB
```

Thumbnail

```text
< 100 KB
```

JSON File

```text
< 200 KB
```

---

# Lighthouse Audit

Run audits before deployment.

Verify

- Performance
- Accessibility
- SEO
- Best Practices

Resolve all critical issues.

---

# Monitoring

Recommended tools

- Lighthouse
- PageSpeed Insights
- Chrome DevTools

Monitor

- Core Web Vitals
- Bundle Size
- Network Requests

---

# Future Optimizations

Possible future improvements

- Service Worker
- Offline Support
- Progressive Web App (PWA)
- Edge Caching
- Image CDN
- Incremental Static Regeneration (ISR)

These enhancements should integrate without changing the existing architecture.

---

# Performance Checklist

Before deployment, verify:

- Images optimized
- next/image used
- next/font used
- Static rendering enabled
- Lazy loading implemented
- Dynamic imports configured
- JSON validated
- Bundle size within budget
- Lighthouse score meets targets

---

# Module Principles

Performance optimization should always prioritize:

- Speed
- Simplicity
- Maintainability
- Scalability
- Accessibility

Every optimization should improve the user experience without increasing unnecessary complexity.