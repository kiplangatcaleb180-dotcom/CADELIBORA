-- CreateTable
CREATE TABLE "InnovationVote" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "conceptId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InnovationVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InnovationVote_conceptId_idx" ON "InnovationVote"("conceptId");

-- CreateIndex
CREATE INDEX "InnovationVote_userId_idx" ON "InnovationVote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InnovationVote_conceptId_userId_key" ON "InnovationVote"("conceptId", "userId");

-- AddForeignKey
ALTER TABLE "InnovationVote" ADD CONSTRAINT "InnovationVote_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "InnovationConcept"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "InnovationVote" ADD CONSTRAINT "InnovationVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
