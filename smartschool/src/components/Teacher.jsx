// src/components/Teacher.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./teacherlist.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function imageUrlFor(item) {
  if (!item) return null;
  if (item.photo_url) return item.photo_url;
  const path = item.photo || item.image || item.photo_path || null;
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function Teacher() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);

    fetch(`${API_BASE}/api/teacher`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setTeachers(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        console.error("fetch teachers err", e);
        if (mounted) setErr("Gagal memuat daftar guru");
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  const openDetail = (t) => {
    setSelected(t);
    setModalOpen(true);
  };

  const closeDetail = () => {
    setModalOpen(false);
    setSelected(null);
  };

  return (
    <div className="teacher-container">
      <div className="teacher-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Profil Tenaga Guru dan Pendidik</h1>
          <button onClick={() => navigate("/")} className="back-button">
            Kembali
          </button>
        </div>
      </div>

      {loading ? (
        <div className="teacher-loading">Memuat daftar guru...</div>
      ) : err ? (
        <div className="teacher-error">{err}</div>
      ) : teachers.length === 0 ? (
        <div className="teacher-empty">Belum ada data guru.</div>
      ) : (
        <div className="teacher-grid">
          {teachers.map((t) => (
            <div 
              key={t.id} 
              className="teacher-card"
              onClick={() => openDetail(t)}
              style={{ cursor: "pointer" }}
            >
              <div className="teacher-avatar">
                {imageUrlFor(t) ? (
                  <img src={imageUrlFor(t)} alt={t.name} />
                ) : (
                  <div className="teacher-avatar-placeholder">
                    {getInitials(t.name)}
                  </div>
                )}
              </div>

              <div className="teacher-info">
                <div className="teacher-info-item" style={{ gridColumn: "1 / -1" }}>
                  <div className="teacher-info-label">Nama Lengkap</div>
                  <div className="teacher-info-value highlight">{t.name || "—"}</div>
                </div>

                <div className="teacher-info-item">
                  <div className="teacher-info-label">NIP/No. Pegawai</div>
                  <div className="teacher-info-value">{t.nip || "—"}</div>
                </div>

                <div className="teacher-info-item">
                  <div className="teacher-info-label">Tanggal Masuk</div>
                  <div className="teacher-info-value">
                    {t.date_joined ? new Date(t.date_joined).toLocaleDateString("id-ID") : "—"}
                  </div>
                </div>

                <div className="teacher-info-item">
                  <div className="teacher-info-label">Jabatan</div>
                  <div className="teacher-info-value">{t.position || "—"}</div>
                </div>

                <div className="teacher-info-item">
                  <div className="teacher-info-label">Mata Pelajaran</div>
                  <div className="teacher-info-value">{t.subject || "—"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal detail */}
      {modalOpen && selected && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selected.name}</h2>
              <button onClick={closeDetail} className="close-button">
                Tutup
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
                <div className="teacher-avatar" style={{ width: 180, height: 180 }}>
                  {imageUrlFor(selected) ? (
                    <img src={imageUrlFor(selected)} alt={selected.name} />
                  ) : (
                    <div className="teacher-avatar-placeholder" style={{ fontSize: "4rem" }}>
                      {getInitials(selected.name)}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-detail-grid">
                <div className="modal-detail-item">
                  <div className="modal-detail-label">Nama Lengkap</div>
                  <div className="modal-detail-value">{selected.name || "—"}</div>
                </div>

                <div className="modal-detail-item">
                  <div className="modal-detail-label">NIP/No. Pegawai</div>
                  <div className="modal-detail-value">{selected.nip || "—"}</div>
                </div>

                <div className="modal-detail-item">
                  <div className="modal-detail-label">Jabatan</div>
                  <div className="modal-detail-value">{selected.position || "—"}</div>
                </div>

                <div className="modal-detail-item">
                  <div className="modal-detail-label">Mata Pelajaran</div>
                  <div className="modal-detail-value">{selected.subject || "—"}</div>
                </div>

                <div className="modal-detail-item">
                  <div className="modal-detail-label">Tanggal Bergabung</div>
                  <div className="modal-detail-value">
                    {selected.date_joined ? new Date(selected.date_joined).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long", 
                      year: "numeric"
                    }) : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}