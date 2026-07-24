# UI/UX Rules

## Overview

This document defines the user interface (UI) and user experience (UX) principles for the Nyalian Tourism Village Website.

All pages, components, and future features must follow these rules to ensure visual consistency, usability, accessibility, and maintainability.

These rules take precedence over personal design preferences.

---

# Design Philosophy

The website should communicate

- Nature
- Authenticity
- Simplicity
- Warm Hospitality
- Modern Tourism

The overall experience should feel clean, welcoming, and trustworthy.

Avoid visual clutter.

---

# User Experience Goals

Visitors should be able to

- Understand the website immediately
- Find information quickly
- Navigate naturally
- Complete their goals with minimal effort
- Contact the tourism administrator easily

Every interaction should reduce cognitive load.

---

# Visual Hierarchy

Every page should follow the same hierarchy.

```text
Navigation

↓

Hero Section

↓

Primary Content

↓

Secondary Content

↓

Call-to-Action

↓

Footer
```

Do not rearrange this hierarchy without a strong reason.

---

# Layout Consistency

All pages should use

- Consistent container widths
- Consistent spacing
- Consistent section ordering

Avoid arbitrary layouts.

---

# White Space

Use generous spacing.

Whitespace improves readability.

Never overcrowd the interface.

---

# Section Spacing

Each major section should use consistent vertical spacing.

Avoid sections touching one another.

---

# Card Design

Cards should remain visually consistent.

Every card should include

- Rounded corners
- Soft shadow
- Hover animation
- Consistent padding

Avoid multiple card styles.

---

# Buttons

Primary buttons

- Filled
- High contrast

Secondary buttons

- Outlined

Ghost buttons

- Minimal emphasis

Do not introduce additional button styles.

---

# Call-to-Action

Every page should contain one primary CTA.

Examples

Destination

```text
Explore Destination
```

Package

```text
Book This Package
```

Article

```text
Read More Articles
```

FAQ

```text
Contact via WhatsApp
```

Avoid competing primary CTAs.

---

# Navigation

Navigation should always remain predictable.

Maximum

```text
7 primary navigation items
```

The active page should be clearly highlighted.

---

# Breadcrumb

Use breadcrumbs on all detail pages.

Example

```text
Home

↓

Destinations

↓

Tukad Melangit
```

---

# Search

Search bars should

- Remain visible
- Use consistent styling
- Include placeholder text

Example

```text
Search destinations...
```

---

# Filters

Filters should

- Be collapsible on mobile
- Be visible on desktop

Avoid overwhelming users with too many filter options.

---

# Forms

Forms should

- Be simple
- Ask only necessary information
- Display validation immediately

Required fields should be clearly indicated.

---

# Typography

Follow the Design System.

Maintain clear heading hierarchy.

Example

```text
H1

↓

H2

↓

H3

↓

Body

↓

Caption
```

Never skip heading levels.

---

# Color Usage

Colors should communicate meaning.

Primary

Brand identity

Secondary

Supporting actions

Success

Confirmation

Warning

Attention

Error

Problem

Never rely on color alone.

Always include text or icons.

---

# Icons

Icons should

- Be consistent
- Support understanding
- Never replace labels completely

Use Lucide React.

---

# Images

Images should

- Be high quality
- Have consistent aspect ratios
- Include alt text

Avoid stretched images.

---

# Hero Sections

Every page should begin with a hero section.

Include

- Page Title
- Short Description
- Optional Background Image

Avoid overly tall hero sections.

---

# Gallery

Gallery images should

- Open in a lightbox
- Support lazy loading
- Maintain consistent spacing

---

# Empty States

Every empty state should include

- Illustration
- Title
- Description
- Recovery Action

Example

```text
No destinations found.

Try changing your filters.
```

---

# Loading States

Prefer skeleton loaders.

Avoid loading spinners whenever possible.

---

# Error States

Errors should

- Explain the problem
- Suggest a solution

Avoid technical error messages.

---

# Feedback

Every important action should provide feedback.

Examples

- Link copied
- Booking request sent
- Search completed

---

# Motion

Animations should

- Be subtle
- Be fast
- Support usability

Maximum duration

```text
300 ms
```

Avoid distracting animations.

---

# Hover States

Interactive elements should provide hover feedback.

Examples

- Cards
- Buttons
- Links

---

# Mobile First

Design every page for mobile before desktop.

Never hide important functionality on mobile.

---

# Responsive Design

Support

- Mobile
- Tablet
- Desktop

Layouts should adapt naturally.

---

# Accessibility

Support

- Keyboard navigation
- Screen readers
- Focus indicators
- High color contrast

Never remove visible focus states.

## Accessibility Guidelines

All user interfaces MUST follow basic accessibility principles to ensure the website is usable by as many visitors as possible while maintaining a consistent user experience.

### Semantic HTML

- Use semantic HTML elements whenever appropriate (`header`, `main`, `section`, `article`, `nav`, `footer`, etc.).
- Interactive actions MUST use the correct HTML element (e.g., `button` for actions, `a` for navigation).
- Avoid using generic elements (`div`, `span`) as interactive controls.

### Keyboard Navigation

- All interactive elements MUST be accessible using keyboard navigation.
- Users MUST be able to navigate using the `Tab` key.
- Interactive elements MUST display a visible focus indicator.
- Keyboard focus order SHOULD follow the visual layout.

### Images

- Informative images MUST include meaningful `alt` text.
- Decorative images SHOULD use empty `alt=""`.
- Images MUST NOT be the only method of conveying important information.

### Forms

- Every form control MUST have an associated label.
- Required fields SHOULD be clearly indicated.
- Validation errors MUST be presented using descriptive text rather than color alone.

### Color & Contrast

- Text and interactive elements MUST maintain sufficient color contrast against their background.
- Information MUST NOT rely solely on color differences.
- Hover and focus states SHOULD remain clearly distinguishable.

### Responsive Accessibility

- Interactive elements SHOULD provide adequate touch targets for mobile devices.
- Text MUST remain readable without horizontal scrolling on supported screen sizes.
- Layout changes across breakpoints MUST preserve usability and navigation consistency.

### Error Messages

- Error messages SHOULD clearly explain the problem and, where possible, how users can resolve it.
- Error messages MUST be easy to locate within the interface.
- Loading, empty, and error states SHOULD remain consistent across all pages.

### General Principles

The website is intended to comply with widely accepted web accessibility practices while remaining lightweight and maintainable. Accessibility improvements SHOULD be incorporated into every new feature rather than treated as a separate implementation phase.

---

# Reading Experience

Use

- Short paragraphs
- Bullet lists
- Clear headings

Avoid large blocks of text.

---

# Consistency

The same action should always produce the same result.

The same component should always look the same.

---

# Trust Signals

Important pages should include

- Visitor Reviews
- Ratings
- Contact Information
- Maps
- High-quality Photography

These elements increase visitor confidence.

---

# Performance UX

Perceived performance matters.

Prefer

- Skeleton loading
- Progressive image loading
- Instant page transitions

Avoid blank screens.

---

# Content Priority

Information should appear in this order

```text
What

↓

Why

↓

How

↓

Action
```

Users should never search for important information.

---

# AI UI Rules

When generating UI,

always

- Reuse existing components
- Follow existing spacing
- Follow the design system
- Keep layouts simple
- Prioritize readability

Never

- Introduce new design styles
- Invent new color palettes
- Create inconsistent spacing
- Duplicate UI patterns

---

# Future Scalability

Future features should blend naturally into the existing design.

Avoid introducing visual inconsistencies.

---

# UI/UX Checklist

Before considering a page complete, verify

- Responsive layout
- Accessible navigation
- Clear hierarchy
- Consistent spacing
- Proper typography
- Working CTA
- Empty state
- Loading state
- Error state
- SEO metadata

---

# Module Principles

Every interface should prioritize

- Simplicity
- Clarity
- Consistency
- Accessibility
- Performance
- Trust
- Ease of Use

Visitors should always feel confident, comfortable, and guided throughout their journey on the website.