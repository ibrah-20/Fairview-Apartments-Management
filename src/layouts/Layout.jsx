import { Outlet, Link } from 'react-router-dom';
import { Building2, Menu, X, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useStore(state => state.currentUser);

  return (
    <div className="min-h-screen flex flex-col bg-brand-grey-light dark:bg-brand-dark transition-colors duration-300">
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="p-2 bg-brand-maroon rounded-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <span className="font-heading font-bold text-2xl text-gradient tracking-tight">
                  Fairview
                </span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium hover:text-brand-maroon dark:hover:text-brand-silver transition-colors">Home</Link>
              <Link to="/rooms" className="text-sm font-medium hover:text-brand-maroon dark:hover:text-brand-silver transition-colors">Availability</Link>
              <a href="#amenities" className="text-sm font-medium hover:text-brand-maroon dark:hover:text-brand-silver transition-colors">Amenities</a>
              <a href="#rules" className="text-sm font-medium hover:text-brand-maroon dark:hover:text-brand-silver transition-colors">Rules</a>
              
              {currentUser ? (
                <Link 
                  to={currentUser.role === 'admin' ? '/admin' : '/tenant'}
                  className="px-5 py-2.5 rounded-full bg-brand-maroon text-white font-medium hover:bg-brand-maroon-light transition-all shadow-lg hover:shadow-xl shadow-brand-maroon/20"
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black dark:bg-white dark:text-black text-white font-medium hover:scale-105 transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden glass border-t border-white/10">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link onClick={() => setIsOpen(false)} to="/" className="block px-3 py-2 rounded-md font-medium hover:bg-black/5 dark:hover:bg-white/10">Home</Link>
              <Link onClick={() => setIsOpen(false)} to="/rooms" className="block px-3 py-2 rounded-md font-medium hover:bg-black/5 dark:hover:bg-white/10">Availability</Link>
              {currentUser ? (
                <Link 
                  onClick={() => setIsOpen(false)}
                  to={currentUser.role === 'admin' ? '/admin' : '/tenant'}
                  className="block px-3 py-2 rounded-md font-medium text-brand-maroon dark:text-brand-silver"
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  onClick={() => setIsOpen(false)}
                  to="/login"
                  className="block px-3 py-2 rounded-md font-medium text-brand-maroon dark:text-brand-silver"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-brand-dark text-brand-silver-light py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6 text-brand-maroon-light" />
                <span className="font-heading font-bold text-xl text-white">Fairview Apartments</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                Premium living in the heart of Nairobi. Modern amenities, excellent security, and luxurious spaces designed for your comfort.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/rooms" className="text-gray-400 hover:text-white transition-colors">Availability</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Tenant Portal</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Nairobi, Kenya</li>
                <li>hello@fairview.co.ke</li>
                <li>+254 700 000 000</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Fairview Apartments. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
