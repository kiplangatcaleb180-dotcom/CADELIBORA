import React, { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api';
import { DataTable, Column } from '../../components/admin/DataTable';
import { BookOpen, Newspaper, Plus, Trash2, Pencil, Eye, EyeOff, X } from 'lucide-react';

export const AdminCMSView: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const loadData = async () => {
    try {
      const [artRes, libRes] = await Promise.all([
        fetchApi<{ articles: any[] }>('/admin/articles'),
        fetchApi<{ resources: any[] }>('/library'),
      ]);
      setArticles(artRes.articles || []);
      setResources(libRes.resources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/admin/articles', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setShowModal(false);
      setFormData({});
      loadData();
    } catch (err: any) {
      alert(err.message || 'Creation failed');
    }
  };

  const handleEditArticle = (article: any) => {
    setFormData({
      id: article.id,
      title: article.title || '',
      summary: article.summary || '',
      content: article.content || '',
      category: article.category || 'Announcements',
      coverImage: article.coverImage || '',
      isPublished: Boolean(article.isPublished),
    });
    setShowModal(true);
  };

  const handleTogglePublished = async (article: any) => {
    try {
      await fetchApi(`/admin/articles/${article.id}/publish`, {
        method: 'PATCH',
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Publish status update failed');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Delete article?')) return;
    try {
      await fetchApi(`/admin/articles/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const cols: Column<any>[] = [
    { key: 'title', header: 'Article Title', render: (a) => <span className="font-bold text-white">{a.title}</span> },
    { key: 'category', header: 'Category', render: (a) => <span className="text-brand-400 font-bold">{a.category}</span> },
    { key: 'author', header: 'Author', render: (a) => a.author?.fullName || 'System' },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (a) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleEditArticle(a)}
            title="Edit article"
            className="p-1.5 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-lg"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleTogglePublished(a)}
            title={a.isPublished ? 'Unpublish article' : 'Publish article'}
            className={`p-1.5 rounded-lg ${
              a.isPublished
                ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
            }`}
          >
            {a.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleDeleteArticle(a.id)}
            title="Delete article"
            className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="p-12 text-center font-mono text-brand-400 animate-pulse">Loading CMS Resources...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-brand-400" />
          <span>Digital Library & Newsroom CMS</span>
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold font-mono text-xs rounded-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Article</span>
        </button>
      </div>

      <DataTable title="Newsroom Articles" data={articles} columns={cols} searchKey="title" />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 font-mono text-xs my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {formData.id ? 'Edit Article' : 'Publish Article'}
              </h3>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setFormData({});
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                try {
                  const payload = {
                    title: formData.title,
                    summary: formData.summary,
                    content: formData.content,
                    category: formData.category || 'Announcements',
                    coverImage: formData.coverImage || '',
                    ...(formData.id
                      ? { isPublished: Boolean(formData.isPublished) }
                      : {}),
                  };

                  if (formData.id) {
                    await fetchApi(`/admin/articles/${formData.id}`, {
                      method: 'PUT',
                      body: JSON.stringify(payload),
                    });
                  } else {
                    await fetchApi('/admin/articles', {
                      method: 'POST',
                      body: JSON.stringify(payload),
                    });
                  }

                  setShowModal(false);
                  setFormData({});
                  loadData();
                } catch (err: any) {
                  alert(err.message || 'Article save failed');
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  placeholder="Article title"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    placeholder="Announcements"
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.coverImage || ''}
                    placeholder="https://..."
                    onChange={(e) =>
                      setFormData({ ...formData, coverImage: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Summary</label>
                <textarea
                  value={formData.summary || ''}
                  placeholder="Short article summary"
                  required
                  rows={3}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white resize-y"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Full Content</label>
                <textarea
                  value={formData.content || ''}
                  placeholder="Write the full article content..."
                  required
                  rows={10}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white resize-y"
                />
              </div>

              {formData.id && (
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isPublished)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isPublished: e.target.checked,
                      })
                    }
                    className="accent-brand-500"
                  />
                  <span>Published</span>
                </label>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 p-2.5 bg-brand-600 hover:bg-brand-500 font-bold rounded-xl text-white"
                >
                  {formData.id ? 'Save Changes' : 'Publish Article'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({});
                  }}
                  className="px-5 p-2.5 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
