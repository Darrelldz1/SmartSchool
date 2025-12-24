import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE = 'http://localhost:5000/api';
function authHeaders() { const t = localStorage.getItem('token'); return t ? { Authorization: `Bearer ${t}` } : {}; }

export default function CreateNews(){
  const nav = useNavigate();
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [image,setImage] = useState(null);
  const [loading,setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      if (image) fd.append('image', image);

      await axios.post(`${BASE}/news`, fd, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } });
      alert('Berita berhasil dibuat');
      nav('/teacher/news');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Gagal membuat berita');
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl mb-4">Tambah Berita</h1>
      <form onSubmit={submit} className="space-y-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Judul" required className="w-full border p-2" />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Deskripsi" required className="w-full border p-2 h-40" />
        <input type="file" accept="image/*" onChange={e=>setImage(e.target.files[0])} />
        <button disabled={loading} className="btn-add">{loading ? 'Menyimpan...' : 'Simpan'}</button>
      </form>
    </div>
  );
}
