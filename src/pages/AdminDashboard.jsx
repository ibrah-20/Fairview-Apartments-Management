import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { commonStyles, colors } from '../utils/theme';
import { 
  Users, Building, FileText, PieChart as PieIcon,
  Plus, Search, Filter, MoreVertical, CheckCircle,
  XCircle, AlertCircle, TrendingUp, BarChart2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const AdminDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsRes, bookingsRes, noticesRes] = await Promise.all([
        api.get('/rooms'),
        api.get('/bookings'),
        api.get('/notices')
      ]);
      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
      setNotices(noticesRes.data);
    } catch (error) {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = async (id) => {
    try {
      await api.post(`/bookings/${id}/approve`);
      toast.success("Booking Approved! Tenant account created.");
      fetchData();
    } catch (error) {
      // Handled
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-60px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B1B2A]"></div>
    </div>
  );

  const stats = [
    { label: 'Total Units', value: rooms.length, icon: Building, color: '#6B1B2A' },
    { label: 'Occupied', value: rooms.filter(r => r.status === 'OCCUPIED').length, icon: Users, color: '#059669' },
    { label: 'Vacant', value: rooms.filter(r => r.status === 'VACANT').length, icon: TrendingUp, color: '#3B82F6' },
    { label: 'Pending Bookings', value: bookings.filter(b => b.status === 'pending').length, icon: FileText, color: '#F59E0B' },
  ];

  const occupancyData = [
    { name: 'Occupied', value: rooms.filter(r => r.status === 'OCCUPIED').length, color: '#6B1B2A' },
    { name: 'Vacant', value: rooms.filter(r => r.status === 'VACANT').length, color: '#C0C0C8' },
    { name: 'Reserved', value: rooms.filter(r => r.status === 'RESERVED').length, color: '#F59E0B' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-black text-[#6B1B2A] uppercase tracking-tighter italic">Management Dashboard</h2>
          <p className="text-[#6B7280] text-sm font-medium tracking-wide mt-1 uppercase">Fairview Apartments Nairobi</p>
        </div>
        <div className="flex gap-2">
          <button className={`${commonStyles.buttonPrimary} flex items-center gap-2 text-xs uppercase tracking-widest`}>
            <Plus size={16} /> New Announcement
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map(s => (
          <div key={s.label} className={`${commonStyles.card} border-none shadow-xl shadow-gray-200/50 relative overflow-hidden group`}>
            <div className="relative z-10">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</div>
              <div className="text-3xl font-black text-[#374151]">{s.value}</div>
            </div>
            <s.icon className="absolute -right-4 -bottom-4 text-gray-50 group-hover:text-gray-100 transition-colors" size={100} />
            <div className="absolute top-0 left-0 h-full w-1" style={{ backgroundColor: s.color }} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl w-fit">
            {[
              {id: 'overview', label: 'Overview', icon: BarChart2},
              {id: 'bookings', label: 'Bookings', icon: FileText},
              {id: 'notices', label: 'Notices', icon: AlertCircle}
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-white text-[#6B1B2A] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={commonStyles.card}>
                <h3 className="font-black text-[#6B1B2A] text-sm uppercase tracking-widest mb-8 border-b border-gray-50 pb-4">Occupancy Ratio</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={occupancyData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {occupancyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  {occupancyData.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={commonStyles.card}>
                <h3 className="font-black text-[#6B1B2A] text-sm uppercase tracking-widest mb-8 border-b border-gray-50 pb-4">Floor Performance</h3>
                <div className="space-y-4">
                  {['Ground', '1st', '2nd', '3rd', '4th', '5th'].map(floor => (
                    <div key={floor}>
                      <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                        <span>{floor} Floor</span>
                        <span>{Math.floor(Math.random() * 15)}/15</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#6B1B2A] rounded-full transition-all duration-1000" style={{ width: `${Math.random() * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className={commonStyles.card}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-[#6B1B2A] text-sm uppercase tracking-widest">Pending Applications</h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className="bg-gray-50 border-none text-xs rounded-lg pl-9 pr-4 py-2 outline-none w-48" placeholder="Search..." />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Applicant</th>
                      <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Unit</th>
                      <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Date</th>
                      <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.filter(b => b.status === 'pending').map(b => (
                      <tr key={b.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-4">
                          <div className="text-sm font-bold text-[#374151]">{b.applicantName}</div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-tight">{b.email}</div>
                        </td>
                        <td className="py-4 text-center">
                          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-xs font-black">{b.roomId}</span>
                        </td>
                        <td className="py-4 text-center text-xs text-gray-500">
                          {new Date(b.date).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleApproveBooking(b.id)}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                              <XCircle size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className={commonStyles.card}>
               <h3 className="font-black text-[#6B1B2A] text-sm uppercase tracking-widest mb-6">Recent Notices & Reports</h3>
               <div className="space-y-4">
                  {notices.map(n => (
                    <div key={n.id} className="p-4 rounded-xl border border-gray-50 hover:border-gray-200 transition-all bg-gray-50/30">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${n.type === 'MAINTENANCE' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                            {n.type}
                          </span>
                          <span className="text-xs font-bold text-gray-400">Unit {n.tenant?.unitId}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 italic">{new Date(n.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-[#374151] font-medium leading-relaxed mb-3">"{n.content}"</p>
                      <div className="flex justify-between items-center">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                           <Users size={10} /> {n.tenant?.user?.name}
                        </div>
                        <button className="text-[10px] font-black text-[#6B1B2A] uppercase tracking-widest hover:underline">Mark as Resolved</button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <div className={commonStyles.card}>
              <h3 className="font-black text-[#6B1B2A] text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                <Users size={18} /> Admin Management
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-gray-100">
                  <div className="h-10 w-10 rounded-full bg-[#6B1B2A] flex items-center justify-center text-white font-black">SA</div>
                  <div>
                    <div className="text-xs font-black text-[#374151] uppercase tracking-tight">Super Admin</div>
                    <div className="text-[10px] text-gray-400">system_root@fairview.com</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                 <p className="text-[11px] text-amber-800 font-bold flex items-center gap-2 uppercase tracking-wide">
                   <AlertCircle size={14} /> Account Limit: 1/3
                 </p>
              </div>
           </div>

           <div className={`${commonStyles.card} bg-gray-900 text-white border-none shadow-2xl`}>
              <h3 className="font-black text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-400" /> Revenue Forecast
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Expected Monthly</div>
                  <div className="text-3xl font-black text-white tracking-tight">KES 612,500</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Collected</div>
                    <div className="text-lg font-black text-green-400">92%</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Outstanding</div>
                    <div className="text-lg font-black text-red-400">KES 48.2K</div>
                  </div>
                </div>
                <button className="w-full bg-white/10 hover:bg-white/20 transition-all py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  Generate Revenue Report
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
