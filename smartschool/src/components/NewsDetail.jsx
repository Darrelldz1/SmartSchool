// src/components/NewsDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import './news.css';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!user) {
      // jika belum login redirect ke login dan simpan tujuan
      navigate('/login', { state: { from: `/news/${id}` } });
      return;
    }

    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`http://localhost:5000/api/news/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setNews(data);
      } catch (e) {
        console.error('fetch news detail error', e);
        setErr('Gagal memuat berita');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id, navigate, user]);

  if (loading) return <div className="news-page"><div className="info">Memuat...</div></div>;
  if (err) return <div className="news-page"><div className="error">{err}</div></div>;
  if (!news) return <div className="news-page"><div className="info">Berita tidak ditemukan.</div></div>;

  return (
    <div className="news-page">
      <div className="news-hero small">
        <h1>{news.title}</h1>
        <div className="meta">{new Date(news.created_at).toLocaleString()}</div>
      </div>

      <div className="container">
        <div className="news-detail-card">
          {news.image_url && <img className="detail-image" src={news.image_url} alt={news.title} />}
          <div className="news-content" dangerouslySetInnerHTML={{ __html: news.description }} />
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="btn-outline" onClick={() => navigate(-1)}>Kembali</button>
        </div>
      </div>
    </div>
  );
}
