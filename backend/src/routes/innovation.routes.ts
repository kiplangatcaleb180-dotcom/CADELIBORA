import { Router } from 'express';
import { getInnovationConcepts, getConceptById, createInnovationConcept, voteConcept } from '../controllers/innovation.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getInnovationConcepts);
router.get('/:id', getConceptById);
router.post('/', authenticate, createInnovationConcept);
router.post('/:conceptId/vote', authenticate, voteConcept);

export default router;
