// src/admin/ProgramForm.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthProvider';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function ProgramForm() {
  const { id } = useParams(); // id => edit mode
  const navigate = useNavigate();
  const { token, user } = useAuth() || {};

  const [form, setForm] = useState({
    title: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef(null);

  // load existing program if edit
  useEffect(() => {
    let mounted = true;
    if (!id) return;
    setLoading(true);
    axios.get(`${API_BASE}/api/program/${id}`)
      .then(res => {
        if (!mounted) return;
        const p = res.data;
        setForm({
          title: p.title || '',
          description: p.description || ''
        });
        if (p.image) {
          setExistingImage(p.image.startsWith('http') ? p.image : `${API_BASE}${p.image.startsWith('/') ? '' : '/'}${p.image}`);
        }
      })
      .catch(err => {
        console.error('load program err', err);
        alert('Gagal memuat data program.');
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // file change
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] ?? null;
    if (!selected) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    const allowed = ['image/jpeg','image/png','image/gif','image/webp'];
    if (!allowed.includes(selected.type)) {
      alert('Format file tidak didukung. Gunakan JPG/PNG/GIF/WEBP.');
      e.target.value = '';
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB.');
      e.target.value = '';
      return;
    }
    setFile(selected);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // optional frontend permission
    if (!user || !(user.role === 'admin' || user.role === 'guru')) {
      alert('Anda tidak memiliki izin.');
      return;
    }

    if (!form.title.trim() || !form.description.trim()) {
      alert('Judul dan deskripsi wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      if (file) fd.append('image', file); // backend should accept 'image' field

      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      if (id) {
        // edit
        await axios.put(`${API_BASE}/api/program/${id}`, fd, { headers });
        alert('Program berhasil diperbarui.');
      } else {
        // create
        await axios.post(`${API_BASE}/api/program`, fd, { headers });
        alert('Program berhasil dibuat.');
      }
      navigate('/admin/program');
    } catch (err) {
      console.error('submit program err', err);
      const msg = err?.response?.data?.error || err.message || 'Gagal menyimpan program';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="program-form-container" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>{id ? 'Edit Program Unggulan' : 'Tambah Program Unggulan'}</h2>
        <button onClick={() => navigate(-1)}>← Kembali</button>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Judul</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="input"
            placeholder="Judul program"
            disabled={loading}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Deskripsi</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            className="textarea"
            placeholder="Deskripsi singkat program"
            disabled={loading}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Gambar (opsional)</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
          <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>Format JPG/PNG/GIF/WEBP, max 5MB</div>
        </div>

        {existingImage && !previewUrl && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ marginBottom: 6 }}>Gambar Saat Ini</div>
            <img src={existingImage} alt="existing" style={{ maxWidth: 400, borderRadius: 6 }} />
          </div>
        )}

        {previewUrl && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ marginBottom: 6 }}>Preview Gambar Baru</div>
            <img src={previewUrl} alt="preview" style={{ maxWidth: 400, borderRadius: 6 }} />
            <div style={{ marginTop: 8 }}>
              <button type="button" onClick={handleRemoveFile}>Hapus Pilihan</button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 14px', background: '#0ea5a4', color: '#fff', border: 'none', borderRadius: 6 }}>
            {loading ? 'Menyimpan...' : id ? 'Simpan Perubahan' : 'Buat Program'}
          </button>
        </div>
      </form>
    </div>
  );
}
