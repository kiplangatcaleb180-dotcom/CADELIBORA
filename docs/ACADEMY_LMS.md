# CADELIBORA Academy & Learning Management System (LMS)

This document outlines the architecture, data flows, course catalog, interactive learning workspace, progress tracking, and certificate generation mechanisms across the CADELIBORA Academy ecosystem.

---

## 1. LMS Architecture & Routing

The Academy connects public discovery with authenticated personal workspaces and verified credential issuance:
- `/academy` - Public Course Catalog with category filtering and real-time backend search (`GET /api/courses?search=...`).
- `/academy/courses/:slug` - Course Details, Instructor Metadata, and Curriculum Overview.
- `/academy/courses/:slug/learn` - Authenticated Interactive Learning Workspace (Protected via `ProtectedRoute`).
- `/dashboard/courses` - Personal Learner Dashboard showing In Progress, Completed, and Not Started courses.
- `/dashboard/certificates` - Verifiable Credentials and Certificate Registry.

---

## 2. Enrollment & Progress Flow

1. **Discovery**: Visitors browse published courses in the public catalog without authentication.
2. **Enrollment**: Clicking "Enroll" prompts unauthenticated users to sign in (preserving destination via `state.from`), while authenticated users trigger `POST /api/courses/:courseId/enroll`.
3. **Learning Workspace**: Enrolled students access lessons, study materials, and interactive quizzes at `/academy/courses/:slug/learn`.
4. **Progress Tracking**: Advancing through lessons updates student progress (`POST /api/courses/:courseId/progress`) with numeric validation (0–100%).
5. **Course Completion & Certification**: Upon reaching 100% progress, the backend automatically calculates completion (`completed = true`), issues a unique verifiable certificate (`Certificate` model), and dispatches a system notification.
