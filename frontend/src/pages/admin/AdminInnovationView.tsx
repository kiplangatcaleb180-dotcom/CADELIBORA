import React, { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Zap,
  ThumbsUp,
  User,
} from 'lucide-react';
import { fetchApi } from '../../lib/api';

interface InnovationConcept {
  id: string;
  title: string;
  category: string;
  conceptStage: string;
  summary: string;
  fullDetails: string;
  votesCount: number;
  authorId: string;
  createdAt: string;
  author?: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
    role?: string;
  };
}

interface InnovationForm {
  title: string;
  category: string;
  conceptStage: string;
  summary: string;
  fullDetails: string;
  authorId: string;
}

const emptyForm: InnovationForm = {
  title: '',
  category: 'AI Agent',
  conceptStage: 'Idea',
  summary: '',
  fullDetails: '',
  authorId: '',
};

export const AdminInnovationView: React.FC = () => {
  const [concepts, setConcepts] = useState<InnovationConcept[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState<InnovationForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [conceptRes, userRes] = await Promise.all([
        fetchApi<{ concepts: InnovationConcept[] }>(
          '/admin/innovation/concepts'
        ),
        fetchApi<{ users: any[] }>('/admin/users'),
      ]);

      setConcepts(conceptRes.concepts || []);
      setUsers(userRes.users || []);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || 'Failed to load Innovation administration data.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (concept: InnovationConcept) => {
    setEditingId(concept.id);
    setForm({
      title: concept.title || '',
      category: concept.category || 'AI Agent',
      conceptStage: concept.conceptStage || 'Idea',
      summary: concept.summary || '',
      fullDetails: concept.fullDetails || '',
      authorId: concept.authorId || concept.author?.id || '',
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const saveConcept = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.category.trim() ||
      !form.summary.trim() ||
      !form.fullDetails.trim()
    ) {
      setError(
        'Title, category, summary and full details are required.'
      );
      return;
    }

    try {
      setSaving(true);
      setError('');

      const payload = {
        title: form.title.trim(),
        category: form.category.trim(),
        conceptStage: form.conceptStage.trim() || 'Idea',
        summary: form.summary.trim(),
        fullDetails: form.fullDetails.trim(),
        ...(form.authorId ? { authorId: form.authorId } : {}),
      };

      if (editingId) {
        await fetchApi(`/admin/innovation/concepts/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/admin/innovation/concepts', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      closeForm();
      await loadData();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          `Failed to ${editingId ? 'update' : 'create'} innovation concept.`
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteConcept = async (concept: InnovationConcept) => {
    const confirmed = window.confirm(
      `Delete "${concept.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError('');

      await fetchApi(
        `/admin/innovation/concepts/${concept.id}`,
        {
          method: 'DELETE',
        }
      );

      await loadData();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || 'Failed to delete innovation concept.'
      );
    }
  };

  const totalVotes = concepts.reduce(
    (sum, concept) => sum + (concept.votesCount || 0),
    0
  );

  const activeConcepts = concepts.filter(
    (concept) =>
      concept.conceptStage !== 'Archived' &&
      concept.conceptStage !== 'Rejected'
  ).length;

  const stageCounts = concepts.reduce<Record<string, number>>(
    (acc, concept) => {
      acc[concept.conceptStage] =
        (acc[concept.conceptStage] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20">
              <Zap className="w-6 h-6 text-brand-400" />
            </div>

            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-brand-400">
                Innovation Center
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Innovation Concepts
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-400 mt-3 max-w-2xl">
            Manage submitted concepts, development stages, authors and
            community voting activity.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Concept
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
            Concepts
          </p>
          <p className="text-3xl font-black text-white mt-2">
            {concepts.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
            Active
          </p>
          <p className="text-3xl font-black text-white mt-2">
            {activeConcepts}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
            Total Votes
          </p>
          <p className="text-3xl font-black text-white mt-2">
            {totalVotes}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
            Stages
          </p>
          <p className="text-3xl font-black text-white mt-2">
            {Object.keys(stageCounts).length}
          </p>
        </div>
      </div>

      {/* Concepts */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white">
              Innovation Concepts
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Create, review and manage submitted concepts.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-500">
            {concepts.length} total
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading innovation concepts...
          </div>
        ) : concepts.length === 0 ? (
          <div className="p-12 text-center">
            <Zap className="w-10 h-10 mx-auto text-slate-700 mb-3" />
            <h3 className="text-white font-bold">
              No innovation concepts yet
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Use the Add Concept button to create the first concept.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="text-left border-b border-slate-800">
                  <th className="px-5 py-4 text-xs font-mono uppercase tracking-wider text-slate-500">
                    Concept
                  </th>
                  <th className="px-5 py-4 text-xs font-mono uppercase tracking-wider text-slate-500">
                    Category
                  </th>
                  <th className="px-5 py-4 text-xs font-mono uppercase tracking-wider text-slate-500">
                    Stage
                  </th>
                  <th className="px-5 py-4 text-xs font-mono uppercase tracking-wider text-slate-500">
                    Author
                  </th>
                  <th className="px-5 py-4 text-xs font-mono uppercase tracking-wider text-slate-500">
                    Votes
                  </th>
                  <th className="px-5 py-4 text-xs font-mono uppercase tracking-wider text-slate-500">
                    Created
                  </th>
                  <th className="px-5 py-4 text-xs font-mono uppercase tracking-wider text-slate-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {concepts.map((concept) => (
                  <tr
                    key={concept.id}
                    className="border-b border-slate-800/70 hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-5 py-5">
                      <div className="max-w-sm">
                        <p className="font-bold text-white truncate">
                          {concept.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {concept.summary}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-mono text-brand-300">
                        {concept.category}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <span className="text-sm text-slate-300">
                        {concept.conceptStage}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        {concept.author?.avatarUrl ? (
                          <img
                            src={concept.author.avatarUrl}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-500" />
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-slate-300">
                            {concept.author?.fullName || 'Unknown'}
                          </p>
                          <p className="text-[10px] font-mono text-slate-600">
                            {concept.author?.role || ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <span className="inline-flex items-center gap-1.5 text-sm text-brand-300">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {concept.votesCount || 0}
                      </span>
                    </td>

                    <td className="px-5 py-5 text-sm text-slate-500">
                      {concept.createdAt
                        ? new Date(
                            concept.createdAt
                          ).toLocaleDateString()
                        : '—'}
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(concept)}
                          className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteConcept(concept)}
                          className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete"
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
        )}
      </div>

      {/* Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-brand-400">
                  Innovation Center
                </p>
                <h2 className="text-xl font-black text-white mt-1">
                  {editingId
                    ? 'Edit Innovation Concept'
                    : 'Create Innovation Concept'}
                </h2>
              </div>

              <button
                onClick={closeForm}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveConcept} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
                    Concept Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value,
                      })
                    }
                    placeholder="Autonomous Research Agent"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-700 outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-brand-500"
                  >
                    <option value="AI Agent">AI Agent</option>
                    <option value="Quantum">Quantum</option>
                    <option value="Edge AI">Edge AI</option>
                    <option value="Autonomous Systems">
                      Autonomous Systems
                    </option>
                    <option value="Robotics">Robotics</option>
                    <option value="Distributed Systems">
                      Distributed Systems
                    </option>
                    <option value="Cryptography">Cryptography</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
                    Concept Stage
                  </label>
                  <select
                    value={form.conceptStage}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        conceptStage: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-brand-500"
                  >
                    <option value="Idea">Idea</option>
                    <option value="Research">Research</option>
                    <option value="Prototype">Prototype</option>
                    <option value="Testing">Testing</option>
                    <option value="Incubating">Incubating</option>
                    <option value="Production">Production</option>
                    <option value="Archived">Archived</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
                    Author
                  </label>
                  <select
                    value={form.authorId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        authorId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-brand-500"
                  >
                    <option value="">
                      Use current administrator
                    </option>

                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fullName} — {user.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
                    Summary
                  </label>
                  <textarea
                    rows={4}
                    value={form.summary}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        summary: e.target.value,
                      })
                    }
                    placeholder="Briefly describe the innovation concept..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-700 outline-none focus:border-brand-500 resize-y"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
                    Full Details & Architecture
                  </label>
                  <textarea
                    rows={10}
                    value={form.fullDetails}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        fullDetails: e.target.value,
                      })
                    }
                    placeholder="Describe the architecture, objectives, implementation approach, expected outcomes and technical specifications..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-700 outline-none focus:border-brand-500 resize-y"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving
                    ? 'Saving...'
                    : editingId
                      ? 'Update Concept'
                      : 'Create Concept'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
