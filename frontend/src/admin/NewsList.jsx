// src/admin/NewsList.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthProvider';
import './newslist.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const HEADER_HEIGHT = 72;

export default function NewsList() {
  const { user, logout } = useAuth() || {};
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // header / logo
  const logoCandidates = [
    '/logo-smartschool.png',
    '/logo smartschool.png',
    '/logo%20smartschool.png',
    '/logo smartschool asli.png',
    '/logo%20smartschool%20asli.png',
    '/logo-smartschool-asli.png',
  ];
  const [logoIndex, setLogoIndex] = useState(0);
  const [logoSrc, setLogoSrc] = useState(logoCandidates[0]);
  const [logoFailed, setLogoFailed] = useState(false);
  useEffect(() => { setLogoSrc(logoCandidates[logoIndex] || ''); }, [logoIndex]);
  const handleLogoError = () => {
    const next = logoIndex + 1;
    if (next < logoCandidates.length) setLogoIndex(next);
    else setLogoFailed(true);
  };

  // header measurement
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(HEADER_HEIGHT);
  useEffect(() => {
    const measure = () => { if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight || HEADER_HEIGHT); };
    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 250);
    return () => { window.removeEventListener('resize', measure); clearTimeout(t); };
  }, []);

  const goHome = (e) => { e?.preventDefault(); navigate('/'); window.scrollTo(0,0); };
  const goProfil = (e) => { e?.preventDefault(); navigate('/sekolah'); };
  const goGaleri = (e) => { e?.preventDefault(); navigate('/gallery'); };
  const goPengumuman = (e) => { e?.preventDefault(); navigate('/pengumuman'); };
  const onLoginClick = () => navigate('/login');
  const onLogoutClick = () => { logout && logout(); navigate('/'); };

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await axios.get(`${API_BASE}/api/news`);
      setNews(res.data || []);
    } catch (error) {
      console.error(error);
      setErr('Gagal mengambil daftar berita');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus berita ini?')) return;
    try {
      await axios.delete(`${API_BASE}/api/news/${id}`);
      load();
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus berita (cek console)');
    }
  };

  return (
    <div className="news-list-container" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* fixed top strip */}
      <div aria-hidden style={{ position: 'fixed', top: 0, left: 0, right: 0, height: headerHeight, background: '#001a4d', zIndex: 1080 }} />

      {/* header */}
      <header
        ref={headerRef}
        className="header"
        style={{ background: '#001a4d', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', height: 60 }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 2rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            { !logoFailed ? (
              <img src={logoSrc} alt="Smart School" onError={handleLogoError} style={{ height: 40, width: 'auto', objectFit: 'contain', cursor: 'pointer' }} onClick={goHome} />
            ) : (
              <div style={{ height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 4, fontWeight: 800, color: '#001a4d' }} onClick={goHome}>S</div>
            ) }
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, justifyContent: 'center' }}>
            <a href="#beranda" onClick={(e) => { e.preventDefault(); goHome(e); }} style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }} onMouseEnter={(e) => e.currentTarget.style.color = '#60a5fa'} onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>Beranda</a>
            <a href="#profil" onClick={(e) => { e.preventDefault(); goProfil(e); }} style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }} onMouseEnter={(e) => e.currentTarget.style.color = '#60a5fa'} onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>Profil</a>
            <a href="#galeri" onClick={(e) => { e.preventDefault(); goGaleri(e); }} style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }} onMouseEnter={(e) => e.currentTarget.style.color = '#60a5fa'} onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>Galeri</a>
            <a href="#pengumuman" onClick={(e) => { e.preventDefault(); goPengumuman(e); }} style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }} onMouseEnter={(e) => e.currentTarget.style.color = '#60a5fa'} onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>Pengumuman</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user ? (
              <>
                <div style={{ color: '#fff', fontWeight: 600 }}>Halo, {user.name || user.email || 'Pengguna'}</div>
                <button onClick={onLogoutClick} style={{ background: '#dc2626', color: '#fff', padding: '0.45rem 1rem', borderRadius: 6, border: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'} onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}>KELUAR</button>
              </>
            ) : (
              <button onClick={onLoginClick} style={{ background: '#3b82f6', color: '#fff', padding: '0.45rem 1rem', borderRadius: 6, border: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'} onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}>MASUK</button>
            )}
          </div>
        </div>
      </header>

      {/* spacer */}
      <div style={{ height: headerHeight }} />

      <div className="news-list-wrapper" style={{ maxWidth: 1100, margin: '1.5rem auto', padding: '0 1rem' }}>
        {/* Header */}
        <div className="news-list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1>Daftar Berita</h1>
          <Link to="/admin/createnews" className="btn-add-news" style={{ background: '#10b981', color: '#fff', padding: '0.5rem 1rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Tambah Berita</Link>
        </div>

        {/* Loading / Error / Table */}
        {loading ? (
          <div className="loading-state" style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="loading-spinner"></div>
            <p>Memuat data berita...</p>
          </div>
        ) : err ? (
          <div className="error-state" style={{ padding: '2rem', textAlign: 'center' }}>
            <p>⚠️ {err}</p>
          </div>
        ) : news.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="empty-state-icon">📰</div>
            <div className="empty-state-text">Belum ada berita</div>
            <div className="empty-state-subtext">Klik tombol "Tambah Berita" untuk membuat berita baru</div>
          </div>
        ) : (
          <div className="news-table-wrapper" style={{ overflowX: 'auto', background: '#fff', borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.06)', padding: 12 }}>
            <table className="news-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 8 }}>ID</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Judul</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Tanggal</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Gambar</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Deskripsi</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item.id} style={{ borderTop: '1px solid #eef2f7' }}>
                    <td style={{ padding: 8, verticalAlign: 'top' }}>{item.id}</td>
                    <td style={{ padding: 8, verticalAlign: 'top' }}>
                      <div className="news-title">{item.title || item.judul}</div>
                    </td>
                    <td style={{ padding: 8, verticalAlign: 'top' }}>
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : (item.tanggal || '-')}
                    </td>
                    <td style={{ padding: 8, verticalAlign: 'top' }}>
                      {item.image_url ? <img src={item.image_url} alt={item.title} className="news-image-preview" style={{ width: 120, height: 72, objectFit: 'cover', borderRadius: 6 }} /> : <div className="news-image-placeholder">No Image</div>}
                    </td>
                    <td style={{ padding: 8, verticalAlign: 'top', maxWidth: 420 }}>
                      <div className="news-description-text">{(item.description || item.content || item.deskripsi || '').slice(0, 120)}{(item.description || item.content || item.deskripsi || '').length > 120 && '...'}</div>
                    </td>
                    <td style={{ padding: 8, verticalAlign: 'top' }}>
                      <div className="news-actions" style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                        <Link to={`/admin/editnews/${item.id}`} className="btn-edit" style={{ padding: '6px 10px', background: '#f59e0b', color: '#fff', borderRadius: 6, textDecoration: 'none', textAlign: 'center' }}>Edit</Link>
                        <button onClick={() => handleDelete(item.id)} className="btn-delete" style={{ padding: '6px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* footer */}
      <footer style={{ background: '#00124b', color: '#fff', marginTop: 48, padding: '2rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {!logoFailed ? <img src={logoSrc} alt="SmartSchool" onError={handleLogoError} style={{ width: 96, height: 56, objectFit: 'contain', borderRadius: 8 }} /> : <div style={{ width: 96, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef2ff', borderRadius: 8, fontWeight: 800, color: '#4f46e5' }}>S</div>}
            <div>© 2024 Smart School. All Rights Reserved.</div>
          </div>
          <div style={{ color: '#9ca3af' }}>
            <div>Hubungi: +62 231 236648</div>
            <div>Email: info@smartschool.id</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
