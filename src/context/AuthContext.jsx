import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('fairview_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('fairview_token', token);
      localStorage.setItem('fairview_user', JSON.stringify(user));
      setUser(user);
      
      toast.success(`Welcome back, ${user.name || user.email}!`, {
        style: { borderRadius: '10px', background: '#333', color: '#fff', border: '2px solid #059669' }
      });
      return user;
    } catch (error) {
      // Error is handled by api interceptor
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('fairview_token');
    localStorage.removeItem('fairview_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
