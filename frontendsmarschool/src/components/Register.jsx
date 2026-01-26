import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import Header, { HEADER_HEIGHT } from "../components/Header";
import Footer from "./Footer";
import "./Register.css";
import illustrationAsset from "../assets/ilustrasi.png"; // optional local asset

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const illustrationCandidates = [
  "/illustration-welcome.png",
  "/illustration-school.png",
  "/illustration-login.png",
];

export default function Register() {
  const navigate = useNavigate();
  const { user, logout } = useAuth() || {};

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // illustration fallback
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Nama wajib diisi");
    if (!email.trim()) return setError("Email wajib diisi");
    if (!password || password.length < 6) return setError("Password minimal 6 karakter");
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      alert(res.data?.message || "Registrasi berhasil. Silakan login.");
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
    <div className="login-container" style={{ backgroundColor: "#f8fafc" }}>
      <Header />
      <div style={{ height: HEADER_HEIGHT }} />

      <main className="main-content">
        <div className="content-wrapper" style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem", display: "flex", gap: 24 }}>
          {/* Illustration */}
          <div className="illustration-section" style={{ flex: 1 }}>
            <div className="illustration-content">
              {!illustrationFailed ? (
                <div className="illustration-box" aria-hidden>
                  <img src={illSrc} alt="Ilustrasi SmartSchool" className="illustration-image" onError={handleIllError} style={{ width: "100%", maxWidth: 420, height: "auto", objectFit: "contain" }} />
                </div>
              ) : (
                <div className="illustration-box illustration-fallback">
                  <div style={{ padding: 20 }}>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>Selamat datang di SmartSchool</h3>
                    <p style={{ marginTop: 8, color: "#6b7280" }}>Platform untuk belajar, berbagi informasi, dan berkolaborasi bersama komunitas sekolah.</p>
                  </div>
                </div>
              )}

              <h2 className="illustration-title" style={{ marginTop: 18 }}>Bergabunglah bersama komunitas SmartSchool</h2>
              <p className="illustration-text" style={{ marginTop: 6, color: "#6b7280" }}>Daftar akun untuk mengakses materi, pengumuman, dan fitur lainnya.</p>
            </div>
          </div>

          {/* Register form */}
          <div className="login-section" style={{ width: 420 }}>
            <div className="login-card">
              <h2 className="login-title">DAFTAR</h2>
              <p className="login-subtitle">Buat akun baru di SmartSchool</p>

              <form className="login-form" onSubmit={handleSubmit}>
                {error && <div className="alert-error" style={{ marginBottom: 12 }}>{error}</div>}

                <div className="input-group">
                  <label className="input-label" htmlFor="name">Nama lengkap</label>
                  <input id="name" type="text" placeholder="Nama lengkap" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="email">Email</label>
                  <input id="email" type="email" placeholder="Masukan email anda" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="password">Password</label>
                  <div className="password-wrapper">
                    <input id="password" type={showPassword ? "text" : "password"} placeholder="Minimal 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle" aria-label="toggle password">{showPassword ? "🙈" : "👁️"}</button>
                  </div>
                </div>

                <div className="form-options" style={{ justifyContent: "center" }}>
                  <div>Sudah punya akun? <Link to="/login" className="forgot-password">Silahkan login</Link></div>
                </div>

                <button className="submit-btn" type="submit" disabled={isLoading}>{isLoading ? "Mendaftarkan..." : "DAFTAR"}</button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
