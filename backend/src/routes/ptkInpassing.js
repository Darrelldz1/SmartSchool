const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { ptk_id, nomor_sk, tanggal_sk, tmt_sk, instansi, golongan, gaji_pokok } = req.body;
    const result = await pool.query(
      `INSERT INTO ptk_inpassing (ptk_id, nomor_sk, tanggal_sk, tmt_sk, instansi, golongan, gaji_pokok)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [ptk_id, nomor_sk, tanggal_sk, tmt_sk, instansi, golongan, gaji_pokok]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/ptk/:ptk_id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ptk_inpassing WHERE ptk_id=$1 ORDER BY tanggal_sk DESC', [req.params.ptk_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { nomor_sk, tanggal_sk, tmt_sk, instansi, golongan, gaji_pokok } = req.body;
    const result = await pool.query(
      `UPDATE ptk_inpassing SET nomor_sk=$1, tanggal_sk=$2, tmt_sk=$3, instansi=$4, golongan=$5, gaji_pokok=$6 WHERE id=$7 RETURNING *`,
      [nomor_sk, tanggal_sk, tmt_sk, instansi, golongan, gaji_pokok, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await pool.query('DELETE FROM ptk_inpassing WHERE id=$1', [req.params.id]);
    res.json({ message: 'Inpassing deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
  