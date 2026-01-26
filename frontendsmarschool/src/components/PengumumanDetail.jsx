import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Header from './Header';  // Import Header
import Footer from './Footer';  // Import Footer
import "./pengumumandetail.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function PengumumanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // fetch pengumuman
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);

    fetch(`${API_BASE}/api/pengumuman/${id}`)
      .then((res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setItem(data || null);
      })
      .catch((e) => {
        console.error("fetch pengumuman detail err", e);
        if (mounted) setErr("Gagal memuat pengumuman");
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [id]);

  // Loading
  if (loading) {
    return (
      <>
        <Header />
        <div style={{ height: '60px' }} />

        <div className="pengumuman-detail-container">
          <div className="pengumuman-detail-wrapper">
            <div className="pengumuman-detail-loading">
              <div className="pengumuman-loading-spinner" />
              <div>Memuat pengumuman...</div>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // Error
  if (err) {
    return (
      <>
        <Header />
        <div style={{ height: '60px' }} />

        <div className="pengumuman-detail-container">
          <div className="pengumuman-detail-wrapper">
            <div className="pengumuman-detail-error">
              <div className="pengumuman-detail-error-icon">⚠️</div>
              <div>{err}</div>
            </div>
            <div className="pengumuman-detail-actions">
              <button className="btn-pengumuman-back" onClick={() => navigate(-1)}>Kembali</button>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // Not found
  if (!item) {
    return (
      <>
        <Header />
        <div style={{ height: '60px' }} />

        <div className="pengumuman-detail-container">
          <div className="pengumuman-detail-wrapper">
            <div className="pengumuman-detail-not-found">
              <div className="pengumuman-not-found-icon">📢</div>
              <div className="pengumuman-not-found-text">Pengumuman tidak ditemukan</div>
            </div>
            <div className="pengumuman-detail-actions">
              <button className="btn-pengumuman-back" onClick={() => navigate(-1)}>Kembali</button>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // Main content
  return (
    <>
      <Header />
      <div style={{ height: '60px' }} />

      <div className="pengumuman-detail-container">
        <div className="pengumuman-detail-wrapper">
          <div className="pengumuman-detail-badge">Pengumuman Resmi</div>

          <div className="pengumuman-detail-header">
            <h1 className="pengumuman-detail-title">{item.title}</h1>
            <div className="pengumuman-detail-meta">
              {item.created_at
                ? new Date(item.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })
                : 'Tanggal tidak tersedia'
              }
            </div>
          </div>

          {item.priority && (
            <div className="pengumuman-info-box">
              <div className="pengumuman-info-box-title">Pengumuman Penting</div>
              <div className="pengumuman-info-box-content">Mohon perhatian khusus untuk pengumuman ini.</div>
            </div>
          )}

          <div className="pengumuman-detail-content" dangerouslySetInnerHTML={{ __html: item.description || '<p>Tidak ada konten</p>' }} />

          <div className="pengumuman-detail-actions">
            <button className="btn-pengumuman-back" onClick={() => navigate(-1)}>Kembali</button>

            {user && (user.role === 'admin' || user.role === 'guru') && (
              <button className="btn-pengumuman-edit" onClick={() => navigate(`/admin/pengumuman/${item.id}/edit`)} style={{ marginLeft: 12 }}>
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}