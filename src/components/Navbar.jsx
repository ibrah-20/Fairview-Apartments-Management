import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { commonStyles, colors } from '../utils/theme';
import { Building, User, LogIn, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Book Now', path: '/booking' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-[#6B1B2A] p-2 rounded-lg group-hover:rotate-6 transition-transform">
            <Building className="text-white" size={20} />
          </div>
          <span className="font-black text-[#6B1B2A] text-lg tracking-tighter uppercase italic">Fairview</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`text-xs font-black uppercase tracking-widest transition-colors ${location.pathname === link.path ? 'text-[#6B1B2A]' : 'text-gray-400 hover:text-[#6B1B2A]'}`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-6 w-[1px] bg-gray-100 mx-2" />

          {user ? (
            <Link 
              to={user.role === 'TENANT' ? '/tenant' : '/admin'}
              className="flex items-center gap-2 bg-[#F9FAFB] border border-gray-100 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-[#6B1B2A] flex items-center justify-center text-[10px] text-white font-bold">
                {user.name?.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-bold text-[#374151]">{user.role === 'ADMIN' ? 'Admin Panel' : 'My Portal'}</span>
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-2 bg-[#6B1B2A] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4A1019] transition-all shadow-md shadow-maroon/20"
            >
              <LogIn size={14} /> Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 space-y-4 animate-in slide-in-from-top-2">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              onClick={() => setIsMenuOpen(false)}
              className="block text-sm font-bold text-gray-600 uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100">
             {user ? (
               <Link 
                 to={user.role === 'TENANT' ? '/tenant' : '/admin'}
                 onClick={() => setIsMenuOpen(false)}
                 className="flex items-center gap-3 text-[#6B1B2A] font-bold"
               >
                 <User size={18} /> My Dashboard
               </Link>
             ) : (
               <Link 
                 to="/login" 
                 onClick={() => setIsMenuOpen(false)}
                 className="flex items-center gap-3 text-[#6B1B2A] font-bold"
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
