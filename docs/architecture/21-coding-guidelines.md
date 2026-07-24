# Coding Guidelines

## Overview

This document defines the coding standards for the Nyalian Tourism Village Website.

Every implementation should follow these rules to ensure consistency, readability, maintainability, scalability, and performance.

These guidelines apply to all source code in the project.

## Related Architecture Documents

These coding guidelines apply to every architecture document and implementation within this project.

Developers SHOULD consult the following documents together with this guideline:

- **01-tech-stack.md**
- **02-design-system.md**
- **03-folder-structure.md**
- **04-routing.md**
- **05-ui-pages.md**
- **06-components.md**
- **07-json-schema.md**
- **08-content-management.md**
- **09-features.md**
- **10-search-filter.md**
- **11-destination-module.md**
- **12-tour-package-module.md**
- **13-blog-module.md**
- **14-review-module.md**
- **15-faq-module.md**
- **16-google-maps.md**
- **17-video-gallery.md**
- **18-share-feature.md**
- **19-seo.md**
- **20-performance.md**
- **22-ui-ux-rules.md**
- **23-future-development.md**

This document defines the mandatory implementation standards that apply across the entire architecture. Every implementation MUST comply with these coding guidelines regardless of module or feature.

---

# Core Principles

Always prioritize

- Simplicity
- Readability
- Reusability
- Scalability
- Accessibility
- Performance

Avoid unnecessary complexity.

---

# General Rules

Always

- Write clean code
- Write predictable code
- Write self-explanatory code
- Prefer composition over duplication

Never

- Leave commented-out code
- Leave console.log() statements
- Leave unused imports
- Leave unused variables

---

# Language

Use

TypeScript

for every source file.

Do not use JavaScript.

---

# Type Safety

Never use

```typescript
any
```

Instead use

- proper interfaces
- types
- generics
- unknown (when necessary)

Always prefer strict typing.

---

# Naming Conventions

## Variables

Use camelCase.

Good

```typescript
destinationList
```

Bad

```typescript
Destination_List
```

---

## Functions

Use camelCase.

Example

```typescript
getDestinationBySlug()
```

---

## Components

Use PascalCase.

Example

```typescript
DestinationCard
```

---

## Interfaces

Use PascalCase.

Example

```typescript
Destination
```

Avoid prefixing interfaces with

```text
I
```

Bad

```typescript
IDestination
```

---

## Types

Use PascalCase.

Example

```typescript
DestinationCardProps
```

---

## Constants

Use UPPER_SNAKE_CASE.

Example

```typescript
MAX_DESTINATIONS
```

---

## File Names

Use kebab-case.

Example

```text
destination-card.tsx

search-bar.tsx

package-filter.tsx
```

---

## Folder Names

Use lowercase.

Example

```text
components

lib

hooks

utils
```

---

# Component Guidelines

Each component should have

- One responsibility
- Small size
- Clear API

Avoid components exceeding

```text
200 lines
```

Split large components into smaller ones.

---

# Props

Always define props using interfaces.

Example

```typescript
type DestinationCardProps = {
  destination: Destination;
};
```

Avoid passing unnecessary props.

---

# React Components

Prefer

Function Components

Never use

Class Components.

---

# Hooks

Use React Hooks only when necessary.

Avoid unnecessary

- useEffect
- useState

Prefer derived state.

---

# Server Components

Default to

Server Components.

Only use

```text
"use client"
```

when required.

---

# Client Components

Use only for

- Search
- Filters
- Carousel
- Modal
- Lightbox
- Interactive Forms

Everything else should remain server-rendered.

---

# State Management

Prefer

Local State

Avoid global state unless absolutely necessary.

Do not install Redux or similar libraries.

---

# Functions

Functions should

- Perform one task
- Return predictable results
- Avoid side effects

---

# Comments

Comments should explain

Why

not

What

Avoid obvious comments.

Bad

```typescript
// increment count
count++;
```

---

# Imports

Order

1. React
2. Next.js
3. External Libraries
4. Internal Components
5. Hooks
6. Utilities
7. Types

Separate groups with one empty line.

---

# Styling

Use

Tailwind CSS

Avoid

Inline styles.

---

# CSS Classes

Group classes logically.

Example

```text
Layout

↓

Spacing

↓

Typography

↓

Colors

↓

Effects
```

---

# Icons

Use

Lucide React

throughout the project.

Avoid mixing icon libraries.

---

# Images

Always use

```text
next/image
```

Never use

```html
<img>
```

unless absolutely required.

---

# Links

Use

```typescript
next/link
```

for internal navigation.

---

# Forms

Validate

- Required fields
- Email
- Phone Number

Display clear validation messages.

---

# Error Handling

Always handle

- Missing JSON
- Invalid Slug
- Missing Images

Never crash the UI.

---

# Security Guidelines

## General Secure Coding Principles

Security is a shared responsibility across all layers of the application. Every developer MUST consider security implications when writing code.

**Core Principles**

- **Principle of Least Privilege:** Every feature, component, and function MUST operate with the minimum permissions or data access required to complete its task.
- **Defense in Depth:** Never rely on a single security control. Use multiple layers of validation, encoding, and access control.
- **Fail Securely:** When security controls fail, the application MUST deny access by default, not grant it.
- **Security by Design:** Security considerations MUST be part of the initial design, not added later.

## Input Validation & Sanitization

All user input MUST be validated and sanitized before use.

**Validation Rules**

- All form inputs MUST be validated against expected type and format (e.g., using Zod schemas defined in validation documents).
- All URL parameters MUST be validated before use (e.g., destination ID, page number).
- All query string parameters MUST be checked for expected format and value ranges.
- Reject overly large inputs that could cause performance issues (e.g., search queries exceeding reasonable length).
- Validate file names and paths before accepting user-provided file uploads or references.

**Sanitization Rules**

- Never trust user input as safe. Treat all external input as untrusted by default.
- Sanitize all data before storing or processing it.
- Use schema validation (Zod) to enforce expected data shapes and constraints.
- Reject unexpected or malformed data explicitly rather than attempting to repair it.

**Example**

```typescript
// Good: Validate using Zod schema
const searchSchema = z.object({
  q: z.string().max(100),
  page: z.number().int().min(1).max(1000),
});

const validated = searchSchema.parse(userInput);
```

## Output Encoding & XSS Prevention

All dynamic content rendered in HTML MUST be properly encoded to prevent Cross-Site Scripting (XSS) attacks.

**Encoding Rules**

- Always use React's automatic escaping by default (React escapes JSX content automatically).
- Never use `dangerouslySetInnerHTML` unless absolutely necessary, and only with content you fully control.
- Always encode user-generated content before rendering (use a sanitization library if HTML formatting is required).
- Encode URLs in `href` attributes to prevent `javascript:` protocol injections.
- Encode attribute values in single/double quotes.

**Example**

```typescript
// Good: React escapes automatically
<p>{userContent}</p>

// Bad: Do not use dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// Good: If HTML formatting is required, sanitize first
import DOMPurify from "isomorphic-dompurify";
const cleanHTML = DOMPurify.sanitize(userContent);
```

## Safe Handling of User-Generated Content

If the application ever accepts user-generated content (e.g., reviews, comments, file uploads), it MUST be handled securely.

**Content Rules**

- All user-generated content MUST be validated for type, length, and format.
- All user-generated content MUST be sanitized before storage.
- All user-generated content MUST be re-sanitized before display (encode or sanitize on output).
- Store user-generated content separately from trusted system data.
- Never execute or interpret user-generated content as code or configuration.

## Secure Handling of External URLs & Third-Party Resources

The application MUST carefully control which external URLs and resources are trusted.

**URL Validation Rules**

- Never blindly follow user-provided redirects. Validate redirect destinations are within your domain.
- Use URL validation (e.g., Zod with `.url()` constraint) for any URL accepted from users.
- Whitelist domains for third-party resources (scripts, stylesheets, iframes, images).
- Use HTTPS only for external resources; reject HTTP resources in production.

**Third-Party Resource Rules**

- Minimize the number of third-party scripts included (each is a security risk).
- Only include third-party scripts from trusted vendors with established security practices.
- Review third-party dependencies regularly for security vulnerabilities.
- Use Subresource Integrity (SRI) for critical third-party resources when possible.

**iframe Restrictions**

- Never embed untrusted iframes.
- Only embed iframes from whitelisted domains (e.g., YouTube for video galleries).
- Use `sandbox` attributes to restrict iframe capabilities.

**Example**

```typescript
// Good: Use URL validation
const videoSchema = z.object({
  youtubeId: z.string().regex(/^[a-zA-Z0-9_-]{11}$/),
});

// Good: iframe with sandbox
<iframe
  src="https://www.youtube.com/embed/..."
  sandbox="allow-presentation"
  title="Video"
/>
```

## File Upload Security Principles

If the application ever accepts file uploads (e.g., admin image uploads), these MUST be handled securely.

**File Validation Rules**

- All files MUST be validated for type (check MIME type and file signature, not just extension).
- All files MUST be validated for size (enforce reasonable file size limits).
- All files MUST have file names sanitized to remove path traversal characters (e.g., `../`, `..\\`).
- Reject files with suspicious names or extensions (e.g., `.exe`, `.sh`, `.bat`).

**File Processing Rules**

- Process uploaded files in isolation (e.g., in a temporary directory or separate service).
- Never execute or interpret uploaded files as code.
- Store uploaded files outside the web root or in a protected directory (e.g., not directly in `/public/`).
- Rename uploaded files to remove any user-provided naming (use a generated UUID or hash).
- Validate file contents before accepting (e.g., re-encode images to prevent polyglot attacks).

**Example**

```typescript
// Good: Validate file type and size
const fileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type))
    .refine((file) => file.size <= 5 * 1024 * 1024), // 5MB max
});

// Good: Sanitize file name
const sanitizedName = generateUUID() + ".jpg"; // Generate new name
```

## JSON Data Integrity & Safe File Operations

The application uses JSON files as its primary data store. File operations MUST be performed safely.

**File Operation Rules**

- All JSON reads MUST include error handling for missing or corrupted files.
- All JSON writes MUST use atomic operations (write to temp file, then rename) to prevent partial writes.
- All JSON data MUST be validated before storage (validate against schema).
- Never trust the content of JSON files; validate all data read from storage.
- Implement file locking or concurrency control to prevent race conditions (documented in `04-storage-strategy.md`).

**Data Integrity Rules**

- All JSON data MUST conform to the schema defined for that content type.
- All JSON data MUST be validated on read and write.
- Never allow untrusted data to be written directly to JSON files without validation.

**Example**

```typescript
// Good: Validate before write
const validatedData = articleSchema.parse(incomingData);
await storage.write(validatedData); // Atomic write

// Good: Handle read errors
try {
  const data = await storage.read();
} catch (error) {
  logger.error("Failed to read content file", { error });
  throw new ApplicationError("Content unavailable");
}
```

## Error Handling Without Information Disclosure

Error messages MUST NOT expose sensitive information to clients.

**Error Handling Rules**

- All error messages shown to users MUST be generic and non-revealing (e.g., "Invalid request" not "File not found at /content/articles.json").
- Internal error details (stack traces, file paths, database queries) MUST be logged server-side only, never sent to clients.
- All error responses MUST follow the standard error response contract defined in `19-api-overview.md`.
- Status codes MUST be appropriate but MUST NOT leak information (e.g., distinguish between 403 Forbidden and 404 Not Found only when safe to do so).

**Example**

```typescript
// Good: Generic error message to user
console.error("Unexpected error:", error); // Log details
throw new ApplicationError("Unable to process request"); // Generic to user

// Good: Standard error response
return { error: "NOT_FOUND", message: "Destination not found" };
```

## Secure Logging Principles

Logging is essential for debugging and security monitoring, but MUST NOT expose sensitive information.

**Logging Rules**

- NEVER log passwords, API keys, session tokens, or authentication credentials.
- NEVER log personally identifiable information (PII) unless absolutely necessary and compliant with privacy regulations.
- NEVER log the full content of uploaded files or user-generated content.
- MUST log security-relevant events (authentication failures, authorization rejections, input validation failures).
- MUST log error stack traces server-side for debugging, but never expose to clients.
- Log statements MUST be removed from production code (use a logging library with environment-based levels).

**Example**

```typescript
// Good: Log security events without exposing secrets
logger.warn("Authentication failed", { userId, timestamp });

// Bad: Never log sensitive data
logger.info("User login", { email, password }); // WRONG

// Good: Use structured logging
logger.error("File operation failed", {
  operation: "read",
  file: "destinations.json",
  error: error.message,
});
```

## HTTP Security Requirements

The application MUST enforce security headers at the HTTP level in production environments.

**Required Security Headers**

| Header | Purpose |
|---|---|
| `Content-Security-Policy` | Restricts sources of content (scripts, styles, images) to prevent XSS. MUST define a strict policy that only allows content from trusted sources. |
| `X-Frame-Options` | Prevents clickjacking attacks by controlling whether the page can be embedded in iframes. MUST be set to `DENY` or `SAMEORIGIN`. |
| `X-Content-Type-Options` | Prevents MIME type sniffing attacks. MUST be set to `nosniff`. |
| `Referrer-Policy` | Controls how much referrer information is leaked in HTTP requests. MUST be set to `strict-origin-when-cross-origin` or stricter. |

**Implementation Location**

Security headers MUST be configured in the Next.js application (typically in `next.config.js` or middleware) per deployment guidelines documented in `05-deployment.md`.

## External Resource Policy

Third-party and external resources present security risks and MUST be carefully managed.

**Third-Party Script Rules**

- MUST only include third-party scripts from well-established, trusted vendors.
- MUST review third-party scripts for security practices and vulnerability history.
- MUST use HTTPS only; reject HTTP scripts in production.
- SHOULD use npm/package manager for script dependencies (not inline CDN links if possible).
- MUST re-audit third-party scripts periodically for updates and vulnerabilities.

**External Image & Media Rules**

- MUST validate image URLs before rendering (whitelist trusted domains).
- MUST use Next.js `Image` component for images (provides built-in security and performance).
- MUST use `alt` text for all images (required by accessibility standards).
- External images SHOULD be validated for content (size, format) before caching.

**Iframe Embedding Rules**

- MUST only embed iframes from whitelisted domains (e.g., YouTube, Google Maps).
- MUST use `sandbox` attribute to restrict iframe capabilities (e.g., `sandbox="allow-presentation"`).
- MUST validate iframe source URLs before embedding.

**Example**

```typescript
// Good: Whitelist trusted domains
const TRUSTED_VIDEO_DOMAINS = ["youtube.com", "vimeo.com"];

const isValidVideoUrl = (url: string) => {
  const urlObj = new URL(url);
  return TRUSTED_VIDEO_DOMAINS.some((domain) =>
    urlObj.hostname.includes(domain)
  );
};

// Good: Sandbox iframe
<iframe src={validatedUrl} sandbox="allow-presentation" title="Video" />
```

## Implementation Rules

**Mandatory Compliance**

Every new feature, module, component, API endpoint, and content processing logic MUST comply with these security guidelines before being considered complete. Security is not optional.

**Scope of Application**

These guidelines apply to:
- All React components and pages.
- All API Route Handlers and Server Actions.
- All Service layer logic and data transformations.
- All Storage layer implementations and file operations.
- All form validation and input handling.
- All third-party integrations and external resources.
- All error handling and logging.

**Verification**

Before code review or deployment:
- Verify all inputs are validated against expected type and format.
- Verify all user-generated content is sanitized before output.
- Verify no sensitive information is exposed in error messages or logs.
- Verify all external resources are from whitelisted, trusted sources.
- Verify all file operations use atomic patterns and error handling.

**Related Documentation**

- **`06-security.md`** — Comprehensive security requirements and threat model analysis.
- **`19-api-overview.md`** — API response contract and error response standards.
- **`04-storage-strategy.md`** — Atomic file operations and concurrency control.
- **`05-deployment.md`** — Production security configuration and deployment best practices.

---

# JSON

JSON files should

- Be normalized
- Avoid duplicated data
- Use IDs
- Be formatted consistently

Use

2-space indentation.

---

# Accessibility

Every interactive element should support

- Keyboard Navigation
- Focus Indicators
- Screen Readers

Images must include

Alt Text.

---

# Performance

Always

- Lazy load heavy components
- Optimize images
- Use dynamic imports when appropriate

Avoid unnecessary re-renders.

---

# Responsive Design

Develop

Mobile First.

Every page should support

- Mobile
- Tablet
- Desktop

---

# SEO

Every new page should include

- Metadata
- Open Graph
- Canonical URL

Use

generateMetadata()

when applicable.

---

# Component Structure

Recommended order

```text
Imports

↓

Types

↓

Constants

↓

Component

↓

Helper Functions

↓

Export
```

---

# Folder Responsibility

Each folder should have one clear purpose.

Avoid placing unrelated files together.

---

# Utility Functions

Utilities should be

- Pure
- Reusable
- Independent

Avoid accessing UI inside utilities.

---

# Reusability

Before creating a new component,

check whether an existing component can be reused.

Avoid duplication.

---

# Testing

Before considering a feature complete,

verify

- No TypeScript errors
- No ESLint errors
- Responsive layout
- Accessibility
- Performance

---

# AI Coding Rules

When generating code,

always

- Prefer simplicity
- Follow existing architecture
- Reuse components
- Use strict typing
- Keep components modular

Never

- Introduce unnecessary dependencies
- Duplicate logic
- Ignore TypeScript errors
- Ignore ESLint warnings

---

# Code Review Checklist

Before submitting code,

verify

- Consistent naming
- Strong typing
- Responsive layout
- Accessibility
- SEO compatibility
- Performance impact
- Reusability
- Readability

---

# Future Scalability

Every implementation should allow

- Additional destinations
- Additional packages
- Additional languages
- Additional modules

without requiring architectural changes.

---

# Module Principles

The project should always prioritize

- Clean Architecture
- Maintainability
- Scalability
- Performance
- Accessibility
- Consistency

Code should be written for future developers as much as for the current implementation.