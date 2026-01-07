import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import "./AdminDashboard.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth() || {}; // jika useAuth menyediakan token (atau undefined)
  const [counts, setCounts] = useState({
    visi: 0,
    sejarah: 0,
    news: 0,
    gallery: 0,
    pengumuman: 0,
    teacher: 0,
    headmaster: 0,
    program: 0,
    siswa: 0,
    prestasi: 0,
  });
  const [recent, setRecent] = useState({
    news: [],
    teachers: [],
    prestasi: [],
    programs: []
  });
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
      // core endpoints
      const pNews = axios.get(`${API_BASE}/api/news`, { headers: authHeaders }).catch(e => ({ error: e }));
      const pGallery = axios.get(`${API_BASE}/api/gallery`, { headers: authHeaders }).catch(e => ({ error: e }));
      const pVisi = axios.get(`${API_BASE}/api/visi`, { headers: authHeaders }).catch(() => ({ error: true }));
      const pSejarah = axios.get(`${API_BASE}/api/history`, { headers: authHeaders }).catch(() => ({ error: true }));
      const pPengumuman = axios.get(`${API_BASE}/api/pengumuman`, { headers: authHeaders }).catch(() => ({ error: true }));

      // new admin-related endpoints
      const pTeacher = axios.get(`${API_BASE}/api/teacher`, { headers: authHeaders }).catch(() => ({ error: true }));
      const pHeadmaster = axios.get(`${API_BASE}/api/headmaster`, { headers: authHeaders }).catch(() => ({ error: true }));
      const pProgram = axios.get(`${API_BASE}/api/program`, { headers: authHeaders }).catch(() => ({ error: true }));
      const pSiswa = axios.get(`${API_BASE}/api/siswa`, { headers: authHeaders }).catch(() => ({ error: true }));
      const pPrestasi = axios.get(`${API_BASE}/api/prestasi`, { headers: authHeaders }).catch(() => ({ error: true }));

      const [
        rNews, rGallery, rVisi, rSejarah, rPengumuman,
        rTeacher, rHeadmaster, rProgram, rSiswa, rPrestasi
      ] = await Promise.all([
        pNews, pGallery, pVisi, pSejarah, pPengumuman,
        pTeacher, pHeadmaster, pProgram, pSiswa, pPrestasi
      ]);

      const newsData = rNews && !rNews.error ? (Array.isArray(rNews.data) ? rNews.data : []) : [];
      const galleryData = rGallery && !rGallery.error ? (Array.isArray(rGallery.data) ? rGallery.data : []) : [];
      const visiData = rVisi && !rVisi.error ? (Array.isArray(rVisi.data) ? rVisi.data : (rVisi.data ? [rVisi.data] : [])) : [];
      const sejarahData = rSejarah && !rSejarah.error ? (Array.isArray(rSejarah.data) ? rSejarah.data : (rSejarah.data ? [rSejarah.data] : [])) : [];
      const pengumumanData = rPengumuman && !rPengumuman.error ? (Array.isArray(rPengumuman.data) ? rPengumuman.data : []) : [];

      const teacherData = rTeacher && !rTeacher.error ? (Array.isArray(rTeacher.data) ? rTeacher.data : []) : [];
      const headmasterData = rHeadmaster && !rHeadmaster.error ? rHeadmaster.data : null; // single object or null
      const programData = rProgram && !rProgram.error ? (Array.isArray(rProgram.data) ? rProgram.data : []) : [];
      const siswaData = rSiswa && !rSiswa.error ? (Array.isArray(rSiswa.data) ? rSiswa.data : []) : [];
      const prestasiData = rPrestasi && !rPrestasi.error ? (Array.isArray(rPrestasi.data) ? rPrestasi.data : []) : [];

      setCounts({
        visi: visiData.length || 0,
        sejarah: sejarahData.length || 0,
        news: newsData.length || 0,
        gallery: galleryData.length || 0,
        pengumuman: pengumumanData.length || 0,
        teacher: teacherData.length || 0,
        headmaster: headmasterData ? 1 : 0,
        program: programData.length || 0,
        siswa: siswaData.length || 0,
        prestasi: prestasiData.length || 0,
      });

      // set some recents (safely)
      setRecent({
        news: newsData.slice(0, 5),
        teachers: teacherData.slice(0, 5),
        prestasi: prestasiData.slice(0, 5),
        programs: programData.slice(0, 5),
      });

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
      await axios.delete(`${API_BASE}/api/news/${id}`, { headers: authHeaders });
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
          <div className="stat-icon blue">🎯</div>
          <div className="stat-content">
            <h3>Visi Misi</h3>
            <p className="stat-number">{counts.visi}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon gray">📜</div>
          <div className="stat-content">
            <h3>Sejarah</h3>
            <p className="stat-number">{counts.sejarah}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">📰</div>
          <div className="stat-content">
            <h3>Berita</h3>
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
          <div className="stat-icon teal">🔔</div>
          <div className="stat-content">
            <h3>Pengumuman</h3>
            <p className="stat-number">{counts.pengumuman}</p>
          </div>
        </div>

        {/* new admin stats */}
        <div className="stat-card">
          <div className="stat-icon green">👩‍🏫</div>
          <div className="stat-content">
            <h3>Guru</h3>
            <p className="stat-number">{counts.teacher}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">🎓</div>
          <div className="stat-content">
            <h3>Kepala Sekolah</h3>
            <p className="stat-number">{counts.headmaster}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cyan">⭐</div>
          <div className="stat-content">
            <h3>Program Unggulan</h3>
            <p className="stat-number">{counts.program}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon brown">🎓</div>
          <div className="stat-content">
            <h3>Siswa</h3>
            <p className="stat-number">{counts.siswa}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">🏆</div>
          <div className="stat-content">
            <h3>Prestasi</h3>
            <p className="stat-number">{counts.prestasi}</p>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h2>Recent News</h2>
        </div>

        <div className="recent-list">
          {recent.news.length === 0 ? (
            <p>Tidak ada berita terbaru.</p>
          ) : (
            recent.news.map((n) => (
              <div key={n.id} className="recent-item">
                <div className="recent-left">
                  <strong>{n.title}</strong>
                  <div className="muted">{n.created_at ? new Date(n.created_at).toLocaleString() : ""}</div>
                </div>
                <div className="recent-actions">
                  <button onClick={() => handleViewNews(n.id)} className="btn-sm">Lihat</button>
                  <button onClick={() => handleEditNews(n.id)} className="btn-sm ml">Edit</button>
                  <button onClick={() => handleDeleteNews(n.id)} className="btn-sm danger ml">Hapus</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="quick-actions">
        <h2>Aksi Cepat</h2>
        <div className="actions-grid">
          <button className="action-btn blue" onClick={() => navigate("/admin/createnews")}>
            <span className="action-icon">📝</span>
            <span>Tambah Berita</span>
          </button>

          <button className="action-btn orange" onClick={() => navigate("/admin/sejarah")}>
            <span className="action-icon">🏫</span>
            <span>Sejarah</span>
          </button>

          <button className="action-btn blue" onClick={() => navigate("/admin/gallery")}>
            <span className="action-icon">🖼️</span>
            <span>Upload Galeri</span>
          </button>

          <button className="action-btn green" onClick={() => navigate("/admin/teacher")}>
            <span className="action-icon">👩‍🏫</span>
            <span>Manajemen Guru</span>
          </button>

          <button className="action-btn purple" onClick={() => navigate("/admin/headmaster")}>
            <span className="action-icon">🎓</span>
            <span>Sambutan Kepala Sekolah</span>
          </button>

          <button className="action-btn cyan" onClick={() => navigate("/admin/program")}>
            <span className="action-icon">⭐</span>
            <span>Program Unggulan</span>
          </button>

          <button className="action-btn brown" onClick={() => navigate("/admin/siswaadmin")}>
            <span className="action-icon">🎒</span>
            <span>Data Siswa</span>
          </button>

          <button className="action-btn red" onClick={() => navigate("/admin/prestasiadmin")}>
            <span className="action-icon">🏆</span>
            <span>Prestasi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
