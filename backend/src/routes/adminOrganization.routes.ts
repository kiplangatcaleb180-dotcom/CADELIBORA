import { Router } from 'express';

import {
  getAdminOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  publishOrganization,
  unpublishOrganization,
  getAdminOrganizationHistory,
  createOrganizationHistory,
  updateOrganizationHistory,
  deleteOrganizationHistory,
  getAdminOrganizationMilestones,
  createOrganizationMilestone,
  updateOrganizationMilestone,
  deleteOrganizationMilestone,
  getAdminOrganizationLeaders,
  createOrganizationLeader,
  updateOrganizationLeader,
  deleteOrganizationLeader,
  getAdminOrganizationDepartments,
  createOrganizationDepartment,
  updateOrganizationDepartment,
  deleteOrganizationDepartment,
  getAdminOrganizationUnits,
  createOrganizationUnit,
  updateOrganizationUnit,
  deleteOrganizationUnit,
  getAdminOrganizationPartners,
  createOrganizationPartner,
  updateOrganizationPartner,
  deleteOrganizationPartner,
} from '../controllers/adminOrganization.controller.js';

import {
  authenticate,
  authorizeRoles,
  requirePermission,
} from '../middleware/auth.js';

const router = Router();

// Every Organization CMS operation requires an authenticated
// ADMIN or SUPER_ADMIN account.
router.use(
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN')
);

// View Organization CMS data
router.get(
  '/',
  requirePermission('organization.view'),
  getAdminOrganization
);

// Create Organization
router.post(
  '/',
  requirePermission('organization.create'),
  createOrganization
);

// Update Organization
router.put(
  '/:organizationId',
  requirePermission('organization.update'),
  updateOrganization
);

// Delete Organization
router.delete(
  '/:organizationId',
  requirePermission('organization.delete'),
  deleteOrganization
);

// Publish Organization
router.patch(
  '/:organizationId/publish',
  requirePermission('organization.publish'),
  publishOrganization
);

// Unpublish Organization
router.patch(
  '/:organizationId/unpublish',
  requirePermission('organization.publish'),
  unpublishOrganization
);

// Organization History
router.get(
  '/:organizationId/history',
  requirePermission('organization.view'),
  getAdminOrganizationHistory
);

router.post(
  '/:organizationId/history',
  requirePermission('organization.create'),
  createOrganizationHistory
);

router.put(
  '/:organizationId/history/:historyId',
  requirePermission('organization.update'),
  updateOrganizationHistory
);

router.delete(
  '/:organizationId/history/:historyId',
  requirePermission('organization.delete'),
  deleteOrganizationHistory
);

export default router;

router.get(
  '/:organizationId/milestones',
  requirePermission('organization.view'),
  getAdminOrganizationMilestones
);

router.post(
  '/:organizationId/milestones',
  requirePermission('organization.create'),
  createOrganizationMilestone
);

router.put(
  '/:organizationId/milestones/:milestoneId',
  requirePermission('organization.update'),
  updateOrganizationMilestone
);

router.delete(
  '/:organizationId/milestones/:milestoneId',
  requirePermission('organization.delete'),
  deleteOrganizationMilestone
);

router.get(
  '/:organizationId/leaders',
  requirePermission('organization.view'),
  getAdminOrganizationLeaders
);

router.post(
  '/:organizationId/leaders',
  requirePermission('organization.create'),
  createOrganizationLeader
);

router.put(
  '/:organizationId/leaders/:leaderId',
  requirePermission('organization.update'),
  updateOrganizationLeader
);

router.delete(
  '/:organizationId/leaders/:leaderId',
  requirePermission('organization.delete'),
  deleteOrganizationLeader
);

router.get(
  '/:organizationId/departments',
  requirePermission('organization.view'),
  getAdminOrganizationDepartments
);

router.post(
  '/:organizationId/departments',
  requirePermission('organization.create'),
  createOrganizationDepartment
);

router.put(
  '/:organizationId/departments/:departmentId',
  requirePermission('organization.update'),
  updateOrganizationDepartment
);

router.delete(
  '/:organizationId/departments/:departmentId',
  requirePermission('organization.delete'),
  deleteOrganizationDepartment
);

router.get(
  '/:organizationId/structure',
  requirePermission('organization.view'),
  getAdminOrganizationUnits
);

router.post(
  '/:organizationId/structure',
  requirePermission('organization.create'),
  createOrganizationUnit
);

router.put(
  '/:organizationId/structure/:unitId',
  requirePermission('organization.update'),
  updateOrganizationUnit
);

router.delete(
  '/:organizationId/structure/:unitId',
  requirePermission('organization.delete'),
  deleteOrganizationUnit
);
router.get(
  '/:organizationId/partners',
  requirePermission('organization.view'),
  getAdminOrganizationPartners
);

router.post(
  '/:organizationId/partners',
  requirePermission('organization.create'),
  createOrganizationPartner
);

router.put(
  '/:organizationId/partners/:partnerId',
  requirePermission('organization.update'),
  updateOrganizationPartner
);

router.delete(
  '/:organizationId/partners/:partnerId',
  requirePermission('organization.delete'),
  deleteOrganizationPartner
);
