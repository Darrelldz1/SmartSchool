const express = require('express');
const pool = require('../db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/teachers';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// CREATE Guru
router.post('/', auth(['admin']), upload.single('photo'), async (req, res) => {
  const { name, nip, date_joined, position, subject } = req.body;
  const photo = req.file ? req.file.path : null;

  try {
    const result = await pool.query(
      'INSERT INTO teachers (name, nip, date_joined, position, subject, photo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, nip, date_joined, position, subject, photo]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ Guru
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT *   FROM teachers ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Guru
router.put('/:id', auth(['admin']), upload.single('photo'), async (req, res) => {
  const { id } = req.params;
  const { name, nip, date_joined, position, subject } = req.body;
  const photo = req.file ? req.file.path : null;

  try {
    const result = await pool.query(
      'UPDATE teachers SET name=$1, nip=$2, date_joined=$3, position=$4, subject=$5, photo=COALESCE($6, photo) WHERE id=$7 RETURNING *',
      [name, nip, date_joined, position, subject, photo, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Guru
router.delete('/:id', auth(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM teachers WHERE id=$1', [id]);
    res.json({ message: 'Teacher deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
