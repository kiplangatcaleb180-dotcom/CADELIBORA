# CADELIBORA Authorization & RBAC Architecture

This document outlines the centralized permission vocabulary, role-to-permission mappings, backend authorization middleware, ownership verification, and security controls across CADELIBORA.

---

## 1. Architecture Overview

CADELIBORA employs a centralized, application-centric Role-Based Access Control (RBAC) and Resource Ownership authorization layer:
- **Authentication**: JWT validation extracts the user ID and role into `req.user`.
- **Authorization**: `requirePermission(permission)` and `authorizeRoles(...roles)` middleware enforce backend access control independently of frontend UI rendering.
- **Ownership Verification**: Ensures users can only modify their own resources (e.g., profiles, AI conversations, messages, posts).

---

## 2. Role-to-Permission Mapping

| Role | Permissions |
| :--- | :--- |
| `SUPER_ADMIN` | All permissions (`*`) |
| `ADMIN` | User management, course management, research, projects, innovation, library, community moderation, audit logs, settings |
| `INSTRUCTOR` | Course creation, course management, analytics |
| `RESEARCHER` | Research initiatives and publications |
| `DEVELOPER` | Project creation and developer tools |
| `MODERATOR` | Community moderation and post removal |
| `STUDENT` | Course viewing, library discovery, community participation |
| `USER` | Library discovery and community viewing |
| `PARTNER` | Services and products viewing |

---

## 3. Security Principles

1. **Backend as Source of Truth**: Frontend permission checks (`hasPermission`) provide streamlined UX, but every protected API endpoint independently validates user permissions and resource ownership.
2. **Standardized Responses**: Returns `401 Unauthorized` for unauthenticated requests and `403 Forbidden` for unauthorized role/permission access.
3. **Audit Logging**: Privileged operations (role updates, user suspension, resource deletion, password changes) record immutable entries in the `AuditLog` table.
