-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "featuresJson" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "galleryJson" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "featuresJson" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "galleryJson" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ProjectTechnology" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "projectId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectTechnology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTechnology" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "productId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductTechnology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectResearch" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "projectId" TEXT NOT NULL,
    "researchProjectId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectResearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductResearch" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "productId" TEXT NOT NULL,
    "researchProjectId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductResearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectInnovation" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "projectId" TEXT NOT NULL,
    "innovationId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectInnovation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductInnovation" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "productId" TEXT NOT NULL,
    "innovationId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductInnovation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectProduct" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "projectId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectTechnology_projectId_idx" ON "ProjectTechnology"("projectId");

-- CreateIndex
CREATE INDEX "ProjectTechnology_technologyId_idx" ON "ProjectTechnology"("technologyId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTechnology_projectId_technologyId_key" ON "ProjectTechnology"("projectId", "technologyId");

-- CreateIndex
CREATE INDEX "ProductTechnology_productId_idx" ON "ProductTechnology"("productId");

-- CreateIndex
CREATE INDEX "ProductTechnology_technologyId_idx" ON "ProductTechnology"("technologyId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductTechnology_productId_technologyId_key" ON "ProductTechnology"("productId", "technologyId");

-- CreateIndex
CREATE INDEX "ProjectResearch_projectId_idx" ON "ProjectResearch"("projectId");

-- CreateIndex
CREATE INDEX "ProjectResearch_researchProjectId_idx" ON "ProjectResearch"("researchProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectResearch_projectId_researchProjectId_key" ON "ProjectResearch"("projectId", "researchProjectId");

-- CreateIndex
CREATE INDEX "ProductResearch_productId_idx" ON "ProductResearch"("productId");

-- CreateIndex
CREATE INDEX "ProductResearch_researchProjectId_idx" ON "ProductResearch"("researchProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductResearch_productId_researchProjectId_key" ON "ProductResearch"("productId", "researchProjectId");

-- CreateIndex
CREATE INDEX "ProjectInnovation_projectId_idx" ON "ProjectInnovation"("projectId");

-- CreateIndex
CREATE INDEX "ProjectInnovation_innovationId_idx" ON "ProjectInnovation"("innovationId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectInnovation_projectId_innovationId_key" ON "ProjectInnovation"("projectId", "innovationId");

-- CreateIndex
CREATE INDEX "ProductInnovation_productId_idx" ON "ProductInnovation"("productId");

-- CreateIndex
CREATE INDEX "ProductInnovation_innovationId_idx" ON "ProductInnovation"("innovationId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductInnovation_productId_innovationId_key" ON "ProductInnovation"("productId", "innovationId");

-- CreateIndex
CREATE INDEX "ProjectProduct_projectId_idx" ON "ProjectProduct"("projectId");

-- CreateIndex
CREATE INDEX "ProjectProduct_productId_idx" ON "ProjectProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectProduct_projectId_productId_key" ON "ProjectProduct"("projectId", "productId");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE INDEX "Product_isPublished_idx" ON "Product"("isPublished");

-- CreateIndex
CREATE INDEX "Product_featured_idx" ON "Product"("featured");

-- CreateIndex
CREATE INDEX "Project_category_idx" ON "Project"("category");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_isPublished_idx" ON "Project"("isPublished");

-- CreateIndex
CREATE INDEX "Project_featured_idx" ON "Project"("featured");

-- AddForeignKey
ALTER TABLE "ProjectTechnology" ADD CONSTRAINT "ProjectTechnology_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProjectTechnology" ADD CONSTRAINT "ProjectTechnology_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProductTechnology" ADD CONSTRAINT "ProductTechnology_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProductTechnology" ADD CONSTRAINT "ProductTechnology_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProjectResearch" ADD CONSTRAINT "ProjectResearch_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProjectResearch" ADD CONSTRAINT "ProjectResearch_researchProjectId_fkey" FOREIGN KEY ("researchProjectId") REFERENCES "ResearchProject"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProductResearch" ADD CONSTRAINT "ProductResearch_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProductResearch" ADD CONSTRAINT "ProductResearch_researchProjectId_fkey" FOREIGN KEY ("researchProjectId") REFERENCES "ResearchProject"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProjectInnovation" ADD CONSTRAINT "ProjectInnovation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProjectInnovation" ADD CONSTRAINT "ProjectInnovation_innovationId_fkey" FOREIGN KEY ("innovationId") REFERENCES "InnovationConcept"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProductInnovation" ADD CONSTRAINT "ProductInnovation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProductInnovation" ADD CONSTRAINT "ProductInnovation_innovationId_fkey" FOREIGN KEY ("innovationId") REFERENCES "InnovationConcept"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProjectProduct" ADD CONSTRAINT "ProjectProduct_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProjectProduct" ADD CONSTRAINT "ProjectProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
