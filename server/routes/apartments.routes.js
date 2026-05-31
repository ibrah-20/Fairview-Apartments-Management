const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const bcrypt = require('bcrypt');

router.get('/seed', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({ where: { email: 'admin@citylake.com' }, update: {}, create: { email: 'admin@citylake.com', password: hashedPassword, name: 'Super Admin', role: 'SUPER_ADMIN' } });
    await prisma.user.upsert({ where: { email: 'manager@citylake.com' }, update: {}, create: { email: 'manager@citylake.com', password: hashedPassword, name: 'Property Manager', role: 'APARTMENT_MANAGER' } });
    
    const floors = [ { prefix: 'G', label: 'Ground Floor' }, { prefix: 'A', label: 'First Floor' }, { prefix: 'B', label: 'Second Floor' }, { prefix: 'C', label: 'Third Floor' }, { prefix: 'D', label: 'Fourth Floor' }, { prefix: 'E', label: 'Fifth Floor' } ];
    for (const floor of floors) {
      for (let i = 1; i <= 15; i++) {
        const isCorner = i === 1 || i === 8 || i === 15;
        await prisma.room.upsert({ where: { id: `${floor.prefix}${i}` }, update: {}, create: { id: `${floor.prefix}${i}`, floor: floor.label, price: isCorner ? 6500 : 7000, isCorner, status: 'VACANT' } });
      }
    }
    
    await prisma.waterInventory.upsert({ where: { type: 'PURIFIED_WATER_LITERS' }, update: {}, create: { type: 'PURIFIED_WATER_LITERS', quantity: 5000 } });
    res.json({ message: 'Database successfully seeded!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/rooms', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { tenant: { include: { user: { select: { name: true, email: true, phone: true } } } } }
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms.' });
  }
});

router.put('/rooms/:id', authenticateToken, authorizeRole(['SUPER_ADMIN', 'ADMIN', 'APARTMENT_MANAGER']), async (req, res) => {
  const { status, price } = req.body;
  try {
    const room = await prisma.room.update({
      where: { id: req.params.id },
      data: { status, price }
    });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error updating room.' });
  }
});

router.get('/dashboard/stats', authenticateToken, authorizeRole(['SUPER_ADMIN', 'ADMIN', 'APARTMENT_MANAGER']), async (req, res) => {
  try {
    const [totalRooms, occupiedRooms, totalTenants, pendingNotices] = await Promise.all([
      prisma.room.count(),
      prisma.room.count({ where: { status: 'OCCUPIED' } }),
      prisma.tenantProfile.count(),
      prisma.notice.count({ where: { status: 'PENDING' } })
    ]);

    res.json({
      totalRooms,
      occupiedRooms,
      occupancyRate: totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0,
      totalTenants,
      pendingNotices
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching apartment stats.' });
  }
});

router.post('/bookings', async (req, res) => {
  const { applicantName, phone, email, roomId } = req.body;
  try {
    const booking = await prisma.booking.create({
      data: { applicantName, phone, email, roomId, status: 'PENDING' }
    });
    
    // Update room status to RESERVED
    await prisma.room.update({
      where: { id: roomId },
      data: { status: 'RESERVED' }
    });
    
    res.status(201).json(booking);
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: error.message || 'Error creating booking.' });
  }
});

router.get('/bookings', authenticateToken, authorizeRole(['SUPER_ADMIN', 'ADMIN', 'APARTMENT_MANAGER']), async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { room: true },
      orderBy: { date: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings.' });
  }
});

router.get('/tenants', authenticateToken, authorizeRole(['SUPER_ADMIN', 'ADMIN', 'APARTMENT_MANAGER']), async (req, res) => {
  try {
    const tenants = await prisma.tenantProfile.findMany({
      include: { user: { select: { name: true, email: true, phone: true } }, room: true }
    });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tenants.' });
  }
});

module.exports = router;
