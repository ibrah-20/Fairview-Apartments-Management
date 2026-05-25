const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fairview_secret';

router.post('/register-admin', async (req, res) => {
  const { email, password, name, secretKey, role } = req.body;
  
  if (secretKey !== 'fairview_setup_key_2026') {
    return res.status(403).json({ message: 'Invalid setup key.' });
  }

  try {
    const adminCount = await prisma.user.count({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } }
    });

    if (adminCount >= 3 && ['ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Maximum admin account limit (3) reached.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: adminCount === 0 ? 'SUPER_ADMIN' : (role || 'ADMIN'),
      },
    });

    res.status(201).json({ message: 'Admin/Staff created successfully.', user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user.', error: error.message });
  }
});

router.post('/login', async (req, res) => {
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
    console.error('LOGIN EXCEPTION:', error);
    res.status(500).json({ message: 'Login error.', error: error.message });
  }
});

module.exports = router;
