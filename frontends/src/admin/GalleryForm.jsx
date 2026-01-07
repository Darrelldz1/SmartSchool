// src/admin/GalleryForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import "./gallery.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function GalleryForm() {
  const { id } = useParams(); // jika ada => edit mode
  const navigate = useNavigate();
  const { user } = useAuth() || {};

  const [file, setFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const buildImage = (row) => {
    if (!row) return null;
    if (row.image_url) return row.image_url;
    if (!row.image_path) return null;
    if (row.image_path.startsWith("http")) return row.image_path;
    const p = row.image_path.startsWith("/") ? row.image_path : `/${row.image_path}`;
    return `${API_BASE}${p}`;
  };

  useEffect(() => {
    if (!id) return;
    // load existing gallery item
    setLoading(true);
    axios
      .get(`${API_BASE}/api/gallery/${id}`)
      .then((res) => {
        const r = res.data;
        setExistingImage(buildImage(r));
      })
      .catch((e) => {
        console.error("load gallery item err", e);
        alert("Gagal memuat item");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Create preview URL
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // check permission
    if (!user || !(user.role === "admin" || user.role === "guru")) {
      alert("Tidak punya izin");
      return;
    }

    // For create: only admin allowed on backend. We still allow form UI but backend will enforce.
    setLoading(true);
    try {
      const fd = new FormData();
      if (file) fd.append("image", file);

      if (id) {
        // edit
        await axios.put(`${API_BASE}/api/gallery/${id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Gallery diperbarui");
      } else {
        // create
        await axios.post(`${API_BASE}/api/gallery`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Gallery ditambahkan");
      }
      navigate("/admin/gallery");
    } catch (err) {
      console.error("submit gallery err", err);
      const msg = err?.response?.data?.error || err.message || "Gagal menyimpan";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gallery-form-container">
      <div className="gallery-form-wrapper">
        {/* Header */}
        <div className="gallery-form-header">
          <h1>{id ? "Edit Gallery" : "Tambah Gallery"}</h1>
          <button onClick={() => navigate(-1)} className="btn-gallery-back">
            ← Kembali
          </button>
        </div>

        {/* Loading Overlay */}
        {loading && !file && !existingImage ? (
          <div className="gallery-form-loading-overlay">
            <div className="gallery-loading-spinner"></div>
            <p>Memuat data...</p>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="gallery-form-content">
            {/* File Input */}
            <div className="gallery-form-group">
              <label className="gallery-form-label">Pilih Gambar</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="gallery-file-input"
              />
              <p style={{ fontSize: '12px', color: '#718096', marginTop: '8px' }}>
                Format: JPG, PNG, GIF. Maksimal 5MB
              </p>
            </div>

            {/* Existing Image Preview */}
            {existingImage && !previewUrl && (
              <div className="gallery-image-preview-section">
                <div className="gallery-image-preview-title">Gambar Saat Ini</div>
                <div className="gallery-image-preview-container">
                  <img src={existingImage} alt="existing" />
                </div>
              </div>
            )}

            {/* New File Preview */}
            {previewUrl && (
              <div className="gallery-image-preview-section">
                <div className="gallery-image-preview-title">Preview Upload Baru</div>
                <div className="gallery-image-preview-container">
                  <img src={previewUrl} alt="preview" />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="gallery-form-submit-section">
              <button
                type="submit"
                disabled={loading}
                className="btn-gallery-submit"
              >
                {loading
                  ? "Menyimpan..."
                  : id
                  ? "Simpan Perubahan"
                  : "Tambah Gallery"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}