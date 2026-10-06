import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Award, ArrowLeft, Menu, X } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, EmptyState } from '../components/ui';

export const CourseLearn: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [curriculumOpen, setCurriculumOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchApi<{ course: any }>(`/courses/${slug}`);
        if (res.course) {
          setCourse(res.course);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) return <div className="p-20 text-center font-mono text-brand-400">Loading Learning Workspace...</div>;
  if (!course) return <div className="p-20 text-center text-rose-400 font-mono">Course not found.</div>;

  const lessons = course.lessons || [];
  const activeLesson = lessons[activeLessonIndex] || lessons[0];

  // Find enrollment for current user
  const enrollment = user?.enrollments?.find((e: any) => e.courseId === course.id);
  const progress = enrollment?.progress || 0;
  const isCompleted = enrollment?.completed || progress === 100;

  const handleUpdateProgress = async (newProgress: number) => {
    setSubmitting(true);
    try {
      await fetchApi(`/courses/${course.id}/progress`, {
        method: 'POST',
        body: JSON.stringify({ progress: newProgress }),
      });
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Failed to update progress');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <section className="w-full flex flex-col min-w-0">
        {/* Learning workspace header */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 rounded-2xl glass-panel border border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                to="/dashboard/courses"
                className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white shrink-0"
                aria-label="Back to my courses"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>

              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-400">
                  CADELIBORA Academy Workspace
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white truncate">
                  {course.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs font-mono text-slate-300 whitespace-nowrap">
                {progress}% Progress
              </span>

              <div className="flex-1 sm:flex-none w-full sm:w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-500 h-full rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Curriculum Accordion Bar */}
        <div className="lg:hidden px-4 sm:px-6 pt-4">
          <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden">
            <button
              onClick={() => setCurriculumOpen(!curriculumOpen)}
              className="w-full p-4 flex items-center justify-between bg-slate-900/90 text-xs font-mono font-bold text-brand-400"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Course Curriculum ({lessons.length} Lessons)</span>
              </div>
              <span>{curriculumOpen ? '▲ Hide' : '▼ Show'}</span>
            </button>

            {curriculumOpen && (
              <div className="p-4 bg-slate-950 space-y-1.5 font-mono text-xs border-t border-slate-800 max-h-60 overflow-y-auto">
                {lessons.map((lesson: any, idx: number) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonIndex(idx);
                      setCurriculumOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between border ${
                      activeLessonIndex === idx
                        ? 'bg-brand-600 text-white font-bold border-brand-500'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate mr-2">{lesson.order}. {lesson.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{lesson.durationMinutes}m</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content & Curriculum Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4">
          {/* Main Lesson Viewer */}
          <div className="lg:col-span-3 p-4 sm:p-8 space-y-8 overflow-y-auto">
            {activeLesson ? (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono text-brand-400">Lesson {activeLesson.order} of {lessons.length}</span>
                    <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">{activeLesson.title}</h1>
                  </div>
                  <Badge variant={isCompleted ? 'emerald' : 'blue'}>
                    {isCompleted ? 'Course Completed' : 'Studying'}
                  </Badge>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
                  <p className="text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {activeLesson.content}
                  </p>
                </div>

                {/* Lesson Navigation Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
                  <Button
                    variant="outline"
                    disabled={activeLessonIndex === 0}
                    onClick={() => setActiveLessonIndex((prev) => Math.max(0, prev - 1))}
                    className="w-full sm:w-auto"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous Lesson
                  </Button>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    {!isCompleted && (
                      <Button
                        variant="primary"
                        isLoading={submitting}
                        onClick={() => {
                          const step = Math.round(100 / lessons.length);
                          const nextProg = Math.min(progress + step, 100);
                          handleUpdateProgress(nextProg);
                        }}
                        className="w-full sm:w-auto"
                      >
                        Complete Lesson & Advance
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      disabled={activeLessonIndex === lessons.length - 1}
                      onClick={() => setActiveLessonIndex((prev) => Math.min(lessons.length - 1, prev + 1))}
                      className="w-full sm:w-auto"
                    >
                      Next Lesson <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>

                {isCompleted && (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                    <Award className="w-10 h-10 text-emerald-400 mx-auto" />
                    <h3 className="text-lg font-bold text-white">Course Completed!</h3>
                    <p className="text-xs text-slate-300">Your verifiable certificate has been issued and added to your dashboard.</p>
                    <Button variant="primary">
                      <Link to="/dashboard/certificates">View Certificate</Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState title="No lessons available" description="This course curriculum is currently being updated." />
            )}
          </div>

          {/* Curriculum Sidebar (Desktop) */}
          <aside className="hidden lg:block border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-950 p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">Course Curriculum</h3>
            <div className="space-y-1.5 font-mono text-xs">
              {lessons.map((lesson: any, idx: number) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between border ${
                    activeLessonIndex === idx
                      ? 'bg-brand-600 text-white font-bold border-brand-500'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate mr-2">{lesson.order}. {lesson.title}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{lesson.durationMinutes}m</span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};
