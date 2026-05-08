const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fairview_secret';

app.use(cors());
app.use(express.json());

// --- Middleware ---

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

// --- Auth Routes ---

app.post('/api/auth/register-admin', async (req, res) => {
  const { email, password, name, secretKey } = req.body;
  
  // Simple check for super admin creation or initial setup
  // In a real app, you'd have a more robust super admin check
  if (secretKey !== 'fairview_setup_key_2026') {
    return res.status(403).json({ message: 'Invalid setup key.' });
  }

  try {
    const adminCount = await prisma.user.count({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } }
    });

    if (adminCount >= 3) {
      return res.status(400).json({ message: 'Maximum admin account limit (3) reached.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: adminCount === 0 ? 'SUPER_ADMIN' : 'ADMIN',
      },
    });

    res.status(201).json({ message: 'Admin created successfully.', user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin.', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenantProfile: true }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, tenantId: user.tenantProfile?.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        tenantId: user.tenantProfile?.id,
        unitId: user.tenantProfile?.unitId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error.', error: error.message });
  }
});

// --- Room Routes ---

app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { tenant: { include: { user: true } } }
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms.' });
  }
});

app.put('/api/rooms/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
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

// --- Booking Routes ---

app.post('/api/bookings', async (req, res) => {
  const { applicantName, phone, email, roomId } = req.body;
  try {
    const booking = await prisma.booking.create({
      data: { applicantName, phone, email, roomId, status: 'pending' }
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking.' });
  }
});

app.get('/api/bookings', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({ include: { room: true } });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings.' });
  }
});

app.post('/api/bookings/:id/approve', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    // Create user and tenant profile
    const tempPassword = 'password123'; // In real app, send email with reset link
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: booking.email,
          password: hashedPassword,
          name: booking.applicantName,
          role: 'TENANT',
          phone: booking.phone,
          tenantProfile: {
            create: {
              unitId: booking.roomId,
              moveInDate: new Date()
            }
          }
        }
      });

      await tx.room.update({
        where: { id: booking.roomId },
        data: { status: 'OCCUPIED' }
      });

      await tx.booking.update({
        where: { id: req.params.id },
        data: { status: 'approved' }
      });

      return user;
    });

    res.json({ message: 'Booking approved and tenant created.', user: { email: result.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error approving booking.', error: error.message });
  }
});

// --- Tenant Dashboard Data ---

app.get('/api/tenant/dashboard', authenticateToken, authorizeRole(['TENANT']), async (req, res) => {
  try {
    const profile = await prisma.tenantProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        room: true,
        invoices: { include: { payments: true }, orderBy: { dueDate: 'desc' } },
        notices: { orderBy: { date: 'desc' } },
        user: true
      }
    });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tenant profile.' });
  }
});

// --- Notices ---

app.post('/api/notices', authenticateToken, authorizeRole(['TENANT']), async (req, res) => {
  const { type, content } = req.body;
  try {
    const notice = await prisma.notice.create({
      data: { type, content, tenantId: req.user.tenantId }
    });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting notice.' });
  }
});

app.get('/api/notices', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      include: { tenant: { include: { user: true, room: true } } },
      orderBy: { date: 'desc' }
    });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notices.' });
  }
});

// --- Announcements ---

app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({ orderBy: { date: 'desc' } });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements.' });
  }
});

app.post('/api/announcements', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  const { content } = req.body;
  try {
    const announcement = await prisma.announcement.create({
      data: { content, adminId: req.user.id }
    });
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error posting announcement.' });
  }
});

// --- Start Server ---

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
