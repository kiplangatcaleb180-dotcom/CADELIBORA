# CADELIBORA Platform Security & Compliance

This document details the security architecture, authentication hardening, authorization RBAC rules, input validation, rate limiting, and audit logging across the CADELIBORA platform.

---

## 1. Security Architecture

CADELIBORA employs a defense-in-depth security model:
- **Authentication**: JWT validation with bcrypt password hashing.
- **Authorization**: Role-Based Access Control (`requirePermission`, `authorizeRoles`) coupled with resource ownership validation on the backend.
- **Input Validation**: Centralized request parameter and body validation.
- **Rate Limiter**: Protects sensitive endpoints (auth, AI, payments, uploads) from brute-force and abuse.
- **Audit Logging**: Immutable tracking of security-sensitive operations via the `AuditLog` model.

---

## 2. API Security & Middleware

- `authenticate`: Validates Bearer tokens and extracts user claims.
- `requirePermission(permission)`: Enforces fine-grained permission checks.
- `rateLimiter`: Restricts excessive requests by IP address.
