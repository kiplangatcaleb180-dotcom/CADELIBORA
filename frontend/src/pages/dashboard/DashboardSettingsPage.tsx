import React, { useState } from 'react';
import { Settings, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from '../../components/ui';
import { fetchApi } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

export const DashboardSettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      await fetchApi('/auth/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <section className="w-full space-y-8 max-w-4xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-400 font-bold uppercase mb-1">
            <Settings className="w-4 h-4" />
            <span>Workspace Security</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Account Settings & Security</h1>
        </div>

        <Card className="space-y-6">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Secure your CADELIBORA account with a strong password.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl mb-4 font-mono">{error}</p>}
            {success && <p className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl mb-4 font-mono">{success}</p>}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <Input type="password" label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              <Input type="password" label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              <Input type="password" label="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <Button type="submit" isLoading={loading}>
                <Lock className="w-4 h-4 mr-2" /> Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-rose-500/30 space-y-4">
          <CardHeader>
            <CardTitle className="text-rose-400">Session Actions</CardTitle>
            <CardDescription>Sign out of your active workspace session.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
