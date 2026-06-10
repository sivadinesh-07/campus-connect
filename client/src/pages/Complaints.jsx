import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { PlusCircle, MessageSquare, Clock, CheckCircle, Loader, ChevronDown } from 'lucide-react';

const STATUS_CONFIG = {
  'pending':     { label: 'Pending',     color: 'bg-amber-100 text-amber-700',   bar: 'bg-amber-400',   icon: Clock },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700',     bar: 'bg-blue-500',    icon: Loader },
  'solved':      { label: 'Solved',      color: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500', icon: CheckCircle },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['pending'];
  const Icon = cfg.icon;
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon size={12} /> {cfg.label}
    </span>
  );
};

const Complaints = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null); // complaint id being updated

  // Admin inline edit state
  const [editStatus, setEditStatus] = useState({});
  const [editResponse, setEditResponse] = useState({});

  const fetchComplaints = async () => {
    try {
      const endpoint = user?.role === 'admin' ? '/complaints' : '/complaints/my';
      const { data } = await api.get(endpoint);
      setComplaints(data);
      // Seed edit state from fetched data
      const statuses = {};
      const responses = {};
      data.forEach(c => {
        statuses[c._id] = c.status;
        responses[c._id] = c.response || '';
      });
      setEditStatus(statuses);
      setEditResponse(responses);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { if (user) fetchComplaints(); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/complaints', { title, description });
      setTitle(''); setDescription('');
      fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    setUpdating(id);
    try {
      const { data } = await api.put(`/complaints/${id}`, {
        status: editStatus[id],
        response: editResponse[id],
      });
      setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: data.status, response: data.response } : c));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Complaints &amp; Issues</h1>
        <p className="text-gray-500 mt-1">
          {user?.role === 'admin' ? 'Review, update status, and respond to all complaints.' : 'Report issues or track the status of your complaints.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Form — only non-admin users */}
        {user?.role !== 'admin' && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PlusCircle className="text-indigo-600 w-5 h-5" /> Raise a Complaint
              </h2>
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="e.g. Wi-Fi not working in Library" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Describe the issue in detail..." />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-900 to-blue-800 hover:from-indigo-800 hover:to-blue-700 text-white font-bold py-3 rounded-2xl transition-all shadow-sm disabled:opacity-50">
                  {loading ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* List */}
        <div className={user?.role === 'admin' ? 'lg:col-span-3' : 'lg:col-span-2'}>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {user?.role === 'admin' ? `All Complaints (${complaints.length})` : 'Your Complaints'}
          </h2>

          {complaints.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No complaints found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map(complaint => {
                const cfg = STATUS_CONFIG[complaint.status] || STATUS_CONFIG['pending'];
                return (
                  <div key={complaint._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Status bar */}
                    <div className={`h-1 w-full ${cfg.bar}`} />

                    <div className="p-6">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{complaint.title}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">{complaint.description}</p>
                        </div>
                        <StatusBadge status={complaint.status} />
                      </div>

                      <div className="text-xs text-gray-400 mb-4">
                        Raised on {new Date(complaint.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        {user?.role === 'admin' && complaint.raisedBy && (
                          <span className="ml-2 font-semibold text-gray-600">• {complaint.raisedBy.name} ({complaint.raisedBy.email})</span>
                        )}
                      </div>

                      {/* Official response (visible to all) */}
                      {complaint.response && user?.role !== 'admin' && (
                        <div className="mt-2 p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-xl">
                          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">Official Response</p>
                          <p className="text-sm text-gray-700">{complaint.response}</p>
                        </div>
                      )}

                      {/* Admin controls */}
                      {user?.role === 'admin' && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                          <div className="flex gap-3 flex-wrap">
                            <div className="flex-1 min-w-[140px]">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Update Status</label>
                              <div className="relative">
                                <select
                                  value={editStatus[complaint._id] || complaint.status}
                                  onChange={e => setEditStatus(prev => ({ ...prev, [complaint._id]: e.target.value }))}
                                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none pr-8"
                                >
                                  <option value="pending">⏳ Pending</option>
                                  <option value="in-progress">🔄 In Progress</option>
                                  <option value="solved">✅ Solved</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                              </div>
                            </div>
                            <div className="flex-[2] min-w-[200px]">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Admin Response</label>
                              <input
                                type="text"
                                value={editResponse[complaint._id] ?? complaint.response}
                                onChange={e => setEditResponse(prev => ({ ...prev, [complaint._id]: e.target.value }))}
                                placeholder="Enter your response to the complainant..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                onClick={() => handleUpdate(complaint._id)}
                                disabled={updating === complaint._id}
                                className="px-5 py-2 bg-gradient-to-r from-indigo-900 to-blue-800 hover:from-indigo-800 hover:to-blue-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
                              >
                                {updating === complaint._id ? 'Saving...' : 'Save'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Complaints;
