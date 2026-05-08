import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateApartments = () => {
  const floors = [
    { prefix: 'G', name: 'Ground Floor' },
    { prefix: 'A', name: 'First Floor' },
    { prefix: 'B', name: 'Second Floor' },
    { prefix: 'C', name: 'Third Floor' },
    { prefix: 'D', name: 'Fourth Floor' },
    { prefix: 'E', name: 'Fifth Floor' },
  ];

  const apartments = [];
  const cornerUnits = [1, 8, 15]; // 3 corner units per floor

  floors.forEach((floor) => {
    for (let i = 1; i <= 15; i++) {
      const isCorner = cornerUnits.includes(i);
      apartments.push({
        id: `${floor.prefix}${i}`,
        floorName: floor.name,
        floorPrefix: floor.prefix,
        number: i,
        isCorner,
        price: isCorner ? 6500 : 7000,
        status: Math.random() > 0.8 ? 'vacant' : (Math.random() > 0.9 ? 'reserved' : 'occupied'), // Random initial state
        tenantId: null,
      });
    }
  });

  return apartments;
};

const initialApartments = generateApartments();

export const useStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      apartments: initialApartments,
      bookings: [],
      notices: [],
      invoices: [],
      users: [
        { id: 'admin1', role: 'admin', name: 'System Admin', email: 'admin@fairview.com', password: 'admin' }
      ],

      login: (email, password) => {
        const user = get().users.find((u) => u.email === email && u.password === password);
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUser: null }),
      
      updateApartmentStatus: (id, status) => 
        set((state) => ({
          apartments: state.apartments.map((apt) => 
            apt.id === id ? { ...apt, status } : apt
          )
        })),

      addBooking: (booking) => 
        set((state) => ({
          bookings: [...state.bookings, { ...booking, id: Date.now().toString(), status: 'pending', createdAt: new Date().toISOString() }],
          apartments: state.apartments.map((apt) => 
            apt.id === booking.apartmentId ? { ...apt, status: 'reserved' } : apt
          )
        })),

      approveBooking: (bookingId) => 
        set((state) => {
          const booking = state.bookings.find(b => b.id === bookingId);
          if (!booking) return state;
          
          // Create new tenant user
          const newTenantId = `tenant_${Date.now()}`;
          const newTenant = {
            id: newTenantId,
            role: 'tenant',
            name: booking.applicantName,
            email: booking.email,
            phone: booking.phone,
            apartmentId: booking.apartmentId,
            password: 'password123' // default password for mock
          };

          return {
            bookings: state.bookings.map(b => b.id === bookingId ? { ...b, status: 'approved' } : b),
            apartments: state.apartments.map(apt => apt.id === booking.apartmentId ? { ...apt, status: 'occupied', tenantId: newTenantId } : apt),
            users: [...state.users, newTenant]
          };
        }),

      rejectBooking: (bookingId) =>
        set((state) => {
          const booking = state.bookings.find(b => b.id === bookingId);
          if (!booking) return state;
          return {
            bookings: state.bookings.map(b => b.id === bookingId ? { ...b, status: 'rejected' } : b),
            apartments: state.apartments.map(apt => apt.id === booking.apartmentId ? { ...apt, status: 'vacant' } : apt),
          };
        }),

      addNotice: (notice) =>
        set((state) => ({
          notices: [{ ...notice, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...state.notices]
        })),

    }),
    {
      name: 'fairview-storage',
    }
  )
);
