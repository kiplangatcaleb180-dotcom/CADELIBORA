# CADELIBORA AI Workspace & Neural Reasoner

This document details the architecture, routing, API endpoints, conversation ownership security, and ecosystem integrations for CADELIBORA's AI Workspace powered by the ANR-X Neural Model.

---

## 1. Architecture Overview

The AI workspace provides an intelligent assistant layer across CADELIBORA:
- `/ai` - Central AI Laboratory and Chat Console.
- **ANR-X Engine (`backend/src/ai/aiEngine.ts`)**: Neural reasoner handling context synthesis and prompt processing.
- **Persistence (`AIConversation`, `AIMessage`)**: Stores conversation threads and message history securely in PostgreSQL.

---

## 2. API Endpoints (`/api/ai`)

- `GET /api/ai/conversations` - Retrieve all conversation threads for the authenticated user.
- `GET /api/ai/conversations/:id` - Retrieve a specific conversation thread and its messages (Verified by JWT ownership).
- `DELETE /api/ai/conversations/:id` - Delete an AI conversation thread (Authenticated).
- `POST /api/ai/chat` - Submit a chat prompt, maintaining conversation state and context tokens.
