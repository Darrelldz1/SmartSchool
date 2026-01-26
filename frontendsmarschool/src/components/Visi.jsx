import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import Header, { HEADER_HEIGHT } from './Header';
import Footer from './Footer';
import "./Visi.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function imageUrlFor(item, key, apiBase = API_BASE) {
  if (!item) return null;
  if (item[`${key}_image_url`]) return item[`${key}_image_url`];
  const path = item[`${key}_image_path`] || item[`${key}_path`] || null;
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${apiBase}${p}`;
}

export default function Visi() {
  const navigate = useNavigate();
  const { user, logout } = useAuth() || {};
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [headerHeight] = useState(HEADER_HEIGHT);

  const goHome = (e) => { e?.preventDefault(); navigate('/'); window.scrollTo(0,0); };
  const goProfil = (e) => { e?.preventDefault(); navigate('/sekolah'); };
  const goGaleri = (e) => { e?.preventDefault(); navigate('/gallery'); };
  const goPengumuman = (e) => { e?.preventDefault(); navigate('/pengumuman'); };
  const onLoginClick = () => navigate('/login');
  const onLogoutClick = () => { logout && logout(); navigate('/'); };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);

    axios.get(`${API_BASE}/api/profile`)
      .then(res => { if (!mounted) return; setProfile(res.data); })
      .catch(error => {
        console.error("fetch profile err", error);
        if (error.response && error.response.status === 404) setProfile(null);
        else setErr("Gagal memuat profil");
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  if (loading) return (
    <>
      <Header />
      <div style={{ height: headerHeight }} />
      <div style={{ minHeight: '60vh', paddingTop: 20 }}>
        <div className="visi-loading">Memuat...</div>
      </div>
      <Footer />
    </>
  );

  if (err) return (
    <>
      <Header />
      <div style={{ height: headerHeight }} />
      <div style={{ minHeight: '60vh', paddingTop: 20 }}>
        <div className="visi-error">{err}</div>
      </div>
      <Footer />
    </>
  );

  const defaultVision = "Menjadi sekolah unggulan yang menghasilkan lulusan berkualitas, berakhlak mulia, dan berdaya saing tinggi di era global.";
  const defaultMission = "Menyelenggarakan pendidikan bermutu, pengembangan karakter, serta pembelajaran yang inovatif untuk mengembangkan potensi siswa.";
  const defaultValues = "Integritas, Disiplin, Kreativitas, Kerja Sama, dan Tanggung Jawab.";

  const visionImg = imageUrlFor(profile, 'vision') || '/images/vision-badge.png';
  const missionImg = imageUrlFor(profile, 'mission') || '/images/mission-badge.png';
  const valuesImg = imageUrlFor(profile, 'core_values') || '/images/values-badge.png';

  return (
    <div className="visi-container" style={{ background: '#e5e7eb', minHeight: '100vh' }}>
      <Header />
      <div style={{ height: headerHeight }} />

      <div className="visi-content" style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
        <h1 className="visi-main-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>VISI, MISI dan VALUES</h1>

        <div className="visi-section visi-section-full" style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <h2 className="visi-title">VISI KAMI</h2>
              <p className="visi-description">{profile?.vision || defaultVision}</p>
            </div>
            <div style={{ width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={visionImg} alt="Vision" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 999 }} />
            </div>
          </div>
        </div>

        <div className="visi-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="visi-section" style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h2 className="visi-title mission-title">MISI KAMI</h2>
                <p className="visi-description">{profile?.mission || defaultMission}</p>
              </div>
              <div style={{ width: 96, height: 96 }}>
                <img src={missionImg} alt="Mission" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
              </div>
            </div>
          </div>

          <div className="visi-section" style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h2 className="visi-title values-title">VALUES KAMI</h2>
                <div className="visi-description">
                  {profile?.core_values ? profile.core_values.split("\n").map((line, i) => <div key={i} style={{ marginBottom: 6 }}>• {line}</div>) : <p>{defaultValues}</p>}
                </div>
              </div>
              <div style={{ width: 96, height: 96 }}>
                <img src={valuesImg} alt="Values" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, color: '#6b7280' }}>
          @smartschool.id - All Right Reserved citraschul.id
        </div>
      </div>

      <Footer />
    </div>
  );
}
