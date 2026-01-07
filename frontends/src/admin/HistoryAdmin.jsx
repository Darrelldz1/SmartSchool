// src/admin/HistoryAdmin.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import "./sejarah.css"; // Import CSS file

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function HistoryAdmin() {
  const { user } = useAuth() || {};
  const token =
    (user && (user.token || user.accessToken || user.authToken)) ||
    (() => {
      try {
        const raw = localStorage.getItem("auth");
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed.token || null;
      } catch {
        return null;
      }
    })();

  const navigate = useNavigate();

  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formDescription, setFormDescription] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const request = useCallback(
    (opts) => {
      const headers = opts.headers ? { ...opts.headers } : {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (!headers["Content-Type"] && !(opts.data instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }
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
      setImagePreview(res.data.image_url || null);
      setEditing(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setHistory(null);
        setFormDescription("");
        setImagePreview(null);
        setEditing(true);
      } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
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

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function onFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setImageFile(null);
      setImagePreview(history?.image_url || null);
      return;
    }
    setImageFile(f);
    const url = URL.createObjectURL(f);
    setImagePreview(url);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      let res;
      if (imageFile) {
        const fd = new FormData();
        fd.append("description", formDescription || "");
        fd.append("image", imageFile);
        res = await request({ url: "/api/history", method: "post", data: fd });
      } else {
        res = await request({ url: "/api/history", method: "post", data: { description: formDescription } });
      }

      setHistory(res.data.history);
      setFormDescription(res.data.history.description || "");
      setImagePreview(res.data.history.image_url || null);
      setImageFile(null);
      setEditing(false);
      alert("Sejarah (history) berhasil dibuat");
    } catch (err) {
      console.error("create history err", err);
      setError(err.response?.data?.error || err.message || "Gagal membuat data");
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
      let res;
      if (imageFile) {
        const fd = new FormData();
        fd.append("description", formDescription || "");
        fd.append("image", imageFile);
        res = await request({ url: `/api/history/${history.id}`, method: "put", data: fd });
      } else {
        res = await request({ url: `/api/history/${history.id}`, method: "put", data: { description: formDescription } });
      }

      setHistory(res.data.history);
      setFormDescription(res.data.history.description || "");
      setImagePreview(res.data.history.image_url || null);
      setImageFile(null);
      setEditing(false);
      alert("Sejarah berhasil diupdate");
    } catch (err) {
      console.error("update history err", err);
      setError(err.response?.data?.error || err.message || "Gagal mengupdate data");
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
      setImageFile(null);
      setImagePreview(null);
      setEditing(true);
      alert("Sejarah berhasil dihapus");
    } catch (err) {
      console.error("delete history err", err);
      alert(err.response?.data?.error || "Gagal menghapus data");
    } finally {
      await load();
    }
  }

  if (loading) {
    return (
      <div className="profile-admin-container">
        <div className="loading-container">
          <div className="pengumuman-loading-spinner"></div>
          <p>Memuat data sejarah...</p>
        </div>
      </div>
    );
  }

  if (error && !editing) {
    return (
      <div className="profile-admin-container">
        <div className="error-container">
          <p>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-admin-container">
      <div className="profile-admin-wrapper">
        {/* Header */}
        <div className="profile-admin-header">
          <h1>Sejarah Sekolah</h1>
          <div className="header-buttons">
            <button onClick={() => navigate("/admin")} className="btn-back">
              ← Kembali
            </button>
            <button
              onClick={() => {
                if (!history) setEditing(true);
                else setEditing(s => !s);
              }}
              className="btn-edit"
            >
              {editing ? "❌ Batal Edit" : history ? "✏️ Edit" : "➕ Buat Baru"}
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="profile-content-container">
          {/* View Mode */}
          {history && !editing && (
            <div className="profile-view-container">
              <div className="profile-item">
                <h3 style={{ color: "#2d3748", fontSize: "20px", fontWeight: 600, marginBottom: 20 }}>
                  📚 Sejarah Sekolah
                </h3>
                
                {history.image_url && (
                  <div className="profile-images-grid">
                    <div className="profile-image-item">
                      <div className="image-title">Gedung Sekolah</div>
                      <img src={history.image_url} alt="Sejarah Sekolah" />
                    </div>
                  </div>
                )}

                <div className="profile-text-content">
                  <p>{history.description || "-"}</p>
                </div>

                <div className="view-actions">
                  <button onClick={() => setEditing(true)} className="btn-edit">
                    ✏️ Edit Sejarah
                  </button>
                  <button onClick={handleDelete} className="btn-delete">
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit/Create Form */}
          {editing && (
            <form onSubmit={history ? handleUpdate : handleCreate} className="profile-form-section">
              <div className="profile-item">
                <h3 style={{ color: "#2d3748", fontSize: "18px", fontWeight: 600, marginBottom: 20 }}>
                  {history ? "Edit Sejarah Sekolah" : "Buat Sejarah Sekolah Baru"}
                </h3>

                {/* Image Upload Section */}
                <div className="image-upload-section">
                  <div className="image-upload-wrapper">
                    <div className="image-label">Gambar Gedung</div>
                    <div className="image-preview-container">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" />
                      ) : (
                        <div className="image-placeholder">🏫</div>
                      )}
                    </div>
                    <div className="file-input-wrapper">
                      <input
                        type="file"
                        id="history-image"
                        accept="image/*"
                        onChange={onFileChange}
                      />
                      <label htmlFor="history-image" className="file-input-label">
                        📷 Pilih Gambar
                      </label>
                    </div>
                  </div>

                  {/* Text Input Section */}
                  <div className="text-input-section">
                    <label className="input-label">Deskripsi Sejarah Sekolah</label>
                    <textarea
                      name="description"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="text-input"
                      placeholder="Tuliskan sejarah sekolah di sini..."
                      required
                      style={{ minHeight: 180 }}
                    />
                  </div>
                </div>

                {error && (
                  <div className="error-container" style={{ marginTop: 20 }}>
                    {error}
                  </div>
                )}

                {/* Save Button Section */}
                <div className="save-button-section">
                  <button type="submit" disabled={saving} className="btn-save">
                    {saving ? "⏳ Menyimpan..." : history ? "💾 Simpan Perubahan" : "➕ Buat Sejarah"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormDescription(history?.description || "");
                      setImageFile(null);
                      setImagePreview(history?.image_url || null);
                    }}
                    className="btn-cancel"
                  >
                    ❌ Batal
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}