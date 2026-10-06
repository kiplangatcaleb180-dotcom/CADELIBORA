import {
  Activity, Award, BarChart3, Bell, BookMarked, BookOpen, BriefcaseBusiness,
  ClipboardCheck, Code2, Cpu, FileText, FlaskConical, FolderGit2, GraduationCap,
  Handshake, LayoutDashboard, Library, MessageSquare, Settings, ShieldCheck,
  Users, Wrench,
} from 'lucide-react';

export interface DashboardNavItem {
  label: string;
  path: string;
  icon: any;
}

export interface DashboardRoleConfig {
  label: string;
  description: string;
  navItems: DashboardNavItem[];
}

const item = (label: string, slug: string, icon: any): DashboardNavItem => ({
  label,
  path: slug ? `/dashboard/${slug}` : '/dashboard',
  icon,
});

const nav = (...items: DashboardNavItem[]) => items;
const dashboard = item('Dashboard', '', LayoutDashboard);
const messages = item('Messages', 'messages', MessageSquare);
const notifications = item('Notifications', 'notifications', Bell);
const settings = item('Settings', 'settings', Settings);
const projects = item('Projects', 'projects', FolderGit2);
const community = item('Community', 'community', MessageSquare);
const analytics = item('Analytics', 'analytics', BarChart3);
const library = item('Library', 'library', BookMarked);

export const dashboardRoleConfig: Record<string, DashboardRoleConfig> = {
  SUPER_ADMIN: {
    label: 'Super Admin Workspace',
    description: 'Your assigned work and platform activity across CADELIBORA.',
    navItems: nav(dashboard, item('My Work', 'my-work', Activity), item('Tasks', 'tasks', ClipboardCheck), projects, analytics, item('Reports', 'reports', FileText), library, community, messages, notifications, settings),
  },
  ADMIN: {
    label: 'Admin Workspace',
    description: 'Your assigned work, projects, and operational reporting.',
    navItems: nav(dashboard, item('My Work', 'my-work', Activity), item('Tasks', 'tasks', ClipboardCheck), projects, analytics, item('Reports', 'reports', FileText), library, community, messages, notifications, settings),
  },
  MODERATOR: {
    label: 'Moderation Workspace',
    description: 'Review community content and manage moderation responsibilities.',
    navItems: nav(dashboard, item('Moderation', 'moderation', ShieldCheck), item('Reports', 'reports', FileText), item('Flagged Content', 'flagged-content', ShieldCheck), item('Users', 'users', Users), community, messages, notifications, analytics, settings),
  },
  INSTRUCTOR: {
    label: 'Teaching Workspace',
    description: 'Manage courses, learners, assessments, and teaching activity.',
    navItems: nav(dashboard, item('Courses', 'courses', GraduationCap), item('Lessons', 'lessons', BookOpen), item('Students', 'students', Users), item('Assessments', 'assessments', ClipboardCheck), item('Certificates', 'certificates', Award), analytics, community, notifications, settings),
  },
  RESEARCHER: {
    label: 'Research Workspace',
    description: 'Organize research programs, experiments, publications, and collaborators.',
    navItems: nav(dashboard, item('Research', 'research', FlaskConical), projects, item('Experiments', 'experiments', Cpu), item('Publications', 'publications', BookOpen), item('Collaborators', 'collaborators', Users), library, community, notifications, settings),
  },
  DEVELOPER: {
    label: 'Developer Workspace',
    description: 'Build projects and access developer documentation, APIs, and tools.',
    navItems: nav(dashboard, projects, item('Developer Center', 'developer-center', Code2), item('Documentation', 'documentation', BookOpen), item('APIs', 'apis', Code2), item('Tools', 'tools', Wrench), item('Experiments', 'experiments', FlaskConical), community, notifications, settings),
  },
  PARTNER: {
    label: 'Partner Workspace',
    description: 'Coordinate partnerships, programs, projects, and shared resources.',
    navItems: nav(dashboard, item('Partnerships', 'partnerships', Handshake), projects, item('Programs', 'programs', BriefcaseBusiness), item('Collaborators', 'collaborators', Users), item('Resources', 'resources', Library), analytics, community, messages, notifications, settings),
  },
  STUDENT: {
    label: 'Learning Workspace',
    description: 'Continue courses, review progress, and access your learning resources.',
    navItems: nav(dashboard, item('My Courses', 'courses', GraduationCap), item('Learning Progress', 'progress', BarChart3), item('Assessments', 'assessments', ClipboardCheck), item('Certificates', 'certificates', Award), library, community, messages, notifications, settings),
  },
  USER: {
    label: 'Personal Workspace',
    description: 'Your CADELIBORA activity, resources, and community access.',
    navItems: nav(dashboard, projects, library, community, messages, notifications, settings),
  },
};

export const defaultDashboardRole: DashboardRoleConfig = dashboardRoleConfig.USER;

export const getDashboardRoleConfig = (role?: string): DashboardRoleConfig =>
  dashboardRoleConfig[role || 'USER'] || defaultDashboardRole;
