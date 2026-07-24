# Deployment Guide - Nyalian Tourism Village Website

## Prerequisites
- Git repository with all code committed
- Vercel account (free tier is sufficient)
- Access to GitHub/GitLab/Bitbucket where the repository is hosted

## Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] `.env.example` file exists and is documented
- [ ] No secrets or API keys committed to repository
- [ ] `next.config.ts` has correct production settings
- [ ] `package.json` scripts are complete

### 2. Build Verification
```bash
npm run build
```
✓ Build must complete successfully with no errors

### 3. Data Validation
```bash
npm run validate-data
```
✓ All JSON data files validated (warnings about missing images are expected)

## Deployment Steps

### Step 1: Prepare Repository
1. Ensure all changes are committed:
```bash
git status
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

2. Verify `.gitignore` excludes:
   - `node_modules/`
   - `.next/`
   - `.env*` (except `.env.example`)
   - `*.tsbuildinfo`
   - `.vercel/`

### Step 2: Connect to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign in or create account
   - Click "Add New Project"

2. **Import Git Repository**
   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Authorize Vercel to access your repositories
   - Find and select `frontend_desa_nyalian` repository
   - Click "Import"

3. **Configure Project**
   - **Project Name**: `nyalian-village` (or your preferred name)
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### Step 3: Set Environment Variables

In Vercel project settings, add the following environment variables:

**Required:**
- `NEXT_PUBLIC_SITE_URL` = `https://your-domain.vercel.app`
  (Replace with your actual Vercel domain after first deployment)

**Optional:**
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = `your_api_key_here` (if needed)

### Step 4: Deploy

1. Click "Deploy" button
2. Wait for deployment to complete (typically 2-3 minutes)
3. Vercel will:
   - Install dependencies
   - Run `npm run build`
   - Generate static pages
   - Deploy to CDN

### Step 5: Verify Production Deployment

Once deployed, verify the following:

#### A. Basic Functionality
- [ ] Homepage loads correctly
- [ ] Navigation works (all menu items)
- [ ] All routes are accessible:
  - [ ] `/destinations` and `/destinations/[slug]`
  - [ ] `/packages` and `/packages/[slug]`
  - [ ] `/articles` and `/articles/[slug]`
  - [ ] `/faq`
  - [ ] `/about`
  - [ ] `/plan-your-visit`

#### B. SEO & Metadata
- [ ] `/sitemap.xml` is accessible
- [ ] `/robots.txt` is accessible
- [ ] `/manifest.webmanifest` is accessible
- [ ] Open Graph images load (test with https://www.opengraph.xyz/)

#### C. Core Features
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] Pagination functions properly
- [ ] WhatsApp CTA opens with correct number
- [ ] Social share works
- [ ] No console errors in browser DevTools

### Step 6: Update Environment Variable

After first deployment, update the environment variable:

1. Copy your production URL from Vercel (e.g., `https://nyalian-village.vercel.app`)
2. Go to Vercel Project Settings → Environment Variables
3. Edit `NEXT_PUBLIC_SITE_URL` to match your production URL
4. Redeploy (Vercel → Deployments → click "Redeploy" on latest)

This ensures canonical URLs, sitemap, and Open Graph URLs point to the correct domain.

### Step 7: Custom Domain (Optional)

If you have a custom domain:

1. Go to Vercel Project Settings → Domains
2. Add your domain (e.g., `nyalianvillage.com`)
3. Follow DNS configuration instructions from Vercel
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain
5. Redeploy

## Post-Deployment Monitoring

### Immediate Checks (First 24 Hours)
- Monitor Vercel Analytics for errors
- Check Core Web Vitals in Vercel dashboard
- Test on multiple devices and browsers
- Monitor any 404 or 500 errors

### Lighthouse Scores
Run Lighthouse on production URLs:
- Target: Performance 95+, Accessibility 95+, Best Practices 100, SEO 100
- Test on: Homepage, a listing page, and a detail page

### Search Engine Submission
After deployment is stable:
1. Submit sitemap to Google Search Console: `https://yourdomain.com/sitemap.xml`
2. Submit to Bing Webmaster Tools (optional)

## Troubleshooting

### Build Fails
- Check Vercel build logs for specific errors
- Verify `package.json` dependencies are correct
- Ensure Node.js version compatibility (v18+)

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/changing environment variables
- Clear browser cache if changes don't appear

### 404 Errors on Routes
- Verify `generateStaticParams()` is present for dynamic routes
- Check that all data files are committed to repository
- Review Vercel build logs for generation errors

### Images Not Loading
- Check `next.config.ts` has correct `remotePatterns`
- Verify image paths in JSON data are correct
- Ensure placeholder images are being served

## Rollback Procedure

If issues occur:
1. Go to Vercel → Deployments
2. Find the last working deployment
3. Click "..." menu → "Promote to Production"

## Support Resources

- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Project Repository: [Your GitHub/GitLab URL]

---

## Deployment Checklist Summary

✅ All code committed and pushed
✅ `npm run build` passes locally
✅ `npm run validate-data` completes
✅ `.env.example` documented
✅ Repository connected to Vercel
✅ Environment variables configured
✅ First deployment successful
✅ All routes verified working
✅ Sitemap, robots.txt accessible
✅ `NEXT_PUBLIC_SITE_URL` updated
✅ Redeployed with correct URL
✅ Lighthouse scores verified
✅ No console errors in production

**Status**: Ready for Production ✅
