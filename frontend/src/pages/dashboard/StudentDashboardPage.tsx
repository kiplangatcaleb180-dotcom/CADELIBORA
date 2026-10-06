import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Bell, BookOpen, CalendarClock, CheckCircle2, Clock3, GraduationCap, MessageSquare, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchApi } from '../../lib/api';

interface Submission { id: string; submittedAt: string; grade: number | null; feedback: string | null }
interface Assignment { id: string; title: string; dueAt: string | null; course: { title: string }; submissions: Submission[] }
interface Notification { id: string; title: string; message: string; createdAt: string; isRead: boolean }

const panel = 'rounded-2xl border border-slate-800 bg-slate-950/60 p-5';
const linkClass = 'mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-300 hover:text-blue-200';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(() => {
    fetchApi<{ assignments: Assignment[] }>('/courses/assignments/mine').then((r) => setAssignments(r.assignments || [])).catch(() => setAssignments([]));
    fetchApi<{ notifications: Notification[] }>('/notifications').then((r) => setNotifications((r.notifications || []).slice(0, 4))).catch(() => setNotifications([]));
  }, []);

  const enrollments = user?.enrollments || [];
  const courses = enrollments.map((e: any) => e.course).filter(Boolean);
  const progress = enrollments.length ? Math.round(enrollments.reduce((sum: number, e: any) => sum + Math.min(100, Math.max(0, Number(e.progress) || 0)), 0) / enrollments.length) : 0;
  const now = Date.now();
  const upcoming = assignments.filter((a) => a.dueAt && new Date(a.dueAt).getTime() >= now).sort((a, b) => new Date(a.dueAt!).getTime() - new Date(b.dueAt!).getTime());
  const pending = assignments.filter((a) => !a.submissions?.[0]);
  const graded = assignments.filter((a) => a.submissions?.[0]?.grade != null);
  const feedback = graded.filter((a) => a.submissions[0].feedback);
  const certificates = user?.certificates || [];
  const activity = assignments.flatMap((a) => (a.submissions || []).map((s) => ({ title: `Submitted ${a.title}`, date: s.submittedAt, course: a.course.title }))).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
  const nextCourse = useMemo(() => enrollments.find((e: any) => Number(e.progress) < 100)?.course || courses[0], [enrollments]);

  return <div className="w-full space-y-6">
    <header className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/70 to-slate-950 p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">Student Learning Dashboard</p>
      <h1 className="mt-2 text-3xl font-black text-white">Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}</h1>
      <p className="mt-2 text-slate-400">Pick up where you left off and keep your learning moving.</p>
      {nextCourse?.slug && <Link className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-500" to={`/academy/courses/${nextCourse.slug}/learn`}>Continue Learning <ArrowRight className="h-4 w-4" /></Link>}
    </header>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article className={panel}><BookOpen className="h-5 w-5 text-blue-300"/><p className="mt-3 text-sm text-slate-400">My Courses</p><strong className="text-3xl text-white">{enrollments.length}</strong><Link className={linkClass} to="/dashboard/courses">View courses <ArrowRight size={15}/></Link></article>
      <article className={panel}><CheckCircle2 className="h-5 w-5 text-emerald-300"/><p className="mt-3 text-sm text-slate-400">Overall Learning Progress</p><strong className="text-3xl text-white">{progress}%</strong><div className="mt-3 h-2 rounded bg-slate-800"><div className="h-2 rounded bg-emerald-500" style={{ width: `${progress}%` }}/></div><Link className={linkClass} to="/dashboard/progress">Track progress <ArrowRight size={15}/></Link></article>
      <article className={panel}><CalendarClock className="h-5 w-5 text-amber-300"/><p className="mt-3 text-sm text-slate-400">Upcoming Assessments</p><strong className="text-3xl text-white">{upcoming.length}</strong><Link className={linkClass} to="/dashboard/assessments">View and submit work <ArrowRight size={15}/></Link></article>
      <article className={panel}><Clock3 className="h-5 w-5 text-violet-300"/><p className="mt-3 text-sm text-slate-400">Pending Assignments</p><strong className="text-3xl text-white">{pending.length}</strong><Link className={linkClass} to="/dashboard/assignments">Open assignments <ArrowRight size={15}/></Link></article>
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <div className={panel}><div className="flex items-center justify-between"><h2 className="font-bold text-white">Upcoming Assessments</h2><Link className="text-sm text-blue-300" to="/dashboard/assessments">All assessments</Link></div>{upcoming.length ? <ul className="mt-4 divide-y divide-slate-800">{upcoming.slice(0, 4).map((a) => <li key={a.id} className="flex justify-between gap-3 py-3"><div><p className="font-medium text-slate-200">{a.title}</p><p className="text-xs text-slate-500">{a.course.title}</p></div><time className="shrink-0 text-xs text-amber-200">{new Date(a.dueAt!).toLocaleDateString()}</time></li>)}</ul> : <p className="mt-4 text-sm text-slate-500">No upcoming assessments are scheduled.</p>}</div>
      <div className={panel}><div className="flex items-center justify-between"><h2 className="font-bold text-white">My Courses</h2><Link className="text-sm text-blue-300" to="/dashboard/courses">All courses</Link></div>{enrollments.length ? <ul className="mt-4 divide-y divide-slate-800">{enrollments.slice(0, 4).map((e: any) => <li key={e.id} className="flex items-center justify-between gap-3 py-3"><div><p className="font-medium text-slate-200">{e.course?.title || 'Course'}</p><p className="text-xs text-slate-500">{Math.min(100, Number(e.progress) || 0)}% complete</p></div>{e.course?.slug && <Link aria-label={`Open ${e.course.title}`} to={`/academy/courses/${e.course.slug}/learn`} className="text-blue-300"><ArrowRight size={18}/></Link>}</li>)}</ul> : <p className="mt-4 text-sm text-slate-500">Browse the academy to find your first course.</p>}<Link className={linkClass} to="/academy">Recommended Courses <Sparkles size={15}/></Link></div>
      <div className={panel}><h2 className="font-bold text-white">Upcoming Live Classes</h2><p className="mt-4 text-sm text-slate-500">There are no live class sessions scheduled yet.</p><Link className={linkClass} to="/dashboard/notifications">Check notifications <Bell size={15}/></Link></div>
      <div className={panel}><div className="flex items-center justify-between"><h2 className="font-bold text-white">Recent Activity</h2><Link className="text-sm text-blue-300" to="/dashboard/assignments">Assignments</Link></div>{activity.length ? <ul className="mt-3 space-y-3">{activity.map((a, i) => <li key={`${a.title}-${i}`} className="text-sm"><p className="text-slate-200">{a.title}</p><p className="text-xs text-slate-500">{a.course} · {new Date(a.date).toLocaleDateString()}</p></li>)}</ul> : <p className="mt-4 text-sm text-slate-500">Your course and assignment activity will appear here.</p>}</div>
      <div className={panel}><div className="flex items-center justify-between"><h2 className="font-bold text-white">Recent Grades & Instructor Feedback</h2><Link className="text-sm text-blue-300" to="/dashboard/assignments">View work</Link></div>{graded.length ? <ul className="mt-3 space-y-3">{graded.slice(0, 3).map((a) => <li key={a.id} className="text-sm"><p className="text-slate-200">{a.title} · {a.submissions[0].grade}/100</p><p className="text-xs text-slate-400">{feedback.find((f) => f.id === a.id)?.submissions[0].feedback || 'No written feedback yet'}</p></li>)}</ul> : <p className="mt-4 text-sm text-slate-500">Grades and instructor feedback will appear here.</p>}</div>
      <div className={panel}><div className="flex items-center justify-between"><h2 className="font-bold text-white">Certificates</h2><GraduationCap className="h-5 w-5 text-emerald-300"/></div><p className="mt-3 text-2xl font-bold text-white">{certificates.length}</p><Link className={linkClass} to="/dashboard/certificates">View certificates <ArrowRight size={15}/></Link></div>
      <div className={panel}><div className="flex items-center justify-between"><h2 className="font-bold text-white">Notifications</h2><Bell className="h-5 w-5 text-blue-300"/></div>{notifications.length ? <ul className="mt-3 space-y-2">{notifications.slice(0, 3).map((n) => <li key={n.id}><p className="text-sm text-slate-200">{n.title}</p><p className="line-clamp-1 text-xs text-slate-500">{n.message}</p></li>)}</ul> : <p className="mt-3 text-sm text-slate-500">You’re all caught up.</p>}<Link className={linkClass} to="/dashboard/notifications">All notifications <ArrowRight size={15}/></Link></div>
    </section>
    <footer className="flex flex-wrap gap-3 text-sm"><Link className="inline-flex items-center gap-2 text-slate-400 hover:text-white" to="/community"><MessageSquare size={16}/>Community</Link><Link className="inline-flex items-center gap-2 text-slate-400 hover:text-white" to="/dashboard/messages"><MessageSquare size={16}/>Authorized messages</Link><Link className="inline-flex items-center gap-2 text-slate-400 hover:text-white" to="/dashboard/certificates"><Award size={16}/>Certificates</Link></footer>
  </div>;
};
