import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import EnterpriseLayout from './layouts/EnterpriseLayout';
import ErrorBoundary from './components/ErrorBoundary';
import useStore from './store/useStore';

// Public Pages
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Booking from './pages/Booking';
import Login from './pages/Login';
import WaterPublic from './pages/WaterPublic';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Dashboards
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard';
import ApartmentManagerDashboard from './pages/dashboards/ApartmentManagerDashboard';
import WaterStaffDashboard from './pages/dashboards/WaterStaffDashboard';
import TenantPortal from './pages/dashboards/TenantPortal';

const PlaceholderPage = ({ title }) => (
  <div className="flex h-full min-h-[60vh] items-center justify-center bg-surface-light dark:bg-surface-dark rounded-xl border border-silver-light dark:border-surface-hover-dark">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">{title}</h2>
      <p className="text-text-muted-light dark:text-text-muted-dark">This module is currently under development.</p>
    </div>
  </div>
);

function App() {
  const { initAuth, initTheme } = useStore();

  useEffect(() => {
    initTheme();
    initAuth();
  }, [initAuth, initTheme]);

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Site Layout */}
        <Route path="/" element={
          <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <Navbar />
            <main className="pb-20">
              <Home />
            </main>
          </div>
        } />
        
        <Route path="/rooms" element={<><Navbar /><ErrorBoundary><Rooms /></ErrorBoundary></>} />
        <Route path="/booking" element={<><Navbar /><ErrorBoundary><Booking /></ErrorBoundary></>} />
        <Route path="/water" element={<><Navbar /><ErrorBoundary><WaterPublic /></ErrorBoundary></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Enterprise Layout Routes - SUPER ADMIN / ADMIN */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
            <EnterpriseLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="tenants" element={<PlaceholderPage title="Tenant Management" />} />
          <Route path="rooms" element={<PlaceholderPage title="Room Management" />} />
          <Route path="water" element={<PlaceholderPage title="Water Business Overview" />} />
          <Route path="payments" element={<PlaceholderPage title="Payments & Invoices" />} />
          <Route path="reports" element={<PlaceholderPage title="System Reports" />} />
          <Route path="announcements" element={<PlaceholderPage title="Announcements" />} />
          <Route path="settings" element={<PlaceholderPage title="System Settings" />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Enterprise Layout Routes - APARTMENT MANAGER */}
        <Route path="/manager" element={
          <ProtectedRoute allowedRoles={['APARTMENT_MANAGER', 'SUPER_ADMIN', 'ADMIN']}>
            <EnterpriseLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ApartmentManagerDashboard />} />
          <Route path="tenants" element={<PlaceholderPage title="Tenant Directory" />} />
          <Route path="maintenance" element={<PlaceholderPage title="Maintenance Requests" />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Enterprise Layout Routes - WATER STAFF */}
        <Route path="/water-staff" element={
          <ProtectedRoute allowedRoles={['WATER_STAFF', 'SUPER_ADMIN', 'ADMIN']}>
            <EnterpriseLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<WaterStaffDashboard />} />
          <Route path="sales" element={<PlaceholderPage title="Water Sales" />} />
          <Route path="inventory" element={<PlaceholderPage title="Inventory Management" />} />
          <Route path="customers" element={<PlaceholderPage title="Customer Directory" />} />
          <Route path="reports" element={<PlaceholderPage title="Sales Reports" />} />
          <Route path="profile" element={<PlaceholderPage title="My Profile" />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Enterprise Layout Routes - TENANT */}
        <Route path="/tenant" element={
          <ProtectedRoute allowedRoles={['TENANT']}>
            <EnterpriseLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TenantPortal />} />
          <Route path="payments" element={<PlaceholderPage title="My Payments" />} />
          <Route path="invoices" element={<PlaceholderPage title="My Invoices" />} />
          <Route path="notices" element={<PlaceholderPage title="Community Notices" />} />
          <Route path="maintenance" element={<PlaceholderPage title="Maintenance Requests" />} />
          <Route path="profile" element={<PlaceholderPage title="My Profile" />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
