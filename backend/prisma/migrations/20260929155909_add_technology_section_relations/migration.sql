-- AlterTable
ALTER TABLE "TechnologySection" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "TechnologySectionTechnology" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "sectionId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TechnologySectionTechnology_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TechnologySectionTechnology_sectionId_idx" ON "TechnologySectionTechnology"("sectionId");

-- CreateIndex
CREATE INDEX "TechnologySectionTechnology_technologyId_idx" ON "TechnologySectionTechnology"("technologyId");

-- CreateIndex
CREATE UNIQUE INDEX "TechnologySectionTechnology_sectionId_technologyId_key" ON "TechnologySectionTechnology"("sectionId", "technologyId");

-- AddForeignKey
ALTER TABLE "TechnologySectionTechnology" ADD CONSTRAINT "TechnologySectionTechnology_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "TechnologySection"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TechnologySectionTechnology" ADD CONSTRAINT "TechnologySectionTechnology_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
