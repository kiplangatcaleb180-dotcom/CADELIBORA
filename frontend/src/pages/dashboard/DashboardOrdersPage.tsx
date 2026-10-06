import React, { useEffect, useState } from 'react';
import { ShoppingBag, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, EmptyState } from '../../components/ui';
import { fetchApi } from '../../lib/api';

export const DashboardOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetchApi<{ orders: any[] }>('/services/orders/me');
        setOrders(res.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="w-full">
      <section className="w-full space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-400 font-bold uppercase mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Marketplace Workspace</span>
          </div>
          <h1 className="text-3xl font-black text-white">My Purchases & Service Orders</h1>
        </div>

        {loading ? (
          <p className="text-brand-400 font-mono text-sm animate-pulse">Loading orders...</p>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders or service requests yet"
            description="Explore CADELIBORA Products and Professional Services to make purchases or requests."
            actionLabel="Explore Marketplace"
            onAction={() => window.location.href = '/products'}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const item = o.product || o.service;
              const name = item?.title || item?.name || 'Marketplace Item';
              return (
                <div key={o.id} className="p-6 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="emerald">{o.status}</Badge>
                      <span className="text-xs font-mono text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{name}</h3>
                    <p className="text-xs font-mono text-brand-400">Amount Paid: ${o.amount} {o.currency}</p>
                  </div>

                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{o.product ? 'Product License' : 'Service Request'}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
