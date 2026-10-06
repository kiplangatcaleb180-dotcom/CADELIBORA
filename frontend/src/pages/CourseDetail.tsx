import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { PlayCircle, CheckCircle, Award, ArrowLeft, BookOpen, HelpCircle } from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetchApi<{ course: any }>(`/courses/${slug}`);
        if (res.course) {
          setCourse(res.course);
          if (res.course.lessons?.length > 0) {
            setActiveLesson(res.course.lessons[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [slug]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    try {
      await fetchApi(`/courses/${course.id}/enroll`, { method: 'POST' });
      alert('Enrolled successfully! Enjoy your studies.');
    } catch (err: any) {
      alert(err.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (!selectedOption) return;
    const isCorrect = selectedOption === 'A';
    const score = isCorrect ? 100 : 50;
    setQuizScore(score);

    if (user && course) {
      await fetchApi(`/courses/${course.id}/progress`, {
        method: 'POST',
        body: JSON.stringify({ progress: score }),
      });
    }
  };

  if (loading) return <div className="p-20 text-center text-brand-400 font-mono">Loading Course Curriculum...</div>;
  if (!course) return <div className="p-20 text-center text-rose-400">Course not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <button onClick={() => navigate('/academy')} className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Academy Catalog</span>
      </button>

      {/* Course Hero Header */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <span className="px-3 py-1 bg-brand-500/10 text-brand-400 font-mono text-xs font-bold rounded-full">{course.category}</span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{course.title}</h1>
            <p className="text-slate-300 text-sm leading-relaxed">{course.description}</p>
            <div className="flex items-center gap-6 text-xs font-mono text-slate-400 pt-2">
              <span>Instructor: {course.instructor?.fullName}</span>
              <span>Level: {course.level}</span>
              <span>Duration: {course.duration}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" />
              <span>Enroll in Course</span>
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum & Lesson Player */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            <span>Curriculum ({course.lessons?.length || 0} Lessons)</span>
          </h3>

          <div className="space-y-2">
            {course.lessons?.map((lesson: any) => (
              <button
                key={lesson.id}
                onClick={() => {
                  setActiveLesson(lesson);
                  setQuizScore(null);
                  setSelectedOption('');
                }}
                className={`w-full text-left p-4 rounded-xl text-xs font-mono transition-all flex items-center justify-between border ${
                  activeLesson?.id === lesson.id
                    ? 'bg-brand-500/15 border-brand-500/50 text-white font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>{lesson.order}. {lesson.title}</span>
                </div>
                <span className="text-[10px] text-slate-400">{lesson.durationMinutes}m</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Lesson Content & Interactive Assessment */}
        <div className="lg:col-span-2 p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          {activeLesson ? (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-brand-400">Lesson {activeLesson.order}</span>
                <h3 className="text-2xl font-bold text-white mt-1">{activeLesson.title}</h3>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-mono font-bold text-slate-200">Lesson Notes</h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono whitespace-pre-wrap">
                  {activeLesson.content}
                </p>
              </div>

              {/* Interactive Assessment / Quiz Box */}
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-400" />
                  <span>Lesson Quiz Assessment</span>
                </h4>
                <p className="text-slate-300">
                  Question: What is the primary requirement for zero-trust workload identity?
                </p>

                <div className="space-y-2">
                  {[
                    { key: 'A', text: 'Mutual TLS verification using ephemeral SPIFFE certificates' },
                    { key: 'B', text: 'Static IP whitelist in firewall rules' },
                    { key: 'C', text: 'Unencrypted basic HTTP authentication' },
                  ].map((opt) => (
                    <label
                      key={opt.key}
                      onClick={() => setSelectedOption(opt.key)}
                      className={`block p-3 rounded-xl border cursor-pointer ${
                        selectedOption === opt.key
                          ? 'bg-brand-500/20 border-brand-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="text-brand-400 font-bold mr-2">{opt.key}.</span>
                      {opt.text}
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleQuizSubmit}
                    disabled={!selectedOption}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold disabled:opacity-50"
                  >
                    Submit Quiz & Save Progress
                  </button>

                  {quizScore !== null && (
                    <span className="text-emerald-400 font-bold">
                      Grade: {quizScore}% {quizScore === 100 ? '✅ Passed!' : '⚠️ Review Lesson'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Select a lesson to start studying.</p>
          )}
        </div>
      </div>
    </div>
  );
};
