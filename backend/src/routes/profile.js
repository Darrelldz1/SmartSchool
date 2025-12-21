const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();


// === CREATE Profile ===
router.post('/', auth('admin'), async (req, res) => {
  const { vision, mission, core_values } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO profile (vision, mission, core_values)
       VALUES ($1, $2, $3) RETURNING *`,
      [vision, mission, core_values]
    );
    res.status(201).json({ message: 'Profile created', profile: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// === GET Profile ===
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, vision, mission, core_values FROM profile ORDER BY id ASC LIMIT 1'
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// === UPDATE Profile ===
router.put('/:id', auth(['admin','guru']), async (req, res) => {
  const { id } = req.params;
  const { vision, mission, core_values } = req.body;

  try {
    const result = await pool.query(
      `UPDATE profile 
       SET vision=$1, mission=$2, core_values=$3
       WHERE id=$4 RETURNING *`,
      [vision, mission, core_values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ message: 'Profile updated', profile: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// === DELETE Profile ===
router.delete('/:id', auth('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM profile WHERE id=$1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ message: 'Profile deleted', deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
