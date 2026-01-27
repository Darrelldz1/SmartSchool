const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { ptk_id, tahun, nama_pelatihan, bidang, penyelenggara, biaya } = req.body;
    const result = await pool.query(
      `INSERT INTO ptk_pelatihan (ptk_id, tahun, nama_pelatihan, bidang, penyelenggara, biaya) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [ptk_id, tahun, nama_pelatihan, bidang, penyelenggara, biaya]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/ptk/:ptk_id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ptk_pelatihan WHERE ptk_id=$1 ORDER BY tahun DESC', [req.params.ptk_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { tahun, nama_pelatihan, bidang, penyelenggara, biaya } = req.body;
    const result = await pool.query(
      `UPDATE ptk_pelatihan SET tahun=$1, nama_pelatihan=$2, bidang=$3, penyelenggara=$4, biaya=$5 WHERE id=$6 RETURNING *`,
      [tahun, nama_pelatihan, bidang, penyelenggara, biaya, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await pool.query('DELETE FROM ptk_pelatihan WHERE id=$1', [req.params.id]);
    res.json({ message: 'Pelatihan deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
