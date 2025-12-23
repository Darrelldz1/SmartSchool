import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TeacherDashboard.css";

const BASE = 'http://localhost:5000/api';
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ news: 0, gallery: 0 });
  const [recentNews, setRecentNews] = useState([]);
  const [recentGallery, setRecentGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    setErr(null);
    try {
      const headers = { headers: authHeaders() };
      const [rNews, rGallery] = await Promise.all([
        axios.get(`${BASE}/news`, headers).catch(() => ({ data: [] })),
        axios.get(`${BASE}/gallery`, headers).catch(() => ({ data: [] }))
      ]);

      const newsData = Array.isArray(rNews.data) ? rNews.data : [];
      const galleryData = Array.isArray(rGallery.data) ? rGallery.data : [];

      setCounts({ news: newsData.length, gallery: galleryData.length });
      setRecentNews(newsData.slice(0,5));
      setRecentGallery(galleryData.slice(0,8));
    } catch (e) {
      console.error("loadAll err", e);
      setErr("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }

  const handleEditNews = id => navigate(`/teacher/news/edit/${id}`);
  const handleViewNews = id => navigate(`/news/${id}`);

  if (loading) return <div className="dashboard p-6">Memuat dashboard...</div>;
  if (err) return <div className="dashboard p-6 text-red-600">{err}</div>;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard Guru</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📰</div>
          <div className="stat-content">
            <h3>Berita</h3>
            <p className="stat-number">{counts.news}</p>
            <div className="mt-2"><button className="btn-add" onClick={()=>navigate('/teacher/news')}>Kelola Berita</button></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">🖼️</div>
          <div className="stat-content">
            <h3>Galeri</h3>
            <p className="stat-number">{counts.gallery}</p>
            <div className="mt-2"><button className="btn-add orange" onClick={()=>navigate('/teacher/gallery')}>Kelola Galeri</button></div>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2>Postingan Terbaru</h2>
          <button className="btn-view-all" onClick={()=>navigate('/teacher/news')}>Lihat Semua</button>
        </div>

        <table className="data-table" style={{marginTop:12}}>
          <thead>
            <tr><th>No</th><th>Judul</th><th>Tanggal</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {recentNews.length === 0 ? (
              <tr><td colSpan="4" className="no-data">Belum ada postingan</td></tr>
            ) : recentNews.map((p,i)=>(
              <tr key={p.id}>
                <td>{i+1}</td>
                <td>{p.title || p.judul}</td>
                <td>{p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}</td>
                <td>
                  <button className="btn-action edit" onClick={()=>handleEditNews(p.id)}>✏️</button>
                  <button className="btn-action view" onClick={()=>handleViewNews(p.id)}>👁️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="recent-section" style={{marginTop:18}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2>Galeri Terbaru</h2>
          <button className="btn-view-all" onClick={()=>navigate('/teacher/gallery')}>Lihat Semua</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginTop:12}}>
          {recentGallery.map(g=>(
            <div key={g.id} className="border p-1">
              {g.image_url ? <img src={g.image_url} alt="" style={{width:'100%',height:96,objectFit:'cover'}}/> : <div style={{height:96,background:'#eee'}}/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
