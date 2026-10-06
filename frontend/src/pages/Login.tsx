import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Cpu, Lock, Mail, User, ArrowRight, Shield } from 'lucide-react';

export const Login: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(identifier, password, isAdmin);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (admin: boolean) => {
    setIsAdmin(admin);
    setIdentifier('');
    setPassword('');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6">

      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mx-auto">
          {isAdmin ? (
            <Shield className="w-6 h-6" />
          ) : (
            <Cpu className="w-6 h-6" />
          )}
        </div>

        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          {isAdmin ? 'Admin Sign In' : 'Sign In to CADELIBORA'}
        </h1>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          {isAdmin
            ? 'Access the CADELIBORA Administration Portal'
            : 'Access your Fellow Dashboard, Academy, and AI Studio'}
        </p>
      </div>

      {/* Login mode selector */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
        <button
          type="button"
          onClick={() => switchMode(false)}
          className={`py-2 rounded-lg text-xs font-bold transition ${
            !isAdmin
              ? 'bg-brand-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          User Login
        </button>

        <button
          type="button"
          onClick={() => switchMode(true)}
          className={`py-2 rounded-lg text-xs font-bold transition ${
            isAdmin
              ? 'bg-brand-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Admin Login
        </button>
      </div>

      {error && (
        <p className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl font-mono">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Identifier */}
        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-700 dark:text-slate-300">
            {isAdmin ? 'Admin Username' : 'Email Address'}
          </label>

          <div className="flex items-center px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
            {isAdmin ? (
              <User className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2" />
            ) : (
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2" />
            )}

            <input
              type={isAdmin ? 'text' : 'email'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={isAdmin ? 'CADELIBORA or CADE_ADMIN' : 'you@example.com'}
              autoComplete={isAdmin ? 'username' : 'email'}
              required
              className="bg-transparent w-full text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-700 dark:text-slate-300">
            Password
          </label>

          <div className="flex items-center px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
            <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2" />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="bg-transparent w-full text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-50"
        >
          <span>
            {loading
              ? 'Authenticating...'
              : isAdmin
                ? 'Sign In as Administrator'
                : 'Sign In'}
          </span>

          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {!isAdmin && (
        <p className="text-center text-xs text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-brand-600 dark:text-brand-400 hover:underline font-bold"
          >
            Register Here
          </Link>
        </p>
      )}

      {isAdmin && (
        <p className="text-center text-[10px] text-slate-500 font-mono">
          Authorized administrators only
        </p>
      )}
    </div>
  );
};
