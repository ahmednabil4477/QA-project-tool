const express = require('express');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5001;

// ── CORS ─────────────────────────────────────────────────────────
// Allow the Vercel frontend + localhost during development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL, // set this in Railway env vars
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const destinationRoutes = require('./routes/destinations');
const flightRoutes = require('./routes/flights');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// ── Health Check ─────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.send('Horizon Travel API is running.');
});


// ── Start Server ─────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

