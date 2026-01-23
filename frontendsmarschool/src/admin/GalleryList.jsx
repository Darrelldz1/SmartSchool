import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import "./gallery.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const HEADER_HEIGHT = 72;

export default function GalleryList() {
  const { user, logout } = useAuth() || {};
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // logo fallbacks
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

  // nav handlers
  const goHome = (e) => { e?.preventDefault(); navigate('/'); window.scrollTo(0,0); };
  const goProfil = (e) => { e?.preventDefault(); navigate('/sekolah'); };
  const goGaleri = (e) => { e?.preventDefault(); navigate('/gallery'); };
  const goPengumuman = (e) => { e?.preventDefault(); navigate('/pengumuman'); };
  const goDaftar = (e) => { e?.preventDefault(); navigate('/daftar'); };
  const onLoginClick = () => navigate('/login');
  const onLogoutClick = () => { logout && logout(); navigate('/'); };

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
        {/* header + spacer */}
        <header
          ref={headerRef}
          className="header"
          style={{
            background: '#00124b',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            boxShadow: '0 6px 20px rgba(2,6,23,0.35)',
            transition: 'backdrop-filter 0.2s ease, background 0.2s ease',
            backdropFilter: 'saturate(1.05) blur(4px)'
          }}
        >
          <div className="header-content" style={{ alignItems: 'center' }}>
            <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              { !logoFailed ? (
                <img src={logoSrc} alt="Smart School" onError={handleLogoError} style={{ width: 80, height: 48, objectFit: 'contain', borderRadius: 8, cursor: 'pointer' }} onClick={goHome} />
              ) : (
                <div style={{ width: 80, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef2ff', borderRadius: 8, fontWeight: 800, color: '#4f46e5', cursor: 'pointer' }} onClick={goHome}>S</div>
              ) }
            </div>

            <nav className="nav-menu" style={{ color: 'white', marginLeft: 20 }}>
              <a href="#beranda" onClick={goHome} style={{ color: 'white', marginRight: 12, textDecoration: 'none' }}>Beranda</a>
              <a href="#profil" onClick={goProfil} style={{ color: 'white', marginRight: 12, textDecoration: 'none' }}>Profil</a>
              <a href="#galeri" onClick={goGaleri} style={{ color: 'white', marginRight: 12, textDecoration: 'none' }}>Galeri</a>
              <a href="#pengumuman" onClick={goPengumuman} style={{ color: 'white', marginRight: 12, textDecoration: 'none' }}>Pengumuman</a>
              <a href="#daftar" onClick={goDaftar} style={{ color: 'white', textDecoration: 'none' }}>Daftar</a>
            </nav>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
              {user ? (
                <>
                  <div style={{ color: '#2563eb', fontWeight: 700 }}>Halo, {user.name || user.email || user.role || 'Pengguna'}</div>
                  <button className="btn-masuk" onClick={onLogoutClick} style={{ background: 'linear-gradient(to right, #dc2626, #b91c1c)' }}>KELUAR</button>
                </>
              ) : (
                <button className="btn-masuk" onClick={onLoginClick}>MASUK</button>
              )}
            </div>
          </div>
        </header>

        <div style={{ height: headerHeight }} />

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
        {/* header */}
        <header
          ref={headerRef}
          className="header"
          style={{
            background: '#00124b',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            boxShadow: '0 6px 20px rgba(2,6,23,0.35)',
            transition: 'backdrop-filter 0.2s ease, background 0.2s ease',
            backdropFilter: 'saturate(1.05) blur(4px)'
          }}
        >
          <div className="header-content" style={{ alignItems: 'center' }}>
            <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              { !logoFailed ? (
                <img src={logoSrc} alt="Smart School" onError={handleLogoError} style={{ width: 80, height: 48, objectFit: 'contain', borderRadius: 8, cursor: 'pointer' }} onClick={goHome} />
              ) : (
                <div style={{ width: 80, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef2ff', borderRadius: 8, fontWeight: 800, color: '#4f46e5', cursor: 'pointer' }} onClick={goHome}>S</div>
              ) }
            </div>

            <nav className="nav-menu" style={{ color: 'white', marginLeft: 20 }}>
              <a href="#beranda" onClick={goHome} style={{ color: 'white', marginRight: 12, textDecoration: 'none' }}>Beranda</a>
              <a href="#profil" onClick={goProfil} style={{ color: 'white', marginRight: 12, textDecoration: 'none' }}>Profil</a>
              <a href="#galeri" onClick={goGaleri} style={{ color: 'white', marginRight: 12, textDecoration: 'none' }}>Galeri</a>
              <a href="#pengumuman" onClick={goPengumuman} style={{ color: 'white', marginRight: 12, textDecoration: 'none' }}>Pengumuman</a>
              <a href="#daftar" onClick={goDaftar} style={{ color: 'white', textDecoration: 'none' }}>Daftar</a>
            </nav>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
              {user ? (
                <>
                  <div style={{ color: '#2563eb', fontWeight: 700 }}>Halo, {user.name || user.email || user.role || 'Pengguna'}</div>
                  <button className="btn-masuk" onClick={onLogoutClick} style={{ background: 'linear-gradient(to right, #dc2626, #b91c1c)' }}>KELUAR</button>
                </>
              ) : (
                <button className="btn-masuk" onClick={onLoginClick}>MASUK</button>
              )}
            </div>
          </div>
        </header>

        <div style={{ height: headerHeight }} />

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
      {/* Header */}
      <header
        ref={headerRef}
        className="header"
        style={{
          background: '#00124b',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          boxShadow: '0 6px 20px rgba(2,6,23,0.35)',
          transition: 'backdrop-filter 0.2s ease, background 0.2s ease',
          backdropFilter: 'saturate(1.05) blur(4px)'
        }}
      >
        <div className="header-content" style={{ alignItems: 'center' }}>
          <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            { !logoFailed ? (
              <img src={logoSrc} alt="Smart School" onError={handleLogoError} style={{ width: 80, height: 48, objectFit: 'contain', borderRadius: 8, cursor: 'pointer' }} onClick={goHome} />
            ) : (
              <div style={{ width: 80, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef2ff', borderRadius: 8, fontWeight: 800, color: '#4f46e5', cursor: 'pointer' }} onClick={goHome}>S</div>
            ) }
          </div>

          <nav className="nav-menu" style={{ color: 'white', marginLeft: 20 }}>
            <a href="#beranda" onClick={goHome} style={{ color: 'white', marginRight: 12, textDecoration: 'none' }}>Beranda</a>
            <a href="#profil" onClick={goProfil} style={{ color: 'white', marginRight: 12, textDecoration: 'none' }}>Profil</a>
            <a href="#galeri" onClick={goGaleri} style={{ color: 'white', marginRight: 12, textDecoration: 'none' }}>Galeri</a>
            <a href="#pengumuman" onClick={goPengumuman} style={{ color: 'white', marginRight: 12, textDecoration: 'none' }}>Pengumuman</a>
            <a href="#daftar" onClick={goDaftar} style={{ color: 'white', textDecoration: 'none' }}>Daftar</a>
          </nav>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {user ? (
              <>
                <div style={{ color: '#2563eb', fontWeight: 700 }}>Halo, {user.name || user.email || user.role || 'Pengguna'}</div>
                <button className="btn-masuk" onClick={onLogoutClick} style={{ background: 'linear-gradient(to right, #dc2626, #b91c1c)' }}>KELUAR</button>
              </>
            ) : (
              <button className="btn-masuk" onClick={onLoginClick}>MASUK</button>
            )}
          </div>
        </div>
      </header>

      {/* spacer */}
      <div style={{ height: headerHeight }} />

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

      {/* FOOTER */}
      <footer className="footer" style={{ background: '#00124b', position: 'relative', marginTop: 40 }}>
        <div className="footer-content">
          <div className="footer-column">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
              { !logoFailed ? (
                <img src={logoSrc} alt="Smart School" onError={handleLogoError} style={{ width: 96, height: 56, objectFit: 'contain', borderRadius: 8 }} />
              ) : (
                <div style={{ width: 96, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef2ff', borderRadius: 8, fontWeight: 800, color: '#4f46e5' }}>S</div>
              ) }
            </div>
            <p style={{ color: '#78808eff', lineHeight: 1.6 }}>
              Membentuk generasi unggul yang berakhlak mulia dan berdaya saing tinggi untuk masa depan Indonesia.
            </p>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Hubungi Kami</h3>
            <div className="contact-list">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4, color: '#fff' }}>Alamat</div>
                  <p className="contact-text" style={{ color: '#fff' }}>Jl. Pendidikan No. 123, Jakarta</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4, color: '#fff' }}>Telepon</div>
                  <p className="contact-text" style={{ color: '#fff' }}>+62 231 236648</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4, color: '#fff' }}>Email</div>
                  <p className="contact-text" style={{ color: '#fff' }}>info@smartschool.id</p>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Media Sosial</h3>
            <div className="social-list">
              <div className="social-item" style={{ cursor: 'pointer' }}>
                <span className="social-icon">📷</span>
                <p className="social-text">Instagram: @smartschool</p>
              </div>
              <div className="social-item" style={{ cursor: 'pointer' }}>
                <span className="social-icon">📘</span>
                <p className="social-text">Facebook: Smart School</p>
              </div>
              <div className="social-item" style={{ cursor: 'pointer' }}>
                <span className="social-icon">▶️</span>
                <p className="social-text">Youtube: Smart School</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p style={{ color: '#fff' }}>© 2024 Smart School. All Rights Reserved. Powered by Citrasolusi.id</p>
        </div>
      </footer>
    </div>
  );
}
