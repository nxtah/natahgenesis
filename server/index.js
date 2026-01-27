require('dotenv').config();
// Debug: show whether ADMIN_API_KEY, PUBLIC_ADMIN, and Cloudinary vars are present (booleans only)
console.log('ADMIN_API_KEY set?', !!process.env.ADMIN_API_KEY);
console.log('PUBLIC_ADMIN?', process.env.PUBLIC_ADMIN === 'true');
console.log('CLOUDINARY_CLOUD_NAME set?', !!process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY set?', !!process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET set?', !!process.env.CLOUDINARY_API_SECRET);
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const cloudinaryRoutes = require('./routes/cloudinary');
const projectsRoutes = require('./routes/projects');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));

// simple request logging for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/api/health', (req, res) => res.json({
  ok: true,
  env: process.env.NODE_ENV || 'development',
  publicAdmin: !!(process.env.PUBLIC_ADMIN === 'true'),
  cloudinary: {
    cloud_name_set: !!process.env.CLOUDINARY_CLOUD_NAME,
    api_key_set: !!process.env.CLOUDINARY_API_KEY,
    api_secret_set: !!process.env.CLOUDINARY_API_SECRET
  }
}));

app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/projects', projectsRoutes);

// JSON 404 handler for API routes to return structured errors
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not Found', path: req.path });
  }
  return res.status(404).send('Not Found');
});

// error handler (log and return JSON)
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (req.path && req.path.startsWith('/api/')) {
    res.status(500).json({ error: err.message || 'Server error' });
  } else {
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
