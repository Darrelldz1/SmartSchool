import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Header, { HEADER_HEIGHT } from "../components/Header";
import Footer from "../components/Footer";
import "./login.css";
import illustrationAsset from "../assets/ilustrasi.png"; // optional local asset

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// small set of alternate illustrations if local asset missing
const illustrationCandidates = [
  "/illustration-welcome.png",
  "/illustration-school.png",
  "/illustration-login.png",
];

export default function Login() {
  const auth = useAuth() || {};
  const { login: authLogin, logout, setUser, user: authUser } = auth;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // illustration handling (rotate fallback images if one fails)
  const initialIll = illustrationAsset || illustrationCandidates[0];
  const [illIndex, setIllIndex] = useState(0);
  const [illSrc, setIllSrc] = useState(initialIll);
  const [illustrationFailed, setIllustrationFailed] = useState(false);

  useEffect(() => {
    if (!illustrationAsset) {
      setIllSrc(illustrationCandidates[illIndex] || illustrationCandidates[0]);
    }
  }, [illIndex]);

  const handleIllError = () => {
    const next = illIndex + 1;
    if (next < illustrationCandidates.length) setIllIndex(next);
    else setIllustrationFailed(true);
  };

  async function doLocalLogin(token, user) {
    try {
      if (typeof setUser === "function") {
        setUser(user || null);
      } else {
        if (token) localStorage.setItem("token", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));
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

      if (typeof authLogin === "function") {
        try {
          result = await authLogin({ email, password });
          if (result && result.ok) await doLocalLogin(result.token || result.accessToken, result.user || result.data);
        } catch (err) {
          console.error("authLogin threw:", err);
          result = { ok: false, message: err?.message || "Login gagal" };
        }
      } else {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          result = { ok: false, message: data?.error || data?.message || `HTTP ${res.status}` };
        } else {
          result = { ok: true, user: data.user || data, token: data.token || data.accessToken, role: data.role || (data.user && data.user.role) };
          await doLocalLogin(result.token, result.user);
        }
      }

      setIsLoading(false);

      if (!result || result.ok === false) {
        setError(result?.message || "Login gagal. Cek email/password");
        return;
      }

      const user = result.user || (result.data && result.data.user) || null;
      const token = result.token || (user && user.token) || localStorage.getItem("token");

      if (!localStorage.getItem("token") && token) localStorage.setItem("token", token);
      if (!localStorage.getItem("user") && user) localStorage.setItem("user", JSON.stringify(user));

      const role = result.role || (user && user.role) || "user";
      if (role === "admin" || role === "guru") navigate("/admin", { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      console.error("login err", err);
      setIsLoading(false);
      setError(err?.message || "Terjadi kesalahan saat login");
    }
  };

  const onLoginClick = () => navigate("/login");
  const onLogoutClick = () => {
    logout && logout();
    navigate("/");
  };

  return (
    <div className="login-container" style={{ backgroundColor: "#f8fafc" }}>
      <Header />
      <div style={{ height: HEADER_HEIGHT }} />

      <main className="main-content">
        <div className="content-wrapper" style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem", display: "flex", gap: 24 }}>
          {/* Left: Illustration / welcome */}
          <div className="illustration-section" style={{ flex: 1 }}>
            <div className="illustration-content">
              {!illustrationFailed ? (
                <div className="illustration-box" aria-hidden>
                  <img
                    src={illSrc}
                    alt="Ilustrasi SmartSchool"
                    className="illustration-image"
                    onError={handleIllError}
                    style={{ width: "100%", maxWidth: 420, height: "auto", objectFit: "contain" }}
                  />
                </div>
              ) : (
                <div className="illustration-box illustration-fallback">
                  <div style={{ padding: 20 }}>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>
                      Selamat datang di SmartSchool
                    </h3>
                    <p style={{ marginTop: 8, color: "#6b7280" }}>
                      Platform untuk belajar, berbagi informasi, dan berkolaborasi bersama komunitas sekolah.
                    </p>
                  </div>
                </div>
              )}

              <h2 className="illustration-title" style={{ marginTop: 18 }}>
                Selamat datang di SmartSchool — Tempat Belajar & Berkembang
              </h2>
              <p className="illustration-text" style={{ marginTop: 6, color: "#6b7280" }}>
                Masuk untuk mengakses materi, pengumuman, jadwal, dan dokumentasi kegiatan sekolah.
              </p>
            </div>
          </div>

          {/* Right: Login form */}
          <div className="login-section" style={{ width: 420 }}>
            <div className="login-card" role="region" aria-labelledby="login-title">
              <h2 id="login-title" className="login-title">Masuk ke akunmu</h2>
              <p className="login-subtitle">
                Belum punya akun? <Link to="/register" className="register-link">Daftar</Link>
              </p>

              <form className="login-form" onSubmit={handleSubmit}>
                {error && <div className="alert-error" role="alert" style={{ marginBottom: 12 }}>{error}</div>}

                <div className="input-group">
                  <label htmlFor="email" className="input-label">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    required
                    autoComplete="username"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="password" className="input-label">Password</label>
                  <div className="password-wrapper">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                      aria-label="toggle password"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <button className="submit-btn" type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Masuk"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
