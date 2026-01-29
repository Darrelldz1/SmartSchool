import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { useState } from "react";

export default function AdminLayout() {
  const { logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    if (confirm("Yakin ingin logout?")) {
      logout();
    }
  };

  const linkStyle = ({ isActive }) => ({
    ...styles.link,
    ...(isActive ? styles.linkActive : {}),
  });

  return (
    <div style={styles.wrapper}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .nav-link {
            position: relative;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .nav-link:hover {
            background: rgba(59, 130, 246, 0.1) !important;
            transform: translateX(5px);
            color: #3b82f6 !important;
          }

          .nav-link::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 0;
            background: #3b82f6;
            border-radius: 0 4px 4px 0;
            transition: height 0.3s ease;
          }

          .nav-link:hover::before,
          .nav-link-active::before {
            height: 70%;
          }

          .logout-btn {
            transition: all 0.3s ease;
          }

          .logout-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
          }

          .sidebar-toggle {
            transition: all 0.3s ease;
          }

          .sidebar-toggle:hover {
            background: rgba(59, 130, 246, 0.2);
          }

          .logo-text {
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}
      </style>

      {/* SIDEBAR */}
      <aside style={{
        ...styles.sidebar,
        width: sidebarCollapsed ? 80 : 280,
      }}>
        {/* Logo & Header */}
        <div style={styles.logoContainer}>
          <div style={styles.logoWrapper}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>🏫</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 style={styles.logoText} className="logo-text">SmartSchool</h2>
                <p style={styles.logoSubtext}>Admin Panel</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={styles.toggleBtn}
            className="sidebar-toggle"
            title={sidebarCollapsed ? "Expand" : "Collapse"}
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          <NavLink to="/admin" end style={linkStyle} className="nav-link">
            <span style={styles.navIcon}>📊</span>
            {!sidebarCollapsed && <span>Dashboard</span>}
          </NavLink>

          {/* Profil Section */}
          <div style={styles.sectionGroup}>
            {!sidebarCollapsed && <h4 style={styles.section}>Profil</h4>}
            <NavLink to="/admin/profile" style={linkStyle} className="nav-link">
              <span style={styles.navIcon}>🎯</span>
              {!sidebarCollapsed && <span>Visi & Misi</span>}
            </NavLink>
            <NavLink to="/admin/history" style={linkStyle} className="nav-link">
              <span style={styles.navIcon}>📜</span>
              {!sidebarCollapsed && <span>Sejarah</span>}
            </NavLink>
          </div>

          {/* Konten Section */}
          <div style={styles.sectionGroup}>
            {!sidebarCollapsed && <h4 style={styles.section}>Konten</h4>}
            <NavLink to="/admin/gallery" style={linkStyle} className="nav-link">
              <span style={styles.navIcon}>🖼️</span>
              {!sidebarCollapsed && <span>Galeri</span>}
            </NavLink>
            <NavLink to="/admin/news" style={linkStyle} className="nav-link">
              <span style={styles.navIcon}>📰</span>
              {!sidebarCollapsed && <span>Berita</span>}
            </NavLink>
          </div>

          {/* Akademik Section */}
          <div style={styles.sectionGroup}>
            {!sidebarCollapsed && <h4 style={styles.section}>Akademik</h4>}
            <NavLink to="/admin/teacher" style={linkStyle} className="nav-link">
              <span style={styles.navIcon}>👨‍🏫</span>
              {!sidebarCollapsed && <span>Guru</span>}
            </NavLink>
            <NavLink to="/admin/siswa" style={linkStyle} className="nav-link">
              <span style={styles.navIcon}>👨‍🎓</span>
              {!sidebarCollapsed && <span>Siswa</span>}
            </NavLink>
            <NavLink to="/admin/program" style={linkStyle} className="nav-link">
              <span style={styles.navIcon}>📋</span>
              {!sidebarCollapsed && <span>Program</span>}
            </NavLink>
            <NavLink to="/admin/prestasi" style={linkStyle} className="nav-link">
              <span style={styles.navIcon}>🏆</span>
              {!sidebarCollapsed && <span>Prestasi</span>}
            </NavLink>
          </div>
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* User Info */}
        {!sidebarCollapsed && (
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              <span style={styles.userAvatarText}>A</span>
            </div>
            <div>
              <div style={styles.userName}>Admin</div>
              <div style={styles.userRole}>Administrator</div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
          className="logout-btn"
        >
          <span style={styles.logoutIcon}>🚪</span>
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        {/* Top Bar */}
        <div style={styles.topBar}>
          <div style={styles.breadcrumb}>
            <span style={styles.breadcrumbItem}>Admin</span>
            <span style={styles.breadcrumbSeparator}>/</span>
            <span style={styles.breadcrumbItemActive}>Dashboard</span>
          </div>
          <div style={styles.topBarRight}>
            <div style={styles.dateTime}>
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Outfit', sans-serif",
    background: "#f8fafc",
  },

  // SIDEBAR STYLES
  sidebar: {
    background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
    color: "#fff",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    boxShadow: "4px 0 24px rgba(0, 0, 0, 0.12)",
    transition: "width 0.3s ease",
    position: "relative",
    zIndex: 100,
  },

  logoContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    paddingBottom: 20,
    borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
  },

  logoWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  logo: {
    width: 48,
    height: 48,
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
  },

  logoIcon: {
    fontSize: 24,
  },

  logoText: {
    fontSize: 22,
    fontWeight: 800,
    margin: 0,
    letterSpacing: "-0.5px",
  },

  logoSubtext: {
    fontSize: 12,
    color: "#94a3b8",
    margin: "4px 0 0 0",
    fontWeight: 500,
  },

  toggleBtn: {
    width: 32,
    height: 32,
    background: "rgba(59, 130, 246, 0.1)",
    border: "none",
    borderRadius: 8,
    color: "#3b82f6",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  sectionGroup: {
    marginTop: 8,
  },

  section: {
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 12,
    fontSize: 12,
    color: "#64748b",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 12,
    animation: "slideIn 0.3s ease",
  },

  linkActive: {
    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)",
    color: "#3b82f6",
    fontWeight: 700,
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
  },

  navIcon: {
    fontSize: 20,
    minWidth: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 12px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 12,
  },

  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 18,
  },

  userAvatarText: {
    color: "#fff",
  },

  userName: {
    fontSize: 14,
    fontWeight: 700,
    color: "#fff",
  },

  userRole: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },

  logoutBtn: {
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "#fff",
    border: "none",
    padding: "14px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
    fontFamily: "'Outfit', sans-serif",
  },

  logoutIcon: {
    fontSize: 18,
  },

  // MAIN CONTENT STYLES
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  topBar: {
    background: "#fff",
    padding: "20px 32px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },

  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
  },

  breadcrumbItem: {
    color: "#64748b",
    fontWeight: 500,
  },

  breadcrumbSeparator: {
    color: "#cbd5e1",
  },

  breadcrumbItemActive: {
    color: "#1e293b",
    fontWeight: 700,
  },

  topBarRight: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },

  dateTime: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: 500,
  },

  content: {
    flex: 1,
    padding: 32,
    overflow: "auto",
    background: "#f8fafc",
  },
};