import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthProvider";
import "./dashboard.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function AdminDashboard() {
  const { token } = useAuth();

  const [stats, setStats] = useState({
    visi: 0,
    sejarah: 0,
    news: 0,
    gallery: 0,
    teacher: 0,
    program: 0,
    siswa: 0,
    prestasi: 0,
  });

  const [loading, setLoading] = useState(true);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

 const fetchDashboard = async () => {
  try {
    const [
      profile,
      history,
      news,
      gallery,
      program,
      teacher,
      siswa,
      prestasi,
    ] = await Promise.all([
      axios.get(`${API_BASE}/api/profile`, { headers }),
      axios.get(`${API_BASE}/api/history`, { headers }),
      axios.get(`${API_BASE}/api/news`, { headers }),
      axios.get(`${API_BASE}/api/gallery`, { headers }),
      axios.get(`${API_BASE}/api/program`, { headers }),
      axios.get(`${API_BASE}/api/teacher`, { headers }),
      axios.get(`${API_BASE}/api/siswaRoutes`, { headers }),
      axios.get(`${API_BASE}/api/prestasi`, { headers }),
    ]);

    setStats({
      visi: profile.data?.length || 0,
      sejarah: history.data?.length || 0,
      news: news.data?.length || 0,
      gallery: gallery.data?.length || 0,
      program: program.data?.length || 0,
      teacher: teacher.data?.length || 0,
      siswa: siswa.data?.length || 0,
      prestasi: prestasi.data?.length || 0,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
  } finally {
    setLoading(false);
  }
};


  if (loading) return <h2>Loading dashboard...</h2>;

  return (
    <div className="dashboard">
      <h1>Dashboard Admin</h1>

      <div className="stats-grid">
        <Stat title="Visi & Misi" value={stats.visi} />
        <Stat title="Sejarah" value={stats.sejarah} />
        <Stat title="Berita" value={stats.news} />
        <Stat title="Galeri" value={stats.gallery} />
        <Stat title="Guru" value={stats.teacher} />
        <Stat title="Program" value={stats.program} />
        <Stat title="Siswa" value={stats.siswa} />
        <Stat title="Prestasi" value={stats.prestasi} />
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
