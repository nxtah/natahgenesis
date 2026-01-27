require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Import routes
const cloudinaryRoutes = require('./routes/cloudinary');
const projectsRoutes = require('./routes/projects');

const app = express();

// --- MIDDLEWARE ---
app.use(helmet());
app.use(cors({ 
  origin: process.env.CLIENT_ORIGIN || '*',
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));

// Logging sederhana
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- API ROUTES ---
app.get('/api/health', (req, res) => res.json({
  ok: true,
  env: process.env.NODE_ENV || 'development',
  publicAdmin: !!(process.env.PUBLIC_ADMIN === 'true'),
  cloudinary: {
    cloud_name_set: !!process.env.CLOUDINARY_CLOUD_NAME,
    api_key_set: !!process.env.CLOUDINARY_API_KEY
  }
}));

app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/projects', projectsRoutes);

// --- ERROR HANDLING ---
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not Found', path: req.path });
  }
  res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Server error' });
});

// Jalankan server HANYA jika bukan di lingkungan Vercel/Production
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Local server listening on ${PORT}`));
}

// Export untuk Vercel
module.exports = app;