// src/components/Visi.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Visi.css";

export default function Visi() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  function imageUrlFor(item, key) {
    if (!item) return null;
    if (item[`${key}_image_url`]) return item[`${key}_image_url`];
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
          setProfile(null);
        } else {
          setErr("Gagal memuat profil");
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [apiBase]);

  if (loading) return <div className="visi-loading">Memuat...</div>;
  if (err) return <div className="visi-error">{err}</div>;

  // Default placeholder text if no profile data
  const defaultVision = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed d incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in elit, sed d incididunt ut labore incididunt ut dolore aliqua incididunt ut labore ex dolore magna amet, consectetur adipiscing elit, sed d incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in elit, sed d venmod tempor incididunt ut labore et dolore aliqua.";
  
  const defaultMission = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed d incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in elit, sed d euismod tempor incididunt ut labore et dolore aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed d incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in elit, sed d euismod tempor incididunt ut labore et dolore aliqua.";
  
  const defaultValues = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed d incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in elit, sed d euismod tempor incididunt ut labore ex dolore aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed d incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in elit, sed d euismod tempor incididunt ut labore et dolore aliqua.";

  const visionImg = imageUrlFor(profile, 'vision') || '/images/vision-badge.png';
  const missionImg = imageUrlFor(profile, 'mission') || '/images/mission-badge.png';
  const valuesImg = imageUrlFor(profile, 'core_values') || '/images/values-badge.png';

  return (
    <div className="visi-container">
      <div className="visi-content">
        <h1 className="visi-main-title">VISI, MISI dan VALUES</h1>
        
        {/* Combined Container */}
        <div className="visi-combined-container">
          {/* Vision Section */}
          <div className="visi-section-inner visi-section-full">
            <div className="visi-section-content">
              <div className="visi-text-content">
                <h2 className="visi-title">VISI KAMI</h2>
                <p className="visi-description">
                  {profile?.vision || defaultVision}
                </p>
              </div>
              <div className="visi-image-wrapper">
                <div className="visi-badge-circle orange-badge">
                  <div className="badge-text">Vision</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission and Values Grid */}
          <div className="visi-grid">
            {/* Mission Section */}
            <div className="visi-section-inner">
              <div className="visi-section-content">
                <div className="visi-text-content">
                  <h2 className="visi-title mission-title">MISI KAMI</h2>
                  <p className="visi-description">
                    {profile?.mission || defaultMission}
                  </p>
                </div>
                <div className="visi-image-wrapper">
                  <div className="visi-badge-circle blue-badge">
                    <div className="badge-icon">📋</div>
                    <div className="badge-text-small">Mission</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="visi-section-inner">
              <div className="visi-section-content">
                <div className="visi-text-content">
                  <h2 className="visi-title values-title">VALUES KAMI</h2>
                  <div className="visi-description">
                    {profile?.core_values ? (
                      profile.core_values.split("\n").map((line, i) => (
                        <div key={i} className="value-item">
                          <span className="value-bullet">• </span>
                          <span>{line}</span>
                        </div>
                      ))
                    ) : (
                      <p>{defaultValues}</p>
                    )}
                  </div>
                </div>
                <div className="visi-image-wrapper">
                  <div className="visi-badge-stamp">
                    <div className="stamp-star">★</div>
                    <div className="stamp-text">BEST VALUES</div>
                    <div className="stamp-stars">★★★</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="visi-footer">
          @smartschool.id - All Right Reserved citraschul.id
        </div>
      </div>
    </div>
  );
}