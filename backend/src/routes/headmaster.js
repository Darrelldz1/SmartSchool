const express = require('express');
const pool = require('../db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/headmaster';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, 'headmaster' + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET Sambutan
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM headmaster LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Sambutan
router.put('/:id', auth(['admin']), upload.single('photo'), async (req, res) => {
  const { name, greeting } = req.body;
  const photo = req.file ? req.file.path : null;

  try {
    const result = await pool.query(
      'UPDATE headmaster SET name=$1, greeting=$2, photo=COALESCE($3, photo) WHERE id=1 RETURNING *',
      [name, greeting, photo]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
