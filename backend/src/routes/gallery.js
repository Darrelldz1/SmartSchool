// backend/src/routes/gallery.js
const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// CREATE gallery item
router.post('/', auth('admin'), async (req, res) => {
  const { image_url, caption } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO gallery (image_url, caption) VALUES ($1, $2) RETURNING *`,
      [image_url, caption]
    );
    res.status(201).json({ message: 'Gallery item created', gallery: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET gallery
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE gallery
router.put('/:id', auth(['admin','guru']), async (req, res) => {
  const { id } = req.params;
  const { image_url, caption } = req.body;
  try {
    const result = await pool.query(
      `UPDATE gallery SET image_url=$1, caption=$2 WHERE id=$3 RETURNING *`,
      [image_url, caption, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Gallery item not found' });
    res.json({ message: 'Gallery updated', gallery: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE gallery
router.delete('/:id', auth('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM gallery WHERE id=$1 RETURNING *`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Gallery not found' });
    res.json({ message: 'Gallery deleted', deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
