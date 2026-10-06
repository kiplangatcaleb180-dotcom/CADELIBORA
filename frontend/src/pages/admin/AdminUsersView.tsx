import React, { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api';
import { DataTable, Column } from '../../components/admin/DataTable';
import { Shield, User, Trash2, Edit, UserPlus } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import { useAuth } from '../../contexts/AuthContext';

export const AdminUsersView: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'USER' });
  const availableRoles = user?.role === 'SUPER_ADMIN'
    ? ['SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR', 'RESEARCHER', 'DEVELOPER', 'MODERATOR', 'STUDENT', 'PARTNER', 'USER']
    : ['INSTRUCTOR', 'RESEARCHER', 'DEVELOPER', 'MODERATOR', 'STUDENT', 'PARTNER', 'USER'];

  const loadUsers = async () => {
    try {
      const res = await fetchApi<{ users: any[] }>('/admin/users');
      setUsers(res.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreating(true);
    try {
      await fetchApi('/admin/users', { method: 'POST', body: JSON.stringify(form) });
      setForm({ fullName: '', email: '', password: '', role: 'USER' });
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async (user: any) => {
    const fullName = prompt('Full name', user.fullName);
    if (fullName === null) return;
    const email = prompt('Email address', user.email);
    if (email === null) return;
    const title = prompt('Title (leave blank to clear)', user.title || '');
    if (title === null) return;
    try {
      await fetchApi(`/admin/users/${user.id}`, { method: 'PATCH', body: JSON.stringify({ fullName, email, title }) });
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update user');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await fetchApi(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleUpdateStatus = async (userId: string, accountStatus: string) => {
    try {
      await fetchApi(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ accountStatus }),
      });
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update account status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetchApi(`/admin/users/${userId}`, { method: 'DELETE' });
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleDeleteBulk = async (ids: string[]) => {
    if (!confirm(`Delete ${ids.length} selected users?`)) return;
    for (const id of ids) {
      try {
        await fetchApi(`/admin/users/${id}`, { method: 'DELETE' });
      } catch (e) {
        console.error(e);
      }
    }
    loadUsers();
  };

  const columns: Column<any>[] = [
    {
      key: 'fullName',
      header: 'Full Name',
      render: (u) => (
        <div className="flex items-center gap-2">
          <Avatar
            name={u.fullName}
            src={u.avatarUrl}
            className="w-7 h-7 rounded-lg ring-1 ring-slate-700"
          />
          <span className="font-bold text-white">{u.fullName}</span>
        </div>
      ),
    },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role & Permissions',
      render: (u) => (
        <select
          value={u.role}
          disabled={(['ADMIN', 'SUPER_ADMIN'].includes(u.role) && user?.role !== 'SUPER_ADMIN') || u.id === user?.id}
          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
          className="bg-slate-950 border border-slate-800 text-brand-400 font-mono text-xs p-1.5 rounded-lg disabled:opacity-50"
        >
          {[...new Set([u.role, ...availableRoles])].map((r) => (
          <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined Date',
      render: (u) => new Date(u.createdAt).toLocaleDateString(),
    },
    {
      key: 'accountStatus',
      header: 'Account Status',
      render: (u) => <select disabled={(['ADMIN', 'SUPER_ADMIN'].includes(u.role) && user?.role !== 'SUPER_ADMIN') || u.id === user?.id} value={u.accountStatus || 'ACTIVE'} onChange={(e) => handleUpdateStatus(u.id, e.target.value)} className="bg-slate-950 border border-slate-800 text-brand-400 font-mono text-xs p-1.5 rounded-lg disabled:opacity-50">
        {['ACTIVE', 'SUSPENDED'].map(status => <option key={status} value={status}>{status}</option>)}
      </select>,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (u) => (
        <div className="flex items-center">
        <button
          onClick={() => handleEdit(u)}
          disabled={(['ADMIN', 'SUPER_ADMIN'].includes(u.role) && user?.role !== 'SUPER_ADMIN') || u.id === user?.id}
          className="p-1.5 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-lg disabled:opacity-40"
          title="Edit User"
        ><Edit className="w-4 h-4" /></button>
        <button disabled={(['ADMIN', 'SUPER_ADMIN'].includes(u.role) && user?.role !== 'SUPER_ADMIN') || u.id === user?.id} onClick={() => handleDeleteUser(u.id)} className="ml-2 p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg disabled:opacity-40" title="Delete User">
          <Trash2 className="w-4 h-4" />
        </button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="p-12 text-center font-mono text-brand-400 animate-pulse">Loading User Records...</div>;

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="p-5 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><UserPlus className="w-5 h-5 text-brand-400" /> Create any platform user</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          <input required placeholder="Full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" />
          <input required type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" />
          <input required minLength={8} type="password" placeholder="Temporary password (8+ chars)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-brand-400">
            {availableRoles.map(role => <option key={role}>{role}</option>)}
          </select>
          <button disabled={creating} className="rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-60 px-4 py-2 text-white font-bold">{creating ? 'Creating…' : 'Create account'}</button>
        </div>
        <p className="text-xs text-slate-400">Accounts created here are active and verified. Passwords are securely hashed before storage.</p>
      </form>
      <DataTable
        title="Users & RBAC Roles"
        data={users}
        columns={columns}
        searchKey="fullName"
        onDeleteSelected={handleDeleteBulk}
      />
    </div>
  );
};
