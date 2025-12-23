// src/components/Visi.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Visi() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // use Vite env (same as LandingPage)
  const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  // helper to build image url when backend returns image_path instead of full url
  function imageUrlFor(item, key) {
    if (!item) return null;
    // prefer explicit *_image_url property
    if (item[`${key}_image_url`]) return item[`${key}_image_url`];
    // fallback to path fields (vision_image_path etc)
    const path = item[`${key}_image_path`] || item[`${key}_path`] || null;
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${apiBase}${p}`;
  }

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);

    axios.get(`${apiBase}/api/profile`)
      .then(res => {
        if (!mounted) return;
        setProfile(res.data);
      })
      .catch(error => {
        console.error("fetch profile err", error);
        if (error.response && error.response.status === 404) {
          setProfile(null); // no profile
        } else {
          setErr("Gagal memuat profil");
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [apiBase]);

  if (loading) return <div className="p-6">Memuat...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  if (!profile) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold">Visi & Misi</h2>
        <p className="mt-3 text-muted">Belum ada informasi visi & misi.</p>
      </div>
    );
  }

  // build safe image urls (works with either *_image_url or *_image_path)
  const visionImg = imageUrlFor(profile, 'vision') || profile.vision_image_url || profile.vision_image_path;
  const missionImg = imageUrlFor(profile, 'mission') || profile.mission_image_url || profile.mission_image_path;
  const coreImg = imageUrlFor(profile, 'core_values') || profile.core_values_image_url || profile.core_values_image_path;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4" style={{ color: '#1e5ba8' }}>VISI, MISI dan VALUES</h1>

      {/* Visi block */}
      <div className="p-5 rounded-lg mb-6" style={{
        background: "linear-gradient(135deg, rgba(30,91,168,0.03), rgba(243,156,18,0.01))",
        border: "1px solid rgba(30,91,168,0.04)"
      }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h2 style={{ color: '#1e5ba8', fontWeight: 800 }}>VISI KAMI</h2>
            <p style={{ marginTop: 8, color: '#334155', whiteSpace: 'pre-wrap' }}>
              {profile.vision || '-'}
            </p>
          </div>

          {visionImg && (
            <div style={{ width: 190, flexShrink: 0 }}>
              <img src={visionImg} alt="Visi" style={{ width: '100%', borderRadius: 12, objectFit: 'cover', boxShadow: '0 8px 20px rgba(2,6,23,0.06)' }} />
            </div>
          )}
        </div>
      </div>

      {/* Misi + Values: two-column */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="p-5 rounded-lg" style={{ background: '#fff', border: '1px solid rgba(2,6,23,0.04)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#3498db', fontWeight: 800 }}>MISI KAMI</h3>
              <p style={{ marginTop: 8, color: '#334155', whiteSpace: 'pre-wrap' }}>{profile.mission || '-'}</p>
            </div>
            {missionImg && (
              <div style={{ width: 140, flexShrink: 0 }}>
                <img src={missionImg} alt="Misi" style={{ width: '100%', borderRadius: 8, objectFit: 'cover', boxShadow: '0 8px 18px rgba(2,6,23,0.04)' }} />
              </div>
            )}
          </div>
        </div>

        <div className="p-5 rounded-lg" style={{ background: '#fff', border: '1px solid rgba(2,6,23,0.04)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#f39c12', fontWeight: 800 }}>VALUES KAMI</h3>
              <div style={{ marginTop: 8, color: '#334155', whiteSpace: 'pre-wrap' }}>
                {profile.core_values ? profile.core_values.split("\n").map((line, i) => <div key={i} style={{ marginBottom: 8 }}><strong style={{ color: '#0b2540' }}>• </strong><span>{line}</span></div>) : <p>-</p>}
              </div>
            </div>
            {coreImg && (
              <div style={{ width: 140, flexShrink: 0 }}>
                <img src={coreImg} alt="Values" style={{ width: '100%', borderRadius: 8, objectFit: 'cover', boxShadow: '0 8px 18px rgba(2,6,23,0.04)' }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <small style={{ color: '#94a3b8' }}>@smartschool.id - All Right Reserved</small>
      </div>
    </div>
  );
}
