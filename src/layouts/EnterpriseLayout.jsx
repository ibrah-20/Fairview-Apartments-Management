import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { 
  Menu, X, Sun, Moon, LogOut, Bell, 
  LayoutDashboard, Building, Droplets, Users, 
  FileText, Settings, User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

const EnterpriseLayout = () => {
  const { user, logout } = useStore();
  const role = user?.role || 'TENANT';
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Basic dark mode toggle
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define navigation based on role
  const navItems = {
    SUPER_ADMIN: [
      { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Tenants', path: '/admin/tenants', icon: Users },
      { name: 'Rooms', path: '/admin/rooms', icon: Building },
      { name: 'Water Business', path: '/admin/water', icon: Droplets },
      { name: 'Payments', path: '/admin/payments', icon: FileText },
      { name: 'Reports', path: '/admin/reports', icon: FileText },
      { name: 'Announcements', path: '/admin/announcements', icon: Bell },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
    ADMIN: [
      { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Tenants', path: '/admin/tenants', icon: Users },
      { name: 'Rooms', path: '/admin/rooms', icon: Building },
      { name: 'Water Business', path: '/admin/water', icon: Droplets },
      { name: 'Payments', path: '/admin/payments', icon: FileText },
      { name: 'Reports', path: '/admin/reports', icon: FileText },
      { name: 'Announcements', path: '/admin/announcements', icon: Bell },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
    APARTMENT_MANAGER: [
      { name: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
      { name: 'Tenants', path: '/manager/tenants', icon: Users },
      { name: 'Maintenance', path: '/manager/maintenance', icon: Settings },
    ],
    WATER_STAFF: [
      { name: 'Dashboard', path: '/water-staff/dashboard', icon: LayoutDashboard },
      { name: 'Sales', path: '/water-staff/sales', icon: FileText },
      { name: 'Inventory', path: '/water-staff/inventory', icon: Droplets },
      { name: 'Customers', path: '/water-staff/customers', icon: Users },
      { name: 'Reports', path: '/water-staff/reports', icon: FileText },
      { name: 'Profile', path: '/water-staff/profile', icon: UserIcon },
    ],
    TENANT: [
      { name: 'Dashboard', path: '/tenant/dashboard', icon: LayoutDashboard },
      { name: 'Payments', path: '/tenant/payments', icon: FileText },
      { name: 'Invoices', path: '/tenant/invoices', icon: FileText },
      { name: 'Notices', path: '/tenant/notices', icon: Bell },
      { name: 'Maintenance', path: '/tenant/maintenance', icon: Settings },
      { name: 'Profile', path: '/tenant/profile', icon: UserIcon },
    ]
  };

  const links = navItems[role] || navItems['TENANT'];

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark transition-colors duration-300 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="enterprise-sidebar z-20 hidden md:flex flex-col h-full shrink-0"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-silver-light dark:border-surface-hover-dark">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="font-heading font-bold text-lg text-maroon dark:text-maroon-light truncate"
              >
                City Lake
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-heading font-bold text-xl text-maroon mx-auto"
              >
                CL
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1.5 rounded-lg hover:bg-surface-light/10 text-text-muted-light dark:text-text-muted-dark">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-maroon text-white dark:bg-maroon-dark dark:text-white'
                      : 'text-text-muted-light dark:text-text-muted-dark hover:bg-silver-light/50 dark:hover:bg-surface-hover-dark'
                  }`
                }
              >
                <Icon size={20} className="shrink-0" />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="ml-3 whitespace-nowrap overflow-hidden text-sm font-medium"
                    >
                      {link.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-silver-light dark:border-surface-hover-dark">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={20} className="shrink-0" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-16 enterprise-topbar z-10 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile menu button could go here */}
            <h1 className="text-xl font-heading font-semibold text-text-light dark:text-text-dark hidden sm:block">
              {role.replace('_', ' ')} PORTAL
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-silver-light/50 dark:hover:bg-surface-hover-dark text-text-muted-light dark:text-text-muted-dark transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 rounded-full hover:bg-silver-light/50 dark:hover:bg-surface-hover-dark text-text-muted-light dark:text-text-muted-dark transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-maroon rounded-full"></span>
            </button>
            
            <div className="h-8 w-8 rounded-full bg-maroon flex items-center justify-center text-white font-bold text-sm">
              {role.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default EnterpriseLayout;
