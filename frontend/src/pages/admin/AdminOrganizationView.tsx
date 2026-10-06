import React, { useEffect, useState } from 'react';
import {
  Building2,
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  History,
  Plus,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { fetchApi } from '../../lib/api';

interface Organization {
  id: string;
  name: string;
  tagline?: string | null;
  description: string;
  vision?: string | null;
  mission?: string | null;
  valuesJson?: string[] | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  isPublished: boolean;
}

interface OrganizationHistory {
  id: string;
  organizationId: string;
  year: number;
  title: string;
  description: string;
  sortOrder: number;
}

interface OrganizationMilestone {
  id: string;
  organizationId: string;
  year: number;
  title: string;
  description: string;
  icon: string | null;
  sortOrder: number;
  isPublished: boolean;
}

interface OrganizationLeader {
  id: string;
  organizationId: string;
  name: string;
  position: string;
  department: string | null;
  bio: string | null;
  photoUrl: string | null;
  email: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  expertiseJson: string[];
  sortOrder: number;
  isPublished: boolean;
}

interface OrganizationDepartment {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string;
  purpose: string | null;
  icon: string | null;
  coverImage: string | null;
  responsibilitiesJson: string[];
  sortOrder: number;
  isActive: boolean;
}

interface OrganizationUnit {
  id: string;
  organizationId: string;
  parentId: string | null;
  name: string;
  title: string | null;
  description: string | null;
  leaderName: string | null;
  level: number;
  sortOrder: number;
}

interface OrganizationPartner {
  id: string;
  organizationId: string;
  name: string;
  type: string;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  sortOrder: number;
}

export const AdminOrganizationView: React.FC = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [history, setHistory] = useState<OrganizationHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySaving, setHistorySaving] = useState(false);
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);

  const [historyForm, setHistoryForm] = useState({
    year: '',
    title: '',
    description: '',
    sortOrder: '0',
  });

const [milestones, setMilestones] = useState<OrganizationMilestone[]>([]);
const [milestonesLoading, setMilestonesLoading] = useState(false);
const [milestonesSaving, setMilestonesSaving] = useState(false);
const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);

const [milestoneForm, setMilestoneForm] = useState({
  year: '',
  title: '',
  description: '',
  icon: '',
  sortOrder: '0',
  isPublished: true,
});

const [leaders, setLeaders] = useState<OrganizationLeader[]>([]);
const [leadersLoading, setLeadersLoading] = useState(false);
const [leadersSaving, setLeadersSaving] = useState(false);
const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);

const [leaderForm, setLeaderForm] = useState({
  name: '',
  position: '',
  department: '',
  bio: '',
  photoUrl: '',
  email: '',
  websiteUrl: '',
  linkedinUrl: '',
  expertise: '',
  sortOrder: '0',
  isPublished: true,
});

const [departments, setDepartments] = useState<OrganizationDepartment[]>([]);
const [departmentsLoading, setDepartmentsLoading] = useState(false);
const [departmentsSaving, setDepartmentsSaving] = useState(false);
const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(null);

const [departmentForm, setDepartmentForm] = useState({
  name: '',
  slug: '',
  description: '',
  purpose: '',
  icon: '',
  coverImage: '',
  responsibilities: '',
  sortOrder: '0',
  isActive: true,
});

const [units, setUnits] = useState<OrganizationUnit[]>([]);
const [unitsLoading, setUnitsLoading] = useState(false);
const [unitsSaving, setUnitsSaving] = useState(false);
const [editingUnitId, setEditingUnitId] = useState<string | null>(null);

const [unitForm, setUnitForm] = useState({
  parentId: '',
  name: '',
  title: '',
  description: '',
  leaderName: '',
  level: '0',
  sortOrder: '0',
});

const [partners, setPartners] = useState<OrganizationPartner[]>([]);
const [partnersLoading, setPartnersLoading] = useState(false);
const [partnersSaving, setPartnersSaving] = useState(false);
const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);

const [partnerForm, setPartnerForm] = useState({
  name: '',
  type: '',
  description: '',
  logoUrl: '',
  websiteUrl: '',
  startDate: '',
  endDate: '',
  isActive: true,
  sortOrder: '0',
});

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    vision: '',
    mission: '',
    values: '',
    logoUrl: '',
    websiteUrl: '',
    email: '',
    phone: '',
    address: '',
    isPublished: true,
  });



const loadHistory = async (organizationId: string) => {
  try {
    setHistoryLoading(true);

    const response = await fetchApi<{
      success: boolean;
      history: OrganizationHistory[];
    }>(`/admin/organization/${organizationId}/history`);

    setHistory(response.history || []);
  } catch (err: any) {
    setError(err.message || 'Failed to load organization history.');
  } finally {
    setHistoryLoading(false);
  }
};

const loadMilestones = async (organizationId: string) => {
  try {
    setMilestonesLoading(true);

    const res = await fetchApi<{
      success: boolean;
      milestones: OrganizationMilestone[];
    }>(
      `/admin/organization/${organizationId}/milestones`
    );

    if (!res.success) {
      throw new Error('Failed to load organization milestones.');
    }

    setMilestones(res.milestones);
  } catch (err: any) {
    setError(err.message || 'Failed to load organization milestones.');
  } finally {
    setMilestonesLoading(false);
  }
};

const loadLeaders = async (organizationId: string) => {
  try {
    setLeadersLoading(true);

    const res = await fetchApi<{
      success: boolean;
      leaders: OrganizationLeader[];
    }>(
      `/admin/organization/${organizationId}/leaders`
    );

    if (!res.success) {
      throw new Error('Failed to load organization leaders.');
    }

    setLeaders(res.leaders);
  } catch (err: any) {
    setError(err.message || 'Failed to load organization leaders.');
  } finally {
    setLeadersLoading(false);
  }
};

const loadDepartments = async (organizationId: string) => {
  try {
    setDepartmentsLoading(true);

    const res = await fetchApi<{
      success: boolean;
      departments: OrganizationDepartment[];
    }>(
      `/admin/organization/${organizationId}/departments`
    );

    if (!res.success) {
      throw new Error('Failed to load organization departments.');
    }

    setDepartments(res.departments);
  } catch (err: any) {
    setError(
      err.message || 'Failed to load organization departments.'
    );
  } finally {
    setDepartmentsLoading(false);
  }
};

const loadUnits = async (organizationId: string) => {
  try {
    setUnitsLoading(true);

    const res = await fetchApi<{
      success: boolean;
      units: OrganizationUnit[];
    }>(
      `/admin/organization/${organizationId}/structure`
    );

    if (!res.success) {
      throw new Error(
        'Failed to load organization structure.'
      );
    }

    setUnits(res.units);
  } catch (err: any) {
    setError(
      err.message ||
        'Failed to load organization structure.'
    );
  } finally {
    setUnitsLoading(false);
  }
};

const loadPartners = async (organizationId: string) => {
  try {
    setPartnersLoading(true);

    const response = await fetchApi<{
      success: boolean;
      partners: OrganizationPartner[];
    }>(
      `/admin/organization/${organizationId}/partners`
    );

    setPartners(response.partners || []);
  } catch (err: any) {
    setError(err.message || 'Failed to load organization partners.');
  } finally {
    setPartnersLoading(false);
  }
};

  const loadOrganization = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetchApi<{
        success: boolean;
        organization: Organization | null;
      }>('/admin/organization');

      if (!response.organization) {
        setError('Organization has not been configured.');
        return;
      }

      const org = response.organization;

      setOrganization(org);
      await loadHistory(org.id);
      await loadMilestones(org.id);
      await loadLeaders(org.id);
      await loadDepartments(org.id);
      await loadUnits(org.id);
      await loadPartners(org.id);


      const values = Array.isArray(org.valuesJson)
        ? org.valuesJson.join('\n')
        : '';

      setFormData({
        name: org.name || '',
        tagline: org.tagline || '',
        description: org.description || '',
        vision: org.vision || '',
        mission: org.mission || '',
        values,
        logoUrl: org.logoUrl || '',
        websiteUrl: org.websiteUrl || '',
        email: org.email || '',
        phone: org.phone || '',
        address: org.address || '',
        isPublished: org.isPublished,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load organization.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganization();
  }, []);

  const updateField = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!organization) return;

    try {
      setSaving(true);
      setMessage('');
      setError('');

      const valuesJson = formData.values
        .split('\n')
        .map((value) => value.trim())
        .filter(Boolean);

      await fetchApi(`/admin/organization/${organization.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name,
          tagline: formData.tagline || null,
          description: formData.description,
          vision: formData.vision || null,
          mission: formData.mission || null,
          valuesJson,
          logoUrl: formData.logoUrl || null,
          websiteUrl: formData.websiteUrl || null,
          email: formData.email || null,
          phone: formData.phone || null,
          address: formData.address || null,
          isPublished: formData.isPublished,
        }),
      });

      setMessage('Organization profile saved successfully.');

      await loadOrganization();
    } catch (err: any) {
      setError(err.message || 'Failed to save organization.');
    } finally {
      setSaving(false);
    }
  };

const resetHistoryForm = () => {
  setHistoryForm({
    year: '',
    title: '',
    description: '',
    sortOrder: '0',
  });

  setEditingHistoryId(null);
};

const handleHistorySubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  if (!organization) return;

  if (!historyForm.year || !historyForm.title || !historyForm.description) {
    setError('Year, title, and description are required.');
    return;
  }

  try {
    setHistorySaving(true);
    setMessage('');
    setError('');

    const payload = {
      year: Number(historyForm.year),
      title: historyForm.title.trim(),
      description: historyForm.description.trim(),
      sortOrder: Number(historyForm.sortOrder) || 0,
    };

    if (editingHistoryId) {
      await fetchApi(
        `/admin/organization/${organization.id}/history/${editingHistoryId}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        }
      );

      setMessage('Organization history entry updated successfully.');
    } else {
      await fetchApi(
        `/admin/organization/${organization.id}/history`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      setMessage('Organization history entry created successfully.');
    }

    resetHistoryForm();
    await loadHistory(organization.id);
  } catch (err: any) {
    setError(err.message || 'Failed to save history entry.');
  } finally {
    setHistorySaving(false);
  }
};

const handleEditHistory = (entry: OrganizationHistory) => {
  setEditingHistoryId(entry.id);

  setHistoryForm({
    year: String(entry.year),
    title: entry.title,
    description: entry.description,
    sortOrder: String(entry.sortOrder),
  });

  setMessage('');
  setError('');
};

const handleDeleteHistory = async (historyId: string) => {
  if (!organization) return;

  const confirmed = window.confirm(
    'Are you sure you want to delete this history entry?'
  );

  if (!confirmed) return;

  try {
    setHistorySaving(true);
    setMessage('');
    setError('');

    await fetchApi(
      `/admin/organization/${organization.id}/history/${historyId}`,
      {
        method: 'DELETE',
      }
    );

    setMessage('Organization history entry deleted successfully.');

    if (editingHistoryId === historyId) {
      resetHistoryForm();
    }

    await loadHistory(organization.id);
  } catch (err: any) {
    setError(err.message || 'Failed to delete history entry.');
  } finally {
    setHistorySaving(false);
  }
};

const resetMilestoneForm = () => {
  setMilestoneForm({
    year: '',
    title: '',
    description: '',
    icon: '',
    sortOrder: '0',
    isPublished: true,
  });

  setEditingMilestoneId(null);
};
const handleMilestoneSubmit = async (
  event: React.FormEvent
) => {
  event.preventDefault();

  if (!organization) return;

  if (
    !milestoneForm.year ||
    !milestoneForm.title ||
    !milestoneForm.description
  ) {
    setError('Year, title, and description are required.');
    return;
  }

  try {
    setMilestonesSaving(true);
    setMessage('');
    setError('');

    const payload = {
      year: Number(milestoneForm.year),
      title: milestoneForm.title.trim(),
      description: milestoneForm.description.trim(),
      icon: milestoneForm.icon.trim() || null,
      sortOrder: Number(milestoneForm.sortOrder) || 0,
      isPublished: milestoneForm.isPublished,
    };

    if (editingMilestoneId) {
      await fetchApi(
        `/admin/organization/${organization.id}/milestones/${editingMilestoneId}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        }
      );

      setMessage(
        'Organization milestone updated successfully.'
      );
    } else {
      await fetchApi(
        `/admin/organization/${organization.id}/milestones`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      setMessage(
        'Organization milestone created successfully.'
      );
    }

    resetMilestoneForm();
    await loadMilestones(organization.id);
  } catch (err: any) {
    setError(
      err.message || 'Failed to save milestone.'
    );
  } finally {
    setMilestonesSaving(false);
  }
};
const handleEditMilestone = (
  milestone: OrganizationMilestone
) => {
  setEditingMilestoneId(milestone.id);

  setMilestoneForm({
    year: String(milestone.year),
    title: milestone.title,
    description: milestone.description,
    icon: milestone.icon || '',
    sortOrder: String(milestone.sortOrder),
    isPublished: milestone.isPublished,
  });

  setMessage('');
  setError('');
};const handleDeleteMilestone = async (
    milestoneId: string
  ) => {
    if (!organization) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this milestone?'
    );

    if (!confirmed) return;

    try {
      setMilestonesSaving(true);
      setMessage('');
      setError('');

      await fetchApi(
        `/admin/organization/${organization.id}/milestones/${milestoneId}`,
        {
          method: 'DELETE',
        }
      );

      setMessage(
        'Organization milestone deleted successfully.'
      );

      if (editingMilestoneId === milestoneId) {
        resetMilestoneForm();
      }

      await loadMilestones(organization.id);
    } catch (err: any) {
      setError(
        err.message || 'Failed to delete milestone.'
      );
    } finally {
      setMilestonesSaving(false);
    }
  };

const resetLeaderForm = () => {
  setLeaderForm({
    name: '',
    position: '',
    department: '',
    bio: '',
    photoUrl: '',
    email: '',
    websiteUrl: '',
    linkedinUrl: '',
    expertise: '',
    sortOrder: '0',
    isPublished: true,
  });

  setEditingLeaderId(null);
};

const handleLeaderSubmit = async (
  event: React.FormEvent
) => {
  event.preventDefault();

  if (!organization) return;

  if (
    !leaderForm.name.trim() ||
    !leaderForm.position.trim()
  ) {
    setError('Name and position are required.');
    return;
  }

  try {
    setLeadersSaving(true);
    setMessage('');
    setError('');

    const expertiseJson = leaderForm.expertise
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      name: leaderForm.name.trim(),
      position: leaderForm.position.trim(),
      department: leaderForm.department.trim() || null,
      bio: leaderForm.bio.trim() || null,
      photoUrl: leaderForm.photoUrl.trim() || null,
      email: leaderForm.email.trim() || null,
      websiteUrl: leaderForm.websiteUrl.trim() || null,
      linkedinUrl: leaderForm.linkedinUrl.trim() || null,
      expertiseJson,
      sortOrder: Number(leaderForm.sortOrder) || 0,
      isPublished: leaderForm.isPublished,
    };

    if (editingLeaderId) {
      await fetchApi(
        `/admin/organization/${organization.id}/leaders/${editingLeaderId}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        }
      );

      setMessage(
        'Organization leader updated successfully.'
      );
    } else {
      await fetchApi(
        `/admin/organization/${organization.id}/leaders`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      setMessage(
        'Organization leader created successfully.'
      );
    }

    resetLeaderForm();
    await loadLeaders(organization.id);
  } catch (err: any) {
    setError(err.message || 'Failed to save organization leader.');
  } finally {
    setLeadersSaving(false);
  }
};

const handleEditLeader = (
  leader: OrganizationLeader
) => {
  setEditingLeaderId(leader.id);

  setLeaderForm({
    name: leader.name,
    position: leader.position,
    department: leader.department || '',
    bio: leader.bio || '',
    photoUrl: leader.photoUrl || '',
    email: leader.email || '',
    websiteUrl: leader.websiteUrl || '',
    linkedinUrl: leader.linkedinUrl || '',
    expertise: Array.isArray(leader.expertiseJson)
      ? leader.expertiseJson.join(', ')
      : '',
    sortOrder: String(leader.sortOrder),
    isPublished: leader.isPublished,
  });

  setMessage('');
  setError('');
};

const handleDeleteLeader = async (
  leaderId: string
) => {
  if (!organization) return;

  const confirmed = window.confirm(
    'Are you sure you want to delete this organization leader?'
  );

  if (!confirmed) return;

  try {
    setLeadersSaving(true);
    setMessage('');
    setError('');

    await fetchApi(
      `/admin/organization/${organization.id}/leaders/${leaderId}`,
      {
        method: 'DELETE',
      }
    );

    setMessage(
      'Organization leader deleted successfully.'
    );

    if (editingLeaderId === leaderId) {
      resetLeaderForm();
    }

    await loadLeaders(organization.id);
  } catch (err: any) {
    setError(
      err.message || 'Failed to delete organization leader.'
    );
  } finally {
    setLeadersSaving(false);
  }
};

const resetDepartmentForm = () => {
  setDepartmentForm({
    name: '',
    slug: '',
    description: '',
    purpose: '',
    icon: '',
    coverImage: '',
    responsibilities: '',
    sortOrder: '0',
    isActive: true,
  });

  setEditingDepartmentId(null);
};

const handleDepartmentSubmit = async (
  event: React.FormEvent
) => {
  event.preventDefault();

  if (!organization) return;

  if (
    !departmentForm.name.trim() ||
    !departmentForm.slug.trim() ||
    !departmentForm.description.trim()
  ) {
    setError(
      'Name, slug, and description are required.'
    );
    return;
  }

  try {
    setDepartmentsSaving(true);
    setMessage('');
    setError('');

    const responsibilitiesJson =
      departmentForm.responsibilities
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    const payload = {
      name: departmentForm.name.trim(),
      slug: departmentForm.slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-'),
      description: departmentForm.description.trim(),
      purpose: departmentForm.purpose.trim() || null,
      icon: departmentForm.icon.trim() || null,
      coverImage: departmentForm.coverImage.trim() || null,
      responsibilitiesJson,
      sortOrder: Number(departmentForm.sortOrder) || 0,
      isActive: departmentForm.isActive,
    };

    if (editingDepartmentId) {
      await fetchApi(
        `/admin/organization/${organization.id}/departments/${editingDepartmentId}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        }
      );

      setMessage(
        'Organization department updated successfully.'
      );
    } else {
      await fetchApi(
        `/admin/organization/${organization.id}/departments`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      setMessage(
        'Organization department created successfully.'
      );
    }

    resetDepartmentForm();
    await loadDepartments(organization.id);
  } catch (err: any) {
    setError(
      err.message || 'Failed to save organization department.'
    );
  } finally {
    setDepartmentsSaving(false);
  }
};

const handleEditDepartment = (
  department: OrganizationDepartment
) => {
  setEditingDepartmentId(department.id);

  setDepartmentForm({
    name: department.name,
    slug: department.slug,
    description: department.description,
    purpose: department.purpose || '',
    icon: department.icon || '',
    coverImage: department.coverImage || '',
    responsibilities: Array.isArray(
      department.responsibilitiesJson
    )
      ? department.responsibilitiesJson.join(', ')
      : '',
    sortOrder: String(department.sortOrder),
    isActive: department.isActive,
  });

  setMessage('');
  setError('');
};

const handleDeleteDepartment = async (
  departmentId: string
) => {
  if (!organization) return;

  const confirmed = window.confirm(
    'Are you sure you want to delete this organization department?'
  );

  if (!confirmed) return;

  try {
    setDepartmentsSaving(true);
    setMessage('');
    setError('');

    await fetchApi(
      `/admin/organization/${organization.id}/departments/${departmentId}`,
      {
        method: 'DELETE',
      }
    );

    setMessage(
      'Organization department deleted successfully.'
    );

    if (editingDepartmentId === departmentId) {
      resetDepartmentForm();
    }

    await loadDepartments(organization.id);
  } catch (err: any) {
    setError(
      err.message || 'Failed to delete organization department.'
    );
  } finally {
    setDepartmentsSaving(false);
  }
};

const resetPartnerForm = () => {
  setPartnerForm({
    name: '',
    type: '',
    description: '',
    logoUrl: '',
    websiteUrl: '',
    startDate: '',
    endDate: '',
    isActive: true,
    sortOrder: '0',
  });

  setEditingPartnerId(null);
};

const handlePartnerSubmit = async (
  event: React.FormEvent
) => {
  event.preventDefault();

  if (!organization) return;

  if (!partnerForm.name.trim()) {
    setError('Partner name is required.');
    return;
  }

  if (!partnerForm.type.trim()) {
    setError('Partner type is required.');
    return;
  }

  try {
    setPartnersSaving(true);
    setError('');
    setMessage('');

    const payload = {
      name: partnerForm.name.trim(),
      type: partnerForm.type.trim(),
      description: partnerForm.description.trim() || null,
      logoUrl: partnerForm.logoUrl.trim() || null,
      websiteUrl: partnerForm.websiteUrl.trim() || null,
      startDate: partnerForm.startDate || null,
      endDate: partnerForm.endDate || null,
      isActive: partnerForm.isActive,
      sortOrder: Number(partnerForm.sortOrder) || 0,
    };

    if (editingPartnerId) {
      await fetchApi(
        `/admin/organization/${organization.id}/partners/${editingPartnerId}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        }
      );

      setMessage('Organization partner updated successfully.');
    } else {
      await fetchApi(
        `/admin/organization/${organization.id}/partners`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      setMessage('Organization partner added successfully.');
    }

    resetPartnerForm();
    await loadPartners(organization.id);
  } catch (err: any) {
    setError(
      err.message || 'Failed to save organization partner.'
    );
  } finally {
    setPartnersSaving(false);
  }
};

const handleEditPartner = (
  partner: OrganizationPartner
) => {
  setEditingPartnerId(partner.id);

  setPartnerForm({
    name: partner.name || '',
    type: partner.type || '',
    description: partner.description || '',
    logoUrl: partner.logoUrl || '',
    websiteUrl: partner.websiteUrl || '',
    startDate: partner.startDate
      ? partner.startDate.slice(0, 10)
      : '',
    endDate: partner.endDate
      ? partner.endDate.slice(0, 10)
      : '',
    isActive: partner.isActive,
    sortOrder: String(partner.sortOrder ?? 0),
  });

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const handleDeletePartner = async (
  partnerId: string
) => {
  if (!organization) return;

  const confirmed = window.confirm(
    'Are you sure you want to delete this organization partner?'
  );

  if (!confirmed) return;

  try {
    setPartnersSaving(true);
    setError('');
    setMessage('');

    await fetchApi(
      `/admin/organization/${organization.id}/partners/${partnerId}`,
      {
        method: 'DELETE',
      }
    );

    if (editingPartnerId === partnerId) {
      resetPartnerForm();
    }

    setMessage('Organization partner deleted successfully.');

    await loadPartners(organization.id);
  } catch (err: any) {
    setError(
      err.message || 'Failed to delete organization partner.'
    );
  } finally {
    setPartnersSaving(false);
  }
};

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-brand-400 animate-pulse">
        Loading Organization CMS...
      </div>
    );
  }

  if (error && !organization) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-400">
          {error}
        </div>
      </div>
    );
  }

const resetUnitForm = () => {
  setUnitForm({
    parentId: '',
    name: '',
    title: '',
    description: '',
    leaderName: '',
    level: '0',
    sortOrder: '0',
  });

  setEditingUnitId(null);
};

const handleUnitSubmit = async (
  event: React.FormEvent
) => {
  event.preventDefault();

  if (!organization) return;

  if (!unitForm.name.trim()) {
    setError('Unit name is required.');
    return;
  }

  try {
    setUnitsSaving(true);
    setMessage('');
    setError('');

    const payload = {
      parentId: unitForm.parentId || null,
      name: unitForm.name.trim(),
      title: unitForm.title.trim() || null,
      description: unitForm.description.trim() || null,
      leaderName: unitForm.leaderName.trim() || null,
      level: Number(unitForm.level) || 0,
      sortOrder: Number(unitForm.sortOrder) || 0,
    };

    if (editingUnitId) {
      await fetchApi(
        `/admin/organization/${organization.id}/structure/${editingUnitId}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        }
      );

      setMessage(
        'Organization unit updated successfully.'
      );
    } else {
      await fetchApi(
        `/admin/organization/${organization.id}/structure`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      setMessage(
        'Organization unit created successfully.'
      );
    }

    resetUnitForm();
    await loadUnits(organization.id);
  } catch (err: any) {
    setError(
      err.message ||
        'Failed to save organization unit.'
    );
  } finally {
    setUnitsSaving(false);
  }
};

const handleEditUnit = (unit: OrganizationUnit) => {
  setEditingUnitId(unit.id);

  setUnitForm({
    parentId: unit.parentId || '',
    name: unit.name || '',
    title: unit.title || '',
    description: unit.description || '',
    leaderName: unit.leaderName || '',
    level: String(unit.level ?? 0),
    sortOrder: String(unit.sortOrder ?? 0),
  });

  setError('');
  setMessage('');
};

const handleDeleteUnit = async (
  unitId: string
) => {
  if (!organization) return;

  const confirmed = window.confirm(
    'Are you sure you want to delete this organization unit?'
  );

  if (!confirmed) return;

  try {
    setUnitsSaving(true);
    setMessage('');
    setError('');

    await fetchApi(
      `/admin/organization/${organization.id}/structure/${unitId}`,
      {
        method: 'DELETE',
      }
    );

    setMessage(
      'Organization unit deleted successfully.'
    );

    if (editingUnitId === unitId) {
      resetUnitForm();
    }

    await loadUnits(organization.id);
  } catch (err: any) {
    setError(
      err.message ||
        'Failed to delete organization unit.'
    );
  } finally {
    setUnitsSaving(false);
  }
};

const renderOrganizationUnit = (
  unit: OrganizationUnit,
  allUnits: OrganizationUnit[],
  depth = 0
): React.ReactNode => {
  const children = allUnits
    .filter((child) => child.parentId === unit.id)
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder ||
        a.name.localeCompare(b.name)
    );

  return (
    <div key={unit.id}>
      <div
        className="flex items-start justify-between gap-4 rounded-xl border border-slate-200/70 bg-white/60 p-4 dark:border-slate-700/70 dark:bg-slate-900/50"
        style={{
          marginLeft: `${depth * 24}px`,
        }}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">
              {unit.name}
            </h3>

            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
              Level {unit.level}
            </span>
          </div>

          {unit.title && (
            <p className="mt-1 text-sm opacity-70">
              {unit.title}
            </p>
          )}

          {unit.description && (
            <p className="mt-2 text-sm opacity-70">
              {unit.description}
            </p>
          )}

          {unit.leaderName && (
            <p className="mt-2 text-xs opacity-60">
              Leader: {unit.leaderName}
            </p>
          )}
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() =>
              handleEditUnit(unit)
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              handleDeleteUnit(unit.id)
            }
            disabled={unitsSaving}
            className="rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/30"
          >
            Delete
          </button>
        </div>
      </div>

      {children.map((child) =>
        renderOrganizationUnit(
          child,
          allUnits,
          depth + 1
        )
      )}
    </div>
  );
};

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-brand-400" />
            <h2 className="text-2xl font-bold text-white">
              Organization CMS
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Manage the public identity and core information of CADELIBORA.
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-xs font-bold ${
            formData.isPublished
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-amber-500/10 text-amber-400'
          }`}
        >
          {formData.isPublished ? 'PUBLISHED' : 'UNPUBLISHED'}
        </div>
      </div>

      {message && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-5 text-lg font-bold text-white">
            Organization Identity
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Organization Name
              </label>
              <input
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Tagline
              </label>
              <input
                value={formData.tagline}
                onChange={(e) => updateField('tagline', e.target.value)}
                placeholder="Your organization's short identity statement"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm text-slate-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              required
              rows={5}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-500"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-5 text-lg font-bold text-white">
            Vision, Mission & Values
          </h3>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Vision
              </label>
              <textarea
                value={formData.vision}
                onChange={(e) => updateField('vision', e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Mission
              </label>
              <textarea
                value={formData.mission}
                onChange={(e) => updateField('mission', e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Core Values
              </label>
              <textarea
                value={formData.values}
                onChange={(e) => updateField('values', e.target.value)}
                rows={6}
                placeholder="One value per line"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-500"
              />
              <p className="mt-2 text-xs text-slate-500">
                Enter one core value per line.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-5 text-lg font-bold text-white">
            Contact & Online Presence
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                <Globe className="h-4 w-4" />
                Website
              </label>
              <input
                value={formData.websiteUrl}
                onChange={(e) => updateField('websiteUrl', e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="organization@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                <Phone className="h-4 w-4" />
                Phone
              </label>
              <input
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                <MapPin className="h-4 w-4" />
                Address
              </label>
              <input
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                Logo URL
              </label>
              <input
                value={formData.logoUrl}
                onChange={(e) => updateField('logoUrl', e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-5 text-lg font-bold text-white">
            Publication
          </h3>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) =>
                updateField('isPublished', e.target.checked)
              }
              className="h-5 w-5 rounded"
            />

            <span>
              <span className="block font-medium text-white">
                Publish Organization
              </span>
              <span className="text-sm text-slate-400">
                When enabled, the organization information can appear on
                public pages.
              </span>
            </span>
          </label>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-bold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : 'Save Organization'}
          </button>
        </div>
            </form>

            {/* Organization History */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <History className="h-5 w-5 text-brand-400" />
                    <h3 className="text-lg font-bold text-white">
                      Organization History
                    </h3>
                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    Build the chronological story of CADELIBORA.
                  </p>
                </div>

                {editingHistoryId && (
                  <button
                    type="button"
                    onClick={resetHistoryForm}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                  >
                    <X className="h-4 w-4" />
                    Cancel Editing
                  </button>
                )}
              </div>

              {/* History Form */}
              <form
                onSubmit={handleHistorySubmit}
                className="mb-8 rounded-xl border border-slate-800 bg-slate-950/60 p-5"
              >
                <div className="mb-5 flex items-center gap-2">
                  {editingHistoryId ? (
                    <Pencil className="h-4 w-4 text-brand-400" />
                  ) : (
                    <Plus className="h-4 w-4 text-brand-400" />
                  )}

                  <h4 className="font-semibold text-white">
                    {editingHistoryId
                      ? 'Edit History Entry'
                      : 'Add History Entry'}
                  </h4>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">
                      Year
                    </label>

                    <input
                      type="number"
                      value={historyForm.year}
                      onChange={(e) =>
                        setHistoryForm((current) => ({
                          ...current,
                          year: e.target.value,
                        }))
                      }
                      placeholder="2026"
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-300">
                      Display Order
                    </label>

                    <input
                      type="number"
                      value={historyForm.sortOrder}
                      onChange={(e) =>
                        setHistoryForm((current) => ({
                          ...current,
                          sortOrder: e.target.value,
                        }))
                      }
                      min="0"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm text-slate-300">
                    Title
                  </label>

                  <input
                    value={historyForm.title}
                    onChange={(e) =>
                      setHistoryForm((current) => ({
                        ...current,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Organization founded"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-500"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm text-slate-300">
                    Description
                  </label>

                  <textarea
                    value={historyForm.description}
                    onChange={(e) =>
                      setHistoryForm((current) => ({
                        ...current,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe what happened during this stage of the organization's development."
                    rows={5}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-500"
                  />
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="submit"
                    disabled={historySaving}
                    className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-bold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {editingHistoryId ? (
                      <Pencil className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}

                    {historySaving
                      ? 'Saving...'
                      : editingHistoryId
                        ? 'Update History'
                        : 'Add History'}
                  </button>
                </div>
              </form>

              {/* History Entries */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-white">
                    Timeline Entries
                  </h4>

                  <span className="text-xs text-slate-500">
                    {history.length} {history.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>

                {historyLoading ? (
                  <div className="rounded-xl border border-slate-800 p-6 text-center text-sm text-slate-400">
                    Loading history...
                  </div>
                ) : history.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
                    <History className="mx-auto mb-3 h-8 w-8 text-slate-600" />

                    <p className="font-medium text-slate-300">
                      No history entries yet.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Add the first milestone in CADELIBORA's organizational
                      history above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((entry) => (
                      <article
                        key={entry.id}
                        className="rounded-xl border border-slate-800 bg-slate-950/50 p-5"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex gap-4">
                            <div className="flex h-12 min-w-20 items-center justify-center rounded-xl bg-brand-500/10 px-3 text-sm font-bold text-brand-400">
                              {entry.year}
                            </div>

                            <div>
                              <h5 className="font-semibold text-white">
                                {entry.title}
                              </h5>

                              <p className="mt-2 text-sm leading-6 text-slate-400">
                                {entry.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditHistory(entry)}
                              className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteHistory(entry.id)}
                              disabled={historySaving}
                              className="flex items-center gap-2 rounded-lg border border-rose-500/30 px-3 py-2 text-sm text-rose-400 transition hover:bg-rose-500/10 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Organization Milestones
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Manage important achievements and milestones in CADELIBORA's development.
                  </p>
                </div>

                {editingMilestoneId && (
                  <button
                    type="button"
                    onClick={resetMilestoneForm}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <X className="h-4 w-4" />
                    Cancel Editing
                  </button>
                )}
              </div>

              <form
                onSubmit={handleMilestoneSubmit}
                className="grid gap-5 md:grid-cols-2"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Year
                  </label>

                  <input
                    type="number"
                    value={milestoneForm.year}
                    onChange={(e) =>
                      setMilestoneForm((prev) => ({
                        ...prev,
                        year: e.target.value,
                      }))
                    }
                    placeholder="2026"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Display Order
                  </label>

                  <input
                    type="number"
                    value={milestoneForm.sortOrder}
                    onChange={(e) =>
                      setMilestoneForm((prev) => ({
                        ...prev,
                        sortOrder: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Title
                  </label>

                  <input
                    type="text"
                    value={milestoneForm.title}
                    onChange={(e) =>
                      setMilestoneForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="First major platform release"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description
                  </label>

                  <textarea
                    value={milestoneForm.description}
                    onChange={(e) =>
                      setMilestoneForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Describe what happened and why it was important."
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Icon
                  </label>

                  <input
                    type="text"
                    value={milestoneForm.icon}
                    onChange={(e) =>
                      setMilestoneForm((prev) => ({
                        ...prev,
                        icon: e.target.value,
                      }))
                    }
                    placeholder="Award"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex cursor-pointer items-center gap-3 pb-3">
                    <input
                      type="checkbox"
                      checked={milestoneForm.isPublished}
                      onChange={(e) =>
                        setMilestoneForm((prev) => ({
                          ...prev,
                          isPublished: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-slate-300"
                    />

                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Published
                    </span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={milestonesSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-3 font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {editingMilestoneId ? (
                      <Pencil className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}

                    {milestonesSaving
                      ? 'Saving...'
                      : editingMilestoneId
                        ? 'Update Milestone'
                        : 'Add Milestone'}
                  </button>
                </div>
              </form>

              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                  Milestone Entries
                </h3>

                {milestonesLoading ? (
                  <div className="rounded-lg border border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    Loading milestones...
                  </div>
                ) : milestones.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    No milestones have been added yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="rounded-xl border border-slate-200 p-5 dark:border-slate-800"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                                {milestone.year}
                              </span>

                              {milestone.icon && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {milestone.icon}
                                </span>
                              )}

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  milestone.isPublished
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                }`}
                              >
                                {milestone.isPublished
                                  ? 'Published'
                                  : 'Draft'}
                              </span>
                            </div>

                            <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                              {milestone.title}
                            </h4>

                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                              {milestone.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleEditMilestone(milestone)
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteMilestone(milestone.id)
                              }
                              disabled={milestonesSaving}
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Organization Leadership
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Manage the people responsible for leading CADELIBORA.
                  </p>
                </div>

                {editingLeaderId && (
                  <button
                    type="button"
                    onClick={resetLeaderForm}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <X className="h-4 w-4" />
                    Cancel Editing
                  </button>
                )}
              </div>

              <form
                onSubmit={handleLeaderSubmit}
                className="grid gap-5 md:grid-cols-2"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={leaderForm.name}
                    onChange={(e) =>
                      setLeaderForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Leader's full name"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Position
                  </label>

                  <input
                    type="text"
                    value={leaderForm.position}
                    onChange={(e) =>
                      setLeaderForm((prev) => ({
                        ...prev,
                        position: e.target.value,
                      }))
                    }
                    placeholder="e.g. Founder & Director"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Department
                  </label>

                  <input
                    type="text"
                    value={leaderForm.department}
                    onChange={(e) =>
                      setLeaderForm((prev) => ({
                        ...prev,
                        department: e.target.value,
                      }))
                    }
                    placeholder="Department or division"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Display Order
                  </label>

                  <input
                    type="number"
                    value={leaderForm.sortOrder}
                    onChange={(e) =>
                      setLeaderForm((prev) => ({
                        ...prev,
                        sortOrder: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Biography
                  </label>

                  <textarea
                    value={leaderForm.bio}
                    onChange={(e) =>
                      setLeaderForm((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Write a short professional biography."
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Photo URL
                  </label>

                  <input
                    type="url"
                    value={leaderForm.photoUrl}
                    onChange={(e) =>
                      setLeaderForm((prev) => ({
                        ...prev,
                        photoUrl: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                  </label>

                  <input
                    type="email"
                    value={leaderForm.email}
                    onChange={(e) =>
                      setLeaderForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="leader@example.com"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Website URL
                  </label>

                  <input
                    type="url"
                    value={leaderForm.websiteUrl}
                    onChange={(e) =>
                      setLeaderForm((prev) => ({
                        ...prev,
                        websiteUrl: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    LinkedIn URL
                  </label>

                  <input
                    type="url"
                    value={leaderForm.linkedinUrl}
                    onChange={(e) =>
                      setLeaderForm((prev) => ({
                        ...prev,
                        linkedinUrl: e.target.value,
                      }))
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Areas of Expertise
                  </label>

                  <input
                    type="text"
                    value={leaderForm.expertise}
                    onChange={(e) =>
                      setLeaderForm((prev) => ({
                        ...prev,
                        expertise: e.target.value,
                      }))
                    }
                    placeholder="Software Development, AI, Research"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Separate multiple areas with commas.
                  </p>
                </div>

                <div className="flex items-end">
                  <label className="flex cursor-pointer items-center gap-3 pb-3">
                    <input
                      type="checkbox"
                      checked={leaderForm.isPublished}
                      onChange={(e) =>
                        setLeaderForm((prev) => ({
                          ...prev,
                          isPublished: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-slate-300"
                    />

                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Published
                    </span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={leadersSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-3 font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {editingLeaderId ? (
                      <Pencil className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}

                    {leadersSaving
                      ? 'Saving...'
                      : editingLeaderId
                        ? 'Update Leader'
                        : 'Add Leader'}
                  </button>
                </div>
              </form>

              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                  Leadership Entries
                </h3>

                {leadersLoading ? (
                  <div className="rounded-lg border border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    Loading leadership...
                  </div>
                ) : leaders.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    No leadership entries have been added yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leaders.map((leader) => (
                      <div
                        key={leader.id}
                        className="rounded-xl border border-slate-200 p-5 dark:border-slate-800"
                      >
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                          <div className="flex flex-1 gap-4">
                            {leader.photoUrl ? (
                              <img
                                src={leader.photoUrl}
                                alt={leader.name}
                                className="h-16 w-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                {leader.name.charAt(0).toUpperCase()}
                              </div>
                            )}

                            <div className="flex-1">
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                                  {leader.name}
                                </h4>

                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    leader.isPublished
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                  }`}
                                >
                                  {leader.isPublished
                                    ? 'Published'
                                    : 'Draft'}
                                </span>
                              </div>

                              <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
                                {leader.position}
                              </p>

                              {leader.department && (
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                  {leader.department}
                                </p>
                              )}

                              {leader.bio && (
                                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                  {leader.bio}
                                </p>
                              )}

                              {leader.expertiseJson?.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {leader.expertiseJson.map((expertise) => (
                                    <span
                                      key={expertise}
                                      className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
                                    >
                                      {expertise}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditLeader(leader)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteLeader(leader.id)}
                              disabled={leadersSaving}
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Organization Departments
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Define the major functional areas that make up CADELIBORA.
                  </p>
                </div>

                {editingDepartmentId && (
                  <button
                    type="button"
                    onClick={resetDepartmentForm}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <X className="h-4 w-4" />
                    Cancel Editing
                  </button>
                )}
              </div>

              <form
                onSubmit={handleDepartmentSubmit}
                className="grid gap-5 md:grid-cols-2"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Department Name
                  </label>

                  <input
                    type="text"
                    value={departmentForm.name}
                    onChange={(e) =>
                      setDepartmentForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g. Research & Development"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Slug
                  </label>

                  <input
                    type="text"
                    value={departmentForm.slug}
                    onChange={(e) =>
                      setDepartmentForm((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                    placeholder="research-development"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Used for department URLs and identification.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description
                  </label>

                  <textarea
                    value={departmentForm.description}
                    onChange={(e) =>
                      setDepartmentForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Describe the department and what it does."
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Purpose
                  </label>

                  <textarea
                    value={departmentForm.purpose}
                    onChange={(e) =>
                      setDepartmentForm((prev) => ({
                        ...prev,
                        purpose: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Explain the main purpose of this department."
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Icon
                  </label>

                  <input
                    type="text"
                    value={departmentForm.icon}
                    onChange={(e) =>
                      setDepartmentForm((prev) => ({
                        ...prev,
                        icon: e.target.value,
                      }))
                    }
                    placeholder="FlaskConical"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Enter a Lucide icon name.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Display Order
                  </label>

                  <input
                    type="number"
                    value={departmentForm.sortOrder}
                    onChange={(e) =>
                      setDepartmentForm((prev) => ({
                        ...prev,
                        sortOrder: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Cover Image URL
                  </label>

                  <input
                    type="url"
                    value={departmentForm.coverImage}
                    onChange={(e) =>
                      setDepartmentForm((prev) => ({
                        ...prev,
                        coverImage: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Responsibilities
                  </label>

                  <input
                    type="text"
                    value={departmentForm.responsibilities}
                    onChange={(e) =>
                      setDepartmentForm((prev) => ({
                        ...prev,
                        responsibilities: e.target.value,
                      }))
                    }
                    placeholder="Research, Development, Documentation"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Separate responsibilities with commas.
                  </p>
                </div>

                <div className="flex items-end">
                  <label className="flex cursor-pointer items-center gap-3 pb-3">
                    <input
                      type="checkbox"
                      checked={departmentForm.isActive}
                      onChange={(e) =>
                        setDepartmentForm((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-slate-300"
                    />

                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Active
                    </span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={departmentsSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-3 font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {editingDepartmentId ? (
                      <Pencil className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}

                    {departmentsSaving
                      ? 'Saving...'
                      : editingDepartmentId
                        ? 'Update Department'
                        : 'Add Department'}
                  </button>
                </div>
              </form>

              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                  Department Entries
                </h3>

                {departmentsLoading ? (
                  <div className="rounded-lg border border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    Loading departments...
                  </div>
                ) : departments.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    No departments have been added yet.
                  </div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {departments.map((department) => (
                      <div
                        key={department.id}
                        className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"
                      >
                        {department.coverImage && (
                          <img
                            src={department.coverImage}
                            alt={department.name}
                            className="h-40 w-full object-cover"
                          />
                        )}

                        <div className="p-5">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                                {department.name}
                              </h4>

                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                /{department.slug}
                              </p>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                department.isActive
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {department.isActive
                                ? 'Active'
                                : 'Inactive'}
                            </span>
                          </div>

                          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                            {department.description}
                          </p>

                          {department.purpose && (
                            <div className="mt-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Purpose
                              </p>

                              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                {department.purpose}
                              </p>
                            </div>
                          )}

                          {department.responsibilitiesJson?.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {department.responsibilitiesJson.map(
                                (responsibility) => (
                                  <span
                                    key={responsibility}
                                    className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
                                  >
                                    {responsibility}
                                  </span>
                                )
                              )}
                            </div>
                          )}

                          <div className="mt-5 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleEditDepartment(department)
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteDepartment(department.id)
                              }
                              disabled={departmentsSaving}
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  Organization Structure
                </h2>

                <p className="mt-1 text-sm opacity-70">
                  Define departments, units, and sub-units within
                  the organization hierarchy.
                </p>
              </div>

              <form
                onSubmit={handleUnitSubmit}
                className="space-y-5 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/60"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  {/* Parent Unit */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Parent Unit
                    </label>

                    <select
                      value={unitForm.parentId}
                      onChange={(event) =>
                        setUnitForm((previous) => ({
                          ...previous,
                          parentId: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
                    >
                      <option value="">
                        No Parent — Top Level
                      </option>

                      {units.map((unit) => (
                        <option
                          key={unit.id}
                          value={unit.id}
                          disabled={editingUnitId === unit.id}
                        >
                          {'— '.repeat(unit.level)}
                          {unit.name}
                        </option>
                      ))}
                    </select>

                    <p className="mt-1 text-xs opacity-60">
                      Leave empty to create a top-level unit.
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Unit Name *
                    </label>

                    <input
                      type="text"
                      value={unitForm.name}
                      onChange={(event) =>
                        setUnitForm((previous) => ({
                          ...previous,
                          name: event.target.value,
                        }))
                      }
                      placeholder="e.g. Software Development"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Unit Title
                    </label>

                    <input
                      type="text"
                      value={unitForm.title}
                      onChange={(event) =>
                        setUnitForm((previous) => ({
                          ...previous,
                          title: event.target.value,
                        }))
                      }
                      placeholder="e.g. Software Engineering Unit"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>

                  {/* Leader */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Leader
                    </label>

                    <input
                      type="text"
                      value={unitForm.leaderName}
                      onChange={(event) =>
                        setUnitForm((previous) => ({
                          ...previous,
                          leaderName: event.target.value,
                        }))
                      }
                      placeholder="Unit leader"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>

                  {/* Level */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Level
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={unitForm.level}
                      onChange={(event) =>
                        setUnitForm((previous) => ({
                          ...previous,
                          level: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
                    />

                    <p className="mt-1 text-xs opacity-60">
                      Top level = 0. Child units are normally level 1+.
                    </p>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Display Order
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={unitForm.sortOrder}
                      onChange={(event) =>
                        setUnitForm((previous) => ({
                          ...previous,
                          sortOrder: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Description
                  </label>

                  <textarea
                    value={unitForm.description}
                    onChange={(event) =>
                      setUnitForm((previous) => ({
                        ...previous,
                        description: event.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Describe the purpose or role of this unit..."
                    className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={unitsSaving}
                    className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {unitsSaving
                      ? 'Saving...'
                      : editingUnitId
                        ? 'Update Unit'
                        : 'Add Unit'}
                  </button>

                  {editingUnitId && (
                    <button
                      type="button"
                      onClick={resetUnitForm}
                      className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              {/* Current Structure */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    Current Structure
                  </h3>

                  <p className="mt-1 text-sm opacity-70">
                    View the organization hierarchy and manage existing units.
                  </p>
                </div>

                {unitsLoading ? (
                  <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-6 text-sm opacity-70 dark:border-slate-700/70 dark:bg-slate-900/50">
                    Loading organization structure...
                  </div>
                ) : units.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                    <p className="font-medium">
                      No organization units yet.
                    </p>

                    <p className="mt-1 text-sm opacity-60">
                      Add a top-level unit above to start building the structure.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {units
                      .filter((unit) => !unit.parentId)
                      .sort(
                        (a, b) =>
                          a.sortOrder - b.sortOrder ||
                          a.name.localeCompare(b.name)
                      )
                      .map((unit) =>
                        renderOrganizationUnit(unit, units)
                      )}
                  </div>
                )}
              </div>
            </section>
            {/* Organization Partners */}
<section className="mt-8">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-xl font-semibold">
        Organization Partners
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Manage organizations, institutions, companies, and other partners
        associated with CADELIBORA.
      </p>
    </div>

    {editingPartnerId && (
      <button
        type="button"
        onClick={resetPartnerForm}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700"
      >
        <X size={16} />
        Cancel Edit
      </button>
    )}
  </div>

  {/* Partner Form */}
  <form
    onSubmit={handlePartnerSubmit}
    className="space-y-5 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="block text-sm font-medium mb-2">
          Partner Name
        </label>

        <input
          type="text"
          value={partnerForm.name}
          onChange={(e) =>
            setPartnerForm((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          placeholder="Partner organization name"
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Partner Type
        </label>

        <input
          type="text"
          value={partnerForm.type}
          onChange={(e) =>
            setPartnerForm((prev) => ({
              ...prev,
              type: e.target.value,
            }))
          }
          placeholder="e.g. Technology, Academic, Research"
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Description
      </label>

      <textarea
        value={partnerForm.description}
        onChange={(e) =>
          setPartnerForm((prev) => ({
            ...prev,
            description: e.target.value,
          }))
        }
        rows={4}
        placeholder="Describe the partnership or partner..."
        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="block text-sm font-medium mb-2">
          Logo URL
        </label>

        <input
          type="url"
          value={partnerForm.logoUrl}
          onChange={(e) =>
            setPartnerForm((prev) => ({
              ...prev,
              logoUrl: e.target.value,
            }))
          }
          placeholder="https://..."
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Website URL
        </label>

        <input
          type="url"
          value={partnerForm.websiteUrl}
          onChange={(e) =>
            setPartnerForm((prev) => ({
              ...prev,
              websiteUrl: e.target.value,
            }))
          }
          placeholder="https://..."
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div>
        <label className="block text-sm font-medium mb-2">
          Start Date
        </label>

        <input
          type="date"
          value={partnerForm.startDate}
          onChange={(e) =>
            setPartnerForm((prev) => ({
              ...prev,
              startDate: e.target.value,
            }))
          }
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          End Date
        </label>

        <input
          type="date"
          value={partnerForm.endDate}
          onChange={(e) =>
            setPartnerForm((prev) => ({
              ...prev,
              endDate: e.target.value,
            }))
          }
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Sort Order
        </label>

        <input
          type="number"
          value={partnerForm.sortOrder}
          onChange={(e) =>
            setPartnerForm((prev) => ({
              ...prev,
              sortOrder: e.target.value,
            }))
          }
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
        />
      </div>
    </div>

    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={partnerForm.isActive}
        onChange={(e) =>
          setPartnerForm((prev) => ({
            ...prev,
            isActive: e.target.checked,
          }))
        }
        className="w-4 h-4"
      />

      <span className="text-sm">
        Active partnership
      </span>
    </label>

    <div className="flex items-center gap-3">
      <button
        type="submit"
        disabled={partnersSaving}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {editingPartnerId ? (
          <Pencil size={16} />
        ) : (
          <Plus size={16} />
        )}

        {partnersSaving
          ? 'Saving...'
          : editingPartnerId
            ? 'Update Partner'
            : 'Add Partner'}
      </button>

      {editingPartnerId && (
        <button
          type="button"
          onClick={resetPartnerForm}
          className="px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-700"
        >
          Cancel
        </button>
      )}
    </div>
  </form>

  {/* Partner Entries */}
  <div className="mt-8">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">
        Partner Entries
      </h3>

      <span className="text-sm text-slate-500 dark:text-slate-400">
        {partners.length} partner{partners.length === 1 ? '' : 's'}
      </span>
    </div>

    {partnersLoading ? (
      <div className="p-6 text-sm text-slate-500 dark:text-slate-400">
        Loading partners...
      </div>
    ) : partners.length === 0 ? (
      <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
        <Building2
          size={32}
          className="mx-auto mb-3 opacity-50"
        />

        <p className="font-medium">
          No organization partners yet.
        </p>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Add the first partner using the form above.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {partner.logoUrl ? (
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="w-12 h-12 rounded-lg object-contain border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <Building2 size={22} />
                  </div>
                )}

                <div>
                  <h4 className="font-semibold">
                    {partner.name}
                  </h4>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {partner.type}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs px-2.5 py-1 rounded-full ${
                  partner.isActive
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {partner.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {partner.description && (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                {partner.description}
              </p>
            )}

            {(partner.startDate || partner.endDate) && (
              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                {partner.startDate &&
                  `From ${partner.startDate.slice(0, 10)}`}

                {partner.startDate && partner.endDate && ' • '}

                {partner.endDate &&
                  `Until ${partner.endDate.slice(0, 10)}`}
              </div>
            )}

            {partner.websiteUrl && (
              <a
                href={partner.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-sm underline"
              >
                Visit website
              </a>
            )}

            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleEditPartner(partner)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700"
              >
                <Pencil size={15} />
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDeletePartner(partner.id)}
                disabled={partnersSaving}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-300 text-red-600 dark:border-red-800 disabled:opacity-50"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>

          </div>
  );
};

export default AdminOrganizationView;
