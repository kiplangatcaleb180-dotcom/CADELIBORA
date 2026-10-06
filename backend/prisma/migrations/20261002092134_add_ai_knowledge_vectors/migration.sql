CREATE EXTENSION IF NOT EXISTS vector;


-- CreateTable
CREATE TABLE "AIKnowledgeDocument" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "source" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(384),
    "contentHash" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIKnowledgeDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIKnowledgeDocument_source_sourceId_idx" ON "AIKnowledgeDocument"("source", "sourceId");

-- CreateIndex
CREATE INDEX "AIKnowledgeDocument_contentHash_idx" ON "AIKnowledgeDocument"("contentHash");
