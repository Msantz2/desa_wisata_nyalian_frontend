# Google Maps Module Specification

## Overview

The Google Maps Module helps visitors easily locate Nyalian Tourism Village and its tourism destinations.

Its primary purpose is to provide accurate location information and seamless navigation using Google Maps.

The module uses Google Maps Embed and Google Maps links.

No Google Maps JavaScript API is required.

## Related Architecture Documents

This document defines Google Maps integration.

Related documents:

- 11-destination-module.md
- 12-tour-package-module.md
- 07-json-schema.md
- 09-features.md

Maps SHOULD visualize destination and tour package locations without introducing duplicate location data.

---

# Module Goals

The Google Maps Module should allow visitors to:

- View destination locations
- Explore village location
- Open Google Maps navigation
- Access location coordinates
- Find addresses quickly

---

# Module Architecture

```text
Google Maps Module

│

├── Village Map

├── Destination Maps

├── Address Information

├── Coordinates

├── Open in Google Maps

└── Route Information
```

---

# Data Source

Location data is stored inside

```text
data/destinations/destinations.json
```

Village information

```text
data/village/village.json
```

---

# Route Usage

Google Maps appears on

```text
/
```

Homepage

```text
/destinations/[slug]
```

Destination Detail

```text
/contact
```

(Optional)

---

# Homepage Map

Purpose

Show the location of Nyalian Tourism Village.

Display

- Embedded Map
- Village Name
- Address
- Open in Google Maps Button

---

# Destination Map

Every destination page should display

- Embedded Google Map
- Address
- Latitude
- Longitude
- Navigation Button

---

# Map Layout

```text
Location Information

↓

Embedded Map

↓

Address

↓

Coordinates

↓

Open in Google Maps
```

---

# Embedded Map

Implementation

Responsive iframe

Example

```html
<iframe
    src="..."
    loading="lazy"
    allowfullscreen
></iframe>
```

Requirements

- Responsive width
- Rounded corners
- Lazy loading

---

# Address Section

Display

- Village
- District
- Regency
- Province
- Postal Code (optional)

Example

```text
Nyalian Tourism Village

Banjarangkan District

Klungkung Regency

Bali, Indonesia
```

---

# Coordinates

Display

Latitude

Longitude

Example

```text
Latitude

-8.543210

Longitude

115.432109
```

Coordinates should be copyable.

---

# Open in Google Maps

Provide a prominent button.

Button text

```text
Open in Google Maps
```

Click behavior

↓

Open Google Maps in a new browser tab.

---

# Route Information

Optional information

Examples

- Distance from Denpasar
- Distance from Ubud
- Estimated travel time

Example

```text
Denpasar

45 km

1 hour 15 minutes
```

This information is informational only.

---

# Nearby Destinations

Optional section.

Display nearby tourism destinations.

Maximum

```text
3 destinations
```

Each destination links to its detail page.

---

# Search Integration

Maps should update automatically based on

```text
Destination

↓

Destination Detail

↓

Destination Coordinates

↓

Embedded Map
```

No manual configuration is required.

---

# Mobile Behavior

On mobile devices

- Full-width map
- Responsive height
- Large navigation button

Touch interaction should remain smooth.

---

# Desktop Behavior

Desktop layout

```text
Location Information

↓

Map

↓

Navigation Button
```

---

# Responsive Design

Desktop

```text
16:9 map ratio
```

Tablet

```text
16:10 ratio
```

Mobile

```text
1:1 ratio
```

---

# Loading State

Display

Map placeholder

↓

Map loads automatically.

---

# Error State

If the embedded map fails

Display

```text
Unable to load the map.
```

Provide

```text
Open in Google Maps
```

button as fallback.

---

# Accessibility

Support

- Keyboard Navigation
- Screen Readers
- Accessible Button Labels

Maps should include descriptive titles.

Example

```html
title="Nyalian Tourism Village Location"
```

---

# Performance

Requirements

- Lazy Loading
- Responsive iframe
- No unnecessary JavaScript

The map should not block page rendering.

---

# Security

Always use HTTPS.

Example

```text
https://www.google.com/maps/embed
```

Never expose sensitive information.

---

# Component Structure

```text
GoogleMapSection

│

├── LocationInfo

├── AddressCard

├── Coordinates

├── EmbeddedMap

└── NavigationButton
```

---

# Data Flow

```text
Load JSON

↓

Read Coordinates

↓

Generate Embed URL

↓

Render Map

↓

Display Navigation Button
```

---

# JSON Structure

Village example

```typescript
{
  "latitude": -8.543210,
  "longitude": 115.432109,
  "address": "...",
  "googleMapsUrl": "...",
  "embedUrl": "..."
}
```

Destination example

```typescript
{
  "id": "DST001",
  "name": "...",
  "latitude": -8.543210,
  "longitude": 115.432109,
  "address": "...",
  "googleMapsUrl": "...",
  "embedUrl": "..."
}
```

---

# SEO

Location pages should support

- Local Business Schema
- Tourist Attraction Schema
- GeoCoordinates

Improve discoverability in search engines.

---

# Future Enhancements

Possible future features

- Interactive Multi-Destination Map
- Nearby Attractions
- Route Planner
- Travel Time Calculator
- GPS Location Detection
- Offline Map Support
- Geolocation-based Recommendations

Future enhancements should integrate without changing the existing architecture.

---

# Module Principles

The Google Maps Module should always prioritize

- Accurate location information
- Fast loading
- Simple navigation
- Responsive design
- Accessibility
- Performance
- Scalability

Visitors should be able to locate and navigate to destinations with minimal effort.