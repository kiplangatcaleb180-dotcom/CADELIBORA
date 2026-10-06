# CADELIBORA Library & Knowledge Center Ecosystem

This document details the architecture, routing, API endpoints, saved-resource behavior, and ecosystem integrations for CADELIBORA's Digital Library and Knowledge Center.

---

## 1. Architecture Overview

The Library and Knowledge Center provide centralized discovery and personal management of technical specs, research whitepapers, books, and articles:
- `/library` - Public Digital Library with category/format filtering and real-time backend search.
- `/library/:id` - Detailed Resource Profile with direct download access and bookmarking.
- `/knowledge` - Unified Knowledge Center connecting research, publications, articles, and documentation.
- `/dashboard/library` - Personal Library workspace where authenticated users manage saved/bookmarked resources.

---

## 2. API Endpoints (`/api/library`)

- `GET /api/library` - Retrieve all public library resources (supports search, category, and format/type filtering).
- `GET /api/library/:id` - Retrieve individual resource details.
- `GET /api/library/knowledge/feed` - Unified knowledge center feed aggregating articles, library resources, publications, and research initiatives.
- `GET /api/library/saved` - Retrieve bookmarked resources for the authenticated user.
- `POST /api/library/:id/save` - Bookmark a resource (Authenticated).
- `DELETE /api/library/:id/save` - Remove a resource bookmark (Authenticated).
