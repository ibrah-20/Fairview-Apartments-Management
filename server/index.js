const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const apartmentRoutes = require('./routes/apartments.routes');
const waterRoutes = require('./routes/water.routes');

app.use('/api/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/water', waterRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'City Lake Enterprises API' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`City Lake Enterprises API running on port ${PORT}`);
});
