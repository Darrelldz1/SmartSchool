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

  // pengumuman
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [errorAnnouncements, setErrorAnnouncements] = useState(null);

  // headmaster & teachers
  const [headmaster, setHeadmaster] = useState(null);
  const [loadingHeadmaster, setLoadingHeadmaster] = useState(false);
  const [errorHeadmaster, setErrorHeadmaster] = useState(null);

  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [errorTeachers, setErrorTeachers] = useState(null);

  // programs
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [errorPrograms, setErrorPrograms] = useState(null);

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

  // helper: build image url from returned item (supports many variants)
  const imageUrlFor = (item) => {
    if (!item) return null;
    if (item.photo_url) return item.photo_url;
    if (item.image_url) return item.image_url;
    if (typeof item === 'string') {
      // if passed a direct path string
      const s = item;
      if (s.startsWith('http')) return s;
      return `${API_BASE}${s.startsWith('/') ? '' : '/'}${s}`;
    }
    if (item.photo) return (item.photo.startsWith('http') ? item.photo : `${API_BASE}${item.photo.startsWith('/') ? '' : '/'}${item.photo}`);
    if (item.image) return (item.image.startsWith('http') ? item.image : `${API_BASE}${item.image.startsWith('/') ? '' : '/'}${item.image}`);
    if (item.image_path) return (item.image_path.startsWith('http') ? item.image_path : `${API_BASE}${item.image_path.startsWith('/') ? '' : '/'}${item.image_path}`);
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

  // ---------- fetch pengumuman (announcements) ----------
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

  // ---------- fetch headmaster ----------
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

  // ---------- fetch teachers ----------
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

  // ---------- fetch programs (Program Unggulan) ----------
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

  // navigate to pengumuman detail (/pengumuman/:id)
  const openPengumumanDetail = (id) => {
    if (!user) navigate('/login', { state: { from: `/pengumuman/${id}` } });
    else navigate(`/pengumuman/${id}`);
  };

  // open full pengumuman list
  const openPengumumanList = () => {
    if (!user) navigate('/login', { state: { from: '/pengumuman' } });
    else navigate('/pengumuman');
  };

  const openCreatePengumuman = () => {
    if (!user) return navigate('/login');
    navigate('/admin/pengumuman/new');
  };

  const editPengumuman = (id) => {
    if (!user) return navigate('/login');
    navigate(`/admin/pengumuman/${id}/edit`);
  };

  // open headmaster detail page
  const openHeadmasterDetail = () => {
    navigate('/headmaster');
  };

  // open teachers listing
  const openTeachersPage = () => {
    navigate('/teachers');
  };

  // open teacher detail (public)
  const openTeacherDetail = (id) => {
    if (!id) return;
    navigate(`/teachers/${id}`);
  };

  // open programs listing (public)
  const openProgramsPage = () => navigate('/programs');

  // open program detail (public)
  const openProgramDetail = (id) => {
    if (!id) return;
    navigate(`/programs/${id}`);
  };

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
                  <div>{/* no profile */}</div>
                ) : (
                  <div className="profile-grid">
                    <div className="profile-left">{/* left area if needed */}</div>
                    <div className="profile-right">{/* right area if needed */}</div>
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

          {/* Student Card (ke halaman student atau info lain) */}
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

        {/* Additional section: Headmaster + Teachers preview + Programs */}
        <div className="cards-grid" style={{ marginTop: 20 }}>
          {/* Headmaster / Sambutan */}
          <div className="info-card" style={{ minHeight: 220 }}>
            <div className="card-image-container orange-bg">
              <div className="card-icon-circle"><span className="card-emoji">🎓</span></div>
            </div>
            <div className="card-content">
              <div className="card-badge yellow-badge">SAMBUTAN KEPALA SEKOLAH</div>

              {loadingHeadmaster ? (
                <p className="card-text">Memuat sambutan...</p>
              ) : errorHeadmaster ? (
                <p className="card-text" style={{ color: 'red' }}>{errorHeadmaster}</p>
              ) : !headmaster ? (
                <p className="card-text">Belum ada sambutan kepala sekolah.</p>
              ) : (
                <>
                  <p className="card-text" style={{ minHeight: 80 }}>{excerpt(headmaster.greeting || '', 160)}</p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button className="btn-read-more" onClick={openHeadmasterDetail}>BACA SELENGKAPNYA</button>
                    {headmaster.photo_url && (
                      <img src={imageUrlFor(headmaster)} alt={headmaster.name || 'Kepala Sekolah'} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Teachers preview */}
          <div className="info-card" style={{ minHeight: 220 }}>
            <div className="card-image-container teal-bg">
              <div className="card-icon-circle"><span className="card-emoji">👩‍🏫</span></div>
            </div>
            <div className="card-content">
              <div className="card-badge yellow-badge">PROFIL GURU</div>

              {loadingTeachers ? (
                <p className="card-text">Memuat guru...</p>
              ) : errorTeachers ? (
                <p className="card-text" style={{ color: 'red' }}>{errorTeachers}</p>
              ) : teachers.length === 0 ? (
                <p className="card-text">Belum ada data guru.</p>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    {teachers.slice(0, 4).map((t) => (
                      <div key={t.id} style={{ textAlign: 'center', width: 72, cursor: 'pointer' }} onClick={() => openTeacherDetail(t.id)}>
                        <div style={{ width: 64, height: 64, margin: '0 auto', borderRadius: 8, overflow: 'hidden', background: '#f3f4f6' }}>
                          {imageUrlFor(t) ? <img src={imageUrlFor(t)} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ paddingTop: 16, color:'#9ca3af' }}>No photo</div>}
                        </div>
                        <div style={{ fontSize: 12, marginTop: 6 }}>{t.name?.split(' ')[0]}</div>
                      </div>
                    ))}
                  </div>

                  <p className="card-text">Profil singkat guru & mata pelajaran. Klik foto/nama untuk detail.</p>
                  <div style={{ marginTop: 8 }}>
                    <button className="btn-read-more" onClick={openTeachersPage}>LIHAT GURU</button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Programs preview */}
          <div className="info-card" style={{ minHeight: 220 }}>
            <div className="card-image-container blue-bg">
              <div className="card-icon-circle"><span className="card-emoji">🏆</span></div>
            </div>
            <div className="card-content">
              <div className="card-badge yellow-badge">PROGRAM UNGGULAN</div>

              {loadingPrograms ? (
                <p className="card-text">Memuat program unggulan...</p>
              ) : errorPrograms ? (
                <p className="card-text" style={{ color: 'red' }}>{errorPrograms}</p>
              ) : programs.length === 0 ? (
                <p className="card-text">Belum ada program unggulan.</p>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    {programs.slice(0, 3).map((p) => (
                      <div key={p.id} style={{ textAlign: 'left', width: 100 }}>
                        <div style={{ width: 100, height: 72, margin: '0 auto', borderRadius: 8, overflow: 'hidden', background: '#f3f4f6' }}>
                          {imageUrlFor(p) ? <img src={imageUrlFor(p)} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ paddingTop: 12, color:'#9ca3af', textAlign:'center' }}>No image</div>}
                        </div>
                        <div style={{ fontSize: 12, marginTop: 6, fontWeight: 600 }}>{p.title?.slice(0,18)}{p.title && p.title.length>18 ? '...' : ''}</div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>{(p.description || '').slice(0, 30)}{(p.description && p.description.length > 30) ? '...' : ''}</div>
                      </div>
                    ))}
                  </div>

                  <p className="card-text">Program unggulan sekolah — pelatihan, ekstrakurikuler, dan kurikulum khusus.</p>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button className="btn-read-more" onClick={openProgramsPage}>LIHAT SEMUA PROGRAM</button>
                    <button className="btn-read-more" onClick={() => openProgramDetail(programs[0]?.id)} disabled={!programs[0]}>
                      LIHAT DETAIL TERATAS
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Container Biru Dimulai Dari Sini */}
        <div className="blue-container-section">
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
              <button className="btn-outline-white" onClick={() => (!user ? navigate('/login', { state: { from: '/news' } }) : navigate('/news'))}>
                BACA BERITA LAINNYA
              </button>
            </div>
          </div>

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

          {/* Pengumuman */}
          <section className="pengumuman-section" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="card-badge blue-badge">Pengumuman</div>
              <div>
                {user && (user.role === 'admin' || user.role === 'guru') && (
                  <button className="btn-read-more" onClick={openCreatePengumuman}>
                    Tambah Pengumuman
                  </button>
                )}
              </div>
            </div>

            {loadingAnnouncements ? (
              <p>Memuat pengumuman...</p>
            ) : errorAnnouncements ? (
              <p style={{ color: 'red' }}>{errorAnnouncements}</p>
            ) : announcements.length === 0 ? (
              <p>Tidak ada pengumuman.</p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 12 }} />

                <div className="pengumuman-grid" style={{ display: 'flex', gap: 18, flex: 1 }}>
                  {announcements.slice(0, 3).map((a) => (
                    <div key={a.id} className="pengumuman-card" style={{ flex: 1, background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 8px 20px rgba(16,24,40,0.06)', minWidth: 220 }}>
                      <h3 className="pengumuman-title">{a.title}</h3>
                      <p className="pengumuman-text">{excerpt(a.description, 120)}</p>
                      <div style={{ marginTop: 8 }}>
                        <button className="btn-read-more" onClick={() => openPengumumanDetail(a.id)}>
                          BACA SELENGKAPNYA
                        </button>
                        {user && (user.role === 'admin' || user.role === 'guru') && (
                          <button
                            className="btn-read-more"
                            onClick={() => editPengumuman(a.id)}
                            style={{ marginLeft: 8 }}
                          >
                            EDIT
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  aria-label="Lihat semua pengumuman"
                  onClick={openPengumumanList}
                  style={{
                    border: 'none',
                    background: '#0b6ea0',
                    color: '#fff',
                    borderRadius: 999,
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 18px rgba(11,110,160,0.25)',
                    cursor: 'pointer'
                  }}
                >
                  ›
                </button>
              </div>
            )}
          </section>
        </div>
        {/* Container Biru Berakhir Di Sini */}

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
