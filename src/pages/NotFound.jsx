import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import useStore from '../store/useStore';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  const handleGoHome = () => {
    if (user) {
      if (user.role === 'TENANT') navigate('/tenant/dashboard', { replace: true });
      else if (user.role === 'APARTMENT_MANAGER' || user.role === 'ADMIN') navigate('/manager/dashboard', { replace: true });
      else if (user.role === 'WATER_STAFF') navigate('/water-staff/dashboard', { replace: true });
      else if (user.role === 'SUPER_ADMIN') navigate('/admin/dashboard', { replace: true });
      else navigate('/', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <Compass size={80} className="text-text-muted-light dark:text-text-muted-dark animate-pulse" />
        </div>
        <h1 className="text-6xl font-heading font-black text-maroon dark:text-maroon-light mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
          Page Not Found
        </h2>
        <p className="text-text-muted-light dark:text-text-muted-dark mb-8 text-lg">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <button
          onClick={handleGoHome}
          className="btn-primary py-3 px-8 text-lg"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
