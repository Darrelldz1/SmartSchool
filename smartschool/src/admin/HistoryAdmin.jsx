// src/admin/HistoryAdmin.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function HistoryAdmin() {
  const { user } = useAuth() || {};
  const token = (user && (user.token || user.accessToken || user.authToken)) || localStorage.getItem("token") || null;
  const navigate = useNavigate();

  const [history, setHistory] = useState(null); // { id, description, created_at, ... }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formDescription, setFormDescription] = useState("");

  const request = useCallback(
    (opts) => {
      const headers = opts.headers ? { ...opts.headers } : {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      // default JSON for non-FormData
      if (!headers["Content-Type"] && !(opts.data instanceof FormData)) headers["Content-Type"] = "application/json";
      return axios({ baseURL: API_BASE, ...opts, headers });
    },
    [token]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/api/history`);
      setHistory(res.data);
      setFormDescription(res.data.description || "");
      setEditing(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setHistory(null);
        setFormDescription("");
        setEditing(true); // allow admin to create
      } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        // unauthorized -> redirect to login
        navigate("/login");
      } else {
        console.error("load history err", err);
        setError("Gagal memuat data tentang sekolah");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await request({
        url: "/api/history",
        method: "post",
        data: { description: formDescription }
      });
      setHistory(res.data.history);
      setEditing(false);
      alert("Sejarah (history) berhasil dibuat");
    } catch (err) {
      console.error("create history err", err);
      setError(err.response?.data?.error || "Gagal membuat data");
    } finally {
      setSaving(false);
      await load();
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (saving) return;
    if (!history?.id) return setError("Tidak ada data untuk diupdate");
    setSaving(true);
    setError(null);
    try {
      const res = await request({
        url: `/api/history/${history.id}`,
        method: "put",
        data: { description: formDescription }
      });
      setHistory(res.data.history);
      setEditing(false);
      alert("Sejarah berhasil diupdate");
    } catch (err) {
      console.error("update history err", err);
      setError(err.response?.data?.error || "Gagal mengupdate data");
    } finally {
      setSaving(false);
      await load();
    }
  }

  async function handleDelete() {
    if (!history?.id) return;
    if (!window.confirm("Hapus sejarah sekolah ini? Tindakan tidak dapat dikembalikan.")) return;
    try {
      await request({ url: `/api/history/${history.id}`, method: "delete" });
      setHistory(null);
      setFormDescription("");
      setEditing(true);
      alert("Sejarah berhasil dihapus");
    } catch (err) {
      console.error("delete history err", err);
      alert(err.response?.data?.error || "Gagal menghapus data");
    } finally {
      await load();
    }
  }

  if (loading) return <div className="p-6">Memuat...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sejarah Sekolah (History)</h1>
        <div>
          <button onClick={() => navigate("/admin")} className="mr-2 px-3 py-2 rounded bg-gray-200">Kembali</button>
          <button onClick={() => { if (!history) setEditing(true); else setEditing(s => !s); }} className="px-3 py-2 rounded bg-blue-600 text-white">
            {editing ? "Batal" : history ? "Edit" : "Buat"}
          </button>
        </div>
      </div>

      {history && !editing && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h3 className="font-bold">Sejarah</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{history.description || "-"}</p>
          <div className="mt-4 space-x-2">
            <button onClick={() => setEditing(true)} className="px-3 py-1 rounded bg-yellow-500 text-white">Edit</button>
            <button onClick={handleDelete} className="px-3 py-1 rounded bg-red-600 text-white">Hapus</button>
          </div>
        </div>
      )}

      {editing && (
        <form onSubmit={history ? handleUpdate : handleCreate} className="bg-white p-4 rounded shadow">
          <div className="mb-3">
            <label className="block font-semibold mb-1">Deskripsi Sejarah</label>
            <textarea
              name="description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={8}
              className="w-full border p-2 rounded"
              placeholder="Tuliskan sejarah sekolah..."
              required
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded">
              {saving ? "Menyimpan..." : history ? "Simpan Perubahan" : "Buat Sejarah"}
            </button>
            <button type="button" onClick={() => { setEditing(false); setFormDescription(history?.description || ""); }} className="px-4 py-2 bg-gray-200 rounded">
              Batal
            </button>
          </div>

          {error && <div className="mt-3 text-red-600">{error}</div>}
        </form>
      )}
    </div>
  );
}
