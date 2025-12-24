// src/components/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./register.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (!name.trim()) return setError("Nama wajib diisi");
    if (!email.trim()) return setError("Email wajib diisi");
    if (!password || password.length < 6) return setError("Password minimal 6 karakter");

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, {
        name: name.trim(),
        email: email.trim(),
        password
      });

      // banyak backend mengembalikan message atau user; tampilkan pesan sukses
      alert(res.data?.message || "Registrasi berhasil. Silakan login.");
      // arahkan ke halaman login
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("register err", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Registrasi gagal";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 5L25 10L20 15L15 10L20 5Z" fill="#4A90E2" />
                <circle cx="20" cy="25" r="8" fill="#4A90E2" />
              </svg>
            </div>
            <span className="logo-text">
              <span className="smart">SMART</span>
              <span className="school">SCHOOL</span>
            </span>
          </div>

          <nav className="nav-menu">
            <Link to="/" className="nav-link">Beranda</Link>
            <a href="#profil" className="nav-link">Profil</a>
            <a href="#galeri" className="nav-link">Galeri</a>
            <a href="#pengumuman" className="nav-link">Pengumuman</a>
            <a href="#daftar" className="nav-link">Daftar</a>
            <Link to="/login" className="masuk-btn-header">MASUK</Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          {/* Illustration */}
          <div className="illustration-section">
            <div className="book-illustration">
              <div className="book-pages">
                <div className="floating-icons">
                  <span className="icon graph">📊</span>
                  <span className="icon chart">📈</span>
                  <span className="icon bulb">💡</span>
                  <span className="icon gear">⚙️</span>
                  <span className="icon pencil">✏️</span>
                </div>
                <div className="city-skyline">
                  <div className="building building-1"></div>
                  <div className="building building-2"></div>
                  <div className="building building-3"></div>
                  <div className="building building-4"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Register Form */}
          <div className="login-section">
            <div className="login-card">
              <h2 className="login-title">DAFTAR</h2>
              <p className="login-subtitle">Buat akun baru di SmartSchool</p>

              <form className="login-form" onSubmit={handleSubmit}>
                {error && <div className="alert-error" style={{ marginBottom: 12, color: "crimson" }}>{error}</div>}

                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Nama lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Masukan email anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukan password (min 6 karakter)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                      aria-label="toggle password"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className="form-options" style={{ justifyContent: "center" }}>
                  <div>
                    Sudah punya akun?{" "}
                    <Link to="/login" className="forgot-password">Silahkan login</Link>
                  </div>
                </div>

                <button className="submit-btn" type="submit" disabled={isLoading}>
                  {isLoading ? "Mendaftarkan..." : "DAFTAR"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>@smartschool.id - All Right Reserved Citrasolusi.id</p>
      </footer>
    </div>
  );
}
