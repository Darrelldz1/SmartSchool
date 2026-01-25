// src/components/ProgramDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header, { HEADER_HEIGHT } from './Header';
import Footer from './Footer';
import './detailprogram.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function ProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);

    fetch(`${API_BASE}/api/program/${id}`)
      .then(res => {
        if (res.status === 404) throw new Error('Program tidak ditemukan');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!mounted) return;
        setProgram(data);
      })
      .catch(e => {
        console.error('fetch program detail err', e);
        if (mounted) setErr(e.message || 'Gagal memuat data');
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [id]);

  const headerHeight = HEADER_HEIGHT;

  const formatUploadDate = (p) => {
    if (!p) return null;
    const dateKeys = ['created_at', 'uploaded_at', 'published_at', 'updated_at'];
    const raw = dateKeys.map(k => p[k]).find(v => v);
    if (!raw) return null;
    const d = new Date(raw);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const imageUrlFor = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    return `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  // --- Loading ---
  if (loading) {
    return (
      <>
        <Header />
        <div style={{ height: headerHeight }} />
        <div className="program-detail-container">
          <div className="program-detail-wrapper">
            <div className="program-detail-loading">
              <div className="program-loading-spinner" />
              <div>Memuat detail program...</div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // --- Error ---
  if (err) {
    return (
      <>
        <Header />
        <div style={{ height: headerHeight }} />
        <div className="program-detail-container">
          <div className="program-detail-wrapper">
            <div className="program-detail-error">
              {err}
            </div>
            <div className="program-detail-back-section" style={{ marginTop: '20px' }}>
              <button onClick={() => navigate(-1)} className="btn-program-back">
                Kembali
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // --- Not found ---
  if (!program) {
    return (
      <>
        <Header />
        <div style={{ height: headerHeight }} />
        <div className="program-detail-container">
          <div className="program-detail-wrapper">
            <div className="program-detail-not-found">
              <div className="program-not-found-icon">📚</div>
              <div className="program-not-found-text">Program Tidak Ditemukan</div>
              <div className="program-not-found-subtext">Program yang Anda cari tidak tersedia</div>
            </div>
            <div className="program-detail-back-section" style={{ marginTop: '20px' }}>
              <button onClick={() => navigate(-1)} className="btn-program-back">
                Kembali
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // --- Success ---
  const imageUrl = imageUrlFor(program.image);
  const uploadedAtFormatted = formatUploadDate(program);

  return (
    <>
      <Header />
      <div style={{ height: headerHeight }} />

      <div className="program-detail-container">
        <div className="program-detail-wrapper">
          <div className="program-detail-back-section">
            <button onClick={() => navigate(-1)} className="btn-program-back">Kembali</button>
          </div>

          <div className="program-detail-badge">Program Unggulan</div>

          <div className="program-detail-header">
            <h1 className="program-detail-title">{program.title}</h1>
            {uploadedAtFormatted && (
              <div className="program-detail-upload-date" style={{ marginTop: 8, color: '#6b7280', fontSize: '0.95rem' }}>
                Diunggah: {uploadedAtFormatted}
              </div>
            )}
          </div>

          {imageUrl ? (
            <div className="program-detail-image-wrapper">
              <img src={imageUrl} alt={program.title} className="program-detail-image" />
            </div>
          ) : (
            <div className="program-detail-image-wrapper">
              <div className="program-detail-image-placeholder">📚</div>
            </div>
          )}

          <div className="program-detail-content">
            {program.description || 'Tidak ada deskripsi tersedia.'}
          </div>

          {program.additionalInfo && (
            <div className="program-info-box">
              <div className="program-info-box-title">Informasi Tambahan</div>
              <div className="program-info-box-content">{program.additionalInfo}</div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
