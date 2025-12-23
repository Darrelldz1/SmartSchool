// src/admin/CreateNews.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateNews() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', gambar: '', tanggal: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        content: form.content + (form.gambar ? `<p><img src="${form.gambar}" /></p>` : ''),
        // jika backend butuh tanggal/gambar fields, tambahkan sesuai DB
      };
      await axios.post('http://localhost:5000/api/news', payload);
      alert('Berita berhasil dibuat');
      navigate('/admin/newslist');
    } catch (err) {
      console.error(err);
      alert('Gagal membuat berita (cek console)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Tambah Berita</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Judul Berita" className="border px-3 py-2 w-full" required />
        <input name="tanggal" value={form.tanggal} onChange={handleChange} type="date" className="border px-3 py-2 w-full" />
        <input name="gambar" value={form.gambar} onChange={handleChange} placeholder="Link Gambar (opsional)" className="border px-3 py-2 w-full" />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="Isi Berita (HTML diperbolehkan)" className="border px-3 py-2 w-full" rows="8" required />
        <div>
          <button type="submit" disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded">
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}
