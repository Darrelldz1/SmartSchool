import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../auth/AuthProvider';
import Header, { HEADER_HEIGHT } from './Header';
import Footer from './Footer';
import "./sejarah.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Sekolah() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [headerHeight] = useState(HEADER_HEIGHT);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);

    axios
      .get(`${API_BASE}/api/history`)
      .then((res) => {
        if (!mounted) return;
        setHistory(res.data || null);
      })
      .catch((error) => {
        console.error("fetch history err", error);
        if (error.response && error.response.status === 404) {
          if (mounted) setHistory(null);
        } else {
          if (mounted) setErr("Gagal memuat tentang sekolah");
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ height: headerHeight }} />

        <div className="sejarah-container">
          <div className="sejarah-wrapper">
            <div className="sejarah-loading-state">
              <div className="sejarah-loading-spinner"></div>
              <p>Memuat informasi sekolah...</p>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  if (err) {
    return (
      <>
        <Header />
        <div style={{ height: headerHeight }} />

        <div className="sejarah-container">
          <div className="sejarah-wrapper">
            <div className="sejarah-error-state">
              <div className="sejarah-error-icon">⚠️</div>
              <p className="sejarah-error-text">{err}</p>
              <div style={{ marginTop: 12 }}>
                <button className="btn-outline" onClick={() => window.location.reload()}>Muat ulang</button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ height: headerHeight }} />

      <div className="sejarah-container">
        <div className="sejarah-wrapper">
          <div className="sejarah-header">
            <h1>Tentang Sekolah</h1>
          </div>

          {!history ? (
            <div className="sejarah-empty-state">
              <div className="sejarah-empty-icon">🏫</div>
              <div className="sejarah-empty-text">Belum ada informasi</div>
              <div className="sejarah-empty-subtext">Informasi tentang sekolah belum tersedia</div>
              {user && user.role === 'admin' && (
                <div style={{ marginTop: 12 }}>
                  <button className="btn-primary" onClick={() => navigate('/admin/edit-sejarah')}>Tambah / Edit Informasi</button>
                </div>
              )}
            </div>
          ) : (
            <div className="sejarah-content-card">
              <p className="sejarah-description" dangerouslySetInnerHTML={{ __html: history.description || '' }} />
              <div className="sejarah-timestamp">
                Diperbarui:{" "}
                {history.updated_at
                  ? formatDate(history.updated_at)
                  : history.created_at
                  ? formatDate(history.created_at)
                  : "-"}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
