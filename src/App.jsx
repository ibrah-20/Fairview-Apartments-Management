import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import WhatsAppFAB from './components/WhatsAppFAB';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Booking from './pages/Booking';
import Login from './pages/Login';
import TenantDashboard from './pages/TenantDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-[#374151]">
      <Navbar />
      
      <main className="pb-20">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/login" element={<Login />} />

          {/* Tenant Routes */}
          <Route 
            path="/tenant/*" 
            element={
              <ProtectedRoute allowedRoles={['TENANT']}>
                <TenantDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <WhatsAppFAB />
    </div>
  );
}

export default App;
