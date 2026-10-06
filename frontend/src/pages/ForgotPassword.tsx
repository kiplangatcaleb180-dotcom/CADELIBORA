import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Key, Send } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
      <div className="text-center space-y-2">
        <Key className="w-10 h-10 text-brand-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Reset CADELIBORA Password</h2>
        <p className="text-xs text-slate-400 font-mono">Enter your registered email to receive a password reset token.</p>
      </div>

      {sent ? (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-400 text-center">
          Reset instructions sent to {email}. Please check your inbox.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <input
            type="email"
            placeholder="User Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
          />
          <button type="submit" className="w-full p-3 bg-brand-600 rounded-xl font-bold text-white flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Send Reset Instructions</span>
          </button>
        </form>
      )}

      <div className="text-center text-xs font-mono text-slate-400">
        <Link to="/login" className="text-brand-400 hover:underline">Back to Login</Link>
      </div>
    </div>
  );
};
