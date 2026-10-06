import { Router } from 'express';
import { uploadAsset } from '../controllers/storage.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/upload', authenticate, uploadAsset);

export default router;
