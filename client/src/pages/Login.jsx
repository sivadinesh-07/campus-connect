import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, AlertCircle, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/app/dashboard');
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
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">Campus<br />Connect Hub</h1>
          <p className="text-indigo-200 text-lg max-w-xs mx-auto leading-relaxed">
            Your all-in-one portal for complaints, bookings, events, and more.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 text-sm">
            {['Complaints', 'Lost & Found', 'Bookings', 'Internships'].map((item) => (
              <div key={item} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 font-medium">
                {item}
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
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Sign in to access your campus portal.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 transition-all duration-200 shadow-sm"
                placeholder="you@campus.edu"
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

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-blue-800 hover:from-indigo-800 hover:to-blue-700 text-white font-bold text-base shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm">
            Not registered yet?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
