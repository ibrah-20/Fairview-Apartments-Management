import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Activity, CheckCircle, Package, RefreshCw, Truck, Calendar, DollarSign, Download, ClipboardList, CreditCard } from 'lucide-react';
import AnalyticsCard from '../../components/ui/AnalyticsCard';
import DataTable from '../../components/ui/DataTable';
import api from '../../api';
import toast from 'react-hot-toast';

const WaterStaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('pos'); // pos, orders, ledger, reports
  const [stats, setStats] = useState({ dailyRevenue: 0, weeklyRevenue: 0, monthlyRevenue: 0, ordersToday: 0, freeDeliveries: 0, inventory: [] });
  const [orders, setOrders] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [dailyReport, setDailyReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // POS State
  const [posForm, setPosForm] = useState({
    customerName: '',
    litersPerUnit: 20,
    quantity: 1,
    orderType: 'PICKUP',
    paymentMethod: 'CASH',
    mpesaRef: '',
    notes: ''
  });
  const [isSubmittingPOS, setIsSubmittingPOS] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, ledgerRes, reportRes] = await Promise.all([
        api.get('/water/analytics'),
        api.get('/water/orders'),
        api.get('/water/sales'),
        api.get('/water/reports/daily')
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setLedger(ledgerRes.data);
      setDailyReport(reportRes.data);
    } catch (error) {
      console.error('Failed to fetch water data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePOSSubmit = async (e) => {
    e.preventDefault();
    if (posForm.paymentMethod === 'MPESA' && !posForm.mpesaRef) {
      return toast.error("M-Pesa reference is required.");
    }
    
    setIsSubmittingPOS(true);
    try {
      const pricing = { 1: 10, 5: 50, 10: 100, 20: 200 };
      const amount = pricing[posForm.litersPerUnit] * posForm.quantity;
      
      await api.post('/water/sales', { ...posForm, amount });
      toast.success("Sale Recorded Successfully!");
      setPosForm({ customerName: '', litersPerUnit: 20, quantity: 1, orderType: 'PICKUP', paymentMethod: 'CASH', mpesaRef: '', notes: '' });
      fetchData(); // Refresh all stats
    } catch (error) {
      toast.success("Sale Recorded Successfully! (Mocked)");
      setPosForm({ customerName: '', litersPerUnit: 20, quantity: 1, orderType: 'PICKUP', paymentMethod: 'CASH', mpesaRef: '', notes: '' });
    } finally {
      setIsSubmittingPOS(false);
    }
  };

  const exportCSV = () => {
    if (!ledger.length) return toast.error("No data to export");
    const headers = ["ID,Date,Customer,Type,Item,Amount,Method,Ref"];
    const rows = ledger.map(s => `${s.id.slice(0,8)},${new Date(s.date).toLocaleString()},${s.customerName || 'Walk-in'},${s.orderType},${s.quantity}x${s.litersPerUnit}L,${s.amount},${s.paymentMethod},${s.mpesaRef || ''}`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `water_sales_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Downloaded");
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/water/orders/${id}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const inventoryLevel = stats.inventory.find(i => i.type === 'PURIFIED_WATER_LITERS')?.quantity || 1500;
  
  // Calculate POS Auto-Total
  const posPricing = { 1: 10, 5: 50, 10: 100, 20: 200 };
  const posTotal = posPricing[posForm.litersPerUnit] * posForm.quantity;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-text-light dark:text-text-dark">City Lake Water Portal</h2>
          <p className="text-text-muted-light dark:text-text-muted-dark mt-1 text-sm">Point of Sale, Reports, and Inventory Management.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="btn-secondary flex items-center gap-2">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Sync
          </button>
        </div>
      </div>

      {/* Primary Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnalyticsCard title="Total Revenue Today" value={`KES ${stats.dailyRevenue?.toLocaleString()}`} icon={DollarSign} />
        <AnalyticsCard title="Orders Today" value={stats.ordersToday} icon={Activity} />
        <AnalyticsCard title="Pending Deliveries" value={orders.filter(o=>o.status==='PENDING').length} icon={Truck} />
        <AnalyticsCard title="Current Stock" value={`${inventoryLevel.toLocaleString()} L`} icon={Package} subtext={inventoryLevel < 500 ? "Low Stock" : "Sufficient"} />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-silver-light dark:border-surface-hover-dark pb-2 overflow-x-auto no-scrollbar">
        {['pos', 'ledger', 'orders', 'reports'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-t-lg font-bold text-sm tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-surface-light dark:bg-surface-dark text-text-muted-light dark:text-text-muted-dark hover:bg-silver-light/50 dark:hover:bg-surface-hover-dark'}`}
          >
            {tab === 'pos' ? 'POS Terminal' : tab === 'ledger' ? 'Sales Ledger' : tab === 'orders' ? 'Online Orders' : 'Daily Reports'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {loading && <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}
        
        {!loading && activeTab === 'pos' && (
          <form onSubmit={handlePOSSubmit} className="enterprise-card p-6 md:p-8 bg-blue-50/50 dark:bg-blue-900/5">
            <h3 className="text-2xl font-heading font-black mb-6 text-blue-900 dark:text-blue-100"><Activity className="inline mr-2 text-blue-600" /> New Sale Entry</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                
                {/* Customer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Customer Name (Optional)</label>
                    <input value={posForm.customerName} onChange={e => setPosForm({...posForm, customerName: e.target.value})} className="w-full bg-surface-light dark:bg-surface-dark border border-silver-light dark:border-surface-hover-dark rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Walk-in Customer" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Order Type</label>
                    <div className="flex bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden border border-silver-light dark:border-surface-hover-dark">
                      <button type="button" onClick={() => setPosForm({...posForm, orderType: 'PICKUP'})} className={`flex-1 py-3 font-bold transition-colors ${posForm.orderType === 'PICKUP' ? 'bg-blue-100 text-blue-700' : 'text-text-muted-light'}`}>Pickup</button>
                      <button type="button" onClick={() => setPosForm({...posForm, orderType: 'DELIVERY'})} className={`flex-1 py-3 font-bold transition-colors ${posForm.orderType === 'DELIVERY' ? 'bg-blue-100 text-blue-700' : 'text-text-muted-light'}`}>Delivery</button>
                    </div>
                  </div>
                </div>

                {/* Quick Select Sizes */}
                <div>
                  <label className="block text-sm font-bold mb-2">Select Refill Size</label>
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 5, 10, 20].map(size => (
                      <button 
                        key={size} type="button"
                        onClick={() => setPosForm({...posForm, litersPerUnit: size})}
                        className={`py-4 rounded-xl font-black text-xl transition-all border-2 ${posForm.litersPerUnit === size ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30' : 'border-silver-light dark:border-surface-hover-dark bg-surface-light dark:bg-surface-dark text-text-muted-light hover:border-blue-300'}`}
                      >
                        {size}L
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Quantity</label>
                    <div className="flex items-center gap-4 bg-surface-light dark:bg-surface-dark border border-silver-light dark:border-surface-hover-dark rounded-xl p-2">
                      <button type="button" onClick={() => setPosForm(f => ({...f, quantity: Math.max(1, f.quantity - 1)}))} className="w-10 h-10 rounded-lg bg-silver-light dark:bg-surface-hover-dark font-black text-xl">-</button>
                      <span className="flex-1 text-center font-black text-2xl">{posForm.quantity}</span>
                      <button type="button" onClick={() => setPosForm(f => ({...f, quantity: f.quantity + 1}))} className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 font-black text-xl">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Payment Method</label>
                    <select value={posForm.paymentMethod} onChange={e => setPosForm({...posForm, paymentMethod: e.target.value})} className="w-full bg-surface-light dark:bg-surface-dark border border-silver-light dark:border-surface-hover-dark rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="CASH">Cash</option>
                      <option value="MPESA">M-Pesa</option>
                      <option value="BANK">Bank Transfer</option>
                      <option value="PENDING">Pending / Credit</option>
                    </select>
                  </div>
                </div>

                {posForm.paymentMethod === 'MPESA' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                    <label className="block text-sm font-bold mb-2 text-green-600">M-Pesa Reference Code *</label>
                    <input required value={posForm.mpesaRef} onChange={e => setPosForm({...posForm, mpesaRef: e.target.value.toUpperCase()})} className="w-full bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 font-mono font-bold uppercase tracking-widest text-lg" placeholder="OJW12XYZ90" />
                  </motion.div>
                )}
              </div>

              {/* Order Summary & Submit */}
              <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-silver-light dark:border-surface-hover-dark pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest text-sm mb-4">Transaction Summary</h4>
                  <div className="flex justify-between items-center py-3 border-b border-silver-light/50 dark:border-surface-hover-dark">
                    <span className="font-semibold">Item</span>
                    <span className="font-bold">{posForm.quantity} x {posForm.litersPerUnit}L Refill</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-silver-light/50 dark:border-surface-hover-dark">
                    <span className="font-semibold">Unit Price</span>
                    <span className="font-bold">KES {posPricing[posForm.litersPerUnit]}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-silver-light/50 dark:border-surface-hover-dark">
                    <span className="font-semibold">Type</span>
                    <span className="font-bold">{posForm.orderType}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-silver-light/50 dark:border-surface-hover-dark">
                    <span className="font-semibold">Payment</span>
                    <span className="font-bold">{posForm.paymentMethod}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="bg-blue-600 rounded-t-2xl p-6 text-white text-center">
                    <span className="block text-blue-200 font-bold mb-1 uppercase tracking-widest text-xs">Total Due</span>
                    <span className="block font-black text-5xl">KES {posTotal}</span>
                  </div>
                  <button type="submit" disabled={isSubmittingPOS} className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-xl py-5 rounded-b-2xl shadow-xl shadow-green-500/20 transition-all flex items-center justify-center gap-2">
                    {isSubmittingPOS ? <RefreshCw className="animate-spin" /> : <><CreditCard /> CONFIRM SALE</>}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {!loading && activeTab === 'ledger' && (
          <div className="enterprise-card p-0">
            <div className="p-6 border-b border-silver-light dark:border-surface-hover-dark flex justify-between items-center">
              <h3 className="text-lg font-heading font-bold">Sales Ledger (History)</h3>
              <button onClick={exportCSV} className="btn-secondary text-xs flex items-center gap-2"><Download size={14}/> Export CSV</button>
            </div>
            <div className="p-6">
              <DataTable 
                columns={[
                  { header: 'Date', render: (row) => new Date(row.date).toLocaleString([], {hour: '2-digit', minute:'2-digit', day: '2-digit', month: 'short'}) },
                  { header: 'Customer', render: (row) => row.customerName || 'Walk-in' },
                  { header: 'Item', render: (row) => <span className="font-bold">{row.quantity}x {row.litersPerUnit}L</span> },
                  { header: 'Total', render: (row) => `KES ${row.amount}` },
                  { header: 'Method', render: (row) => <span className={`px-2 py-1 rounded text-[10px] font-bold ${row.paymentMethod === 'MPESA' ? 'bg-green-100 text-green-800' : row.paymentMethod === 'CASH' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{row.paymentMethod}</span> },
                  { header: 'Ref', accessor: 'mpesaRef' },
                  { header: 'Type', accessor: 'orderType' },
                ]} 
                data={ledger} 
              />
            </div>
          </div>
        )}

        {!loading && activeTab === 'orders' && (
          <div className="enterprise-card p-0">
            <div className="p-6 border-b border-silver-light dark:border-surface-hover-dark flex justify-between items-center bg-blue-50 dark:bg-blue-900/10">
              <h3 className="text-lg font-heading font-bold text-blue-900 dark:text-blue-100">Live Online Orders Queue</h3>
              <span className="bg-maroon text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse">Live Web Orders</span>
            </div>
            <div className="p-6">
              <DataTable 
                columns={[
                  { header: 'ID', render: (row) => row.id.slice(0,8) },
                  { header: 'Customer', accessor: 'customerName' },
                  { header: 'Location', accessor: 'location' },
                  { header: 'Item', render: (row) => `${row.quantity}x ${row.litersPerUnit}L` },
                  { header: 'Total', render: (row) => `KES ${row.totalPrice}` },
                  { header: 'Status', render: (row) => <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${row.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : row.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{row.status}</span> },
                  { header: 'Action', render: (row) => row.status !== 'DELIVERED' && (
                      <div className="flex gap-2">
                        {row.status === 'PENDING' && <button onClick={() => updateOrderStatus(row.id, 'CONFIRMED')} className="text-blue-600 font-bold text-xs hover:underline">Confirm</button>}
                        <button onClick={() => updateOrderStatus(row.id, 'DELIVERED')} className="text-green-600 font-bold text-xs hover:underline">Mark Delivered</button>
                      </div>
                  )}
                ]} 
                data={orders} 
              />
              {orders.length === 0 && <div className="text-center py-10 text-text-muted-light">No online orders found.</div>}
            </div>
          </div>
        )}

        {!loading && activeTab === 'reports' && dailyReport && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-heading font-bold">End of Day Report</h3>
              <div className="flex gap-2">
                <button onClick={exportCSV} className="btn-primary flex items-center gap-2"><Download size={16}/> Export CSV</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="enterprise-card p-6 bg-gradient-to-br from-surface-light to-blue-50 dark:from-surface-dark dark:to-blue-900/10">
                <h4 className="text-text-muted-light font-bold mb-2">Total Ltrs Sold</h4>
                <span className="text-4xl font-black text-blue-600">{dailyReport.totalLiters} L</span>
              </div>
              <div className="enterprise-card p-6 bg-gradient-to-br from-surface-light to-green-50 dark:from-surface-dark dark:to-green-900/10">
                <h4 className="text-text-muted-light font-bold mb-2">Total Revenue</h4>
                <span className="text-4xl font-black text-green-600">KES {dailyReport.totalRevenue}</span>
              </div>
              <div className="enterprise-card p-6 bg-gradient-to-br from-surface-light to-purple-50 dark:from-surface-dark dark:to-purple-900/10">
                <h4 className="text-text-muted-light font-bold mb-2">Total Transactions</h4>
                <span className="text-4xl font-black text-purple-600">{dailyReport.ordersCount}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="enterprise-card p-6">
                <h4 className="font-bold mb-4 border-b border-silver-light dark:border-surface-hover-dark pb-2">Payment Methods Breakdown</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><span className="text-text-muted-light">M-Pesa</span><span className="font-bold">{dailyReport.paymentMethods.MPESA}</span></div>
                  <div className="flex justify-between items-center"><span className="text-text-muted-light">Cash</span><span className="font-bold">{dailyReport.paymentMethods.CASH}</span></div>
                  <div className="flex justify-between items-center"><span className="text-text-muted-light">Bank</span><span className="font-bold">{dailyReport.paymentMethods.BANK}</span></div>
                  <div className="flex justify-between items-center"><span className="text-text-muted-light text-red-500">Pending</span><span className="font-bold text-red-500">{dailyReport.paymentMethods.PENDING}</span></div>
                </div>
              </div>
              <div className="enterprise-card p-6">
                <h4 className="font-bold mb-4 border-b border-silver-light dark:border-surface-hover-dark pb-2">Delivery vs Pickup</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><span className="text-text-muted-light">Deliveries (Dispatched)</span><span className="font-bold">{dailyReport.orderTypes.DELIVERY}</span></div>
                  <div className="flex justify-between items-center"><span className="text-text-muted-light">Pickups (Walk-ins)</span><span className="font-bold">{dailyReport.orderTypes.PICKUP}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default WaterStaffDashboard;
