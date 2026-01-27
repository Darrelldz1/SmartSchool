// backend/src/routes/ptkRiwayatSk.js
const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// Create SK
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { ptk_id, nomor_sk, tanggal_sk, tmt_sk, jenis_sk, instansi, golongan } = req.body;
    const result = await pool.query(
      `INSERT INTO ptk_riwayat_sk (ptk_id, nomor_sk, tanggal_sk, tmt_sk, jenis_sk, instansi, golongan)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [ptk_id, nomor_sk, tanggal_sk, tmt_sk, jenis_sk, instansi, golongan]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get all SK for ptk
router.get('/ptk/:ptk_id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ptk_riwayat_sk WHERE ptk_id=$1 ORDER BY tanggal_sk DESC', [req.params.ptk_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update SK
router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { nomor_sk, tanggal_sk, tmt_sk, jenis_sk, instansi, golongan } = req.body;
    const result = await pool.query(
      `UPDATE ptk_riwayat_sk SET nomor_sk=$1, tanggal_sk=$2, tmt_sk=$3, jenis_sk=$4, instansi=$5, golongan=$6 WHERE id=$7 RETURNING *`,
      [nomor_sk, tanggal_sk, tmt_sk, jenis_sk, instansi, golongan, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete SK
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await pool.query('DELETE FROM ptk_riwayat_sk WHERE id=$1', [req.params.id]);
    res.json({ message: 'SK deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
