import { Router } from 'express';

import {
  getOrganization,
  getOrganizationHistory,
  getOrganizationLeaders,
  getOrganizationDepartments,
  getOrganizationMilestones,
  getOrganizationStructure,
  getOrganizationPartners,
} from '../controllers/organization.controller.js';

const router = Router();

router.get('/', getOrganization);
router.get('/history', getOrganizationHistory);
router.get('/milestones', getOrganizationMilestones);
router.get('/leaders', getOrganizationLeaders);
router.get('/departments', getOrganizationDepartments);
router.get('/structure', getOrganizationStructure);
router.get('/partners', getOrganizationPartners);

export default router;
