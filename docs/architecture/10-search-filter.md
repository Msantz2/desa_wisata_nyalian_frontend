# Search & Filter Specification

## Overview

This document defines the search, filtering, sorting, and pagination behavior used throughout the Nyalian Tourism Village Website.

The goal is to help visitors quickly discover destinations, tourism packages, and articles with a fast, intuitive, and consistent user experience.

The website uses client-side filtering because all content is loaded from local JSON files.

---

# Search Philosophy

Search should be:

- Fast
- Case-insensitive
- Responsive
- Lightweight
- Easy to use
- Consistent across all pages

Search results should update immediately without requiring a page refresh.

---

# Search Scope

Search functionality is available on the following pages.

| Page | Search Supported |
|-------|------------------|
| Destinations | Yes |
| Tourism Packages | Yes |
| Articles | Yes |
| FAQ | Yes |

The Home Page should not include a global search.

---

# Search Behavior

The search should support:

- Partial matching
- Case-insensitive matching
- Instant filtering
- Empty search reset

Example

Searching:

```text
water
```

Should match:

```text
Waterfall

Water Temple

Hidden Waterfall
```

Searching:

```text
CULTURE
```

Should also match:

```text
Culture

Cultural Tour

Local Culture
```

---

# Search Fields

## Destinations

Search should include:

- Name
- Category
- Short Description

---

## Tourism Packages

Search should include:

- Package Name
- Category
- Description

---

## Articles

Search should include:

- Title
- Category
- Tags

---

## FAQ

Search should include:

- Question
- Answer

---

# Search Input

Requirements

- Search icon
- Placeholder text
- Clear button
- Responsive width

Example placeholder

```text
Search destinations...
```

---

# Filter System

Filters should always work together.

Multiple filters may be active simultaneously.

Example

Category:

Nature

AND

Facility:

Parking

AND

Rating:

4+

---

# Destination Filters

Supported filters

## Category

Examples

- Nature
- Culture
- Adventure
- Education
- Religious

---

## Facilities

Examples

- Parking
- Toilet
- Restaurant
- Prayer Room
- Viewing Deck
- Tour Guide

---

## Featured

Values

- Featured
- All

---

# Tourism Package Filters

Supported filters

## Category

Examples

- Nature Tour
- Cultural Tour
- Educational Tour
- Family Tour

---

## Duration

Examples

- Half Day
- Full Day
- Multi-Day

---

## Price Range

Examples

- Low
- Medium
- High

Price ranges should be configurable.

---

# Article Filters

Supported filters

- Category
- Tags

---

# FAQ Filters

Supported filters

- Category

Examples

- General
- Tickets
- Facilities
- Transportation
- Reservation

---

# Sorting

Sorting options should remain consistent across the website.

---

## Destination Sorting

Available options

- Featured
- Alphabetical (A–Z)
- Alphabetical (Z–A)
- Highest Rating

---

## Package Sorting

Available options

- Featured
- Lowest Price
- Highest Price
- Alphabetical

---

## Article Sorting

Available options

- Newest
- Oldest
- Alphabetical

---

# Pagination

Pagination should be used when content exceeds the page limit.

Recommended page size

Destinations

```text
9
```

Packages

```text
6
```

Articles

```text
9
```

---

# Empty State

When no results are found, display:

Illustration

Heading

```text
No results found
```

Description

```text
Try adjusting your search or filters.
```

Button

```text
Clear Filters
```

---

# Clear Filters

Provide a single action that resets:

- Search
- Filters
- Sorting

Back to the default state.

---

# Search Performance

Because data comes from JSON files, search should:

- Execute in memory
- Avoid unnecessary re-rendering
- Use memoization where appropriate

Recommended

```typescript
useMemo()
```

---

# Search Logic

Search should follow this sequence.

```text
Load JSON

↓

Search

↓

Apply Filters

↓

Sort

↓

Paginate

↓

Display Results
```

---

# URL Behavior

Version 1

Search state remains local.

Example

```text
/destinations
```

Version 2 (Future)

Support query parameters.

Example

```text
/destinations?search=waterfall

/packages?category=nature

/articles?tag=culture
```

---

# Accessibility

Search input must support:

- Keyboard navigation
- Screen readers
- Focus indicators
- Proper labels

---

# Mobile Behavior

On mobile devices:

- Search bar spans full width.
- Filters open inside a slide-over panel (Drawer/Sheet).
- Sorting appears below the search bar.

---

# Desktop Behavior

Desktop layout

```text
Search Bar

↓

Filter Sidebar

↓

Sort Dropdown

↓

Grid

↓

Pagination
```

---

# Responsive Layout

Desktop

Search + Sidebar

Tablet

Search + Collapsible Filters

Mobile

Search + Drawer Filters

---

# Component Relationships

```text
SearchInput

↓

FilterPanel

↓

SortDropdown

↓

Grid

↓

Pagination
```

Each component should remain independent and reusable.

---

# Future Enhancements

Reserved for future versions.

Possible improvements

- Search Suggestions
- Autocomplete
- Search History
- Popular Searches
- URL-based Search
- AI Semantic Search
- Voice Search

These enhancements should integrate without replacing the current architecture.

---

# Implementation Guidelines

The search and filter system should always prioritize:

- Speed
- Simplicity
- Consistency
- Accessibility
- Reusability
- Maintainability

Business logic should remain separate from UI components.

Filtering functions should be implemented as reusable utility functions whenever possible.