// src/components/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider"; // pastikan path benar
import "./login.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Login() {
  const auth = useAuth() || {};
  const { login: authLogin } = auth; // optional helper from AuthProvider
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function doLocalLogin(token, user) {
    // standar sederhana: simpan ke localStorage / AuthProvider jika tersedia
    try {
      if (auth && typeof auth.setUser === "function") {
        // jika AuthProvider expose setUser
        auth.setUser({ user, token });
      } else if (authLogin && authLogin._isAuthHelper) {
        // nothing, trust authLogin handled it
      } else {
        // fallback: simpan sendiri
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user || {}));
      }
    } catch (e) {
      console.warn("doLocalLogin warning:", e);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let result = null;

      // 1) Prefer built-in AuthProvider.login if provided
      if (typeof authLogin === "function") {
        // Some AuthProvider implementations return { ok, user, token, message }
        // Others may throw on error — handle both.
        try {
          result = await authLogin({ email, password });
        } catch (err) {
          // normalize error
          console.error("authLogin threw:", err);
          result = { ok: false, message: err?.message || "Login gagal" };
        }
      } else {
        // 2) Fallback: call API directly
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) {
          result = { ok: false, message: data?.error || data?.message || `HTTP ${res.status}` };
        } else {
          // expected { token, user } or similar
          result = { ok: true, user: data.user || data, token: data.token || data.accessToken };
          // store locally
          await doLocalLogin(result.token, result.user);
        }
      }

      setIsLoading(false);

      if (!result || result.ok === false) {
        setError(result?.message || "Login gagal. Cek email/password");
        return;
      }

      // ensure we have user + token available
      const user = result.user || (result.data && result.data.user) || null;
      const token = result.token || (user && user.token) || localStorage.getItem("token");

      // if AuthProvider.login didn't store token/user, store them now (fallback)
      if (!localStorage.getItem("token") && token) {
        localStorage.setItem("token", token);
      }
      if (!localStorage.getItem("user") && user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // determine role
      const role = result.role || (user && user.role) || "user";

      // redirect: admin and guru to admin dashboard
      if (role === "admin" || role === "guru") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("login err", err);
      setIsLoading(false);
      setError(err?.message || "Terjadi kesalahan saat login");
    }
  };

  return (
    <div className="login-container">
      {/* Header */}
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

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Left Side - Illustration */}
          <div className="illustration-section">
            <div className="book-illustration">
              <div className="book-pages">
                <div className="floating-icons">
                  <span className="icon graph">📊</span>
                  <span className="icon chart">📈</span>
                  <span className="icon bulb">💡</span>
                  <span className="icon gear">⚙️</span>
                  <span className="icon pencil">✏️</span>
                  <span className="icon book">📚</span>
                  <span className="icon calculator">🧮</span>
                  <span className="icon globe">🌍</span>
                  <span className="icon atom">⚛️</span>
                  <span className="icon microscope">🔬</span>
                </div>
                <div className="city-skyline">
                  <div className="building building-1"></div>
                  <div className="building building-2"></div>
                  <div className="building building-3"></div>
                  <div className="building building-4"></div>
                  <div className="building building-5"></div>
                  <div className="building building-6"></div>
                  <div className="building building-7"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="login-section">
            <div className="login-card">
              <h2 className="login-title">MASUK</h2>
              <p className="login-subtitle">Selamat datang di @smartschool</p>

              <form className="login-form" onSubmit={handleSubmit}>
                {error && <div className="alert-error" style={{ marginBottom: 12 }}>{error}</div>}

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
                      placeholder="Masukan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                      required
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

                <div className="form-options">
                  <Link to="/reset" className="forgot-password">Reset Password</Link>
                </div>

                <button className="submit-btn" type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "MASUK"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>@smartschool.id - All Right Reserved Citrasolusi.id</p>
      </footer>
    </div>
  );
}
