const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { ptk_id, status_tempat_tugas, jenis_tugas, ekuivalensi_jtm } = req.body;
    const result = await pool.query(
      `INSERT INTO ptk_tugas_tambahan (ptk_id, status_tempat_tugas, jenis_tugas, ekuivalensi_jtm)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [ptk_id, status_tempat_tugas, jenis_tugas, ekuivalensi_jtm]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/ptk/:ptk_id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ptk_tugas_tambahan WHERE ptk_id=$1', [req.params.ptk_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { status_tempat_tugas, jenis_tugas, ekuivalensi_jtm } = req.body;
    const result = await pool.query(
      `UPDATE ptk_tugas_tambahan SET status_tempat_tugas=$1, jenis_tugas=$2, ekuivalensi_jtm=$3 WHERE id=$4 RETURNING *`,
      [status_tempat_tugas, jenis_tugas, ekuivalensi_jtm, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await pool.query('DELETE FROM ptk_tugas_tambahan WHERE id=$1', [req.params.id]);
    res.json({ message: 'Tugas tambahan deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
