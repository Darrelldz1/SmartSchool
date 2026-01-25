import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import Header, { HEADER_HEIGHT } from './Header';
import Footer from './Footer';
import './program.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function Programs() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const headerHeight = HEADER_HEIGHT;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${API_BASE}/api/program`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setPrograms(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        console.error('fetch programs err', e);
        if (mounted) setErr('Gagal memuat program');
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const buildImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    const path = image.startsWith('/') ? image : `/${image}`;
    return `${API_BASE}${path}`;
  };

  const onLoginClick = () => navigate('/login');
  const onLogoutClick = () => { logout && logout(); navigate('/'); };

  return (
    <div className="programs-page" style={{ backgroundColor: '#f8fafc' }}>
      <Header />
      <div style={{ height: headerHeight }} />

      <div className="programs-container">
        <div className="programs-wrapper">
          <div className="programs-header">
            <h1>Program Unggulan</h1>
          </div>

          {loading ? (
            <div className="programs-loading-state">
              <div className="programs-loading-spinner"></div>
              <p>Memuat program unggulan...</p>
            </div>
          ) : err ? (
            <div className="programs-error-state">
              <div className="programs-error-icon">⚠️</div>
              <p className="programs-error-text">{err}</p>
            </div>
          ) : programs.length === 0 ? (
            <div className="programs-empty-state">
              <div className="programs-empty-icon">📚</div>
              <div className="programs-empty-text">Belum ada program</div>
              <div className="programs-empty-subtext">Program unggulan belum tersedia</div>
            </div>
          ) : (
            <div className="programs-grid">
              {programs.map((p) => (
                <div key={p.id} className="program-card">
                  <div className="program-image-container">
                    {p.image ? (
                      <img src={buildImageUrl(p.image)} alt={p.title} className="program-image" />
                    ) : (
                      <div className="program-image-placeholder">Tidak ada gambar</div>
                    )}
                  </div>

                  <div className="program-content">
                    <h3 className="program-title">{p.title}</h3>
                    <p className="program-description">{p.description || 'Deskripsi tidak tersedia'}</p>

                    <div className="program-action">
                      <button onClick={() => navigate(`/programs/${p.id}`)} className="program-detail-button">Lihat Detail</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
