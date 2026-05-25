import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building, Droplets, User, LogIn, Menu, X, LogOut, Sun, Moon } from 'lucide-react';
import useStore from '../store/useStore';

const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Apartments', path: '/rooms' },
    { name: 'Water Refill', path: '/water' },
    { name: 'Bookings', path: '/booking' },
  ];

  return (
    <nav className="enterprise-topbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-maroon p-2 rounded-lg group-hover:rotate-6 transition-transform flex items-center justify-center">
            <Building className="text-white absolute" size={18} strokeWidth={1.5} />
            <Droplets className="text-blue-200 ml-3 mt-3" size={14} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-maroon dark:text-maroon-light text-lg tracking-tight uppercase leading-none mt-1">City Lake</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-text-muted-light dark:text-text-muted-dark uppercase leading-none">Enterprises</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`text-sm font-semibold tracking-wide transition-colors ${location.pathname === link.path ? 'text-maroon dark:text-maroon-light' : 'text-text-muted-light dark:text-text-muted-dark hover:text-maroon dark:hover:text-maroon-light'}`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-6 w-[1px] bg-silver-light dark:bg-surface-hover-dark mx-2" />

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-background-light dark:hover:bg-surface-hover-dark transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <Link 
              to={user.role === 'TENANT' ? '/tenant/dashboard' : '/admin/dashboard'}
              className="flex items-center gap-2 bg-background-light dark:bg-surface-hover-dark px-4 py-2 rounded-xl hover:bg-silver-light/50 transition-all border border-silver-light dark:border-surface-hover-dark ml-2"
            >
              <div className="w-6 h-6 rounded-full bg-maroon flex items-center justify-center text-[10px] text-white font-bold">
                {user.name?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-bold">Portal</span>
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="btn-primary flex items-center gap-2 shadow-lg shadow-maroon/20 ml-2"
            >
              <LogIn size={16} /> <span className="uppercase text-xs tracking-wider">Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-background-light dark:hover:bg-surface-hover-dark transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="text-text-muted-light dark:text-text-muted-dark" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface-light dark:bg-surface-dark border-t border-silver-light dark:border-surface-hover-dark py-4 px-6 space-y-4">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              onClick={() => setIsMenuOpen(false)}
              className="block text-sm font-bold text-text-light dark:text-text-dark uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-silver-light dark:border-surface-hover-dark">
             {user ? (
               <Link 
                 to={user.role === 'TENANT' ? '/tenant/dashboard' : '/admin/dashboard'}
                 onClick={() => setIsMenuOpen(false)}
                 className="flex items-center gap-3 text-maroon font-bold"
               >
                 <User size={18} /> My Dashboard
               </Link>
             ) : (
               <Link 
                 to="/login" 
                 onClick={() => setIsMenuOpen(false)}
                 className="flex items-center gap-3 text-maroon font-bold"
               >
                 <LogIn size={18} /> Login
               </Link>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
