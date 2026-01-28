import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import Header, { HEADER_HEIGHT } from './Header';
import Footer from './Footer';
import './Headmaster.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function Headmaster() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const headerHeight = HEADER_HEIGHT;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);

    fetch(`${API_BASE}/api/headmaster`)
      .then((res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((d) => {
        if (!mounted) return;
        setData(d || null);
      })
      .catch((e) => {
        console.error('fetch headmaster err', e);
        if (mounted) setErr(e.message || 'Gagal memuat sambutan kepala sekolah');
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  // navigation helpers
  const goHome = (e) => { e?.preventDefault(); navigate('/'); window.scrollTo(0, 0); };
  const goProfil = (e) => { e?.preventDefault(); navigate('/sekolah'); };
  const goGaleri = (e) => { e?.preventDefault(); navigate('/gallery'); };
  const goPengumuman = (e) => { e?.preventDefault(); navigate('/pengumuman'); };

  const onLoginClick = () => navigate('/login');
  const onLogoutClick = () => { logout && logout(); navigate('/'); };

  const renderBody = () => {
    if (loading) {
      return (
        <div className="headmaster-content">
          <div className="headmaster-loading-state">
            <div className="headmaster-loading-spinner" />
            <p>Memuat sambutan kepala sekolah...</p>
          </div>
        </div>
      );
    }

    if (err) {
      return (
        <div className="headmaster-content">
          <div className="headmaster-error-state">
            <div className="headmaster-error-icon">⚠️</div>
            <p className="headmaster-error-text">{err}</p>
          </div>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="headmaster-content">
          <div className="headmaster-empty-state">
            <div className="headmaster-empty-icon">👨‍💼</div>
            <div className="headmaster-empty-text">Belum ada sambutan</div>
            <div className="headmaster-empty-subtext">Sambutan kepala sekolah belum tersedia</div>
          </div>
        </div>
      );
    }

    const paragraphs = data.greeting ? data.greeting.split('\n').filter(p => p.trim()) : [];

    return (
      <div className="headmaster-content">
        <h1 className="headmaster-title">SAMBUTAN KEPALA SEKOLAH</h1>

        <div className="headmaster-layout">
          <div className="headmaster-text">
            {paragraphs.length > 0 ? paragraphs.map((para, idx) => <p key={idx}>{para}</p>) : <p>Sambutan tidak tersedia.</p>}
          </div>

          <div className="headmaster-image-section">
            {data.photo_url ? (
              <img src={data.photo_url} alt={data.name || 'Kepala Sekolah'} className="headmaster-image" />
            ) : (
              <div className="headmaster-image-placeholder">Foto tidak tersedia</div>
            )}

            <div className="headmaster-info">
              <div className="headmaster-name">{data.name || 'Kepala Sekolah'}</div>
              <div className="headmaster-title-text">Kepala Sekolah SMK Negeri 1 Terusan</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#f8fafc' }}>
      <Header />
      <div style={{ height: headerHeight }} />

      <div className="headmaster-container">
        {renderBody()}
        <div className="headmaster-footer" style={{ marginTop: 24, textAlign: 'center', color: '#6b7280' }}>
          ©@smartschool - All Right Reserved u/smartsch.ul
        </div>
      </div>

      <Footer />
    </div>
  );
}
