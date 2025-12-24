// src/components/Headmaster.jsx
import React, { useEffect, useState } from 'react';
import './Headmaster.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function Headmaster() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${API_BASE}/api/headmaster`)
      .then(res => {
        if (res.status === 404) throw new Error('Belum ada sambutan kepala sekolah');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(d => { if (mounted) setData(d); })
      .catch(e => { 
        console.error('fetch headmaster err', e); 
        if (mounted) setErr(e.message || 'Gagal memuat'); 
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="headmaster-container">
        <div className="headmaster-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>Memuat sambutan...</div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="headmaster-container">
        <div className="headmaster-content">
          <div style={{ textAlign: 'center', padding: '2rem', color: '#e53e3e' }}>{err}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="headmaster-container">
        <div className="headmaster-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>Belum ada sambutan.</div>
        </div>
      </div>
    );
  }

  // Split greeting into paragraphs for better layout
  const paragraphs = data.greeting ? data.greeting.split('\n').filter(p => p.trim()) : [];

  return (
    <div className="headmaster-container">
      <div className="headmaster-content">
        <h1 className="headmaster-title">SAMBUTAN KEPALA SEKOLAH</h1>
        
        <div className="headmaster-layout">
          <div className="headmaster-text">
            {paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="headmaster-image-section">
            {data.photo_url ? (
              <img 
                src={data.photo_url} 
                alt="Kepala Sekolah" 
                className="headmaster-image"
              />
            ) : (
              <div style={{ 
                width: '100%', 
                maxWidth: '300px', 
                height: '300px', 
                background: '#e0e0e0', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999'
              }}>
                Foto tidak tersedia
              </div>
            )}
            
            <div className="headmaster-info">
              <div className="headmaster-name">{data.name || 'Kepala Sekolah'}</div>
              <div className="headmaster-title-text">
                Kepala Sekolah SMK Negeri 1 Terusan
              </div>
            </div>
          </div>
        </div>

        <div className="headmaster-footer">
          @smartschool - All Right Reserved u/smartsch.ul
        </div>
      </div>
    </div>
  );
}