import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Cpu, Lock, Mail, User, ArrowRight } from 'lucide-react';

export const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await register(fullName, email, password, role);

      if (result.requiresEmailVerification) {
        navigate(`/verify-email?email=${encodeURIComponent(result.email)}`);
        return;
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mx-auto">
          <Cpu className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Join CADELIBORA</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">Create your account to access Academy & Research tools</p>
      </div>

      {error && <p className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl font-mono">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Full Name</label>
          <div className="flex items-center px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
            <User className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-transparent w-full text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Email Address</label>
          <div className="flex items-center px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
            <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent w-full text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Password</label>
          <div className="flex items-center px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
            <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent w-full text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Primary Ecosystem Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <option value="STUDENT">Student / Academy Fellow</option>
            <option value="DEVELOPER">Software Developer</option>
            <option value="RESEARCHER">Researcher / Scientist</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
        >
          <span>{loading ? 'Creating Account...' : 'Register'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="text-center text-xs text-slate-600 dark:text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:underline font-bold">
          Sign In
        </Link>
      </p>
    </div>
  );
};
