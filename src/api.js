import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fairview_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    // Redirect to login if unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('fairview_token');
      localStorage.removeItem('fairview_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Show colourful toast error
    toast.error(message, {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        border: '2px solid #6B1B2A'
      },
    });
    
    return Promise.reject(error);
  }
);

export default api;
