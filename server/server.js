require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');

// Route imports
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const lostFoundRoutes = require('./routes/lostFoundRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const eventRoutes = require('./routes/eventRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const forumRoutes = require('./routes/forumRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Connect to MongoDB per request (ensures connection ready in serverless environments)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Admin auto-seeding flag
let adminSeeded = false;
const seedAdmin = async () => {
  if (adminSeeded) return;
  try {
    const existing = await User.findOne({ role: 'admin' });
    if (!existing) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Administrator',
        email: process.env.ADMIN_EMAIL || 'admin@campus.edu',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role: 'admin',
      });
      console.log(`✅ Admin seeded: ${process.env.ADMIN_EMAIL || 'admin@campus.edu'}`);
    }
    adminSeeded = true;
  } catch (err) {
    console.error('Admin seed error:', err.message);
  }
};

// Seed admin on first auth check
app.use('/api/auth', async (req, res, next) => {
  await seedAdmin();
  authRoutes(req, res, next);
});

// Routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/forum', forumRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

module.exports = app;
