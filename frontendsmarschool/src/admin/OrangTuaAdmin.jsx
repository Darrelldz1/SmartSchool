// src/admin/OrangTuaAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function OrangTuaAdmin() {
  const auth = useAuth() || {};
  const token = auth?.user?.token || auth?.token || localStorage.getItem("token") || null;

  const [list, setList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [form, setForm] = useState({
    siswa_id: "",
    jenis: "ayah",
    nama_lengkap: "",
    nik: "",
    tempat_tanggal_lahir: "",
    nomor_hp: "",
    pendidikan: "",
    pekerjaan: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function headers() {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async function loadAll() {
    setLoading(true);
    setErr(null);
    try {
      const [r1, r2] = await Promise.all([
        axios.get(`${API_BASE}/api/orang_tua`, { headers: headers() }).catch((e) => ({ error: e })),
        axios.get(`${API_BASE}/api/siswa`, { headers: headers() }).catch((e) => ({ error: e })),
      ]);

      const orangData = r1 && !r1.error ? (Array.isArray(r1.data) ? r1.data : []) : [];
      const siswaData = r2 && !r2.error ? (Array.isArray(r2.data) ? r2.data : []) : [];

      setList(orangData);
      setSiswaList(siswaData);
    } catch (e) {
      console.error("loadAll orang tua err", e);
      setErr("Gagal memuat data. Cek console.");
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function beginEdit(row) {
    // make sure to map fields expected by the form (if backend returns different keys)
    setForm({
      siswa_id: row.siswa_id ?? "",
      jenis: row.jenis ?? "ayah",
      nama_lengkap: row.nama_lengkap ?? "",
      nik: row.nik ?? "",
      tempat_tanggal_lahir: row.tempat_tanggal_lahir ?? "",
      nomor_hp: row.nomor_hp ?? "",
      pendidikan: row.pendidikan ?? "",
      pekerjaan: row.pekerjaan ?? "",
    });
    setEditingId(row.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setForm({
      siswa_id: "",
      jenis: "ayah",
      nama_lengkap: "",
      nik: "",
      tempat_tanggal_lahir: "",
      nomor_hp: "",
      pendidikan: "",
      pekerjaan: "",
    });
    setEditingId(null);
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/api/orang_tua/${editingId}`, form, { headers: headers() });
      } else {
        await axios.post(`${API_BASE}/api/orang_tua`, form, { headers: headers() });
      }
      alert("Berhasil");
      reset();
      await loadAll();
    } catch (err) {
      console.error("submit orang tua err", err);
      alert(err?.response?.data?.error || err?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function del(id) {
    if (!window.confirm("Hapus?")) return;
    try {
      await axios.delete(`${API_BASE}/api/orang_tua/${id}`, { headers: headers() });
      await loadAll();
    } catch (err) {
      console.error("delete orang tua err", err);
      alert(err?.response?.data?.error || "Gagal menghapus");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Data Orang Tua / Wali</h1>

      <form onSubmit={submit} className="bg-white p-4 rounded mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label>Siswa</label>
            <select name="siswa_id" value={form.siswa_id} onChange={onChange} className="w-full border p-2">
              <option value="">-- pilih --</option>
              {siswaList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama_lengkap}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Jenis</label>
            <select name="jenis" value={form.jenis} onChange={onChange} className="w-full border p-2">
              <option value="ayah">Ayah</option>
              <option value="ibu">Ibu</option>
              <option value="wali">Wali</option>
            </select>
          </div>

          <div>
            <label>Nama Lengkap</label>
            <input name="nama_lengkap" value={form.nama_lengkap} onChange={onChange} className="w-full border p-2" />
          </div>

          <div>
            <label>NIK</label>
            <input name="nik" value={form.nik} onChange={onChange} className="w-full border p-2" />
          </div>

          <div>
            <label>Tempat/Tgl Lahir</label>
            <input name="tempat_tanggal_lahir" value={form.tempat_tanggal_lahir} onChange={onChange} className="w-full border p-2" />
          </div>

          <div>
            <label>No HP</label>
            <input name="nomor_hp" value={form.nomor_hp} onChange={onChange} className="w-full border p-2" />
          </div>

          <div>
            <label>Pendidikan</label>
            <input name="pendidikan" value={form.pendidikan} onChange={onChange} className="w-full border p-2" />
          </div>

          <div>
            <label>Pekerjaan</label>
            <input name="pekerjaan" value={form.pekerjaan} onChange={onChange} className="w-full border p-2" />
          </div>
        </div>

        <div className="mt-3">
          <button disabled={saving} className="px-3 py-2 bg-blue-600 text-white rounded">
            {saving ? "Menyimpan..." : editingId ? "Simpan" : "Tambah"}
          </button>
          <button type="button" onClick={reset} className="ml-2 px-3 py-2 bg-gray-200 rounded">
            Reset
          </button>
        </div>

        {err && <div className="text-red-600 mt-2">{err}</div>}
      </form>

      {loading ? (
        <div>Memuat...</div>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th>ID</th>
              <th>Siswa</th>
              <th>Nama</th>
              <th>Jenis</th>
              <th>No HP</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td className="border px-2 py-1">{r.id}</td>
                <td className="border px-2 py-1">{siswaList.find((s) => s.id === r.siswa_id)?.nama_lengkap || r.siswa_id}</td>
                <td className="border px-2 py-1">{r.nama_lengkap}</td>
                <td className="border px-2 py-1">{r.jenis}</td>
                <td className="border px-2 py-1">{r.nomor_hp}</td>
                <td className="border px-2 py-1">
                  <button className="px-2 py-1 bg-yellow-500 text-white mr-2" onClick={() => beginEdit(r)}>
                    Edit
                  </button>
                  <button className="px-2 py-1 bg-red-600 text-white" onClick={() => del(r.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
