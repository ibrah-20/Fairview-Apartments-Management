const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

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

module.exports = router;
