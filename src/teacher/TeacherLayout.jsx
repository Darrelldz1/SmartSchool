import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider"; // sesuaikan path jika beda
import "../admin/admin.css"; // ensure admin styles available
import "./Teacher.css"; // teacher specific (imports admin.css)

export default function TeacherLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth() || {};
  const navigate = useNavigate();

  function handleLogout() {
    if (logout) logout();
    else {
      // fallback: clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }

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
          <NavLink to="/teacher" className="nav-link">Dashboard Guru</NavLink>
          <NavLink to="/teacher/news" className="nav-link">Berita</NavLink>
          <button className="btn-logout" onClick={handleLogout}>KELUAR</button>
        </nav>
      </header>

      {/* main layout */}
      <div className="admin-main">
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            <NavLink to="/teacher" end className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">📊</span>
              <span className="label">Dashboard</span>
            </NavLink>

            <NavLink to="/teacher/news" className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">📝</span>
              <span className="label">Berita</span>
            </NavLink>

            <NavLink to="/teacher/gallery" className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
              <span className="icon">🖼️</span>
              <span className="label">Galeri</span>
            </NavLink>

            <NavLink to="/teacher/logout" className="sidebar-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
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
