// src/components/Listpengumuman.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./listpengumuman.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Listpengumuman() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);

    fetch(`${API_BASE}/api/pengumuman`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        console.error("fetch pengumuman err", e);
        if (mounted) setErr("Gagal memuat pengumuman");
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="pengumuman-list-container">
        <div className="pengumuman-list-wrapper">
          <div className="pengumuman-loading-state">
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
      <div className="pengumuman-list-container">
        <div className="pengumuman-list-wrapper">
          <div className="pengumuman-error-state">
            {err}
          </div>
          <div style={{ marginTop: 20, textAlign: 'center' }}>
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
    <div className="pengumuman-list-container">
      <div className="pengumuman-list-wrapper">
        {/* Header Section */}
        <div className="pengumuman-list-header">
          <h1>Daftar Pengumuman</h1>
          <button 
            className="btn-pengumuman-back" 
            onClick={() => navigate(-1)}
          >
            Kembali
          </button>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="pengumuman-empty-state">
            <div className="pengumuman-empty-icon">📢</div>
            <div className="pengumuman-empty-text">Belum Ada Pengumuman</div>
            <div className="pengumuman-empty-subtext">
              Tidak ada pengumuman yang tersedia saat ini
            </div>
          </div>
        ) : (
          /* Table View */
          <div className="pengumuman-table-wrapper">
            <table className="pengumuman-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Judul</th>
                  <th>Deskripsi</th>
                  <th>Tanggal Dibuat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((pengumuman) => (
                  <tr key={pengumuman.id}>
                    <td>{pengumuman.id}</td>
                    <td>
                      <div className="pengumuman-title">
                        {pengumuman.title}
                      </div>
                    </td>
                    <td>
                      <div className="pengumuman-description-text">
                        {pengumuman.description 
                          ? (pengumuman.description.length > 150 
                              ? pengumuman.description.slice(0, 150) + '...' 
                              : pengumuman.description)
                          : '-'
                        }
                      </div>
                    </td>
                    <td>
                      <div className="pengumuman-date">
                        {pengumuman.created_at 
                          ? new Date(pengumuman.created_at).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '-'
                        }
                      </div>
                    </td>
                    <td>
                      <div className="pengumuman-actions">
                        <button
                          className="btn-pengumuman-edit"
                          onClick={() => navigate(`/pengumuman/${pengumuman.id}`)}
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}