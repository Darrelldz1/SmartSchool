// backend/src/routes/news.js
const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// CREATE news
router.post('/', auth(['admin','guru']), async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO news (title, content) VALUES ($1, $2) RETURNING *`,
      [title, content]
    );
    res.status(201).json({ message: 'News created', news: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all news
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE news
router.put('/:id', auth(['admin','guru']), async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      `UPDATE news SET title=$1, content=$2 WHERE id=$3 RETURNING *`,
      [title, content, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'News not found' });
    res.json({ message: 'News updated', news: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE news
router.delete('/:id', auth('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM news WHERE id=$1 RETURNING *`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'News not found' });
    res.json({ message: 'News deleted', deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
