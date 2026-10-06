import React, { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api';
import { DataTable, Column } from '../../components/admin/DataTable';
import {
  Box,
  Code2,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  ExternalLink,
} from 'lucide-react';

type Tab = 'projects' | 'products';

interface TechnologyOption {
  id: string;
  name: string;
  category: string;
}

interface ResearchProjectOption {
  id: string;
  title: string;
  slug: string;
  area: string;
  status: string;
}

interface InnovationOption {
  id: string;
  title: string;
  category: string;
  conceptStage: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  description: string;
  category: string;
  status: string;
  techStackJson: any;
  featuresJson?: any;
  galleryJson?: any;
  coverImage?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  featured: boolean;
  isPublished: boolean;
  sortOrder: number;
  technologies?: Array<{ technology: TechnologyOption }>;
  research?: Array<{ researchProject: ResearchProjectOption }>;
  innovations?: Array<{ innovation: InnovationOption }>;
  products?: Array<{ product: { id: string; title: string } }>;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  version: string;
  status: string;
  demoUrl?: string | null;
  docsUrl?: string | null;
  coverImage?: string | null;
  galleryJson?: any;
  featuresJson?: any;
  currency: string;
  price: number;
  featured: boolean;
  isPublished: boolean;
  sortOrder: number;
  technologies?: Array<{ technology: TechnologyOption }>;
  research?: Array<{ researchProject: ResearchProjectOption }>;
  innovations?: Array<{ innovation: InnovationOption }>;
  projects?: Array<{ project: { id: string; title: string } }>;
}

const emptyProject = {
  title: '',
  summary: '',
  description: '',
  category: 'Open Source',
  status: 'Active',
  techStack: '',
  features: '',
  gallery: '',
  coverImage: '',
  repoUrl: '',
  liveUrl: '',
  featured: false,
  isPublished: true,
  sortOrder: 0,
  technologyIds: [] as string[],
  researchProjectIds: [] as string[],
  innovationIds: [] as string[],
  productIds: [] as string[],
};

const emptyProduct = {
  title: '',
  tagline: '',
  description: '',
  category: '',
  version: '1.0.0',
  status: 'GA',
  demoUrl: '',
  docsUrl: '',
  coverImage: '',
  gallery: '',
  features: '',
  currency: 'USD',
  price: 0,
  featured: false,
  isPublished: true,
  sortOrder: 0,
  technologyIds: [] as string[],
  researchProjectIds: [] as string[],
  innovationIds: [] as string[],
  projectIds: [] as string[],
};

interface RelationSelectorOption {
  id: string;
  label: string;
  meta?: string;
}

interface RelationSelectorProps {
  title: string;
  options: RelationSelectorOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  emptyText?: string;
}

const RelationSelector: React.FC<RelationSelectorProps> = ({
  title,
  options,
  selectedIds,
  onChange,
  emptyText = 'No options available',
}) => {
  const [search, setSearch] = useState('');

  const normalizedSearch = search.trim().toLowerCase();

  const filteredOptions = options.filter((option) => {
    if (!normalizedSearch) return true;

    return (
      option.label.toLowerCase().includes(normalizedSearch) ||
      (option.meta || '').toLowerCase().includes(normalizedSearch)
    );
  });

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-950/70 overflow-hidden">
      <div className="p-3 border-b border-slate-800">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="font-bold text-white">{title}</span>
          <span className="text-[10px] text-brand-400 font-bold">
            {selectedIds.length} selected
          </span>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}...`}
          className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 outline-none focus:border-brand-500"
        />
      </div>

      <div className="max-h-48 overflow-y-auto p-2 space-y-1">
        {filteredOptions.length === 0 ? (
          <div className="p-3 text-center text-slate-600">
            {emptyText}
          </div>
        ) : (
          filteredOptions.map((option) => {
            const checked = selectedIds.includes(option.id);

            return (
              <label
                key={option.id}
                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition ${
                  checked
                    ? 'bg-brand-500/10 border border-brand-500/30'
                    : 'border border-transparent hover:bg-slate-900'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(option.id)}
                  className="accent-brand-500"
                />

                <div className="min-w-0">
                  <div className="text-white truncate">
                    {option.label}
                  </div>

                  {option.meta && (
                    <div className="text-[10px] text-slate-500 truncate">
                      {option.meta}
                    </div>
                  )}
                </div>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
};

export const AdminProjectsProductsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('projects');

  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [technologies, setTechnologies] = useState<TechnologyOption[]>([]);
  const [researchProjects, setResearchProjects] = useState<ResearchProjectOption[]>([]);
  const [innovations, setInnovations] = useState<InnovationOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [projectForm, setProjectForm] = useState(emptyProject);
  const [productForm, setProductForm] = useState(emptyProduct);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        catalogRes,
        technologyRes,
        researchRes,
        innovationRes,
      ] = await Promise.all([
        fetchApi<{
          projects: Project[];
          products: Product[];
        }>('/projects'),

        fetchApi<{
          technologies: TechnologyOption[];
        }>('/technology/technologies'),

        fetchApi<{
          projects: ResearchProjectOption[];
        }>('/research/projects'),

        fetchApi<{
          concepts: InnovationOption[];
        }>('/innovation'),
      ]);

      setProjects(catalogRes.projects || []);
      setProducts(catalogRes.products || []);
      setTechnologies(technologyRes.technologies || []);
      setResearchProjects(researchRes.projects || []);
      setInnovations(innovationRes.concepts || []);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to load projects and products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setProjectForm(emptyProject);
    setProductForm(emptyProduct);
  };

  const openCreateProject = () => {
    setActiveTab('projects');
    setEditingId(null);
    setProjectForm(emptyProject);
    setShowModal(true);
  };

  const openEditProject = (project: Project) => {
    let techStack: string[] = [];
    let features: string[] = [];
    let gallery: string[] = [];

    try {
      if (Array.isArray(project.techStackJson)) {
        techStack = project.techStackJson;
      } else if (typeof project.techStackJson === 'string') {
        techStack = JSON.parse(project.techStackJson || '[]');
      }
    } catch {
      techStack = [];
    }

    try {
      if (Array.isArray(project.featuresJson)) {
        features = project.featuresJson;
      } else if (typeof project.featuresJson === 'string') {
        features = JSON.parse(project.featuresJson || '[]');
      }
    } catch {
      features = [];
    }

    try {
      if (Array.isArray(project.galleryJson)) {
        gallery = project.galleryJson;
      } else if (typeof project.galleryJson === 'string') {
        gallery = JSON.parse(project.galleryJson || '[]');
      }
    } catch {
      gallery = [];
    }

    setActiveTab('projects');
    setEditingId(project.id);

    setProjectForm({
      title: project.title || '',
      summary: project.summary || '',
      description: project.description || '',
      category: project.category || 'Open Source',
      status: project.status || 'Active',
      techStack: techStack.join(', '),
      features: features.join('\n'),
      gallery: gallery.join('\n'),
      coverImage: project.coverImage || '',
      repoUrl: project.repoUrl || '',
      liveUrl: project.liveUrl || '',
      featured: Boolean(project.featured),
      isPublished: Boolean(project.isPublished),
      sortOrder: Number(project.sortOrder || 0),
      technologyIds: (project.technologies || []).map(
        (item) => item.technology.id
      ),
      researchProjectIds: (project.research || []).map(
        (item) => item.researchProject.id
      ),
      innovationIds: (project.innovations || []).map(
        (item) => item.innovation.id
      ),
      productIds: (project.products || []).map(
        (item) => item.product.id
      ),
    });

    setShowModal(true);
  };

  const openCreateProduct = () => {
    setActiveTab('products');
    setEditingId(null);
    setProductForm(emptyProduct);
    setShowModal(true);
  };

  const openEditProduct = (product: Product) => {
    let gallery: string[] = [];
    let features: string[] = [];

    try {
      if (Array.isArray(product.galleryJson)) {
        gallery = product.galleryJson;
      } else if (typeof product.galleryJson === 'string') {
        gallery = JSON.parse(product.galleryJson || '[]');
      }
    } catch {
      gallery = [];
    }

    try {
      if (Array.isArray(product.featuresJson)) {
        features = product.featuresJson;
      } else if (typeof product.featuresJson === 'string') {
        features = JSON.parse(product.featuresJson || '[]');
      }
    } catch {
      features = [];
    }

    setActiveTab('products');
    setEditingId(product.id);

    setProductForm({
      title: product.title || '',
      tagline: product.tagline || '',
      description: product.description || '',
      category: product.category || '',
      version: product.version || '1.0.0',
      status: product.status || 'GA',
      demoUrl: product.demoUrl || '',
      docsUrl: product.docsUrl || '',
      coverImage: product.coverImage || '',
      gallery: gallery.join('\n'),
      features: features.join('\n'),
      currency: product.currency || 'USD',
      price: Number(product.price || 0),
      featured: Boolean(product.featured),
      isPublished: Boolean(product.isPublished),
      sortOrder: Number(product.sortOrder || 0),
      technologyIds: (product.technologies || []).map(
        (item) => item.technology.id
      ),
      researchProjectIds: (product.research || []).map(
        (item) => item.researchProject.id
      ),
      innovationIds: (product.innovations || []).map(
        (item) => item.innovation.id
      ),
      projectIds: (product.projects || []).map(
        (item) => item.project.id
      ),
    });

    setShowModal(true);
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        title: projectForm.title,
        summary: projectForm.summary || null,
        description: projectForm.description,
        category: projectForm.category,
        status: projectForm.status,
        techStack: projectForm.techStack
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        features: projectForm.features
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        gallery: projectForm.gallery
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        coverImage: projectForm.coverImage || null,
        repoUrl: projectForm.repoUrl || null,
        liveUrl: projectForm.liveUrl || null,
        featured: projectForm.featured,
        isPublished: projectForm.isPublished,
        sortOrder: Number(projectForm.sortOrder),
        technologyIds: projectForm.technologyIds,
        researchProjectIds: projectForm.researchProjectIds,
        innovationIds: projectForm.innovationIds,
        productIds: projectForm.productIds,
      };

      if (editingId) {
        await fetchApi(`/projects/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/projects', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      closeModal();
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        title: productForm.title,
        tagline: productForm.tagline,
        description: productForm.description,
        category: productForm.category,
        version: productForm.version,
        status: productForm.status,
        demoUrl: productForm.demoUrl || null,
        docsUrl: productForm.docsUrl || null,
        coverImage: productForm.coverImage || null,
        gallery: productForm.gallery
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        features: productForm.features
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        currency: productForm.currency,
        price: Number(productForm.price),
        featured: productForm.featured,
        isPublished: productForm.isPublished,
        sortOrder: Number(productForm.sortOrder),
        technologyIds: productForm.technologyIds,
        researchProjectIds: productForm.researchProjectIds,
        innovationIds: productForm.innovationIds,
        projectIds: productForm.projectIds,
      };

      if (editingId) {
        await fetchApi(`/projects/products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/projects/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      closeModal();
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project? This action cannot be undone.')) return;

    try {
      await fetchApi(`/projects/${id}`, {
        method: 'DELETE',
      });

      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product? This action cannot be undone.')) return;

    try {
      await fetchApi(`/projects/products/${id}`, {
        method: 'DELETE',
      });

      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const projectCols: Column<Project>[] = [
    {
      key: 'title',
      header: 'Project',
      render: (project) => (
        <div>
          <div className="font-bold text-white">{project.title}</div>
          <div className="text-[10px] text-slate-500 font-mono">
            {project.slug}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
    },
    {
      key: 'status',
      header: 'Status',
      render: (project) => (
        <span className="text-brand-400 font-mono text-xs">
          {project.status}
        </span>
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (project) => (
        <span
          className={
            project.featured
              ? 'text-emerald-400'
              : 'text-slate-500'
          }
        >
          {project.featured ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (project) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditProject(project)}
            className="p-1.5 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-lg"
            title="Edit project"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => deleteProject(project.id)}
            className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg"
            title="Delete project"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg"
              title="Open repository"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      ),
    },
  ];

  const productCols: Column<Product>[] = [
    {
      key: 'title',
      header: 'Product',
      render: (product) => (
        <div>
          <div className="font-bold text-white">{product.title}</div>
          <div className="text-[10px] text-slate-500 font-mono">
            {product.slug}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
    },
    {
      key: 'version',
      header: 'Version',
      render: (product) => (
        <span className="text-emerald-400 font-bold">
          v{product.version}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
    },
    {
      key: 'price',
      header: 'Price',
      render: (product) => (
        <span className="font-mono text-xs text-slate-300">
          {product.currency} {Number(product.price || 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (product) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditProduct(product)}
            className="p-1.5 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-lg"
            title="Edit product"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => deleteProduct(product.id)}
            className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg"
            title="Delete product"
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
        Loading Projects & Products...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-brand-400" />
            <span>Enterprise Projects & Products</span>
          </h2>

          <p className="text-xs text-slate-500 mt-1 font-mono">
            Manage CADELIBORA engineering projects and enterprise products.
          </p>
        </div>

        <button
          onClick={activeTab === 'projects' ? openCreateProject : openCreateProduct}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold font-mono text-xs rounded-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>
            Add {activeTab === 'projects' ? 'Project' : 'Product'}
          </span>
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-3 text-xs font-mono font-bold ${
            activeTab === 'projects'
              ? 'text-brand-400 border-b-2 border-brand-400'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            Projects ({projects.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-3 text-xs font-mono font-bold ${
            activeTab === 'products'
              ? 'text-brand-400 border-b-2 border-brand-400'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Box className="w-4 h-4" />
            Products ({products.length})
          </span>
        </button>
      </div>

      {activeTab === 'projects' ? (
        <DataTable
          title="Projects"
          data={projects}
          columns={projectCols}
          searchKey="title"
        />
      ) : (
        <DataTable
          title="Products"
          data={products}
          columns={productCols}
          searchKey="title"
        />
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 overflow-y-auto">
          <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 font-mono text-xs my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {editingId ? 'Edit' : 'Create'}{' '}
                {activeTab === 'projects' ? 'Project' : 'Product'}
              </h3>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeTab === 'projects' ? (
              <form onSubmit={saveProject} className="space-y-5">
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
                    placeholder="Short Summary"
                    value={projectForm.summary}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        summary: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <textarea
                  placeholder="Project Description"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Category"
                    value={projectForm.category}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <input
                    type="text"
                    placeholder="Status"
                    value={projectForm.status}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Technology Stack — React, Node.js, PostgreSQL"
                  value={projectForm.techStack}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      techStack: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <RelationSelector
                    title="Technologies"
                    options={technologies.map((item) => ({
                      id: item.id,
                      label: item.name,
                      meta: item.category,
                    }))}
                    selectedIds={projectForm.technologyIds}
                    onChange={(ids) =>
                      setProjectForm({
                        ...projectForm,
                        technologyIds: ids,
                      })
                    }
                  />

                  <RelationSelector
                    title="Research Projects"
                    options={researchProjects.map((item) => ({
                      id: item.id,
                      label: item.title,
                      meta: `${item.area} • ${item.status}`,
                    }))}
                    selectedIds={projectForm.researchProjectIds}
                    onChange={(ids) =>
                      setProjectForm({
                        ...projectForm,
                        researchProjectIds: ids,
                      })
                    }
                  />

                  <RelationSelector
                    title="Innovations"
                    options={innovations.map((item) => ({
                      id: item.id,
                      label: item.title,
                      meta: `${item.category} • ${item.conceptStage}`,
                    }))}
                    selectedIds={projectForm.innovationIds}
                    onChange={(ids) =>
                      setProjectForm({
                        ...projectForm,
                        innovationIds: ids,
                      })
                    }
                  />

                  <RelationSelector
                    title="Related Products"
                    options={products.map((item) => ({
                      id: item.id,
                      label: item.title,
                      meta: item.category,
                    }))}
                    selectedIds={projectForm.productIds}
                    onChange={(ids) =>
                      setProjectForm({
                        ...projectForm,
                        productIds: ids,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <textarea
                    placeholder="Features — one feature per line"
                    value={projectForm.features}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        features: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white min-h-32"
                  />

                  <textarea
                    placeholder="Gallery image URLs — one URL per line"
                    value={projectForm.gallery}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        gallery: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white min-h-32"
                  />
                </div>

                <input
                  type="url"
                  placeholder="Cover Image URL"
                  value={projectForm.coverImage}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      coverImage: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="url"
                    placeholder="Repository URL"
                    value={projectForm.repoUrl}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        repoUrl: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <input
                    type="url"
                    placeholder="Live URL"
                    value={projectForm.liveUrl}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        liveUrl: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300">
                    <input
                      type="checkbox"
                      checked={projectForm.featured}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          featured: e.target.checked,
                        })
                      }
                    />
                    Featured project
                  </label>

                  <label className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300">
                    <input
                      type="checkbox"
                      checked={projectForm.isPublished}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          isPublished: e.target.checked,
                        })
                      }
                    />
                    Published
                  </label>

                  <input
                    type="number"
                    placeholder="Sort Order"
                    value={projectForm.sortOrder}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        sortOrder: Number(e.target.value),
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 p-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 font-bold rounded-xl text-white flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving
                      ? 'Saving...'
                      : editingId
                        ? 'Update Project'
                        : 'Create Project'}
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
              <form onSubmit={saveProduct} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Product Title"
                    required
                    value={productForm.title}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        title: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <input
                    type="text"
                    placeholder="Tagline"
                    required
                    value={productForm.tagline}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        tagline: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <textarea
                  placeholder="Product Description"
                  required
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white min-h-32"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Category"
                    required
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <input
                    type="text"
                    placeholder="Version"
                    value={productForm.version}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        version: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <input
                    type="text"
                    placeholder="Status — GA, Beta, etc."
                    value={productForm.status}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <RelationSelector
                    title="Technologies"
                    options={technologies.map((item) => ({
                      id: item.id,
                      label: item.name,
                      meta: item.category,
                    }))}
                    selectedIds={productForm.technologyIds}
                    onChange={(ids) =>
                      setProductForm({
                        ...productForm,
                        technologyIds: ids,
                      })
                    }
                  />

                  <RelationSelector
                    title="Research Projects"
                    options={researchProjects.map((item) => ({
                      id: item.id,
                      label: item.title,
                      meta: `${item.area} • ${item.status}`,
                    }))}
                    selectedIds={productForm.researchProjectIds}
                    onChange={(ids) =>
                      setProductForm({
                        ...productForm,
                        researchProjectIds: ids,
                      })
                    }
                  />

                  <RelationSelector
                    title="Innovations"
                    options={innovations.map((item) => ({
                      id: item.id,
                      label: item.title,
                      meta: `${item.category} • ${item.conceptStage}`,
                    }))}
                    selectedIds={productForm.innovationIds}
                    onChange={(ids) =>
                      setProductForm({
                        ...productForm,
                        innovationIds: ids,
                      })
                    }
                  />

                  <RelationSelector
                    title="Related Projects"
                    options={projects.map((item) => ({
                      id: item.id,
                      label: item.title,
                      meta: `${item.category} • ${item.status}`,
                    }))}
                    selectedIds={productForm.projectIds}
                    onChange={(ids) =>
                      setProductForm({
                        ...productForm,
                        projectIds: ids,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <textarea
                    placeholder="Features — one feature per line"
                    value={productForm.features}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        features: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white min-h-32"
                  />

                  <textarea
                    placeholder="Gallery image URLs — one URL per line"
                    value={productForm.gallery}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        gallery: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white min-h-32"
                  />
                </div>

                <input
                  type="url"
                  placeholder="Cover Image URL"
                  value={productForm.coverImage}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      coverImage: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="url"
                    placeholder="Demo URL"
                    value={productForm.demoUrl}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        demoUrl: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <input
                    type="url"
                    placeholder="Documentation URL"
                    value={productForm.docsUrl}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        docsUrl: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Currency — USD, KES"
                    value={productForm.currency}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        currency: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />

                  <input
                    type="number"
                    placeholder="Sort Order"
                    value={productForm.sortOrder}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        sortOrder: Number(e.target.value),
                      })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          featured: e.target.checked,
                        })
                      }
                    />
                    Featured product
                  </label>

                  <label className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300">
                    <input
                      type="checkbox"
                      checked={productForm.isPublished}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          isPublished: e.target.checked,
                        })
                      }
                    />
                    Published
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 p-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 font-bold rounded-xl text-white flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving
                      ? 'Saving...'
                      : editingId
                        ? 'Update Product'
                        : 'Create Product'}
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
