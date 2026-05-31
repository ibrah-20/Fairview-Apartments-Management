import { create } from 'zustand';
import api from '../api';
import toast from 'react-hot-toast';

const useStore = create((set) => ({
  user: null,
  loading: true,
  theme: 'light',
  
  initTheme: () => {
    const storedTheme = localStorage.getItem('fairview_theme') || 'light';
    set({ theme: storedTheme });
    if (storedTheme === 'dark') {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
  },

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('fairview_theme', newTheme);
    if (newTheme === 'dark') {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),

  initAuth: () => {
    const storedUser = localStorage.getItem('fairview_user');
    if (storedUser) {
      set({ user: JSON.parse(storedUser), loading: false });
    } else {
      set({ loading: false });
    }
  },

  login: async (email, password, activePortal) => {
    try {
      let endpoint = '/auth/login';
      if (activePortal === 'TENANT') endpoint = '/auth/tenant-login';
      else if (activePortal === 'STAFF') endpoint = '/auth/staff-login';
      else if (activePortal === 'SUPER_ADMIN') endpoint = '/auth/admin-login';

      const response = await api.post(endpoint, { email, password });
      const { token, user } = response.data;


      localStorage.setItem('fairview_token', token);
      localStorage.setItem('fairview_user', JSON.stringify(user));
      set({ user });
      
      toast.success(`Welcome back, ${user.name || user.email}!`);
      return user;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Login failed.');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('fairview_token');
    localStorage.removeItem('fairview_user');
    set({ user: null });
    toast.success('Logged out successfully');
  }
}));

export default useStore;
