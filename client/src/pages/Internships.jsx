import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Briefcase, ExternalLink, Building, Clock, Trash2 } from 'lucide-react';

const Internships = () => {
  const { user } = useContext(AuthContext);
  const [internships, setInternships] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [applyLink, setApplyLink] = useState('');

  const fetchInternships = async () => {
    try {
      const { data } = await api.get('/internships');
      setInternships(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/internships', { title, company, description, applyLink });
      setTitle(''); setCompany(''); setDescription(''); setApplyLink('');
      setIsFormOpen(false);
      fetchInternships();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInternship = async (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        await api.delete(`/internships/${id}`);
        fetchInternships();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Internship Board</h1>
          </div>
          <p className="text-gray-500">Find your next big opportunity or share one with the campus network.</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'staff') && (
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Post Opportunity
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Post an Internship</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white px-4 py-2 border focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="E.g., Software Engineering Intern" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white px-4 py-2 border focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="E.g., Google" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Apply Link (URL)</label>
              <input type="url" required value={applyLink} onChange={(e) => setApplyLink(e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white px-4 py-2 border focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://careers.google.com/..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea required rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white px-4 py-2 border focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="What are the requirements and responsibilities?" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100">Cancel</button>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl">Post Job</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-gray-50 rounded-3xl border border-gray-100 border-dashed flex flex-col items-center justify-center">
            <Briefcase className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">No Internships Right Now</h3>
            <p className="text-gray-500 mt-2">Check back later for exciting opportunities!</p>
          </div>
        ) : (
          internships.map(job => (
            <div key={job._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h3>
                  <p className="text-indigo-600 font-semibold flex items-center gap-1.5 mt-1 text-sm">
                    <Building className="w-4 h-4" /> {job.company}
                  </p>
                </div>
                {user?.role === 'admin' && (
                  <button 
                    onClick={() => handleDeleteInternship(job._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    title="Delete Internship"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <p className="text-gray-600 text-sm flex-1 mb-6 line-clamp-4">{job.description}</p>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                </p>
                <a
                  href={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
                >
                  Apply <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Internships;
