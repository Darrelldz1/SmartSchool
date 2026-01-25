import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import Header from './Header';  // Import Header
import Footer from './Footer';  // Import Footer
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
        const mapped = (data || []).map((g) => ({
          id: g.id,
          image: g.image_url ||
            (typeof g.image_path === "string"
              ? `${API_BASE}${g.image_path.startsWith('/') ? g.image_path : '/' + g.image_path}`
              : null),
          title: g.title || g.caption || `Gallery ${g.id}`,
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
    document.body.style.overflow = 'hidden';
  };

  const closePreview = () => {
    setPreview(null);
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
      <Header />
      <div style={{ height: '60px' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => navigate(-1)} className="btn-back" style={{ padding: '6px 12px' }}>
            ← Kembali
          </button>
          <h1 style={{ margin: 0 }}>Gallery Sekolah</h1>
        </div>

        {loading ? (
          <p>Memuat galeri...</p>
        ) : error ? (
          <p style={{ color: '#dc2626' }}>{error}</p>
        ) : gallery.length === 0 ? (
          <p>Belum ada foto di galeri.</p>
        ) : (
          <>
            <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
              {gallery.map((g) => (
                <div
                  key={g.id}
                  className="gallery-card"
                  onClick={() => handlePreview(g)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => { if (e.key === 'Enter') handlePreview(g); }}
                  style={{ cursor: 'pointer', borderRadius: 8, overflow: 'hidden', background: '#f8fafc', minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {g.image ? (
                    <img src={g.image} alt={`Gallery ${g.id}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ padding: 20, fontSize: 28 }}>📸</div>
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
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}
              >
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                  style={{ background: '#fff', borderRadius: 12, maxWidth: 900, width: '100%', maxHeight: '90vh', overflow: 'auto', padding: 16 }}
                >
                  {preview.image && (
                    <img src={preview.image} alt={`Preview ${preview.id}`} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 8 }} />
                  )}
                  <div className="modal-meta" style={{ marginTop: 12 }}>
                    <p><strong>{preview.title}</strong></p>
                    {preview.created_at && <p><strong>Diunggah:</strong> {formatDate(preview.created_at)}</p>}
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button className="btn-close" onClick={closePreview} style={{ padding: '8px 12px' }}>Tutup</button>
                    <button className="btn-outline" onClick={() => { closePreview(); navigate('/gallery'); }} style={{ padding: '8px 12px' }}>Lihat Semua Galeri</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}