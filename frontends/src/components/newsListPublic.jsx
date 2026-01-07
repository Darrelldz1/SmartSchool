//  src/components/NewsListPublic.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import './news.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function NewsListPublic() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Helper function to build image URL
  const imageUrlFor = (item) => {
    if (!item) return null;
    if (item.image_url) return item.image_url;
    if (item.image_path && item.image_path.startsWith('http')) return item.image_path;
    if (item.image_path) {
      const path = item.image_path.startsWith('/') ? item.image_path : `/${item.image_path}`;
      return `${API_BASE}${path}`;
    }
    return null;
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/news`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setNews(data);
      } catch (e) {
        console.error('fetch news error', e);
        setErr('Gagal mengambil berita');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const readMore = (id) => {
    if (!user) {
      navigate('/login', { state: { from: `/news/${id}` } });
      return;
    }
    navigate(`/news/${id}`);
  };

  const formatDate = (dateString) => {
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

  return (
    <div className="news-page">
      <div className="news-hero">
        <h1>Berita Sekolah</h1>
        <p className="subtitle">Kabar & kegiatan terkini di Smart School</p>
      </div>

      <div className="container">
        {loading && <div className="info loading">Memuat berita...</div>}
        {err && <div className="error">{err}</div>}

        <div className="news-grid">
          {news.map((n) => (
            <article key={n.id} className="news-card">
              <div className="news-thumb">
                {imageUrlFor(n) ? (
                  <img src={imageUrlFor(n)} alt={n.title || 'Berita'} />
                ) : (
                  <div className="no-image">📰 BERITA</div>
                )}
              </div>

              <div className="news-body">
                <h3 className="news-title">{n.title || n.judul || 'Untitled'}</h3>
                <div className="meta">{formatDate(n.created_at)}</div>
                <p className="excerpt">
                  {(n.description || '').slice(0, 160)}
                  {(n.description && n.description.length > 160) ? '...' : ''}
                </p>
                <div className="actions">
                  <button className="btn-primary" onClick={() => readMore(n.id)}>
                    BACA SELENGKAPNYA
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {news.length === 0 && !loading && (
          <div className="info">Belum ada berita yang dipublikasikan.</div>
        )}
      </div>
    </div>
  );
}