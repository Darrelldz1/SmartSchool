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

  // determine editId from either params or navigation state
  const editId = params.id || (location.state && location.state.editId) || null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    // protect: only admin or guru should access
    if (user && !['admin', 'guru'].includes(user.role)) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!editId) return;
    let mounted = true;
    setLoadingInitial(true);
    setErr(null);

    axios
      .get(`${API_BASE}/api/pengumuman/${editId}`)
      .then((res) => {
        if (!mounted) return;
        const data = res.data;
        setTitle(data.title || '');
        setDescription(data.description || '');
      })
      .catch((e) => {
        console.error('load pengumuman err', e);
        if (mounted) setErr('Gagal memuat data pengumuman untuk diedit');
      })
      .finally(() => mounted && setLoadingInitial(false));

    return () => {
      mounted = false;
    };
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!title.trim()) {
      setErr('Judul wajib diisi');
      return;
    }
    if (!description.trim()) {
      setErr('Deskripsi wajib diisi');
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        // update
        await axios.put(`${API_BASE}/api/pengumuman/${editId}`, {
          title,
          description,
        });
        alert('Pengumuman berhasil diperbarui');
      } else {
        // create
        await axios.post(`${API_BASE}/api/pengumuman`, { title, description });
        alert('Pengumuman berhasil dibuat');
      }
      navigate('/admin/pengumumanadmin');
    } catch (error) {
      console.error('submit pengumuman err', error);
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        'Terjadi kesalahan saat menyimpan';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="pengumuman-form-container">
      <div className="pengumuman-form-wrapper">
        {/* Header */}
        <div className="pengumuman-form-header">
          <h1>{editId ? 'Edit Pengumuman' : 'Tambah Pengumuman'}</h1>
          <button
            onClick={() => navigate('/admin/pengumumanadmin')}
            className="btn-pengumuman-back"
          >
            ← Kembali
          </button>
        </div>

        {/* Loading Initial State */}
        {loadingInitial ? (
          <div className="pengumuman-form-loading-overlay">
            <div className="pengumuman-loading-spinner"></div>
            <p>Memuat data...</p>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="pengumuman-form-content">
            {/* Error Message */}
            {err && <div className="pengumuman-form-error">{err}</div>}

            {/* Title Input */}
            <div className="pengumuman-form-group">
              <label className="pengumuman-form-label">
                Judul Pengumuman <span style={{ color: '#fc5c65' }}>*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="pengumuman-text-input"
                placeholder="Masukkan judul pengumuman"
                required
              />
            </div>

            {/* Description Input */}
            <div className="pengumuman-form-group">
              <label className="pengumuman-form-label">
                Deskripsi <span style={{ color: '#fc5c65' }}>*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="pengumuman-textarea"
                placeholder="Masukkan isi pengumuman"
                required
              />
            </div>

            {/* Submit Buttons */}
            <div className="pengumuman-form-submit-section">
              <button
                type="submit"
                disabled={loading}
                className="btn-pengumuman-submit"
              >
                {loading
                  ? 'Menyimpan...'
                  : editId
                  ? 'Simpan Perubahan'
                  : 'Buat Pengumuman'}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="btn-pengumuman-cancel"
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}