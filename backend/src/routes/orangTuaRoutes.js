const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');


router.post("/", auth(["admin"]), async (req, res) => {
  try {
    const {
      siswa_id,
      jenis,
      nama_lengkap,
      nik,
      tempat_tanggal_lahir,
      nomor_hp,
      pendidikan,
      pekerjaan
    } = req.body;

    const result = await pool.query(
      `INSERT INTO orang_tua (
        siswa_id, jenis, nama_lengkap, nik, tempat_tanggal_lahir, nomor_hp,
        pendidikan, pekerjaan
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        siswa_id,
        jenis,
        nama_lengkap,
        nik,
        tempat_tanggal_lahir,
        nomor_hp,
        pendidikan,
        pekerjaan
      ]
    );

    res.status(201).json({ message: "Data orang tua ditambahkan", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET semua orang tua
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orang_tua ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET orang tua berdasarkan siswa
router.get("/siswa/:siswa_id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orang_tua WHERE siswa_id=$1",
      [req.params.siswa_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET detail orang tua by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orang_tua WHERE id=$1", [req.params.id]);
    if (!result.rows.length)
      return res.status(404).json({ error: "Data orang tua tidak ditemukan" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE orang tua
router.put("/:id", auth(["admin"]), async (req, res) => {
  try {
    const {
      nama_lengkap,
      nik,
      tempat_tanggal_lahir,
      nomor_hp,
      pendidikan,
      pekerjaan
    } = req.body;

    const result = await pool.query(
      `UPDATE orang_tua SET
        nama_lengkap=$1,
        nik=$2,
        tempat_tanggal_lahir=$3,
        nomor_hp=$4,
        pendidikan=$5,
        pekerjaan=$6
      WHERE id=$7 RETURNING *`,
      [
        nama_lengkap,
        nik,
        tempat_tanggal_lahir,
        nomor_hp,
        pendidikan,
        pekerjaan,
        req.params.id
      ]
    );

    res.json({ message: "Data orang tua diperbarui", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE orang tua
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    await pool.query("DELETE FROM orang_tua WHERE id=$1", [req.params.id]);
    res.json({ message: "Data orang tua dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
