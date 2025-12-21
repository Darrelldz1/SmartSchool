const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { ptk_id, tingkat, nama_rombel, kurikulum, jumlah_siswa, jtm_per_minggu, jenis } = req.body;
    const result = await pool.query(
      `INSERT INTO ptk_mapel (ptk_id, tingkat, nama_rombel, kurikulum, jumlah_siswa, jtm_per_minggu, jenis)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [ptk_id, tingkat, nama_rombel, kurikulum, jumlah_siswa, jtm_per_minggu, jenis]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/ptk/:ptk_id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ptk_mapel WHERE ptk_id=$1', [req.params.ptk_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { tingkat, nama_rombel, kurikulum, jumlah_siswa, jtm_per_minggu, jenis } = req.body;
    const result = await pool.query(
      `UPDATE ptk_mapel SET tingkat=$1, nama_rombel=$2, kurikulum=$3, jumlah_siswa=$4, jtm_per_minggu=$5, jenis=$6 WHERE id=$7 RETURNING *`,
      [tingkat, nama_rombel, kurikulum, jumlah_siswa, jtm_per_minggu, jenis, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await pool.query('DELETE FROM ptk_mapel WHERE id=$1', [req.params.id]);
    res.json({ message: 'Mapel deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
