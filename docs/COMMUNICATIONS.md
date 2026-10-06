# CADELIBORA Notifications & Messaging Ecosystem

This document details the architecture, routing, API endpoints, notification triggers, and messaging security rules across the CADELIBORA communication layer.

---

## 1. Architecture Overview

CADELIBORA separates communications into two foundational layers:
1. **Notifications (`Notification` model)**: System-generated event alerts (course enrollments, certificates, community comments). Managed via `/dashboard/notifications`.
2. **Direct Messaging (`Conversation`, `Message` models)**: User-to-user direct communication. Managed via `/dashboard/messages`.

---

## 2. API Endpoints

### Notifications (`/api/notifications`)
- `GET /api/notifications` - Retrieve all notifications for the authenticated user.
- `PUT /api/notifications/read-all` - Mark all user notifications as read (Authenticated).
- `PUT /api/notifications/:notificationId/read` - Mark a specific notification as read (Authenticated with ownership check).

### Messaging (`/api/messages`)
- `GET /api/messages/conversations` - Retrieve all conversations for the authenticated user.
- `POST /api/messages/conversations` - Start a new direct conversation with another user (Authenticated).
- `GET /api/messages/conversations/:id/messages` - Retrieve messages in a conversation (Verified by participant membership).
- `POST /api/messages/conversations/:id/messages` - Send a direct message (Authenticated with participant verification).
