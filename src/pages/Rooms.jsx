import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Filter, Star, Info } from 'lucide-react';

const floors = [
  { id: "G", label: "Ground Floor", prefix: "G" },
  { id: "A", label: "First Floor", prefix: "A" },
  { id: "B", label: "Second Floor", prefix: "B" },
  { id: "C", label: "Third Floor", prefix: "C" },
  { id: "D", label: "Fourth Floor", prefix: "D" },
  { id: "E", label: "Fifth Floor", prefix: "E" },
];

const generateFallbackRooms = () => {
  const fallbackRooms = [];
  floors.forEach(f => {
    for (let i = 1; i <= 15; i++) {
      const isCorner = i === 8 || i === 9 || i === 10;
      fallbackRooms.push({
        id: `${f.prefix}${i}`,
        floor: f.label,
        price: isCorner ? 6500 : 7000,
        isCorner: isCorner,
        status: 'VACANT'
      });
    }
  });
  return fallbackRooms;
};

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filterFloor, setFilterFloor] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/apartments/rooms');
      if (response.data && response.data.length > 0) {
        setRooms(response.data);
      } else {
        setRooms(generateFallbackRooms());
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setRooms(generateFallbackRooms()); // Render fallback so UI doesn't break
    } finally {
      setLoading(false);
    }
  };

  const filteredFloors = filterFloor === "ALL" ? floors : floors.filter(f => f.id === filterFloor);
  const vacantCount = rooms.filter(r => r.status === "VACANT").length;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maroon"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-heading font-bold text-text-light dark:text-text-dark">Room Explorer</h2>
      <p className="text-text-muted-light dark:text-text-muted-dark mt-1 mb-8">Browse all units by floor. Click a vacant room to book.</p>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 mb-8">
          ⚠️ Could not connect to the live database. Displaying default room layout for demonstration.
        </div>
      )}

      {vacantCount === 0 && !error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center text-red-800 font-bold mb-8">
          ⚠️ No Vacant Rooms Available at the moment.
        </div>
      )}

      {/* Filters & Legend */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-silver-light dark:border-surface-hover-dark shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={18} className="text-text-muted-light dark:text-text-muted-dark" />
          <select 
            className="bg-background-light dark:bg-surface-hover-dark border border-silver-light dark:border-surface-hover-dark rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-maroon outline-none" 
            value={filterFloor} 
            onChange={e => setFilterFloor(e.target.value)}
          >
            <option value="ALL">All Floors</option>
            {floors.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-100 border border-green-600" />
            <span className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark">Vacant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-100 border border-red-600" />
            <span className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-600" />
            <span className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-purple-500 bg-purple-100" />
            <span className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark">Corner</span>
          </div>
        </div>
      </div>

      {/* Floors Grid */}
      <div className="space-y-12">
        {filteredFloors.map(f => {
          const floorRooms = rooms
            .filter(r => r?.id?.startsWith(f.prefix))
            .sort((a,b) => {
              const numA = parseInt(a.id?.replace(/\D/g, '')) || 0;
              const numB = parseInt(b.id?.replace(/\D/g, '')) || 0;
              return numA - numB;
            });

          return (
            <div key={f.id} className="enterprise-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-maroon dark:bg-maroon-dark text-white px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider">{f.label}</span>
                <div className="h-[1px] flex-1 bg-silver-light dark:bg-surface-hover-dark" />
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-15 gap-3">
                {floorRooms.map(r => (
                  <div
                    key={r.id}
                    onClick={() => r.status === "VACANT" && navigate(`/booking?room=${r.id}`)}
                    className={`
                      relative group cursor-pointer aspect-square flex flex-col items-center justify-center rounded-xl transition-all border-2
                      ${r.status === "VACANT" ? 'bg-green-100 dark:bg-green-900/20 border-transparent hover:border-green-600 hover:shadow-lg transform hover:-translate-y-1' : 
                        r.status === "OCCUPIED" ? 'bg-red-100 dark:bg-red-900/20 border-transparent cursor-not-allowed opacity-80' : 
                        'bg-yellow-100 dark:bg-yellow-900/20 border-transparent cursor-not-allowed'}
                      ${r.isCorner ? 'border-purple-500 dark:border-purple-400' : ''}
                    `}
                  >
                    <div className={`font-bold text-sm ${r.status === "VACANT" ? 'text-green-700 dark:text-green-400' : r.status === "OCCUPIED" ? 'text-red-700 dark:text-red-400' : 'text-yellow-700 dark:text-yellow-400'}`}>
                      {r.id}
                    </div>
                    <div className="text-[10px] font-semibold text-text-muted-light dark:text-text-muted-dark mt-0.5">
                      {r.price >= 1000 ? `${r.price/1000}K` : r.price}
                    </div>
                    {r.isCorner && <div className="absolute top-1 right-1 text-purple-600 dark:text-purple-400 font-black text-[10px]">★</div>}
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-20 w-32 bg-surface-dark text-text-dark text-xs p-3 rounded-lg shadow-xl pointer-events-none">
                      <p className="font-bold border-b border-surface-hover-dark pb-1 mb-1">Room {r.id}</p>
                      <p>Status: {r.status}</p>
                      <p>Price: KES {r.price.toLocaleString()}</p>
                      {r.isCorner && <p className="text-purple-400 font-semibold mt-1">Corner Unit</p>}
                    </div>
                  </div>
                ))}
                {floorRooms.length === 0 && (
                  <div className="col-span-full text-center text-text-muted-light dark:text-text-muted-dark py-4">
                    No rooms found for this floor.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rooms;
