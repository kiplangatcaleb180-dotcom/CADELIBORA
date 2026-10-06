CREATE TABLE "Assignment" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "courseId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "dueAt" TIMESTAMP(6),
  "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssignmentSubmission" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "assignmentId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "submittedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "grade" INTEGER,
  "feedback" TEXT,
  CONSTRAINT "AssignmentSubmission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AssignmentSubmission_assignmentId_userId_key"
  ON "AssignmentSubmission"("assignmentId", "userId");
CREATE INDEX "Assignment_courseId_dueAt_idx" ON "Assignment"("courseId", "dueAt");
CREATE INDEX "AssignmentSubmission_userId_submittedAt_idx" ON "AssignmentSubmission"("userId", "submittedAt");

ALTER TABLE "Assignment"
  ADD CONSTRAINT "Assignment_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "AssignmentSubmission"
  ADD CONSTRAINT "AssignmentSubmission_assignmentId_fkey"
  FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "AssignmentSubmission"
  ADD CONSTRAINT "AssignmentSubmission_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
