export function hasPermission(role: string, permission: string): boolean {
  if (!role) return false;
  const permissions: Record<string, string[]> = {
    SUPER_ADMIN: ['*'],
    ADMIN: [
      'users.view', 'users.create', 'users.update', 'users.suspend',
      'roles.view', 'roles.assign',
      'courses.view', 'courses.create', 'courses.update', 'courses.publish',
      'research.view', 'research.create', 'research.update', 'research.publish',
      'projects.view', 'projects.create', 'projects.update', 'projects.publish',
      'innovation.view', 'innovation.create', 'innovation.update', 'innovation.publish',
      'library.view', 'library.create', 'library.update', 'library.publish',
      'community.view', 'community.moderate', 'community.remove',
      'notifications.view', 'notifications.create', 'notifications.manage',
      'services.view', 'services.manage',
      'products.view', 'products.manage',
      'analytics.view',
      'audit_logs.view',
      'settings.view', 'settings.update',
      'ai.view', 'ai.manage',
      'storage.view', 'storage.manage'
    ],
    INSTRUCTOR: ['courses.view', 'courses.create', 'courses.update', 'analytics.view'],
    RESEARCHER: ['research.view', 'research.create', 'research.update'],
    DEVELOPER: ['projects.view', 'projects.create', 'projects.update', 'ai.view'],
    MODERATOR: ['community.view', 'community.moderate', 'community.remove'],
    STUDENT: ['courses.view', 'library.view', 'community.view', 'research.view'],
    USER: ['library.view', 'community.view'],
    PARTNER: ['services.view', 'products.view']
  };

  const userPerms = permissions[role] || [];
  if (userPerms.includes('*')) return true;
  if (userPerms.includes(permission)) return true;

  const [domain] = permission.split('.');
  if (userPerms.includes(`${domain}.*`)) return true;

  return false;
}
