// src/admin/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./admin.css";

export default function AdminLayout() {
  // simpan preferensi collapsed di localStorage supaya persist
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("adminSidebarCollapsed") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("adminSidebarCollapsed", collapsed ? "true" : "false");
    } catch {}
  }, [collapsed]);

  return (
    <div className={`admin-container ${collapsed ? "collapsed" : ""}`}>
      {/* header */}
      <header className="admin-header" role="banner">
        <div className="header-left">
          <div className="logo" aria-hidden="true">
            <div className="logo-icon">📚</div>
            <div className="logo-text">
              <span className="smart">SMART</span>
              <span className="school">SCHOOL</span>
            </div>
          </div>

          <button
            className="sidebar-toggle"
            aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
            title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
            onClick={() => setCollapsed((s) => !s)}
          >
            {/* Saat collapsed=true, tampilkan ikon buka (☰) */}
            {collapsed ? "☰" : "✕"}
          </button>
        </div>

        <nav className="header-nav" aria-label="Utama header">
          <button className="btn-logout" aria-label="Keluar">KELUAR</button>
        </nav>
      </header>

      {/* main layout */}
      <div className="admin-main">
        <aside className="admin-sidebar" aria-label="Sidebar admin">
          <nav className="sidebar-nav" aria-label="Navigasi admin">
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

            {/* Notice: path lowercase to match App.jsx */}
            <NavLink to="/admin/pengumuman" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">📣</span>
              <span className="label">Pengumuman</span>
            </NavLink>

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

            <NavLink to="/admin/siswa" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">🎒</span>
              <span className="label">Siswa</span>
            </NavLink>

            <NavLink to="/admin/orangtua" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">👪</span>
              <span className="label">Orang Tua</span>
            </NavLink>

            <NavLink to="/admin/prestasi" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">🏆</span>
              <span className="label">Prestasi</span>
            </NavLink>
          </nav>
        </aside>

        {/* content rendered by child routes */}
        <main className="admin-content" id="main-content">
          <Outlet />
        </main>
      </div>

      <footer className="admin-footer" role="contentinfo">
        <p>@smartschool.id - All Right Reserved citrasolusi.id</p>
      </footer>
    </div>
  );
}
