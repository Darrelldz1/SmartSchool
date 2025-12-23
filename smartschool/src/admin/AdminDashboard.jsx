// src/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth() || {}; // jika useAuth menyediakan token (atau undefined)
  const [counts, setCounts] = useState({
    visi: 0,
    sejarah: 0,
    news: 0,
    gallery: 0,
    pengumuman: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Helper: create headers if token exists
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAll() {
    setLoading(true);
    setErr(null);

    try {
      // try to fetch news and gallery (these are known endpoints)
      const pNews = axios.get("http://localhost:5000/api/news", { headers: authHeaders }).catch(e => ({ error: e }));
      const pGallery = axios.get("http://localhost:5000/api/gallery", { headers: authHeaders }).catch(e => ({ error: e }));

      // optional endpoints (visi, sejarah, pengumuman) - if not available we ignore errors
      const pVisi = axios.get("http://localhost:5000/api/visi", { headers: authHeaders }).catch(() => ({ error: true }));
      const pSejarah = axios.get("http://localhost:5000/api/sejarah", { headers: authHeaders }).catch(() => ({ error: true }));
      const pPengumuman = axios.get("http://localhost:5000/api/pengumuman", { headers: authHeaders }).catch(() => ({ error: true }));

      const [rNews, rGallery, rVisi, rSejarah, rPengumuman] = await Promise.all([pNews, pGallery, pVisi, pSejarah, pPengumuman]);

      const newsData = rNews && !rNews.error ? (Array.isArray(rNews.data) ? rNews.data : []) : [];
      const galleryData = rGallery && !rGallery.error ? (Array.isArray(rGallery.data) ? rGallery.data : []) : [];
      const visiData = rVisi && !rVisi.error ? (Array.isArray(rVisi.data) ? rVisi.data : []) : [];
      const sejarahData = rSejarah && !rSejarah.error ? (Array.isArray(rSejarah.data) ? rSejarah.data : []) : [];
      const pengumumanData = rPengumuman && !rPengumuman.error ? (Array.isArray(rPengumuman.data) ? rPengumuman.data : []) : [];

      setCounts({
        visi: visiData.length || 0,
        sejarah: sejarahData.length || 0,
        news: newsData.length || 0,
        gallery: galleryData.length || 0,
        pengumuman: pengumumanData.length || 0,
      });

      // recent news: take top 5 (assuming API returns desc by created_at)
      setRecent(newsData.slice(0, 5));
    } catch (e) {
      console.error("loadAll err", e);
      setErr("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteNews = async (id) => {
    if (!window.confirm("Hapus berita ini?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/news/${id}`, { headers: authHeaders });
      // reload counts & recent
      await loadAll();
    } catch (e) {
      console.error("delete news err", e);
      alert("Gagal menghapus berita. Cek console.");
    }
  };

  const handleEditNews = (id) => {
    navigate(`/admin/editnews/${id}`);
  };

  const handleViewNews = (id) => {
    navigate(`/news/${id}`);
  };

  if (loading) return <div className="dashboard p-6">Memuat dashboard...</div>;
  if (err) return <div className="dashboard p-6 text-red-600">{err}</div>;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard Admin</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📝</div>
          <div className="stat-content">
            <h3>Visi Misi Value</h3>
            <p className="stat-number">{counts.visi}</p>
          </div>
        </div>



        <div className="stat-card">
          <div className="stat-icon blue">📰</div>
          <div className="stat-content">
            <h3>Berita Sekolah</h3>
            <p className="stat-number">{counts.news}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">🖼️</div>
          <div className="stat-content">
            <h3>Galeri</h3>
            <p className="stat-number">{counts.gallery}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">🔔</div>
          <div className="stat-content">
            <h3>Pengumuman</h3>
            <p className="stat-number">{counts.pengumuman}</p>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h2>Postingan Terbaru</h2>
          <button className="btn-view-all" onClick={() => navigate("/admin/newslist")}>Lihat Semua</button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Judul</th>
              <th>Tanggal</th>
              <th>Penulis</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">Belum ada postingan</td>
              </tr>
            ) : (
              recent.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>{p.title || p.judul}</td>
                  <td>{p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}</td>
                  <td>{p.author || "-"}</td>
                  <td>
                    <span className={`status-badge ${p.published ? "published" : "draft"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action edit" onClick={() => handleEditNews(p.id)}>✏️</button>
                    <button className="btn-action view" onClick={() => handleViewNews(p.id)}>👁️</button>
                    <button className="btn-action delete" onClick={() => handleDeleteNews(p.id)}>🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="quick-actions">
        <h2>Aksi Cepat</h2>
        <div className="actions-grid">
          <button className="action-btn blue" onClick={() => navigate("/admin/createnews")}>
            <span className="action-icon">📝</span>
            <span>Tambah Berita Sekolah</span>
          </button>
          <button className="action-btn orange" onClick={() => navigate("/admin/sejarah")}>
            <span className="action-icon">🏫</span>
            <span>Tambah Sekolah</span>
          </button>
          <button className="action-btn blue" onClick={() => navigate("/admin/gallery")}>
            <span className="action-icon">🖼️</span>
            <span>Upload Galeri</span>
          </button>
        </div>
      </div>
    </div>
  );
}
