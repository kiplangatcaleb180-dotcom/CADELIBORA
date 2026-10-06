import React, { useState } from 'react';
import { User as UserIcon, Save, ImagePlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from '../../components/ui';
import { fetchApi } from '../../lib/api';

export const DashboardProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [title, setTitle] = useState(user?.title || '');
  const [company, setCompany] = useState(user?.profile?.company || '');
  const [location, setLocation] = useState(user?.profile?.location || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [imageError, setImageError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      await fetchApi('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ fullName, title, company, location, bio, avatarUrl }),
      });
      await refreshUser();
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file?: File) => {
    setImageError('');
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setImageError('Choose a PNG, JPG, or WebP image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Your profile image must be 2 MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setAvatarUrl(reader.result);
    };
    reader.onerror = () => setImageError('Could not read that image file.');
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <section className="w-full space-y-8 max-w-4xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-400 font-bold uppercase mb-1">
            <UserIcon className="w-4 h-4" />
            <span>Account Management</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Profile & Professional Info</h1>
        </div>

        <Card className="space-y-6">
          <CardHeader>
            <CardTitle>Personal Metadata</CardTitle>
            <CardDescription>Manage your public professional identity across CADELIBORA.</CardDescription>
          </CardHeader>
          <CardContent>
            {success && <p className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl mb-4 font-mono">{success}</p>}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950">
                  {avatarUrl ? <img src={avatarUrl} alt="Profile preview" className="h-full w-full object-cover" /> : <ImagePlus className="h-7 w-7 text-slate-400" />}
                </div>
                <div className="min-w-[220px] flex-1">
                  <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">Profile photo</label>
                  <input className="mt-2 block w-full text-xs text-slate-600 dark:text-slate-300 file:mr-3 file:rounded-xl file:border-0 file:bg-brand-600 file:px-3 file:py-2 file:font-semibold file:text-white file:cursor-pointer hover:file:bg-brand-500" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => handleImageChange(e.target.files?.[0])} />
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">PNG, JPG, or WebP · up to 2 MB</p>
                  {imageError && <p role="alert" className="mt-2 text-xs text-rose-500">{imageError}</p>}
                </div>
              </div>
              <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              <Input label="Title / Designation" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior AI Research Fellow" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Company / Organization" value={company} onChange={(e) => setCompany(e.target.value)} />
                <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  rows={4}
                />
              </div>
              <Button type="submit" isLoading={loading}>
                <Save className="w-4 h-4 mr-2" /> Save Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
