import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Mail, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');

    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      await verifyEmail(email.trim(), code);

      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Email verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mx-auto">
          <Mail className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-black text-white">
          Verify Your Email
        </h1>

        <p className="text-xs text-slate-400">
          We sent a 6-digit verification code to your email address.
        </p>
      </div>

      {error && (
        <p className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl font-mono">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-300">
            Email Address
          </label>

          <div className="flex items-center px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <Mail className="w-4 h-4 text-slate-500 mr-2" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent w-full text-slate-100 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-300">
            Verification Code
          </label>

          <div className="flex items-center px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <Shield className="w-4 h-4 text-slate-500 mr-2" />

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              required
              maxLength={6}
              className="bg-transparent w-full text-slate-100 focus:outline-none tracking-[0.4em] font-mono"
              placeholder="000000"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
        >
          <span>
            {loading ? 'Verifying...' : 'Verify Email'}
          </span>

          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <div className="text-center space-y-3">
        <p className="text-xs text-slate-500">
          Already verified your email?
        </p>

        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-brand-400 hover:underline text-xs font-bold font-mono"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};
