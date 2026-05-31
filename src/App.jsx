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

import { AdminTenants, AdminRooms, AdminWater, AdminPayments, AdminReports, AdminAnnouncements, AdminSettings, WaterInventory, WaterCustomers, WaterReports, WaterProfile, TenantPayments, TenantInvoices, TenantNotices, TenantMaintenance, TenantProfile } from './pages/dashboards/DashboardComponents';
import WaterSales from './pages/dashboards/WaterSales';

// Placeholders removed

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
          <Route path="tenants" element={<AdminTenants />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="water" element={<AdminWater />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="settings" element={<AdminSettings />} />
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
          <Route path="tenants" element={<AdminTenants />} />
          <Route path="maintenance" element={<TenantMaintenance />} />
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
          <Route path="sales" element={<WaterSales />} />
          <Route path="inventory" element={<WaterInventory />} />
          <Route path="customers" element={<WaterCustomers />} />
          <Route path="reports" element={<WaterReports />} />
          <Route path="profile" element={<WaterProfile />} />
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
          <Route path="payments" element={<TenantPayments />} />
          <Route path="invoices" element={<TenantInvoices />} />
          <Route path="notices" element={<TenantNotices />} />
          <Route path="maintenance" element={<TenantMaintenance />} />
          <Route path="profile" element={<TenantProfile />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
