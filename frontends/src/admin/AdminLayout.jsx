// src/admin/AdminLayout.jsx
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
          <button className="sidebar-toggle" aria-label="Toggle sidebar" onClick={() => setCollapsed((s) => !s)}>
            {collapsed ? "☰" : "✕"}
          </button>
        </div>
        <nav className="header-nav">
          <button className="btn-logout">KELUAR</button>
        </nav>
      </header>

      {/* main layout */}
      <div className="admin-main">
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">📊</span>
              <span className="label">Dashboard</span>
            </NavLink>

            <NavLink to="/admin/visi" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">🎯</span>
              <span className="label">Visi Misi</span>
            </NavLink>

            <NavLink to="/admin/sejarah" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">📜</span>
              <span className="label">Sejarah Sekolah</span>
            </NavLink>

            <NavLink to="/admin/newslist" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">📝</span>
              <span className="label">Berita Sekolah</span>
            </NavLink>

            <NavLink to="/admin/gallery" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">🖼️</span>
              <span className="label">Galeri</span>
            </NavLink>

            <NavLink to="/admin/PengumumanAdmin" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">📣</span>
              <span className="label">Pengumuman</span>
            </NavLink>

            {/* New admin sections */}
            <NavLink to="/admin/teacher" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">👩‍🏫</span>
              <span className="label">Guru</span>
            </NavLink>

            <NavLink to="/admin/headmaster" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">🎓</span>
              <span className="label">Kepala Sekolah</span>
            </NavLink>

            <NavLink to="/admin/program" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">⭐</span>
              <span className="label">Program Unggulan</span>
            </NavLink>

            {/* <-- FIXED paths for Siswa & Prestasi --> */}
            <NavLink to="/admin/siswa" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">🎒</span>
              <span className="label">Siswa</span>
            </NavLink>

            <NavLink to="/admin/prestasi" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">🏆</span>
              <span className="label">Prestasi</span>
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
