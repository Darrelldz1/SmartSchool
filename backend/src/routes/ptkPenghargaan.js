const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { ptk_id, jenis_penghargaan, nama_penghargaan, tingkat, peringkat, tahun, instansi_pemberi } = req.body;
    const result = await pool.query(
      `INSERT INTO ptk_penghargaan (ptk_id, jenis_penghargaan, nama_penghargaan, tingkat, peringkat, tahun, instansi_pemberi)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [ptk_id, jenis_penghargaan, nama_penghargaan, tingkat, peringkat, tahun, instansi_pemberi]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/ptk/:ptk_id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ptk_penghargaan WHERE ptk_id=$1 ORDER BY tahun DESC', [req.params.ptk_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { jenis_penghargaan, nama_penghargaan, tingkat, peringkat, tahun, instansi_pemberi } = req.body;
    const result = await pool.query(
      `UPDATE ptk_penghargaan SET jenis_penghargaan=$1, nama_penghargaan=$2, tingkat=$3, peringkat=$4, tahun=$5, instansi_pemberi=$6 WHERE id=$7 RETURNING *`,
      [jenis_penghargaan, nama_penghargaan, tingkat, peringkat, tahun, instansi_pemberi, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await pool.query('DELETE FROM ptk_penghargaan WHERE id=$1', [req.params.id]);
    res.json({ message: 'Penghargaan deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
