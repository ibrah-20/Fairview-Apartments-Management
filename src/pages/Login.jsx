import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import { Eye, EyeOff, Lock, Mail, Building, User, Droplets, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activePortal, setActivePortal] = useState('TENANT'); // 'TENANT', 'STAFF', 'SUPER_ADMIN'
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      if (user.role === 'TENANT') navigate('/tenant/dashboard', { replace: true });
      else if (user.role === 'APARTMENT_MANAGER' || user.role === 'ADMIN') navigate('/manager/dashboard', { replace: true });
      else if (user.role === 'WATER_STAFF') navigate('/water-staff/dashboard', { replace: true });
      else if (user.role === 'SUPER_ADMIN') navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = await login(email, password, activePortal);
      // Correct dynamic routing based on Role
      if (user.role === 'TENANT') {
        navigate('/tenant/dashboard');
      } else if (user.role === 'APARTMENT_MANAGER' || user.role === 'ADMIN') {
        navigate('/manager/dashboard');
      } else if (user.role === 'WATER_STAFF') {
        navigate('/water-staff/dashboard');
      } else if (user.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      // Error handled by store/interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background-light dark:bg-background-dark px-6 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-heading font-black text-maroon dark:text-maroon-light tracking-tighter mb-2 uppercase">
            {activePortal === 'TENANT' ? 'Tenant Portal' : activePortal === 'STAFF' ? 'Staff Portal' : 'Management Portal'}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark text-sm">Secure access to City Lake Enterprises</p>
        </div>

        {/* Login Card */}
        <div className="enterprise-card overflow-hidden p-0">
          {/* Portal Switcher */}
          <div className="flex p-1 bg-surface-light dark:bg-surface-dark border-b border-silver-light dark:border-surface-hover-dark">
            <button 
              onClick={() => setActivePortal('TENANT')}
              className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-t-xl transition-all flex items-center justify-center gap-2 ${activePortal === 'TENANT' ? 'bg-background-light dark:bg-background-dark text-maroon border-b-2 border-maroon' : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-light'}`}
            >
              <User size={16} /> Tenant
            </button>
            <button 
              onClick={() => setActivePortal('STAFF')}
              className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-t-xl transition-all flex items-center justify-center gap-2 ${activePortal === 'STAFF' ? 'bg-background-light dark:bg-background-dark text-maroon border-b-2 border-maroon' : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-light'}`}
            >
              <Droplets size={16} /> Staff
            </button>
            <button 
              onClick={() => setActivePortal('SUPER_ADMIN')}
              className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-t-xl transition-all flex items-center justify-center gap-2 ${activePortal === 'SUPER_ADMIN' ? 'bg-background-light dark:bg-background-dark text-maroon border-b-2 border-maroon' : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-light'}`}
            >
              <ShieldCheck size={16} /> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-background-light dark:bg-background-dark">
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-maroon"
                  placeholder={activePortal === 'TENANT' ? "tenant@fairview.com" : "staff@citylake.com"}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold">Password</label>
                <button type="button" className="text-xs font-bold text-maroon hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg pl-10 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-maroon"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark hover:text-text-light"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-maroon/20 transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In to {activePortal}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
