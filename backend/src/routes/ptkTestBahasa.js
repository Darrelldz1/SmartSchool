const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { ptk_id, bahasa, tahun, nama_test, jenis_test, lembaga, hasil } = req.body;
    const result = await pool.query(
      `INSERT INTO ptk_test_bahasa (ptk_id, bahasa, tahun, nama_test, jenis_test, lembaga, hasil)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [ptk_id, bahasa, tahun, nama_test, jenis_test, lembaga, hasil]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/ptk/:ptk_id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ptk_test_bahasa WHERE ptk_id=$1 ORDER BY tahun DESC', [req.params.ptk_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { bahasa, tahun, nama_test, jenis_test, lembaga, hasil } = req.body;
    const result = await pool.query(
      `UPDATE ptk_test_bahasa SET bahasa=$1, tahun=$2, nama_test=$3, jenis_test=$4, lembaga=$5, hasil=$6 WHERE id=$7 RETURNING *`,
      [bahasa, tahun, nama_test, jenis_test, lembaga, hasil, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await pool.query('DELETE FROM ptk_test_bahasa WHERE id=$1', [req.params.id]);
    res.json({ message: 'Test bahasa deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
