export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    'users.view', 'users.create', 'users.update', 'users.suspend', 'users.delete',
    'roles.view', 'roles.assign',
    'courses.view', 'courses.create', 'courses.update', 'courses.delete', 'courses.publish',
    'lessons.view', 'lessons.create', 'lessons.update', 'lessons.delete',
    'enrollments.view', 'enrollments.update',
    'certificates.view', 'certificates.create', 'certificates.update',
    'research.view', 'research.create', 'research.update', 'research.publish',
    'projects.view',
    'projects.create',
    'projects.update',
    'projects.delete',
    'projects.publish',
    'innovation.view', 'innovation.create', 'innovation.update', 'innovation.publish',
    'library.view', 'library.create', 'library.update', 'library.delete', 'library.publish',
    'articles.view', 'articles.create', 'articles.update', 'articles.delete', 'articles.publish',
    'community.view', 'community.moderate', 'community.remove',
    'notifications.view', 'notifications.create', 'notifications.manage',
    'services.view', 'services.manage',
    'products.view', 'products.manage',
    'analytics.view',
    'audit_logs.view',
    'settings.view', 'settings.update',
    'ai.view', 'ai.manage',
    'storage.view', 'storage.manage',
    'organization.view', 'organization.create', 'organization.update',
    'organization.delete', 'organization.publish',
    'technology.view', 'technology.create', 'technology.update',
'technology.delete', 'technology.publish'

  ],
  INSTRUCTOR: [
    'courses.view', 'courses.create', 'courses.update', 'analytics.view'
  ],
  RESEARCHER: [
    'research.view', 'research.create', 'research.update'
  ],
  DEVELOPER: [
    'projects.view',
    'projects.create',
    'projects.update',
    'projects.delete',
    'ai.view'
  ],
  MODERATOR: [
    'community.view', 'community.moderate', 'community.remove'
  ],
  STUDENT: [
    'courses.view', 'library.view', 'community.view', 'research.view'
  ],
  USER: [
    'library.view', 'community.view'
  ],
  PARTNER: [
    'services.view', 'products.view'
  ]
};

export function userHasPermission(role: string, permission: string): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  if (permissions.includes('*')) return true;
  if (permissions.includes(permission)) return true;

  const [domain] = permission.split('.');
  if (permissions.includes(`${domain}.*`)) return true;

  return false;
}
