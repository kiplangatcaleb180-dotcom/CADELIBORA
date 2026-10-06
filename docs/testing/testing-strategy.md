# CADELIBORA Testing Strategy

This document establishes the testing pyramid and quality-assurance approach for CADELIBORA across frontend, backend, and integration layers.

---

## 1. Testing Pyramid

- **Level 1 — Unit Tests**: Validating isolated functions, Zod validation schemas, token generation, and authorization permission maps.
- **Level 2 — Integration & API Tests (`testIntegration.ts`)**: Verifying end-to-end REST API behavior across Express routes, controllers, Prisma ORM, and PostgreSQL.
- **Level 3 — Frontend UI & Component Tests**: Verifying React components, layouts, forms, and context providers.
- **Level 4 — Security & RBAC Regression Tests**: Confirming backend role-based access control and resource ownership isolation.
