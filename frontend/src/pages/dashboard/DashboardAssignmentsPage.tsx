import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, BookOpen, CheckCircle2, ClipboardCheck, Clock3, Send } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { fetchApi } from '../../lib/api';

interface Submission {
  id: string;
  content: string;
  submittedAt: string;
  grade: number | null;
  feedback: string | null;
  user?: { id: string; fullName: string; email: string };
}
interface Assignment {
  id: string;
  title: string;
  description: string;
  dueAt: string | null;
  course: { id: string; title: string; slug?: string };
  submissions: Submission[];
}
interface CourseChoice { id: string; title: string }
const input = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500';

export const DashboardAssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const instructor = ['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<CourseChoice[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadAssignments = useCallback(async () => {
    setError('');
    try {
      if (instructor) {
        const result = await fetchApi<{ assignments: Assignment[]; courses: CourseChoice[] }>('/courses/assignments/teaching');
        setAssignments(result.assignments || []);
        setCourses(result.courses || []);
        setCourseId((current) => current || result.courses?.[0]?.id || '');
      } else {
        const result = await fetchApi<{ assignments: Assignment[] }>('/courses/assignments/mine');
        setAssignments(result.assignments || []);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load assignments.');
    } finally {
      setLoading(false);
    }
  }, [instructor]);

  useEffect(() => { loadAssignments(); }, [loadAssignments]);

  const createAssignment = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true); setError(''); setNotice('');
    try {
      await fetchApi(`/courses/${courseId}/assignments`, { method: 'POST', body: JSON.stringify({ title, description, dueAt: dueAt || null }) });
      setTitle(''); setDescription(''); setDueAt(''); setNotice('Assignment created.');
      await loadAssignments();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to create assignment.'); }
    finally { setSaving(false); }
  };

  const submitWork = async (assignmentId: string) => {
    setSaving(true); setError(''); setNotice('');
    try {
      await fetchApi(`/courses/assignments/${assignmentId}/submission`, { method: 'POST', body: JSON.stringify({ content: drafts[assignmentId] || '' }) });
      setNotice('Your submission was saved.');
      await loadAssignments();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to submit assignment.'); }
    finally { setSaving(false); }
  };

  const gradeWork = async (assignmentId: string, submission: Submission) => {
    setSaving(true); setError(''); setNotice('');
    try {
      await fetchApi(`/courses/assignments/${assignmentId}/submissions/${submission.id}`, { method: 'PATCH', body: JSON.stringify({ grade: Number(grades[submission.id]), feedback: feedbackDrafts[submission.id] || '' }) });
      setNotice(`Updated grade for ${submission.user?.fullName || 'learner'}.`);
      await loadAssignments();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to grade submission.'); }
    finally { setSaving(false); }
  };

  const counts = assignments.reduce((result, assignment) => {
    const submission = assignment.submissions[0];
    if (instructor) result.submitted += assignment.submissions.length;
    else if (!submission) result.pending += 1;
    else if (submission.grade == null) result.submitted += 1;
    else result.graded += 1;
    return result;
  }, { pending: 0, submitted: 0, graded: 0 });
  const statusCards: { label: string; count: number; icon: LucideIcon }[] = [
    { label: 'Pending', count: counts.pending, icon: Clock3 },
    { label: 'Submitted', count: counts.submitted, icon: Send },
    { label: 'Graded', count: counts.graded, icon: CheckCircle2 },
  ];

  return <div className="w-full space-y-8">
    <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8">
      <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10"><ClipboardCheck className="h-6 w-6 text-blue-400" /></div><div><p className="text-sm font-semibold uppercase tracking-wider text-blue-400">Learning Workspace</p><h1 className="text-2xl font-bold text-white">{instructor ? 'Course Assignments' : 'My Assignments'}</h1></div></div>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">{instructor ? 'Create coursework for your courses and review learner submissions.' : 'Review due dates, submit coursework, and see grades and instructor feedback.'}</p>
    </section>

    {error && <Card><CardContent className="text-sm text-rose-300">{error}</CardContent></Card>}
    {notice && <Card><CardContent className="text-sm text-emerald-300">{notice}</CardContent></Card>}

    {!instructor && <section className="grid gap-4 sm:grid-cols-3">
      {statusCards.map(({ label, count, icon: Icon }) => <Card key={label}><CardContent className="flex items-center justify-between"><div><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold text-white">{count}</p></div><Icon className="h-5 w-5 text-blue-400" /></CardContent></Card>)}
    </section>}

    {instructor && <Card><CardContent><h2 className="mb-4 text-lg font-semibold text-white">Create an assignment</h2>{courses.length ? <form onSubmit={createAssignment} className="grid gap-4 md:grid-cols-2">
      <select className={input} value={courseId} onChange={(event) => setCourseId(event.target.value)} required>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select>
      <input className={input} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Assignment title" maxLength={200} required />
      <textarea className={`${input} md:col-span-2`} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Instructions and requirements" rows={4} maxLength={10000} required />
      <label className="text-sm text-slate-400">Due date <input className={`${input} mt-2`} type="datetime-local" value={dueAt} onChange={(event) => setDueAt(event.target.value)} /></label>
      <button disabled={saving || !courseId} className="self-end rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Create assignment'}</button>
    </form> : <p className="text-sm text-slate-400">No courses are assigned to your instructor account yet.</p>}</CardContent></Card>}

    {loading ? <p className="py-12 text-center text-sm text-slate-400">Loading assignments…</p> : assignments.length === 0 ? <Card><CardContent className="py-12 text-center"><BookOpen className="mx-auto h-9 w-9 text-slate-600" /><h2 className="mt-4 font-semibold text-white">No assignments yet</h2><p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">{instructor ? 'Create an assignment above and it will be available to learners enrolled in that course.' : 'Assignments for your enrolled courses will appear here when your instructors publish them.'}</p>{!instructor && <Link className="mt-5 inline-block text-sm font-semibold text-blue-400" to="/dashboard/courses">View my courses</Link>}</CardContent></Card> : <section className="space-y-4">{assignments.map((assignment) => {
      const submission = assignment.submissions[0];
      return <Card key={assignment.id}><CardContent className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-semibold text-white">{assignment.title}</h2><p className="mt-1 text-sm text-blue-300">{assignment.course.title}</p></div><div className="flex items-center gap-2 text-xs text-slate-400">{assignment.dueAt ? <><Clock3 className="h-4 w-4" />Due {new Date(assignment.dueAt).toLocaleString()}</> : 'No due date'}</div></div>
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{assignment.description}</p>
        {instructor ? assignment.submissions.length ? <div className="space-y-3 border-t border-slate-800 pt-4">{assignment.submissions.map((item) => <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"><p className="font-semibold text-white">{item.user?.fullName || 'Learner'} <span className="font-normal text-slate-500">· {new Date(item.submittedAt).toLocaleString()}</span></p><p className="my-3 whitespace-pre-wrap text-sm text-slate-300">{item.content}</p><div className="grid gap-3 md:grid-cols-[140px_1fr_auto]"><input className={input} type="number" min="0" max="100" placeholder="Grade / 100" value={grades[item.id] ?? (item.grade == null ? '' : String(item.grade))} onChange={(event) => setGrades((current) => ({ ...current, [item.id]: event.target.value }))} /><input className={input} placeholder="Feedback (optional)" value={feedbackDrafts[item.id] ?? item.feedback ?? ''} onChange={(event) => setFeedbackDrafts((current) => ({ ...current, [item.id]: event.target.value }))} /><button onClick={() => gradeWork(assignment.id, item)} disabled={saving} className="rounded-xl border border-blue-500/40 px-4 py-2 text-sm text-blue-300 disabled:opacity-50">Save grade</button></div></div>)}</div> : <p className="border-t border-slate-800 pt-4 text-sm text-slate-500">No learner submissions yet.</p> : <div className="space-y-3 border-t border-slate-800 pt-4">{submission && <div className="rounded-xl bg-slate-950/60 p-4"><p className="text-xs text-slate-400">Submitted {new Date(submission.submittedAt).toLocaleString()}</p><p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{submission.content}</p>{submission.grade != null && <p className="mt-3 font-semibold text-emerald-300">Grade: {submission.grade}/100</p>}{submission.feedback && <p className="mt-2 text-sm text-slate-400">Feedback: {submission.feedback}</p>}</div>}<textarea className={input} rows={4} maxLength={50000} placeholder={submission ? 'Update your submission' : 'Write your submission'} value={drafts[assignment.id] ?? submission?.content ?? ''} onChange={(event) => setDrafts((current) => ({ ...current, [assignment.id]: event.target.value }))} /><button onClick={() => submitWork(assignment.id)} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Send className="h-4 w-4" />{saving ? 'Saving…' : submission ? 'Update submission' : 'Submit assignment'}</button></div>}
      </CardContent></Card>;
    })}</section>}
    <div className="flex items-start gap-3 text-xs leading-5 text-slate-500"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><p>Submission updates replace your previous work until the due date. Grades and feedback are visible in this page.</p></div>
  </div>;
};
