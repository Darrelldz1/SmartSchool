// src/admin/PrestasiAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function PrestasiAdmin() {
  const auth = useAuth() || {};
  const token = auth?.user?.token || auth?.token || localStorage.getItem("token") || null;

  const [list, setList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ siswa_id: "", bidang: "", tingkat: "", peringkat: "", tahun: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function headers() {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async function loadAll() {
    setLoading(true);
    try {
      const [r1, r2] = await Promise.all([
        axios.get(`${API_BASE}/api/prestasi`, { headers: headers() }).catch(e => ({ error: e })),
        axios.get(`${API_BASE}/api/siswa`, { headers: headers() }).catch(e => ({ error: e }))
      ]);

      const prestasiData = r1 && !r1.error ? (Array.isArray(r1.data) ? r1.data : []) : [];
      const siswaData = r2 && !r2.error ? (Array.isArray(r2.data) ? r2.data : []) : [];

      setList(prestasiData);
      setSiswaList(siswaData);
    } catch (err) {
      console.error("loadAll prestasi err", err);
      // tetap set loading false di finally
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function beginEdit(p) {
    setForm({ siswa_id: p.siswa_id, bidang: p.bidang, tingkat: p.tingkat, peringkat: p.peringkat, tahun: p.tahun });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm({ siswa_id: "", bidang: "", tingkat: "", peringkat: "", tahun: "" });
    setEditingId(null);
  }

  async function submit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/api/prestasi/${editingId}`, form, { headers: headers() });
      } else {
        await axios.post(`${API_BASE}/api/prestasi`, form, { headers: headers() });
      }
      resetForm();
      await loadAll();
      alert("Berhasil");
    } catch (err) {
      console.error("submit prestasi err", err);
      alert(err?.response?.data?.error || "Gagal");
    }
  }

  async function del(id) {
    if (!window.confirm("Hapus?")) return;
    try {
      await axios.delete(`${API_BASE}/api/prestasi/${id}`, { headers: headers() });
      await loadAll();
    } catch (err) {
      console.error("delete prestasi err", err);
      alert(err?.response?.data?.error || "Gagal menghapus");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Prestasi</h1>

      <form onSubmit={submit} className="bg-white p-4 rounded mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label>Siswa</label>
            <select name="siswa_id" value={form.siswa_id} onChange={onChange} className="w-full border p-2">
              <option value="">-- pilih siswa --</option>
              {siswaList.map(s => <option key={s.id} value={s.id}>{s.nama_lengkap}</option>)}
            </select>
          </div>

          <div>
            <label>Bidang</label>
            <input name="bidang" value={form.bidang} onChange={onChange} className="w-full border p-2" />
          </div>

          <div>
            <label>Tingkat</label>
            <input name="tingkat" value={form.tingkat} onChange={onChange} className="w-full border p-2" />
          </div>

          <div>
            <label>Peringkat</label>
            <input name="peringkat" value={form.peringkat} onChange={onChange} className="w-full border p-2" />
          </div>

          <div>
            <label>Tahun</label>
            <input name="tahun" type="number" value={form.tahun} onChange={onChange} className="w-full border p-2" />
          </div>
        </div>

        <div className="mt-3">
          <button className="px-3 py-2 bg-blue-600 text-white rounded">{editingId ? "Simpan" : "Tambah"}</button>
          <button type="button" onClick={resetForm} className="ml-2 px-3 py-2 bg-gray-200 rounded">Reset</button>
        </div>
      </form>

      {loading ? <div>Memuat...</div> : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th>ID</th><th>Siswa</th><th>Bidang</th><th>Tingkat</th><th>Peringkat</th><th>Tahun</th><th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id}>
                <td className="border px-2 py-1">{p.id}</td>
                <td className="border px-2 py-1">{(siswaList.find(s => s.id === p.siswa_id)?.nama_lengkap) || p.siswa_id}</td>
                <td className="border px-2 py-1">{p.bidang}</td>
                <td className="border px-2 py-1">{p.tingkat}</td>
                <td className="border px-2 py-1">{p.peringkat}</td>
                <td className="border px-2 py-1">{p.tahun}</td>
                <td className="border px-2 py-1 space-x-2">
                  <button className="px-2 py-1 bg-yellow-500 text-white" onClick={() => beginEdit(p)}>Edit</button>
                  <button className="px-2 py-1 bg-red-600 text-white" onClick={() => del(p.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
