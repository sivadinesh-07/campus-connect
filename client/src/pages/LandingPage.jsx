import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, MessageSquare, Search, Calendar, Briefcase,
  MessageCircle, ArrowRight, Shield, Users, Zap, ChevronDown
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Complaints',
    desc: 'Raise and track campus complaints. Get real-time status updates as admins resolve them.',
    color: 'from-orange-400 to-red-500',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
  },
  {
    icon: Search,
    title: 'Lost & Found',
    desc: 'Report lost items or browse found items to reunite belongings with their owners.',
    color: 'from-pink-400 to-rose-500',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
  },
  {
    icon: Calendar,
    title: 'Bookings',
    desc: 'Book classrooms, labs, and equipment. Admins approve or reject requests instantly.',
    color: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    icon: Zap,
    title: 'Events',
    desc: 'Discover tech, cultural, and sports events happening across campus — all in one place.',
    color: 'from-yellow-400 to-orange-500',
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
  },
  {
    icon: Briefcase,
    title: 'Internships',
    desc: 'Browse internship opportunities shared by staff and alumni. Apply with a single click.',
    color: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    icon: MessageCircle,
    title: 'Discussion Forum',
    desc: 'Ask questions, share answers, and engage with your campus community every day.',
    color: 'from-purple-400 to-violet-500',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
];

const steps = [
  { step: '01', title: 'Create Account', desc: 'Register as a student or staff member in seconds.' },
  { step: '02', title: 'Access Your Portal', desc: 'Your role-based dashboard greets you with what matters most.' },
  { step: '03', title: 'Stay Connected', desc: 'Raise issues, book resources, join events, and discuss freely.' },
];

const stats = [
  { value: '6+', label: 'Modules' },
  { value: '3', label: 'User Roles' },
  { value: '100%', label: 'Free to Use' },
  { value: '24/7', label: 'Available' },
];

const LandingPage = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-900 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-lg font-extrabold text-gray-900">Campus Connect Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-700 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-indigo-900 to-blue-800 text-white text-sm font-bold rounded-xl hover:from-indigo-800 hover:to-blue-700 transition-all shadow-md hover:shadow-indigo-500/30">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-900 pt-16">
        {/* Animated bg blobs */}
        <div ref={heroRef} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-overlay filter blur-[120px] opacity-40 animate-pulse" />
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-overlay filter blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-indigo-400 rounded-full mix-blend-overlay filter blur-[100px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-sm font-medium px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Your All-In-One Campus Portal
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none tracking-tight">
            Campus Life,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
              Simplified.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-indigo-200 max-w-2xl mx-auto mb-12 leading-relaxed">
            One platform for complaints, bookings, lost &amp; found, events, internships, and campus discussions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-900 font-extrabold text-lg rounded-2xl hover:bg-indigo-50 shadow-2xl shadow-black/30 transform hover:-translate-y-1 transition-all duration-300">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/20 hover:bg-white/20 backdrop-blur-sm transform hover:-translate-y-1 transition-all duration-300">
              Sign In
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
            <ChevronDown size={28} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-indigo-900 to-blue-800 py-14">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-black text-white mb-1">{s.value}</p>
              <p className="text-indigo-300 font-medium text-sm uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-28 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">Everything You Need</p>
            <h2 className="text-5xl font-black text-gray-900 mb-4">All Campus Services,<br />One Dashboard</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">No more switching between platforms. Everything campus-related lives here.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title}
                  className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                  <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={26} className={f.text} />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-3">{f.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">Simple & Fast</p>
            <h2 className="text-5xl font-black text-gray-900">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-200" />
            {steps.map((s, i) => (
              <div key={s.step} className="text-center relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-900 to-blue-800 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30 text-2xl font-black">
                  {s.step}
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="py-28 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">Built for Everyone</p>
            <h2 className="text-5xl font-black text-gray-900">Your Role, Your Portal</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '🎓', role: 'Students', color: 'from-indigo-900 to-blue-800', items: ['Raise complaints', 'Book resources', 'Find lost items', 'Browse internships', 'Join the forum'] },
              { emoji: '🏫', role: 'Staff', color: 'from-purple-800 to-indigo-800', items: ['Manage bookings', 'Post events', 'View complaints', 'Share internships', 'Participate in forum'] },
              { emoji: '⚙️', role: 'Admin', color: 'from-slate-800 to-gray-900', items: ['Manage all users', 'Update complaint status', 'Approve bookings', 'Delete forum posts', 'Full system control'] },
            ].map(r => (
              <div key={r.role} className={`bg-gradient-to-br ${r.color} rounded-3xl p-8 text-white shadow-2xl hover:-translate-y-2 transition-all duration-300`}>
                <div className="text-4xl mb-4">{r.emoji}</div>
                <h3 className="text-2xl font-extrabold mb-6">{r.role}</h3>
                <ul className="space-y-3">
                  {r.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-white/80 text-sm">
                      <span className="w-1.5 h-1.5 bg-white/60 rounded-full flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-[120px] opacity-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-overlay filter blur-[120px] opacity-20" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <Shield size={28} className="text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ready to simplify<br />campus life?
          </h2>
          <p className="text-xl text-indigo-200 mb-12 max-w-xl mx-auto">
            Join students and staff already using Campus Connect Hub to stay organized, informed, and connected.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-900 font-extrabold text-lg rounded-2xl hover:bg-indigo-50 shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <Users size={20} /> Create Account
            </Link>
            <Link to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/20 hover:bg-white/20 backdrop-blur-sm transform hover:-translate-y-1 transition-all duration-300">
              Sign In <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-500 py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen size={14} className="text-white" />
          </div>
          <span className="text-white font-bold">Campus Connect Hub</span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} Campus Connect Hub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
