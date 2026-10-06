import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const MyCourses: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const enrollments = user.enrollments || [];

  return (
    <div className="w-full">
      <section className="w-full space-y-8 max-w-6xl">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-6 h-6 text-brand-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-brand-400">
                Academy Workspace
              </span>
            </div>

            <h1 className="text-3xl font-black text-white">
              My Courses
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Continue learning from the courses you have enrolled in.
            </p>
          </div>

          {enrollments.length === 0 ? (
            <div className="p-10 rounded-3xl glass-panel border border-slate-800 text-center">
              <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-4" />

              <h2 className="text-lg font-bold text-white">
                No courses yet
              </h2>

              <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
                You have not enrolled in any Academy courses yet.
                Explore the Academy to find something to learn.
              </p>

              <Link
                to="/academy"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors"
              >
                Explore Academy
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enrollment: any) => {
                const course = enrollment.course;
                const progress = Number(enrollment.progress || 0);

                return (
                  <div
                    key={enrollment.id}
                    className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-mono uppercase tracking-wider text-brand-400">
                            Enrolled Course
                          </p>

                          <h2 className="mt-2 text-lg font-bold text-white">
                            {course?.title || 'Untitled Course'}
                          </h2>
                        </div>

                        <BookOpen className="w-5 h-5 text-brand-400 shrink-0" />
                      </div>

                      {course?.description && (
                        <p className="mt-3 text-sm text-slate-400 line-clamp-3">
                          {course.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          Progress
                        </span>

                        <span className="font-mono text-brand-400">
                          {progress}%
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-500 transition-all"
                          style={{
                            width: `${Math.min(Math.max(progress, 0), 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {course?.slug && (
                      <Link
                        to={`/academy/courses/${course.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 text-brand-400 text-xs font-semibold transition-colors"
                      >
                        Continue Course
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
