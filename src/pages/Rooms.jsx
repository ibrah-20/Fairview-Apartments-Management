import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { commonStyles, colors } from '../utils/theme';
import { Filter, Star, Info } from 'lucide-react';

const floors = [
  { id: "G", label: "Ground Floor", prefix: "G" },
  { id: "A", label: "First Floor", prefix: "A" },
  { id: "B", label: "Second Floor", prefix: "B" },
  { id: "C", label: "Third Floor", prefix: "C" },
  { id: "D", label: "Fourth Floor", prefix: "D" },
  { id: "E", label: "Fifth Floor", prefix: "E" },
];

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filterFloor, setFilterFloor] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      // Handled by api interceptor
    } finally {
      setLoading(false);
    }
  };

  const filteredFloors = filterFloor === "ALL" ? floors : floors.filter(f => f.id === filterFloor);
  const vacantCount = rooms.filter(r => r.status === "VACANT").length;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B1B2A]"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h2 className={commonStyles.sectionTitle}>Room Availability</h2>
      <p className={commonStyles.sectionSub}>Browse all units by floor. Click a vacant room to book.</p>

      {vacantCount === 0 && (
        <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl p-4 text-center text-[#991B1B] font-bold mb-8">
          ⚠️ No Vacant Rooms Available at the moment.
        </div>
      )}

      {/* Filters & Legend */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={18} className="text-[#6B7280]" />
          <select 
            className={`${commonStyles.input} !w-auto py-1.5`} 
            value={filterFloor} 
            onChange={e => setFilterFloor(e.target.value)}
          >
            <option value="ALL">All Floors</option>
            {floors.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#D1FAE5] border border-[#065F46]" />
            <span className="text-xs font-semibold text-[#6B7280]">Vacant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FEE2E2] border border-[#991B1B]" />
            <span className="text-xs font-semibold text-[#6B7280]">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FEF9C3] border border-[#92400E]" />
            <span className="text-xs font-semibold text-[#6B7280]">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-xl border-2 border-[#7C3AED] px-1 text-[8px] font-black text-[#7C3AED]">★</div>
            <span className="text-xs font-semibold text-[#6B7280]">Corner</span>
          </div>
        </div>
      </div>

      {/* Floors Grid */}
      <div className="space-y-12">
        {filteredFloors.map(f => (
          <div key={f.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#6B1B2A] text-white px-4 py-1 rounded-lg text-sm font-bold uppercase tracking-wider">{f.label}</span>
              <div className="h-[1px] flex-1 bg-gray-100" />
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-15 gap-3">
              {rooms.filter(r => r.id.startsWith(f.prefix)).sort((a,b) => {
                const numA = parseInt(a.id.slice(1));
                const numB = parseInt(b.id.slice(1));
                return numA - numB;
              }).map(r => (
                <div
                  key={r.id}
                  onClick={() => r.status === "VACANT" && navigate(`/booking?room=${r.id}`)}
                  className={`
                    relative group cursor-pointer aspect-square flex flex-col items-center justify-center rounded-xl transition-all border-2
                    ${r.status === "VACANT" ? 'bg-[#D1FAE5] border-transparent hover:border-[#059669] hover:shadow-lg transform hover:-translate-y-1' : 
                      r.status === "OCCUPIED" ? 'bg-[#FEE2E2] border-transparent cursor-not-allowed opacity-80' : 
                      'bg-[#FEF9C3] border-transparent cursor-not-allowed'}
                    ${r.isCorner ? 'border-[#7C3AED] ring-2 ring-[#7C3AED]/10' : ''}
                  `}
                  title={`${r.id} — ${r.status} — KES ${r.price.toLocaleString()}/mo`}
                >
                  <div className={`font-bold text-sm ${r.status === "VACANT" ? 'text-[#065F46]' : r.status === "OCCUPIED" ? 'text-[#991B1B]' : 'text-[#92400E]'}`}>
                    {r.id}
                  </div>
                  <div className="text-[9px] font-semibold text-gray-500 mt-0.5">
                    {r.price >= 1000 ? `${r.price/1000}K` : r.price}
                  </div>
                  {r.isCorner && <div className="absolute top-1 right-1 text-[#7C3AED] font-black text-[10px]">★</div>}
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-20 w-32 bg-gray-900 text-white text-[10px] p-2 rounded shadow-xl pointer-events-none">
                    <p className="font-bold border-b border-gray-700 pb-1 mb-1">Room {r.id}</p>
                    <p>Status: {r.status}</p>
                    <p>Price: KES {r.price.toLocaleString()}</p>
                    {r.isCorner && <p className="text-purple-400">Corner Unit</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
