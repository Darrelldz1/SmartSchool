import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import "./gallery.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function GalleryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth() || {};

  const [file, setFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileRef = useRef(null);

  const buildImage = (row) => {
    if (!row) return null;
    if (row.image_url) return row.image_url;
    if (!row.image_path) return null;
    if (row.image_path.startsWith("http")) return row.image_path;
    const p = row.image_path.startsWith("/") ? row.image_path : `/${row.image_path}`;
    return `${API_BASE}${p}`;
  };

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    setLoading(true);
    axios.get(`${API_BASE}/api/gallery/${id}`)
      .then(res => {
        if (!mounted) return;
        setExistingImage(buildImage(res.data));
      })
      .catch(err => {
        console.error("load gallery item err", err);
        alert("Gagal memuat item gallery.");
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] ?? null;
    if (!selectedFile) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(selectedFile.type)) {
      alert("Format file tidak didukung. Gunakan JPG/PNG/GIF/WEBP.");
      e.target.value = "";
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleRemoveSelected = () => {
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // optional front-permission check
    if (!user || !(user.role === "admin" || user.role === "guru")) {
      alert("Anda tidak memiliki izin untuk melakukan aksi ini.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      if (file) fd.append("image", file); // <-- sesuaikan nama field jika backend beda

      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      if (id) {
        await axios.put(`${API_BASE}/api/gallery/${id}`, fd, { headers });
        alert("Gallery diperbarui");
      } else {
        await axios.post(`${API_BASE}/api/gallery`, fd, { headers });
        alert("Gallery ditambahkan");
      }
      navigate("/admin/gallery");
    } catch (err) {
      console.error("submit gallery err", err);
      const msg = err?.response?.data?.error || err.message || "Gagal menyimpan gallery";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gallery-form-container">
      <div className="gallery-form-wrapper">
        <div className="gallery-form-header">
          <h1>{id ? "Edit Galeri" : "Tambah Galeri"}</h1>
          <button onClick={() => navigate(-1)} className="btn-gallery-back">← Kembali</button>
        </div>

        {loading && id && !existingImage && !previewUrl ? (
          <div className="gallery-form-loading-overlay">
            <div className="gallery-loading-spinner" />
            <p>Memuat data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="gallery-form-content">
            <div className="gallery-form-group">
              <label className="gallery-form-label">Pilih Gambar</label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="gallery-file-input"
                disabled={loading}
              />
              <p style={{ fontSize: 12, color: "#718096", marginTop: 8 }}>
                Format: JPG, PNG, GIF, WEBP. Maksimal 5MB
              </p>
            </div>

            {existingImage && !previewUrl && (
              <div className="gallery-image-preview-section">
                <div className="gallery-image-preview-title">Gambar Saat Ini</div>
                <div className="gallery-image-preview-container">
                  <img src={existingImage} alt="existing" />
                </div>
              </div>
            )}

            {previewUrl && (
              <div className="gallery-image-preview-section">
                <div className="gallery-image-preview-title">Preview Upload Baru</div>
                <div className="gallery-image-preview-container">
                  <img src={previewUrl} alt="preview" />
                </div>
                <div style={{ marginTop: 8 }}>
                  <button type="button" onClick={handleRemoveSelected} className="btn-gallery-remove">Hapus Pilihan</button>
                </div>
              </div>
            )}

            {!previewUrl && !existingImage && <div style={{ marginTop: 12, color: "#666" }}>Belum ada gambar dipilih.</div>}

            <div className="gallery-form-submit-section" style={{ marginTop: 18 }}>
              <button type="submit" disabled={loading} className="btn-gallery-submit">
                {loading ? "Menyimpan..." : id ? "Simpan Perubahan" : "Tambah Gallery"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
