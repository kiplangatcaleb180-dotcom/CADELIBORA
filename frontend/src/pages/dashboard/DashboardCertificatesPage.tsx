import React from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, EmptyState } from '../../components/ui';

export const DashboardCertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const certificates = user?.certificates || [];

  return (
    <div className="w-full">
      <section className="w-full space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase mb-1">
            <Award className="w-4 h-4" />
            <span>Verifiable Credentials</span>
          </div>
          <h1 className="text-3xl font-black text-white">My Earned Certificates</h1>
        </div>

        {certificates.length === 0 ? (
          <EmptyState
            title="No certificates earned yet"
            description="Complete academy courses to earn verified verifiable credentials and certificates."
            actionLabel="View Academy Courses"
            onAction={() => window.location.href = '/academy'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert: any) => (
              <Card key={cert.id} glow className="space-y-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="emerald">Verified Certificate</Badge>
                    <span className="font-mono text-xs text-slate-400">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                  </div>
                  <CardTitle className="text-xl font-bold mt-2">{cert.course?.title}</CardTitle>
                  <CardDescription className="font-mono text-xs text-emerald-400">Certificate No: {cert.certificateNumber}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300">
                    Officially awarded by CADELIBORA Academy for successful mastery and course completion.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
