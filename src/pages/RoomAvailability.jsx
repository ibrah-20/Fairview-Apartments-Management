import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Upload, X } from 'lucide-react';

export default function RoomAvailability() {
  const apartments = useStore(state => state.apartments);
  const addBooking = useStore(state => state.addBooking);
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const floors = useMemo(() => {
    const grouped = {};
    const floorOrder = ['G', 'A', 'B', 'C', 'D', 'E'];
    
    floorOrder.forEach(prefix => {
      grouped[prefix] = apartments.filter(a => a.floorPrefix === prefix).sort((a, b) => a.number - b.number);
    });
    return grouped;
  }, [apartments]);

  const totalVacant = apartments.filter(a => a.status === 'vacant').length;

  const handleBook = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      addBooking({
        apartmentId: selectedRoom.id,
        applicantName: bookingForm.name,
        email: bookingForm.email,
        phone: bookingForm.phone,
        idDocumentUrl: 'mock-url'
      });
      setIsSubmitting(false);
      setSelectedRoom(null);
      setBookingForm({ name: '', email: '', phone: '' });
      alert('Booking request submitted successfully! Admin will review shortly.');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Room Availability</h1>
        <p className="text-gray-600 dark:text-gray-400">Real-time status of all apartments</p>
        
        <div className="flex justify-center gap-6 mt-8">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500"></div> Vacant</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500"></div> Occupied</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-yellow-500"></div> Reserved</div>
        </div>
      </div>

      {totalVacant === 0 && (
        <div className="bg-red-500/10 border border-red-500 text-red-600 dark:text-red-400 p-6 rounded-2xl text-center mb-12 font-bold text-xl">
          No Vacant Rooms Available
        </div>
      )}

      <div className="space-y-12">
        {Object.entries(floors).reverse().map(([prefix, rooms]) => (
          <div key={prefix} className="glass-card p-6 md:p-8 relative">
            <h3 className="text-2xl font-bold font-heading mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
              {rooms[0]?.floorName}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-4">
              {rooms.map(room => (
                <button
                  key={room.id}
                  disabled={room.status !== 'vacant'}
                  onClick={() => setSelectedRoom(room)}
                  className={`
                    relative p-4 rounded-xl flex flex-col items-center justify-center transition-all min-h-[100px]
                    ${room.status === 'vacant' ? 'bg-green-500/10 border-2 border-green-500 hover:bg-green-500 hover:text-white cursor-pointer group' : ''}
                    ${room.status === 'occupied' ? 'bg-red-500/10 border border-red-500/50 opacity-60 cursor-not-allowed' : ''}
                    ${room.status === 'reserved' ? 'bg-yellow-500/10 border border-yellow-500/50 opacity-80 cursor-not-allowed' : ''}
                  `}
                >
                  <span className="text-lg font-bold font-mono">{room.id}</span>
                  {room.isCorner && (
                    <span className="absolute top-2 right-2 text-[10px] uppercase font-bold text-brand-maroon dark:text-brand-silver">
                      Corner
                    </span>
                  )}
                  {room.status === 'vacant' && (
                    <span className="text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-2">
                      Book Now
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-brand-dark rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800 relative"
            >
              <button 
                onClick={() => setSelectedRoom(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold font-heading mb-2">Book Room {selectedRoom.id}</h2>
              <p className="text-gray-500 mb-6 flex justify-between border-b pb-4">
                <span>{selectedRoom.floorName} {selectedRoom.isCorner ? '(Corner)' : ''}</span>
                <span className="font-bold text-brand-maroon">KES {selectedRoom.price.toLocaleString()}/mo</span>
              </p>

              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input 
                    required type="text" 
                    value={bookingForm.name} onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-brand-maroon outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input 
                    required type="email" 
                    value={bookingForm.email} onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-brand-maroon outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input 
                    required type="tel" 
                    value={bookingForm.phone} onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-brand-maroon outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ID/Passport Upload</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                    <Upload className="w-8 h-8 mb-2 text-brand-maroon" />
                    <span className="text-sm">Click to upload document</span>
                  </div>
                </div>

                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full py-4 mt-4 bg-brand-maroon text-white rounded-xl font-bold hover:bg-brand-maroon-light transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
