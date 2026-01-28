import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const linkStyle = ({ isActive }) => ({
    ...styles.link,
    ...(isActive ? styles.linkActive : null),
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2>SmartSchool</h2>

        <NavLink to="/admin" end style={linkStyle}>
          Dashboard
        </NavLink>

        <h4>Profil</h4>
        <NavLink to="/admin/profile" style={linkStyle}>
          Visi & Misi
        </NavLink>
        <NavLink to="/admin/history" style={linkStyle}>
          Sejarah
        </NavLink>

        <h4>Konten</h4>
        <NavLink to="/admin/gallery" style={linkStyle}>
          Galeri
        </NavLink>
        <NavLink to="/admin/news" style={linkStyle}>
          Berita
        </NavLink>

        <h4>Akademik</h4>
        <NavLink to="/admin/teacher" style={linkStyle}>
          Guru
        </NavLink>
        <NavLink to="/admin/siswa" style={linkStyle}>
          Siswa
        </NavLink>
        <NavLink to="/admin/program" style={linkStyle}>
          Program
        </NavLink>
        <NavLink to="/admin/prestasi" style={linkStyle}>
          Prestasi
        </NavLink>
      </aside>

      {/* CONTENT */}
      <main style={styles.content}>
        ✅ INI WAJIB ADA
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  sidebar: {
    width: 250,
    background: "#1e293b",
    color: "#fff",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "8px 10px",
    borderRadius: 8,
  },
  linkActive: {
    background: "rgba(255,255,255,.10)",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 30,
    background: "#f1f5f9",
  },
};
