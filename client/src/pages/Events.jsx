import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Calendar, MapPin, Tag, Users, Trash2 } from 'lucide-react';

const Events = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('tech');

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', { title, description, date, type });
      setTitle(''); setDescription(''); setDate(''); setType('tech');
      setIsFormOpen(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getTypeStyle = (type) => {
    const types = {
      tech: 'bg-blue-100 text-blue-700',
      cultural: 'bg-pink-100 text-pink-700',
      sports: 'bg-orange-100 text-orange-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return types[type] || types.other;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-lg">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Campus Events</h1>
          <p className="text-indigo-100 max-w-lg">Discover and manage what's happening around campus. Stay culturally and technically engaged.</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'staff') && (
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-white text-indigo-600 hover:bg-indigo-50 px-5 py-3 rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Host Event
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Event</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white px-4 py-2 border focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="E.g., Hackathon 2024" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white px-4 py-2 border focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="tech">Technical</option>
                <option value="cultural">Cultural</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
              <input type="datetime-local" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white px-4 py-2 border focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea required rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white px-4 py-2 border focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Details about the event..." />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100">Cancel</button>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl">Publish Event</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
            No events coming up soon.
          </div>
        ) : (
          events.map(event => (
            <div key={event._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${getTypeStyle(event.type)}`}>
                    {event.type}
                  </span>
                  <div className="flex gap-2 items-start">
                    {user?.role === 'admin' && (
                      <button 
                        onClick={() => handleDeleteEvent(event._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <div className="bg-gray-50 text-gray-700 p-2 rounded-lg text-center min-w-[3.5rem] border border-gray-100 shadow-inner">
                      <p className="text-xs font-bold uppercase text-red-500">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                      <p className="text-xl font-black">{new Date(event.date).getDate()}</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm flex-1 mb-5 line-clamp-3">{event.description}</p>
                
                <div className="mt-auto space-y-2 pt-4 border-t border-gray-50">
                  <p className="text-sm text-gray-500 flex items-center gap-2 font-medium">
                    <Calendar className="w-4 h-4 text-indigo-400" /> 
                    {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2 font-medium">
                    <Users className="w-4 h-4 text-indigo-400" />
                    Open to all students
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
