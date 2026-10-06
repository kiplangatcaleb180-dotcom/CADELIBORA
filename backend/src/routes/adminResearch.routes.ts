import { Router } from 'express';
import {
  getAdminResearchProjects,
  createResearchProject,
  updateResearchProject,
  deleteResearchProject,
  getAdminPublications,
  createPublication,
  updatePublication,
  deletePublication,
} from '../controllers/adminResearch.controller.js';
import {
  authenticate,
  authorizeRoles,
  requirePermission,
} from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'RESEARCHER'));

// Research Projects
router.get(
  '/projects',
  requirePermission('research.view'),
  getAdminResearchProjects
);

router.post(
  '/projects',
  requirePermission('research.create'),
  createResearchProject
);

router.put(
  '/projects/:projectId',
  requirePermission('research.update'),
  updateResearchProject
);

router.delete(
  '/projects/:projectId',
  requirePermission('research.update'),
  deleteResearchProject
);

// Publications
router.get(
  '/publications',
  requirePermission('research.view'),
  getAdminPublications
);

router.post(
  '/publications',
  requirePermission('research.create'),
  createPublication
);

router.put(
  '/publications/:publicationId',
  requirePermission('research.update'),
  updatePublication
);

router.delete(
  '/publications/:publicationId',
  requirePermission('research.update'),
  deletePublication
);

export default router;
