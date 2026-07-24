# 14 - Image Management

## 1. Purpose

This document defines how images are handled within the Articles module: upload, processing, naming, storage, validation, accessibility, and security. It applies the general storage strategy (`04-storage-strategy.md`) and security rules (`06-security.md`) to the specific case of Articles, and complements the editor experience defined in `13-article-editor.md`. The decisions in this document are locked for v1 and must be implemented exactly as specified.

## 2. Upload

- Administrators upload images directly from the dashboard — via the Cover Image field and via inline uploads inside the Tiptap editor (`13-article-editor.md`, Section 9).
- **Supported formats**: JPG, JPEG, PNG, WEBP.
- **All other file types are rejected** at upload time, before any processing occurs.

### 2.1 Upload Validation

The upload validation layer enforces the following checks before any processing or storage occurs:

- **File size**: Maximum upload size is **5 MB**. Uploads exceeding this limit are rejected with an appropriate error message.
- **File type (MIME type)**: Client-declared MIME type is recorded but never trusted as the sole validation mechanism.
- **File type (magic number)**: The actual file content is validated using the `file-type` package, which inspects file magic numbers (byte signatures) to confirm the uploaded file is a genuine JPEG, PNG, WEBP, or GIF variant. This check is performed before any processing and prevents uploads of misnamed or disguised files.
- **Maximum image dimensions**: Images are validated to ensure they do not exceed **4096 × 4096 pixels**. Images exceeding these dimensions are rejected before processing.
- **Overwrite prevention**: Uploads never replace existing files in the article's image folder. When the cover image is re-uploaded or inline images are replaced, the system generates a new filename with a unique identifier or timestamp component to prevent overwriting. The previous file remains as an archive (see Section 5).

All validation occurs before the image enters the processing pipeline (Section 3, Step 1). A file that fails any validation check is rejected and is never written to disk.

### 2.2 SVG Policy

SVG image uploads are **not allowed in v1**. Only raster image formats (JPG, JPEG, PNG, WEBP) are supported. This decision is made for security reasons (see `06-security.md` for the security rationale behind this restriction). SVG support may be considered in a future version if security concerns can be adequately mitigated.

## 3. Processing

Every uploaded image is processed automatically using **Sharp**, following this pipeline in order:

1. **Validate the image file** (Section 2.1).
2. **Remove EXIF metadata** to strip sensitive information (timestamps, GPS location, camera model, etc.) from the image file.
3. **Normalize the image** (correct color space, remove unsupported color profiles) to ensure consistent rendering across browsers and devices.
4. **Resize if necessary**, per the applicable maximum dimensions (cover images and inline images are resized to their target display dimensions if they exceed those bounds).
5. **Compress** to reduce file size while maintaining visual quality.
6. **Convert to WebP**, regardless of the original uploaded format, to leverage modern compression and browser support.
7. **Save the optimized version** to the article's image folder (Section 5).

### 3.1 Sharp Processing Pipeline

The Sharp library performs the actual image transformation as follows:

- All input formats (JPG, JPEG, PNG, WEBP) are read and decoded by Sharp into an intermediate representation.
- Metadata (EXIF, ICC profiles) is stripped during processing.
- Color space is normalized to sRGB to ensure predictable rendering.
- Resizing (if needed) uses high-quality resampling algorithms.
- Compression is applied with WebP quality set to balance file size and visual fidelity.
- The final output is always a WebP file, regardless of input format.

### 3.2 Failure Handling

If Sharp fails to process an image (e.g., corrupted image data, unsupported color space, or out-of-memory conditions), the image is treated as invalid:

- The processing attempt is aborted.
- Any temporary files created during processing are immediately cleaned up (see Section 3.4).
- The upload is rejected with an error message indicating the file could not be processed.
- No partial or intermediate file is written to storage.

### 3.3 Unsupported or Corrupted Images

A file is considered unsupported or corrupted if:

- It claims to be an image format but cannot be decoded by Sharp.
- The file magic number indicates a format other than JPEG, PNG, or WEBP (even if the file extension suggests otherwise).
- The image dimensions, color depth, or internal structure are malformed.

Such files are rejected during validation (Section 2.1) or during processing (Section 3). In either case, no part of the file is stored.

### 3.4 Temporary File Cleanup

During processing, Sharp may create temporary files or buffers. On any processing or storage failure:

- All temporary files are deleted immediately.
- File descriptors and streams are closed to free system resources.
- The article's image folder remains unaffected; only successfully processed images are written to it.

No unprocessed file is ever written to storage. Every stored image has passed through this full pipeline.

## 4. Naming

- **The administrator never chooses filenames.**
- The system automatically generates filenames using a deterministic naming strategy, for example:
  - `cover.webp`
  - `article-1.webp`, `article-2.webp` (inline content images, sequentially numbered)
  - `gallery-1.webp`, `gallery-2.webp` (if applicable to a future gallery-style use)
- Filenames are generated to **avoid collisions** — each new inline image receives the next available sequential identifier within its article folder, and the cover image always occupies the fixed `cover.webp` slot.
- The original client-supplied filename is discarded entirely; it is never used to construct the stored filename.

## 5. Storage

- Article images are stored inside a **dedicated folder per article**:

```
public/images/articles/{slug}/
  cover.webp
  article-1.webp
  article-2.webp
```

- **Old images are never automatically deleted.** When a cover image is replaced or an inline image is removed from the content, the previous file remains in the article's folder as an archive.
- Archived images are only removed when the administrator **explicitly** deletes them (e.g. via the Media Library, `18-media-library.md`).
- This archival approach means an article's image folder may contain more files than are currently referenced by the article's `content` or `coverImage` field at any given time; the currently active image(s) are always determined by what the article record references, not by what exists in the folder.

## 6. Validation Summary

Validation is a two-stage process:

1. **Pre-processing validation** (Section 2.1): File size, MIME type, magic number, dimensions, and overwrite prevention are checked before any image processing begins.
2. **Processing validation** (Section 3.2–3.3): If Sharp encounters corrupted image data or unsupported formats during processing, the image is rejected and temporary files are cleaned up.

Validation occurs before processing; a file that fails any check never proceeds to resize, compression, or conversion. The security principles and rationale for this validation strategy are detailed in `06-security.md`, Sections 7–9.

## 7. Accessibility

- Every image supports **optional alt text**, captured at the point of upload (cover image field and inline image insertion within the editor).
- **Publishing warns if important images have no alt text** — specifically the cover image and any inline content images — per the publish-time checks defined in `15-article-publishing.md`. This is a warning, not a hard validation block; the administrator may proceed without alt text if they choose.

## 8. Security

- **Path traversal is prevented.** File paths are always constructed server-side from validated, known-safe components (article `slug`/`id` and the system-generated filename), never from raw client input.
- **Executable uploads are prevented.** Only the four supported raster image formats (Section 2) pass validation; any other file type, including disguised executables, is rejected based on actual file content inspection (magic number validation, Section 2.1), not extension alone. SVG uploads are explicitly blocked for security reasons (Section 2.2).
- **Client-provided filenames are never trusted.** As stated in Section 4, the original filename is discarded and has no bearing on the stored file's name or location.
- **EXIF metadata is stripped.** All sensitive metadata is removed during processing (Section 3.1) to prevent information leakage.
- All upload handling follows the shared file-upload and filesystem security rules defined in `06-security.md`, Sections 7–9. For the full security rationale behind format restrictions, validation rules, and metadata handling, refer to that document.

## 9. Out of Scope for v1

The following are explicitly not implemented in v1:

- Image cropping
- Image editing
- Automatic watermarking
- CDN optimization

## 10. Summary

Article images are uploaded directly from the dashboard in JPG, JPEG, PNG, or WEBP format (SVG is not supported in v1). Uploads are validated in two stages: file size (5 MB max), MIME type, magic number inspection using `file-type`, and image dimensions (4096 × 4096 max) are checked before processing; Sharp processing is rejected if the image is corrupted or unsupported. All valid images are processed through Sharp to remove EXIF metadata, normalize color space, resize as needed, compress, and convert to WebP. The optimized WebP file is stored under a system-generated filename inside a dedicated per-article folder, preventing overwrites and collisions. Old images are retained as archives rather than automatically deleted, giving administrators explicit control over cleanup via the Media Library. Temporary files are cleaned up on any failure. All stored images have passed the full validation and processing pipeline. Uploads are protected against path traversal, executable upload attacks, and untrusted filenames through server-side path construction and magic number validation. Alt text is optional but recommended, with a publish-time warning if missing from key images. For full security rationale, see `06-security.md`.