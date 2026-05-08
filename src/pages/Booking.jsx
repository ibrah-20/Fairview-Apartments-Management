import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { commonStyles, colors } from '../utils/theme';
import { ClipboardCheck, Phone, User, Mail, Upload, Building } from 'lucide-react';

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
      const response = await api.get('/rooms');
      setRooms(response.data.filter(r => r.status === 'VACANT'));
    } catch (error) {
      // Handled
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.roomId) return toast.error("Please select a room");
    
    setIsSubmitting(true);
    try {
      await api.post('/bookings', {
        applicantName: form.name,
        phone: form.phone,
        email: form.email,
        roomId: form.roomId
      });
      
      toast.success("Booking Request Submitted! We'll contact you soon.", {
        duration: 5000,
        style: { borderRadius: '10px', background: '#333', color: '#fff', border: '2px solid #059669' }
      });
      navigate('/');
    } catch (error) {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRoom = rooms.find(r => r.id === form.roomId);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <h2 className={commonStyles.sectionTitle}>Reserve Your Apartment</h2>
        <p className={commonStyles.sectionSub}>Provide your details and we'll handle the rest.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className={`${commonStyles.card} space-y-6`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={commonStyles.label}>Full Name *</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    required
                    className={`${commonStyles.input} pl-10`}
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className={commonStyles.label}>Phone Number *</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    required
                    type="tel"
                    className={`${commonStyles.input} pl-10`}
                    placeholder="0712..."
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={commonStyles.label}>Email Address *</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    required
                    type="email"
                    className={`${commonStyles.input} pl-10`}
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className={commonStyles.label}>Room Number *</label>
                <div className="relative">
                  <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select 
                    required
                    className={`${commonStyles.input} pl-10 appearance-none`}
                    value={form.roomId}
                    onChange={e => setForm({...form, roomId: e.target.value})}
                  >
                    <option value="">Select a room</option>
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.id} - KES {r.price.toLocaleString()} ({r.floor})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className={commonStyles.label}>ID / Passport Copy (Optional)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#6B1B2A] transition-colors cursor-pointer group">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#6B1B2A]" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#6B1B2A] hover:text-[#4A1019] focus-within:outline-none">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`${commonStyles.buttonPrimary} w-full py-4 flex items-center justify-center gap-2 text-lg shadow-xl shadow-maroon/20 transform hover:-translate-y-1 transition-all`}
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
          <div className={`${commonStyles.card} bg-[#6B1B2A] text-white border-none shadow-xl`}>
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
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
                  <span className="text-4xl font-black">KES {selectedRoom.price.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-white/60 italic text-sm">Please select a room to see details and pricing.</p>
            )}
          </div>

          <div className={`${commonStyles.card} border-l-4 border-l-[#FBBF24]`}>
            <h4 className="font-bold text-[#92400E] mb-2 flex items-center gap-2">
              <Info size={16} /> Important Note
            </h4>
            <p className="text-xs text-[#92400E] leading-relaxed">
              Submitting a request reserves the room for 24 hours while management reviews your application. You will receive an email or call with the next steps for payment and moving in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
