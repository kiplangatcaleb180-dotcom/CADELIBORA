# CADELIBORA API Hardening & Production Infrastructure

This document details environment configuration, environment validation, graceful shutdown handling, database connection management, and frontend API error handling across CADELIBORA.

---

## 1. Environment Configuration

- Standardized on port `5000` for development and production.
- Validates mandatory secrets (e.g. `JWT_SECRET`) on startup when `NODE_ENV=production`.

---

## 2. Graceful Shutdown & Reliability

- Server signals (`SIGTERM`, `SIGINT`) trigger controlled HTTP server closure and active Prisma database connection teardown (`prisma.$disconnect()`).
- Centralized error handling and rate-limiting middleware protect against abuse and resource exhaustion.
