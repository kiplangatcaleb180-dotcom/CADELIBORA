# CADELIBORA Performance & Scalability Architecture

This document details the performance optimization strategies, database indexing, query efficiency, and caching mechanisms implemented across CADELIBORA.

---

## 1. Architecture Overview

CADELIBORA maintains high performance and throughput through:
- **Database Indexing**: Strategic indexes on high-cardinality foreign keys, slugs, and filterable categories (`idx_course_slug`, `idx_user_email`, `idx_notification_user`, etc.).
- **Query Selectivity**: Prisma `select` and `include` projections prevent over-fetching unnecessary columns (e.g. omitting password hashes and heavy payloads).
- **Client-Side Caching**: React Query integration ensures minimal redundant network requests.
- **Payload Limits**: Strict pagination (default limits, max caps) protects backend memory and database connection pools.
