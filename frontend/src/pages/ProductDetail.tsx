import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Box, Rocket, ExternalLink, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchApi<{ product: any }>(`/projects/products/${id}`);
        setProduct(res.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setOrdering(true);
    try {
      await fetchApi(`/services/products/${id}/order`, { method: 'POST' });
      alert('Product ordered/purchased successfully! View it in your orders dashboard.');
      navigate('/dashboard/orders');
    } catch (err: any) {
      alert(err.message || 'Order failed');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-mono text-brand-400">Loading Product...</div>;
  if (!product) return <div className="p-20 text-center text-rose-400 font-mono">Product not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products Catalog</span>
      </button>

      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="blue">{product.category}</Badge>
          <span className="font-mono text-xs text-emerald-400 font-bold">v{product.version} ({product.status})</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white">{product.title}</h1>
        <p className="text-sm font-mono text-cyber-accent">{product.tagline}</p>
        <p className="text-slate-300 text-base leading-relaxed">{product.description}</p>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
          <Button variant="primary" isLoading={ordering} onClick={handleOrder}>
            <Rocket className="w-4 h-4 mr-2" /> Purchase / Request Access
          </Button>
          {product.demoUrl && (
            <Button variant="outline">
              <a href={product.demoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center">
                <ExternalLink className="w-4 h-4 mr-2" /> Launch Demo
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
