const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

// ✅ CREATE prestasi
router.post("/", auth(["admin"]), async (req, res) => {
  try {
    const { siswa_id, bidang, tingkat, peringkat, tahun } = req.body;

    const result = await pool.query(
      `INSERT INTO prestasi (siswa_id, bidang, tingkat, peringkat, tahun)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [siswa_id, bidang, tingkat, peringkat, tahun]
    );

    res.status(201).json({ message: "Prestasi ditambahkan", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET semua prestasi
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM prestasi ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET prestasi by siswa
router.get("/siswa/:siswa_id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM prestasi WHERE siswa_id=$1 ORDER BY tahun DESC",
      [req.params.siswa_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE prestasi
router.put("/:id", auth(["admin"]), async (req, res) => {
  try {
    const { bidang, tingkat, peringkat, tahun } = req.body;

    const result = await pool.query(
      `UPDATE prestasi SET
        bidang=$1, tingkat=$2, peringkat=$3, tahun=$4
       WHERE id=$5 RETURNING *`,
      [bidang, tingkat, peringkat, tahun, req.params.id]
    );

    res.json({ message: "Prestasi diperbarui", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE prestasi
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    await pool.query("DELETE FROM prestasi WHERE id=$1", [req.params.id]);
    res.json({ message: "Prestasi dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
