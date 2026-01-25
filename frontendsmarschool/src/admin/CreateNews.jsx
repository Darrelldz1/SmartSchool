// src/components/CreateNews.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function CreateNews() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', content: '', tanggal: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('File harus berupa gambar (JPG, PNG, GIF atau WEBP).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Ukuran gambar maksimal 5MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setError('');
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setImagePreview(url);
    setImageFile(file);
  };

  const removeImage = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openFileDialog = () => {
    if (fileInputRef.current && !loading) fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploadProgress(0);

    if (!form.title.trim() || !form.content.trim()) {
      setError('Judul dan konten wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      const tanggalValue = form.tanggal || new Date().toISOString().split('T')[0];
      formData.append('tanggal', tanggalValue);

      if (imageFile) formData.append('gambar', imageFile); // field name 'gambar'

      // NOTE: tidak mengirim Authorization header (public)
      await axios.post(`${API_BASE}/api/news`, formData, {
        headers: { /* browser akan set multipart/form-data boundary otomatis */ },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      });

      setSuccess('Berita berhasil dibuat!');
      setForm({ title: '', content: '', tanggal: '' });
      removeImage();
      setTimeout(() => navigate('/admin/newslist'), 800);
    } catch (err) {
      console.error('create news err', err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Gagal membuat berita.';
      setError(msg);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // --- Return JSX (sama seperti yang Anda pakai) ---
  return (
    <div className="edit-news-container">
      <div className="edit-news-wrapper">
        <div className="edit-news-header">
          <h1>Tambah Berita Baru</h1>
          <button type="button" onClick={() => navigate('/admin/newslist')} className="btn-news-back">← Kembali</button>
        </div>

        {error && <div className="news-form-error">{error}</div>}
        {success && <div className="news-form-success">{success}</div>}

        <form onSubmit={handleSubmit} className="edit-news-form" encType="multipart/form-data">
          {/* title */}
          <div className="news-form-group">
            <label className="news-form-label required">Judul Berita</label>
            <input name="title" value={form.title} onChange={handleChange} className="news-text-input" required disabled={loading} />
          </div>

          {/* tanggal */}
          <div className="news-form-group">
            <label className="news-form-label">Tanggal Publikasi</label>
            <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="news-text-input" disabled={loading} />
            <p className="news-help-text">Kosongkan untuk menggunakan tanggal hari ini</p>
          </div>

          {/* gambar */}
          <div className="news-form-group">
            <label className="news-form-label">Gambar Berita (opsional)</label>
            <div onClick={openFileDialog} role="button" tabIndex={0} style={{ position: 'relative', minHeight:120, border:'1px dashed #ddd', padding:12, display:'flex', alignItems:'center', justifyContent:'center', cursor: loading ? 'not-allowed' : 'pointer' }}>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} disabled={loading} style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0 }} />
              {!imagePreview ? (
                <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
                  <div style={{ fontSize:36 }}>📷</div>
                  <div style={{ fontWeight:600 }}>Klik untuk upload gambar</div>
                  <div style={{ fontSize:13 }}>JPG, PNG, GIF, WEBP (Max. 5MB)</div>
                </div>
              ) : (
                <div style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth:'100%', maxHeight:250, objectFit:'contain', borderRadius:8 }} onClick={openFileDialog} />
                  <button type="button" onClick={removeImage} style={{ position:'absolute', top:10, right:10, padding:'8px 12px', background:'rgba(252,92,101,0.95)', color:'#fff', border:'none', borderRadius:6 }}>🗑️ Hapus</button>
                </div>
              )}
            </div>
            <p className="news-help-text">Upload gambar untuk berita (opsional)</p>
            {imageFile && <p className="news-help-text">File: {imageFile.name} — {(imageFile.size/1024).toFixed(2)} KB</p>}
            {loading && uploadProgress > 0 && <div style={{ marginTop:8 }}>{uploadProgress}%</div>}
          </div>

          {/* content */}
          <div className="news-form-group">
            <label className="news-form-label required">Konten Berita</label>
            <textarea name="content" value={form.content} onChange={handleChange} rows={10} required disabled={loading} className="news-textarea" />
            <p className="news-help-text"></p>
            <div className="news-char-counter">{form.content.length} karakter</div>
          </div>

          <div className="news-form-actions" style={{ display:'flex', gap:8 }}>
            <button type="submit" disabled={loading} className="btn-news-submit">{loading ? 'Menyimpan...' : 'Simpan Berita'}</button>
            <button type="button" onClick={() => navigate('/admin/newslist')} disabled={loading} className="btn-news-cancel">Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
}
