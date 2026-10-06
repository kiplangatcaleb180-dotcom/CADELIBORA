import { Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const privileged = (role: string) => role === 'ADMIN' || role === 'SUPER_ADMIN';

export async function getMyAssignments(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required.' });
  try {
    const assignments = await prisma.$queryRawUnsafe<any[]>(`
      SELECT a."id", a."title", a."description", a."dueAt",
        json_build_object('id', c."id", 'title', c."title", 'slug', c."slug") AS "course",
        COALESCE((SELECT json_agg(json_build_object('id', s."id", 'content', s."content", 'submittedAt', s."submittedAt", 'grade', s."grade", 'feedback', s."feedback"))
          FROM "AssignmentSubmission" s WHERE s."assignmentId" = a."id" AND s."userId" = $1), '[]'::json) AS "submissions"
      FROM "Assignment" a JOIN "Course" c ON c."id" = a."courseId"
      WHERE EXISTS (SELECT 1 FROM "Enrollment" e WHERE e."courseId" = c."id" AND e."userId" = $1)
      ORDER BY a."dueAt" ASC NULLS LAST, a."createdAt" DESC`, req.user.userId);
    return res.json({ success: true, assignments });
  } catch (error) {
    console.error('Unable to load assignments:', error);
    return res.status(500).json({ success: false, message: 'Unable to load assignments.' });
  }
}

export async function getTeachingAssignments(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required.' });
  try {
    const courses = await prisma.$queryRawUnsafe<any[]>(
      `SELECT "id", "title" FROM "Course" WHERE ($1::boolean OR "instructorId" = $2) ORDER BY "title" ASC`,
      privileged(req.user.role), req.user.userId,
    );
    const assignments = await prisma.$queryRawUnsafe<any[]>(`
      SELECT a."id", a."title", a."description", a."dueAt",
        json_build_object('id', c."id", 'title', c."title") AS "course",
        COALESCE(json_agg(json_build_object('id', s."id", 'content', s."content", 'submittedAt', s."submittedAt", 'grade', s."grade", 'feedback', s."feedback", 'user', json_build_object('id', u."id", 'fullName', u."fullName", 'email', u."email"))) FILTER (WHERE s."id" IS NOT NULL), '[]'::json) AS "submissions"
      FROM "Assignment" a JOIN "Course" c ON c."id" = a."courseId"
      LEFT JOIN "AssignmentSubmission" s ON s."assignmentId" = a."id"
      LEFT JOIN "User" u ON u."id" = s."userId"
      WHERE ($1::boolean OR c."instructorId" = $2)
      GROUP BY a."id", c."id"
      ORDER BY a."dueAt" ASC NULLS LAST, a."createdAt" DESC`,
      privileged(req.user.role), req.user.userId,
    );
    return res.json({ success: true, courses, assignments });
  } catch (error) {
    console.error('Unable to load teaching assignments:', error);
    return res.status(500).json({ success: false, message: 'Unable to load course assignments.' });
  }
}

export async function createCourseAssignment(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required.' });
  const title = String(req.body?.title || '').trim();
  const description = String(req.body?.description || '').trim();
  const dueAt = req.body?.dueAt ? new Date(req.body.dueAt) : null;
  if (!title || !description || title.length > 200 || description.length > 10000 || (dueAt && Number.isNaN(dueAt.getTime()))) {
    return res.status(400).json({ success: false, message: 'Provide a valid title, description, and optional due date.' });
  }
  try {
    const courses = await prisma.$queryRawUnsafe<any[]>(`SELECT "id", "instructorId" FROM "Course" WHERE "id" = $1`, req.params.courseId);
    const course = courses[0];
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    if (!privileged(req.user.role) && course.instructorId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'You can only create assignments for your own courses.' });
    }
    const assignments = await prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO "Assignment" ("courseId", "title", "description", "dueAt") VALUES ($1, $2, $3, $4) RETURNING "id", "courseId", "title", "description", "dueAt", "createdAt"`,
      course.id, title, description, dueAt,
    );
    return res.status(201).json({ success: true, assignment: assignments[0] });
  } catch (error) {
    console.error('Unable to create assignment:', error);
    return res.status(500).json({ success: false, message: 'Unable to create assignment.' });
  }
}

export async function submitAssignment(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required.' });
  const content = String(req.body?.content || '').trim();
  if (!content || content.length > 50000) return res.status(400).json({ success: false, message: 'Submission must contain between 1 and 50,000 characters.' });
  try {
    const eligible = await prisma.$queryRawUnsafe<any[]>(`
      SELECT a."id", a."dueAt", e."id" AS "enrollmentId"
      FROM "Assignment" a JOIN "Enrollment" e ON e."courseId" = a."courseId"
      WHERE a."id" = $1 AND e."userId" = $2`, req.params.assignmentId, req.user.userId);
    if (!eligible.length) return res.status(404).json({ success: false, message: 'Assignment not found or you are not enrolled in its course.' });
    if (eligible[0].dueAt && new Date(eligible[0].dueAt).getTime() < Date.now()) return res.status(400).json({ success: false, message: 'The submission deadline has passed.' });
    const submissions = await prisma.$queryRawUnsafe<any[]>(`
      INSERT INTO "AssignmentSubmission" ("assignmentId", "userId", "content") VALUES ($1, $2, $3)
      ON CONFLICT ("assignmentId", "userId") DO UPDATE SET "content" = EXCLUDED."content", "submittedAt" = CURRENT_TIMESTAMP, "grade" = NULL, "feedback" = NULL
      RETURNING "id", "assignmentId", "content", "submittedAt", "grade", "feedback"`, req.params.assignmentId, req.user.userId, content);
    return res.json({ success: true, submission: submissions[0] });
  } catch (error) {
    console.error('Unable to submit assignment:', error);
    return res.status(500).json({ success: false, message: 'Unable to submit assignment.' });
  }
}

export async function gradeAssignmentSubmission(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required.' });
  const grade = Number(req.body?.grade);
  const feedback = req.body?.feedback == null ? null : String(req.body.feedback).trim();
  if (!Number.isInteger(grade) || grade < 0 || grade > 100 || (feedback && feedback.length > 5000)) {
    return res.status(400).json({ success: false, message: 'Grade must be an integer from 0 to 100; feedback may not exceed 5,000 characters.' });
  }
  try {
    const submissions = await prisma.$queryRawUnsafe<any[]>(`
      SELECT s."id", s."assignmentId", c."instructorId"
      FROM "AssignmentSubmission" s JOIN "Assignment" a ON a."id" = s."assignmentId"
      JOIN "Course" c ON c."id" = a."courseId"
      WHERE s."id" = $1 AND s."assignmentId" = $2`, req.params.submissionId, req.params.assignmentId);
    const submission = submissions[0];
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found.' });
    if (!privileged(req.user.role) && submission.instructorId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'You can only grade submissions for your own courses.' });
    }
    const updated = await prisma.$queryRawUnsafe<any[]>(
      `UPDATE "AssignmentSubmission" SET "grade" = $1, "feedback" = $2 WHERE "id" = $3 RETURNING "id", "assignmentId", "content", "submittedAt", "grade", "feedback"`,
      grade, feedback, submission.id,
    );
    return res.json({ success: true, submission: updated[0] });
  } catch (error) {
    console.error('Unable to grade assignment:', error);
    return res.status(500).json({ success: false, message: 'Unable to grade assignment.' });
  }
}
