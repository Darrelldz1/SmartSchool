// src/components/Header.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import './LandingPage.css';

// tinggi header (sesuaikan dengan spacer di LandingPage: earlier used 60px)
export const HEADER_HEIGHT = 60;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [username, setUsername] = useState('');
  const [logoIndex, setLogoIndex] = useState(0);
  const [logoFailed, setLogoFailed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState('beranda');

  const isMountedRef = useRef(true);

  const logoCandidates = [
    '/logo-smartschool.png',
    '/logo smartschool.png',
    '/logo%20smartschool.png',
    '/logo smartschool asli.png',
    '/logo%20smartschool%20asli.png',
    '/logo-smartschool-asli.png',
  ];

  useEffect(() => {
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (user) setUsername(user.name || user.email || user.role || 'Pengguna');
    else setUsername('');
  }, [user]);

  const logoSrc = logoCandidates[logoIndex] || '';

  const handleLogoError = () => {
    const next = logoIndex + 1;
    if (next < logoCandidates.length) {
      setLogoIndex(next);
    } else {
      setLogoFailed(true);
    }
  };

  const onLoginClick = () => {
    navigate('/login');
    setMobileOpen(false);
  };
  const onLogoutClick = () => {
    logout && logout();
    navigate('/');
    setMobileOpen(false);
  };

  const sections = ['beranda', 'profil', 'galeri', 'pengumuman'];

  // Scroll helper with header offset
  const scrollToId = useCallback((id) => {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT - 8;
      window.scrollTo({ top, behavior: 'smooth' });
      return true;
    }
    return false;
  }, []);

  // handle click on nav item
  const handleNavClick = (id) => (e) => {
    e.preventDefault();
    setMobileOpen(false);

    // If we're not on landing page, navigate to '/' first then attempt to scroll
    if (location.pathname !== '/') {
      // navigate to home and attempt to scroll shortly after
      navigate('/', { replace: false });
      // give the page a moment to render sections
      setTimeout(() => {
        scrollToId(id);
      }, 250);
    } else {
      // same page - scroll immediately
      if (!scrollToId(id)) {
        // if element not found (rare), try small delay
        setTimeout(() => scrollToId(id), 200);
      }
    }
  };

  // detect active section on scroll
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        try {
          let current = activeId;
          for (const id of sections) {
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              // consider section active when its top is at or above header + 20 and bottom is below header
              if (rect.top <= HEADER_HEIGHT + 20 && rect.bottom > HEADER_HEIGHT + 20) {
                current = id;
                break;
              }
            }
          }
          if (isMountedRef.current && current !== activeId) {
            setActiveId(current);
          }
        } finally {
          ticking = false;
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // run once to set initial active
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, location.pathname]);

  // close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <style>{`
        .header { background: #001a4d !important; color: white !important; }
        .header a { color: #ffffff !important; text-decoration: none !important; }
        .header a:focus, .header a:hover { color: #60a5fa !important; }
        .header a:focus { outline: 2px solid rgba(96,165,250,0.18); outline-offset: 2px; }

        /* mobile nav */
        .header .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: white;
          font-size: 1.25rem;
          cursor: pointer;
        }
        @media (max-width: 880px) {
          .header .nav-menu { display: none; }
          .header .mobile-toggle { display: inline-flex; align-items: center; gap: 8px; }
          .header .mobile-nav {
            position: fixed;
            top: ${HEADER_HEIGHT}px;
            left: 0;
            right: 0;
            background: #001a4d;
            padding: 14px 18px;
            border-bottom: 1px solid rgba(255,255,255,0.04);
            z-index: 1200;
          }
          .header .mobile-nav a { display: block; padding: 10px 0; font-weight: 700; }
        }

        .header .nav-link {
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 500;
          transition: color .15s, transform .12s;
          padding: 6px 10px;
          border-radius: 6px;
        }

        .header .nav-link:hover { transform: translateY(-1px); color: #60a5fa; }
        .header .nav-link.active {
          color: #93c5fd;
          background: rgba(255,255,255,0.04);
          font-weight: 700;
        }
      `}</style>

      {/* top background strip to avoid content jump */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_HEIGHT,
          background: '#001a4d',
          zIndex: 1080,
        }}
      />

      <header
        className="header"
        style={{
          background: '#001a4d',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          height: HEADER_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.02)'
        }}
      >
        <div
          className="header-content"
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.25rem',
            height: '100%'
          }}
        >
          {/* Logo Section */}
          <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => { navigate('/'); setTimeout(() => scrollToId('beranda'), 120); }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label="Kembali ke beranda"
            >
              {!logoFailed ? (
                <img
                  src={logoSrc}
                  alt="Smart School"
                  onError={handleLogoError}
                  style={{
                    height: 40,
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              ) : (
                <div style={{
                  height: 40,
                  width: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#ffffff',
                  borderRadius: 4,
                  fontWeight: 800,
                  color: '#001a4d',
                  fontSize: '1.25rem'
                }}>S</div>
              )}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav
            className="nav-menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              flex: 1,
              justifyContent: 'center'
            }}
            aria-label="Menu utama"
          >
            {sections.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className={`nav-link ${activeId === id ? 'active' : ''}`}
                onClick={handleNavClick(id)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleNavClick(id)(e); }}
                role="link"
                aria-current={activeId === id ? 'true' : undefined}
                style={{ whiteSpace: 'nowrap' }}
              >
                {id === 'beranda' ? 'Beranda' : id === 'profil' ? 'Profil' : id === 'galeri' ? 'Galeri' : 'Pengumuman'}
              </a>
            ))}
          </nav>

          {/* Mobile toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              ☰
            </button>

            {/* User Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {user ? (
                <>
                  <div style={{ color: '#ffffff', fontWeight: 500, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                    Halo, {username}
                  </div>
                  <button
                    onClick={onLogoutClick}
                    style={{
                      background: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.45rem 0.95rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    KELUAR
                  </button>
                </>
              ) : (
                <button
                  onClick={onLoginClick}
                  style={{
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  MASUK
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile nav menu (simple) */}
        {mobileOpen && (
          <div id="mobile-nav" className="mobile-nav" role="navigation" aria-label="Menu seluler">
            {sections.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => { handleNavClick(id)(e); setMobileOpen(false); }}
                style={{ display: 'block', color: '#fff', fontWeight: activeId === id ? 800 : 600 }}
              >
                {id === 'beranda' ? 'Beranda' : id === 'profil' ? 'Profil' : id === 'galeri' ? 'Galeri' : 'Pengumuman'}
              </a>
            ))}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
