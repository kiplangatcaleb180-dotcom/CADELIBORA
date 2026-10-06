# CADELIBORA Community & Collaboration Ecosystem

This document details the architecture, routing, API endpoints, comment security, and moderation flows for CADELIBORA's Community & Collaboration layer.

---

## 1. Architecture Overview

The Community ecosystem provides a knowledge-oriented interaction layer for fellows, researchers, and developers:
- `/community` - Public Community Feed with topic filtering and discussion creation.
- `/community/posts/:id` - Detailed Discussion View with comments and comment composer.

---

## 2. API Endpoints (`/api/community`)

- `GET /api/community/posts` - Retrieve all community posts (supports topic filtering).
- `GET /api/community/posts/:id` - Retrieve individual post and its comments.
- `POST /api/community/posts` - Create a new community discussion (Authenticated).
- `POST /api/community/posts/:postId/like` - Upvote/like a discussion (Authenticated).
- `POST /api/community/posts/:postId/comments` - Add a comment to a discussion (Authenticated).
- `DELETE /api/community/posts/:id` - Delete a discussion (Enforces ownership or admin role).
