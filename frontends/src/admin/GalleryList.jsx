// src/admin/GalleryList.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import "./gallery.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function GalleryList() {
  const { user } = useAuth() || {};
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const buildImage = (row) => {
    if (!row) return null;
    if (row.image_url) return row.image_url;
    if (!row.image_path) return null;
    if (row.image_path.startsWith("http")) return row.image_path;
    const p = row.image_path.startsWith("/") ? row.image_path : `/${row.image_path}`;
    return `${API_BASE}${p}`;
  };

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await axios.get(`${API_BASE}/api/gallery`);
      const data = res.data || [];
      const mapped = data.map((r) => ({ ...r, image: buildImage(r) }));
      setItems(mapped);
    } catch (e) {
      console.error("fetch gallery err", e);
      setErr("Gagal memuat galeri");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus item gallery ini?")) return;
    try {
      await axios.delete(`${API_BASE}/api/gallery/${id}`);
      alert("Terhapus");
      load();
    } catch (e) {
      console.error("delete gallery err", e);
      alert("Gagal menghapus (cek console)");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="gallery-list-container">
        <div className="gallery-list-wrapper">
          <div className="gallery-loading-state">
            <div className="gallery-loading-spinner"></div>
            <p>Memuat galeri...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (err) {
    return (
      <div className="gallery-list-container">
        <div className="gallery-list-wrapper">
          <div className="gallery-error-state">
            <p>{err}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-list-container">
      <div className="gallery-list-wrapper">
        {/* Header */}
        <div className="gallery-list-header">
          <h1>Gallery</h1>
          {user?.role === "admin" ? (
            <Link to="/admin/gallery/create" className="btn-add-gallery">
              Tambah Foto
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="gallery-empty-state">
            <div className="gallery-empty-icon">🖼️</div>
            <div className="gallery-empty-text">Belum ada foto di galeri</div>
            <div className="gallery-empty-subtext">
              Klik tombol "Tambah Foto" untuk menambahkan foto pertama
            </div>
          </div>
        ) : (
          /* Gallery Grid */
          <div className="gallery-admin-grid">
            {items.map((it) => (
              <div key={it.id} className="gallery-card">
                {/* Image Container */}
                <div className="gallery-image-container">
                  {it.image ? (
                    <img src={it.image} alt={`gallery-${it.id}`} />
                  ) : (
                    <div className="gallery-no-image">No Image</div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="gallery-card-footer">
                  <div className="gallery-card-id">ID: {it.id}</div>
                  <div className="gallery-card-actions">
                    {/* Edit allowed for admin+guru */}
                    {(user?.role === "admin" || user?.role === "guru") && (
                      <Link
                        to={`/admin/gallery/edit/${it.id}`}
                        className="btn-gallery-edit"
                      >
                        Edit
                      </Link>
                    )}
                    {/* Delete only for admin */}
                    {user?.role === "admin" && (
                      <button
                        onClick={() => handleDelete(it.id)}
                        className="btn-gallery-delete"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}