// src/components/GalleryListPublic.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import './gallerylistpublic.css';

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
  };

  const handlePreview = (g) => {
    setPreview(g);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closePreview = () => {
    setPreview(null);
    // Re-enable body scroll
    document.body.style.overflow = 'auto';
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && preview) {
        closePreview();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [preview]);

  return (
    <div className="gallery-page">
      <div className="header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Kembali
        </button>
        <h1>Gallery Sekolah</h1>
      </div>

      {loading ? (
        <p>Memuat galeri...</p>
      ) : error ? (
        <p style={{ color: '#dc2626' }}>{error}</p>
      ) : gallery.length === 0 ? (
        <p>Belum ada foto di galeri.</p>
      ) : (
        <>
          <div className="gallery-grid">
            {gallery.map((g) => (
              <div 
                key={g.id} 
                className="gallery-card" 
                onClick={() => handlePreview(g)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handlePreview(g);
                }}
              >
                {g.image ? (
                  <img 
                    src={g.image} 
                    alt={`Gallery ${g.id}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="placeholder">📸</div>
                )}
              </div>
            ))}
          </div>

          {preview && (
            <div 
              className="modal-overlay" 
              onClick={closePreview}
              role="dialog"
              aria-modal="true"
            >
              <div 
                className="modal-content" 
                onClick={(e) => e.stopPropagation()}
              >
                {preview.image && (
                  <img 
                    src={preview.image} 
                    alt={`Preview ${preview.id}`}
                  />
                )}
                <div className="modal-meta">
                  <p><strong>ID:</strong> {preview.id}</p>
                  {preview.created_at && (
                    <p><strong>Diunggah:</strong> {formatDate(preview.created_at)}</p>
                  )}
                </div>
                <button className="btn-close" onClick={closePreview}>
                  Tutup
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}