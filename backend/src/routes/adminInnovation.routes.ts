import { Router } from 'express';
import {
  getAdminInnovationConcepts,
  createAdminInnovationConcept,
  updateAdminInnovationConcept,
  deleteAdminInnovationConcept,
} from '../controllers/adminInnovation.controller.js';
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

// Innovation Concepts
router.get(
  '/concepts',
  requirePermission('innovation.view'),
  getAdminInnovationConcepts
);

router.post(
  '/concepts',
  requirePermission('innovation.create'),
  createAdminInnovationConcept
);

router.put(
  '/concepts/:conceptId',
  requirePermission('innovation.update'),
  updateAdminInnovationConcept
);

router.delete(
  '/concepts/:conceptId',
  requirePermission('innovation.update'),
  deleteAdminInnovationConcept
);

export default router;
