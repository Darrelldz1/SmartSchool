const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// ✅ CREATE siswa
router.post("/", auth(["admin"]), async (req, res) => {
  try {
    const data = req.body;

    const result = await pool.query(
      `INSERT INTO siswa (
        nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin,
        nik, tinggi_cm, berat_kg, nomor_hp,
        hobi, cita_cita, anak_ke, jumlah_saudara,
        jenis_sekolah_asal, npsn_asal, nama_sekolah_asal, kabupaten_asal, nisn,
        status_tempat_tinggal, alamat_jalan, desa, kecamatan, kab_kota,
        provinsi, kode_pos, nomor_kk, jarak_rumah_km, transportasi,
        penerima_bsm, alasan_bsm, nomor_kks, nomor_pkh, nomor_kip, periode_bsm
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,
        $25,$26,$27,$28,$29,$30,$31,$32,$33
      ) RETURNING *`,

      [
        data.nama_lengkap, data.tempat_lahir, data.tanggal_lahir, data.jenis_kelamin,
        data.nik, data.tinggi_cm, data.berat_kg, data.nomor_hp,
        data.hobi, data.cita_cita, data.anak_ke, data.jumlah_saudara,
        data.jenis_sekolah_asal, data.npsn_asal, data.nama_sekolah_asal,
        data.kabupaten_asal, data.nisn, data.status_tempat_tinggal,
        data.alamat_jalan, data.desa, data.kecamatan, data.kab_kota,
        data.provinsi, data.kode_pos, data.nomor_kk, data.jarak_rumah_km,
        data.transportasi, data.penerima_bsm, data.alasan_bsm,
        data.nomor_kks, data.nomor_pkh, data.nomor_kip, data.periode_bsm
      ]
    );

    res.status(201).json({ message: "Siswa ditambahkan", siswa: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET semua siswa
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM siswa ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET siswa by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM siswa WHERE id=$1", [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: "Siswa tidak ditemukan" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ UPDATE siswa
router.put("/:id", auth(["admin"]), async (req, res) => {
  try {
    const data = req.body;

    const result = await pool.query(
      `UPDATE siswa SET
        nama_lengkap=$1, tempat_lahir=$2, tanggal_lahir=$3,
        jenis_kelamin=$4, nik=$5, tinggi_cm=$6, berat_kg=$7, nomor_hp=$8,
        hobi=$9, cita_cita=$10, anak_ke=$11, jumlah_saudara=$12,
        jenis_sekolah_asal=$13, npsn_asal=$14, nama_sekolah_asal=$15, kabupaten_asal=$16,
        nisn=$17, status_tempat_tinggal=$18, alamat_jalan=$19, desa=$20,
        kecamatan=$21, kab_kota=$22, provinsi=$23, kode_pos=$24,
        nomor_kk=$25, jarak_rumah_km=$26, transportasi=$27,
        penerima_bsm=$28, alasan_bsm=$29, nomor_kks=$30,
        nomor_pkh=$31, nomor_kip=$32, periode_bsm=$33
      WHERE id=$34 RETURNING *`,

      [
        data.nama_lengkap, data.tempat_lahir, data.tanggal_lahir,
        data.jenis_kelamin, data.nik, data.tinggi_cm, data.berat_kg, data.nomor_hp,
        data.hobi, data.cita_cita, data.anak_ke, data.jumlah_saudara,

        data.jenis_sekolah_asal, data.npsn_asal, data.nama_sekolah_asal,
        data.kabupaten_asal, data.nisn, data.status_tempat_tinggal,
        data.alamat_jalan, data.desa, data.kecamatan, data.kab_kota,
        data.provinsi, data.kode_pos, data.nomor_kk, data.jarak_rumah_km,
        data.transportasi, data.penerima_bsm, data.alasan_bsm,
        data.nomor_kks, data.nomor_pkh, data.nomor_kip, data.periode_bsm,
        req.params.id
      ]
    );

    res.json({ message: "Data siswa diperbarui", siswa: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ DELETE siswa
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    await pool.query("DELETE FROM siswa WHERE id=$1", [req.params.id]);
    res.json({ message: "Siswa dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
