import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, EmptyState } from '../../components/ui';
import { fetchApi } from '../../lib/api';

export const DashboardCoursesPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const enrollments = user?.enrollments || [];

  const handleUpdateProgress = async (courseId: string, currentProgress: number) => {
    const nextProgress = Math.min(currentProgress + 25, 100);
    try {
      await fetchApi(`/courses/${courseId}/progress`, {
        method: 'POST',
        body: JSON.stringify({ progress: nextProgress }),
      });
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Failed to update progress');
    }
  };

  return (
    <div className="w-full">
      <section className="w-full space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-brand-400 font-bold uppercase mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Academy Workspace</span>
            </div>
            <h1 className="text-3xl font-black text-white">My Enrolled Courses</h1>
          </div>
          <Button variant="primary">
            <Link to="/academy">Explore More Courses</Link>
          </Button>
        </div>

        {enrollments.length === 0 ? (
          <EmptyState
            title="No enrolled courses"
            description="You haven't enrolled in any academy courses yet. Start your learning journey today."
            actionLabel="Browse Academy"
            onAction={() => window.location.href = '/academy'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((enrol: any) => {
              const course = enrol.course;
              const progress = enrol.progress || 0;
              return (
                <Card key={enrol.id} hoverEffect className="space-y-4">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant={progress === 100 ? 'emerald' : 'blue'}>
                        {progress === 100 ? 'Completed' : 'In Progress'}
                      </Badge>
                      <span className="font-mono text-xs text-slate-400">{progress}% Complete</span>
                    </div>
                    <CardTitle className="text-xl font-bold mt-2">{course?.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course?.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-500 h-full rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      {progress < 100 && (
                        <Button variant="outline" size="sm" onClick={() => handleUpdateProgress(course.id, progress)}>
                          Advance Progress (+25%)
                        </Button>
                      )}
                      {course?.slug && (
                        <Button variant="primary" size="sm">
                          <Link to={`/academy/courses/${course.slug}/learn`}>
                            Continue <ArrowRight className="w-4 h-4 ml-1.5" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
