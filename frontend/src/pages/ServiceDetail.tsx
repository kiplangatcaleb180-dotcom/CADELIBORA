import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Cpu, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';

export const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchApi<{ services: any[] }>('/services');
        const found = (res.services || []).find((s: any) => s.id === id);
        if (found) setService(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleRequestService = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setRequesting(true);
    try {
      await fetchApi(`/services/${id}/order`, { method: 'POST' });
      alert('Service requested successfully! View it in your orders dashboard.');
      navigate('/dashboard/orders');
    } catch (err: any) {
      alert(err.message || 'Service request failed');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-mono text-brand-400">Loading Service...</div>;
  if (!service) return <div className="p-20 text-center text-rose-400 font-mono">Service not found.</div>;

  let features: string[] = [];
  try {
    features = JSON.parse(service.featuresJson || '[]');
  } catch (e) {
    features = [];
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button onClick={() => navigate('/services')} className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Services Catalog</span>
      </button>

      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
          <Cpu className="w-6 h-6" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white">{service.name}</h1>
        <p className="text-slate-300 text-base leading-relaxed">{service.fullDesc}</p>

        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-400">Included Features & Deliverables</h3>
          {features.map((f, idx) => (
            <div key={idx} className="flex items-center gap-2 font-mono text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{f}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-800">
          <Button variant="primary" isLoading={requesting} onClick={handleRequestService}>
            Request Professional Service
          </Button>
        </div>
      </div>
    </div>
  );
};
