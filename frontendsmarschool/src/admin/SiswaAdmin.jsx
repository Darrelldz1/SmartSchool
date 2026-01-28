// src/admin/SiswaAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function SiswaAdmin() {
  const auth = useAuth() || {};
  // beberapa AuthProvider menyimpan token di user.token atau token langsung
  const token = auth?.user?.token || auth?.user?.accessToken || auth?.token || localStorage.getItem("token") || null;

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const emptyForm = {
    nama_lengkap: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    nik: "",
    tinggi_cm: "",
    berat_kg: "",
    nomor_hp: "",
    hobi: "",
    cita_cita: "",
    anak_ke: "",
    jumlah_saudara: "",
    jenis_sekolah_asal: "",
    npsn_asal: "",
    nama_sekolah_asal: "",
    kabupaten_asal: "",
    nisn: "",
    status_tempat_tinggal: "",
    alamat_jalan: "",
    desa: "",
    kecamatan: "",
    kab_kota: "",
    provinsi: "",
    kode_pos: "",
    nomor_kk: "",
    jarak_rumah_km: "",
    transportasi: "",
    penerima_bsm: false,
    alasan_bsm: "",
    nomor_kks: "",
    nomor_pkh: "",
    nomor_kip: "",
    periode_bsm: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function headers() {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await axios.get(`${API_BASE}/api/siswa`, { headers: headers() });
      setList(Array.isArray(res.data) ? res.data : (res.data?.data || []));
    } catch (e) {
      console.error("load siswa err", e);
      // jika server respons 401/500, tampilkan pesan sesuai
      setErr("Gagal memuat siswa. Cek backend atau console.");
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function beginCreate() {
    setForm(emptyForm);
    setEditingId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function beginEdit(s) {
    setForm({ ...s });
    setEditingId(s.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...emptyForm, ...form };
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/api/siswa/${editingId}`, payload, { headers: headers() });
        alert("Data siswa diperbarui");
      } else {
        await axios.post(`${API_BASE}/api/siswa`, payload, { headers: headers() });
        alert("Siswa ditambahkan");
      }
      await load();
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      console.error("save siswa err", err);
      alert(err?.response?.data?.error || err?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Hapus siswa ini?")) return;
    try {
      await axios.delete(`${API_BASE}/api/siswa/${id}`, { headers: headers() });
      alert("Siswa dihapus");
      await load();
    } catch (err) {
      console.error("delete siswa err", err);
      alert(err?.response?.data?.error || "Gagal menghapus");
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manajemen Siswa</h1>

      <div className="mb-4">
        <button onClick={beginCreate} className="px-3 py-2 bg-green-600 text-white rounded">Tambah Siswa</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label>Nama Lengkap</label>
            <input name="nama_lengkap" value={form.nama_lengkap} onChange={onChange} className="w-full border p-2" />
          </div>
          <div>
            <label>Jenis Kelamin</label>
            <select name="jenis_kelamin" value={form.jenis_kelamin} onChange={onChange} className="w-full border p-2">
              <option value="">-- pilih --</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          <div>
            <label>Tempat Lahir</label>
            <input name="tempat_lahir" value={form.tempat_lahir} onChange={onChange} className="w-full border p-2" />
          </div>
          <div>
            <label>Tanggal Lahir</label>
            <input type="date" name="tanggal_lahir" value={form.tanggal_lahir || ""} onChange={onChange} className="w-full border p-2" />
          </div>

          <div>
            <label>NISN</label>
            <input name="nisn" value={form.nisn} onChange={onChange} className="w-full border p-2" />
          </div>
          <div>
            <label>No HP</label>
            <input name="nomor_hp" value={form.nomor_hp} onChange={onChange} className="w-full border p-2" />
          </div>

          <div className="col-span-2">
            <label>Alamat Jalan</label>
            <input name="alamat_jalan" value={form.alamat_jalan} onChange={onChange} className="w-full border p-2" />
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
            {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Buat Siswa"}
          </button>
          <button type="button" onClick={() => { setForm(emptyForm); setEditingId(null); }} className="px-4 py-2 bg-gray-200 rounded">Reset</button>
        </div>
      </form>

      {loading ? <div>Memuat...</div> : err ? <div className="text-red-600">{err}</div> : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="border px-2 py-2">ID</th>
              <th className="border px-2 py-2">Nama</th>
              <th className="border px-2 py-2">NISN</th>
              <th className="border px-2 py-2">No HP</th>
              <th className="border px-2 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td className="border px-2 py-2">{s.id}</td>
                <td className="border px-2 py-2">{s.nama_lengkap}</td>
                <td className="border px-2 py-2">{s.nisn}</td>
                <td className="border px-2 py-2">{s.nomor_hp}</td>
                <td className="border px-2 py-2 space-x-2">
                  <button onClick={() => beginEdit(s)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="px-2 py-1 bg-red-600 text-white rounded">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
