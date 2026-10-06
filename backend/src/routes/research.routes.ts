import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getAllResearchProjects,
  getMyResearchProjects,
  getResearchProjectBySlug,
  getPublications,
} from '../controllers/research.controller.js';

const router = Router();

router.get('/projects', getAllResearchProjects);
router.get('/my-projects', authenticate, getMyResearchProjects);
router.get('/projects/:slug', getResearchProjectBySlug);
router.get('/publications', getPublications);

export default router;
