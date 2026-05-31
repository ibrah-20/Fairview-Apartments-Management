import React, { useState, useEffect } from 'react';
import { Droplets, ShieldCheck, Clock, CheckCircle, Truck, Package, Info, MapPin, Phone, User, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const WaterPublic = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    location: '',
    litersPerUnit: 20,
    quantity: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [freeDeliveryEligible, setFreeDeliveryEligible] = useState(false);

  useEffect(() => {
    checkOperatingHours();
    const interval = setInterval(checkOperatingHours, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkDeliveryEligibility();
  }, [form.litersPerUnit, form.quantity]);

  const checkOperatingHours = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun
    const hours = now.getHours();
    
    // Mon-Sat (1-6), 9 AM - 8 PM (9 - 20)
    if (day !== 0 && hours >= 9 && hours < 20) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const checkDeliveryEligibility = () => {
    const pricing = { 1: 10, 5: 50, 10: 100, 20: 200 };
    const price = pricing[form.litersPerUnit];
    const total = price * form.quantity;
    
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const timeVal = hours + mins / 60;
    
    const inWindow = (timeVal >= 12.5 && timeVal <= 13.0) || (timeVal >= 14.0 && timeVal <= 17.0);
    const validVolume = form.litersPerUnit === 10 || form.litersPerUnit === 20;
    
    setFreeDeliveryEligible(inWindow && validVolume && total >= 100);
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!isOpen) {
      return toast.error("We are currently closed. Please order during operating hours.");
    }

    setIsSubmitting(true);
    try {
      await api.post('/water/orders', form);
      toast.success("Order Placed Successfully! We are on our way.");
      setForm({ customerName: '', phone: '', location: '', litersPerUnit: 20, quantity: 1 });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPrice = () => {
    const pricing = { 1: 10, 5: 50, 10: 100, 20: 200 };
    return pricing[form.litersPerUnit] * form.quantity;
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-blue-900 py-24 px-6 text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-800 to-gray-900 z-0 opacity-90" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-blue-500/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 text-blue-300 border border-blue-400/30">
            <Droplets size={40} />
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-4 tracking-tight">
            City Lake Water Services
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 font-light max-w-2xl mx-auto leading-relaxed mb-8">
            Premium 6-stage reverse osmosis purified water. 
          </p>
          <div className="flex justify-center gap-4">
            <span className={`px-6 py-2 rounded-full font-bold text-sm tracking-widest uppercase flex items-center gap-2 ${isOpen ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-red-500 text-white shadow-lg shadow-red-500/30'}`}>
              <Clock size={16} /> {isOpen ? 'We Are Open' : 'Currently Closed'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Info & Delivery */}
        <div className="lg:col-span-2 space-y-10">
          
          <div className="enterprise-card p-8 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-surface-dark border-none shadow-xl">
            <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
              <Droplets className="text-blue-500" /> Refill Pricing
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: 1, p: 10 },
                { l: 5, p: 50 },
                { l: 10, p: 100 },
                { l: 20, p: 200 }
              ].map(item => (
                <div key={item.l} className="bg-white dark:bg-surface-hover-dark p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 text-center transform transition-transform hover:-translate-y-1">
                  <Package size={24} className="mx-auto text-blue-400 mb-2" />
                  <span className="block font-bold text-lg">{item.l} Liters</span>
                  <span className="block font-black text-2xl text-blue-600 dark:text-blue-400 mt-2">KES {item.p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info Blocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Delivery Rules */}
            <div className="enterprise-card p-0 overflow-hidden border border-blue-100 dark:border-blue-900/30 h-full">
              <div className="bg-blue-600 p-6 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl flex items-center gap-2"><Truck /> Free Delivery</h3>
                </div>
              </div>
              <div className="p-6 bg-blue-50 dark:bg-blue-900/10 h-full">
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <Clock className="text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold">Eligible Windows</h4>
                      <ul className="text-sm text-text-muted-light dark:text-text-muted-dark mt-2 space-y-1">
                        <li>Lunch: 12:30 PM - 1:00 PM</li>
                        <li>Afternoon: 2:00 PM - 5:00 PM</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <CheckCircle className="text-green-600 dark:text-green-400 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold">Conditions</h4>
                      <ul className="text-sm text-text-muted-light dark:text-text-muted-dark mt-2 space-y-1">
                        <li>Minimum spend: KES 100</li>
                        <li>10L or 20L containers only</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="enterprise-card p-0 overflow-hidden border border-blue-100 dark:border-blue-900/30 h-full">
              <div className="bg-blue-600 p-6 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl flex items-center gap-2"><Clock /> Operating Hours</h3>
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-surface-dark h-full">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-silver-light dark:divide-surface-hover-dark">
                    <tr>
                      <td className="py-3 font-semibold text-text-muted-light dark:text-text-muted-dark">Monday - Friday</td>
                      <td className="py-3 text-right font-bold">9:00 AM - 8:00 PM</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-text-muted-light dark:text-text-muted-dark">Saturday</td>
                      <td className="py-3 text-right font-bold">9:00 AM - 8:00 PM</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-maroon dark:text-maroon-light">Sunday</td>
                      <td className="py-3 text-right font-bold text-maroon dark:text-maroon-light">CLOSED</td>
                    </tr>
                  </tbody>
                </table>
                <div className={`mt-4 p-3 rounded-lg flex items-center justify-center gap-2 font-bold ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isOpen ? (
                    <><CheckCircle size={18} /> We are currently Open</>
                  ) : (
                    <><Clock size={18} /> We are currently Closed</>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Order Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleOrder} className="enterprise-card p-6 md:p-8 sticky top-6 shadow-2xl shadow-blue-900/5">
            <h3 className="font-heading font-black text-2xl mb-6">Order Refill</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Customer Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
                  <input required value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
                  <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="0712345678" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Apartment / Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
                  <input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="A1, Fairview" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Refill Type</label>
                  <select value={form.litersPerUnit} onChange={e => setForm({...form, litersPerUnit: parseInt(e.target.value)})} className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500">
                    <option value={1}>1 Liter</option>
                    <option value={5}>5 Liters</option>
                    <option value={10}>10 Liters</option>
                    <option value={20}>20 Liters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Quantity</label>
                  <input required type="number" min="1" max="50" value={form.quantity} onChange={e => setForm({...form, quantity: parseInt(e.target.value) || 1})} className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {/* Live Order Summary */}
              <div className="mt-6 pt-6 border-t border-silver-light dark:border-surface-hover-dark">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-muted-light dark:text-text-muted-dark font-medium">Subtotal</span>
                  <span className="font-bold">KES {getPrice()}</span>
                </div>
                
                {freeDeliveryEligible ? (
                  <div className="flex justify-between items-center text-sm mb-4 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                    <span><Truck size={16} className="inline mr-1"/> Delivery</span>
                    <span>FREE</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-xs text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-4">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    <span>Free delivery not available for this time/quantity. Normal fees may apply on dropoff.</span>
                  </div>
                )}

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold">Total Pay</span>
                  <span className="text-3xl font-black text-blue-600 dark:text-blue-400">KES {getPrice()}</span>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || !isOpen}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${!isOpen ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'}`}
                >
                  {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit Order'}
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default WaterPublic;
