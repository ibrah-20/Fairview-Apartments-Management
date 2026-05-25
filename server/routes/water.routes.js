const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get complex water analytics
router.get('/analytics', authenticateToken, authorizeRole(['SUPER_ADMIN', 'ADMIN', 'WATER_STAFF']), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);

    const monthStart = new Date(today);
    monthStart.setDate(1);

    const [dailyOrders, weeklyOrders, monthlyOrders, freeDeliveries, allOrders, inventory] = await Promise.all([
      prisma.waterOrder.aggregate({ _sum: { totalPrice: true, quantity: true }, _count: true, where: { createdAt: { gte: today } } }),
      prisma.waterOrder.aggregate({ _sum: { totalPrice: true }, where: { createdAt: { gte: weekStart } } }),
      prisma.waterOrder.aggregate({ _sum: { totalPrice: true }, where: { createdAt: { gte: monthStart } } }),
      prisma.waterOrder.count({ where: { isFreeDelivery: true } }),
      prisma.waterOrder.findMany({ select: { litersPerUnit: true } }),
      prisma.waterInventory.findMany()
    ]);

    const [dailySales, weeklySales, monthlySales] = await Promise.all([
      prisma.waterTransaction.aggregate({ _sum: { amount: true, quantity: true }, _count: true, where: { date: { gte: today } } }),
      prisma.waterTransaction.aggregate({ _sum: { amount: true }, where: { date: { gte: weekStart } } }),
      prisma.waterTransaction.aggregate({ _sum: { amount: true }, where: { date: { gte: monthStart } } })
    ]);

    // Calculate most popular item across both online orders and POS sales
    const counts = { 1: 0, 5: 0, 10: 0, 20: 0 };
    allOrders.forEach(o => counts[o.litersPerUnit] = (counts[o.litersPerUnit] || 0) + 1);
    
    let mostPopular = 20;
    let max = 0;
    for (const [liters, count] of Object.entries(counts)) {
      if (count > max) { max = count; mostPopular = parseInt(liters); }
    }

    res.json({
      dailyRevenue: (dailyOrders._sum.totalPrice || 0) + (dailySales._sum.amount || 0),
      weeklyRevenue: (weeklyOrders._sum.totalPrice || 0) + (weeklySales._sum.amount || 0),
      monthlyRevenue: (monthlyOrders._sum.totalPrice || 0) + (monthlySales._sum.amount || 0),
      ordersToday: (dailyOrders._count || 0) + (dailySales._count || 0),
      freeDeliveries,
      mostPurchased: `${mostPopular}L Refill`,
      inventory
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

// POS System: Record a new transaction (Staff Only)
router.post('/sales', authenticateToken, authorizeRole(['SUPER_ADMIN', 'ADMIN', 'WATER_STAFF']), async (req, res) => {
  const { customerName, quantity, litersPerUnit, amount, orderType, paymentMethod, mpesaRef, notes } = req.body;
  
  try {
    const transaction = await prisma.waterTransaction.create({
      data: {
        customerName,
        quantity,
        litersPerUnit,
        amount,
        orderType,
        paymentMethod,
        mpesaRef,
        notes,
        staffId: req.user.id,
      }
    });
    
    // Deduct from inventory instantly
    const totalLiters = quantity * litersPerUnit;
    await prisma.waterInventory.updateMany({
      where: { type: 'PURIFIED_WATER_LITERS' },
      data: {
        quantity: { decrement: totalLiters }
      }
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error recording POS sale', error: error.message });
  }
});

// Get all POS sales for Ledger
router.get('/sales', authenticateToken, authorizeRole(['SUPER_ADMIN', 'ADMIN', 'WATER_STAFF']), async (req, res) => {
  try {
    const sales = await prisma.waterTransaction.findMany({
      include: { staff: { select: { name: true } } },
      orderBy: { date: 'desc' },
      take: 200
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales ledger' });
  }
});

// Get Daily Report Summary
router.get('/reports/daily', authenticateToken, authorizeRole(['SUPER_ADMIN', 'ADMIN', 'WATER_STAFF']), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sales = await prisma.waterTransaction.findMany({
      where: { date: { gte: today } }
    });

    const report = {
      totalRevenue: sales.reduce((sum, s) => sum + s.amount, 0),
      totalLiters: sales.reduce((sum, s) => sum + (s.quantity * s.litersPerUnit), 0),
      ordersCount: sales.length,
      paymentMethods: {
        CASH: sales.filter(s => s.paymentMethod === 'CASH').length,
        MPESA: sales.filter(s => s.paymentMethod === 'MPESA').length,
        BANK: sales.filter(s => s.paymentMethod === 'BANK').length,
        PENDING: sales.filter(s => s.paymentMethod === 'PENDING').length,
      },
      orderTypes: {
        PICKUP: sales.filter(s => s.orderType === 'PICKUP').length,
        DELIVERY: sales.filter(s => s.orderType === 'DELIVERY').length,
      }
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating daily report' });
  }
});

// Create a new public water order
router.post('/orders', async (req, res) => {
  const { customerName, phone, location, quantity, litersPerUnit } = req.body;
  
  if (!customerName || !phone || !location || !quantity || !litersPerUnit) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Pricing Logic
  const pricing = { 1: 10, 5: 50, 10: 100, 20: 200 };
  const pricePerUnit = pricing[litersPerUnit];
  if (!pricePerUnit) return res.status(400).json({ message: "Invalid liters selected." });

  const totalPrice = pricePerUnit * quantity;

  // Free Delivery Logic
  // Only 10L and 20L, total >= 100
  // Between 12:30-13:00 OR 14:00-17:00
  let isFreeDelivery = false;
  if ((litersPerUnit === 10 || litersPerUnit === 20) && totalPrice >= 100) {
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const timeVal = hours + mins / 60;
    
    if ((timeVal >= 12.5 && timeVal <= 13.0) || (timeVal >= 14.0 && timeVal <= 17.0)) {
      isFreeDelivery = true;
    }
  }

  try {
    const order = await prisma.waterOrder.create({
      data: {
        customerName,
        phone,
        location,
        quantity,
        litersPerUnit,
        totalPrice,
        isFreeDelivery,
        status: 'PENDING'
      }
    });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Get all orders for admin
router.get('/orders', authenticateToken, authorizeRole(['SUPER_ADMIN', 'ADMIN', 'WATER_STAFF']), async (req, res) => {
  try {
    const orders = await prisma.waterOrder.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Update order status
router.put('/orders/:id/status', authenticateToken, authorizeRole(['SUPER_ADMIN', 'ADMIN', 'WATER_STAFF']), async (req, res) => {
  const { status } = req.body;
  try {
    const order = await prisma.waterOrder.update({
      where: { id: req.params.id },
      data: { status }
    });

    if (status === 'DELIVERED') {
      const totalLiters = order.quantity * order.litersPerUnit;
      await prisma.waterInventory.updateMany({
        where: { type: 'PURIFIED_WATER_LITERS' },
        data: { quantity: { decrement: totalLiters } }
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
});

module.exports = router;
