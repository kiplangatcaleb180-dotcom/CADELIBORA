import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Key, Save } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    alert('Password updated successfully!');
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
      <div className="text-center space-y-2">
        <Key className="w-10 h-10 text-brand-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Enter New Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        <input
          type="password"
          placeholder="New Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
        />
        <button type="submit" className="w-full p-3 bg-brand-600 rounded-xl font-bold text-white flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          <span>Update Password</span>
        </button>
      </form>
    </div>
  );
};
