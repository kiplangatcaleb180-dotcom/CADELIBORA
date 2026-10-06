import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  ArrowRight,
  TrendingUp,
  Target,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardProgressPage: React.FC = () => {
  const { user } = useAuth();

  const enrollments = user?.enrollments || [];

  const normalizedProgress = enrollments.map((enrol: any) => ({
    ...enrol,
    progress: Math.min(100, Math.max(0, Number(enrol.progress) || 0)),
  }));

  const overallProgress =
    normalizedProgress.length > 0
      ? normalizedProgress.reduce(
          (total: number, enrol: any) => total + enrol.progress,
          0
        ) / normalizedProgress.length
      : 0;

  const completedCourses = normalizedProgress.filter(
    (enrol: any) => enrol.progress >= 100
  ).length;

  const activeCourses = normalizedProgress.filter(
    (enrol: any) => enrol.progress > 0 && enrol.progress < 100
  ).length;

  const notStartedCourses = normalizedProgress.filter(
    (enrol: any) => enrol.progress === 0
  ).length;

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-violet-500/10 via-transparent to-brand-500/10" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20">
              <BarChart3 className="h-6 w-6 text-violet-400" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
                Learning Workspace
              </p>

              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Learning Progress
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-sm sm:text-base leading-7 text-slate-400">
            Track your course completion, monitor your learning activity, and
            see how far you have progressed across your studies.
          </p>
        </div>
      </section>

      {/* Main Progress */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Overall Learning Progress
              </p>

              <h2 className="mt-2 text-4xl sm:text-5xl font-black text-white">
                {Math.round(overallProgress)}%
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10">
              <TrendingUp className="h-7 w-7 text-brand-400" />
            </div>
          </div>

          <div className="mt-7 h-4 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-700"
              style={{
                width: `${Math.min(100, Math.max(0, overallProgress))}%`,
              }}
            />
          </div>

          <p className="mt-3 text-sm text-slate-500">
            {normalizedProgress.length === 0
              ? 'Enroll in a course to start tracking your learning progress.'
              : 'Your overall progress is calculated from your enrolled courses.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Course Completion
            </span>

            <Target className="h-5 w-5 text-violet-400" />
          </div>

          <div className="mt-5 text-4xl font-black text-white">
            {completedCourses}
          </div>

          <p className="mt-2 text-sm text-slate-500">
            of {normalizedProgress.length} enrolled course
            {normalizedProgress.length === 1 ? '' : 's'} completed
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Active Courses
            </span>

            <Clock3 className="h-5 w-5 text-blue-400" />
          </div>

          <div className="mt-3 text-3xl font-black text-white">
            {activeCourses}
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Currently in progress
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Completed
            </span>

            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>

          <div className="mt-3 text-3xl font-black text-white">
            {completedCourses}
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Finished courses
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Not Started
            </span>

            <BookOpen className="h-5 w-5 text-amber-400" />
          </div>

          <div className="mt-3 text-3xl font-black text-white">
            {notStartedCourses}
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Courses awaiting progress
          </p>
        </div>
      </section>

      {/* Course Progress */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-white">
              Course Progress
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Track your progress across individual courses.
            </p>
          </div>

          <BarChart3 className="hidden sm:block h-6 w-6 text-slate-600" />
        </div>

        {normalizedProgress.length === 0 ? (
          <div className="p-10 sm:p-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800">
              <BookOpen className="h-7 w-7 text-slate-600" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-white">
              No learning data yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Your course progress will appear here after you enroll in
              Academy courses.
            </p>

            <Link
              to="/academy"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-400"
            >
              Explore Academy
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {normalizedProgress.map((enrol: any) => {
              const course = enrol.course;

              if (!course?.slug) return null;

              const progress = enrol.progress;

              return (
                <div
                  key={enrol.id || course.id}
                  className="p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-white">
                        {course.title || course.name || 'Untitled Course'}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {progress >= 100
                          ? 'Course completed'
                          : progress > 0
                            ? 'Course in progress'
                            : 'Not started'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">
                        {Math.round(progress)}%
                      </span>

                      <Link
                        to={`/academy/courses/${course.slug}/learn`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-brand-500/40 hover:text-brand-400"
                      >
                        {progress >= 100 ? 'Review' : 'Continue'}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
