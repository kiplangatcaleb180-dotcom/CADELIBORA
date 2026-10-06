# CADELIBORA Global Search Ecosystem

This document details the architecture, routing, API endpoints, query validation, and security permissions for CADELIBORA's Global Search ecosystem.

---

## 1. Architecture Overview

Global Search unifies discovery across distributed Prisma models into a single, cohesive query engine without duplicating content:
- `/search` - Dedicated Global Search page supporting query parameters (`?q=...&type=...`) and category filtering.
- **Command Menu (`Ctrl+K` / `Cmd+K`)**: Instant modal search overlay for rapid navigation.
- **Backend Search Engine (`/api/search`)**: Coordinates multi-entity queries against PostgreSQL with robust query parameter validation.

---

## 2. API Endpoints (`/api/search`)

- `GET /api/search` - Perform a unified search across courses, research initiatives, publications, articles, projects, innovation concepts, library resources, community posts, and user profiles.
  - Query Parameters:
    - `q`: Search query string
    - `type`: Entity filter (`all`, `course`, `research`, `publication`, `article`, `project`, `innovation`, `library`, `community`, `person`)
    - `page`: Page number (default `1`)
    - `limit`: Results per page (default `15`, max `50`)
