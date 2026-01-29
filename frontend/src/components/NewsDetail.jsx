import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import Header from './Header';
import Footer from './Footer';
import './news.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const HEADER_HEIGHT = '60px';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [headerHeight] = useState(HEADER_HEIGHT);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);

    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/news/${id}`);
        if (res.status === 404) {
          if (!mounted) return;
          setNews(null);
          setErr(null);
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) {
          setNews(data || null);
        }
      } catch (e) {
        console.error('fetch news detail error', e);
        if (mounted) setErr('Gagal memuat berita');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [id]);

  const BackButton = ({ onClick }) => {
    const style = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      borderRadius: 12,
      border: '1px solid rgba(99,102,241,0.12)',
      background: 'linear-gradient(180deg, #f5f7ff 0%, #eef2ff 100%)',
      boxShadow: '0 6px 18px rgba(79,70,229,0.06)',
      color: '#111827',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: 14,
      lineHeight: 1,
    };

    const arrowStyle = {
      fontSize: 16,
      transform: 'translateY(-1px)'
    };

    return (
      <button aria-label="Kembali" onClick={onClick} style={style}>
        <span style={arrowStyle}>←</span>
        <span>Kembali</span>
      </button>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ height: headerHeight }} />
        <div className="news-page">
          <div className="info" style={{ padding: 40 }}>
            <div className="news-loading-spinner" style={{ marginBottom: 12 }}></div>
            Memuat berita...
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (err) {
    return (
      <>
        <Header />
        <div style={{ height: headerHeight }} />
        <div className="news-page">
          <div className="error" style={{ padding: 40 }}>
            ⚠️ {err}
          </div>
          <div style={{ padding: 20 }}>
            <BackButton onClick={() => navigate(-1)} />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!news) {
    return (
      <>
        <Header />
        <div style={{ height: headerHeight }} />
        <div className="news-page">
          <div className="info" style={{ padding: 40 }}>
            Berita tidak ditemukan.
          </div>
          <div style={{ padding: 20 }}>
            <BackButton onClick={() => navigate(-1)} />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const imageUrl = news.image_url || news.image || news.photo_url || null;

  return (
    <>
      <Header />
      <div style={{ height: headerHeight }} />

      <div className="news-page" style={{ padding: '2rem' }}>
        <div className="news-hero small" style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0 }}>{news.title}</h1>
          <div className="meta" style={{ color: '#6b7280', marginTop: 8 }}>
            {news.created_at
              ? new Date(news.created_at).toLocaleString('id-ID', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })
              : 'Tanggal tidak tersedia'}
          </div>
        </div>

        <div className="container" style={{ maxWidth: 900 }}>
          <div className="news-detail-card" style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 8px 30px rgba(2,6,23,0.06)' }}>
            {imageUrl && (
              <img
                className="detail-image"
                src={imageUrl}
                alt={news.title}
                style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 8 }}
              />
            )}

            <div className="news-content" style={{ marginTop: 12 }} dangerouslySetInnerHTML={{ __html: news.description || '<p>Tidak ada konten</p>' }} />
          </div>

          <div style={{ marginTop: 20 }}>
            <BackButton onClick={() => navigate(-1)} />

            {user && (user.role === 'admin' || user.role === 'editor' || user.role === 'guru') && (
              <button
                className="btn-primary"
                style={{ marginLeft: 12 }}
                onClick={() => navigate(`/admin/news/${news.id}/edit`)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
