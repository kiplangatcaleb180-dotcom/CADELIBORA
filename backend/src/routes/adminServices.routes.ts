import { Router } from 'express';
import {
  getAdminServices,
  createAdminService,
  updateAdminService,
  deleteAdminService,
  createAdminCaseStudy,
  updateAdminCaseStudy,
  deleteAdminCaseStudy,
} from '../controllers/adminServices.controller.js';
import { authenticate, authorizeRoles, requirePermission } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN'));

router.get('/', requirePermission('services.view'), getAdminServices);

router.post('/services', requirePermission('services.manage'), createAdminService);
router.put('/services/:serviceId', requirePermission('services.manage'), updateAdminService);
router.delete('/services/:serviceId', requirePermission('services.manage'), deleteAdminService);

router.post('/case-studies', requirePermission('services.manage'), createAdminCaseStudy);
router.put('/case-studies/:caseStudyId', requirePermission('services.manage'), updateAdminCaseStudy);
router.delete('/case-studies/:caseStudyId', requirePermission('services.manage'), deleteAdminCaseStudy);

export default router;
