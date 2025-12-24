import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./admin.css";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`admin-container ${collapsed ? "collapsed" : ""}`}>
      {/* header */}
      <header className="admin-header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">📚</div>
            <div className="logo-text">
              <span className="smart">SMART</span>
              <span className="school">SCHOOL</span>
            </div>
          </div>

          <button
            className="sidebar-toggle"
            aria-label="Toggle sidebar"
            onClick={() => setCollapsed((s) => !s)}
          >
            {collapsed ? "☰" : "✕"}
          </button>
        </div>

        <nav className="header-nav">
          <NavLink to="/" className="nav-link">Website</NavLink>
          <NavLink to="/admin" className="nav-link">Master Data</NavLink>
          <NavLink to="/admin/transaksi" className="nav-link">Transaksi</NavLink>
          <button className="btn-logout">KELUAR</button>
        </nav>
      </header>

      {/* main layout */}
      <div className="admin-main">
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            <NavLink to="/admin" end className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">📊</span>
              <span className="label">Dashboard</span>
            </NavLink>

            <NavLink to="/admin/visi" className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">🎯</span>
              <span className="label">Visi Misi</span>
            </NavLink>

            <NavLink to="/admin/sejarah" className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">📜</span>
              <span className="label">Sejarah Sekolah</span>
            </NavLink>

            <NavLink to="/admin/newslist" className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">📝</span>
              <span className="label">Berita Sekolah</span>
            </NavLink>

            <NavLink to="/admin/gallery" className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">🖼️</span>
              <span className="label">Galeri</span>
            </NavLink>

            <NavLink to="/admin/pengumuman" className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">📣</span>
              <span className="label">Pengumuman</span>
            </NavLink>

            <NavLink to="/admin/logout" className="sidebar-link">
              <span className="icon">↩️</span>
              <span className="label">Logout</span>
            </NavLink>
          </nav>
        </aside>

        {/* content rendered by child routes */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <footer className="admin-footer">
        <p>@smartschool.id - All Right Reserved citrasolusi.id</p>
      </footer>
    </div>
  );
}
