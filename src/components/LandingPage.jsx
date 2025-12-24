// src/components/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import './landingpage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [newsList, setNewsList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [profile, setProfile] = useState(null);

  // history (Tentang Sekolah)
  const [history, setHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [errorHistory, setErrorHistory] = useState(null);

  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errorNews, setErrorNews] = useState(null);
  const [errorGallery, setErrorGallery] = useState(null);
  const [errorProfile, setErrorProfile] = useState(null);

  useEffect(() => {
    if (user) setUsername(user.name || user.email || user.role || 'Pengguna');
    else setUsername('');
  }, [user]);

  // helper: build image url from returned item (supports image_url or image_path)
  const imageUrlFor = (item) => {
    if (!item) return null;
    if (item.image_url) return item.image_url;
    if (item.image) return item.image; // already mapped in gallery/news
    if (item.image_path && item.image_path.startsWith('http')) return item.image_path;
    if (item.image_path) {
      const path = item.image_path.startsWith('/') ? item.image_path : `/${item.image_path}`;
      return `${API_BASE}${path}`;
    }
    return null;
  };

  // small helper to create excerpt safely
  const excerpt = (text = '', n = 140) => {
    if (!text) return '';
    const clean = String(text);
    return clean.length > n ? clean.slice(0, n).trim() + '...' : clean;
  };

  // ---------- fetch profile (visi/misi/core values) ----------
  useEffect(() => {
    let mounted = true;
    setLoadingProfile(true);
    setErrorProfile(null);
    fetch(`${API_BASE}/api/profile`)
      .then((res) => {
        if (res.status === 404) {
          // no profile yet
          return null;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (!data) {
          setProfile(null);
          return;
        }
        // backend returns vision_image_url, mission_image_url, core_values_image_url
        setProfile({
          id: data.id,
          vision: data.vision,
          mission: data.mission,
          core_values: data.core_values,
          vision_image: data.vision_image_url || (data.vision_image_path ? imageUrlFor({ image_path: data.vision_image_path }) : null),
          mission_image: data.mission_image_url || (data.mission_image_path ? imageUrlFor({ image_path: data.mission_image_path }) : null),
          core_image: data.core_values_image_url || (data.core_values_image_path ? imageUrlFor({ image_path: data.core_values_image_path }) : null),
        });
      })
      .catch((err) => {
        console.error('fetch profile err', err);
        if (mounted) setErrorProfile('Gagal memuat profil (visi/misi)');
      })
      .finally(() => mounted && setLoadingProfile(false));

    return () => { mounted = false; };
  }, []);

  // ---------- fetch history (Tentang Sekolah) ----------
  useEffect(() => {
    let mounted = true;
    setLoadingHistory(true);
    setErrorHistory(null);

    fetch(`${API_BASE}/api/history`)
      .then((res) => {
        if (res.status === 404) return null; // belum ada history
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (!data) {
          setHistory(null);
        } else {
          // API returns { id, description, created_at }
          setHistory({
            id: data.id,
            description: data.description,
            created_at: data.created_at
          });
        }
      })
      .catch((err) => {
        console.error('fetch history err', err);
        if (mounted) setErrorHistory('Gagal memuat tentang sekolah');
      })
      .finally(() => mounted && setLoadingHistory(false));

    return () => { mounted = false; };
  }, []);

  // fetch news
  useEffect(() => {
    let mounted = true;
    setLoadingNews(true);
    setErrorNews(null);
    fetch(`${API_BASE}/api/news`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        const mapped = data.map((n) => ({
          id: n.id,
          title: n.title || n.judul || 'Untitled',
          excerpt:
            (n.description && (typeof n.description === 'string' ? n.description.slice(0, 160) + '...' : '')) ||
            n.excerpt ||
            '',
          image: imageUrlFor(n),
        }));
        setNewsList(mapped);
      })
      .catch((err) => {
        console.error('fetch news err', err);
        if (mounted) setErrorNews('Gagal memuat berita');
      })
      .finally(() => mounted && setLoadingNews(false));
    return () => { mounted = false; };
  }, []);

  // fetch gallery
  useEffect(() => {
    let mounted = true;
    setLoadingGallery(true);
    setErrorGallery(null);
    fetch(`${API_BASE}/api/gallery`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        const mapped = data.map((g) => ({
          id: g.id,
          image: imageUrlFor(g),
          created_at: g.created_at,
        }));
        setGalleryList(mapped);
      })
      .catch((err) => {
        console.error('fetch gallery err', err);
        if (mounted) setErrorGallery('Gagal memuat galeri');
      })
      .finally(() => mounted && setLoadingGallery(false));
    return () => { mounted = false; };
  }, []);

  const onLoginClick = () => navigate('/login');
  const onLogoutClick = () => { logout && logout(); navigate('/'); };

  const handleReadMore = (id) => {
    if (!user) { navigate('/login', { state: { from: `/news/${id}` } }); return; }
    navigate(`/news/${id}`);
  };

  const handleOpenGallery = () => {
    if (!user) navigate('/login', { state: { from: '/gallery' } });
    else navigate('/gallery');
  };

  const openVisiPage = () => navigate('/visi');

  return (
    <div className="landing-container">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">S</div>
            <div className="logo-text">
              <span className="logo-smart">SMART</span>
              <span className="logo-school">SCHOOL</span>
            </div>
          </div>

          <nav className="nav-menu">
            <a href="#beranda">Beranda</a>
            <a href="#profil">Profil</a>
            <a href="#galeri">Galeri</a>
            <a href="#pengumuman">Pengumuman</a>
            <a href="#daftar">Daftar</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user ? (
              <>
                <div style={{ color: '#064e7a', fontWeight: 700 }}>Halo, {username}</div>
                <button className="btn-masuk" onClick={onLogoutClick}>KELUAR</button>
              </>
            ) : (
              <button className="btn-masuk" onClick={onLoginClick}>MASUK</button>
            )}
          </div>
        </div>
      </header>

      {/* HERO + CARDS */}
      <section className="hero-section">
        <div className="hero-card-wrap">
          <div className="hero-images">
            <div className="hero-image" style={{ backgroundImage: `linear-gradient(135deg, rgba(30,91,168,0.06), rgba(243,156,18,0.03))` }}>
              <div style={{ padding: 20 }}>
                {/* optional hero content */}
              </div>
            </div>

            {/* profile preview block (visi/misi) */}
            <div className="hero-image" style={{ minHeight: 220 }}>
              <div style={{ padding: 16 }}>

                {loadingProfile ? (
                  <p style={{ color: 'red' }}>{errorProfile}</p>
                ) : !profile ? (
                  <div>
                    {/* no profile */}
                  </div>
                ) : (
                  <div className="profile-grid">
                    <div className="profile-left">
                      {/* left area if needed */}
                    </div>

                    <div className="profile-right">
                      {/* right area if needed */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* small cards under hero */}
        </div>

        {/* main cards (visi/tentang/student) */}
        <div className="cards-grid">
          {/* Visi & Misi Card */}
          <div className="info-card">
            <div className="card-image-container yellow-bg">
              <div className="card-icon-circle"><span className="card-emoji">📚</span></div>
            </div>
            <div className="card-content">
              <div className="card-badge yellow-badge">VISI & MISI</div>
              <p className="card-text">{profile && profile.vision ? (profile.vision.slice(0,120)+'...') : 'Visi & misi singkat sekolah.'}</p>
              <button className="btn-read-more" onClick={openVisiPage}>BACA SELENGKAPNYA</button>
            </div>
          </div>

          {/* Tentang Sekolah Card (terhubung ke /api/history) */}
          <div className="info-card">
            <div className="card-image-container green-bg">
              <div className="card-icon-circle"><span className="card-emoji">🏫</span></div>
            </div>
            <div className="card-content">
              <div className="card-badge yellow-badge">Tentang Sekolah</div>

              {loadingHistory ? (
                <p className="card-text">Memuat tentang sekolah...</p>
              ) : errorHistory ? (
                <p className="card-text" style={{ color: 'red' }}>{errorHistory}</p>
              ) : !history ? (
                <p className="card-text">Sejarah sekolah belum ditambahkan. Silakan periksa halaman admin.</p>
              ) : (
                <p className="card-text">{excerpt(history.description, 140)}</p>
              )}

              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <button
                  className="btn-read-more"
                  onClick={() => (!user ? navigate('/login', { state: { from: '/sekolah' } }) : navigate('/sekolah'))}
                >
                  BACA SELENGKAPNYA
                </button>

                {user && user.role === 'admin' && history && (
                  <button
                    className="btn-read-more"
                    onClick={() => navigate('/admin/edit-sejarah', { state: { id: history.id } })}
                    style={{ marginLeft: 6 }}
                  >
                    EDIT
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Student Card */}
          <div className="student-card">
            <div className="student-illustration">
              <svg viewBox="0 0 200 200" className="student-svg">
                <circle cx="100" cy="60" r="25" fill="#3B82F6" />
                <path d="M 100 90 Q 80 100 70 130 L 70 150 L 130 150 L 130 130 Q 120 100 100 90" fill="#3B82F6" />
                <rect x="85" y="120" width="30" height="35" fill="#60A5FA" rx="3" />
              </svg>
            </div>
            <div className="student-text">
              <p className="student-subtitle">SET OF</p>
              <h2 className="student-title">STUDENT</h2>
            </div>
          </div>
        </div>

        {/* Berita Sekolah */}
        <div className="berita-section">
          <div className="card-badge green-badge mb-6">Berita Sekolah</div>

          {loadingNews ? (
            <p>Memuat berita...</p>
          ) : errorNews ? (
            <p style={{ color: 'red' }}>{errorNews}</p>
          ) : (
            <div className="berita-grid">
              {newsList.length === 0 ? (
                <p>Tidak ada berita.</p>
              ) : (
                newsList.map((n) => (
                  <div key={n.id} className="berita-card">
                    <div
                      className="berita-image blue-gradient"
                      style={{
                        backgroundImage: n.image ? `url(${n.image})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {!n.image && <span className="berita-emoji">📰</span>}
                    </div>
                    <div className="berita-content">
                      <h3 className="berita-title">{n.title}</h3>
                      <p className="berita-text">
                        {n.excerpt}{' '}
                        <span className="text-link" style={{ cursor: 'pointer' }} onClick={() => handleReadMore(n.id)}>
                          BACA SELENGKAPNYA
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="text-center">
            <button className="btn-outline" onClick={() => (!user ? navigate('/login', { state: { from: '/news' } }) : navigate('/news'))}>
              BACA BERITA LAINNYA
            </button>
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="gallery-section">
        <div className="card-badge purple-badge mb-6">Gallery Sekolah</div>
        {loadingGallery ? (
          <p>Memuat galeri...</p>
        ) : errorGallery ? (
          <p style={{ color: 'red' }}>{errorGallery}</p>
        ) : (
          <div className="gallery-grid">
            {galleryList.slice(0, 6).map((g) => (
              <div key={g.id} className="gallery-item">
                {g.image ? (
                  <img src={g.image} alt={`gallery-${g.id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📸</div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="text-center">
          <button className="btn-text" onClick={handleOpenGallery}>LIHAT GALLERY LAINNYA</button>
        </div>
      </section>

      {/* Pengumuman & Footer tetap sama (dipersingkat) */}
      <section className="pengumuman-section">
        <div className="card-badge blue-badge mb-6">Pengumuman</div>
        <div className="pengumuman-grid">
          <div className="pengumuman-card">
            <h3 className="pengumuman-title">Perubahan Jam Belajar</h3>
            <p className="pengumuman-text">
              Lorem ipsum... <span className="text-link" style={{ cursor: 'pointer' }} onClick={() => (!user ? navigate('/login', { state: { from: '/pengumuman' } }) : navigate('/pengumuman'))}>BACA SELENGKAPNYA</span>
            </p>
          </div>
          <div className="pengumuman-card">
            <h3 className="pengumuman-title">Jadwal Ujian Semester</h3>
            <p className="pengumuman-text">
              Lorem ipsum... <span className="text-link" style={{ cursor: 'pointer' }} onClick={() => (!user ? navigate('/login', { state: { from: '/pengumuman' } }) : navigate('/pengumuman'))}>BACA SELENGKAPNYA</span>
            </p>
          </div>
          <div className="pengumuman-card">
            <h3 className="pengumuman-title">Pembagian Raport</h3>
            <p className="pengumuman-text">
              Lorem ipsum... <span className="text-link" style={{ cursor: 'pointer' }} onClick={() => (!user ? navigate('/login', { state: { from: '/pengumuman' } }) : navigate('/pengumuman'))}>BACA SELENGKAPNYA</span>
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3 className="footer-title">Hubungi Kami :</h3>
            <div className="contact-list">
              <div className="contact-item"><span className="contact-icon">📍</span><p className="contact-text">Alamat lengkap...</p></div>
              <div className="contact-item"><span className="contact-icon">📞</span><p className="contact-text">+62 231 236648</p></div>
              <div className="contact-item"><span className="contact-icon">✉️</span><p className="contact-text">info@smartschool.id</p></div>
            </div>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">Media Sosial Kami :</h3>
            <div className="social-list">
              <div className="social-item"><span className="social-icon">📷</span><p className="social-text">smanegeri2purwokarta</p></div>
            </div>
          </div>
        </div>
        <div className="footer-bottom"><p>@smartschool.id - All Right Reserved @Citrasolusi.id</p></div>
      </footer>
    </div>
  );
};

export default LandingPage;
