# Video Gallery Module Specification

## Overview

The Video Gallery Module showcases tourism videos that highlight the beauty, culture, and experiences of Nyalian Tourism Village.

Its purpose is to inspire visitors through engaging visual storytelling while maintaining excellent website performance.

All video information is loaded from JSON files.

Videos are embedded from YouTube.

## Related Architecture Documents

This document defines the Video Gallery architecture.

Related documents:

- 07-json-schema.md
- 08-content-management.md
- 09-features.md
- 20-performance.md

Video assets MUST follow the performance recommendations defined in `20-performance.md`.

---

# Module Goals

The Video Gallery Module should allow visitors to:

- Browse tourism videos
- Watch embedded YouTube videos
- Search videos
- Filter videos by category
- Explore destination-related videos
- Share videos

---

# Module Architecture

```text
Video Gallery Module

│

├── Video Listing

├── Featured Video

├── Video Categories

├── Search

├── Filter

├── Video Detail Modal

└── Related Videos
```

---

# Data Source

```text
data/videos/videos.json
```

Referenced data

```text
data/destinations/destinations.json
```

Videos should reference destination IDs whenever applicable.

---

# Route Structure

Video Gallery

```text
/videos
```

Video detail should open inside a modal.

Version 1 does not require a dedicated detail page.

---

# Video Gallery Page

Purpose

Display all available tourism videos.

Features

- Featured Video
- Search
- Category Filter
- Responsive Grid
- Pagination

---

# Featured Video

Display

- Large Thumbnail
- Video Title
- Short Description
- Play Button

Only one featured video should appear.

---

# Video Card

Each video card displays

- Thumbnail
- Title
- Category
- Duration
- Publish Date
- Play Icon

Click

↓

Open Video Modal

---

# Video Modal

Display

- Embedded YouTube Player
- Video Title
- Description
- Related Destination
- Share Button

Closing the modal should stop video playback automatically.

---

# Video Categories

Recommended categories

- Nature
- Culture
- Adventure
- Village Activities
- Local Events
- Culinary
- Educational Tourism

Categories should be generated dynamically from JSON.

---

# Search

Search fields

- Video Title
- Description
- Category

Search behavior

- Instant
- Case-insensitive
- Partial matching

---

# Filter

Supported filters

- Category
- Featured

Filters should work together with search.

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

12 videos per page.

---

# Related Videos

When viewing a video,

display

3–4 related videos.

Similarity based on

- Category
- Destination
- Tags

---

# Destination Integration

Destination pages may display videos related to that destination.

Workflow

```text
Destination

↓

Destination ID

↓

Filter Videos

↓

Display Video Gallery
```

---

# Homepage Integration

The homepage should display

- Featured Video
- Latest Videos

Maximum

```text
4 videos
```

Provide a

```text
View All Videos
```

button.

---

# Video Information

Each video should display

- Thumbnail
- Title
- Category
- Duration
- Publish Date

Optional

- View Count
- Language

---

# Video Player

Requirements

- Embedded YouTube Player
- Responsive Layout
- Lazy Loading
- Autoplay Disabled

Playback starts only when the visitor clicks Play.

---

# Thumbnail

Display

- High-resolution image
- Play icon overlay

Fallback

Display placeholder image if thumbnail is unavailable.

---

# Loading State

Display

Video Skeleton Cards

Avoid blank spaces.

---

# Empty State

Display

Illustration

Heading

```text
No videos found.
```

Description

```text
Try adjusting your search or filters.
```

Button

```text
Reset Filters
```

---

# Error State

Handle

- Missing JSON
- Invalid Video ID
- Missing Thumbnail
- YouTube Embed Failure

Display user-friendly fallback UI.

---

# Accessibility

Support

- Keyboard Navigation
- Screen Readers
- Focus Indicators

Embedded videos should include descriptive titles.

Example

```html
title="Traditional Balinese Dance Performance"
```

---

# Performance

Implement

- Lazy Loading
- Optimized Thumbnails
- Responsive Embeds
- Static Rendering

Videos should not negatively impact page performance.

---

# Responsive Layout

Desktop

```text
4-column grid
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
VideoGalleryPage

│

├── FeaturedVideo

├── SearchBar

├── CategoryFilter

├── VideoGrid

├── VideoCard

├── VideoModal

├── RelatedVideos

└── Pagination
```

---

# Data Flow

```text
Load videos.json

↓

Generate Categories

↓

Apply Search

↓

Apply Filters

↓

Sort Results

↓

Paginate

↓

Render Video Grid

↓

Open Modal
```

---

# JSON Structure

Each video should include

```typescript
{
  id: string;

  title: string;

  slug: string;

  youtubeId: string;

  thumbnail: string;

  description: string;

  category: string;

  destinationIds: string[];

  duration: string;

  publishDate: string;

  featured: boolean;

  tags: string[];
}
```

---

# SEO

Support

- VideoObject Structured Data
- Open Graph
- Meta Description

Video pages should improve search visibility without requiring dedicated pages.

---

# Future Enhancements

Possible future features

- Playlists
- Video Categories Page
- Fullscreen Gallery
- AI-generated Video Summary
- Multi-language Subtitles
- Short-form Video Section
- Instagram Reel Integration
- TikTok Integration

Future enhancements should integrate without changing the existing architecture.

---

# Module Principles

The Video Gallery Module should always prioritize

- High-quality storytelling
- Fast performance
- Responsive design
- Accessibility
- SEO
- Reusability
- Scalability

Videos should inspire visitors while complementing the destination and tourism package information rather than replacing it.