import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui';

interface AnalyticsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-slate-400">{description}</p>
        )}
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
};
