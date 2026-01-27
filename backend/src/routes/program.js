const express = require('express');
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

const router = express.Router();

// setup upload folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/program';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// CREATE Program
router.post('/', auth(['admin']), upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const result = await pool.query(
      'INSERT INTO program (title, description, image) VALUES ($1, $2, $3) RETURNING *',
      [title, description, image]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ All
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM program ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', auth(['admin']), upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const result = await pool.query(
      'UPDATE program SET title=$1, description=$2, image=COALESCE($3, image) WHERE id=$4 RETURNING *',
      [title, description, image, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', auth(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM program WHERE id=$1', [id]);
    res.json({ message: 'Program deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
