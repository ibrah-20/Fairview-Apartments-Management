import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { commonStyles, colors } from '../utils/theme';
import { 
  User, Building, Droplets, CreditCard, Bell, 
  Wrench, LogOut, ChevronRight, Download, FileText,
  Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const TenantDashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noticeForm, setNoticeForm] = useState({ type: 'MAINTENANCE', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/tenant/dashboard');
      setProfile(response.data);
    } catch (error) {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    if (!noticeForm.content) return toast.error("Please describe the issue");
    
    setIsSubmitting(true);
    try {
      await api.post('/notices', noticeForm);
      toast.success("Notice submitted successfully!");
      setNoticeForm({ ...noticeForm, content: '' });
      fetchProfile();
    } catch (error) {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-60px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B1B2A]"></div>
    </div>
  );

  const room = profile?.room;
  const invoices = profile?.invoices || [];
  const rentStatus = invoices.some(i => i.status === 'PENDING' || i.status === 'OVERDUE') ? 'UNPAID' : 'PAID';

  // Mock data for payment history chart
  const chartData = [
    { month: 'Jan', amount: 7400 },
    { month: 'Feb', amount: 7400 },
    { month: 'Mar', amount: 7400 },
    { month: 'Apr', amount: 7400 },
    { month: 'May', amount: 7400 },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-[#6B1B2A] mb-1 uppercase tracking-tight">Tenant Portal</h2>
          <p className="text-[#6B7280] text-sm flex items-center gap-2">
            Welcome back, <span className="font-bold text-[#374151]">{user?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-[#374151]">Unit {room?.id}</div>
            <div className="text-xs text-[#6B7280]">{room?.floor}</div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 bg-[#FEE2E2] text-[#991B1B] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#FCA5A5] transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`${commonStyles.card} flex items-center gap-4 border-l-4 border-l-[#6B1B2A]`}>
              <div className="p-3 bg-red-50 rounded-xl text-[#6B1B2A]">
                <CreditCard size={24} />
              </div>
              <div>
                <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Rent Status</div>
                <div className={`text-sm font-black ${rentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>
                  {rentStatus}
                </div>
              </div>
            </div>
            <div className={`${commonStyles.card} flex items-center gap-4 border-l-4 border-l-[#3B82F6]`}>
              <div className="p-3 bg-blue-50 rounded-xl text-[#3B82F6]">
                <Droplets size={24} />
              </div>
              <div>
                <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Water Bill</div>
                <div className="text-sm font-black text-[#374151]">KES 400.00</div>
              </div>
            </div>
            <div className={`${commonStyles.card} flex items-center gap-4 border-l-4 border-l-[#F59E0B]`}>
              <div className="p-3 bg-amber-50 rounded-xl text-[#F59E0B]">
                <AlertCircle size={24} />
              </div>
              <div>
                <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Penalties</div>
                <div className="text-sm font-black text-[#374151]">KES 0.00</div>
              </div>
            </div>
          </div>

          {/* Payment History Chart */}
          <div className={commonStyles.card}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-[#6B1B2A] text-lg uppercase tracking-tight">Payment History</h3>
              <div className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle size={12} /> 100% Reliable
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#6B1B2A' : '#C0C0C8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Invoices Table */}
          <div className={commonStyles.card}>
            <h3 className="font-black text-[#6B1B2A] text-lg uppercase tracking-tight mb-6">Invoices & Receipts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 text-xs font-black text-[#6B7280] uppercase tracking-widest">Description</th>
                    <th className="pb-4 text-xs font-black text-[#6B7280] uppercase tracking-widest">Amount</th>
                    <th className="pb-4 text-xs font-black text-[#6B7280] uppercase tracking-widest text-center">Status</th>
                    <th className="pb-4 text-xs font-black text-[#6B7280] uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-400 text-sm">No invoices found.</td>
                    </tr>
                  ) : invoices.map(inv => (
                    <tr key={inv.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <div className="text-sm font-bold text-[#374151]">{inv.type}</div>
                        <div className="text-[10px] text-gray-400">Due: {new Date(inv.dueDate).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4 text-sm font-bold text-[#374151]">
                        KES {inv.amount.toLocaleString()}
                      </td>
                      <td className="py-4">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            inv.status === 'PAID' ? 'bg-green-100 text-green-700' : 
                            inv.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-[#6B1B2A] transition-colors">
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Notice Form */}
          <div className={commonStyles.card}>
            <h3 className="font-black text-[#6B1B2A] text-lg uppercase tracking-tight mb-6 flex items-center gap-2">
              <Wrench size={20} /> Quick Service
            </h3>
            <form onSubmit={handleNoticeSubmit} className="space-y-4">
              <div>
                <label className={commonStyles.label}>Request Type</label>
                <select 
                  className={commonStyles.input}
                  value={noticeForm.type}
                  onChange={e => setNoticeForm({...noticeForm, type: e.target.value})}
                >
                  <option value="MAINTENANCE">🔧 Maintenance Request</option>
                  <option value="VACATION">🚪 Vacation Notice</option>
                </select>
              </div>
              <div>
                <label className={commonStyles.label}>Description</label>
                <textarea 
                  className={`${commonStyles.input} h-32 resize-none`}
                  placeholder="Tell us what's on your mind..."
                  value={noticeForm.content}
                  onChange={e => setNoticeForm({...noticeForm, content: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`${commonStyles.buttonPrimary} w-full flex items-center justify-center gap-2`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Submit Request</>
                )}
              </button>
            </form>
          </div>

          {/* Activity Log / Announcements */}
          <div className={commonStyles.card}>
            <h3 className="font-black text-[#6B1B2A] text-lg uppercase tracking-tight mb-6 flex items-center gap-2">
              <Bell size={20} /> Latest Notices
            </h3>
            <div className="space-y-4">
              {profile?.notices?.slice(0, 5).map(n => (
                <div key={n.id} className="flex gap-3 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${n.status === 'PENDING' ? 'bg-amber-500' : 'bg-green-500'}`} />
                  <div>
                    <div className="text-[11px] font-black text-[#374151] uppercase tracking-wider">{n.type}</div>
                    <p className="text-[13px] text-[#6B7280] line-clamp-2">{n.content}</p>
                    <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 italic">
                      <Clock size={10} /> {new Date(n.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {(!profile?.notices || profile.notices.length === 0) && (
                <p className="text-center text-gray-400 text-xs py-4 italic">No active requests or notices.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
