// src/components/GalleryListPublic.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import './gallerylistpublic.css'; // buat styling ringan sesuai kebutuhan

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function GalleryListPublic() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${API_BASE}/api/gallery`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        const mapped = data.map((g) => ({
          id: g.id,
          image: g.image_url || 
       (typeof g.image_path === "string" 
         ? `${API_BASE}${g.image_path.startsWith('/') ? g.image_path : '/' + g.image_path}` 
         : null),

          created_at: g.created_at,
        }));
        setGallery(mapped);
      })
      .catch((err) => {
        console.error('fetch gallery err', err);
        if (mounted) setError('Gagal memuat galeri');
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  // jika kamu ingin proteksi: jika belum login redirect ke /login
  useEffect(() => {
    if (!user) {
      // kalau mau proteksi akses, aktifkan baris berikut:
      // navigate('/login', { state: { from: '/gallery' } });
    }
  }, [user, navigate]);

  return (
    <div className="gallery-page p-6">
      <div className="header">
        <h1 className="text-2xl font-bold mb-4">Gallery Sekolah</h1>
        <button onClick={() => navigate(-1)} className="btn-back">Kembali</button>
      </div>

      {loading ? (
        <p>Memuat galeri...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <div className="gallery-grid">
            {gallery.map((g) => (
              <div key={g.id} className="gallery-card" onClick={() => setPreview(g)}>
                {g.image ? (
                  <img src={g.image} alt={`gallery-${g.id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="placeholder">📸</div>
                )}
              </div>
            ))}
          </div>

          {preview && (
            <div className="modal-overlay" onClick={() => setPreview(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={preview.image} alt="preview" style={{ maxWidth: '90vw', maxHeight: '80vh' }} />
                <div className="modal-meta">
                  <p>ID: {preview.id}</p>
                  <p>{preview.created_at}</p>
                </div>
                <button className="btn-close" onClick={() => setPreview(null)}>Tutup</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
