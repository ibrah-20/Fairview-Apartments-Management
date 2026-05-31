import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, Users, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import AnalyticsCard from '../../components/ui/AnalyticsCard';
import DataTable from '../../components/ui/DataTable';
import api from '../../api';

const ApartmentManagerDashboard = () => {
  const [stats, setStats] = useState({ totalRooms: 0, occupiedRooms: 0, occupancyRate: 0, pendingNotices: 0 });
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, roomsRes, bookingsRes] = await Promise.all([
        api.get('/apartments/dashboard/stats'),
        api.get('/apartments/rooms'),
        api.get('/apartments/bookings')
      ]);
      setStats(statsRes.data);
      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Failed to fetch manager data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Room No', accessor: 'id' },
    { header: 'Type', render: (row) => row.isCorner ? 'Corner' : 'Standard' },
    { header: 'Price', render: (row) => `KES ${row.price?.toLocaleString()}` },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          row.status === 'VACANT' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 
          row.status === 'OCCUPIED' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Action',
      render: () => <button className="text-maroon hover:underline font-medium text-sm">Manage</button>
    }
  ];

  const handleApprove = async (id) => {
    try {
      await api.post(`/apartments/bookings/${id}/approve`);
      // toast is automatically handled by the interceptor, but we'll show success
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const bookingColumns = [
    { header: 'Applicant', accessor: 'applicantName' },
    { header: 'Room', render: (row) => row.roomId },
    { header: 'Date', render: (row) => new Date(row.date).toLocaleDateString() },
    {
      header: 'Action',
      render: (row) => (
        <button onClick={() => handleApprove(row.id)} className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow hover:bg-green-700">
          Approve
        </button>
      )
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-bold text-text-light dark:text-text-dark">Apartment Management</h2>
          <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Manage Fairview Apartments units and tenants.</p>
        </div>
        <button onClick={fetchData} className="btn-secondary flex items-center gap-2">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnalyticsCard title="Total Units" value={stats.totalRooms || 90} icon={Building} />
        <AnalyticsCard title="Occupied" value={stats.occupiedRooms || 0} icon={Users} trend={stats.occupancyRate} />
        <AnalyticsCard title="Vacant" value={(stats.totalRooms || 90) - (stats.occupiedRooms || 0)} icon={CheckCircle} />
        <AnalyticsCard title="Notices" value={stats.pendingNotices || 0} icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="enterprise-card p-6">
          <h3 className="text-lg font-heading font-bold mb-4">All Units</h3>
          {loading ? (
            <div className="flex justify-center p-4"><div className="w-6 h-6 border-2 border-maroon border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <DataTable columns={columns} data={rooms.slice(0, 5)} /> 
          )}
          <button className="w-full mt-4 text-sm font-bold text-maroon hover:underline">View All Units</button>
        </div>

        <div className="enterprise-card p-6 flex flex-col">
          <h3 className="text-lg font-heading font-bold mb-4">Pending Bookings</h3>
          {loading ? (
            <div className="flex justify-center p-4"><div className="w-6 h-6 border-2 border-maroon border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            bookings.filter(b => b.status === 'PENDING').length > 0 ? (
              <DataTable columns={bookingColumns} data={bookings.filter(b => b.status === 'PENDING').slice(0, 5)} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-text-muted-light dark:text-text-muted-dark py-10">
                <CheckCircle size={48} className="mb-2 opacity-50 text-green-500" />
                <p>No pending bookings.</p>
              </div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ApartmentManagerDashboard;
