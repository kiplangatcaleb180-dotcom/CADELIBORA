import { Router } from 'express';
import { getAllCourses, getCourseBySlug, enrollInCourse, updateProgress } from '../controllers/courses.controller.js';
import { createCourseAssignment, getMyAssignments, getTeachingAssignments, gradeAssignmentSubmission, submitAssignment } from '../controllers/assignments.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllCourses);
router.get('/assignments/mine', authenticate, getMyAssignments);
router.get('/assignments/teaching', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'), getTeachingAssignments);
router.post('/:courseId/assignments', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'), createCourseAssignment);
router.post('/assignments/:assignmentId/submission', authenticate, submitAssignment);
router.patch('/assignments/:assignmentId/submissions/:submissionId', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'), gradeAssignmentSubmission);
router.get('/:slug', getCourseBySlug);
router.post('/:courseId/enroll', authenticate, enrollInCourse);
router.post('/:courseId/progress', authenticate, updateProgress);

export default router;
