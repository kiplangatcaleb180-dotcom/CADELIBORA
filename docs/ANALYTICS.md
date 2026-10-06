# CADELIBORA Analytics & Intelligence Ecosystem

This document details the architecture, operational metrics, API endpoints, authorization rules, and data sources for CADELIBORA's Analytics and Intelligence layer.

---

## 1. Architecture Overview

CADELIBORA's analytics layer aggregates real-time operational and engagement data directly from the PostgreSQL database via Prisma:
- **Personal Analytics (`GET /api/auth/analytics/me`)**: Computes personal counts for enrolled courses, completed courses, earned certificates, saved library resources, and community contributions.
- **Platform Analytics (`GET /api/admin/stats`)**: Aggregates enterprise-wide counts for users, courses, enrollments, research projects, community posts, products, articles, and library resources.

---

## 2. API Endpoints

- `GET /api/auth/analytics/me` - Retrieve personal activity and learning metrics for the authenticated user (Protected via `authenticate`).
- `GET /api/admin/stats` - Retrieve real platform-wide statistics and recent audit logs (Protected via `authenticate` and `authorizeRoles('SUPER_ADMIN', 'ADMIN')`).
