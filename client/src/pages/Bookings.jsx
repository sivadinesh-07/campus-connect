import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Calendar as CalendarIcon, Clock, Package, Building2, Plus, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [resourceName, setResourceName] = useState('');
  const [type, setType] = useState('classroom');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  const fetchBookings = async () => {
    try {
      const endpoint = user?.role === 'admin' ? '/bookings' : '/bookings/my';
      const { data } = await api.get(endpoint);
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/bookings', { resourceName, type, date, timeSlot });
      setResourceName('');
      setDate('');
      setTimeSlot('');
      setIsFormOpen(false);
      fetchBookings();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking permanently?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Approved</span>;
      case 'rejected': return <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><XCircle className="w-3 h-3"/> Rejected</span>;
      default: return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><Clock className="w-3 h-3"/> Pending</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Resource Bookings</h1>
          <p className="text-gray-500 mt-1">Book classrooms or equipment for your events and assignments.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Booking
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Request a Resource</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={type} onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white px-4 py-2 border focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="classroom">Classroom</option>
                <option value="resource">Equipment / Resource</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
              <input
                type="text" required value={resourceName} onChange={(e) => setResourceName(e.target.value)}
                placeholder="E.g., Room 402, Projector"
                className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white px-4 py-2 border focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white px-4 py-2 border focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
              <input
                type="text" required value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="E.g., 10:00 AM - 12:00 PM"
                className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white px-4 py-2 border focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition-colors">Submit Request</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm tracking-wide">
                <th className="font-semibold p-4">Resource</th>
                <th className="font-semibold p-4">Date & Time</th>
                <th className="font-semibold p-4">Status</th>
                {user?.role === 'admin' && <th className="font-semibold p-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 4 : 3} className="p-8 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${booking.type === 'classroom' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                          {booking.type === 'classroom' ? <Building2 className="w-5 h-5"/> : <Package className="w-5 h-5"/>}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{booking.resourceName}</p>
                          {user?.role === 'admin' && booking.requestedBy && (
                            <p className="text-xs text-gray-500 mt-0.5">By: {booking.requestedBy.name}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-sm text-gray-700">
                        <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4 text-gray-400"/> {new Date(booking.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400"/> {booking.timeSlot}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    {user?.role === 'admin' && (
                      <td className="p-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(booking._id, 'approved')} className="text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Approve</button>
                              <button onClick={() => updateStatus(booking._id, 'rejected')} className="text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Reject</button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
