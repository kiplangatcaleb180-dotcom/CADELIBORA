# CADELIBORA Personal Workspace Documentation

This document defines the architecture, routes, navigation, data flow, and security principles for the CADELIBORA Authenticated Personal Workspace.

---

## 1. Dashboard Architecture

The CADELIBORA Personal Workspace provides an authenticated continuation of the public platform where fellows, students, researchers, and developers manage their learning, bookmarks, research, projects, library resources, notifications, and profile settings.

### Protected Routes (`ProtectedRoute`)
Every dashboard route is strictly guarded by `ProtectedRoute`:
- `/dashboard` - Personal Overview & Activity Summary
- `/dashboard/courses` - Enrolled Academy Courses & Progress Tracking
- `/dashboard/certificates` - Earned Verifiable Credentials & Certificates
- `/dashboard/research` - Saved Research Initiatives & Publications
- `/dashboard/projects` - Open Source & Enterprise Projects
- `/dashboard/library` - Personal Digital Library Bookmarks & Downloads
- `/dashboard/notifications` - Platform & Academy Alerts
- `/dashboard/profile` - Professional Identity & Profile Onboarding
- `/dashboard/settings` - Account Security, Password Updates & Sessions

---

## 2. Navigation & Sidebar

The persistent workspace sidebar (`Sidebar.tsx`) organizes user tools into accessible sections:
- Overview
- My Courses
- Certificates
- Research Saved
- Projects
- Library
- Notifications
- Profile
- Settings

Role-specific navigation adapts seamlessly while backend middleware enforces strict authorization boundaries.

---

## 3. Authenticated Data Flow & Security

1. **Authentication State (`AuthContext`)**: Manages token persistence (`localStorage`) and automatic session restoration via `GET /api/auth/me`.
2. **Backend Authorization**: All endpoints derive the authenticated user identity directly from the validated JWT (`req.user.userId`), preventing horizontal privilege escalation or unauthorized data access.
3. **Optimized Client State**: Actions such as profile updates, course enrollment progress, and notification reads refresh the user state and invalidate stale data without full page reloads.
