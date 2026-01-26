import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import Header from './Header';
import Footer from './Footer';
import './news.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const HEADER_HEIGHT = '60px';

export default function NewsListPublic() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [headerHeight] = useState(HEADER_HEIGHT);

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

  const getDescription = (n) => {
    return n?.description || n?.content || n?.deskripsi || '';
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/news`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setNews(Array.isArray(data) ? data : []);
        setErr(null);
      } catch (e) {
        console.error('fetch news error', e);
        if (mounted) setErr('Gagal mengambil berita');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const readMore = (id) => {
    navigate(`/news/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="news-page" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      <div style={{ height: headerHeight }} />

      <div className="news-hero" style={{ paddingTop: 12, maxWidth: 1100, margin: '0 auto 1.5rem' }}>
        <h1>Berita Sekolah</h1>
        <p className="subtitle">Kabar & kegiatan terkini di Smart School</p>
      </div>

      <div className="container" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1rem 3rem' }}>
        {loading && <div className="info loading">Memuat berita...</div>}
        {err && <div className="error">{err}</div>}

        <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
          {news.map((n) => (
            <article key={n.id} className="news-card" style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 6px 18px rgba(2,6,23,0.06)' }}>
              <div className="news-thumb" style={{ width: '100%', height: 180, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {imageUrlFor(n) ? (
                  <img src={imageUrlFor(n)} alt={n.title || 'Berita'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div className="no-image" style={{ padding: 12, color: '#6b7280' }}>📰 BERITA</div>
                )}
              </div>

              <div className="news-body" style={{ padding: 16 }}>
                <h3 className="news-title" style={{ margin: '0 0 8px' }}>{n.title || n.judul || 'Untitled'}</h3>
                <div className="meta" style={{ color: '#6b7280', fontSize: 13, marginBottom: 8 }}>{formatDate(n.created_at)}</div>
                <p className="excerpt" style={{ color: '#374151', marginBottom: 12 }}>
                  {getDescription(n).slice(0, 160)}
                  {getDescription(n).length > 160 ? '...' : ''}
                </p>
                <div className="actions">
                  <button
                    className="btn-primary"
                    onClick={() => readMore(n.id)}
                    style={{ background: '#2563eb', color: '#fff', padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer' }}
                    aria-label={`Baca selengkapnya: ${n.title || n.judul || 'berita'}`}
                  >
                    BACA SELENGKAPNYA
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {news.length === 0 && !loading && (
          <div className="info" style={{ marginTop: 20 }}>Belum ada berita yang dipublikasikan.</div>
        )}
      </div>

      <Footer />
    </div>
  );
}
