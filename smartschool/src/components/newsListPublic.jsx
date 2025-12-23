// src/components/NewsListPublic.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import './news.css';

export default function NewsListPublic() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
     async function load() {
      try {
        const res = await fetch('http://localhost:5000/api/news');
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
      // arahkan ke login dan simpan tujuan
      navigate('/login', { state: { from: `/news/${id}` } });
      return;
    }
    navigate(`/news/${id}`);
  };

  return (
    <div className="news-page">
      <div className="news-hero">
        <h1>Berita Sekolah</h1>
        <p className="subtitle">Kabar & kegiatan terkini di Smart School</p>
      </div>

      <div className="container">
        {loading && <div className="info">Memuat berita...</div>}
        {err && <div className="error">{err}</div>}

        <div className="news-grid">
          {news.map((n) => (
            <article key={n.id} className="news-card">
              <div className="news-thumb">
                {n.image_url ? (
                  <img src={n.image_url} alt={n.title} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>

              <div className="news-body">
                <h3 className="news-title">{n.title}</h3>
                <div className="meta">{new Date(n.created_at).toLocaleString()}</div>
                <p className="excerpt">{(n.description || '').slice(0, 180)}{(n.description && n.description.length > 180) ? '...' : ''}</p>
                <div className="actions">
                  <button className="btn-primary" onClick={() => readMore(n.id)}>BACA SELENGKAPNYA</button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {news.length === 0 && !loading && <div className="info">Belum ada berita.</div>}
      </div>
    </div>
  );
}
