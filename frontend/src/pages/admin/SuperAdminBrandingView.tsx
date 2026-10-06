import React, { useEffect, useState } from 'react';
import { ImagePlus, Save, ShieldCheck } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export const SuperAdminBrandingView: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => { fetchApi<{ logo: string | null }>('/branding').then((r) => setLogo(r.logo)).catch((e: unknown) => setMessage(e instanceof Error ? e.message : 'Unable to load the platform logo.')).finally(() => setLoading(false)); }, []);

  const choose = (file?: File) => {
    setMessage(''); setSelected(null);
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { setMessage('Choose a PNG, JPEG, or WebP image.'); return; }
    if (file.size > 2 * 1024 * 1024) { setMessage('The image must be 2 MB or smaller.'); return; }
    const reader = new FileReader();
    reader.onload = () => setSelected(typeof reader.result === 'string' ? reader.result : null);
    reader.onerror = () => setMessage('Could not read that image file.');
    reader.readAsDataURL(file);
  };
  const save = async () => {
    if (!selected) return;
    setSaving(true); setMessage('');
    try { const result = await fetchApi<{ logo: string }>('/branding/logo', { method: 'PUT', body: JSON.stringify({ logo: selected }) }); setLogo(result.logo); setSelected(null); setMessage('Platform logo updated.'); window.dispatchEvent(new Event('platform-branding-updated')); }
    catch (e) { setMessage(e instanceof Error ? e.message : 'Unable to save the logo.'); }
    finally { setSaving(false); }
  };

  return <div className="max-w-3xl space-y-6">
    <section className="rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-950/50 to-slate-950 p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Platform appearance</p><h2 className="mt-2 text-3xl font-black text-white">Platform Logo & Icon</h2><p className="mt-2 text-sm text-slate-400">Upload the image shown in the site navigation. The saved image is shared across the platform and is also used as the browser tab icon.</p></section>
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="font-bold text-white">Current logo</h3>
      <div className="mt-4 flex min-h-28 items-center gap-5 rounded-xl border border-slate-800 bg-slate-950 p-5"><div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-slate-900">{(selected || logo) ? <img src={selected || logo || ''} alt="Platform logo preview" className="h-full w-full object-contain"/> : <ImagePlus className="h-7 w-7 text-slate-500"/>}</div><div><p className="text-sm font-semibold text-slate-200">{loading ? 'Loading current logo…' : selected ? 'New logo preview' : logo ? 'Current platform logo' : 'Default platform icon'}</p><p className="mt-1 text-xs text-slate-500">PNG, JPEG, or WebP · up to 2 MB</p></div></div>
      <label className="mt-5 block text-sm font-semibold text-slate-300">Choose a logo file<input className="mt-2 block w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-300 file:px-4 file:py-2 file:font-bold file:text-slate-950" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => choose(e.target.files?.[0])}/></label>
      {message && <p role="status" className="mt-4 text-sm text-slate-300">{message}</p>}
      <button onClick={save} disabled={!selected || saving} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"><Save className="h-4 w-4"/>{saving ? 'Saving…' : 'Save platform logo'}</button>
    </section>
    <p className="flex items-center gap-2 text-xs text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-400"/>Only Super Admin can change the platform branding.</p>
  </div>;
};
