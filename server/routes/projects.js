const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '..', 'data', 'projects.json');

function requireAdmin(req, res, next) {
  // If PUBLIC_ADMIN=true we allow admin operations without header. Not for production use without caution.
  if (process.env.PUBLIC_ADMIN === 'true') return next();

  if (!process.env.ADMIN_API_KEY) return res.status(401).json({ error: 'ADMIN_API_KEY not set on server' });
  const key = req.get('x-admin-key');
  if (!key || key !== process.env.ADMIN_API_KEY) return res.status(401).json({ error: 'Unauthorized' });
  return next();
}

async function readProjects() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeProjects(data) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const data = await readProjects();
    data.sort((a, b) => (b.sort_order || 0) - (a.sort_order || 0));
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Fetch failed' });
  }
});

// POST /api/projects (admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const payload = req.body || {};
    const projects = await readProjects();
    const newProject = {
      id: uuidv4(),
      title: payload.title || 'Untitled',
      description: payload.description || '',
      src: payload.src || '',
      cloudinary_public_id: payload.cloudinary_public_id || null,
      whatsapp: payload.whatsapp || null,
      is_published: !!payload.is_published,
      sort_order: payload.sort_order || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    projects.push(newProject);
    await writeProjects(projects);
    return res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Create failed' });
  }
});

// PUT /api/projects/:id (admin)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body || {};
    const projects = await readProjects();
    const idx = projects.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const updated = { ...projects[idx], ...payload, updated_at: new Date().toISOString() };
    projects[idx] = updated;
    await writeProjects(projects);
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Update failed' });
  }
});

// DELETE /api/projects/:id (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const projects = await readProjects();
    const idx = projects.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });

    const [removed] = projects.splice(idx, 1);

    // delete Cloudinary resource if present
    if (removed && removed.cloudinary_public_id) {
      try {
        await cloudinary.uploader.destroy(removed.cloudinary_public_id, { invalidate: true });
      } catch (err) {
        console.warn('cloudinary delete failed', err.message || err);
      }
    }

    await writeProjects(projects);
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
