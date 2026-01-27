const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();


// === CREATE History ===
router.post('/', auth('admin'), async (req, res) => {
  const { description } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO history (description)
       VALUES ($1) RETURNING *`,
      [description]
    );
    res.status(201).json({ message: 'History created', history: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// === GET History ===
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, description, created_at FROM history ORDER BY id ASC LIMIT 1'
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'History not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// === UPDATE History ===
router.put('/:id', auth(['admin','guru']), async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;   

  try {
    const result = await pool.query(
      `UPDATE history 
       SET description=$1
       WHERE id=$2 RETURNING *`,
      [description  , id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'History not found' });
    }

    res.json({ message: 'History updated', history: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// === DELETE History ===
router.delete('/:id', auth('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM history WHERE id=$1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'History not found' });
    }

    res.json({ message: 'History deleted', deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
