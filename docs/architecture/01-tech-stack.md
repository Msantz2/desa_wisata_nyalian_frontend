# Technology Stack

## Overview

This project is built using a modern frontend technology stack focused on performance, scalability, maintainability, and developer experience.

The website follows a static-first architecture with JSON as the primary data source.

---

# Core Technologies

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Animation | Framer Motion |
| Image Optimization | next/image |
| Font | Google Fonts (Next Font) |
| Data Source | Local JSON Files |
| Maps | Google Maps Embed |
| Markdown Support | react-markdown |
| Carousel | Embla Carousel |
| Deployment | Vercel |
| Package Manager | npm |

---

# Frontend Framework

## Next.js

The application uses Next.js App Router.

Reasons:

- Server Components by default
- Excellent SEO
- Image Optimization
- Fast routing
- Static Site Generation
- Partial prerendering support
- Great developer experience

Use App Router only.

Do not use the Pages Router.

---

# Programming Language

## TypeScript

The entire project must be written in TypeScript.

Guidelines:

- Avoid using `any`
- Prefer explicit interfaces
- Use type aliases where appropriate
- Enable strict mode

---

# Styling

## Tailwind CSS

Tailwind CSS is the only styling solution.

Guidelines:

- No CSS frameworks
- No Bootstrap
- No Bulma
- No Material UI
- Avoid inline styles
- Utility-first approach

Global styles should only contain:

- CSS variables
- Custom scrollbar
- Base typography
- Utility classes

---

# UI Components

## shadcn/ui

Reusable UI components should be based on shadcn/ui.

Examples:

- Button
- Card
- Dialog
- Accordion
- Tabs
- Badge
- Input
- Pagination
- Sheet
- Skeleton
- Toast

Custom components should follow the same design language.

---

# Icons

## Lucide React

Use Lucide React for all icons.

Avoid mixing multiple icon libraries.

Examples:

- MapPin
- Phone
- Star
- Search
- Calendar
- Clock
- Menu
- ArrowRight

---

# Animation

## Framer Motion

Use Framer Motion only where animation improves user experience.

Examples:

- Hero animation
- Fade in
- Card hover
- Section transition
- Page transition

Avoid excessive animation.

Animation should feel smooth and subtle.

---

# Images

Use Next.js Image component.

Requirements:

- Lazy loading
- Responsive sizing
- Optimized formats
- Proper alt text

Images should never use the standard HTML `<img>` tag unless absolutely necessary.

---

# Typography

Use Google Fonts via Next Font.

Recommended fonts:

Heading:
- Playfair Display

Body:
- Inter

Fallback:

sans-serif

---

# Data Management

## JSON-Based Content

The project does not use a traditional database.

All dynamic content is stored inside JSON files.

Examples:

- destinations.json
- packages.json
- reviews.json
- articles.json
- faq.json
- videos.json
- navigation.json
- settings.json

Advantages:

- Lightweight
- Version controlled
- Easy maintenance
- Static deployment
- Fast loading

---

# Maps

Google Maps Embed is used for location information.

Every destination should include:

- Coordinates
- Google Maps Embed URL
- Google Maps Link
- Address

---

# Markdown Support

Articles should support Markdown rendering.

Use:

react-markdown

Benefits:

- Easy article writing
- Lightweight
- SEO friendly

---

# Carousel

Use Embla Carousel.

Applications:

- Hero slider
- Destination gallery
- Package slider
- Reviews
- Image gallery

Avoid creating custom carousel implementations.

---

# Form Handling

Use React Hook Form.

Validation:

Zod

Benefits:

- Better performance
- Type safety
- Easy validation

Forms include:

- Contact Form
- Reservation Form
- Search Form

---

# Notifications

Use Sonner Toast.

Applications:

- Copy Link
- Form Success
- Error Messages
- Reservation Status

---

# State Management

Use React built-in state management.

Preferred order:

1. useState
2. useReducer
3. Context API

Avoid introducing external global state libraries unless the project significantly grows.

Do not use:

- Redux
- MobX
- Zustand

unless absolutely necessary.

---

# Deployment

Deploy using Vercel.

Reasons:

- Native Next.js support
- Global CDN
- Easy deployment
- Automatic optimization
- Free tier availability

---

# Version Control

Use Git.

Repository structure should remain clean.

Commit messages should follow Conventional Commits.

Examples:

feat:

fix:

refactor:

docs:

style:

perf:

chore:

---

# Browser Support

Target modern browsers.

Support:

- Chrome
- Edge
- Firefox
- Safari

No Internet Explorer support.

---

# Performance Goals

Target Lighthouse score:

Performance:
95+

Accessibility:
95+

Best Practices:
95+

SEO:
100

---

# Technology Principles

The technology stack should always prioritize:

- Performance
- Simplicity
- Maintainability
- Scalability
- Accessibility
- SEO
- Developer Experience

New libraries should only be added when they provide significant value and do not duplicate existing functionality.