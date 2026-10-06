import React, { useState, useEffect, useRef } from 'react';
import { fetchApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Cpu, Send, Bot, User, Sparkles, Terminal, RefreshCw, MessageSquare, Plus, Trash2, Copy, Check } from 'lucide-react';

export const AI: React.FC = () => {
  const { user } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: 'assistant',
      content: "Welcome to CADELIBORA Neural AI Hub. I am ANR-X, connected to CADELIBORA's indexed knowledge across its technologies, research, innovations, and academy content. How can I assist your engineering or research work today?",
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages, loading]);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      const res = await fetchApi<{ success: boolean; conversations: any[] }>('/ai/conversations');
      if (res.success && res.conversations) {
        setConversations(res.conversations);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    }
  };

  const selectConversation = async (conv: any) => {
    if (!conv?.id || loading) return;

    try {
      setActiveConversationId(conv.id);

      const res = await fetchApi<{
        success: boolean;
        conversation: {
          id: string;
          messages?: Array<{ role: string; content: string }>;
        };
      }>(`/ai/conversations/${conv.id}`);

      if (res.success && res.conversation) {
        const loadedMessages = res.conversation.messages || [];

        setMessages(
          loadedMessages.length > 0
            ? loadedMessages.map((m) => ({
                role: m.role,
                content: m.content,
              }))
            : [
                {
                  role: 'assistant',
                  content: 'This conversation does not contain any messages yet.',
                },
              ]
        );
      }
    } catch (err) {
      console.error('Failed to load conversation', err);
      setMessages([
        {
          role: 'assistant',
          content: '[AI Engine Notice]: Could not load this conversation.',
        },
      ]);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    if (loading) return;

    const confirmed = window.confirm(
      'Delete this AI conversation? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      await fetchApi<{ success: boolean }>(
        `/ai/conversations/${conversationId}`,
        {
          method: 'DELETE',
        }
      );

      setConversations((prev) =>
        prev.filter((conversation) => conversation.id !== conversationId)
      );

      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setMessages([
          {
            role: 'assistant',
            content: 'Conversation deleted. Start a new chat whenever you are ready.',
          },
        ]);
        setInputPrompt('');
      }
    } catch (err) {
      console.error('Failed to delete conversation', err);
      window.alert('Could not delete this conversation. Please try again.');
    }
  };

  const startNewChat = () => {
    if (loading) return;

    setActiveConversationId(null);
    setInputPrompt('');
    setMessages([
      {
        role: 'assistant',
        content: 'Started a new chat with CADELIBORA ANR-X. Ask a question to begin.',
      },
    ]);
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);

      window.setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || loading) return;

    const userText = inputPrompt.trim();

    if (userText.length > 8000) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '[AI Engine Notice]: Your message is too long. Please keep it under 8,000 characters.',
        },
      ]);
      return;
    }

    setInputPrompt('');
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setLoading(true);

    try {
      const res = await fetchApi<{ success: boolean; conversationId: string; response: string }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt: userText, conversationId: activeConversationId }),
      });

      if (res.success) {
        if (res.conversationId && !activeConversationId) {
          setActiveConversationId(res.conversationId);
        }
        setMessages((prev) => [...prev, { role: 'assistant', content: res.response }]);
        if (user) loadConversations();
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '[AI Engine Notice]: The AI service could not process your request.',
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `[AI Engine Notice]: Could not reach backend AI service (${err.message}).` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono rounded-full font-semibold">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>CADELIBORA AI Ecosystem v2.5</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Interactive AI Laboratory</h1>
        <p className="text-slate-300 text-sm sm:text-base">
          Interact with CADELIBORA ANR-X Neural Reasoner, test prompt templates, and explore private agentic workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Model Spec Sidebar */}
        <div className="space-y-6">
          {user && (
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-400" />
                  <span>Saved AI History</span>
                </h3>
                <button
                  onClick={startNewChat}
                  className="p-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  title="New Chat"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              </div>

              <div className="space-y-2 max-h-44 overflow-y-auto font-mono text-xs">
                {conversations.length === 0 ? (
                  <div className="p-3 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-slate-500 text-center">
                    No saved conversations yet.
                  </div>
                ) : (
                  conversations.map((c) => (
                    <div
                      key={c.id}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                        activeConversationId === c.id
                          ? 'bg-brand-500/20 border-brand-500'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <button
                        onClick={() => selectConversation(c)}
                        disabled={loading}
                        className={`flex-1 min-w-0 text-left p-1.5 truncate transition-all ${
                          activeConversationId === c.id
                            ? 'text-white font-bold'
                            : 'text-slate-300 hover:text-white'
                        }`}
                        title={c.title}
                      >
                        {c.title}
                      </button>

                      <button
                        onClick={() => deleteConversation(c.id)}
                        disabled={loading}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-40 transition-all shrink-0"
                        title="Delete conversation"
                        aria-label={`Delete conversation: ${c.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-400" />
              <span>Model Architecture</span>
            </h3>
            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Model Name:</span>
                <span className="text-brand-400 font-bold">ANR-X Reasoner</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Context Window:</span>
                <span className="text-slate-200">128,000 Tokens</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Safety Guardrails:</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-400">Sample Prompts</h4>
            {[
              'Explain zero-trust identity token architecture',
              'Summarize CADELIBORA neuro-symbolic research',
              'Write TypeScript REST API route with Zod validation',
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => setInputPrompt(p)}
                className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 hover:text-white border border-slate-800 transition-all font-mono"
              >
                "{p}"
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel border border-slate-800 flex flex-col h-[600px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              ANR-X Chat Console
            </span>
            <span className="text-emerald-400">ONLINE</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 my-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs sm:text-sm ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl max-w-xl leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-brand-600 text-white font-medium'
                      : 'bg-slate-950/90 text-slate-200 border border-slate-800 font-mono whitespace-pre-wrap'
                  }`}
                >
                  {m.role === 'assistant' ? (
                    <div className="max-w-none space-y-2 [&_p]:my-2 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-bold [&_strong]:text-white [&_a]:text-brand-400 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_code]:rounded [&_code]:bg-slate-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-brand-300 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-slate-800 [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-xs">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          pre({ children }) {
                            let code = '';

                            if (React.isValidElement(children)) {
                              const child = children.props as {
                                children?: React.ReactNode;
                              };

                              if (typeof child.children === 'string') {
                                code = child.children;
                              }
                            }

                            return (
                              <div className="my-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                                <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                                    Code
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => copyCode(code)}
                                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-mono text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                                  >
                                    {copiedCode === code ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span>Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>Copy</span>
                                      </>
                                    )}
                                  </button>
                                </div>

                                <div className="overflow-x-auto p-4">
                                  <pre className="m-0 bg-transparent p-0">
                                    {children}
                                  </pre>
                                </div>
                              </div>
                            );
                          },
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs font-mono text-brand-400 animate-pulse pl-11">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing response...</span>
              </div>
            )}

            <div ref={messagesEndRef} aria-hidden="true" />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              placeholder="Ask ANR-X AI about software architecture, research, or code..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-brand-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
