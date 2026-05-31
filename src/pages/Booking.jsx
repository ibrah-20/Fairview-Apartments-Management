import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { ClipboardCheck, Phone, User, Mail, Upload, Building, Info } from 'lucide-react';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomIdFromUrl = searchParams.get('room') || "";

  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    phone: "", 
    email: "", 
    idNo: "", 
    roomId: roomIdFromUrl 
  });

  useEffect(() => {
    fetchVacantRooms();
  }, []);

  const fetchVacantRooms = async () => {
    try {
      const response = await api.get('/apartments/rooms');
      if (response.data && response.data.length > 0) {
        setRooms(response.data.filter(r => r.status === 'VACANT'));
      } else {
        // Fallback if DB is empty
        setRooms([{ id: roomIdFromUrl || 'A1', price: 7000, floor: 'First Floor', isCorner: false, status: 'VACANT' }]);
      }
    } catch (error) {
      console.error(error);
      setRooms([{ id: roomIdFromUrl || 'A1', price: 7000, floor: 'First Floor', isCorner: false, status: 'VACANT' }]);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.roomId) return toast.error("Please select a room");
    
    setIsSubmitting(true);
    try {
      await api.post('/apartments/bookings', {
        applicantName: form.name,
        phone: form.phone,
        email: form.email,
        roomId: form.roomId
      });
      
      toast.success("Booking Request Submitted! We'll contact you soon.");
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRoom = rooms.find(r => r.id === form.roomId);

  if (loadingRooms) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maroon"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-text-light dark:text-text-dark">Reserve Your Apartment</h2>
        <p className="text-text-muted-light dark:text-text-muted-dark mt-2">Provide your details and we'll handle the rest.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="enterprise-card p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
                  <input 
                    required
                    className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-maroon"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
                  <input 
                    required
                    type="tel"
                    className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-maroon"
                    placeholder="0712..."
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Email Address *</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
                  <input 
                    required
                    type="email"
                    className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-maroon"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Room Number *</label>
                <div className="relative">
                  <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
                  <select 
                    required
                    className="w-full bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-maroon appearance-none"
                    value={form.roomId}
                    onChange={e => setForm({...form, roomId: e.target.value})}
                  >
                    <option value="">Select a room</option>
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.id} - KES {r.price?.toLocaleString()} ({r.floor})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">ID / Passport Copy (Optional)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-silver-light dark:border-surface-hover-dark border-dashed rounded-lg hover:border-maroon transition-colors cursor-pointer group">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-text-muted-light dark:text-text-muted-dark group-hover:text-maroon" />
                  <div className="flex justify-center text-sm">
                    <label className="relative cursor-pointer font-medium text-maroon hover:text-maroon-dark focus-within:outline-none">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" />
                    </label>
                    <p className="pl-1 text-text-muted-light dark:text-text-muted-dark">or drag and drop</p>
                  </div>
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg shadow-xl shadow-maroon/20 transform hover:-translate-y-1 transition-all"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><ClipboardCheck size={20} /> Submit Booking Request</>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="enterprise-card bg-maroon dark:bg-maroon-dark text-white border-none shadow-xl p-6">
            <h3 className="font-heading font-bold text-xl mb-4 flex items-center gap-2">
              <Building size={20} /> Selected Room
            </h3>
            {selectedRoom ? (
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/70">Room ID</span>
                  <span className="font-bold text-lg">{selectedRoom.id}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/70">Floor</span>
                  <span className="font-semibold">{selectedRoom.floor}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/70">Type</span>
                  <span className="font-semibold">{selectedRoom.isCorner ? "Corner Unit" : "Standard Unit"}</span>
                </div>
                <div className="pt-4">
                  <span className="text-white/70 block mb-1">Monthly Rent</span>
                  <span className="text-4xl font-black">KES {selectedRoom.price?.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-white/60 italic text-sm">Please select a room to see details and pricing.</p>
            )}
          </div>

          <div className="enterprise-card border-l-4 border-l-yellow-500 p-6">
            <h4 className="font-bold text-yellow-700 dark:text-yellow-500 mb-2 flex items-center gap-2">
              <Info size={16} /> Important Note
            </h4>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed">
              Submitting a request reserves the room for 24 hours while management reviews your application. You will receive an email or call with the next steps for payment and moving in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
