-- CreateTable
CREATE TABLE "ModerationReport" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "resolutionNote" TEXT NOT NULL DEFAULT '',
    "reporterId" TEXT,
    "handlerId" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(6),

    CONSTRAINT "ModerationReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_moderation_report_status_created" ON "ModerationReport"("status", "createdAt");

-- CreateIndex
CREATE INDEX "idx_moderation_report_target" ON "ModerationReport"("targetType", "targetId");

-- AddForeignKey
ALTER TABLE "ModerationReport" ADD CONSTRAINT "ModerationReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ModerationReport" ADD CONSTRAINT "ModerationReport_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
