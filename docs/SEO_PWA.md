# CADELIBORA SEO & Progressive Web App (PWA) Architecture

This document outlines the SEO strategy, public vs. private content separation, robots/sitemap rules, and PWA capabilities implemented across CADELIBORA.

---

## 1. SEO Architecture

- **Public Indexable Content**: Home, Academy catalog, Research initiatives, AI Hub, Innovation, Projects, Products, Digital Library, Community feed, and Documentation.
- **Private Non-Indexable Content**: User dashboard (`/dashboard/*`), Administration portal (`/admin/*`), and authentication flows (`/login`, `/register`). Protected via `robots.txt` exclusion rules and backend authentication guards.
- **Structured Metadata**: Open Graph tags, canonical URLs, and meaningful page titles embedded across public endpoints.

---

## 2. Progressive Web App (PWA) Capabilities

- **Web App Manifest (`manifest.json`)**: Configured with CADELIBORA branding, standalone display mode, and theme colors.
- **Service Worker (`sw.js`)**: Provides offline application shell resilience and caching for static assets while excluding sensitive API routes.
