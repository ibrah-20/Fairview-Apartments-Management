import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Droplets, Building, DollarSign } from 'lucide-react';
import AnalyticsCard from '../../components/ui/AnalyticsCard';
import DataTable from '../../components/ui/DataTable';

const SuperAdminDashboard = () => {
  // Mock Data for demonstration
  const stats = [
    { title: 'Total Revenue', value: 'KES 1,250,000', icon: DollarSign, trend: 12.5, subtext: 'vs last month' },
    { title: 'Apartment Occupancy', value: '85%', icon: Building, trend: 2.1, subtext: 'vs last month' },
    { title: 'Water Sales (Monthly)', value: 'KES 450,000', icon: Droplets, trend: 8.4, subtext: 'vs last month' },
    { title: 'Total Active Tenants', value: '78', icon: Users, trend: 0, subtext: 'Stable' },
  ];

  const recentTransactions = [
    { id: 'TX-101', type: 'Rent Payment', amount: 'KES 7,000', date: '2026-05-25', status: 'Completed' },
    { id: 'TX-102', type: 'Water Refill', amount: 'KES 150', date: '2026-05-25', status: 'Completed' },
    { id: 'TX-103', type: 'Garbage Fee', amount: 'KES 500', date: '2026-05-24', status: 'Pending' },
    { id: 'TX-104', type: 'Rent Payment', amount: 'KES 6,500', date: '2026-05-24', status: 'Completed' },
  ];

  const columns = [
    { header: 'Transaction ID', accessor: 'id' },
    { header: 'Type', accessor: 'type' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Date', accessor: 'date' },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          row.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        }`}>
          {row.status}
        </span>
      )
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-heading font-bold text-text-light dark:text-text-dark">Enterprise Overview</h2>
        <p className="text-text-muted-light dark:text-text-muted-dark mt-1">
          Welcome to the City Lake Enterprises global dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <AnalyticsCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area placeholder */}
        <div className="lg:col-span-2 enterprise-card p-6 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-heading font-bold mb-4">Revenue Trends</h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-silver-light dark:border-surface-hover-dark rounded-xl text-text-muted-light dark:text-text-muted-dark">
            [Recharts Area Chart Implementation Here]
          </div>
        </div>

        {/* Side Panel */}
        <div className="enterprise-card p-6 flex flex-col">
          <h3 className="text-lg font-heading font-bold mb-4">Division Performance</h3>
          <div className="space-y-6 flex-1">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-sm">Fairview Apartments</span>
                <span className="text-sm text-text-muted-light dark:text-text-muted-dark">64%</span>
              </div>
              <div className="w-full bg-silver-light dark:bg-surface-hover-dark rounded-full h-2.5">
                <div className="bg-maroon h-2.5 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-sm">Water Refill Station</span>
                <span className="text-sm text-text-muted-light dark:text-text-muted-dark">36%</span>
              </div>
              <div className="w-full bg-silver-light dark:bg-surface-hover-dark rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '36%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="enterprise-card p-6">
        <h3 className="text-lg font-heading font-bold mb-4">Recent Global Transactions</h3>
        <DataTable columns={columns} data={recentTransactions} />
      </div>

    </motion.div>
  );
};

export default SuperAdminDashboard;
