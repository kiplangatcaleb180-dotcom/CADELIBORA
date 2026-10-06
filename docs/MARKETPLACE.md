# CADELIBORA Marketplace, Services & Payments Ecosystem

This document details the architecture, routing, API endpoints, checkout flow, and order management across CADELIBORA's marketplace ecosystem.

---

## 1. Architecture Overview

The Marketplace ecosystem provides discovery, purchasing, and professional service requests:
- `/products` - Enterprise SaaS & AI Platform catalog with direct purchase actions.
- `/products/:id` - Detailed Product Profile and Checkout.
- `/services` - Professional Consulting & Solution directory with service request workflows.
- `/services/:id` - Service Detail and Request initiation.
- `/dashboard/orders` - Authenticated Purchase History and Service Order Tracking.

---

## 2. API Endpoints

- `GET /api/projects` - Retrieve products (`/projects` or projects/products endpoints).
- `GET /api/services` - Retrieve professional services and case studies.
- `GET /api/services/orders/me` - Retrieve authenticated user's purchase history and service orders.
- `POST /api/services/:id/order` - Request/order a professional service (Authenticated).
- `POST /api/services/products/:id/order` - Purchase a product license (Authenticated).
