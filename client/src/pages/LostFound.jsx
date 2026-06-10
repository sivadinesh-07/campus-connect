import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Search, MapPin, Tag, Plus, Check, Image as ImageIcon, X, Trash2 } from 'lucide-react';

const LostFound = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/lost-found');
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      await api.post('/lost-found', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setTitle('');
      setDescription('');
      setImage(null);
      setImagePreview(null);
      setIsFormOpen(false);
      fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkFound = async (id, location) => {
    try {
      await api.put(`/lost-found/${id}/found`, { foundLocation: location });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await api.delete(`/lost-found/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // The image path from server is stored as 'uploads\filename' or 'uploads/filename'
    // We need to point to http://localhost:5000/uploads/filename
    return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Lost & Found</h1>
          <p className="text-gray-500 mt-1">Help others find what they lost, or report an item you found.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-indigo-500/25 flex items-center gap-2"
        >
          {isFormOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isFormOpen ? 'Close Form' : 'Report Lost Item'}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-3xl p-8 border border-indigo-100 shadow-xl shadow-indigo-500/5 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Report Item Details</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                  <input
                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-2xl border-gray-200 bg-gray-50 focus:bg-white px-5 py-3 border focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="E.g., Blue Water Bottle, Math Textbook"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description & When Lost</label>
                  <textarea
                    required rows="4" value={description} onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-2xl border-gray-200 bg-gray-50 focus:bg-white px-5 py-3 border focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Mention key details like color, brand, or where you think you lost it."
                  />
                </div>
             </div>

             <div className="space-y-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Item Image</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label 
                    htmlFor="image-upload"
                    className={`w-full aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                      imagePreview 
                        ? 'border-indigo-400 bg-indigo-50' 
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-[22px]" />
                    ) : (
                      <div className="text-center p-6">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 font-medium">Click to upload image</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (Max 5MB)</p>
                      </div>
                    )}
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => { setImage(null); setImagePreview(null); }}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg hover:bg-rose-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
             </div>

            <div className="lg:col-span-3 flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-3 rounded-2xl text-gray-600 hover:bg-gray-100 font-bold transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
            {/* Image Section */}
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              {item.image ? (
                <img 
                  src={getImageUrl(item.image)} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                  <ImageIcon size={48} strokeWidth={1} />
                  <span className="text-xs font-medium mt-2">No Image Provided</span>
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                 <span className={`px-4 py-1.5 text-xs font-bold rounded-full backdrop-blur-md shadow-sm flex items-center gap-2 ${
                  item.status === 'found' ? 'bg-emerald-100/90 text-emerald-800' : 'bg-rose-100/90 text-rose-800'
                }`}>
                  {item.status === 'found' ? <Check className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
                  {item.status.toUpperCase()}
                </span>
                {(user?.role === 'admin' || (item.reportedBy && item.reportedBy._id === user?._id) || (item.reportedBy === user?._id)) && (
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 bg-white/90 hover:bg-rose-500 hover:text-white text-rose-500 rounded-full backdrop-blur-md shadow-sm transition-all duration-200"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-7 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg uppercase tracking-wider">{new Date(item.createdAt).toLocaleDateString()}</span>
                {item.reportedBy && (
                   <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase truncate max-w-[120px]">Reported by: {item.reportedBy.name}</span>
                )}
              </div>
              
              <h3 className="text-xl font-extrabold text-gray-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">{item.description}</p>
              
              {item.status === 'found' ? (
                <div className="mt-auto bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                  <p className="text-[10px] text-emerald-600 flex items-center gap-1.5 font-black uppercase tracking-widest mb-1.5"><MapPin className="w-3 h-3" /> Found Location:</p>
                  <p className="text-sm font-bold text-emerald-900">{item.foundLocation || "Front Desk / Admin Office"}</p>
                </div>
              ) : (
                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-4">
                  <p className="text-xs text-gray-400 flex items-center gap-2 font-medium italic">
                    <Tag className="w-4 h-4" /> Help reunite this item!
                  </p>
                  <button 
                    onClick={() => {
                        const loc = window.prompt("Where did you find this item or where is it kept now?");
                        if(loc) handleMarkFound(item._id, loc);
                    }}
                    className="w-full bg-white border-2 border-indigo-100 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white text-indigo-600 font-bold py-3 rounded-2xl text-sm transition-all shadow-sm hover:shadow-emerald-200"
                  >
                    I Found This Item
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
         <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No items reported yet</h3>
            <p className="text-gray-500 mt-2">All lost and found items will appear here.</p>
         </div>
      )}
    </div>
  );
};

export default LostFound;
