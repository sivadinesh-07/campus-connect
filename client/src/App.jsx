import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

// Pages
import Complaints from './pages/Complaints';
import LostFound from './pages/LostFound';
import Bookings from './pages/Bookings';
import Events from './pages/Events';
import Internships from './pages/Internships';
import DiscussionForum from './pages/DiscussionForum';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected app routes */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="lost-found" element={<LostFound />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="events" element={<Events />} />
            <Route path="internships" element={<Internships />} />
            <Route path="forum" element={<DiscussionForum />} />
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Under Construction 🚧</h2>
                <p className="text-gray-500 max-w-md">This module is currently being built. Check back soon!</p>
              </div>
            } />
          </Route>

          {/* Legacy redirect to preserve existing nav links */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/complaints" element={<Navigate to="/app/complaints" replace />} />
          <Route path="/lost-found" element={<Navigate to="/app/lost-found" replace />} />
          <Route path="/bookings" element={<Navigate to="/app/bookings" replace />} />
          <Route path="/events" element={<Navigate to="/app/events" replace />} />
          <Route path="/internships" element={<Navigate to="/app/internships" replace />} />
          <Route path="/forum" element={<Navigate to="/app/forum" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
