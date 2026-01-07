import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

/**
 * Admin Teacher CRUD page
 * - GET /api/teacher
 * - GET /api/teacher/:id (used when editing)
 * - POST /api/teacher  (multipart/form-data)
 * - PUT /api/teacher/:id (multipart/form-data)
 * - DELETE /api/teacher/:id
 *
 * Save this file as src/admin/TeacherAdmin.jsx
 */

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function TeacherAdmin() {
  const { user } = useAuth() || {};
  const token = (user && (user.token || user.accessToken || user.authToken)) || localStorage.getItem("token") || null;
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // form state
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [dateJoined, setDateJoined] = useState("");
  const [position, setPosition] = useState("");
  const [subject, setSubject] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const fileInputRef = useRef(null);

  // helper axios instance with auth header
  const axiosReq = axios.create({
    baseURL: API_BASE,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  // load list
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/api/teacher`);
      setItems(res.data || []);
    } catch (err) {
      console.error("load teachers err", err);
      setError("Gagal memuat daftar guru.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // cleanup preview URL
    return () => { if (photoPreview) URL.revokeObjectURL(photoPreview); };
    // eslint-disable-next-line
  }, []);

  // open create form
  const handleCreateOpen = () => {
    clearForm();
    setIsEditing(false);
    setEditingId(null);
    setShowForm(true);
  };

  // open edit form
  const handleEditOpen = async (id) => {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/teacher/${id}`);
      const t = res.data;
      setName(t.name || "");
      setNip(t.nip || "");
      setDateJoined(t.date_joined ? t.date_joined.split("T")[0] : "");
      setPosition(t.position || "");
      setSubject(t.subject || "");
      setPhotoPreview(t.photo_url || null);
      setPhotoFile(null);
      setIsEditing(true);
      setEditingId(id);
      setShowForm(true);
    } catch (err) {
      console.error("load teacher for edit err", err);
      alert("Gagal memuat data guru untuk diedit");
    } finally {
      setLoading(false);
    }
  };

  // delete
  const handleDelete = async (id) => {
    if (!window.confirm("Hapus guru ini?")) return;
    try {
      await axiosReq.delete(`/api/teacher/${id}`);
      alert("Guru dihapus");
      await load();
    } catch (err) {
      console.error("delete teacher err", err);
      alert(err?.response?.data?.error || "Gagal menghapus guru");
    }
  };

  // submit create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Nama wajib diisi");
      return;
    }

    try {
      if (photoFile) {
        // send multipart/form-data
        const fd = new FormData();
        fd.append("name", name);
        fd.append("nip", nip || "");
        fd.append("date_joined", dateJoined || "");
        fd.append("position", position || "");
        fd.append("subject", subject || "");
        fd.append("photo", photoFile);

        if (isEditing && editingId) {
          // PUT with FormData (axios will set correct headers)
          await axiosReq.put(`/api/teacher/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
          alert("Guru berhasil diperbarui");
        } else {
          await axiosReq.post(`/api/teacher`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
          alert("Guru berhasil dibuat");
        }
      } else {
        // no file -> send json
        const payload = { name, nip, date_joined: dateJoined || null, position, subject };
        if (isEditing && editingId) {
          await axiosReq.put(`/api/teacher/${editingId}`, payload);
          alert("Guru berhasil diperbarui");
        } else {
          await axiosReq.post(`/api/teacher`, payload);
          alert("Guru berhasil dibuat");
        }
      }

      setShowForm(false);
      await load();
    } catch (err) {
      console.error("save teacher err", err);
      setError(err?.response?.data?.error || err.message || "Gagal menyimpan data");
    }
  };

  const clearForm = () => {
    setName("");
    setNip("");
    setDateJoined("");
    setPosition("");
    setSubject("");
    setPhotoFile(null);
    if (photoPreview) { URL.revokeObjectURL(photoPreview); setPhotoPreview(null); }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onFileChange = (file) => {
    if (!file) {
      setPhotoFile(null);
      if (photoPreview) { URL.revokeObjectURL(photoPreview); setPhotoPreview(null); }
      return;
    }
    setPhotoFile(file);
    const previewUrl = URL.createObjectURL(file);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(previewUrl);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manajemen Guru</h1>
        <div>
          <button onClick={() => navigate("/admin")} className="mr-2 px-3 py-2 rounded bg-gray-200">Kembali</button>
          <button onClick={handleCreateOpen} className="px-3 py-2 rounded bg-blue-600 text-white">Tambah Guru</button>
        </div>
      </div>

      {loading && <div>Memuat...</div>}
      {error && <div className="text-red-600 mb-3">{error}</div>}

      <div className="bg-white p-4 rounded shadow mb-6">
        {items.length === 0 ? (
          <div>Tidak ada data guru.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2">Foto</th>
                  <th className="border px-3 py-2">Nama</th>
                  <th className="border px-3 py-2">NIP</th>
                  <th className="border px-3 py-2">Jabatan</th>
                  <th className="border px-3 py-2">Mata Pelajaran</th>
                  <th className="border px-3 py-2">Bergabung</th>
                  <th className="border px-3 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map(t => (
                  <tr key={t.id}>
                    <td className="border px-3 py-2">
                      {t.photo_url ? <img src={t.photo_url} alt={t.name} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 6 }} /> : <div style={{ width:72, height:72, display:'flex',alignItems:'center',justifyContent:'center',background:'#f3f3f3',borderRadius:6 }}>No</div>}
                    </td>
                    <td className="border px-3 py-2">{t.name}</td>
                    <td className="border px-3 py-2">{t.nip}</td>
                    <td className="border px-3 py-2">{t.position}</td>
                    <td className="border px-3 py-2">{t.subject}</td>
                    <td className="border px-3 py-2">{t.date_joined ? new Date(t.date_joined).toLocaleDateString() : ""}</td>
                    <td className="border px-3 py-2 space-x-2">
                      <button onClick={() => handleEditOpen(t.id)} className="px-2 py-1 rounded bg-yellow-500 text-white">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="px-2 py-1 rounded bg-red-600 text-white">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => { setShowForm(false); clearForm(); }} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{isEditing ? "Edit Guru" : "Tambah Guru"}</h2>
              <button onClick={() => { setShowForm(false); clearForm(); }} className="px-3 py-1 rounded bg-gray-200">Tutup</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block mb-1 font-medium">Nama</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-medium">NIP</label>
                  <input value={nip} onChange={(e) => setNip(e.target.value)} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Tanggal Bergabung</label>
                  <input type="date" value={dateJoined} onChange={(e) => setDateJoined(e.target.value)} className="w-full border px-3 py-2 rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-medium">Jabatan</label>
                  <input value={position} onChange={(e) => setPosition(e.target.value)} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Mata Pelajaran</label>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full border px-3 py-2 rounded" />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">Foto (opsional)</label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => onFileChange(e.target.files?.[0] || null)} />
                {photoPreview && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ marginBottom: 6 }}>Preview:</div>
                    <img src={photoPreview} alt="preview" style={{ maxWidth: 160, maxHeight: 160, objectFit: "cover", borderRadius: 6 }} />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">{isEditing ? "Simpan Perubahan" : "Buat Guru"}</button>
                <button type="button" onClick={() => { setShowForm(false); clearForm(); }} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
              </div>

              {error && <div className="text-red-600">{error}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
