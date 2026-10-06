import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, ThumbsUp, ArrowLeft, Send, Trash2 } from 'lucide-react';
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';
import Avatar from '../components/ui/Avatar';
import { ReportContentButton } from '../components/community/ReportContentButton';

export const CommunityPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadPost = async () => {
    try {
      const res = await fetchApi<{ post: any }>(`/community/posts/${id}`);
      if (res.post) setPost(res.post);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  const handleLike = async () => {
    try {
      await fetchApi(`/community/posts/${id}/like`, { method: 'POST' });
      loadPost();
    } catch (err) {
      alert('Failed to like post');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || submitting) return;
    setSubmitting(true);
    try {
      await fetchApi(`/community/posts/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: commentContent }),
      });
      setCommentContent('');
      loadPost();
    } catch (err: any) {
      alert(err.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this discussion?')) return;
    try {
      await fetchApi(`/community/posts/${id}`, { method: 'DELETE' });
      navigate('/community');
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
    }
  };

  if (loading) return <div className="p-20 text-center font-mono text-brand-400">Loading Discussion...</div>;
  if (!post) return <div className="p-20 text-center text-rose-400 font-mono">Discussion not found.</div>;

  const isAuthor = user && (user.id === post.authorId || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Community Feed</span>
      </button>

      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="blue">{post.category}</Badge>
          {isAuthor && (
            <button onClick={handleDeletePost} className="p-2 text-rose-400 hover:text-rose-300 rounded-lg bg-rose-500/10 border border-rose-500/30" title="Delete post">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <h1 className="text-3xl font-black text-white">{post.title}</h1>

        <div className="flex items-center gap-3">
          <Avatar name={post.author?.fullName} src={post.author?.avatarUrl} className="w-9 h-9 rounded-xl" />
          <div>
            <p className="text-xs font-bold text-slate-200">{post.author?.fullName}</p>
            <p className="text-[10px] font-mono text-brand-400 uppercase">{post.author?.role} • {new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
          {user && post.authorId !== user.id && <ReportContentButton targetType="USER" targetId={post.authorId} />}
        </div>

        <p className="text-slate-300 text-base leading-relaxed font-sans whitespace-pre-wrap">{post.content}</p>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
          <Button variant="outline" size="sm" onClick={handleLike}>
            <ThumbsUp className="w-4 h-4 mr-1.5" /> Like ({post.likesCount || 0})
          </Button>
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" /> {post.comments?.length || 0} Comments
          </span>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white">Discussion Comments</h3>

        {user ? (
          <form onSubmit={handleAddComment} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <textarea
              placeholder="Share your technical insight or response..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white h-24 focus:outline-none"
              required
            />
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              <Send className="w-4 h-4 mr-2" /> Post Comment
            </Button>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
            Please <a href="/login" className="text-brand-400 font-bold underline">sign in</a> to participate in this discussion.
          </div>
        )}

        <div className="space-y-4">
          {post.comments?.map((c: any) => (
            <div key={c.id} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <Avatar name={c.author?.fullName} src={c.author?.avatarUrl} className="w-7 h-7 rounded-lg" />
                <span className="text-xs font-bold text-slate-200">{c.author?.fullName}</span>
                <span className="text-[10px] font-mono text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-slate-300 pl-9">{c.content}</p>
              {user && c.authorId !== user.id && <div className="pl-8"><ReportContentButton targetType="COMMENT" targetId={c.id} /></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
