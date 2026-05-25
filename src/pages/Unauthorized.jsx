import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import useStore from '../store/useStore';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  const handleGoBack = () => {
    if (user) {
      if (user.role === 'TENANT') navigate('/tenant/dashboard', { replace: true });
      else if (user.role === 'APARTMENT_MANAGER' || user.role === 'ADMIN') navigate('/manager/dashboard', { replace: true });
      else if (user.role === 'WATER_STAFF') navigate('/water-staff/dashboard', { replace: true });
      else if (user.role === 'SUPER_ADMIN') navigate('/admin/dashboard', { replace: true });
      else navigate('/', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <ShieldAlert size={80} className="text-red-500" />
        </div>
        <h1 className="text-4xl font-heading font-bold text-text-light dark:text-text-dark mb-4">
          Access Denied
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark mb-8 text-lg">
          You do not have permission to view this page. If you believe this is an error, please contact your administrator.
        </p>
        <button
          onClick={handleGoBack}
          className="btn-primary py-3 px-8 text-lg"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
