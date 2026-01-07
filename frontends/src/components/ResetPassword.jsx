import React, { useState } from 'react';
import './reset.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!email) {
      setMessage('Masukkan email Anda');
      return;
    }
    
    setIsLoading(true);
    // Simulasi pengiriman email
    setTimeout(() => {
      setIsLoading(false);
      setMessage('Link reset password telah dikirim ke email Anda');
      setEmail('');
    }, 2000);
  };

  const handleBackToLogin = () => {
    // Navigate back to login page
    console.log('Navigate to login');
  };

  return (
    <div className="reset-container">
      {/* Header */}
      <header className="reset-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <span className="graduation-cap">🎓</span>
            </div>
            <span className="logo-text">
              <span className="smart">SMART</span>
              <span className="school">SCHOOL</span>
            </span>
          </div>
          <nav className="nav-menu">
            <a href="#beranda">Beranda</a>
            <a href="#profil">Profil</a>
            <a href="#galeri">Galeri</a>
            <a href="#pengumuman">Pengumuman</a>
            <a href="#daftar">Daftar</a>
            <button className="btn-masuk">MASUK</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="reset-main">
        <div className="reset-card">
          <div className="shield-icon">
            <div className="shield">
              <div className="shield-inner">
                <div className="lock-icon">
                  <div className="lock-body"></div>
                  <div className="lock-shackle"></div>
                </div>
                <div className="checkmark">✓</div>
              </div>
            </div>
          </div>

          <div className="reset-form-container">
            <h2 className="reset-title">Reset Password</h2>
            
            <button className="back-to-login" onClick={handleBackToLogin}>
              ← Kembali ke Login
            </button>

            <div className="reset-form">
              <div className="form-group">
                <label htmlFor="email">Masukan Email / No. handphone</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email atau nomor handphone"
                  className="form-input"
                />
              </div>

              {message && (
                <div className={`message ${message.includes('dikirim') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              <p className="helper-text">
                Anda akan mendapatkan kode token melalui email
              </p>

              <button 
                type="button"
                onClick={handleSubmit}
                className="btn-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Mengirim...' : 'KIRIM KODE OTP'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="reset-footer">
        <p>@smartschool.id - All Right Reserved ©travoluasi.id</p>
      </footer>
    </div>
  );
};

// CSS Styles
const styles = `
/* Reset & Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.reset-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header Styles */
.reset-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 15px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.graduation-cap {
  font-size: 24px;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.smart {
  color: #2563eb;
  font-weight: bold;
  font-size: 18px;
}

.school {
  color: #f97316;
  font-weight: bold;
  font-size: 18px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-menu a {
  text-decoration: none;
  color: #374151;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-menu a:hover {
  color: #2563eb;
}

.btn-masuk {
  background: #60a5fa;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-masuk:hover {
  background: #3b82f6;
}

/* Main Content */
.reset-main {
  flex: 1;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.reset-card {
  display: flex;
  gap: 60px;
  align-items: center;
  max-width: 900px;
  width: 100%;
}

/* Shield Icon */
.shield-icon {
  flex-shrink: 0;
}

.shield {
  width: 280px;
  height: 320px;
  position: relative;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  border-radius: 0 0 140px 140px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
}

.shield::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 100px;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  border-radius: 160px 160px 0 0;
}

.shield-inner {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.lock-icon {
  position: relative;
  width: 80px;
  height: 80px;
  background: #1e40af;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-body {
  width: 60px;
  height: 45px;
  background: #1e293b;
  border-radius: 8px;
  position: absolute;
  bottom: 10px;
}

.lock-shackle {
  width: 40px;
  height: 35px;
  border: 8px solid #1e293b;
  border-bottom: none;
  border-radius: 20px 20px 0 0;
  position: absolute;
  top: 5px;
}

.checkmark {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 30px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
}

/* Form Container */
.reset-form-container {
  flex: 1;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.reset-title {
  font-size: 24px;
  color: #1e293b;
  margin-bottom: 20px;
  font-weight: 600;
}

.back-to-login {
  background: none;
  border: none;
  color: #f97316;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.3s;
}

.back-to-login:hover {
  color: #ea580c;
}

.reset-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  background: #f8fafc;
}

.form-input:focus {
  outline: none;
  border-color: #60a5fa;
  background: white;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.helper-text {
  font-size: 13px;
  color: #64748b;
  margin-top: -10px;
}

.message {
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 14px;
  margin: 10px 0;
}

.message.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.message.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.btn-submit {
  background: #60a5fa;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 1px;
  margin-top: 10px;
}

.btn-submit:hover:not(:disabled) {
  background: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Footer */
.reset-footer {
  background: white;
  padding: 20px;
  text-align: center;
  border-top: 1px solid #e2e8f0;
}

.reset-footer p {
  color: #64748b;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .reset-card {
    flex-direction: column;
    gap: 30px;
  }
  
  .shield {
    width: 200px;
    height: 230px;
  }
  
  .shield::before {
    width: 230px;
    height: 70px;
  }
  
  .reset-form-container {
    width: 100%;
    max-width: 400px;
  }
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ResetPassword;