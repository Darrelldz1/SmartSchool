// src/components/LandingPage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import Header from './Header';  // Import Header
import Footer from './Footer';  // Import Footer
import './Landingpage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Data states
  const [newsList, setNewsList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [headmaster, setHeadmaster] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [programs, setPrograms] = useState([]);

  // Loading states
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [loadingHeadmaster, setLoadingHeadmaster] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Error states
  const [errorHistory, setErrorHistory] = useState(null);
  const [errorAnnouncements, setErrorAnnouncements] = useState(null);
  const [errorHeadmaster, setErrorHeadmaster] = useState(null);
  const [errorTeachers, setErrorTeachers] = useState(null);
  const [errorPrograms, setErrorPrograms] = useState(null);
  const [errorNews, setErrorNews] = useState(null);
  const [errorGallery, setErrorGallery] = useState(null);
  const [errorProfile, setErrorProfile] = useState(null);

  // HERO slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // GALLERY carousel state
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryAutoPlaying, setGalleryAutoPlaying] = useState(true);
  const galleryIntervalRef = useRef(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);

  // Helper functions
  const bgUrl = (path) => `url(${encodeURI(path)})`;

  const badgeLargeStyle = {
    fontSize: '1.05rem',
    padding: '0.45rem 0.9rem',
    fontWeight: 700,
    letterSpacing: '0.2px'
  };

  const staticCardImages = {
    visi: '/visimisi.png',
    tentang: '/tentangs sekolah.png',
    headmaster: '/headmaster.jpeg',
    teacher: '/teacher.jpg',
    program: '/program ungulan.jpg',
    beritaFallback: '/vite.svg',
  };

  const slides = [
    {
      id: 1,
      title: "Selamat Datang di",
      highlight: "SMART SCHOOL",
      subtitle: "Membentuk Generasi Unggul, Berakhlak Mulia, dan Berdaya Saing Global",
      imagePath: '/beranda backgrounds 1.jpeg'
    },
    {
      id: 2,
      title: "SMANSA BERSATU",
      highlight: "# SAVE SMANSA BANDUNG",
      subtitle: "Mohon doa & dukungan untuk keluarga SMAN 1 Bandung dalam sidang gugatan sertifikat tanah",
      imagePath: '/beranda background 2.jpeg'
    },
    {
      id: 3,
      title: "Welcome to",
      highlight: "Smart School",
      subtitle: "Selamat untuk belajar di SMK SMART SCHOOL - Pendidikan Berkualitas untuk Masa Depan Gemilang",
      imagePath: '/beranda background 3.jpeg'
    }
  ];

  /* ---------- HERO slider logic ---------- */
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  /* ---------- Gallery carousel logic ---------- */
  useEffect(() => {
    if (galleryIntervalRef.current) {
      clearInterval(galleryIntervalRef.current);
      galleryIntervalRef.current = null;
    }
    if (galleryAutoPlaying && galleryList.length > 1) {
      galleryIntervalRef.current = setInterval(() => {
        setGalleryIndex(prev => (prev + 1) % galleryList.length);
      }, 4000);
    }
    return () => {
      if (galleryIntervalRef.current) {
        clearInterval(galleryIntervalRef.current);
        galleryIntervalRef.current = null;
      }
    };
  }, [galleryAutoPlaying, galleryList.length]);

  const prevGallery = () => {
    setGalleryIndex(prev => (prev - 1 + galleryList.length) % galleryList.length);
  };
  
  const nextGallery = () => {
    setGalleryIndex(prev => (prev + 1) % galleryList.length);
  };
  
  const goToGallery = (i) => {
    setGalleryIndex(i);
  };

  const handleGalleryMouseEnter = () => setGalleryAutoPlaying(false);
  const handleGalleryMouseLeave = () => setGalleryAutoPlaying(true);

  /* ---------- Image URL helper ---------- */
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

  /* ---------- Text formatting helpers ---------- */
  const truncateTitle = (s = '', n = 30) => {
    if (!s) return '';
    const str = String(s).trim();
    return str.length > n ? str.slice(0, n).trim() + '...' : str;
  };
  
  const truncateDesc = (s = '', n = 128) => {
    if (!s) return '';
    const str = String(s).trim();
    return str.length > n ? str.slice(0, n).trim() + '...' : str;
  };

  const excerpt = (text = '', n = 140) => {
    if (!text) return '';
    const clean = String(text);
    return clean.length > n ? clean.slice(0, n).trim() + '...' : clean;
  };

  /* ---------- Fetch data ---------- */
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
        const mapped = (data || []).map((n) => {
          const fullDesc = n.description || n.excerpt || '';
          const createdAt = n.created_at || n.published_at || n.createdAt || null;
          return {
            id: n.id,
            title: n.title || n.judul || 'Untitled',
            description: fullDesc,
            excerpt: truncateDesc(fullDesc, 128),
            image: imageUrlFor(n) || (n.image ? n.image : null),
            created_at: createdAt
          };
        });
        setNewsList(mapped);
      })
      .catch((err) => {
        console.error('fetch news err', err);
        if (mounted) setErrorNews('Gagal memuat berita');
      })
      .finally(() => mounted && setLoadingNews(false));
    return () => { mounted = false; };
  }, []);

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
          image: imageUrlFor(g) || g.image || null,
          title: g.title || g.caption || `Galeri ${g.id}`,
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

  /* ---------- Navigation handlers ---------- */
  const handleReadMore = (id) => {
    if (!id) return;
    navigate(`/news/${id}`);
  };

  const handleOpenGallery = () => {
    navigate('/gallery');
  };

  const openVisiPage = () => navigate('/visi');

  const openPengumumanDetail = (id) => {
    if (!id) return;
    navigate(`/pengumuman/${id}`);
  };

  const openPengumumanList = () => navigate('/pengumuman');

  const openCreatePengumuman = () => {
    if (!user) return navigate('/login');
    navigate('/admin/pengumuman/create');
  };

  const editPengumuman = (id) => {
    if (!user) return navigate('/login');
    navigate(`/admin/pengumuman/${id}/edit`);
  };

  const openHeadmasterDetail = () => navigate('/headmaster');
  const openTeachersPage = () => navigate('/teacher');
  const openTeacherDetail = (id) => {
    if (!id) return;
    navigate('/teacher');
  };

  const openProgramsPage = () => navigate('/programs');

  const openProgramDetail = (id) => {
    if (!id) return;
    navigate(`/program/${id}`);
  };

  const openGalleryModal = (g) => {
    setSelectedGallery(g);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeGalleryModal = () => {
    setModalOpen(false);
    setSelectedGallery(null);
    document.body.style.overflow = '';
  };

  /* ---------- Modal keyboard control ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeGalleryModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ---------- Format date ---------- */
  const formatDate = (iso) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      if (isNaN(d)) return iso;
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="landing-container" style={{ backgroundColor: '#f8fafc' }}>
      {/* HEADER */}
      <Header />

      {/* Spacer untuk header fixed */}
      <div style={{ height: '60px' }} />

      {/* GLOBAL INLINE STYLE PATCH */}
      <style>{`
        /* Berita card tweaks */
        .berita-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(2,6,23,0.06); display: flex; flex-direction: column; }
        .berita-image { height: 180px; background-color: #eef2ff; display: flex; align-items: center; justify-content: center; }
        .berita-title { margin: 14px 16px 6px 16px; font-size: 1.05rem; font-weight: 800; color: #0f172a; line-height: 1.15; }
        .berita-meta { margin: 0 16px 6px 16px; font-size: 0.825rem; color: #6b7280; }
        .berita-content { padding: 0 16px 16px 16px; display: flex; flex-direction: column; flex: 1; }
        .berita-text {
          margin: 6px 0 0 0;
          font-size: 0.95rem;
          color: #4b5563;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .berita-actions { margin-top: 12px; display: flex; gap: 8px; align-items: center; }
        @media (max-width: 880px) {
          .berita-image { height: 160px; }
        }
      `}</style>

      {/* SLIDER HERO SECTION */}
      <section
        id="beranda"
        className="hero-slider-section"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ position: 'relative', height: '68vh', minHeight: 420, overflow: 'hidden' }}
      >
        <div className="slider-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
          {slides.map((slide, index) => {
            const bg = {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.25)), ${bgUrl(slide.imagePath || `/beranda background ${index+1}.jpeg`)}`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            };
            return (
              <div
                key={slide.id}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{
                  ...bg,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: index === currentSlide ? 1 : 0,
                  transition: 'opacity 1s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem',
                }}
              >
                <div className="hero-content" style={{ maxWidth: '1200px', width: '100%', zIndex: 2, color: '#fff' }}>
                  <h1 className="hero-title" style={{ margin: 0 }}>
                    <span style={{ fontSize: '1.6rem', display: 'block', fontWeight: 600 }}>{slide.title}</span>
                    <span style={{
                      background: 'linear-gradient(to right, #fcd34d, #fb923c)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '3.2rem',
                      fontWeight: 900,
                      display: 'block',
                      lineHeight: 1
                    }}>
                      {slide.highlight}
                    </span>
                  </h1>

                  <p className="hero-subtitle" style={{ color: '#fff', fontSize: '1.1rem', marginTop: '1rem', marginBottom: '1.8rem' }}>
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            );
          })}

          <button
            className="slider-btn prev-btn"
            onClick={prevSlide}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              background: 'rgba(255, 255, 255, 0.18)',
              border: 'none',
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              fontSize: '1.5rem',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.3s ease'
            }}
            aria-label="Previous slide"
          >
            ‹
          </button>

          <button
            className="slider-btn next-btn"
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              background: 'rgba(255, 255, 255, 0.18)',
              border: 'none',
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              fontSize: '1.5rem',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.3s ease'
            }}
            aria-label="Next slide"
          >
            ›
          </button>

          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            display: 'flex',
            gap: '0.5rem'
          }}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: index === currentSlide ? '2rem' : '0.75rem',
                  height: '0.75rem',
                  borderRadius: '9999px',
                  border: 'none',
                  background: index === currentSlide ? '#fbbf24' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CARDS */}
      <section id="profil">
        <div className="cards-grid">
          {/* Visi & Misi Card */}
          <div className="info-card">
            <div className="card-image-container yellow-bg">
              <img
                src={encodeURI(staticCardImages.visi)}
                alt="Visi & Misi"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.currentTarget.src = encodeURI(staticCardImages.visi); }}
              />
            </div>
            <div className="card-content">
              <div className="card-badge green-badge" style={badgeLargeStyle}>VISI & MISI</div>
              <p className="card-text">
                {profile && profile.vision
                  ? profile.vision.slice(0, 120) + '...'
                  : 'Menjadi sekolah unggulan yang menghasilkan lulusan berkualitas, berakhlak mulia, dan berdaya saing tinggi di era global.'}
              </p>
              <button
                className="btn-read-more"
                onClick={openVisiPage}
                style={{ background: '#68caf1', color: '#fff' }}
              >
                BACA SELENGKAPNYA
              </button>
            </div>
          </div>

          {/* Tentang Sekolah Card */}
          <div className="info-card">
            <div className="card-image-container green-bg">
              <img
                src={encodeURI(staticCardImages.tentang)}
                alt="Tentang Sekolah"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.currentTarget.src = encodeURI(staticCardImages.tentang); }}
              />
            </div>
            <div className="card-content">
              <div className="card-badge green-badge" style={badgeLargeStyle}>TENTANG SEKOLAH</div>

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
                  onClick={() => navigate('/sekolah')}
                  style={{ background: 'linear-gradient(to right, #68caf1, #68caf1)' }}
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
              <img
                src={encodeURI(staticCardImages.headmaster)}
                alt="Sambutan Kepala Sekolah"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.currentTarget.src = encodeURI(staticCardImages.headmaster); }}
              />
            </div>
            <div className="card-content">
              <div className="card-badge green-badge" style={badgeLargeStyle}>SAMBUTAN KEPALA SEKOLAH</div>

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
                    {headmaster && (headmaster.photo_url || headmaster.photo) && (
                      <img
                        src={imageUrlFor(headmaster)}
                        alt={headmaster.name || 'Kepala Sekolah'}
                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '50%', border: '4px solid #f3e8ff' }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 700, color: '#1f2937' }}>{headmaster?.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Kepala Sekolah</div>
                    </div>
                  </div>
                </>
              )}

              <button className="btn-read-more" onClick={openHeadmasterDetail} style={{ background: 'linear-gradient(to right, #68caf1, #68caf1)' }}>
                BACA SELENGKAPNYA
              </button>
            </div>
          </div>

          {/* Profil Guru */}
          <div className="info-card">
            <div className="card-image-container teal-bg">
              <img
                src={encodeURI(staticCardImages.teacher)}
                alt="Profil Guru"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.currentTarget.src = encodeURI(staticCardImages.teacher); }}
              />
            </div>
            <div className="card-content">
              <div className="card-badge green-badge" style={badgeLargeStyle}>PROFIL GURU</div>

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
                            <div style={{ paddingTop: 16, color: '#9ca3af' }}>👤</div>
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

              <button className="btn-read-more" onClick={openTeachersPage} style={{ background: 'linear-gradient(to right, #68caf1, #68caf1)' }}>
                LIHAT SEMUA GURU
              </button>
            </div>
          </div>

          {/* Program Unggulan */}
          <div className="info-card">
            <div className="card-image-container blue-bg">
              <img
                src={encodeURI(staticCardImages.program)}
                alt="Program Unggulan"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.currentTarget.src = encodeURI(staticCardImages.program); }}
              />
            </div>
            <div className="card-content">
              <div className="card-badge green-badge" style={{ fontSize: '1.05rem', padding: '0.45rem 0.85rem' }}>PROGRAM UNGGULAN</div>

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
                          <div style={{ fontWeight: 700, fontSize: '0.975rem', color: '#1f2937', marginBottom: 4 }}>
                            {p.title?.slice(0, 35)}{p.title && p.title.length > 35 ? '...' : ''}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.4 }}>
                            {excerpt(p.description || '', 60)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="card-text" style={{ fontSize: '0.995rem' }}>
                    Program unggulan sekolah — pelatihan, ekstrakurikuler, dan kurikulum khusus.
                  </p>
                </>
              )}

              <button className="btn-read-more" onClick={openProgramsPage} style={{ background: 'linear-gradient(to right, #68caf1, #68caf1)' }}>
                LIHAT SEMUA PROGRAM
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BERITA, GALERI, PENGUMUMAN */}
      <div className="blue-container-section">
        {/* Berita Sekolah */}
        <div className="berita-section" style={{ paddingTop: 28, paddingBottom: 36 }}>
          <div className="text-center mb-6">
            <div className="card-badge green-badge" style={{ ...badgeLargeStyle, background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
              BERITA SEKOLAH
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginTop: '1rem', marginBottom: '1rem' }}>
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
                  <div key={n.id} className="berita-card" style={{ cursor: 'pointer' }}>
                    <div
                      className="berita-image"
                      onClick={() => handleReadMore(n.id)}
                      style={{
                        backgroundImage: n.image ? `url(${n.image})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleReadMore(n.id); }}
                    >
                      {!n.image && <span className="berita-emoji" style={{ fontSize: 36 }}>📰</span>}
                    </div>

                    <div className="berita-content">
                      <h3
                        className="berita-title"
                        title={n.title}
                        onClick={() => handleReadMore(n.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {truncateTitle(n.title, 30)}
                      </h3>

                      {n.created_at && (
                        <div className="berita-meta">{formatDate(n.created_at)}</div>
                      )}

                      <p className="berita-text" aria-label={n.description}>
                        {n.excerpt}{' '}
                        <button
                          type="button"
                          className="text-link"
                          onClick={() => handleReadMore(n.id)}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#2563eb', fontWeight: 700 }}
                        >
                          BACA SELENGKAPNYA
                        </button>
                      </p>

                      <div className="berita-actions">
                        {/* optional additional controls */}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="text-center" style={{ marginTop: 18 }}>
            <button
        className="btn-pill-primary"
              onClick={() => navigate('/news')}
            >
              BACA BERITA LAINNYA
            </button>
          </div>
        </div>

        {/* Gallery preview */}
        <section id="galeri" className="gallery-section">
          <div className="text-center mb-6">
            <div className="card-badge purple-badge" style={{ ...badgeLargeStyle, background: 'rgba(255, 255, 255, 0.2)', color: 'black' }}>
              GALERI SEKOLAH
            </div>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'black', marginTop: '1rem', marginBottom: '1rem' }}>
              Kegiatan di sekolah
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              Dokumentasi kegiatan dan prestasi siswa
            </p>
          </div>

          {loadingGallery ? (
            <p style={{ color: 'black', textAlign: 'center' }}>Memuat galeri...</p>
          ) : errorGallery ? (
            <p style={{ color: '#fca5a5', textAlign: 'center' }}>{errorGallery}</p>
          ) : galleryList.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '3rem 0' }}>Tidak ada galeri.</p>
          ) : (
            <div
              className="gallery-carousel"
              onMouseEnter={handleGalleryMouseEnter}
              onMouseLeave={handleGalleryMouseLeave}
              style={{
                position: 'relative',
                maxWidth: 1100,
                margin: '0 auto',
                borderRadius: 12,
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 8px 28px rgba(15,23,42,0.06)',
                padding: '18px'
              }}
            >
              {/* Track */}
              <div
                className="carousel-track"
                style={{
                  display: 'flex',
                  width: `${galleryList.length * 100}%`,
                  transform: `translateX(-${galleryIndex * (100 / galleryList.length)}%)`,
                  transition: 'transform 0.8s ease'
                }}
                aria-live="polite"
              >
                {galleryList.map((g, i) => (
                  <div key={g.id} style={{ minWidth: `${100 / galleryList.length}%`, width: `${100 / galleryList.length}%`, padding: 8 }}>
                    <div
                      onClick={() => openGalleryModal(g)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') openGalleryModal(g); }}
                      style={{
                        width: '100%',
                        height: 320,
                        borderRadius: 10,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {g.image ? (
                        <img src={g.image} alt={g.title || `gallery-${g.id}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
                          📸
                        </div>
                      )}
                    </div>
                    <div style={{ marginTop: 10, textAlign: 'center', color: '#374151', fontWeight: 700 }}>{g.title}</div>
                  </div>
                ))}
              </div>

              {/* Prev / Next */}
              <button
                onClick={prevGallery}
                aria-label="Previous gallery"
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 6,
                  background: 'rgba(0,0,0,0.45)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ‹
              </button>

              <button
                onClick={nextGallery}
                aria-label="Next gallery"
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 6,
                  background: 'rgba(0,0,0,0.45)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ›
              </button>

              {/* Dots */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                {galleryList.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToGallery(i)}
                    aria-label={`Go to gallery ${i + 1}`}
                    style={{
                      width: galleryIndex === i ? 28 : 10,
                      height: 10,
                      borderRadius: 9999,
                      border: 'none',
                      background: galleryIndex === i ? '#2563eb' : 'rgba(15,23,42,0.12)',
                      transition: 'all 0.25s'
                    }}
                  />
                ))}
              </div>

              {/* Lihat Galeri Lengkap */}
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <button
                  onClick={handleOpenGallery}
                  style={{
                    display: 'inline-block',
                    padding: '10px 28px',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    borderRadius: 9999,
                    border: '2px solid rgba(37,99,235,0.95)',
                    background: 'linear-gradient(90deg, #68b8f9 0%, #55a6f6 50%, #3b8df0 100%)',
                    color: '#ffffff',
                    boxShadow: '0 6px 18px rgba(14,65,194,0.12), inset 0 1px 0 rgba(255,255,255,0.12)',
                    cursor: 'pointer',
                    transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                    textTransform: 'uppercase'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(14,65,194,0.18), inset 0 1px 0 rgba(255,255,255,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(14,65,194,0.12), inset 0 1px 0 rgba(255,255,255,0.12)';
                  }}
                >
                  LIHAT GALERI LENGKAP
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Pengumuman */}
        <section id="pengumuman" className="pengumuman-section" style={{ paddingTop: 28 }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div className="card-badge green-badge" style={{ ...badgeLargeStyle, background: 'rgba(255, 255, 255, 0.2)', color: 'black', display: 'inline-block', marginBottom: 12 }}>
              PENGUMUMAN
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'black', marginTop: 0 }}>
              Informasi Penting
            </h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
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

          {loadingAnnouncements ? (
            <p style={{ color: 'black' }}>Memuat pengumuman...</p>
          ) : errorAnnouncements ? (
            <p style={{ color: '#fca5a5' }}>{errorAnnouncements}</p>
          ) : announcements.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '3rem 0' }}>Tidak ada pengumuman.</p>
          ) : (
            <>
              <div className="pengumuman-grid" style={{ maxWidth: 1100, margin: '0 auto' }}>
                {announcements.slice(0, 3).map((a) => (
                  <div key={a.id} className="pengumuman-card">
                    <h3 className="pengumuman-title">{a.title}</h3>
                    <p className="pengumuman-text">{excerpt(a.description, 120)}</p>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <button
                        className="btn-read-more"
                        onClick={() => openPengumumanDetail(a.id)}
                        style={{ flex: 1, background: 'linear-gradient(to right, #2563eb, #1e40af)', fontSize: '0.875rem', color: '#fff' }}
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
  className="btn-pill-primary"
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
      <Footer />

      {/* Gallery Modal */}
      {modalOpen && selectedGallery && (
        <div
          role="dialog"
          aria-modal="true"
          className="gallery-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) closeGalleryModal(); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 20
          }}
        >
          <div style={{ maxWidth: 1100, width: '100%', borderRadius: 12, overflow: 'hidden', background: '#fff', boxShadow: '0 12px 40px rgba(0,0,0,0.45)', position: 'relative' }}>
            <button
              onClick={closeGalleryModal}
              aria-label="Tutup"
              style={{
                position: 'absolute',
                right: 12,
                top: 12,
                zIndex: 10,
                background: 'transparent',
                border: 'none',
                fontSize: 22,
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', gap: 0, flexDirection: 'column' }}>
              <div style={{ width: '100%', height: '60vh', minHeight: 320, background: '#111' }}>
                {selectedGallery.image ? (
                  <img src={selectedGallery.image} alt={selectedGallery.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📸</div>
                )}
              </div>

              <div style={{ padding: '1.25rem 1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{selectedGallery.title || 'Galeri'}</h3>
                {selectedGallery.created_at && (
                  <div style={{ marginTop: 8, color: '#6b7280', fontSize: '0.9rem' }}>
                    {formatDate(selectedGallery.created_at)}
                  </div>
                )}
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button className="btn-outline-black" onClick={() => { closeGalleryModal(); navigate('/gallery'); }}>
                    Lihat Semua Galeri
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;