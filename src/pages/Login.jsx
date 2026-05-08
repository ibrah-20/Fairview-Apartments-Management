import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { commonStyles, colors } from '../utils/theme';
import { Eye, EyeOff, Lock, Mail, Building, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('TENANT'); // 'TENANT' or 'ADMIN'
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'TENANT') navigate('/tenant');
      else navigate('/admin');
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-[#F9FAFB] px-6 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#6B1B2A] tracking-tighter mb-2">FAIRVIEW PORTAL</h2>
          <p className="text-[#6B7280] text-sm">Secure access to your apartment services</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Role Switcher */}
          <div className="flex p-1 bg-gray-50 border-b border-gray-100">
            <button 
              onClick={() => setRole('TENANT')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${role === 'TENANT' ? 'bg-white text-[#6B1B2A] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <User size={16} /> Tenant
            </button>
            <button 
              onClick={() => setRole('ADMIN')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${role === 'ADMIN' ? 'bg-white text-[#6B1B2A] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Lock size={16} /> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className={commonStyles.label}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${commonStyles.input} pl-10`}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-[#6B7280]">Password</label>
                <button type="button" className="text-xs font-bold text-[#6B1B2A] hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${commonStyles.input} pl-10 pr-10`}
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`${commonStyles.buttonPrimary} w-full py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-maroon/20 transform hover:-translate-y-0.5 active:translate-y-0`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In to {role === 'ADMIN' ? 'Management' : 'Portal'}</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-[#6B7280]">
          Don't have an account? <Link to="/rooms" className="text-[#6B1B2A] font-bold hover:underline">Book a room</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
