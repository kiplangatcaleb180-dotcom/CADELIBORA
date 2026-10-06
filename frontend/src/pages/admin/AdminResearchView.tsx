import React, { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api';
import { DataTable, Column } from '../../components/admin/DataTable';
import {
  Cpu,
  BookOpen,
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
} from 'lucide-react';

type Tab = 'projects' | 'publications';

const emptyProject = {
  title: '',
  slug: '',
  area: '',
  description: '',
  status: 'Ongoing',
  startYear: new Date().getFullYear(),
  endYear: '',
  leadResearcherId: '',
  tagsJson: '',
};

const emptyPublication = {
  title: '',
  abstract: '',
  authors: '',
  journal: '',
  year: new Date().getFullYear(),
  doi: '',
  pdfUrl: '',
  researchProjectId: '',
};

export const AdminResearchView: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [researchers, setResearchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formType, setFormType] = useState<Tab>('projects');

  const [projectForm, setProjectForm] = useState<any>(emptyProject);
  const [publicationForm, setPublicationForm] =
    useState<any>(emptyPublication);

  const loadData = async () => {
    try {
      setLoading(true);

      const [projRes, pubRes, usersRes] = await Promise.all([
        fetchApi<{ projects: any[] }>('/admin/research/projects'),
        fetchApi<{ publications: any[] }>('/admin/research/publications'),
        fetchApi<{ users: any[] }>('/admin/users'),
      ]);

      setProjects(projRes.projects || []);
      setPublications(pubRes.publications || []);
      setResearchers(
        (usersRes.users || []).filter(
          (user) => user.role === 'RESEARCHER'
        )
      );
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to load Research administration data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateProject = () => {
    setFormType('projects');
    setEditingId(null);
    setProjectForm({
      ...emptyProject,
      startYear: new Date().getFullYear(),
    });
    setShowModal(true);
  };

  const openEditProject = (project: any) => {
    setFormType('projects');
    setEditingId(project.id);

    setProjectForm({
      title: project.title || '',
      slug: project.slug || '',
      area: project.area || '',
      description: project.description || '',
      status: project.status || 'Ongoing',
      startYear: project.startYear || new Date().getFullYear(),
      endYear: project.endYear ?? '',
      leadResearcherId: project.leadResearcherId || '',
      tagsJson:
        Array.isArray(project.tagsJson)
          ? JSON.stringify(project.tagsJson)
          : project.tagsJson
            ? JSON.stringify(project.tagsJson)
            : '',
    });

    setShowModal(true);
  };

  const openCreatePublication = () => {
    setFormType('publications');
    setEditingId(null);
    setPublicationForm({
      ...emptyPublication,
      year: new Date().getFullYear(),
    });
    setShowModal(true);
  };

  const openEditPublication = (publication: any) => {
    setFormType('publications');
    setEditingId(publication.id);

    setPublicationForm({
      title: publication.title || '',
      abstract: publication.abstract || '',
      authors: publication.authors || '',
      journal: publication.journal || '',
      year: publication.year || new Date().getFullYear(),
      doi: publication.doi || '',
      pdfUrl: publication.pdfUrl || '',
      researchProjectId: publication.researchProjectId || '',
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let tagsJson: any[] = [];

      if (projectForm.tagsJson?.trim()) {
        const parsed = JSON.parse(projectForm.tagsJson);

        if (!Array.isArray(parsed)) {
          throw new Error('Tags JSON must be a JSON array.');
        }

        tagsJson = parsed;
      }

      const payload = {
        title: projectForm.title,
        slug: projectForm.slug || undefined,
        area: projectForm.area,
        description: projectForm.description,
        status: projectForm.status,
        leadResearcherId: projectForm.leadResearcherId,
        startYear: Number(projectForm.startYear),
        endYear:
          projectForm.endYear === '' ? null : Number(projectForm.endYear),
        tagsJson,
      };

      const url = editingId
        ? `/admin/research/projects/${editingId}`
        : '/admin/research/projects';

      await fetchApi(url, {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });

      closeModal();
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save research project.');
    }
  };

  const savePublication = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        title: publicationForm.title,
        abstract: publicationForm.abstract,
        authors: publicationForm.authors,
        journal: publicationForm.journal,
        year: Number(publicationForm.year),
        doi: publicationForm.doi || null,
        pdfUrl: publicationForm.pdfUrl || null,
        researchProjectId: publicationForm.researchProjectId || null,
      };

      const url = editingId
        ? `/admin/research/publications/${editingId}`
        : '/admin/research/publications';

      await fetchApi(url, {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });

      closeModal();
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save publication.');
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this research project?')) return;

    try {
      await fetchApi(`/admin/research/projects/${id}`, {
        method: 'DELETE',
      });

      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete research project.');
    }
  };

  const deletePublication = async (id: string) => {
    if (!confirm('Delete this publication?')) return;

    try {
      await fetchApi(`/admin/research/publications/${id}`, {
        method: 'DELETE',
      });

      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete publication.');
    }
  };

  const projectColumns: Column<any>[] = [
    {
      key: 'title',
      header: 'Project Title',
      render: (r) => (
        <div>
          <span className="font-bold text-white">{r.title}</span>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            {r.slug}
          </div>
        </div>
      ),
    },
    {
      key: 'area',
      header: 'Research Area',
      render: (r) => (
        <span className="text-brand-400 font-bold">{r.area}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <span className="text-emerald-400 font-bold">{r.status}</span>
      ),
    },
    {
      key: 'startYear',
      header: 'Timeline',
      render: (r) => (
        <span className="text-slate-300 font-mono">
          {r.startYear} - {r.endYear || 'Present'}
        </span>
      ),
    },
    {
      key: 'leadResearcher',
      header: 'Lead Researcher',
      render: (r) => (
        <span className="text-slate-300">
          {r.leadResearcher?.fullName || '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (r) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditProject(r)}
            className="p-1.5 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-lg"
            title="Edit project"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => deleteProject(r.id)}
            className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg"
            title="Delete project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const publicationColumns: Column<any>[] = [
    {
      key: 'title',
      header: 'Publication',
      render: (r) => (
        <div>
          <span className="font-bold text-white">{r.title}</span>
          <div className="text-[10px] text-slate-500 mt-1">
            {r.journal}
          </div>
        </div>
      ),
    },
    {
      key: 'authors',
      header: 'Authors',
      render: (r) => (
        <span className="text-slate-300">{r.authors}</span>
      ),
    },
    {
      key: 'year',
      header: 'Year',
      render: (r) => (
        <span className="font-mono text-brand-400">{r.year}</span>
      ),
    },
    {
      key: 'researchProject',
      header: 'Research Project',
      render: (r) => (
        <span className="text-slate-300">
          {r.researchProject?.title || 'Unlinked'}
        </span>
      ),
    },
    {
      key: 'doi',
      header: 'DOI',
      render: (r) => (
        <span className="text-slate-400 font-mono text-xs">
          {r.doi || '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (r) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditPublication(r)}
            className="p-1.5 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-lg"
            title="Edit publication"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => deletePublication(r.id)}
            className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg"
            title="Delete publication"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-brand-400 animate-pulse">
        Loading Research Data...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <span>Research Institute</span>
          </h2>

          <p className="text-xs text-slate-500 font-mono mt-1">
            Manage research projects and scientific publications.
          </p>
        </div>

        <button
          onClick={
            activeTab === 'projects'
              ? openCreateProject
              : openCreatePublication
          }
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold font-mono text-xs rounded-xl flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>
            {activeTab === 'projects'
              ? 'Add Research Project'
              : 'Add Publication'}
          </span>
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition ${
            activeTab === 'projects'
              ? 'bg-brand-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Projects
          <span className="px-1.5 py-0.5 rounded-md bg-slate-900/60">
            {projects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('publications')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition ${
            activeTab === 'publications'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Publications
          <span className="px-1.5 py-0.5 rounded-md bg-slate-900/60">
            {publications.length}
          </span>
        </button>
      </div>

      {activeTab === 'projects' ? (
        <DataTable
          title="Research Projects"
          data={projects}
          columns={projectColumns}
          searchKey="title"
        />
      ) : (
        <DataTable
          title="Scientific Publications"
          data={publications}
          columns={publicationColumns}
          searchKey="title"
        />
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 font-mono text-xs my-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {formType === 'projects'
                    ? editingId
                      ? 'Edit Research Project'
                      : 'Create Research Project'
                    : editingId
                      ? 'Edit Publication'
                      : 'Create Publication'}
                </h3>

                <p className="text-[10px] text-slate-500 mt-1">
                  {formType === 'projects'
                    ? 'Define the research initiative and its scientific scope.'
                    : 'Add bibliographic information for a research publication.'}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formType === 'projects' ? (
              <form onSubmit={saveProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Project Title"
                    required
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        title: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <input
                    type="text"
                    placeholder="Slug (optional)"
                    value={projectForm.slug}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        slug: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <input
                    type="text"
                    placeholder="Research Area"
                    required
                    value={projectForm.area}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        area: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <select
                    value={projectForm.status}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Planned">Planned</option>
                    <option value="Completed">Completed</option>
                    <option value="Paused">Paused</option>
                    <option value="Archived">Archived</option>
                  </select>

                  <select
                    required
                    value={projectForm.leadResearcherId}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        leadResearcherId: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="">Select Lead Researcher</option>

                    {researchers.map((researcher) => (
                      <option key={researcher.id} value={researcher.id}>
                        {researcher.fullName}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Start Year"
                    required
                    value={projectForm.startYear}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        startYear: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <input
                    type="number"
                    placeholder="End Year (optional)"
                    value={projectForm.endYear}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        endYear: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <textarea
                  placeholder="Research Project Description"
                  required
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white min-h-32"
                />

                <textarea
                  placeholder='Tags JSON, e.g. ["AI", "Neuro-Symbolic", "Reasoning"]'
                  value={projectForm.tagsJson}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      tagsJson: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white min-h-20"
                />

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 p-3 bg-brand-600 hover:bg-brand-500 font-bold rounded-xl text-white flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingId ? 'Save Changes' : 'Create Project'}
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 p-3 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl text-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={savePublication} className="space-y-4">
                <input
                  type="text"
                  placeholder="Publication Title"
                  required
                  value={publicationForm.title}
                  onChange={(e) =>
                    setPublicationForm({
                      ...publicationForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Authors"
                    required
                    value={publicationForm.authors}
                    onChange={(e) =>
                      setPublicationForm({
                        ...publicationForm,
                        authors: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <input
                    type="text"
                    placeholder="Journal"
                    required
                    value={publicationForm.journal}
                    onChange={(e) =>
                      setPublicationForm({
                        ...publicationForm,
                        journal: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <input
                    type="number"
                    placeholder="Publication Year"
                    required
                    value={publicationForm.year}
                    onChange={(e) =>
                      setPublicationForm({
                        ...publicationForm,
                        year: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <select
                    value={publicationForm.researchProjectId}
                    onChange={(e) =>
                      setPublicationForm({
                        ...publicationForm,
                        researchProjectId: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="">No Research Project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="DOI (optional)"
                    value={publicationForm.doi}
                    onChange={(e) =>
                      setPublicationForm({
                        ...publicationForm,
                        doi: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <input
                    type="url"
                    placeholder="PDF URL (optional)"
                    value={publicationForm.pdfUrl}
                    onChange={(e) =>
                      setPublicationForm({
                        ...publicationForm,
                        pdfUrl: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <textarea
                  placeholder="Publication Abstract"
                  required
                  value={publicationForm.abstract}
                  onChange={(e) =>
                    setPublicationForm({
                      ...publicationForm,
                      abstract: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white min-h-36"
                />

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 p-3 bg-purple-600 hover:bg-purple-500 font-bold rounded-xl text-white flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingId ? 'Save Changes' : 'Create Publication'}
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 p-3 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl text-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
