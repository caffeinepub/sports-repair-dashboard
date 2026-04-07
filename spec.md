# Sports Repair Shop - Public Website

## Current State
The app currently has a password-protected admin dashboard for managing sports repair jobs (customer and shop jobs). There is no public-facing website for customers.

## Requested Changes (Diff)

### Add
- A public landing page (no login required) at `/` with:
  - Header/navbar with shop name, nav links, and a WhatsApp CTA button
  - Hero section with headline, tagline, and call-to-action buttons
  - Services section (badminton restringing, cricket bat repair, bat binding, grip replacement, racket repair)
  - Why Choose Us section with trust badges/icons
  - Contact/CTA band with WhatsApp button
  - Footer with quick links and contact info
- Route `/admin` leads to the existing password-protected dashboard

### Modify
- App.tsx to show public website at root, and dashboard at `/admin` path (using URL hash routing)

### Remove
- Nothing removed from existing dashboard functionality

## Implementation Plan
1. Create `src/frontend/src/pages/PublicWebsite.tsx` — full landing page component
2. Create `src/frontend/src/pages/LandingPage sections`: Hero, Services, WhyUs, ContactBand, Footer components (inline or in same file)
3. Update `App.tsx` to show `PublicWebsite` at root (no auth) and existing dashboard behind `?admin` or hash `#admin` route
4. Style with blue and green theme matching design preview
