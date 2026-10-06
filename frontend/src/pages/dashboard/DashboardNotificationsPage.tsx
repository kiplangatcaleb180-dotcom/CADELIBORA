import React, { useEffect, useState } from 'react';
import { Bell, Check, CheckCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, EmptyState } from '../../components/ui';
import { fetchApi } from '../../lib/api';

export const DashboardNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const res = await fetchApi<{ notifications: any[] }>('/notifications');
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await fetchApi(`/notifications/${id}/read`, { method: 'PUT' });
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetchApi('/notifications/read-all', { method: 'PUT' });
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      <section className="w-full space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-brand-400 font-bold uppercase mb-1">
              <Bell className="w-4 h-4" />
              <span>Activity Center</span>
            </div>
            <h1 className="text-3xl font-black text-white">Notifications & Alerts</h1>
          </div>
          {notifications.some((n) => !n.isRead) && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <CheckCheck className="w-4 h-4 mr-1.5" /> Mark All as Read
            </Button>
          )}
        </div>

        {loading ? (
          <p className="text-brand-400 font-mono text-sm animate-pulse">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No notifications"
            description="You are all caught up! New academy and research alerts will appear here."
          />
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border flex items-center justify-between glass-panel ${
                  n.isRead ? 'border-slate-800 text-slate-400' : 'border-brand-500/50 text-white font-bold bg-brand-500/10'
                }`}
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-brand-400">{n.title}</p>
                  <p className="text-xs text-slate-300">{n.message}</p>
                  <span className="text-[10px] font-mono text-slate-500 block">{new Date(n.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-3">
                  {n.link && (
                    <Button variant="outline" size="sm">
                      <Link to={n.link} onClick={() => handleMarkRead(n.id)} className="inline-flex items-center">
                        View <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </Button>
                  )}
                  {!n.isRead && (
                    <Button variant="primary" size="sm" onClick={() => handleMarkRead(n.id)}>
                      <Check className="w-4 h-4 mr-1" /> Read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
