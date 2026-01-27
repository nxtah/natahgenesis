const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
console.log('cloudinary route loaded');

// configure from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Validate Cloudinary config early so we return clear errors instead of returning undefined values
function ensureCloudinaryConfig(req, res, next) {
  const missing = [];
  if (!process.env.CLOUDINARY_CLOUD_NAME) missing.push('CLOUDINARY_CLOUD_NAME');
  if (!process.env.CLOUDINARY_API_KEY) missing.push('CLOUDINARY_API_KEY');
  if (!process.env.CLOUDINARY_API_SECRET) missing.push('CLOUDINARY_API_SECRET');
  if (missing.length > 0) {
    console.warn('Missing Cloudinary config:', missing.join(', '));
    return res.status(500).json({ error: `Cloudinary config missing: ${missing.join(', ')}` });
  }
  return next();
}

// Simple admin guard: use x-admin-key header
function requireAdmin(req, res, next) {
  // SHORT-CIRCUIT: if PUBLIC_ADMIN=true allow all admin ops (useful for quick dev/testing)
  if (process.env.PUBLIC_ADMIN === 'true') return next();

  if (!process.env.ADMIN_API_KEY) return res.status(401).json({ error: 'ADMIN_API_KEY not set on server' });
  const key = req.get('x-admin-key');
  if (!key || key !== process.env.ADMIN_API_KEY) return res.status(401).json({ error: 'Unauthorized' });
  return next();
}

// POST /api/cloudinary/sign
// Body: { folder?, public_id?, resource_type? }
router.post('/sign', requireAdmin, ensureCloudinaryConfig, (req, res) => {
  console.log('[cloudinary.sign] incoming', { path: req.path, bodyKeys: Object.keys(req.body || {}) });
  try {
    const { folder, public_id } = req.body || {};
    const timestamp = Math.round(Date.now() / 1000);
    // Only sign the minimal params that will be sent in the upload body (timestamp, folder, public_id)
    // Do NOT include resource_type in the string to sign (Cloudinary expects the uploaded form's fields to match)
    const params = { timestamp };
    if (folder) params.folder = folder;
    if (public_id) params.public_id = public_id;

    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

    const out = { signature, timestamp, api_key: process.env.CLOUDINARY_API_KEY, cloud_name: process.env.CLOUDINARY_CLOUD_NAME };
    console.log('[cloudinary.sign] out', out);
    return res.json(out);
  } catch (err) {
    console.error('cloudinary sign error', err);
    return res.status(500).json({ error: 'Cloudinary sign failed' });
  }
});

module.exports = router;
