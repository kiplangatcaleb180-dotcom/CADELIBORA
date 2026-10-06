import React, { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api';
import { DataTable, Column } from '../../components/admin/DataTable';
import {
  MessageSquare,
  BriefcaseBusiness,
  FileText,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
} from 'lucide-react';

type Tab = 'community' | 'services' | 'case-studies';

interface Service {
  id: string;
  name: string;
  slug: string;
  icon: string;
  shortDesc: string;
  fullDesc: string;
  featuresJson: string[] | string;
  currency: string;
  price: number;
}

interface CaseStudy {
  id: string;
  title: string;
  clientName: string;
  industry: string;
  challenge: string;
  solution: string;
  resultsJson: string[] | string;
  coverImage: string;
}

const emptyService = {
  name: '',
  slug: '',
  icon: 'BriefcaseBusiness',
  shortDesc: '',
  fullDesc: '',
  featuresJson: '',
  currency: 'USD',
  price: 0,
};

const emptyCaseStudy = {
  title: '',
  clientName: '',
  industry: '',
  challenge: '',
  solution: '',
  resultsJson: '',
  coverImage: '',
};

function parseArray(value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) return value;

  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Fall back to line-separated values.
  }

  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export const AdminCommunityServicesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('community');

  const [posts, setPosts] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [caseStudyFormOpen, setCaseStudyFormOpen] = useState(false);

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingCaseStudyId, setEditingCaseStudyId] = useState<string | null>(null);

  const [serviceForm, setServiceForm] = useState(emptyService);
  const [caseStudyForm, setCaseStudyForm] = useState(emptyCaseStudy);

  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [commRes, adminServicesRes] = await Promise.all([
        fetchApi<{ posts: any[] }>('/community/posts'),
        fetchApi<{
          services: Service[];
          caseStudies: CaseStudy[];
        }>('/admin/services'),
      ]);

      setPosts(commRes.posts || []);
      setServices(adminServicesRes.services || []);
      setCaseStudies(adminServicesRes.caseStudies || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load Community & Services data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeletePost = async (id: string) => {
    if (!confirm('Remove this community post?')) return;

    try {
      await fetchApi(`/admin/community/posts/${id}`, {
        method: 'DELETE',
      });

      await loadData();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const openCreateService = () => {
    setEditingServiceId(null);
    setServiceForm(emptyService);
    setServiceFormOpen(true);
  };

  const openEditService = (service: Service) => {
    setEditingServiceId(service.id);

    setServiceForm({
      name: service.name || '',
      slug: service.slug || '',
      icon: service.icon || 'BriefcaseBusiness',
      shortDesc: service.shortDesc || '',
      fullDesc: service.fullDesc || '',
      featuresJson: parseArray(service.featuresJson).join('\n'),
      currency: service.currency || 'USD',
      price: Number(service.price || 0),
    });

    setServiceFormOpen(true);
  };

  const saveService = async () => {
    if (!serviceForm.name.trim()) {
      alert('Service name is required.');
      return;
    }

    if (!serviceForm.slug.trim()) {
      alert('Service slug is required.');
      return;
    }

    if (!serviceForm.shortDesc.trim()) {
      alert('Short description is required.');
      return;
    }

    if (!serviceForm.fullDesc.trim()) {
      alert('Full description is required.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...serviceForm,
        price: Number(serviceForm.price),
        featuresJson: parseArray(serviceForm.featuresJson),
      };

      if (editingServiceId) {
        await fetchApi(`/admin/services/services/${editingServiceId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/admin/services/services', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setServiceFormOpen(false);
      setEditingServiceId(null);
      setServiceForm(emptyService);

      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service? Linked orders will prevent deletion.')) return;

    try {
      await fetchApi(`/admin/services/services/${id}`, {
        method: 'DELETE',
      });

      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete service.');
    }
  };

  const openCreateCaseStudy = () => {
    setEditingCaseStudyId(null);
    setCaseStudyForm(emptyCaseStudy);
    setCaseStudyFormOpen(true);
  };

  const openEditCaseStudy = (caseStudy: CaseStudy) => {
    setEditingCaseStudyId(caseStudy.id);

    setCaseStudyForm({
      title: caseStudy.title || '',
      clientName: caseStudy.clientName || '',
      industry: caseStudy.industry || '',
      challenge: caseStudy.challenge || '',
      solution: caseStudy.solution || '',
      resultsJson: parseArray(caseStudy.resultsJson).join('\n'),
      coverImage: caseStudy.coverImage || '',
    });

    setCaseStudyFormOpen(true);
  };

  const saveCaseStudy = async () => {
    if (!caseStudyForm.title.trim()) {
      alert('Case study title is required.');
      return;
    }

    if (!caseStudyForm.clientName.trim()) {
      alert('Client name is required.');
      return;
    }

    if (!caseStudyForm.industry.trim()) {
      alert('Industry is required.');
      return;
    }

    if (!caseStudyForm.challenge.trim()) {
      alert('Challenge is required.');
      return;
    }

    if (!caseStudyForm.solution.trim()) {
      alert('Solution is required.');
      return;
    }

    if (!caseStudyForm.coverImage.trim()) {
      alert('Cover image URL is required.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...caseStudyForm,
        resultsJson: parseArray(caseStudyForm.resultsJson),
      };

      if (editingCaseStudyId) {
        await fetchApi(`/admin/services/case-studies/${editingCaseStudyId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/admin/services/case-studies', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setCaseStudyFormOpen(false);
      setEditingCaseStudyId(null);
      setCaseStudyForm(emptyCaseStudy);

      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save case study.');
    } finally {
      setSaving(false);
    }
  };

  const deleteCaseStudy = async (id: string) => {
    if (!confirm('Delete this case study?')) return;

    try {
      await fetchApi(`/admin/services/case-studies/${id}`, {
        method: 'DELETE',
      });

      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete case study.');
    }
  };

  const postColumns: Column<any>[] = [
    {
      key: 'title',
      header: 'Post Title',
      render: (p) => (
        <span className="font-bold text-white">{p.title}</span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (p) => (
        <span className="text-brand-400 font-bold">{p.category}</span>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      render: (p) => p.author?.fullName || 'Anonymous',
    },
    {
      key: 'likesCount',
      header: 'Likes',
      render: (p) => (
        <span className="text-rose-400 font-bold">{p.likesCount}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (p) => (
        <button
          onClick={() => handleDeletePost(p.id)}
          className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg"
          title="Delete post"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const serviceColumns: Column<Service>[] = [
    {
      key: 'name',
      header: 'Service',
      render: (service) => (
        <div>
          <div className="font-bold text-white">{service.name}</div>
          <div className="text-[10px] text-slate-500">
            /{service.slug}
          </div>
        </div>
      ),
    },
    {
      key: 'shortDesc',
      header: 'Description',
      render: (service) => (
        <span className="text-slate-300 line-clamp-2">
          {service.shortDesc}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (service) => (
        <span className="font-bold text-brand-400">
          {service.currency} {Number(service.price || 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'featuresJson',
      header: 'Features',
      render: (service) => (
        <span className="text-slate-400">
          {parseArray(service.featuresJson).length}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (service) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditService(service)}
            className="p-1.5 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-lg"
            title="Edit service"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => deleteService(service.id)}
            className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg"
            title="Delete service"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const caseStudyColumns: Column<CaseStudy>[] = [
    {
      key: 'title',
      header: 'Case Study',
      render: (item) => (
        <div>
          <div className="font-bold text-white">{item.title}</div>
          <div className="text-[10px] text-slate-500">
            {item.clientName}
          </div>
        </div>
      ),
    },
    {
      key: 'industry',
      header: 'Industry',
      render: (item) => (
        <span className="text-brand-400 font-bold">
          {item.industry}
        </span>
      ),
    },
    {
      key: 'challenge',
      header: 'Challenge',
      render: (item) => (
        <span className="text-slate-300 line-clamp-2">
          {item.challenge}
        </span>
      ),
    },
    {
      key: 'resultsJson',
      header: 'Results',
      render: (item) => (
        <span className="text-slate-400">
          {parseArray(item.resultsJson).length}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditCaseStudy(item)}
            className="p-1.5 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-lg"
            title="Edit case study"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => deleteCaseStudy(item.id)}
            className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg"
            title="Delete case study"
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
        Loading Community & Services...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-400" />
            <span>Community & Enterprise Services</span>
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Moderate community content and manage services and case studies.
          </p>
        </div>

        {activeTab === 'services' && (
          <button
            onClick={openCreateService}
            className="px-4 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        )}

        {activeTab === 'case-studies' && (
          <button
            onClick={openCreateCaseStudy}
            className="px-4 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Case Study
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('community')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 ${
            activeTab === 'community'
              ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Community Posts
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 ${
            activeTab === 'services'
              ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <BriefcaseBusiness className="w-4 h-4" />
          Services
        </button>

        <button
          onClick={() => setActiveTab('case-studies')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 ${
            activeTab === 'case-studies'
              ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Case Studies
        </button>
      </div>

      {activeTab === 'community' && (
        <DataTable
          title="Community Posts"
          data={posts}
          columns={postColumns}
          searchKey="title"
        />
      )}

      {activeTab === 'services' && (
        <DataTable
          title="Services"
          data={services}
          columns={serviceColumns}
          searchKey="name"
        />
      )}

      {activeTab === 'case-studies' && (
        <DataTable
          title="Case Studies"
          data={caseStudies}
          columns={caseStudyColumns}
          searchKey="title"
        />
      )}

      {serviceFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white font-mono">
                  {editingServiceId ? 'Edit Service' : 'Create Service'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Configure the service displayed on the public Services page.
                </p>
              </div>

              <button
                onClick={() => setServiceFormOpen(false)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="Name"
                value={serviceForm.name}
                onChange={(value) =>
                  setServiceForm((f) => ({ ...f, name: value }))
                }
                placeholder="Web Development"
              />

              <FormInput
                label="Slug"
                value={serviceForm.slug}
                onChange={(value) =>
                  setServiceForm((f) => ({ ...f, slug: value }))
                }
                placeholder="web-development"
              />

              <FormInput
                label="Icon"
                value={serviceForm.icon}
                onChange={(value) =>
                  setServiceForm((f) => ({ ...f, icon: value }))
                }
                placeholder="Code2"
              />

              <FormInput
                label="Currency"
                value={serviceForm.currency}
                onChange={(value) =>
                  setServiceForm((f) => ({ ...f, currency: value }))
                }
                placeholder="USD"
              />

              <FormInput
                label="Price"
                type="number"
                value={String(serviceForm.price)}
                onChange={(value) =>
                  setServiceForm((f) => ({
                    ...f,
                    price: Number(value),
                  }))
                }
                placeholder="0"
              />

              <FormInput
                label="Short Description"
                value={serviceForm.shortDesc}
                onChange={(value) =>
                  setServiceForm((f) => ({
                    ...f,
                    shortDesc: value,
                  }))
                }
                placeholder="A concise description of the service"
              />

              <FormTextarea
                label="Full Description"
                value={serviceForm.fullDesc}
                onChange={(value) =>
                  setServiceForm((f) => ({
                    ...f,
                    fullDesc: value,
                  }))
                }
                placeholder="Describe the service in detail..."
                className="md:col-span-2"
              />

              <FormTextarea
                label="Features"
                value={serviceForm.featuresJson}
                onChange={(value) =>
                  setServiceForm((f) => ({
                    ...f,
                    featuresJson: value,
                  }))
                }
                placeholder={'Responsive UI\nAPI integration\nDeployment'}
                className="md:col-span-2"
              />
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-800">
              <button
                onClick={() => setServiceFormOpen(false)}
                className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl font-bold"
              >
                Cancel
              </button>

              <button
                onClick={saveService}
                disabled={saving}
                className="px-5 py-2.5 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-slate-950 rounded-xl font-bold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      {caseStudyFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white font-mono">
                  {editingCaseStudyId
                    ? 'Edit Case Study'
                    : 'Create Case Study'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage a project story shown on the public Case Studies page.
                </p>
              </div>

              <button
                onClick={() => setCaseStudyFormOpen(false)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="Title"
                value={caseStudyForm.title}
                onChange={(value) =>
                  setCaseStudyForm((f) => ({ ...f, title: value }))
                }
                placeholder="Enterprise Platform Transformation"
              />

              <FormInput
                label="Client Name"
                value={caseStudyForm.clientName}
                onChange={(value) =>
                  setCaseStudyForm((f) => ({
                    ...f,
                    clientName: value,
                  }))
                }
                placeholder="Client or Organization"
              />

              <FormInput
                label="Industry"
                value={caseStudyForm.industry}
                onChange={(value) =>
                  setCaseStudyForm((f) => ({
                    ...f,
                    industry: value,
                  }))
                }
                placeholder="Technology"
              />

              <FormInput
                label="Cover Image URL"
                value={caseStudyForm.coverImage}
                onChange={(value) =>
                  setCaseStudyForm((f) => ({
                    ...f,
                    coverImage: value,
                  }))
                }
                placeholder="https://..."
              />

              <FormTextarea
                label="Challenge"
                value={caseStudyForm.challenge}
                onChange={(value) =>
                  setCaseStudyForm((f) => ({
                    ...f,
                    challenge: value,
                  }))
                }
                placeholder="Describe the client's challenge..."
              />

              <FormTextarea
                label="Solution"
                value={caseStudyForm.solution}
                onChange={(value) =>
                  setCaseStudyForm((f) => ({
                    ...f,
                    solution: value,
                  }))
                }
                placeholder="Describe the implemented solution..."
              />

              <FormTextarea
                label="Results"
                value={caseStudyForm.resultsJson}
                onChange={(value) =>
                  setCaseStudyForm((f) => ({
                    ...f,
                    resultsJson: value,
                  }))
                }
                placeholder={'Improved efficiency\nReduced costs\nBetter scalability'}
                className="md:col-span-2"
              />
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-800">
              <button
                onClick={() => setCaseStudyFormOpen(false)}
                className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl font-bold"
              >
                Cancel
              </button>

              <button
                onClick={saveCaseStudy}
                disabled={saving}
                className="px-5 py-2.5 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-slate-950 rounded-xl font-bold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Case Study'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}) => (
  <label className="space-y-2">
    <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-bold">
      {label}
    </span>

    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
    />
  </label>
);

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  className = '',
}) => (
  <label className={`space-y-2 ${className}`}>
    <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-bold">
      {label}
    </span>

    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={5}
      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 resize-y"
    />
  </label>
);
