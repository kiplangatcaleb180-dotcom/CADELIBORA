import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  ArrowRight,
  Compass,
  Award,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardLearningPage: React.FC = () => {
  const { user } = useAuth();

  const enrollments = user?.enrollments || [];

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-brand-500/10 via-transparent to-cyan-500/10" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/20">
              <BookOpen className="h-6 w-6 text-brand-400" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">
                Learning Workspace
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Lessons & Learning
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-sm sm:text-base leading-7 text-slate-400">
            Continue your courses, explore new learning opportunities, track
            your progress, and access your educational resources.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          to="/dashboard/courses"
          className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-6 transition-all hover:-translate-y-1 hover:border-brand-500/40 hover:bg-slate-900/70"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10">
              <GraduationCap className="h-5 w-5 text-brand-400" />
            </div>

            <ArrowRight className="h-5 w-5 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-brand-400" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-white">
            My Courses
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Continue your enrolled courses and manage your learning progress.
          </p>

          <div className="mt-4 text-sm font-semibold text-brand-400">
            {enrollments.length} enrolled course{enrollments.length === 1 ? '' : 's'}
          </div>
        </Link>

        <Link
          to="/academy"
          className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-6 transition-all hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-slate-900/70"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
              <Compass className="h-5 w-5 text-cyan-400" />
            </div>

            <ArrowRight className="h-5 w-5 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-cyan-400" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-white">
            Explore Academy
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Discover courses, subjects, and new opportunities to expand your
            knowledge.
          </p>

          <div className="mt-4 text-sm font-semibold text-cyan-400">
            Browse courses
          </div>
        </Link>
      </section>

      {/* Enrolled Learning */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-white">
              Continue Learning
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Pick up where you left off.
            </p>
          </div>

          <Award className="hidden sm:block h-6 w-6 text-slate-600" />
        </div>

        {enrollments.length === 0 ? (
          <div className="p-8 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-700" />

            <h3 className="mt-4 font-semibold text-white">
              No courses yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Explore the Academy and enroll in a course to begin your
              learning journey.
            </p>

            <Link
              to="/academy"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-400"
            >
              Explore Academy
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {enrollments.slice(0, 5).map((enrol: any) => {
              const course = enrol.course;
              const progress = enrol.progress || 0;

              if (!course?.slug) return null;

              return (
                <div
                  key={enrol.id || course.id}
                  className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-white">
                      {course.title || course.name || 'Untitled Course'}
                    </h3>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-2 flex-1 min-w-[160px] max-w-sm overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-brand-500 transition-all"
                          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        />
                      </div>

                      <span className="text-xs font-semibold text-slate-400">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/academy/courses/${course.slug}/learn`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-400"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
