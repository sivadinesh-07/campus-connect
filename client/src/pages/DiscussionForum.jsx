import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
  MessageCircle, ThumbsUp, ThumbsDown, Send, Plus, X, ChevronDown, ChevronUp, Tag, Trash2
} from 'lucide-react';

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

const RoleBadge = ({ role }) => {
  const colors = {
    admin: 'bg-purple-100 text-purple-700',
    staff: 'bg-blue-100 text-blue-700',
    student: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${colors[role] || 'bg-gray-100 text-gray-600'}`}>
      {role}
    </span>
  );
};

const VoteBar = ({ likes = [], dislikes = [], userId, onVote }) => {
  const liked = likes.map(String).includes(userId);
  const disliked = dislikes.map(String).includes(userId);
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onVote('like')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          liked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600'
        }`}
      >
        <ThumbsUp size={14} /> {likes.length}
      </button>
      <button
        onClick={() => onVote('dislike')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          disliked ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600'
        }`}
      >
        <ThumbsDown size={14} /> {dislikes.length}
      </button>
    </div>
  );
};

const DiscussionForum = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [newPost, setNewPost] = useState({ title: '', body: '', tags: '' });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/forum');
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const tags = newPost.tags.split(',').map(t => t.trim()).filter(Boolean);
      const { data } = await api.post('/forum', { ...newPost, tags });
      setPosts([data, ...posts]);
      setNewPost({ title: '', body: '', tags: '' });
      setShowForm(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (postId) => {
    const body = replyText[postId]?.trim();
    if (!body) return;
    try {
      const { data } = await api.post(`/forum/${postId}/replies`, { body });
      setPosts(posts.map(p => p._id === postId ? data : p));
      setReplyText(prev => ({ ...prev, [postId]: '' }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleVotePost = async (postId, type) => {
    try {
      const { data } = await api.put(`/forum/${postId}/vote`, { type });
      setPosts(posts.map(p => p._id === postId ? data : p));
    } catch (e) {
      console.error(e);
    }
  };

  const handleVoteReply = async (postId, replyId, type) => {
    try {
      const { data } = await api.put(`/forum/${postId}/replies/${replyId}/vote`, { type });
      setPosts(posts.map(p => p._id === postId ? data : p));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post and all its replies?')) return;
    try {
      await api.delete(`/forum/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (e) { console.error(e); }
  };

  const handleDeleteReply = async (postId, replyId) => {
    try {
      const { data } = await api.delete(`/forum/${postId}/replies/${replyId}`);
      setPosts(posts.map(p => p._id === postId ? data : p));
    } catch (e) { console.error(e); }
  };

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.body.toLowerCase().includes(search.toLowerCase()) ||
    p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Discussion Forum</h2>
          <p className="text-gray-500">Ask questions, share knowledge, and help each other.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-900 to-blue-800 text-white font-bold rounded-2xl hover:from-indigo-800 hover:to-blue-700 shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-200"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {/* Create Post Form */}
      {showForm && (
        <form onSubmit={handleCreatePost} className="bg-white border border-gray-100 rounded-3xl p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Create a New Post</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
              <input
                type="text"
                value={newPost.title}
                onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="What's your question or topic?"
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea
                value={newPost.body}
                onChange={e => setNewPost({ ...newPost, body: e.target.value })}
                placeholder="Describe your question in detail..."
                rows={4}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 transition-all resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags <span className="text-gray-400 font-normal">(comma-separated)</span></label>
              <input
                type="text"
                value={newPost.tags}
                onChange={e => setNewPost({ ...newPost, tags: e.target.value })}
                placeholder="e.g. exams, library, hostel"
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-900 to-blue-800 text-white font-bold rounded-2xl hover:from-indigo-800 hover:to-blue-700 shadow-sm transition-all duration-200 disabled:opacity-60"
            >
              <Send size={16} />
              {submitting ? 'Posting...' : 'Post Question'}
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts by title, content, or tag..."
          className="w-full px-5 py-3 rounded-2xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 shadow-sm transition-all"
        />
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
          <p>Loading discussions...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-semibold text-gray-600 mb-1">No posts yet</p>
          <p className="text-sm">Be the first to start a discussion!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredPosts.map(post => {
            const isExpanded = expandedPost === post._id;
            return (
              <div key={post._id} className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
                {/* Post Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{post.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{post.body}</p>
                    </div>
                    {user?.role === 'admin' && (
                      <button onClick={() => handleDeletePost(post._id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0" title="Delete post">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Tags */}
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 font-semibold px-3 py-1 rounded-full">
                          <Tag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                        {post.author?.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{post.author?.name}</span>
                      <RoleBadge role={post.author?.role} />
                      <span className="text-xs text-gray-400">{formatTime(post.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <VoteBar
                        likes={post.likes}
                        dislikes={post.dislikes}
                        userId={user._id}
                        onVote={(type) => handleVotePost(post._id, type)}
                      />
                      <button
                        onClick={() => setExpandedPost(isExpanded ? null : post._id)}
                        className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <MessageCircle size={16} />
                        {post.replies?.length || 0} {post.replies?.length === 1 ? 'Reply' : 'Replies'}
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Replies Section */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/50 rounded-b-3xl px-6 py-5 space-y-4">
                    {post.replies?.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-2">No replies yet. Be the first to answer!</p>
                    )}
                    {post.replies?.map(reply => (
                      <div key={reply._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">{reply.body}</p>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                              {reply.author?.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-xs font-semibold text-gray-600">{reply.author?.name}</span>
                            <RoleBadge role={reply.author?.role} />
                            <span className="text-xs text-gray-400">{formatTime(reply.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <VoteBar
                              likes={reply.likes}
                              dislikes={reply.dislikes}
                              userId={user._id}
                              onVote={(type) => handleVoteReply(post._id, reply._id, type)}
                            />
                            {user?.role === 'admin' && (
                              <button onClick={() => handleDeleteReply(post._id, reply._id)}
                                className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete reply">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Reply Input */}
                    <div className="flex gap-3 pt-2">
                      <input
                        type="text"
                        value={replyText[post._id] || ''}
                        onChange={e => setReplyText(prev => ({ ...prev, [post._id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleReply(post._id)}
                        placeholder="Write a reply... (Enter to submit)"
                        className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-gray-900 placeholder-gray-400 transition-all"
                      />
                      <button
                        onClick={() => handleReply(post._id)}
                        className="px-4 py-2.5 bg-gradient-to-r from-indigo-900 to-blue-800 text-white rounded-2xl hover:from-indigo-800 hover:to-blue-700 transition-all duration-200 shadow-sm"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DiscussionForum;
