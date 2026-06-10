import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(name, email, password, role);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 to-blue-900 relative overflow-hidden items-center justify-center p-16">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-overlay filter blur-[120px] opacity-40"></div>
        <div className="relative z-10 text-white text-center">
          <div className="flex justify-center mb-8">
            <div className="p-5 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
              <BookOpen size={52} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">Join Campus<br />Connect Hub</h1>
          <p className="text-indigo-200 text-lg max-w-xs mx-auto leading-relaxed">
            Create your account to access all campus services in one place.
          </p>
          <div className="mt-12 space-y-4 text-sm text-left">
            {[
              { icon: '🎓', label: 'Students', desc: 'Manage complaints, find lost items & more' },
              { icon: '🏫', label: 'Staff', desc: 'Book facilities and track campus activity' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-bold">{item.label}</p>
                  <p className="text-indigo-200 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <div className="p-4 bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl shadow-lg">
              <BookOpen size={36} className="text-white" />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-500">Join the campus community today.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 transition-all duration-200 shadow-sm"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 transition-all duration-200 shadow-sm"
                placeholder="student@campus.edu"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 transition-all duration-200 shadow-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {['student', 'staff'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 px-4 rounded-2xl border-2 font-semibold capitalize transition-all duration-200 ${
                      role === r
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {r === 'student' ? '🎓 Student' : '🏫 Staff'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-blue-800 hover:from-indigo-800 hover:to-blue-700 text-white font-bold text-base shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              Register Account
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
