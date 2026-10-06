import { Router } from 'express';
import { getLibraryResources, getLibraryResourceById, saveResource, unsaveResource, getSavedResources, getKnowledgeCenter } from '../controllers/library.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getLibraryResources);
router.get('/knowledge/feed', getKnowledgeCenter);
router.get('/saved', authenticate, getSavedResources);
router.get('/:id', getLibraryResourceById);
router.post('/:id/save', authenticate, saveResource);
router.delete('/:id/save', authenticate, unsaveResource);

export default router;
