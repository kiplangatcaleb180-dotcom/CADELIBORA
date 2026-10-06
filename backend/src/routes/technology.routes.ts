import { Router } from 'express';

import {
  getTechnologyOverview,
  getTechnologyBySlug,
  getTechnologies,
  getTechnologyDomains,
  getTechnologyStack,
  getTechnologySections,
} from '../controllers/technology.controller.js';

const router = Router();

router.get('/', getTechnologyOverview);

router.get('/technologies', getTechnologies);

router.get('/domains', getTechnologyDomains);

router.get('/stack', getTechnologyStack);

router.get('/sections', getTechnologySections);

router.get('/:slug', getTechnologyBySlug);

export default router;
