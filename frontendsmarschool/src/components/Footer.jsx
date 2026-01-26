import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [logoIndex, setLogoIndex] = useState(0);
  const [logoSrc, setLogoSrc] = useState('');
  const [logoFailed, setLogoFailed] = useState(false);

  const logoCandidates = [
    '/logo-smartschool.png',
    '/logo smartschool.png',
    '/logo%20smartschool.png',
    '/logo smartschool asli.png',
    '/logo%20smartschool%20asli.png',
    '/logo-smartschool-asli.png',
  ];

  const footerLogos = {
    maps: '/logo alamat putih.png',
    telepon: '/telepon white.png',
    email: '/gmail white.png',
    instagram: '/instagram white.png',
    facebook: '/logo facebook putih.png',
    youtube: '/youtube white.png'
  };

  useEffect(() => {
    setLogoSrc(logoCandidates[logoIndex] || '');
  }, [logoIndex]);

  const handleLogoError = () => {
    const next = logoIndex + 1;
    if (next < logoCandidates.length) {
      setLogoIndex(next);
    } else {
      setLogoFailed(true);
    }
  };

  const encodeURI = (path) => path;

  return (
    <footer className="footer" style={{background: '#00124b', position: 'relative'}}>
      <div className="footer-content" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '3rem 2rem 2rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
        textAlign: 'left'
      }}>
        
        {/* Kolom 1: Logo & Deskripsi */}
        <div className="footer-column" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
            {!logoFailed ? (
              <img
                src={logoSrc}
                alt="Smart School"
                onError={handleLogoError}
                style={{ width: 96, height: 56, objectFit: 'contain', borderRadius: 8 }}
              />
            ) : (
              <div style={{
                width: 96, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#eef2ff', borderRadius: 8, fontWeight: 800, color: '#4f46e5'
              }}>S</div>
            )}
          </div>
          <p style={{ 
            color: '#bfdbfe', 
            lineHeight: 1.6,
            textAlign: 'left',
            margin: 0
          }}>
            Membentuk generasi unggul yang berakhlak mulia dan berdaya saing tinggi untuk masa depan Indonesia.
          </p>
        </div>

        {/* Kolom 2: Hubungi Kami */}
        <div className="footer-column" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <h3 className="footer-title" style={{
            color: '#fff',
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            textAlign: 'left',
            width: '100%'
          }}>
            Hubungi Kami
          </h3>
          <div className="contact-list" style={{display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%'}}>
            
            {/* Alamat */}
            <div className="contact-item" style={{display: 'flex', gap: '1rem', alignItems: 'flex-start'}}>
              <div style={{ 
                width: 24, 
                height: 24, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src={encodeURI(footerLogos.maps)} 
                  alt="Alamat" 
                  style={{ width: 24, height: 24, objectFit: 'contain' }}
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
              <div style={{textAlign: 'left'}}>
                <div style={{ fontWeight: 600, marginBottom: 4, color: '#fff' }}>
                  Alamat
                </div>
                <p style={{ 
                  color: '#bfdbfe', 
                  margin: 0,
                  lineHeight: 1.5,
                  textAlign: 'left'
                }}>
                  Jl. Pendidikan No. 123, Jakarta
                </p>
              </div>
            </div>
            
            {/* Telepon */}
            <div className="contact-item" style={{display: 'flex', gap: '1rem', alignItems: 'flex-start'}}>
              <div style={{ 
                width: 24, 
                height: 24, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src={encodeURI(footerLogos.telepon)} 
                  alt="Telepon" 
                  style={{ width: 24, height: 24, objectFit: 'contain' }}
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
              <div style={{textAlign: 'left'}}>
                <div style={{ fontWeight: 600, marginBottom: 4, color: '#fff' }}>Telepon</div>
                <p style={{ 
                  color: '#bfdbfe', 
                  margin: 0,
                  lineHeight: 1.5,
                  textAlign: 'left'
                }}>
                  +62 231 236648
                </p>
              </div>
            </div>
            
            {/* Email */}
            <div className="contact-item" style={{display: 'flex', gap: '1rem', alignItems: 'flex-start'}}>
              <div style={{ 
                width: 24, 
                height: 24, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src={encodeURI(footerLogos.email)} 
                  alt="Email" 
                  style={{ width: 24, height: 24, objectFit: 'contain' }}
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
              <div style={{textAlign: 'left'}}>
                <div style={{ fontWeight: 600, marginBottom: 4, color: '#fff' }}>Email</div>
                <p style={{ 
                  color: '#bfdbfe', 
                  margin: 0,
                  lineHeight: 1.5,
                  textAlign: 'left'
                }}>
                  info@smartschool.id
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom 3: Media Sosial */}
        <div className="footer-column" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <h3 className="footer-title" style={{
            color: '#fff',
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            textAlign: 'left',
            width: '100%'
          }}>
            Media Sosial
          </h3>
          <div className="social-list" style={{display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%'}}>
            
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/citrasolusi.id" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'flex', 
                gap: '1rem', 
                alignItems: 'center',
                cursor: 'pointer',
                textAlign: 'left',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div style={{ 
                width: 24, 
                height: 24, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src={encodeURI(footerLogos.instagram)} 
                  alt="Instagram" 
                  style={{ width: 24, height: 24, objectFit: 'contain' }}
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
              <p style={{ 
                color: '#bfdbfe', 
                margin: 0,
                lineHeight: 1.5,
                textAlign: 'left'
              }}>
                Instagram: @smartschool
              </p>
            </a>
            
            {/* Facebook */}
            <a 
              href="https://www.facebook.com/citrasolusi.id" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'flex', 
                gap: '1rem', 
                alignItems: 'center',
                cursor: 'pointer',
                textAlign: 'left',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div style={{ 
                width: 24, 
                height: 24, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src={encodeURI(footerLogos.facebook)} 
                  alt="Facebook" 
                  style={{ width: 24, height: 24, objectFit: 'contain' }}
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
              <p style={{ 
                color: '#bfdbfe', 
                margin: 0,
                lineHeight: 1.5,
                textAlign: 'left'
              }}>
                Facebook: Smart School
              </p>
            </a>
            
            {/* YouTube */}
            <a 
              href="https://youtube.com/@citraweb?si=_n7t7t0AtbLxu8CA" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'flex', 
                gap: '1rem', 
                alignItems: 'center',
                cursor: 'pointer',
                textAlign: 'left',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div style={{ 
                width: 24, 
                height: 24, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src={encodeURI(footerLogos.youtube)} 
                  alt="YouTube" 
                  style={{ width: 24, height: 24, objectFit: 'contain' }}
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
              <p style={{ 
                color: '#bfdbfe', 
                margin: 0,
                lineHeight: 1.5,
                textAlign: 'left'
              }}>
                YouTube: Smart School
              </p>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom" style={{
        padding: '1.5rem 2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.875rem',
        textAlign: 'center',
        marginTop: '2rem'
      }}>
        <p style={{ margin: 0 }}>
          © 2024 Smart School. All Rights Reserved. Powered by Citrasolusi.id
        </p>
      </div>
    </footer>
  );
};

export default Footer;