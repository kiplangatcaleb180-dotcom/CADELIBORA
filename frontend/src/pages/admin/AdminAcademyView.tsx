import React, { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api';
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  BarChart3,
  Layers,
  X,
} from 'lucide-react';

type Tab =
  | 'overview'
  | 'courses'
  | 'lessons'
  | 'enrollments'
  | 'certificates';

interface AcademyStats {
  totalCourses: number;
  publishedCourses: number;
  totalLessons: number;
  totalEnrollments: number;
  completedEnrollments: number;
  totalCertificates: number;
}

interface Enrollment {
  id: string;
  progress: number;
  completed: boolean;
  enrolledAt: string;
  lastAccessedAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  course?: {
    id: string;
    title: string;
    slug: string;
  };
}

interface Certificate {
  id: string;
  certificateNumber: string;
  issuedAt: string;
  pdfUrl?: string | null;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  course?: {
    id: string;
    title: string;
    slug: string;
  };
}

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  order: number;
  content: string;
  videoUrl?: string | null;
  durationMinutes: number;
  isFree: boolean;
  course?: {
    id: string;
    title: string;
    slug: string;
  };
}

interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  coverImage: string;
  level: string;
  duration: string;
  isPublished: boolean;
  instructor?: {
    id: string;
    fullName: string;
    email: string;
  };
  _count?: {
    lessons: number;
    enrollments: number;
    certificates: number;
  };
}

const emptyLesson = {
  courseId: '',
  title: '',
  order: 1,
  content: '',
  videoUrl: '',
  durationMinutes: 15,
  isFree: false,
};

const emptyCourse = {
  title: '',
  slug: '',
  category: '',
  description: '',
  coverImage: '',
  level: 'Beginner',
  duration: '10 hours',
  instructorId: '',
  isPublished: true,
};

export const AdminAcademyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const [stats, setStats] = useState<AcademyStats>({
    totalCourses: 0,
    publishedCourses: 0,
    totalLessons: 0,
    totalEnrollments: 0,
    completedEnrollments: 0,
    totalCertificates: 0,
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingEnrollment, setEditingEnrollment] =
    useState<Enrollment | null>(null);
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [enrollmentCompleted, setEnrollmentCompleted] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState(emptyCourse);

  const [editingCertificate, setEditingCertificate] =
    useState<Certificate | null>(null);
  const [certificateNumber, setCertificateNumber] = useState('');
  const [certificatePdfUrl, setCertificatePdfUrl] = useState('');

  const loadStats = async () => {
    try {
      const res = await fetchApi<{ stats: AcademyStats }>(
        '/admin/academy/stats'
      );

      setStats(
        res.stats || {
          totalCourses: 0,
          publishedCourses: 0,
          totalLessons: 0,
          totalEnrollments: 0,
          completedEnrollments: 0,
          totalCertificates: 0,
        }
      );
    } catch (error) {
      console.error('Failed to load Academy stats:', error);
    }
  };

  const loadCourses = async () => {
    try {
      const res = await fetchApi<{ courses: Course[] }>(
        '/admin/academy/courses'
      );

      setCourses(res.courses || []);
    } catch (error) {
      console.error('Failed to load Academy courses:', error);
    }
  };

  const loadLessons = async () => {
    try {
      setLessonsLoading(true);

      const res = await fetchApi<{ lessons: Lesson[] }>(
        '/admin/academy/lessons'
      );

      setLessons(res.lessons || []);
    } catch (error) {
      console.error('Failed to load Academy lessons:', error);
    } finally {
      setLessonsLoading(false);
    }
  };

  const loadEnrollments = async () => {
    try {
      setEnrollmentsLoading(true);

      const res = await fetchApi<{ enrollments: Enrollment[] }>(
        '/admin/academy/enrollments'
      );

      setEnrollments(res.enrollments || []);
    } catch (error) {
      console.error('Failed to load Academy enrollments:', error);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  const loadCertificates = async () => {
    try {
      setCertificatesLoading(true);

      const res = await fetchApi<{ certificates: Certificate[] }>(
        '/admin/academy/certificates'
      );

      setCertificates(res.certificates || []);
    } catch (error) {
      console.error('Failed to load Academy certificates:', error);
    } finally {
      setCertificatesLoading(false);
    }
  };

  const openEditCertificate = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setCertificateNumber(certificate.certificateNumber);
    setCertificatePdfUrl(certificate.pdfUrl || '');
  };

  const closeCertificateEditor = () => {
    if (saving) return;

    setEditingCertificate(null);
    setCertificateNumber('');
    setCertificatePdfUrl('');
  };

  const saveCertificate = async () => {
    if (!editingCertificate) return;

    try {
      setSaving(true);

      await fetchApi(
        `/admin/academy/certificates/${editingCertificate.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            certificateNumber: certificateNumber.trim(),
            pdfUrl: certificatePdfUrl.trim() || null,
          }),
        }
      );

      await Promise.all([loadCertificates(), loadStats()]);
      closeCertificateEditor();
    } catch (error) {
      console.error('Failed to update certificate:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to update certificate.'
      );
    } finally {
      setSaving(false);
    }
  };

  const openEditEnrollment = (enrollment: Enrollment) => {
    setEditingEnrollment(enrollment);
    setEnrollmentProgress(enrollment.progress);
    setEnrollmentCompleted(enrollment.completed);
  };

  const closeEnrollmentEditor = () => {
    if (saving) return;

    setEditingEnrollment(null);
    setEnrollmentProgress(0);
    setEnrollmentCompleted(false);
  };

  const saveEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEnrollment) return;

    const progress = Number(enrollmentProgress);

    if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
      alert('Progress must be between 0 and 100.');
      return;
    }

    try {
      setSaving(true);

      await fetchApi(
        `/admin/academy/enrollments/${editingEnrollment.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            progress: Math.round(progress),
            completed: enrollmentCompleted,
          }),
        }
      );

      closeEnrollmentEditor();
      await loadEnrollments();
      await loadStats();
    } catch (error: any) {
      alert(error.message || 'Failed to update enrollment.');
    } finally {
      setSaving(false);
    }
  };

  const openCreateLesson = () => {
    setEditingLesson(null);

    setLessonForm({
      ...emptyLesson,
      courseId: courses[0]?.id || '',
    });

    setShowLessonModal(true);
  };

  const openEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);

    setLessonForm({
      courseId: lesson.courseId || '',
      title: lesson.title || '',
      order: lesson.order || 1,
      content: lesson.content || '',
      videoUrl: lesson.videoUrl || '',
      durationMinutes: lesson.durationMinutes || 15,
      isFree: lesson.isFree || false,
    });

    setShowLessonModal(true);
  };

  const closeLessonModal = () => {
    if (saving) return;

    setShowLessonModal(false);
    setEditingLesson(null);
    setLessonForm(emptyLesson);
  };

  const saveLesson = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lessonForm.courseId) {
      alert('Please select a course.');
      return;
    }

    if (!lessonForm.title.trim()) {
      alert('Lesson title is required.');
      return;
    }

    if (!lessonForm.content.trim()) {
      alert('Lesson content is required.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...lessonForm,
        title: lessonForm.title.trim(),
        content: lessonForm.content.trim(),
        videoUrl: lessonForm.videoUrl.trim(),
        order: Number(lessonForm.order),
        durationMinutes: Number(lessonForm.durationMinutes),
      };

      if (editingLesson) {
        await fetchApi(
          `/admin/academy/lessons/${editingLesson.id}`,
          {
            method: 'PUT',
            body: JSON.stringify(payload),
          }
        );
      } else {
        await fetchApi('/admin/academy/lessons', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      closeLessonModal();
      await loadLessons();
      await loadStats();
    } catch (error: any) {
      alert(error.message || 'Failed to save lesson.');
    } finally {
      setSaving(false);
    }
  };

  const deleteLesson = async (lesson: Lesson) => {
    if (!confirm(`Delete lesson "${lesson.title}"?`)) return;

    try {
      await fetchApi(`/admin/academy/lessons/${lesson.id}`, {
        method: 'DELETE',
      });

      await loadLessons();
      await loadStats();
    } catch (error: any) {
      alert(error.message || 'Failed to delete lesson.');
    }
  };

  const loadData = async () => {
    setLoading(true);

    try {
      await Promise.all([
        loadStats(),
        loadCourses(),
        loadLessons(),
        loadEnrollments(),
        loadCertificates(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateCourse = () => {
    setEditingCourse(null);
    setCourseForm(emptyCourse);
    setShowCourseModal(true);
  };

  const openEditCourse = (course: Course) => {
    setEditingCourse(course);

    setCourseForm({
      title: course.title || '',
      slug: course.slug || '',
      category: course.category || '',
      description: course.description || '',
      coverImage: course.coverImage || '',
      level: course.level || 'Beginner',
      duration: course.duration || '10 hours',
      instructorId: course.instructor?.id || '',
      isPublished: course.isPublished,
    });

    setShowCourseModal(true);
  };

  const closeCourseModal = () => {
    if (saving) return;

    setShowCourseModal(false);
    setEditingCourse(null);
    setCourseForm(emptyCourse);
  };

  const saveCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseForm.title.trim()) {
      alert('Course title is required.');
      return;
    }

    if (!courseForm.category.trim()) {
      alert('Course category is required.');
      return;
    }

    if (!courseForm.description.trim()) {
      alert('Course description is required.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...courseForm,
        title: courseForm.title.trim(),
        slug: courseForm.slug.trim(),
        category: courseForm.category.trim(),
        description: courseForm.description.trim(),
        coverImage: courseForm.coverImage.trim(),
        level: courseForm.level.trim(),
        duration: courseForm.duration.trim(),
        instructorId: courseForm.instructorId || undefined,
      };

      if (editingCourse) {
        await fetchApi(`/admin/academy/courses/${editingCourse.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/admin/academy/courses', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      closeCourseModal();
      await loadData();
    } catch (error: any) {
      alert(error.message || 'Failed to save course.');
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (course: Course) => {
    const confirmed = confirm(
      `Delete "${course.title}"?\n\nThis will also remove its lessons, enrollments and certificates.`
    );

    if (!confirmed) return;

    try {
      await fetchApi(`/admin/academy/courses/${course.id}`, {
        method: 'DELETE',
      });

      await loadData();
    } catch (error: any) {
      alert(error.message || 'Failed to delete course.');
    }
  };

  const toggleCoursePublished = async (course: Course) => {
    try {
      await fetchApi(`/admin/academy/courses/${course.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          isPublished: !course.isPublished,
        }),
      });

      await loadData();
    } catch (error: any) {
      alert(error.message || 'Failed to update publication status.');
    }
  };

  const tabs: {
    id: Tab;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'courses', label: 'Courses', icon: GraduationCap },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'enrollments', label: 'Enrollments', icon: Users },
    { id: 'certificates', label: 'Certificates', icon: Award },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center font-mono">
          <GraduationCap className="w-10 h-10 mx-auto mb-4 text-brand-400 animate-pulse" />
          <p className="text-brand-400 animate-pulse">
            Loading Academy Management Center...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-500/10 border border-brand-500/20">
              <GraduationCap className="w-6 h-6 text-brand-400" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Academy Management Center
              </h1>

              <p className="text-xs text-slate-500 mt-1">
                Manage courses, lessons, learners and certificates.
              </p>
            </div>
          </div>
        </div>

        {activeTab === 'lessons' && (
          <button
            onClick={openCreateLesson}
            disabled={courses.length === 0}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Lesson
          </button>
        )}

        {activeTab === 'courses' && (
          <button
            onClick={openCreateCourse}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Course
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2 p-1.5 bg-slate-900/70 border border-slate-800 rounded-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  active
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <StatCard
              label="Total Courses"
              value={stats.totalCourses}
              icon={GraduationCap}
              detail={`${stats.publishedCourses} published`}
            />

            <StatCard
              label="Total Lessons"
              value={stats.totalLessons}
              icon={BookOpen}
              detail="Learning content"
            />

            <StatCard
              label="Enrollments"
              value={stats.totalEnrollments}
              icon={Users}
              detail={`${stats.completedEnrollments} completed`}
            />

            <StatCard
              label="Certificates"
              value={stats.totalCertificates}
              icon={Award}
              detail="Issued certificates"
            />

            <StatCard
              label="Published Courses"
              value={stats.publishedCourses}
              icon={Eye}
              detail="Visible in Academy"
            />

            <StatCard
              label="Completion Rate"
              value={
                stats.totalEnrollments
                  ? `${Math.round(
                      (stats.completedEnrollments /
                        stats.totalEnrollments) *
                        100
                    )}%`
                  : '0%'
              }
              icon={BarChart3}
              detail="Based on enrollments"
            />
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <Layers className="w-5 h-5 text-brand-400" />
              <div>
                <h2 className="text-sm font-bold text-white">
                  Academy Overview
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  The Academy management center is connected to the live
                  backend.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <InfoBox
                title="Course Management"
                text="Create, edit, publish and remove Academy courses."
              />

              <InfoBox
                title="Learning Content"
                text="Organize lessons, videos, notes and free previews."
              />

              <InfoBox
                title="Learner Records"
                text="Monitor enrollments, progress and issued certificates."
              />
            </div>
          </div>
        </div>
      )}

      {/* Courses */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          {courses.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center">
              <GraduationCap className="w-10 h-10 mx-auto mb-4 text-slate-600" />
              <h3 className="text-sm font-bold text-white">
                No Academy courses yet
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                Create the first course to start building the Academy.
              </p>

              <button
                onClick={openCreateCourse}
                className="mt-5 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold"
              >
                Create First Course
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    Academy Courses
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {courses.length} course{courses.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-left text-slate-500">
                      <th className="px-5 py-3">Course</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Level</th>
                      <th className="px-5 py-3">Content</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {courses.map((course) => (
                      <tr
                        key={course.id}
                        className="border-b border-slate-800/70 hover:bg-slate-800/30"
                      >
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-bold text-white">
                              {course.title}
                            </p>

                            <p className="text-[10px] text-slate-500 mt-1">
                              /{course.slug}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-brand-400 font-bold">
                          {course.category}
                        </td>

                        <td className="px-5 py-4 text-emerald-400">
                          {course.level}
                        </td>

                        <td className="px-5 py-4 text-slate-400">
                          <div className="space-y-1">
                            <p>
                              {course._count?.lessons || 0} lessons
                            </p>
                            <p>
                              {course._count?.enrollments || 0} learners
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => toggleCoursePublished(course)}
                            className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${
                              course.isPublished
                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {course.isPublished ? 'Published' : 'Draft'}
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => toggleCoursePublished(course)}
                              title={
                                course.isPublished
                                  ? 'Unpublish'
                                  : 'Publish'
                              }
                              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                            >
                              {course.isPublished ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              onClick={() => openEditCourse(course)}
                              title="Edit"
                              className="p-2 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => deleteCourse(course)}
                              title="Delete"
                              className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lessons and enrollment management */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          {courses.length === 0 ? (
            <ManagementPlaceholder
              icon={BookOpen}
              title="Create a course first"
              text="Lessons must belong to an Academy course. Create a course before adding lessons."
            />
          ) : lessonsLoading ? (
            <div className="p-12 text-center text-brand-400 animate-pulse">
              Loading lessons...
            </div>
          ) : lessons.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center">
              <BookOpen className="w-10 h-10 mx-auto mb-4 text-slate-600" />
              <h3 className="text-sm font-bold text-white">
                No lessons yet
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                Add lessons to start building your course curriculum.
              </p>

              <button
                onClick={openCreateLesson}
                className="mt-5 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold"
              >
                Create First Lesson
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800">
                <h2 className="text-sm font-bold text-white">
                  Academy Lessons
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage curriculum content across all courses.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-left text-slate-500">
                      <th className="px-5 py-3">#</th>
                      <th className="px-5 py-3">Lesson</th>
                      <th className="px-5 py-3">Course</th>
                      <th className="px-5 py-3">Duration</th>
                      <th className="px-5 py-3">Access</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lessons.map((lesson) => (
                      <tr
                        key={lesson.id}
                        className="border-b border-slate-800/70 hover:bg-slate-800/30"
                      >
                        <td className="px-5 py-4 text-slate-500 font-bold">
                          {lesson.order}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-bold text-white">
                            {lesson.title}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {lesson.content.length} characters
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-brand-400 font-bold">
                            {lesson.course?.title || 'Unknown course'}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-400">
                          {lesson.durationMinutes} min
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                              lesson.isFree
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {lesson.isFree ? 'Free Preview' : 'Enrolled'}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditLesson(lesson)}
                              className="p-2 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20"
                              title="Edit lesson"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => deleteLesson(lesson)}
                              className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                              title="Delete lesson"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'enrollments' && (
        <div className="space-y-4">
          {enrollmentsLoading ? (
            <div className="p-12 text-center text-brand-400 animate-pulse">
              Loading enrollments...
            </div>
          ) : enrollments.length === 0 ? (
            <ManagementPlaceholder
              icon={Users}
              title="No enrollments yet"
              text="Student enrollments will appear here once learners join Academy courses."
            />
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800">
                <h2 className="text-sm font-bold text-white">
                  Learner Enrollments
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Monitor learner progress and completion.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-left text-slate-500">
                      <th className="px-5 py-3">Student</th>
                      <th className="px-5 py-3">Course</th>
                      <th className="px-5 py-3">Progress</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Enrolled</th>
                      <th className="px-5 py-3">Last Access</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {enrollments.map((enrollment) => (
                      <tr
                        key={enrollment.id}
                        className="border-b border-slate-800/70 hover:bg-slate-800/30"
                      >
                        <td className="px-5 py-4">
                          <p className="font-bold text-white">
                            {enrollment.user?.fullName || 'Unknown student'}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {enrollment.user?.email || 'No email'}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-brand-400 font-bold">
                          {enrollment.course?.title || 'Unknown course'}
                        </td>

                        <td className="px-5 py-4 min-w-[160px]">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-500 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(0, enrollment.progress)
                                  )}%`,
                                }}
                              />
                            </div>

                            <span className="text-white font-bold">
                              {enrollment.progress}%
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                              enrollment.completed
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {enrollment.completed
                              ? 'Completed'
                              : 'In Progress'}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-slate-400">
                          {formatDate(enrollment.enrolledAt)}
                        </td>

                        <td className="px-5 py-4 text-slate-400">
                          {formatDate(enrollment.lastAccessedAt)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            <button
                              onClick={() =>
                                openEditEnrollment(enrollment)
                              }
                              className="p-2 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20"
                              title="Edit enrollment"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Certificate Management
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Review issued certificates and manage certificate records.
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              {certificates.length} certificate
              {certificates.length === 1 ? '' : 's'}
            </div>
          </div>

          {certificatesLoading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-sm text-slate-500">
              Loading certificates...
            </div>
          ) : certificates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/60 p-12 text-center">
              <Award className="w-10 h-10 mx-auto text-slate-700 mb-4" />
              <h3 className="text-sm font-semibold text-white">
                No certificates issued yet
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                Certificates will appear here when students complete courses.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead className="border-b border-slate-800 bg-slate-950/60">
                    <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-4">Certificate</th>
                      <th className="px-5 py-4">Student</th>
                      <th className="px-5 py-4">Course</th>
                      <th className="px-5 py-4">Issued</th>
                      <th className="px-5 py-4">PDF</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {certificates.map((certificate) => (
                      <tr
                        key={certificate.id}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-white">
                            {certificate.certificateNumber}
                          </div>
                          <div className="text-[10px] text-slate-600 mt-1">
                            ID: {certificate.id}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-slate-200">
                            {certificate.user?.fullName || 'Unknown student'}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {certificate.user?.email || 'No email'}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {certificate.course?.title || 'Unknown course'}
                        </td>

                        <td className="px-5 py-4 text-slate-400">
                          {formatDate(certificate.issuedAt)}
                        </td>

                        <td className="px-5 py-4">
                          {certificate.pdfUrl ? (
                            <a
                              href={certificate.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-xs text-brand-400 hover:text-brand-300"
                            >
                              <Eye className="w-4 h-4" />
                              View PDF
                            </a>
                          ) : (
                            <span className="text-xs text-slate-600">
                              Not uploaded
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            <button
                              onClick={() =>
                                openEditCertificate(certificate)
                              }
                              className="p-2 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20"
                              title="Edit certificate"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enrollment Editor */}
      {editingEnrollment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center py-8">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    Update Enrollment
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {editingEnrollment.user?.fullName || 'Student'} ·{' '}
                    {editingEnrollment.course?.title || 'Course'}
                  </p>
                </div>

                <button
                  onClick={closeEnrollmentEditor}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={saveEnrollment} className="p-6 space-y-5">
                <NumberField
                  label="Progress (%)"
                  value={enrollmentProgress}
                  onChange={(value) => setEnrollmentProgress(value)}
                />

                <label className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enrollmentCompleted}
                    onChange={(e) =>
                      setEnrollmentCompleted(e.target.checked)
                    }
                    className="accent-brand-500"
                  />

                  <span className="text-xs text-slate-300">
                    Mark enrollment as completed
                  </span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold"
                  >
                    {saving ? 'Saving...' : 'Save Enrollment'}
                  </button>

                  <button
                    type="button"
                    onClick={closeEnrollmentEditor}
                    disabled={saving}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Editor */}
      {editingCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center py-8">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    Edit Certificate
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Update certificate record details.
                  </p>
                </div>

                <button
                  onClick={closeCertificateEditor}
                  disabled={saving}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={saveCertificate} className="p-6 space-y-5">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] uppercase tracking-wider text-slate-600">
                    Student
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">
                    {editingCertificate.user?.fullName || 'Unknown student'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {editingCertificate.user?.email || 'No email'}
                  </div>

                  <div className="text-[10px] uppercase tracking-wider text-slate-600 mt-4">
                    Course
                  </div>
                  <div className="text-sm text-slate-300 mt-1">
                    {editingCertificate.course?.title || 'Unknown course'}
                  </div>
                </div>

                <Field
                  label="Certificate Number"
                  value={certificateNumber}
                  required
                  onChange={setCertificateNumber}
                  placeholder="CAD-2026-CERT-1234"
                />

                <Field
                  label="PDF URL"
                  value={certificatePdfUrl}
                  onChange={setCertificatePdfUrl}
                  placeholder="https://example.com/certificate.pdf"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold"
                  >
                    {saving ? 'Saving...' : 'Save Certificate'}
                  </button>

                  <button
                    type="button"
                    onClick={closeCertificateEditor}
                    disabled={saving}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center py-8">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {editingLesson ? 'Edit Academy Lesson' : 'Create Academy Lesson'}
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Add curriculum content to an Academy course.
                  </p>
                </div>

                <button
                  onClick={closeLessonModal}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={saveLesson} className="p-6 space-y-4">
                <SelectField
                  label="Course"
                  value={lessonForm.courseId}
                  onChange={(value) =>
                    setLessonForm({ ...lessonForm, courseId: value })
                  }
                  options={courses.map((course) => course.id)}
                />

                <div className="text-[10px] text-slate-500 -mt-2">
                  {courses.find((course) => course.id === lessonForm.courseId)?.title ||
                    'Select a course'}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Lesson Title"
                    value={lessonForm.title}
                    required
                    onChange={(value) =>
                      setLessonForm({ ...lessonForm, title: value })
                    }
                    placeholder="Introduction to Neural Networks"
                  />

                  <Field
                    label="Video URL"
                    value={lessonForm.videoUrl}
                    onChange={(value) =>
                      setLessonForm({ ...lessonForm, videoUrl: value })
                    }
                    placeholder="https://..."
                  />

                  <NumberField
                    label="Lesson Order"
                    value={lessonForm.order}
                    onChange={(value) =>
                      setLessonForm({ ...lessonForm, order: value })
                    }
                  />

                  <NumberField
                    label="Duration (minutes)"
                    value={lessonForm.durationMinutes}
                    onChange={(value) =>
                      setLessonForm({
                        ...lessonForm,
                        durationMinutes: value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Lesson Content <span className="text-rose-400">*</span>
                  </label>

                  <textarea
                    required
                    value={lessonForm.content}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        content: e.target.value,
                      })
                    }
                    placeholder="Write the lesson content, notes or learning material..."
                    className="w-full min-h-40 px-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-brand-500 resize-y"
                  />
                </div>

                <label className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lessonForm.isFree}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        isFree: e.target.checked,
                      })
                    }
                    className="accent-brand-500"
                  />

                  <span className="text-xs text-slate-300">
                    Make this lesson available as a free preview
                  </span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold"
                  >
                    {saving
                      ? 'Saving...'
                      : editingLesson
                        ? 'Save Changes'
                        : 'Create Lesson'}
                  </button>

                  <button
                    type="button"
                    onClick={closeLessonModal}
                    disabled={saving}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center py-8">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {editingCourse ? 'Edit Academy Course' : 'Create Academy Course'}
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Configure the course information and publication status.
                  </p>
                </div>

                <button
                  onClick={closeCourseModal}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={saveCourse} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Course Title"
                    value={courseForm.title}
                    required
                    onChange={(value) =>
                      setCourseForm({ ...courseForm, title: value })
                    }
                    placeholder="Introduction to Artificial Intelligence"
                  />

                  <Field
                    label="Slug"
                    value={courseForm.slug}
                    onChange={(value) =>
                      setCourseForm({ ...courseForm, slug: value })
                    }
                    placeholder="introduction-to-artificial-intelligence"
                  />

                  <Field
                    label="Category"
                    value={courseForm.category}
                    required
                    onChange={(value) =>
                      setCourseForm({ ...courseForm, category: value })
                    }
                    placeholder="Artificial Intelligence"
                  />

                  <SelectField
                    label="Level"
                    value={courseForm.level}
                    onChange={(value) =>
                      setCourseForm({ ...courseForm, level: value })
                    }
                    options={['Beginner', 'Intermediate', 'Advanced']}
                  />

                  <Field
                    label="Duration"
                    value={courseForm.duration}
                    onChange={(value) =>
                      setCourseForm({ ...courseForm, duration: value })
                    }
                    placeholder="10 hours"
                  />

                  <Field
                    label="Instructor ID"
                    value={courseForm.instructorId}
                    onChange={(value) =>
                      setCourseForm({ ...courseForm, instructorId: value })
                    }
                    placeholder="User ID (optional)"
                  />
                </div>

                <Field
                  label="Cover Image URL"
                  value={courseForm.coverImage}
                  onChange={(value) =>
                    setCourseForm({ ...courseForm, coverImage: value })
                  }
                  placeholder="https://..."
                />

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Description
                  </label>

                  <textarea
                    value={courseForm.description}
                    required
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe what learners will gain from this course..."
                    className="w-full min-h-32 px-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-brand-500 resize-y"
                  />
                </div>

                <label className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseForm.isPublished}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        isPublished: e.target.checked,
                      })
                    }
                    className="accent-brand-500"
                  />

                  <span className="text-xs text-slate-300">
                    Publish this course immediately
                  </span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold"
                  >
                    {saving
                      ? 'Saving...'
                      : editingCourse
                        ? 'Save Changes'
                        : 'Create Course'}
                  </button>

                  <button
                    type="button"
                    onClick={closeCourseModal}
                    disabled={saving}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const formatDate = (value?: string) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const StatCard: React.FC<{
  label: string;
  value: string | number;
  detail: string;
  icon: React.ElementType;
}> = ({ label, value, detail, icon: Icon }) => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500">
          {label}
        </p>

        <p className="text-2xl font-bold text-white mt-2">{value}</p>

        <p className="text-[10px] text-slate-500 mt-1">{detail}</p>
      </div>

      <div className="p-2.5 rounded-xl bg-brand-500/10">
        <Icon className="w-5 h-5 text-brand-400" />
      </div>
    </div>
  </div>
);

const InfoBox: React.FC<{
  title: string;
  text: string;
}> = ({ title, text }) => (
  <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
    <p className="font-bold text-white">{title}</p>
    <p className="text-slate-500 mt-2 leading-relaxed">{text}</p>
  </div>
);

const ManagementPlaceholder: React.FC<{
  icon: React.ElementType;
  title: string;
  text: string;
}> = ({ icon: Icon, title, text }) => (
  <div className="min-h-[360px] flex items-center justify-center bg-slate-900/60 border border-slate-800 rounded-3xl">
    <div className="text-center max-w-md px-6">
      <div className="inline-flex p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20">
        <Icon className="w-8 h-8 text-brand-400" />
      </div>

      <h2 className="text-lg font-bold text-white mt-5">{title}</h2>

      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
        {text}
      </p>
    </div>
  </div>
);

const Field: React.FC<{
  label: string;
  value: string;
  required?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
}> = ({ label, value, required, placeholder, onChange }) => (
  <div>
    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
      {label}
      {required && <span className="text-rose-400 ml-1">*</span>}
    </label>

    <input
      type="text"
      required={required}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-brand-500"
    />
  </div>
);

const NumberField: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
}> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
      {label}
    </label>

    <input
      type="number"
      min="1"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-brand-500"
    />
  </div>
);

const SelectField: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
      {label}
    </label>

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-brand-500"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);
