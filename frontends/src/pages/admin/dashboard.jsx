import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../auth/AuthProvider";
import "./dashboard.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function AdminDashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();

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

  const [animatedStats, setAnimatedStats] = useState({
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recentNews, setRecentNews] = useState([]);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const statsConfig = [
    { key: 'visi', icon: '🎯', label: 'Visi & Misi', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', route: '/admin/visi' },
    { key: 'sejarah', icon: '📜', label: 'Sejarah', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', route: '/admin/sejarah' },
    { key: 'news', icon: '📰', label: 'Berita', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', route: '/admin/newslist' },
    { key: 'gallery', icon: '🖼️', label: 'Galeri', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', route: '/admin/gallery' },
    { key: 'teacher', icon: '👨‍🏫', label: 'Guru', color: 'from-cyan-500 to-cyan-600', bgColor: 'bg-cyan-50', route: '/admin/teacher' },
    { key: 'program', icon: '⭐', label: 'Program', color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50', route: '/admin/program' },
    { key: 'siswa', icon: '👥', label: 'Siswa', color: 'from-indigo-500 to-indigo-600', bgColor: 'bg-indigo-50', route: '/admin/siswa' },
    { key: 'prestasi', icon: '🏆', label: 'Prestasi', color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-50', route: '/admin/prestasi' },
  ];

  const quickActions = [
    { icon: '📝', label: 'Tambah Berita', route: '/admin/createnews', color: 'blue' },
    { icon: '🖼️', label: 'Upload Galeri', route: '/admin/gallery', color: 'orange' },
    { icon: '👨‍🏫', label: 'Kelola Guru', route: '/admin/teacher', color: 'cyan' },
    { icon: '🏆', label: 'Input Prestasi', route: '/admin/prestasi', color: 'yellow' },
  ];

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Object.keys(stats).forEach((key) => {
      let current = 0;
      const target = stats[key];
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedStats(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, 20);
    });
  }, [stats]);

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

      if (news.data && Array.isArray(news.data)) {
        setRecentNews(news.data.slice(0, 5));
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalData = Object.values(stats).reduce((acc, val) => acc + val, 0);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-modern">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">Dashboard Admin</h1>
            <p className="dashboard-subtitle">Selamat datang kembali! 👋</p>
          </div>
          <div className="time-card">
            <p className="time-label">Waktu Sekarang</p>
            <p className="time-value">
              {currentTime.toLocaleTimeString('id-ID')}
            </p>
            <p className="date-value">
              {currentTime.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card summary-primary">
            <div className="summary-icon">📊</div>
            <div className="summary-content">
              <p className="summary-label">Total Data</p>
              <p className="summary-value">{totalData}</p>
            </div>
          </div>
          <div className="summary-card summary-success">
            <div className="summary-icon">📰</div>
            <div className="summary-content">
              <p className="summary-label">Berita Aktif</p>
              <p className="summary-value">{animatedStats.news}</p>
            </div>
          </div>
          <div className="summary-card summary-info">
            <div className="summary-icon">👥</div>
            <div className="summary-content">
              <p className="summary-label">Total Siswa</p>
              <p className="summary-value">{animatedStats.siswa}</p>
            </div>
          </div>
          <div className="summary-card summary-warning">
            <div className="summary-icon">🏆</div>
            <div className="summary-content">
              <p className="summary-label">Prestasi</p>
              <p className="summary-value">{animatedStats.prestasi}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid-modern">
          {statsConfig.map((stat, index) => (
            <div
              key={stat.key}
              className="stat-card-modern"
              onClick={() => navigate(stat.route)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="stat-card-content">
                <div className={`stat-icon ${stat.bgColor}`}>
                  <span>{stat.icon}</span>
                </div>
                <div className="stat-info">
                  <p className="stat-label">{stat.label}</p>
                  <p className={`stat-value bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {animatedStats[stat.key]}
                  </p>
                </div>
              </div>
              <div className="stat-progress">
                <div
                  className={`stat-progress-bar bg-gradient-to-r ${stat.color}`}
                  style={{
                    width: `${Math.min((animatedStats[stat.key] / Math.max(...Object.values(stats), 1)) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h3 className="section-title">Aksi Cepat</h3>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className={`quick-action-card quick-action-${action.color}`}
                onClick={() => navigate(action.route)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="quick-action-icon">{action.icon}</div>
                <p className="quick-action-label">{action.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent News */}
        {recentNews.length > 0 && (
          <div className="recent-section">
            <h3 className="section-title">Berita Terbaru</h3>
            <div className="news-grid">
              {recentNews.map((news, index) => (
                <div
                  key={news.id}
                  className="news-card"
                  onClick={() => navigate(`/admin/editnews/${news.id}`)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="news-icon">📰</div>
                  <div className="news-content">
                    <p className="news-title">{news.title}</p>
                    <p className="news-date">
                      {news.created_at ? new Date(news.created_at).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </div>
                  <svg className="news-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 