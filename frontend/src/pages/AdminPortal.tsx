import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
const AdminLayout = lazy(() => import('./admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboardView = lazy(() => import('./admin/AdminDashboardView').then(m => ({ default: m.AdminDashboardView })));
const AdminUsersView = lazy(() => import('./admin/AdminUsersView').then(m => ({ default: m.AdminUsersView })));
const AdminProjectsProductsView = lazy(() => import('./admin/AdminProjectsProductsView').then(m => ({ default: m.AdminProjectsProductsView })));
const AdminResearchView = lazy(() => import('./admin/AdminResearchView').then(m => ({ default: m.AdminResearchView })));
const AdminAcademyView = lazy(() => import('./admin/AdminAcademyView').then(m => ({ default: m.AdminAcademyView })));
const AdminCMSView = lazy(() => import('./admin/AdminCMSView').then(m => ({ default: m.AdminCMSView })));
const AdminCommunityServicesView = lazy(() => import('./admin/AdminCommunityServicesView').then(m => ({ default: m.AdminCommunityServicesView })));
const AdminAnalyticsView = lazy(() => import('./admin/AdminAnalyticsView').then(m => ({ default: m.AdminAnalyticsView })));
const AdminSecurityView = lazy(() => import('./admin/AdminSecurityView').then(m => ({ default: m.AdminSecurityView })));
const AdminOrganizationView = lazy(() => import('./admin/AdminOrganizationView').then(m => ({ default: m.AdminOrganizationView })));
const AdminTechnologyView = lazy(() => import('./admin/AdminTechnologyView').then(m => ({ default: m.AdminTechnologyView })));
const AdminInnovationView = lazy(() => import('./admin/AdminInnovationView').then(m => ({ default: m.AdminInnovationView })));
const SuperAdminLayout = lazy(() => import('./admin/SuperAdminLayout').then(m => ({ default: m.SuperAdminLayout })));
const SuperAdminDashboardView = lazy(() => import('./admin/SuperAdminDashboardView').then(m => ({ default: m.SuperAdminDashboardView })));
const SuperAdminBrandingView = lazy(() => import('./admin/SuperAdminBrandingView').then(m => ({ default: m.SuperAdminBrandingView })));

export const AdminPortal: React.FC<{ superAdmin?: boolean }> = ({ superAdmin = false }) => {
  const location = useLocation();

  const renderView = () => {
    const path = location.pathname;
    if (superAdmin && (path === '/super-admin' || path === '/super-admin/')) return <SuperAdminDashboardView />;
    if (superAdmin && path.startsWith('/super-admin/branding')) return <SuperAdminBrandingView />;
    if (path.includes('/users') || path.includes('/roles') || path.includes('/permissions')) {
      return <AdminUsersView />;
    }
    if (path.includes('/projects') || path.includes('/products')) {
      return <AdminProjectsProductsView />;
    }
    if (path.includes('/research') || path.includes('/publications') || path.includes('/experiments')) {
      return <AdminResearchView />;
    }
    if (path.includes('/academy') || path.includes('/courses') || path.includes('/lessons') || path.includes('/certificates')) {
      return <AdminAcademyView />;
    }
    if (path.includes('/library') || path.includes('/articles') || path.includes('/news') || path.includes('/media')) {
      return <AdminCMSView />;
    }
    if (path.includes('/community') || path.includes('/services') || path.includes('/case-studies')) {
      return <AdminCommunityServicesView />;
    }
    if (path.includes('/analytics') || path.includes('/notifications') || path.includes('/settings')) {
      return <AdminAnalyticsView />;
    }
    if (path.includes('/security') || path.includes('/audit-logs') || path.includes('/system') || path.includes('/activity')) {
      return <AdminSecurityView />;
    }
    if (path.includes('/organization')) {
      return <AdminOrganizationView />;
    }
    if (path.includes('/innovation')) {
      return <AdminInnovationView />;
    }
    if (path.includes('/technology')) {
      return <AdminTechnologyView />;
    }
    return <AdminDashboardView />;
  };

  return (
    <>{superAdmin ? <SuperAdminLayout>
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-mono text-brand-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
              Loading admin module...
            </div>
          </div>
        }
      >
        {renderView()}
      </Suspense>
    </SuperAdminLayout> : <AdminLayout>
      <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-sm font-mono text-brand-400">Loading admin module...</div>}>
        {renderView()}
      </Suspense>
    </AdminLayout>}</>
  );
};

export default AdminPortal;
