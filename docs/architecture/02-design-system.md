# Design System

## Overview

This document defines the visual language of the Nyalian Tourism Village Website.

The goal is to create a clean, modern, premium, and nature-inspired experience while maintaining consistency across every page and component.

All UI elements must follow this design system.

---

# Design Principles

The interface should be:

- Clean
- Modern
- Minimalist
- Nature-inspired
- Elegant
- Easy to navigate
- Accessible
- Consistent
- Responsive

The overall visual style should emphasize natural landscapes, local culture, and tourism experiences.

---

# Design Style

Visual Direction:

- Modern Tourism Website
- Premium Landing Page
- Large Photography
- Soft Rounded Corners
- Spacious Layout
- Minimal Decorations
- Smooth Animations

Avoid:

- Overly colorful UI
- Heavy gradients
- Excessive shadows
- Busy layouts
- Glassmorphism
- Neumorphism

---

# Color Palette

## Primary

Forest Green

```css
#2F855A
```

Used for:

- Primary Button
- Active Navigation
- Highlights
- Icons
- Links

---

## Secondary

Emerald Green

```css
#48BB78
```

Used for:

- Hover States
- Success Messages
- Badges

---

## Accent

Warm Orange

```css
#F59E0B
```

Used for:

- CTA
- Ratings
- Promotions

---

## Background

White

```css
#FFFFFF
```

Light Gray

```css
#F8FAFC
```

Section Background

```css
#F1F5F9
```

---

## Text

Primary

```css
#1E293B
```

Secondary

```css
#64748B
```

Muted

```css
#94A3B8
```

---

## Border

```css
#E2E8F0
```

---

## Success

```css
#22C55E
```

---

## Warning

```css
#FACC15
```

---

## Error

```css
#EF4444
```

---

# Typography

## Heading Font

Playfair Display

Used for:

- Hero Title
- Section Heading
- Page Heading

---

## Body Font

Inter

Used for:

- Paragraph
- Navigation
- Cards
- Buttons
- Forms

---

# Font Sizes

| Element | Size |
|---------|------|
| Hero Title | 56px |
| Page Title | 40px |
| Section Title | 32px |
| Card Title | 24px |
| Subtitle | 20px |
| Body | 16px |
| Small Text | 14px |
| Caption | 12px |

---

# Font Weight

| Usage | Weight |
|--------|--------|
| Hero | 700 |
| Heading | 700 |
| Subtitle | 600 |
| Body | 400 |
| Button | 600 |

---

# Layout

Maximum Container

```text
1280px
```

Content Width

```text
1200px
```

Default Padding

Desktop

```text
80px
```

Tablet

```text
48px
```

Mobile

```text
24px
```

---

# Grid System

Desktop

4 Columns

Tablet

2 Columns

Mobile

1 Column

Cards should automatically adapt using CSS Grid.

---

# Border Radius

Small

```text
8px
```

Medium

```text
12px
```

Large

```text
16px
```

Extra Large

```text
24px
```

Buttons use Medium radius.

Cards use Large radius.

Hero images use Extra Large radius.

---

# Shadow

Small

```css
shadow-sm
```

Medium

```css
shadow-md
```

Large

```css
shadow-lg
```

Do not use extremely dark shadows.

---

# Buttons

## Primary Button

Background

Forest Green

Text

White

Hover

Slightly darker

Animation

200ms

Rounded

12px

---

## Secondary Button

White Background

Green Border

Green Text

Hover

Green Background

White Text

---

## Ghost Button

Transparent

Hover Background

Light Gray

---

# Cards

Cards should include:

- Rounded corners
- Soft shadow
- Image
- Title
- Description
- CTA

Cards should never feel crowded.

---

# Images

Images should:

- Fill container
- Maintain aspect ratio
- Use rounded corners
- Use lazy loading
- Have descriptive alt text

Recommended ratio:

16:9

Square images only where appropriate.

---

# Icons

Use Lucide React only.

Icon size:

Small

16px

Medium

20px

Large

24px

Extra Large

32px

Icons should inherit text color whenever possible.

---

# Navigation

Desktop

Horizontal Navigation

Mobile

Hamburger Menu

Sticky Navigation

Enabled

Transparent navbar over hero section.

Solid navbar after scrolling.

---

# Sections

Every section should include:

- Section title
- Short description
- Main content
- Proper spacing

Recommended spacing:

Top

96px

Bottom

96px

---

# Forms

Input Fields

Height

48px

Border Radius

12px

Border

Gray

Focus

Green

Buttons should align with the design system.

---

# Badges

Badge Categories:

Nature

Culture

Adventure

Education

Popular

New

Family Friendly

Badge radius

9999px

---

# Rating

Stars

Warm Orange

Average Rating

Displayed beside review count.

---

# Animations

Use subtle animations only.

Allowed:

- Fade In
- Fade Up
- Scale
- Slide
- Hover Lift

Duration

200ms–300ms

Avoid:

- Bounce
- Rotate
- Flash
- Infinite animation

---

# Responsive Design

The website must support:

- Mobile
- Tablet
- Laptop
- Desktop

Every component should be mobile-first.

---

# Accessibility

Minimum contrast ratio:

WCAG AA

All buttons must:

- Have focus state
- Be keyboard accessible
- Include aria-label when needed

Images must always include alt text.

---

# Dark Mode

Not supported in Version 1.

The design system should be prepared for future implementation.

---

# Component Consistency

Every reusable component must use the same:

- Color palette
- Border radius
- Typography
- Shadow
- Animation
- Spacing

No component should introduce a different visual language.

---

# Design Philosophy

The website should create the feeling of:

- Exploring nature
- Discovering local culture
- Trusting local tourism services
- Enjoying a premium digital experience

Every interface decision should reinforce the identity of Nyalian Tourism Village as a welcoming, authentic, and sustainable destination.