import { Router } from 'express';
import { getPlatformBranding, updatePlatformLogo } from '../controllers/branding.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();
router.get('/', getPlatformBranding);
router.put('/logo', authenticate, authorizeRoles('SUPER_ADMIN'), updatePlatformLogo);
export default router;
