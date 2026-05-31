import React, { useState } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import { Save, CheckCircle, Clock } from 'lucide-react';

const WaterSales = () => {
  const [form, setForm] = useState({
    customerName: '',
    litersPerUnit: 20,
    quantity: 1,
    orderType: 'PICKUP',
    paymentMethod: 'CASH',
    mpesaRef: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pricing = { 1: 10, 5: 50, 10: 100, 20: 200 };
  const totalAmount = pricing[form.litersPerUnit] * form.quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/water/sales', { ...form, amount: totalAmount });
      toast.success('Sale recorded successfully!');
      setForm({
        ...form,
        customerName: '',
        quantity: 1,
        mpesaRef: '',
        notes: ''
      });
    } catch (error) {
      toast.error('Failed to record sale');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">Digital Sales Recording</h2>
        <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Record new water sales instantly to the ledger.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 enterprise-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Customer Name</label>
                <input required className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-maroon" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} placeholder="Walk-in or Name" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Product Size</label>
                <select className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-maroon" value={form.litersPerUnit} onChange={e => setForm({...form, litersPerUnit: parseInt(e.target.value)})}>
                  <option value={1}>1 Liter Refill (KES 10)</option>
                  <option value={5}>5 Liters Refill (KES 50)</option>
                  <option value={10}>10 Liters Refill (KES 100)</option>
                  <option value={20}>20 Liters Refill (KES 200)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Quantity</label>
                <input required type="number" min="1" className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-maroon" value={form.quantity} onChange={e => setForm({...form, quantity: parseInt(e.target.value) || 1})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Order Type</label>
                <select className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-maroon" value={form.orderType} onChange={e => setForm({...form, orderType: e.target.value})}>
                  <option value="PICKUP">Pickup (Walk-in)</option>
                  <option value="DELIVERY">Delivery</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Payment Method</label>
                <select className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-maroon" value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})}>
                  <option value="CASH">Cash</option>
                  <option value="MPESA">M-Pesa</option>
                  <option value="BANK">Bank Transfer</option>
                  <option value="PENDING">Pending / Credit</option>
                </select>
              </div>
              {form.paymentMethod === 'MPESA' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">M-Pesa Reference</label>
                  <input required className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-maroon uppercase" value={form.mpesaRef} onChange={e => setForm({...form, mpesaRef: e.target.value.toUpperCase()})} placeholder="e.g. QWE123RTY" />
                </div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {isSubmitting ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5" /> : <><Save size={18} /> Record Sale (KES {totalAmount})</>}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="enterprise-card p-6 bg-surface-dark text-white border-none shadow-xl">
            <h3 className="font-heading font-bold mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/70">Subtotal</span>
                <span className="font-bold">KES {totalAmount}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/70">Delivery Fee</span>
                <span className="font-bold">KES 0</span>
              </div>
              <div className="pt-2">
                <span className="text-white/70 block text-sm">Total Due</span>
                <span className="text-3xl font-black text-maroon-light">KES {totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterSales;
