import React, { useContext } from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Home, 
  MessageSquare, 
  Search, 
  Calendar, 
  Briefcase, 
  Award, 
  LogOut,
  User as UserIcon,
  MessageCircle
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/app/dashboard', roles: ['admin', 'staff', 'student'] },
    { name: 'Complaints', icon: MessageSquare, path: '/app/complaints', roles: ['admin', 'staff', 'student'] },
    { name: 'Lost & Found', icon: Search, path: '/app/lost-found', roles: ['admin', 'staff', 'student'] },
    { name: 'Bookings', icon: Calendar, path: '/app/bookings', roles: ['admin', 'staff', 'student'] },
    { name: 'Events', icon: Award, path: '/app/events', roles: ['admin', 'student'] },
    { name: 'Internships', icon: Briefcase, path: '/app/internships', roles: ['admin', 'student'] },
    { name: 'Forum', icon: MessageCircle, path: '/app/forum', roles: ['admin', 'staff', 'student'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-200 shadow-sm flex flex-col transition-all duration-300">
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="ml-4 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
            Campus Hub
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
          <div className="space-y-2">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-semibold' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon 
                    size={22} 
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'
                    }`}
                  />
                  <span className="ml-4">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 shadow-sm" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 mb-2">
          <div className="bg-gray-50 p-4 rounded-2xl flex items-center shadow-inner">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
              <UserIcon className="text-blue-600" size={24} />
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-blue-600 font-medium capitalize mt-0.5">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center w-full px-4 py-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-colors group"
          >
            <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
            <span className="ml-4 font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex flex-shrink-0 items-center justify-between px-10 sticky top-0 z-10 transition-all">
          <h1 className="text-2xl font-bold tracking-tight text-gray-800 capitalize">
            {location.pathname.split('/')[2] || 'Overview'}
          </h1>
          <div className="flex items-center space-x-4">
            {/* Can add search or notifications here */}
          </div>
        </header>
        
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-10 relative">
           {/* Soft background graphic elements */}
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10 mix-blend-multiply pointer-events-none"></div>
           <div className="absolute bottom-0 left-[-200px] w-[600px] h-[600px] bg-purple-50/50 rounded-full blur-3xl -z-10 mix-blend-multiply pointer-events-none"></div>
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
