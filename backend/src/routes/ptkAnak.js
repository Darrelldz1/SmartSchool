const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { ptk_id, nama_anak, tempat_lahir, tanggal_lahir, jenis_kelamin, pendidikan } = req.body;
    const result = await pool.query(
      `INSERT INTO ptk_anak (ptk_id, nama_anak, tempat_lahir, tanggal_lahir, jenis_kelamin, pendidikan)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [ptk_id, nama_anak, tempat_lahir, tanggal_lahir, jenis_kelamin, pendidikan]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/ptk/:ptk_id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ptk_anak WHERE ptk_id=$1 ORDER BY tanggal_lahir DESC', [req.params.ptk_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { nama_anak, tempat_lahir, tanggal_lahir, jenis_kelamin, pendidikan } = req.body;
    const result = await pool.query(
      `UPDATE ptk_anak SET nama_anak=$1, tempat_lahir=$2, tanggal_lahir=$3, jenis_kelamin=$4, pendidikan=$5 WHERE id=$6 RETURNING *`,
      [nama_anak, tempat_lahir, tanggal_lahir, jenis_kelamin, pendidikan, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await pool.query('DELETE FROM ptk_anak WHERE id=$1', [req.params.id]);
    res.json({ message: 'Anak deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
