// src/admin/EditNews.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './editnews.css';

export default function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/news/${id}`)
      .then(res => {
        setForm(res.data);
        if (res.data.image) {
          setImagePreview(`http://localhost:5000/uploads/${res.data.image}`);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Gagal memuat data berita");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title || !form.description) {
      setError("Judul dan deskripsi wajib diisi!");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      if (image) fd.append("image", image);

      await axios.put(`http://localhost:5000/api/news/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Berita berhasil diupdate!");
      navigate("/admin/newslist");
    } catch (err) {
      console.error(err);
      setError("Gagal update berita. Silakan coba lagi.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-news-container">
        <div className="edit-news-wrapper">
          <div className="news-loading-overlay">
            <div className="news-loading-spinner"></div>
            <p className="news-loading-text">Memuat data berita...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-news-container">
      <div className="edit-news-wrapper">
        <div className="edit-news-header">
          <h1>Edit Berita</h1>
          <button 
            type="button"
            className="btn-news-back"
            onClick={() => navigate("/admin/newslist")}
          >
            ← Kembali
          </button>
        </div>

        {error && (
          <div className="news-form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-news-form">
          <div className="news-form-group">
            <label className="news-form-label required">Judul Berita</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Masukkan judul berita..."
              className="news-text-input"
              required
            />
          </div>

          <div className="news-form-group">
            <label className="news-form-label required">Deskripsi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Masukkan deskripsi berita..."
              className="news-textarea"
              required
            />
            <div className="news-help-text">
              Minimum 50 karakter, maksimum 1000 karakter
            </div>
          </div>

          <div className="news-form-group">
            <label className="news-form-label">Gambar Berita</label>
            <div className="news-file-input-custom">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
              />
              <div className="news-file-icon">📷</div>
              <div className="news-file-text">
                <div className="news-file-label">
                  {image ? image.name : "Pilih gambar baru (opsional)"}
                </div>
                <div className="news-file-hint">
                  Format: JPG, PNG, GIF. Maksimal 5MB
                </div>
              </div>
            </div>
            
            {imagePreview && (
              <div className="news-image-preview">
                <div className="news-image-preview-label">Preview:</div>
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="news-form-actions">
            <button 
              type="submit" 
              className="btn-news-submit"
              disabled={submitting}
            >
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <button
              type="button"
              className="btn-news-cancel"
              onClick={() => navigate("/admin/newslist")}
              disabled={submitting}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}