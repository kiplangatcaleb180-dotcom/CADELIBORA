import React, { useEffect, useState } from 'react';
import { MessageSquare, Send, User, ArrowRight } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, EmptyState } from '../../components/ui';
import { fetchApi } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';

export const DashboardMessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadConversations = async () => {
    try {
      const res = await fetchApi<{ conversations: any[] }>('/messages/conversations');
      setConversations(res.conversations || []);
      if (res.conversations?.length > 0 && !activeConvId) {
        setActiveConvId(res.conversations[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const res = await fetchApi<{ messages: any[] }>(`/messages/conversations/${convId}/messages`);
      setMessages(res.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const recipientId = searchParams.get('recipientId');
    if (!recipientId || recipientId === user?.id) return;
    fetchApi<{ conversationId: string }>('/messages/conversations', {
      method: 'POST',
      body: JSON.stringify({ recipientId }),
    }).then(({ conversationId }) => {
      setActiveConvId(conversationId);
      loadConversations();
    }).catch((err: any) => alert(err.message || 'Could not start a conversation with this user.'));
  }, [searchParams, user?.id]);

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
    }
  }, [activeConvId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvId) return;

    try {
      await fetchApi(`/messages/conversations/${activeConvId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: newMessage }),
      });
      setNewMessage('');
      loadMessages(activeConvId);
      loadConversations();
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const otherParticipant = activeConv?.participants?.find((p: any) => p.userId !== user?.id)?.user;

  return (
    <div className="w-full">
      <main className="flex-1 p-8 flex flex-col max-w-7xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-brand-400 font-bold uppercase mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Direct Communication</span>
          </div>
          <h1 className="text-3xl font-black text-white">Fellow Messages & Conversations</h1>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 rounded-3xl glass-panel border border-slate-800 overflow-hidden min-h-[500px]">
          {/* Conversation List */}
          <div className="border-r border-slate-800 bg-slate-950/60 p-4 space-y-2 overflow-y-auto">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 px-2 pb-2">Conversations</h3>
            {conversations.length === 0 ? (
              <p className="text-xs text-slate-500 px-2">No active conversations yet.</p>
            ) : (
              conversations.map((conv) => {
                const participant = conv.participants?.find((p: any) => p.userId !== user?.id)?.user;
                const lastMsg = conv.messages?.[0]?.content || 'No messages yet';
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                      activeConvId === conv.id
                        ? 'bg-brand-600 border-brand-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                      {(participant?.fullName || 'Fellow Member').slice(0, 1).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold truncate">{participant?.fullName || 'Fellow Member'}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{lastMsg}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Active Chat Window */}
          <div className="md:col-span-2 flex flex-col justify-between p-6 bg-slate-950/30">
            {activeConvId && otherParticipant ? (
              <>
                <div className="pb-4 border-b border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                    {(otherParticipant.fullName || 'Fellow Member').slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{otherParticipant.fullName}</h3>
                    <span className="text-[10px] font-mono text-brand-400 uppercase">{otherParticipant.role}</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4 space-y-4 my-2">
                  {messages.map((m) => {
                    const isMe = m.senderId === user?.id;
                    return (
                      <div key={m.id} className={`flex gap-3 text-xs sm:text-sm ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && (
                          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300 mt-1">
                            {(m.sender?.fullName || 'Fellow Member').slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <div className={`p-3.5 rounded-2xl max-w-md ${isMe ? 'bg-brand-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-200'}`}>
                          <p>{m.content}</p>
                          <span className="text-[9px] font-mono text-slate-400 mt-1 block text-right">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Type a direct message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                  <Button type="submit" variant="primary" size="sm">
                    <Send className="w-4 h-4 mr-1.5" /> Send
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs font-mono">
                Select a conversation to start messaging.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
