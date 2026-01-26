// src/admin/PengumumanForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthProvider';
import './pengumuman.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function PengumumanForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { user } = useAuth() || {};

  // ambil id edit dari params (route) atau dari state navigation
  const editId = params.id || (location.state && location.state.editId) || null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [err, setErr] = useState(null);

  // Ambil token dari user context atau localStorage fallback
  const token = user?.token || user?.accessToken || localStorage.getItem('token') || null;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // role guard: jika user tersedia dan bukan admin/guru -> redirect
  useEffect(() => {
    if (user && !['admin', 'guru'].includes(user.role)) {
      navigate('/', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  // ambil data pengumuman jika editId ada
  useEffect(() => {
    if (!editId) {
      // reset form saat create
      setTitle('');
      setDescription('');
      return;
    }

    let mounted = true;
    setLoadingInitial(true);
    setErr(null);

    axios
      .get(`${API_BASE}/api/pengumuman/${editId}`, { headers: authHeaders })
      .then((res) => {
        if (!mounted) return;
        const data = res.data || {};
        setTitle(data.title || '');
        setDescription(data.description || '');
      })
      .catch((e) => {
        console.error('Gagal memuat pengumuman:', e);
        if (mounted) {
          if (e.response && e.response.status === 404) {
            setErr('Data pengumuman tidak ditemukan.');
          } else if (e.response && e.response.status === 401) {
            setErr('Anda tidak memiliki akses. Silakan login ulang.');
          } else {
            setErr('Gagal memuat data pengumuman untuk diedit.');
          }
        }
      })
      .finally(() => {
        if (mounted) setLoadingInitial(false);
      });

    return () => {
      mounted = false;
    };
    // depend pada editId dan token (authHeaders berubah jika token berubah)
  }, [editId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    // simple validation
    if (!title.trim()) {
      setErr('Judul wajib diisi.');
      return;
    }
    if (!description.trim()) {
      setErr('Deskripsi wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
      };

      if (editId) {
        // update pengumuman
        await axios.put(`${API_BASE}/api/pengumuman/${editId}`, payload, {
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
        });
        alert('Pengumuman berhasil diperbarui.');
      } else {
        // create new pengumuman
        await axios.post(`${API_BASE}/api/pengumuman`, payload, {
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
        });
        alert('Pengumuman berhasil dibuat.');
      }

      // kembali ke daftar pengumuman admin
      navigate('/admin/pengumuman', { replace: true });
    } catch (error) {
      console.error('Error simpan pengumuman:', error);
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Terjadi kesalahan saat menyimpan.';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // jika datang dari daftar, kembali ke daftar
    navigate('/admin/pengumuman');
  };

  return (
    <div className="pengumuman-form-container">
      <div className="pengumuman-form-wrapper" role="region" aria-labelledby="pengumuman-heading">
        <div className="pengumuman-form-header">
          <h1 id="pengumuman-heading">{editId ? 'Edit Pengumuman' : 'Tambah Pengumuman'}</h1>
          <button onClick={() => navigate('/admin/pengumuman')} className="btn-pengumuman-back" aria-label="Kembali ke daftar">
            ← Kembali
          </button>
        </div>

        {loadingInitial ? (
          <div className="pengumuman-form-loading-overlay" role="status" aria-live="polite">
            <div className="pengumuman-loading-spinner" />
            <p>Memuat data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pengumuman-form-content" aria-describedby="pengumuman-help">
            {err && <div className="pengumuman-form-error" role="alert">{err}</div>}

            <div className="pengumuman-form-group">
              <label className="pengumuman-form-label" htmlFor="pengumuman-title">
                Judul Pengumuman <span className="required-star">*</span>
              </label>
              <input
                id="pengumuman-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="pengumuman-text-input"
                placeholder="Masukkan judul pengumuman"
                required
                disabled={loading}
                aria-required="true"
              />
            </div>

            <div className="pengumuman-form-group">
              <label className="pengumuman-form-label" htmlFor="pengumuman-desc">
                Deskripsi <span className="required-star">*</span>
              </label>
              <textarea
                id="pengumuman-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="pengumuman-textarea"
                placeholder="Masukkan isi pengumuman"
                required
                disabled={loading}
                aria-required="true"
                rows={8}
              />
            </div>

            <div className="pengumuman-form-submit-section">
              <button type="submit" disabled={loading} className="btn-pengumuman-submit" aria-disabled={loading}>
                {loading ? 'Menyimpan...' : editId ? 'Simpan Perubahan' : 'Buat Pengumuman'}
              </button>

              <button type="button" onClick={handleCancel} className="btn-pengumuman-cancel">
                Batal
              </button>
            </div>

            <p id="pengumuman-help" className="pengumuman-help">
              Pastikan judul dan deskripsi jelas. Gunakan bahasa yang mudah dimengerti.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
