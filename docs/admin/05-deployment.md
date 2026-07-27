# 05 - Deployment

## 1. Purpose

This document defines how the Nyalian Tourism Village website — including the public site and the Admin Dashboard — is deployed, run, and kept available in production. It builds on the storage strategy (`04-storage-strategy.md`) and authentication design (`03-authentication.md`), both of which impose specific deployment requirements. The decisions in this document are locked for v1 and must be implemented exactly as specified.

## 2. Deployment Target

- **Node.js hosting** (e.g. Rumahweb, Hostinger, IDCloudHost, or an equivalent Node.js-capable host).
- The application requires a **persistent filesystem**, since the Admin Dashboard performs real server-side writes to `/content` and `/public/images` (per `04-storage-strategy.md`). Serverless or edge platforms with ephemeral/read-only filesystems are not used.

## 3. Runtime Architecture

- The application runs as a **single Node.js process**.
- **No clustering.** The process is not forked or scaled across multiple workers.
- **No load balancer.** All traffic is served by the single running instance.
- **No Redis** or other external in-memory store. Session storage (`03-authentication.md`, Section 7) and any in-process rate-limit state (`03-authentication.md`, Section 8) live within the single Node.js process's memory.

This single-process model is sufficient for the expected scale (one administrator, moderate content volume) and keeps the deployment simple, with no distributed state to coordinate.

## 4. Authentication in Production

Consistent with `03-authentication.md`:

- `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` are stored in the production `.env` file.
- Passwords are hashed with **bcrypt**.
- Authentication uses **server-side sessions** referenced by a **signed, HTTP-only cookie**.
- Because the runtime is a single Node.js process (Section 3), server-side session state requires no external session store — it lives in the same process handling requests.

## 5. Initial Setup

The administrator account is provisioned **before** the application is deployed:

1. Generate a bcrypt hash of the chosen administrator password.
2. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` in the production `.env` file, alongside the other required variables (`07-environment-variables.md`).
3. Deploy the application with this `.env` file already in place.

There is **no registration page** and no in-app account creation flow. The administrator account exists only through this manual setup process.

## 6. Rendering Strategy

- The public website is a **static website** built with Next.js, using **Incremental Static Regeneration (ISR)**.
- Content pages are **not server-side rendered**. No route relies on per-request SSR for public content.
- After any Article **Create, Update, Delete, Publish, or Unpublish** operation, the affected public paths are explicitly revalidated using `revalidatePath()`, so the static cache is refreshed immediately rather than waiting for a timed revalidation window.
- Revalidation targets, at minimum: the article's own detail page and any listing/index pages that include it (e.g. the articles index, the homepage if it surfaces recent articles).
- This revalidation call is triggered from within the Articles API routes (`20-api-articles.md`) as part of the same request that performs the write, not as a separate background step.

## 7. Image Processing

- **Sharp** is used to process all uploaded images before they are written to `/public/images`.
- On upload, images are:
  - **Resized** to enforce sane maximum dimensions.
  - **Compressed** to reduce file size.
  - **Converted to WebP**, regardless of the original uploaded format (subject to the allowed input formats defined in `06-security.md`, Section 6).
- This processing happens server-side, after upload validation and before the file is written to its final path, consistent with the image lifecycle defined in `14-article-image.md`.
- Because all stored images are normalized to WebP, file extensions referenced in stored paths (e.g. `cover.webp`) are consistent and predictable across the Articles module and any future image-handling module.

## 8. Process Management

The Next.js application runs as a persistent Node.js process managed by a process manager (e.g. PM2, or the hosting provider's built-in Node.js application manager), responsible for:

- Starting the application using the production start command after build.
- Automatically restarting the process if it crashes.
- Restarting the process on server reboot.
- Providing access to application logs.

## 9. Reverse Proxy & HTTPS

- A reverse proxy (Nginx, LiteSpeed, or the hosting panel's built-in proxy) sits in front of the Node.js process.
- **HTTPS is managed by the hosting provider or reverse proxy** (e.g. via Let's Encrypt or the provider's own certificate management), not by the Node.js application itself.
- The application assumes it is always served over HTTPS in production, consistent with the cookie security requirements in `03-authentication.md` and `06-security.md`.

## 10. Build & Release Process

1. **Install dependencies** (`npm install`).
2. **Build the application** (`next build`).
3. **Preserve persistent data directories** — `/content` and `/public/images` are never overwritten, deleted, or replaced by the deployment process, since they hold live production content.
4. **Retain the previous build** before deploying the new one (Section 12).
5. **Start/restart the application** via the process manager.
6. **Run the production checklist** (Section 14) to confirm the deployment is healthy.

Deployment scripts and any `.gitignore`/`.deployignore` configuration must explicitly exclude `/content` and `/public/images` from being replaced by the deployed application bundle.

## 11. Backup & Recovery Policy

### 11.1 Automated Backups

- **Daily automatic backups** of `/content` and `/public/images` are taken at a fixed time (e.g., 00:00 UTC), configured at the hosting/infrastructure level.
- Backups are **retained for 7 days**, after which older backups are rotated out.
- Backup scheduling and retention are coordinated with the hosting provider's available backup tooling (e.g., cPanel Backup, Plesk Backup Manager, or provider-specific backup APIs).
- Each backup includes:
  - All JSON files in `/content` (article metadata and content).
  - All image files in `/public/images` (cover images, inline images, archives).

### 11.2 Backup Verification

- **After each backup is created**, the integrity of the backup is verified:
  - A checksum (MD5 or SHA256) of each backup archive is computed and logged.
  - The backup file is inspected to confirm it is not empty, truncated, or corrupted.
  - Verification logs are retained and reviewed periodically to detect backup failures.
- If a backup fails verification, the hosting provider's support team is notified immediately; a failed backup is not considered reliable for recovery purposes.

### 11.3 Manual Restore Procedure

In the event of data loss or accidental changes, a restore is performed as follows:

1. **Assess the scope**: Determine whether recovery is needed for `/content`, `/public/images`, or both.
2. **Identify the backup**: Select the appropriate backup date and time based on when the data was last known to be correct.
3. **Stop the application**: Bring the application offline via the process manager to prevent conflicts during the restore.
4. **Restore the backup**:
   - Extract the selected backup archive to a temporary staging directory (e.g., `/tmp/restore-TIMESTAMP/`).
   - Verify that the restored files are readable and intact (check file counts, file sizes, and sample file integrity).
5. **Swap the directories**: Atomically replace the current `/content` and/or `/public/images` with the restored version (using `mv` for atomic rename on the same filesystem).
6. **Verify the restore**: Inspect a sample of restored files to confirm they are correct (read JSON files, verify image dimensions, check timestamps).
7. **Restart the application**: Bring the application back online via the process manager.
8. **Test the application**: Run the production checklist (Section 14) to confirm that the application is functioning correctly with the restored data.

### 11.4 Partial Restore

A partial restore (restoring only `/content` or only `/public/images`) follows the same procedure as Section 11.3, but only one directory is restored:

- **Restore `/content` only**: Restores article metadata and content while preserving the current state of uploaded images.
- **Restore `/public/images` only**: Restores images while preserving the current state of article metadata.

This is useful when only one component has been corrupted or inadvertently deleted.

### 11.5 Rollback if Restore Fails

If a restore operation fails or introduces unexpected issues:

1. **Stop the application immediately** to prevent data inconsistency.
2. **Assess the failure**: Determine whether the restore introduced new corruption, incomplete restoration, or read/write errors.
3. **Restore from an earlier backup**: Select a backup from before the initial failed restore and repeat the restore procedure (Section 11.3).
4. **Verify thoroughly**: After restoring from an earlier backup, run full integrity checks (Section 11.6) before restarting the application.
5. **If restoration still fails**: Escalate to the hosting provider's support team; this indicates a systemic problem requiring infrastructure-level intervention.

Because writes to `/content` use the atomic write pattern defined in `04-storage-strategy.md`, Section 8, a failed write never corrupts the last known-good file; backup and restore operations must maintain the same atomic approach to preserve data integrity.

### 11.6 Integrity Verification Before Production Return

Before returning the application to production after a restore, the following integrity checks are performed:

- All JSON files in `/content` are readable and parse correctly without syntax errors.
- All image files in `/public/images` are readable and are not truncated or corrupted (check file headers, image dimensions via Sharp).
- Article records reference images that exist in the restored `/public/images` folder.
- The application can successfully read and display restored content without file-not-found or parse errors.
- A sample article is rendered on both the public site and the Admin Dashboard to confirm full functionality.

## 12. Rollback Strategy

### 12.1 Application Rollback

- **The previous build is always retained before deploying a new one.** If a deployment introduces a regression (e.g., broken authentication, broken article CRUD, broken image upload), the process manager is pointed back to the previous build to restore service immediately.
- The rollback decision should be made quickly: if the production checklist (Section 14) fails on a newly deployed build, roll back rather than troubleshooting in production.
- Once rolled back to the previous build, the new build is investigated offline before another deployment attempt.

### 12.2 Data Rollback

- **Data rollback is handled separately via the daily backups (Section 11).** Application rollback never affects `/content` or `/public/images`, since these directories are never part of the deployed build artifact.
- If data has been corrupted, deleted, or inadvertently changed, follow the restore procedures in Section 11.3 or 11.4.
- A data rollback is independent of an application rollback; either operation can be performed alone.

## 13. Disaster Recovery

### 13.1 Corrupted JSON Files

If one or more JSON files in `/content` become corrupted (unreadable, malformed syntax, or incomplete):

1. **Identify the affected files** by reviewing application logs and attempting to read the files directly (e.g., with `cat` or a JSON validator).
2. **Stop the application** to prevent further read/write attempts on corrupted files.
3. **Isolate the corrupted file** to a separate directory for forensic analysis (optional).
4. **Restore from the most recent backup** using the procedure in Section 11.3 or 11.4.
5. **Verify all JSON files parse correctly** (Section 11.6) before restarting the application.

Because writes to `/content` use atomic file operations (see `04-storage-strategy.md`, Section 8), corruption is typically limited to a single file and detected immediately on read.

### 13.2 Interrupted Deployments

If a deployment is interrupted (e.g., network failure, process kill, or disk full) before it completes:

1. **Verify the current application state**: Check whether the process manager has the old or new build running.
2. **If the old build is still running**: The deployment failed before the build was activated; no data is affected. Clean up any incomplete build artifacts and retry the deployment from the start.
3. **If the new build is partially deployed**: The process manager may be pointing to an incomplete build. Stop the application immediately.
4. **Complete or roll back the deployment**:
   - If the build can be recovered and completed (e.g., dependencies can be re-installed), continue the deployment.
   - Otherwise, remove the incomplete build and roll back to the previous build (Section 12.1).
5. **Verify persistent directories** (`/content` and `/public/images`) are unchanged and intact.
6. **Restart the application** and run the production checklist (Section 14).

### 13.3 Failed Image Processing or Storage

If image upload, processing, or storage fails during the upload operation:

1. **Check application logs** to determine the failure point: upload received, validation passed, Sharp processing failed, or storage failed.
2. **If Sharp processing failed** (Section 7, `14-article-image.md`):
   - The image file is rejected; temporary files are cleaned up automatically.
   - The user receives an error message; no partial file is stored.
   - Retry the upload with a different image or a corrected version of the original.
3. **If storage failed** (disk full, permissions issue, filesystem error):
   - The processed image cannot be written to `/public/images`.
   - Temporary files are cleaned up automatically.
   - Check disk space and file permissions on `/public/images`; resolve the underlying issue and retry the upload.
4. **If the application crashes during image processing**:
   - The process manager restarts the application automatically (Section 8).
   - Temporary files from the failed upload are cleaned up on the next startup.
   - Verify that `/public/images` is intact and contains no partial or corrupted files.

All image upload failures are logged (see `06-security.md`, Section 11) for audit and troubleshooting purposes.

### 13.4 Integrity Verification Before Production Return

After any disaster recovery action (restore from backup, application rollback, or crash recovery), the following integrity checks are performed before the application is returned to production:

- All JSON files in `/content` parse correctly and contain valid article data.
- All image files in `/public/images` are readable and are not truncated (check file headers and dimensions).
- Article records reference images that exist in `/public/images`.
- Authentication works correctly with the configured administrator credentials.
- Article CRUD (create, read, update, delete) operations succeed without errors.
- File upload works correctly (upload, validation, Sharp processing, storage).
- The public site renders correctly with the restored or recovered data.
- Publish and unpublish operations work correctly and trigger cache revalidation.
- Application logs show no errors during startup and normal operation.

## 14. Logging

- Application logs are written to a **non-public logs directory** — not under `/public`, and not directly servable by the web server.
- Logs include authentication events and content mutation events, per `06-security.md`, Section 11, and are excluded from any deployment step that would expose or overwrite them.
- Logs are accessible via the process manager or directly on the server for troubleshooting, and are subject to the same access restrictions as the rest of the non-public application directory.
- Log files are preserved across deployments (not deleted or overwritten by the deployment process).

## 15. Production Checklist

Before considering a deployment complete, the following are verified:

### 15.1 Environment & Configuration

- [ ] All required environment variables are configured correctly (`07-environment-variables.md`).
- [ ] `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` are present in the `.env` file.
- [ ] Database connection strings (if any) are correct.
- [ ] File paths (`/content`, `/public/images`) are correct and accessible.
- [ ] `/public/images` is writable by the application process (write test file, then delete).
- [ ] `/content` is writable by the application process (write test file, then delete).
- [ ] Build completes successfully (`next build` exits with status 0).
- [ ] No build errors or warnings appear in the build output.

### 15.2 Authentication & Dashboard

- [ ] The Admin Dashboard loads without errors (dashboard homepage accessible).
- [ ] Login page is displayed when unauthenticated.
- [ ] Administrator can authenticate with the configured credentials.
- [ ] Sessions persist correctly across requests.
- [ ] Logout clears the session and redirects to login.
- [ ] Unauthenticated access to protected routes is blocked.

### 15.3 Article CRUD

- [ ] **Create**: New articles can be created, saved, and appear in the article list.
- [ ] **Read**: Existing articles can be opened, viewed, and display correct data.
- [ ] **Update**: Articles can be edited, changes are saved, and updates appear in the list.
- [ ] **Delete**: Articles can be deleted and are removed from the article list.
- [ ] Article validation works (e.g., title and slug are required; invalid inputs are rejected).
- [ ] Slug generation and validation prevent duplicates.

### 15.4 Image Upload & Processing

- [ ] Image upload form is displayed and functional in the article editor.
- [ ] Supported formats (JPG, JPEG, PNG, WEBP) upload successfully.
- [ ] Unsupported formats (SVG, GIF, BMP, etc.) are rejected with an error message.
- [ ] Oversized uploads (>5 MB) are rejected.
- [ ] Oversized images (>4096 × 4096 pixels) are rejected.
- [ ] Corrupted or malformed image files are rejected.
- [ ] Uploaded images are processed correctly: resized, compressed, and converted to WebP.
- [ ] Processed images are stored in the correct path (`/public/images/articles/{slug}/`).
- [ ] Image filenames are system-generated and deterministic (`cover.webp`, `article-1.webp`, etc.).
- [ ] Images are accessible and render correctly in the article editor and on the public site.

### 15.5 Article Publishing & Cache Revalidation

- [ ] **Publish**: Articles can be published; public visibility is updated correctly.
- [ ] **Unpublish**: Published articles can be unpublished; public visibility is removed correctly.
- [ ] **Revalidation**: After publish/unpublish, the public site reflects the changes within seconds (cache is revalidated via `revalidatePath()`).
- [ ] Article listing pages are revalidated after article changes.
- [ ] Homepage is revalidated if it surfaces recent articles.

### 15.6 Backup & Restore

- [ ] Daily backups are created automatically (verify backup files exist with correct timestamps).
- [ ] Backup verification logs show no errors.
- [ ] Restore procedure can be executed successfully (perform a test restore to a staging directory).
- [ ] Restored `/content` files parse correctly as JSON.
- [ ] Restored `/public/images` files are intact and have correct dimensions (verify with Sharp).
- [ ] Partial restore (content only, images only) works correctly.

### 15.7 Logs & Monitoring

- [ ] Application logs are written to the designated logs directory.
- [ ] Authentication events (login attempts, success/failure) are logged.
- [ ] Article mutation events (create, update, delete, publish, unpublish) are logged.
- [ ] Image upload events (success/failure, processing details) are logged.
- [ ] Logs can be accessed and reviewed without exposing them to the web.
- [ ] No sensitive data (passwords, tokens, personal information) appears in logs.

### 15.8 Final Integration Test

- [ ] Dashboard loads and responds without errors.
- [ ] Create a new test article with title, slug, and content.
- [ ] Upload a test image (JPG or PNG).
- [ ] Save the article.
- [ ] Publish the article.
- [ ] Verify the article appears on the public site with the correct content and image.
- [ ] Verify the image is a WebP file (check HTTP headers or file extension).
- [ ] Unpublish the article.
- [ ] Verify the article is removed from the public site.
- [ ] Delete the test article.
- [ ] Verify the test article is removed from the dashboard.

## 16. Summary

The application is deployed as a single Node.js process on standard Node.js hosting, with no clustering, load balancing, or Redis dependency. The public site is statically rendered with ISR, explicitly revalidated via `revalidatePath()` after every Article create, update, delete, publish, or unpublish action. Uploaded images are processed through Sharp into resized, compressed WebP files. `/content` and `/public/images` are treated as persistent runtime data, covered by daily automated backups retained for 7 days with integrity verification after creation. Backup restore procedures support full and partial restore operations (Section 11.3–11.4), with integrity verification before returning the application to production (Section 11.6). Application rollback is immediate via the retained previous build (Section 12.1); data rollback is handled independently via backups (Section 12.2). Disaster recovery procedures address corrupted JSON files, interrupted deployments, and failed image processing (Section 13). HTTPS is handled by the hosting provider or reverse proxy. Storage recovery behavior follows atomic write patterns defined in `04-storage-strategy.md`; security requirements are defined in `06-security.md`; environment validation is defined in `07-environment-variables.md`. Every deployment is confirmed against the comprehensive production checklist (Section 15) covering environment configuration, authentication, article CRUD, image upload and processing, publishing and cache revalidation, backup and restore procedures, logs, and full integration testing before being considered complete.