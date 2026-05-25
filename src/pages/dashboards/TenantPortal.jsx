import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Droplets, Trash2, Home, RefreshCw } from 'lucide-react';
import AnalyticsCard from '../../components/ui/AnalyticsCard';
import useStore from '../../store/useStore';
import api from '../../api';

const TenantPortal = () => {
  const { user } = useStore();
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState({ rent: 7000, water: 450, garbage: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // In a full implementation, this would fetch from /api/tenant/balances
      // Mocking the delay for now since the endpoint isn't fully created
      await new Promise(r => setTimeout(r, 800));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-bold text-text-light dark:text-text-dark">Tenant Portal</h2>
          <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Manage your home, bills, and requests. Welcome, {user?.name || 'Resident'}!</p>
        </div>
        <button onClick={fetchData} className="btn-secondary flex items-center gap-2">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard title="Current Rent" value={`KES ${balances.rent.toLocaleString()}`} icon={Home} subtext="Due: 5th next month" />
        <AnalyticsCard title="Water Bill" value={`KES ${balances.water.toLocaleString()}`} icon={Droplets} subtext="Pending payment" />
        <AnalyticsCard title="Garbage Fee" value={`KES ${balances.garbage.toLocaleString()}`} icon={Trash2} subtext="Paid for this month" />
        <AnalyticsCard title="Total Due" value={`KES ${(balances.rent + balances.water + balances.garbage).toLocaleString()}`} icon={FileText} trend={0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="enterprise-card p-6">
          <h3 className="text-lg font-heading font-bold mb-4">Quick Actions</h3>
          {loading ? (
             <div className="flex justify-center p-10"><div className="w-8 h-8 border-2 border-maroon border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-silver-light dark:border-surface-hover-dark rounded-xl hover:bg-background-light dark:hover:bg-surface-hover-dark transition-colors flex flex-col items-center justify-center text-center gap-2 group">
                <FileText size={24} className="text-maroon group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">Pay Rent & Bills</span>
              </button>
              <button className="p-4 border border-silver-light dark:border-surface-hover-dark rounded-xl hover:bg-background-light dark:hover:bg-surface-hover-dark transition-colors flex flex-col items-center justify-center text-center gap-2 group">
                <Droplets size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">Order Water Refill</span>
              </button>
              <button className="p-4 border border-silver-light dark:border-surface-hover-dark rounded-xl hover:bg-background-light dark:hover:bg-surface-hover-dark transition-colors flex flex-col items-center justify-center text-center gap-2 group">
                <Home size={24} className="text-green-500 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">Maintenance Request</span>
              </button>
              <button className="p-4 border border-silver-light dark:border-surface-hover-dark rounded-xl hover:bg-background-light dark:hover:bg-surface-hover-dark transition-colors flex flex-col items-center justify-center text-center gap-2 group">
                <Trash2 size={24} className="text-text-muted-light group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">Vacation Notice</span>
              </button>
            </div>
          )}
        </div>

        <div className="enterprise-card p-6">
          <h3 className="text-lg font-heading font-bold mb-4">Recent Announcements</h3>
          <div className="space-y-4">
            <div className="p-4 bg-background-light dark:bg-surface-hover-dark/50 rounded-lg border-l-4 border-maroon">
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-1">May 20, 2026</p>
              <h4 className="font-medium text-sm">Water Station Maintenance</h4>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                The water refill station will be closed for 2 hours tomorrow for routine filter changes.
              </p>
            </div>
            <div className="p-4 bg-background-light dark:bg-surface-hover-dark/50 rounded-lg border-l-4 border-silver-dark">
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-1">May 15, 2026</p>
              <h4 className="font-medium text-sm">Garbage Collection Schedule</h4>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                Garbage collection has been moved to Tuesday and Friday mornings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TenantPortal;
