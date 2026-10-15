# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LinkedIn Collage Creator - A client-only web application for creating 1200x1200 photo collages optimized for LinkedIn posts. No build step, no server, no dependencies.

## Running the Application

Must serve over HTTP (file:// protocol causes FileReader permission errors):
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000

## Architecture

**Four files, no build process:**
- `index.html` - UI structure with upload, image list, template selector, preview canvas, download button
- `styles.css` - Mobile-first CSS with LinkedIn brand colors, 44px touch targets
- `templates.js` - Defines `TEMPLATES` array and exports `getCompatibleTemplates()`, `getTemplateById()`
- `app.js` - Application state, event handlers, canvas rendering, JPEG export

**Data flow:**
1. Images loaded via FileReader → data URLs (not blob URLs, for file:// compatibility)
2. Stored in `state.images[]` as `{ file, url, img }` objects
3. Template selection triggers `renderCollage()` which clips and draws to 1200x1200 canvas
4. Export uses `canvas.toDataURL('image/jpeg', 0.92)` for Safari compatibility

**Template structure:**
Each template has `id`, `name`, `minImages`, `maxImages`, and `getRegions(imageCount)` returning array of `{ clip: [{x,y}...], bounds: {x,y,w,h} }` for angled separators.

## Key Constraints

- HEIC/HEIF not supported (browser limitation) - filter with `isSupportedImage()`
- Safari iOS requires `toDataURL()` not `toBlob()` for reliable export
- `<a download>` is unreliable on iOS; touch devices use the Web Share API (`navigator.share({ files })`, File built synchronously to keep the user gesture), falling back to a full-screen long-press-to-save overlay
- All image processing is client-side only
