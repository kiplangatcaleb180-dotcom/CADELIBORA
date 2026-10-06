import React, { useState } from 'react';
import { Flag } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export const ReportContentButton: React.FC<{ targetType: 'POST' | 'COMMENT' | 'USER'; targetId: string; onReported?: () => void }> = ({ targetType, targetId, onReported }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('Harassment or bullying');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    try {
      await fetchApi('/moderation/reports', { method: 'POST', body: JSON.stringify({ targetType, targetId, reason, description }) });
      setOpen(false);
      setDescription('');
      alert('Your report was sent to the moderation team.');
      onReported?.();
    } catch (error: any) {
      alert(error.message || 'Could not submit your report.');
    } finally {
      setSending(false);
    }
  };

  return <>
    <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-amber-400/10 hover:text-amber-300" aria-label="Report content"><Flag className="h-3.5 w-3.5" /> Report</button>
    {open && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4">
      <form onSubmit={submit} className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div><h2 className="text-lg font-bold text-white">Report {targetType.toLowerCase()}</h2><p className="mt-1 text-xs text-slate-400">Reports are visible to the moderation team.</p></div>
        <label className="block space-y-2 text-xs font-semibold text-slate-300">Reason<select value={reason} onChange={event => setReason(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white">
          {['Harassment or bullying', 'Hate or discrimination', 'Spam or scam', 'Threats or violence', 'Sexual content', 'Sharing private information', 'Other'].map(value => <option key={value}>{value}</option>)}
        </select></label>
        <label className="block space-y-2 text-xs font-semibold text-slate-300">Details (optional)<textarea maxLength={2000} value={description} onChange={event => setDescription(event.target.value)} className="h-28 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white" placeholder="Tell the moderators what happened." /></label>
        <div className="flex justify-end gap-2"><button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300">Cancel</button><button disabled={sending} className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50">{sending ? 'Sending…' : 'Send report'}</button></div>
      </form>
    </div>}
  </>;
};
