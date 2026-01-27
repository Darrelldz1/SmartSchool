const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// CREATE Pendidikan Formal
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { ptk_id, jenjang, program_studi, gelar, fakultas, tahun_masuk, tahun_lulus } = req.body;

    const result = await pool.query(
      `INSERT INTO ptk_pendidikan_formal 
        (ptk_id, jenjang, program_studi, gelar, fakultas, tahun_masuk, tahun_lulus)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [ptk_id, jenjang, program_studi, gelar, fakultas, tahun_masuk, tahun_lulus]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Pendidikan Formal by PTK
router.get('/ptk/:ptk_id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM ptk_pendidikan_formal WHERE ptk_id=$1 ORDER BY tahun_lulus DESC',
      [req.params.ptk_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Pendidikan Formal
router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { jenjang, program_studi, gelar, fakultas, tahun_masuk, tahun_lulus } = req.body;

    const result = await pool.query(
      `UPDATE ptk_pendidikan_formal 
       SET jenjang=$1, program_studi=$2, gelar=$3, fakultas=$4, tahun_masuk=$5, tahun_lulus=$6
       WHERE id=$7
       RETURNING *`,
      [jenjang, program_studi, gelar, fakultas, tahun_masuk, tahun_lulus, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await pool.query('DELETE FROM ptk_pendidikan_formal WHERE id=$1', [req.params.id]);
    res.json({ message: 'Pendidikan formal deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
