# CADELIBORA Authentication & Security Architecture

This document details the authentication, authorization, session management, onboarding, and security audit procedures across the CADELIBORA ecosystem.

---

## 1. Architecture Overview

CADELIBORA employs a stateless JSON Web Token (JWT) architecture for API authentication, backed by bcrypt password hashing and Prisma ORM with a PostgreSQL database.

```
Public User / Returning User
       │
       ▼
Login / Register Form
       │
       ▼ (POST /api/auth/login or /api/auth/register)
Backend (Express + Prisma)
       ├── Password Hashing (bcrypt)
       ├── Role Validation (Only STUDENT, DEVELOPER, RESEARCHER allowed for public self-registration)
       └── JWT Generation (Signed with JWT_SECRET)
       │
       ▼
Frontend Storage (`cadelibora_token` in localStorage)
       │
       ▼
AuthContext (Restores session via GET /api/auth/me)
       │
       ├── ProtectedRoute (/dashboard/*)
       └── RoleRoute (/admin/* for ADMIN & SUPER_ADMIN)
```

---

## 2. Core Components & Guards

### Frontend Guards
- **`AuthContext` (`frontend/src/contexts/AuthContext.tsx`)**: Centralized authentication state provider managing user session, token storage, login, registration, logout, and automatic session restoration.
- **`ProtectedRoute` (`frontend/src/components/auth/ProtectedRoute.tsx`)**: Guards user workspace routes (`/dashboard/*`), ensuring unauthenticated visitors are redirected to `/login` while preserving the intended destination (`state={{ from: location }}`).
- **`RoleRoute` (`frontend/src/components/auth/RoleRoute.tsx`)**: Guards administrative routes (`/admin/*`), verifying that authenticated users possess the required role (`ADMIN` or `SUPER_ADMIN`).

### Backend Security
- **`authenticate` Middleware (`backend/src/middleware/auth.ts`)**: Validates Bearer tokens sent in authorization headers and decodes JWT payloads.
- **`authorizeRoles` Middleware**: Restricts endpoint execution to specified privileged roles (`SUPER_ADMIN`, `ADMIN`, etc.), preventing unauthorized access regardless of client-side navigation.
- **Audit Logging (`AuditLog` model)**: Records critical security events including `REGISTER`, `LOGIN`, `LOGOUT`, `CHANGE_PASSWORD`, and `PROFILE_UPDATE`.

---

## 3. Role Hierarchy & Privileged Access

- **Public Self-Registration Roles**: `STUDENT`, `DEVELOPER`, `RESEARCHER`.
- **Privileged Roles (Admin-Assigned Only)**: `SUPER_ADMIN`, `ADMIN`, `INSTRUCTOR`, `EDITOR`, `MODERATOR`, `PARTNER`.
  > [!IMPORTANT]
  > The backend strictly filters registration roles. Even if a malicious client manually sends a privileged role during registration, the backend defaults or restricts the role to allowed public values.

---

## 4. Profile Management & Password Security

- **Profile Updates**: Authenticated users can update account details and professional metadata via `PUT /api/auth/profile`.
- **Password Changes**: Users can change their password via `PUT /api/auth/password`, requiring verification of the current password, hashing of the new password via `bcrypt`, and generating an audit log event.

---

## 5. Security Audit Considerations

1. **Password Hashing**: Passwords are never stored in plaintext; `bcryptjs` with salt rounds is utilized.
2. **Token Expiration**: Expired or malformed JWTs return `401 Unauthorized`, which automatically clears local credentials and redirects the user to `/login`.
3. **Sensitive Data Protection**: Prisma queries exclude `passwordHash` when returning user objects. Database credentials, JWT secrets, and stack traces are never exposed in client responses.
4. **PostgreSQL Database Constraints**: Unique email constraints and foreign key relationships are strictly maintained by Prisma and PostgreSQL.

---

## 6. Testing Procedures

- **Register**: Verify registration succeeds for `STUDENT`, `DEVELOPER`, and `RESEARCHER`. Verify registration attempt with `ADMIN` role defaults/restricts correctly.
- **Login**: Verify valid credentials issue a JWT and redirect to dashboard with return-to state preservation. Verify invalid credentials return `401`.
- **Protected Routes**: Verify unauthenticated access to `/dashboard` redirects to `/login`. Verify non-admin access to `/admin` redirects away.
- **Audit Logs**: Verify login, profile updates, and password changes correctly insert rows into the `AuditLog` table.
