// src/components/PengumumanDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import "./pengumumandetail.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function PengumumanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    // enforce login for reading detail (same behavior as NewsDetail in your app)
    if (!user) {
      navigate("/login", { state: { from: `/pengumuman/${id}` } });
      return;
    }

    let mounted = true;
    setLoading(true);
    setErr(null);

    fetch(`${API_BASE}/api/pengumuman/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setItem(data);
      })
      .catch((e) => {
        console.error("fetch pengumuman detail err", e);
        if (mounted) setErr("Gagal memuat pengumuman");
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [id, navigate, user]);

  // Redirecting to login, avoid flicker
  if (!user) return null;

  // Loading State
  if (loading) {
    return (
      <div className="pengumuman-detail-container">
        <div className="pengumuman-detail-wrapper">
          <div className="pengumuman-detail-loading">
            <div className="pengumuman-loading-spinner"></div>
            <div>Memuat pengumuman...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (err) {
    return (
      <div className="pengumuman-detail-container">
        <div className="pengumuman-detail-wrapper">
          <div className="pengumuman-detail-error">
            <div className="pengumuman-detail-error-icon">⚠️</div>
            <div>{err}</div>
          </div>
          <div className="pengumuman-detail-actions">
            <button 
              className="btn-pengumuman-back" 
              onClick={() => navigate(-1)}
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!item) {
    return (
      <div className="pengumuman-detail-container">
        <div className="pengumuman-detail-wrapper">
          <div className="pengumuman-detail-not-found">
            <div className="pengumuman-not-found-icon">📢</div>
            <div className="pengumuman-not-found-text">
              Pengumuman tidak ditemukan
            </div>
          </div>
          <div className="pengumuman-detail-actions">
            <button 
              className="btn-pengumuman-back" 
              onClick={() => navigate(-1)}
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Content
  return (
    <div className="pengumuman-detail-container">
      <div className="pengumuman-detail-wrapper">
        {/* Badge/Label */}
        <div className="pengumuman-detail-badge">
          Pengumuman Resmi
        </div>

        {/* Header Section */}
        <div className="pengumuman-detail-header">
          <h1 className="pengumuman-detail-title">{item.title}</h1>
          <div className="pengumuman-detail-meta">
            {item.created_at 
              ? new Date(item.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Tanggal tidak tersedia'
            }
          </div>
        </div>

        {/* Info Box (Optional) */}
        {item.priority && (
          <div className="pengumuman-info-box">
            <div className="pengumuman-info-box-title">
              Pengumuman Penting
            </div>
            <div className="pengumuman-info-box-content">
              Mohon perhatian khusus untuk pengumuman ini.
            </div>
          </div>
        )}

        {/* Content Section */}
        <div 
          className="pengumuman-detail-content" 
          dangerouslySetInnerHTML={{ __html: item.description || '<p>Tidak ada konten</p>' }} 
        />

        {/* Actions Section */}
        <div className="pengumuman-detail-actions">
          <button 
            className="btn-pengumuman-back" 
            onClick={() => navigate(-1)}
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}