import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, ThumbsUp, Plus, Search, ArrowRight, User } from 'lucide-react';
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, EmptyState } from '../components/ui';
import Avatar from '../components/ui/Avatar';
import { ReportContentButton } from '../components/community/ReportContentButton';

export const Community: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postCategory, setPostCategory] = useState('General');
  const { user } = useAuth();

  const loadPosts = async () => {
    setLoading(true);
    try {
      let query = `/community/posts?`;
      if (category) query += `category=${encodeURIComponent(category)}`;
      const res = await fetchApi<{ posts: any[] }>(query);
      setPosts(res.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [category]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      await fetchApi('/community/posts', {
        method: 'POST',
        body: JSON.stringify({ title, content, category: postCategory }),
      });
      setTitle('');
      setContent('');
      setShowCreateModal(false);
      loadPosts();
    } catch (err: any) {
      alert(err.message || 'Failed to create discussion');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">Collaboration Hub</h1>
          <h2 className="text-3xl sm:text-4xl font-black text-white">CADELIBORA Community Discussions</h2>
          <p className="text-slate-400 text-sm mt-1">Discuss research, share software engineering insights, and collaborate with fellows.</p>
        </div>
        {user && (
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> Start Discussion
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 text-xs font-mono overflow-x-auto pb-2">
        {['', 'General', 'Artificial Intelligence', 'Software Engineering', 'Research'].map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              category === cat ? 'bg-brand-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            {cat || 'All Topics'}
          </button>
        ))}
      </div>

      {/* Feed */}
      {loading ? (
        <p className="text-center py-12 text-brand-400 font-mono text-sm animate-pulse">Loading discussions...</p>
      ) : posts.length === 0 ? (
        <EmptyState title="No discussions found" description="Be the first to start a conversation in the CADELIBORA community." />
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <Badge variant="blue">{post.category}</Badge>
                  <span className="text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="text-xl font-bold text-white hover:text-brand-400 transition-colors">
                  <Link to={`/community/posts/${post.id}`}>{post.title}</Link>
                </h3>

                <p className="text-sm text-slate-300 line-clamp-2">{post.content}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <Avatar name={post.author?.fullName} src={post.author?.avatarUrl} className="w-6 h-6 rounded-md" />
                  <span>{post.author?.fullName}</span>
                  {user && post.authorId !== user.id && <ReportContentButton targetType="USER" targetId={post.authorId} />}
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-brand-400">
                    <ThumbsUp className="w-3.5 h-3.5" /> {post.likesCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> {post.comments?.length || 0}
                  </span>
                  <Button variant="outline" size="sm">
                    <Link to={`/community/posts/${post.id}`} className="inline-flex items-center">
                      Read <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                  {user && post.authorId !== user.id && <ReportContentButton targetType="POST" targetId={post.id} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Start New Community Discussion</h3>
            <form onSubmit={handleCreatePost} className="space-y-3">
              <input
                type="text"
                placeholder="Discussion Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                required
              />
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value="General">General</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Research">Research</option>
              </select>
              <textarea
                placeholder="Write your discussion content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white h-32"
                required
              />
              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="primary" className="flex-1">Publish Discussion</Button>
                <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
