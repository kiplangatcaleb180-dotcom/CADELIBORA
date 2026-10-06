# CADELIBORA Projects & Innovation Ecosystem

This document details the architecture, routing, API endpoints, data models, and authorization flows for CADELIBORA's Projects and Innovation ecosystem.

---

## 1. Architecture Overview

The Projects and Innovation modules connect open-source engineering initiatives, software libraries, and exploratory innovation concepts with research and the wider CADELIBORA ecosystem:
- `/projects` - Public Open Source & Enterprise Project Discovery
- `/projects/:id` - Detailed Project Profile, Tech Stack, and Repository links
- `/innovation` - Public Innovation Hub & Idea Incubation (with community voting)
- `/innovation/:id` - Detailed Innovation Architecture & Specifications
- `/dashboard/projects` - Authenticated Developer Workspace & Project Management

---

## 2. API Endpoints

### Projects (`/api/projects`)
- `GET /api/projects` - Retrieve all projects and enterprise products (supports category and search queries).
- `GET /api/projects/:id` - Retrieve project details by ID or slug.
- `POST /api/projects` - Create a new project (Authenticated).
- `PUT /api/projects/:id` - Update an existing project (Authenticated).
- `DELETE /api/projects/:id` - Delete/archive a project (Authenticated with developer/admin authorization).

### Innovation (`/api/innovation`)
- `GET /api/innovation` - Retrieve all innovation concepts ordered by votes.
- `GET /api/innovation/:id` - Retrieve innovation concept details.
- `POST /api/innovation` - Submit a new innovation concept (Authenticated).
- `POST /api/innovation/:conceptId/vote` - Upvote an innovation concept (Authenticated).
