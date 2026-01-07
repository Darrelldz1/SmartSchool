// src/components/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import './Landingpage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [newsList, setNewsList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [headmaster, setHeadmaster] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [loadingHeadmaster, setLoadingHeadmaster] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [errorHistory, setErrorHistory] = useState(null);
  const [errorAnnouncements, setErrorAnnouncements] = useState(null);
  const [errorHeadmaster, setErrorHeadmaster] = useState(null);
  const [errorTeachers, setErrorTeachers] = useState(null);
  const [errorPrograms, setErrorPrograms] = useState(null);
  const [errorNews, setErrorNews] = useState(null);
  const [errorGallery, setErrorGallery] = useState(null);
  const [errorProfile, setErrorProfile] = useState(null);

  useEffect(() => {
    if (user) setUsername(user.name || user.email || user.role || 'Pengguna');
    else setUsername('');
  }, [user]);

  // Helper functions
  const imageUrlFor = (item) => {
    if (!item) return null;
    if (item.photo_url) return item.photo_url;
    if (item.image_url) return item.image_url;
    if (typeof item === 'string') {
      const s = item;
      if (s.startsWith('http')) return s;
      return `${API_BASE}${s.startsWith('/') ? '' : '/'}${s}`;
    }
    if (item.photo) return (item.photo.startsWith('http') ? item.photo : `${API_BASE}${item.photo.startsWith('/') ? '' : '/'}${item.photo}`);
    if (item.image) return (item.image.startsWith('http') ? item.image : `${API_BASE}${item.image.startsWith('/') ? '' : '/'}${item.image}`);
    if (item.image_path) return (item.image_path.startsWith('http') ? item.image_path : `${API_BASE}${item.image_path.startsWith('/') ? '' : '/'}${item.image_path}`);
    return null;
  };

  const excerpt = (text = '', n = 140) => {
    if (!text) return '';
    const clean = String(text);
    return clean.length > n ? clean.slice(0, n).trim() + '...' : clean;
  };

  // Fetch profile
  useEffect(() => {
    let mounted = true;
    setLoadingProfile(true);
    setErrorProfile(null);
    fetch(`${API_BASE}/api/profile`)
      .then((res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (!data) {
          setProfile(null);
          return;
        }
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
        if (mounted) setErrorProfile('Gagal memuat profil');
      })
      .finally(() => mounted && setLoadingProfile(false));

    return () => { mounted = false; };
  }, []);

  // Fetch history
  useEffect(() => {
    let mounted = true;
    setLoadingHistory(true);
    setErrorHistory(null);

    fetch(`${API_BASE}/api/history`)
      .then((res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (!data) {
          setHistory(null);
        } else {
          setHistory({
            id: data.id,
            description: data.description,
            created_at: data.created_at,
            updated_at: data.updated_at
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

  // Fetch announcements
  useEffect(() => {
    let mounted = true;
    setLoadingAnnouncements(true);
    setErrorAnnouncements(null);

    fetch(`${API_BASE}/api/pengumuman`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        const mapped = (data || []).map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          created_at: p.created_at,
        }));
        setAnnouncements(mapped);
      })
      .catch((err) => {
        console.error('fetch pengumuman err', err);
        if (mounted) setErrorAnnouncements('Gagal memuat pengumuman');
      })
      .finally(() => mounted && setLoadingAnnouncements(false));

    return () => { mounted = false; };
  }, []);

  // Fetch headmaster
  useEffect(() => {
    let mounted = true;
    setLoadingHeadmaster(true);
    setErrorHeadmaster(null);

    fetch(`${API_BASE}/api/headmaster`)
      .then((res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setHeadmaster(data || null);
      })
      .catch((err) => {
        console.error('fetch headmaster err', err);
        if (mounted) setErrorHeadmaster('Gagal memuat sambutan kepala sekolah');
      })
      .finally(() => mounted && setLoadingHeadmaster(false));

    return () => { mounted = false; };
  }, []);

  // Fetch teachers
  useEffect(() => {
    let mounted = true;
    setLoadingTeachers(true);
    setErrorTeachers(null);

    fetch(`${API_BASE}/api/teacher`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setTeachers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('fetch teachers err', err);
        if (mounted) setErrorTeachers('Gagal memuat data guru');
      })
      .finally(() => mounted && setLoadingTeachers(false));

    return () => { mounted = false; };
  }, []);

  // Fetch programs
  useEffect(() => {
    let mounted = true;
    setLoadingPrograms(true);
    setErrorPrograms(null);

    fetch(`${API_BASE}/api/program`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setPrograms(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('fetch programs err', err);
        if (mounted) setErrorPrograms('Gagal memuat program unggulan');
      })
      .finally(() => mounted && setLoadingPrograms(false));

    return () => { mounted = false; };
  }, []);

  // Fetch news
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
        const mapped = (data || []).map((n) => ({
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

  // Fetch gallery
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
        const mapped = (data || []).map((g) => ({
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

  // Navigation handlers - FIXED
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

  // FIXED: Mengarah ke route yang benar dengan parameter ID
  const openPengumumanDetail = (id) => {
    if (!user) {
      navigate('/login', { state: { from: `/pengumuman/${id}` } });
    } else {
      navigate(`/pengumuman/${id}`);
    }
  };

  const openPengumumanList = () => {
    if (!user) {
      navigate('/login', { state: { from: '/pengumuman' } });
    } else {
      navigate('/pengumuman');
    }
  };

  const openCreatePengumuman = () => {
    if (!user) return navigate('/login');
    navigate('/admin/pengumuman/new');
  };

  // FIXED: Mengarah ke route edit di admin dengan parameter ID
  const editPengumuman = (id) => {
    if (!user) return navigate('/login');
    navigate(`/admin/pengumuman/${id}/edit`);
  };

  const openHeadmasterDetail = () => {
    navigate('/headmaster');
  };

  const openTeachersPage = () => {
    navigate('/teachers');
  };

  const openTeacherDetail = (id) => {
    if (!id) return;
    navigate(`/teachers/${id}`);
  };

  const openProgramsPage = () => navigate('/programs');

  const openProgramDetail = (id) => {
    if (!id) return;
    navigate(`/programs/${id}`);
  };

  return (
    <div className="landing-container">
      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">S</div>
            <div className="logo-text">
              <span className="logo-smart">SMART SCHOOL</span>
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
                <div style={{ color: '#2563eb', fontWeight: 700 }}>Halo, {username}</div>
                <button className="btn-masuk" onClick={onLogoutClick} style={{ background: 'linear-gradient(to right, #dc2626, #b91c1c)' }}>KELUAR</button>
              </>
            ) : (
              <button className="btn-masuk" onClick={onLoginClick}>MASUK</button>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="beranda" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Selamat Datang di<br/>
            <span style={{ background: 'linear-gradient(to right, #fcd34d, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SMART SCHOOL
            </span>
          </h1>
          <p className="hero-subtitle">
            Membentuk Generasi Unggul, Berakhlak Mulia, dan Berdaya Saing Global
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">DAFTAR SEKARANG</button>
            <button className="btn-secondary">PELAJARI LEBIH LANJUT</button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎓</div>
              <div className="stat-value">1000+</div>
              <div className="stat-label">Siswa Aktif</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👨‍🏫</div>
              <div className="stat-value">50+</div>
              <div className="stat-label">Guru Profesional</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">100+</div>
              <div className="stat-label">Prestasi</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">15+</div>
              <div className="stat-label">Program Unggulan</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CARDS */}
      <section id="profil">
        <div className="cards-grid">
          {/* Visi & Misi Card */}
          <div className="info-card">
            <div className="card-image-container yellow-bg">
              <div className="card-icon-circle">📚</div>
            </div>
            <div className="card-content">
              <div className="card-badge yellow-badge">VISI & MISI</div>
              <p className="card-text">
                {profile && profile.vision 
                  ? profile.vision.slice(0, 120) + '...' 
                  : 'Menjadi sekolah unggulan yang menghasilkan lulusan berkualitas, berakhlak mulia, dan berdaya saing tinggi di era global.'}
              </p>
              <button className="btn-read-more" onClick={openVisiPage}>BACA SELENGKAPNYA</button>
            </div>
          </div>

          {/* Tentang Sekolah Card */}
          <div className="info-card">
            <div className="card-image-container green-bg">
              <div className="card-icon-circle">🏫</div>
            </div>
            <div className="card-content">
              <div className="card-badge green-badge">TENTANG SEKOLAH</div>

              {loadingHistory ? (
                <p className="card-text">Memuat tentang sekolah...</p>
              ) : errorHistory ? (
                <p className="card-text" style={{ color: '#dc2626' }}>{errorHistory}</p>
              ) : !history ? (
                <p className="card-text">Sejarah sekolah belum ditambahkan. Silakan periksa halaman admin.</p>
              ) : (
                <p className="card-text">{excerpt(history.description, 140)}</p>
              )}

              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <button
                  className="btn-read-more"
                  onClick={() => (!user ? navigate('/login', { state: { from: '/sekolah' } }) : navigate('/sekolah'))}
                  style={{ background: 'linear-gradient(to right, #34d399, #059669)' }}
                >
                  BACA SELENGKAPNYA
                </button>

                {user && user.role === 'admin' && history && (
                  <button
                    className="btn-read-more"
                    onClick={() => navigate('/admin/edit-sejarah', { state: { id: history.id } })}
                    style={{ background: '#d1d5db', color: '#374151', flex: '0 0 auto', width: 'auto', padding: '0.75rem 1rem' }}
                  >
                    EDIT
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Student Card */}
          <div className="student-card">
            <svg viewBox="0 0 200 200" className="student-svg">
              <circle cx="100" cy="60" r="25" fill="white" opacity="0.9"/>
              <path d="M 100 90 Q 80 100 70 130 L 70 150 L 130 150 L 130 130 Q 120 100 100 90" fill="white" opacity="0.9"/>
              <rect x="85" y="120" width="30" height="35" fill="white" opacity="0.7" rx="3"/>
            </svg>
            <p className="student-subtitle">SET OF</p>
            <h2 className="student-title">STUDENT</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginTop: '1rem', textAlign: 'center' }}>
              Mengembangkan Potensi Terbaik Setiap Siswa
            </p>
          </div>
        </div>

        {/* Additional Programs, Teachers, Headmaster Cards */}
        <div className="cards-grid" style={{ paddingTop: 0 }}>
          {/* Sambutan Kepala Sekolah */}
          <div className="info-card">
            <div className="card-image-container purple-bg">
              <div className="card-icon-circle">🎓</div>
            </div>
            <div className="card-content">
              <div className="card-badge purple-badge">SAMBUTAN KEPALA SEKOLAH</div>

              {loadingHeadmaster ? (
                <p className="card-text">Memuat sambutan...</p>
              ) : errorHeadmaster ? (
                <p className="card-text" style={{ color: '#dc2626' }}>{errorHeadmaster}</p>
              ) : !headmaster ? (
                <p className="card-text">Belum ada sambutan kepala sekolah.</p>
              ) : (
                <>
                  <p className="card-text">{excerpt(headmaster.greeting || '', 140)}</p>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                    {headmaster.photo_url && (
                      <img 
                        src={imageUrlFor(headmaster)} 
                        alt={headmaster.name || 'Kepala Sekolah'} 
                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '50%', border: '4px solid #f3e8ff' }} 
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 700, color: '#1f2937' }}>{headmaster.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Kepala Sekolah</div>
                    </div>
                  </div>
                </>
              )}

              <button className="btn-read-more" onClick={openHeadmasterDetail} style={{ background: 'linear-gradient(to right, #c084fc, #9333ea)' }}>
                BACA SELENGKAPNYA
              </button>
            </div>
          </div>

          {/* Profil Guru */}
          <div className="info-card">
            <div className="card-image-container teal-bg">
              <div className="card-icon-circle">👩‍🏫</div>
            </div>
            <div className="card-content">
              <div className="card-badge green-badge">PROFIL GURU</div>

              {loadingTeachers ? (
                <p className="card-text">Memuat guru...</p>
              ) : errorTeachers ? (
                <p className="card-text" style={{ color: '#dc2626' }}>{errorTeachers}</p>
              ) : teachers.length === 0 ? (
                <p className="card-text">Belum ada data guru.</p>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 16, overflow: 'auto', paddingBottom: 8 }}>
                    {teachers.slice(0, 4).map((t) => (
                      <div 
                        key={t.id} 
                        style={{ textAlign: 'center', minWidth: 72, cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={() => openTeacherDetail(t.id)}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <div style={{ 
                          width: 64, 
                          height: 64, 
                          margin: '0 auto 8px', 
                          borderRadius: 12, 
                          overflow: 'hidden', 
                          background: '#f3f4f6',
                          border: '2px solid #d1fae5'
                        }}>
                          {imageUrlFor(t) ? (
                            <img src={imageUrlFor(t)} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ paddingTop: 16, color:'#9ca3af' }}>👤</div>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{t.name?.split(' ')[0]}</div>
                      </div>
                    ))}
                  </div>

                  <p className="card-text" style={{ fontSize: '0.875rem' }}>
                    Tim pengajar profesional dan berpengalaman siap membimbing siswa menuju kesuksesan.
                  </p>
                </>
              )}

              <button className="btn-read-more" onClick={openTeachersPage} style={{ background: 'linear-gradient(to right, #2dd4bf, #0d9488)' }}>
                LIHAT SEMUA GURU
              </button>
            </div>
          </div>

          {/* Program Unggulan */}
          <div className="info-card">
            <div className="card-image-container blue-bg">
              <div className="card-icon-circle">🏆</div>
            </div>
            <div className="card-content">
              <div className="card-badge blue-badge">PROGRAM UNGGULAN</div>

              {loadingPrograms ? (
                <p className="card-text">Memuat program unggulan...</p>
              ) : errorPrograms ? (
                <p className="card-text" style={{ color: '#dc2626' }}>{errorPrograms}</p>
              ) : programs.length === 0 ? (
                <p className="card-text">Belum ada program unggulan.</p>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                    {programs.slice(0, 3).map((p) => (
                      <div 
                        key={p.id} 
                        style={{ 
                          display: 'flex', 
                          gap: 12, 
                          alignItems: 'flex-start',
                          padding: 8,
                          borderRadius: 8,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => openProgramDetail(p.id)}
                        onMouseOver={(e) => e.currentTarget.style.background = '#eff6ff'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: '#f3f4f6', flexShrink: 0 }}>
                          {imageUrlFor(p) ? (
                            <img src={imageUrlFor(p)} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ paddingTop: 8, textAlign: 'center', color: '#9ca3af' }}>📋</div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1f2937', marginBottom: 4 }}>
                            {p.title?.slice(0, 35)}{p.title && p.title.length > 35 ? '...' : ''}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.4 }}>
                            {excerpt(p.description || '', 60)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="card-text" style={{ fontSize: '0.875rem' }}>
                    Program unggulan sekolah — pelatihan, ekstrakurikuler, dan kurikulum khusus.
                  </p>
                </>
              )}

              <button className="btn-read-more" onClick={openProgramsPage} style={{ background: 'linear-gradient(to right, #fbbf24, #f59e0b)' }}>
                LIHAT SEMUA PROGRAM
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BLUE CONTAINER SECTION */}
      <div className="blue-container-section">
        {/* Berita Sekolah */}
        <div className="berita-section">
          <div className="text-center mb-6">
            <div className="card-badge green-badge" style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
              BERITA SEKOLAH
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'black', marginTop: '1rem', marginBottom: '1rem' }}>
              Informasi Terkini
            </h2>
            <p style={{ color: '#bfdbfe', fontSize: '1.125rem' }}>
              Ikuti perkembangan dan kegiatan terbaru sekolah kami
            </p>
          </div>

          {loadingNews ? (
            <p style={{ color: 'white', textAlign: 'center' }}>Memuat berita...</p>
          ) : errorNews ? (
            <p style={{ color: '#fca5a5', textAlign: 'center' }}>{errorNews}</p>
          ) : (
            <div className="berita-grid">
              {newsList.length === 0 ? (
                <p style={{ color: 'white' }}>Tidak ada berita.</p>
              ) : (
                newsList.slice(0, 6).map((n) => (
                  <div key={n.id} className="berita-card">
                    <div
                      className="berita-image"
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
                        <span className="text-link" onClick={() => handleReadMore(n.id)}>
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
            <button 
              className="btn-outline-white" 
              onClick={() => (!user ? navigate('/login', { state: { from: '/news' } }) : navigate('/news'))}
            >
              BACA BERITA LAINNYA
            </button>
          </div>
        </div>

        {/* Gallery preview */}
        <section id="galeri" className="gallery-section">
          <div className="text-center mb-6">
            <div className="card-badge purple-badge" style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
              GALERI SEKOLAH
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginTop: '1rem', marginBottom: '1rem' }}>
              Momen Berharga
            </h2>
            <p style={{ color: '#bfdbfe', fontSize: '1.125rem' }}>
              Dokumentasi kegiatan dan prestasi siswa
            </p>
          </div>

          {loadingGallery ? (
            <p style={{ color: 'white', textAlign: 'center' }}>Memuat galeri...</p>
          ) : errorGallery ? (
            <p style={{ color: '#fca5a5', textAlign: 'center' }}>{errorGallery}</p>
          ) : (
            <div className="gallery-grid">
              {galleryList.slice(0, 6).map((g) => (
                <div key={g.id} className="gallery-item">
                  {g.image ? (
                    <img src={g.image} alt={`gallery-${g.id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #c084fc, #f472b6)',
                      fontSize: '3rem'
                    }}>
                      📸
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="text-center">
            <button className="btn-outline-white" onClick={handleOpenGallery}>
              LIHAT GALERI LENGKAP
            </button>
          </div>
        </section>

        {/* Pengumuman */}
        <section id="pengumuman" className="pengumuman-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="card-badge blue-badge" style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white', marginBottom: '1rem' }}>
                PENGUMUMAN
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>
                Informasi Penting
              </h2>
            </div>
            <div>
              {user && (user.role === 'admin' || user.role === 'guru') && (
                <button 
                  className="btn-primary"
                  onClick={openCreatePengumuman}
                  style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}
                >
                  + Tambah Pengumuman
                </button>
              )}
            </div>
          </div>

          {loadingAnnouncements ? (
            <p style={{ color: 'white' }}>Memuat pengumuman...</p>
          ) : errorAnnouncements ? (
            <p style={{ color: '#fca5a5' }}>{errorAnnouncements}</p>
          ) : announcements.length === 0 ? (
            <p style={{ color: 'white', textAlign: 'center', padding: '3rem 0' }}>Tidak ada pengumuman.</p>
          ) : (
            <>
<div className="pengumuman-grid">
  {announcements.slice(0, 3).map((a) => (
    <div key={a.id} className="pengumuman-card">
      <h3 className="pengumuman-title">{a.title}</h3>
      <p className="pengumuman-text">{excerpt(a.description, 120)}</p>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button 
          className="btn-read-more"
          onClick={() => openPengumumanDetail(a.id)}
          style={{ flex: 1, background: 'linear-gradient(to right, #2563eb, #1e40af)', fontSize: '0.875rem' }}
        >
          BACA
        </button>
        {user && (user.role === 'admin' || user.role === 'guru') && (
          <button
            className="btn-read-more"
            onClick={() => editPengumuman(a.id)}
            style={{ background: '#e5e7eb', color: '#374151', flex: '0 0 auto', width: 'auto', padding: '0.75rem 1rem', fontSize: '0.875rem' }}
          >
            EDIT
          </button>
        )}
      </div>
    </div>
  ))}
</div>

              {announcements.length > 3 && (
                <div className="text-center" style={{ marginTop: '2rem' }}>
                  <button 
                    className="btn-outline-white"
                    onClick={openPengumumanList}
                  >
                    LIHAT SEMUA PENGUMUMAN
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
              <div className="logo-icon" style={{ width: 48, height: 48 }}>S</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>SMART SCHOOL</div>
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
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Alamat</div>
                  <p className="contact-text">Jl. Pendidikan No. 123, Jakarta</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Telepon</div>
                  <p className="contact-text">+62 231 236648</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Email</div>
                  <p className="contact-text">info@smartschool.id</p>
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
                <p className="social-text">YouTube: Smart School Official</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Smart School. All Rights Reserved. Powered by Citrasolusi.id</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;