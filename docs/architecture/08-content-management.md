# Content Management

## Overview

This document defines how content is managed throughout the Nyalian Tourism Village Website.

The project follows a **JSON-driven content management approach**.

Instead of using a traditional CMS or database, all website content is stored in structured JSON files located inside the `/data` directory.

This approach keeps the application lightweight, maintainable, version-controlled, and easy to update.

---

# Content Philosophy

The website follows several content management principles.

- Static-first architecture
- Human-readable data
- Version controlled
- Easy to maintain
- Easy to scale
- No database dependency
- No backend administration panel

Every piece of content displayed on the website must originate from JSON files.

---

# Content Directory

```text
data/
│
├── destinations.json
├── packages.json
├── articles.json
├── reviews.json
├── faq.json
├── videos.json
├── navigation.json
├── settings.json
└── village.json
```

Each file has a single responsibility.

---

# Content Ownership

Each JSON file manages one content type.

| File | Responsibility |
|------|----------------|
| destinations.json | Tourism destinations |
| packages.json | Tourism packages |
| articles.json | Blog articles |
| reviews.json | Visitor testimonials |
| faq.json | Frequently Asked Questions |
| videos.json | Tourism videos |
| village.json | Village profile |
| navigation.json | Website navigation |
| settings.json | Global website settings |

---

# Content Workflow

Content should follow the following workflow.

```text
Create Content

↓

Edit JSON

↓

Validate Structure

↓

Save File

↓

Run Development Server

↓

Review Changes

↓

Commit to Git

↓

Deploy
```

---

# JSON Editing Rules

Every JSON file must follow these rules.

- Valid JSON syntax
- UTF-8 encoding
- Proper indentation
- No duplicate IDs
- No duplicate slugs
- No unused properties

Do not leave unfinished data.

---

# Content Validation

Before deployment, every JSON file should be checked for:

- Syntax errors
- Missing required fields
- Duplicate IDs
- Duplicate slugs
- Broken image paths
- Broken video references

Validation should happen before the application is built.

---

# Image Management

All images should be stored inside:

```text
public/images/
```

Recommended structure:

```text
public/

images/

│

├── destinations/

├── packages/

├── articles/

├── village/

└── gallery/
```

Image filenames should be descriptive.

Example:

```text
tukad-melangit-hero.jpg
```

Avoid filenames such as:

```text
IMG001.jpg

photo1.jpg

image-final-final.jpg
```

---

# Video Management

Videos should use YouTube embeds.

Store only:

- YouTube ID
- Thumbnail
- Title
- Description

Do not upload large video files directly into the project.

---

# Article Management

Articles should include:

- Title
- Slug
- Cover Image
- Category
- Tags
- Publication Date
- Content

Articles should be written in Markdown-friendly format when possible.

---

# Destination Management

Each destination should include complete information.

Minimum required fields:

- Name
- Slug
- Description
- Location
- Images
- Facilities
- Operating Hours
- Ticket Price
- Rating

Incomplete destinations should not be published.

---

# Tourism Package Management

Each package should contain:

- Name
- Description
- Price
- Duration
- Capacity
- Included
- Excluded
- Itinerary
- Related Destinations

---

# Review Management

Reviews should only contain authentic visitor experiences.

Each review includes:

- Visitor Name
- Rating
- Comment
- Visit Date

Avoid placeholder reviews in production.

---

# FAQ Management

Frequently Asked Questions should be organized into categories.

Examples:

- General
- Tickets
- Facilities
- Transportation
- Reservation

Keep answers concise and easy to understand.

---

# Navigation Management

Navigation items are managed through:

```text
navigation.json
```

Each item should include:

- Label
- URL
- Display Order

---

# Website Settings

Global website configuration is stored in:

```text
settings.json
```

Examples:

- Site Name
- Contact Information
- WhatsApp Number
- Email
- Social Media Links
- Google Maps
- Copyright

---

# Content Relationships

The content structure follows this relationship.

```text
Village

│

├── Destinations

│      │

│      ├── Videos

│      ├── Images

│      └── Reviews

│

├── Tourism Packages

│      │

│      └── Destinations

│

├── Articles

│

└── FAQ
```

Content should reference IDs instead of duplicating information.

---

# File Organization

Every JSON file should remain small and readable.

If a file grows significantly, it may be separated into multiple files.

Example:

```text
destinations/

├── waterfalls.json

├── temples.json

├── viewpoints.json
```

Only split files when necessary.

---

# Version Control

All content changes should be committed using Git.

Example commit messages:

```text
feat: add new tourism package

docs: update village profile

fix: correct destination coordinates

content: update FAQ
```

---

# Backup Strategy

The JSON files should always be included in the Git repository.

Git serves as the primary backup mechanism.

No manual backup process is required.

---

# Future Scalability

The content management architecture is designed to support future migration to:

- Headless CMS
- REST API
- GraphQL
- Cloud Database

without requiring significant changes to the frontend architecture.

The JSON structure should remain compatible with future data sources.

---

# Content Management Principles

Every content update should prioritize:

- Accuracy
- Consistency
- Readability
- Maintainability
- Scalability

Content should always be treated as structured data rather than hardcoded values inside React components.

---

## Content Management Responsibility

This document defines the shared operational workflow for managing website content.

Content schemas are defined exclusively in `07-json-schema.md`, while module-specific behavior is documented separately in the corresponding module architecture documents.

Future content modules MUST integrate with this shared content management architecture to ensure consistency, maintainability, and long-term scalability.

---

## Content Management Responsibility

This document defines the shared operational workflow for managing website content.

Content schemas are defined exclusively in `07-json-schema.md`, while module-specific behavior is documented separately in the corresponding module architecture documents.

Future content modules MUST integrate with this shared content management architecture to ensure consistency, maintainability, and long-term scalability.