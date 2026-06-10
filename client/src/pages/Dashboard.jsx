import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Activity, Users, FileText, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, linkTo }) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 transform hover:-translate-y-1 relative group overflow-hidden">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-50 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-500`}></div>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-4xl font-extrabold text-gray-900">{value}</h3>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${color}-100 text-${color}-600 shadow-inner`}>
        <Icon size={28} />
      </div>
    </div>
    <Link to={linkTo} className="mt-8 flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 group/link">
      View Details <ArrowRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
    </Link>
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Modular dashboards based on role could be split into separate components, keeping it unified here for simplicity

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back, {user.name.split(' ')[0]} 👋</h2>
          <p className="text-gray-500 text-lg">Here's what's happening on campus today.</p>
        </div>
        <div className="px-5 py-2.5 bg-white border border-gray-200 rounded-full font-semibold text-blue-600 text-sm shadow-sm flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          {user.role} Portal
        </div>
      </div>

      {user.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <StatCard title="Active Complaints" value="12" icon={FileText} color="orange" linkTo="/complaints" />
           <StatCard title="Pending Bookings" value="5" icon={Calendar} color="blue" linkTo="/bookings" />
           <StatCard title="Lost Items" value="8" icon={Activity} color="red" linkTo="/lost-found" />
           <StatCard title="Total Users" value="1.2k" icon={Users} color="green" linkTo="#" />
        </div>
      )}

      {user.role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
           <div className="col-span-2 bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-60"></div>
              <h3 className="text-3xl font-extrabold mb-4 relative z-10">Upcoming Hackathon 🚀</h3>
              <p className="text-indigo-200 text-lg mb-8 max-w-md relative z-10 leading-relaxed">
                Join the Spring 2026 Campus Hackathon. Bring your ideas, build something amazing, and win exiting prizes!
              </p>
              <button className="bg-white text-indigo-900 px-8 py-3.5 rounded-full font-bold hover:bg-indigo-50 transition-colors relative z-10 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
                Register Now
              </button>
           </div>
           
           <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
             <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
               <Activity className="mr-3 text-red-500" /> Recent Alerts
             </h3>
             <ul className="space-y-5">
               <li className="flex items-start">
                 <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 mr-4 flex-shrink-0"></div>
                 <div>
                   <p className="font-semibold text-gray-800">Lost MacBook Pro</p>
                   <p className="text-sm text-gray-500">Library 2nd Floor • 2h ago</p>
                 </div>
               </li>
               <li className="flex items-start">
                 <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 mr-4 flex-shrink-0"></div>
                 <div>
                   <p className="font-semibold text-gray-800">Booking Approved</p>
                   <p className="text-sm text-gray-500">Seminar Hall B • 5h ago</p>
                 </div>
               </li>
               <li className="flex items-start">
                 <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 mr-4 flex-shrink-0"></div>
                 <div>
                   <p className="font-semibold text-gray-800">New Internship</p>
                   <p className="text-sm text-gray-500">Google SWE Summer • 1d ago</p>
                 </div>
               </li>
             </ul>
           </div>
        </div>
      )}

      {user.role === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <StatCard title="My Bookings" value="3" icon={Calendar} color="blue" linkTo="/bookings" />
           <StatCard title="My Complaints" value="1" icon={FileText} color="orange" linkTo="/complaints" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
