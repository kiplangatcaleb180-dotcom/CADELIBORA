import { Router } from 'express';
import {
  getAdminCourses,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
  getAdminLessons,
  createAdminLesson,
  updateAdminLesson,
  deleteAdminLesson,
  getAdminEnrollments,
  updateAdminEnrollment,
  getAdminCertificates,
  updateAdminCertificate,
  getAdminAcademyStats,
} from '../controllers/adminAcademy.controller.js';
import {
  authenticate,
  authorizeRoles,
  requirePermission,
} from '../middleware/auth.js';

const router = Router();

router.use(
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN')
);

// Courses
router.get(
  '/courses',
  requirePermission('courses.view'),
  getAdminCourses
);

router.post(
  '/courses',
  requirePermission('courses.create'),
  createAdminCourse
);

router.put(
  '/courses/:courseId',
  requirePermission('courses.update'),
  updateAdminCourse
);

router.delete(
  '/courses/:courseId',
  requirePermission('courses.delete'),
  deleteAdminCourse
);


// Lessons
router.get(
  '/lessons',
  requirePermission('lessons.view'),
  getAdminLessons
);

router.post(
  '/lessons',
  requirePermission('lessons.create'),
  createAdminLesson
);

router.put(
  '/lessons/:lessonId',
  requirePermission('lessons.update'),
  updateAdminLesson
);

router.delete(
  '/lessons/:lessonId',
  requirePermission('lessons.delete'),
  deleteAdminLesson
);


// Enrollments
router.get(
  '/enrollments',
  requirePermission('enrollments.view'),
  getAdminEnrollments
);

router.put(
  '/enrollments/:enrollmentId',
  requirePermission('enrollments.update'),
  updateAdminEnrollment
);


// Certificates
router.get(
  '/certificates',
  requirePermission('certificates.view'),
  getAdminCertificates
);

router.put(
  '/certificates/:certificateId',
  requirePermission('certificates.update'),
  updateAdminCertificate
);


// Academy Statistics
router.get(
  '/stats',
  requirePermission('courses.view'),
  getAdminAcademyStats
);

export default router;
