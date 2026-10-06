# CADELIBORA Route Map

This document outlines all routes in the CADELIBORA ecosystem, including layout association, authentication requirements, role/permission restrictions, parent navigation, and related routes.

---

## 1. Public Routes (`MainLayout`)

| Route | Purpose | Auth Required | Role / Permission | Parent Navigation | Related Routes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Enterprise Home & Overview | No | None | Home | `/technology`, `/research`, `/ai` |
| `/organization` | Organization & Vision | No | None | About | `/global`, `/news` |
| `/technology` | Technology Architecture & Core Engines | No | None | Technology | `/ai`, `/projects`, `/developers` |
| `/research` | Research Initiatives & Labs | No | None | Research | `/publications`, `/library` |
| `/publications` | Academic & Technical Publications | No | None | Research | `/research`, `/knowledge` |
| `/ai` | AI Models & Autonomous Systems | No | None | AI | `/technology`, `/innovation` |
| `/innovation` | Innovation Hub & Concept Incubator | No | None | Innovation | `/projects`, `/products` |
| `/products` | Enterprise Software Products | No | None | Products | `/services`, `/projects` |
| `/projects` | Open Source & Research Projects | No | None | Projects | `/developers`, `/technology` |
| `/developers` | Developer Portal, SDKs & APIs | No | None | Developers | `/docs`, `/projects` |
| `/community` | Community Forums & Discussions | No | None | Community | `/academy`, `/library` |
| `/services` | Professional Services & Consulting | No | None | Services | `/case-studies`, `/products` |
| `/case-studies` | Client Success Stories | No | None | Services | `/services`, `/projects` |
| `/news` | News & Announcements | No | None | News | `/organization`, `/media` |
| `/academy` | Academy Learning Management | No | None | Academy | `/academy/courses/:slug`, `/library` |
| `/academy/courses/:slug` | Course Detail & Lessons | No | None | Academy | `/academy`, `/dashboard/learning` |
| `/library` | Digital Resource Library | No | None | Library | `/knowledge`, `/publications` |
| `/knowledge` | Knowledge Center | No | None | Library | `/library`, `/docs` |
| `/media` | Media & Press Center | No | None | News | `/organization`, `/news` |
| `/global` | Global Operations & Presence | No | None | Organization | `/organization`, `/services` |
| `/personal` | Personal Identity Portal | No | None | Personal | `/dashboard/profile` |
| `/docs` | System Documentation | No | None | Developers | `/developers`, `/knowledge` |

---

## 2. Authentication Routes

| Route | Purpose | Auth Required | Role / Permission | Parent Navigation | Related Routes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/login` | User Authentication | No | None | Auth | `/register`, `/forgot-password` |
| `/register` | Account Registration | No | None | Auth | `/login`, `/verify-email` |
| `/verify-email` | Email Verification | No | None | Auth | `/login`, `/dashboard` |
| `/forgot-password` | Password Recovery Request | No | None | Auth | `/login`, `/reset-password` |
| `/reset-password` | Password Reset Completion | No | None | Auth | `/login` |

---

## 3. User Dashboard Routes (`DashboardLayout`)

| Route | Purpose | Auth Required | Role Requirement | Parent Navigation | Related Routes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/dashboard` | User Overview & Metrics | Yes | Any (`USER`, `STUDENT`, `RESEARCHER`, `DEVELOPER`, `INSTRUCTOR`) | Dashboard | `/dashboard/profile`, `/dashboard/settings` |
| `/dashboard/profile` | User Profile & Bio Management | Yes | Any | Dashboard | `/dashboard`, `/personal` |
| `/dashboard/projects` | Enrolled & Managed Projects | Yes | Any | Dashboard | `/projects`, `/dashboard/research` |
| `/dashboard/learning` | Course Progress & Certificates | Yes | `STUDENT`, `INSTRUCTOR` | Dashboard | `/academy`, `/dashboard/library` |
| `/dashboard/research` | Research Experiments & Papers | Yes | `RESEARCHER` | Dashboard | `/research`, `/publications` |
| `/dashboard/library` | Saved Resources & Bookmarks | Yes | Any | Dashboard | `/library`, `/knowledge` |
| `/dashboard/notifications` | Platform Notifications | Yes | Any | Dashboard | `/dashboard` |
| `/dashboard/settings` | Account Security & API Keys | Yes | Any | Dashboard | `/dashboard/profile` |

---

## 4. Administration Routes (`AdminLayout`)

| Route | Purpose | Auth Required | Role / Permission | Parent Navigation | Related Routes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/admin` | Admin Overview & System Metrics | Yes | `ADMIN`, `SUPER_ADMIN` | Admin | `/admin/users`, `/admin/analytics` |
| `/admin/users` | User Management & RBAC Roles | Yes | `ADMIN`, `SUPER_ADMIN` | Admin | `/admin/security` |
| `/admin/projects` | Project & Product Administration | Yes | `ADMIN`, `SUPER_ADMIN` | Admin | `/projects`, `/products` |
| `/admin/research` | Research & Publication Oversight | Yes | `ADMIN`, `SUPER_ADMIN` | Admin | `/research`, `/publications` |
| `/admin/academy` | Course CMS & Assessment Management | Yes | `ADMIN`, `SUPER_ADMIN`, `INSTRUCTOR` | Admin | `/academy` |
| `/admin/analytics` | System Metrics & Audit Logs | Yes | `ADMIN`, `SUPER_ADMIN` | Admin | `/admin/security` |
| `/admin/security` | Security, Audit Logs & Access Control | Yes | `SUPER_ADMIN` | Admin | `/admin/users` |
