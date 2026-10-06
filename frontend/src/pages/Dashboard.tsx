import React from 'react';
import { DashboardOverview } from './dashboard/DashboardOverview';
import { useAuth } from '../contexts/AuthContext';
import { ModeratorDashboardPage } from './dashboard/ModeratorDashboardPage';
import { StudentDashboardPage } from './dashboard/StudentDashboardPage';
import { OperationsDashboardPage } from './dashboard/OperationsDashboardPage';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'MODERATOR') return <ModeratorDashboardPage />;
  if (user?.role === 'STUDENT') return <StudentDashboardPage />;
  if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') return <OperationsDashboardPage />;
  return <DashboardOverview />;
};
