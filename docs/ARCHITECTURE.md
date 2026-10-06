
# CADELIBORA Architecture Document

CADELIBORA is an advanced, multi-tiered ecosystem comprising a comprehensive web frontend (`frontend/`), a robust RESTful backend API (`backend/`), and an Android mobile application (`app/`).

---

## 1. Project Structure

```
CADELIBORA/
├── app/                  # Android mobile application (Kotlin / Jetpack Compose)
├── backend/              # Node.js + Express + TypeScript + Prisma Backend API
│   ├── prisma/           # Database schema (schema.dev) & seed scripts
│   └── src/
│       ├── ai/           # AI Engine logic
│       ├── analytics/    # Tracking & metrics
│       ├── auth/         # JWT generation & verification
│       ├── config/       # Environment & DB configurations
│       ├── controllers/  # Route controllers (Admin, Auth, Courses, Research, etc.)
│       ├── middleware/   # Auth & error handling middleware
│       ├── routes/       # Express route definitions
│       ├── services/     # Business logic & domain services
│       └── validators/   # Zod input validation schemas
├── frontend/             # React + Vite + TypeScript + Tailwind CSS Frontend
│   └── src/
│       ├── app/          # Redux / state management
│       ├── assets/       # Brand & static assets
│       ├── components/   # Reusable UI components & admin datatables
│       ├── constants/    # Route constants & app definitions
│       ├── contexts/     # React Contexts (AuthContext, ThemeContext)
│       ├── hooks/        # Custom React hooks (useFetch)
│       ├── layouts/      # Layout wrappers (DashboardLayout, MainLayout, AdminLayout)
│       ├── lib/          # API client (`api.ts`)
│       ├── pages/        # Public, auth, dashboard & admin portal pages
│       ├── services/     # Frontend API service layer
│       ├── styles/       # Centralized CSS system (globals, variables, components)
│       ├── types/        # TypeScript interfaces & types
│       └── utils/        # Formatting & helper utilities
└── docs/                 # Project documentation & architecture maps
```

---

## 2. Routing Architecture

### Public Routes (`/`)
- `/` - Home
- `/organization` - Organization Overview
- `/technology` - Technology Stack & Core Engines
- `/research` - Research Projects & Publications
- `/ai` - Artificial Intelligence & Autonomous Systems
- `/innovation` - Innovation Hub & Concepts
- `/products` - Enterprise Products & Platforms
- `/projects` - Open Source & Enterprise Projects
- `/developers` - Developer Portal & SDKs
- `/community` - Community Forums & Discussions
- `/services` - Professional Services & Solutions
- `/case-studies` - Client Success Stories & Case Studies
- `/news` - News & Announcements
- `/academy` - Learning Management & Academy Courses
- `/academy/courses/:slug` - Course Detail & Lessons
- `/library` - Digital Library & Resources
- `/publications` - Research Publications & Papers
- `/knowledge` - Knowledge Center
- `/media` - Media & Press Center
- `/global` - Global Operations & Presence
- `/personal` - Personal Identity & Profile Management
- `/docs` - System Documentation

### Authentication Routes
- `/login` - User Login
- `/register` - Account Registration
- `/verify-email` - Email Verification
- `/forgot-password` - Password Recovery
- `/reset-password` - Password Reset

### User Dashboard Routes (`/dashboard`)
- `/dashboard` - Overview & Analytics
- `/dashboard/profile` - User Profile Settings
- `/dashboard/projects` - Enrolled & Managed Projects
- `/dashboard/learning` - Academy Course Progress
- `/dashboard/research` - Research Contributions
- `/dashboard/library` - Saved Resources & Bookmarks
- `/dashboard/notifications` - System & Platform Notifications
- `/dashboard/settings` - Account & Security Settings

### Admin Portal Routes (`/admin/*`)
- `/admin` - Admin Dashboard & System Metrics
- `/admin/users` - User Management & Roles
- `/admin/projects` - Project & Product Administration
- `/admin/research` - Research & Publication Management
- `/admin/academy` - Academy Course & Lesson CMS
- `/admin/analytics` - System Analytics & Audit Logs
- `/admin/settings` - Global Platform Settings

---

## 3. Authentication & Authorization

- **Mechanism**: JSON Web Tokens (JWT) issued upon successful authentication (`/api/auth/login`).
- **State Management**: Handled via `AuthContext` on the frontend, storing token and user session state.
- **Roles**: Supported roles in database (`User` model): `SUPER_ADMIN`, `ADMIN`, `RESEARCHER`, `DEVELOPER`, `INSTRUCTOR`, `STUDENT`, `EDITOR`, `MODERATOR`, `PARTNER`, `USER`.
- **Protected Routes**: Backend middleware (`auth.ts`) validates Bearer tokens and role permissions.

---

## 4. API Communication & Backend

- **Base URL**: Configured via environment variable (`VITE_API_BASE_URL`).
- **HTTP Client**: Centralized API helper (`frontend/src/lib/api.ts`) using standard `fetch` with token injection and error handling.
- **Backend Stack**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL.
- **Domain Controllers**: Auth, Courses, Research, Projects, Innovation, Library, Community, AI, Admin, Services, Articles, Notifications, Storage.

---

## 5. Styling System

Centralized styling architecture under `frontend/src/styles/`:
- `globals.css` - Tailwind base and global rules
- `variables.css` - Design tokens and theme variables
- `themes.css` - Dark/Light theme definitions
- `typography.css` - Typography rules
- Component stylesheets (`buttons.css`, `cards.css`, `dashboards.css`, `forms.css`, `navigation.css`, `tables.css`)

---

## 6. Current Status & Known Problems

- **Status**: Stable baseline established. Both frontend (`vite build`) and backend (`tsc`) compile successfully with zero errors. Database schema is fully defined and seed scripts are operational.
- **Known Problems**: None in current baseline code.
- **Planned Expansion Points**:
  - Full end-to-end integration testing between frontend and backend endpoints.
  - Expansion of Android app (`app/`) UI and features.
  - Real-time WebSocket support for community chat and notifications.
