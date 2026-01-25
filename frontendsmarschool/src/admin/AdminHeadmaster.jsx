// src/admin/AdminHeadmaster.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function AdminHeadmaster() {
  const { user } = useAuth() || {};
  const token = user?.token || user?.accessToken || localStorage.getItem('token') || null;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [row, setRow] = useState(null);
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    let mounted = true;
    setLoading(true);
    fetch(`${API_BASE}/api/headmaster`)
      .then(res => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!mounted) return;
        setRow(data);
        setName(data?.name || '');
        setGreeting(data?.greeting || '');
      })
      .catch(e => { console.error('load headmaster err', e); if (mounted) setErr(e.message || 'Gagal memuat'); })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    if (!greeting.trim()) { setErr('Sambutan wajib diisi'); return; }

    setSaving(true);
    try {
      // if row exists -> PUT, otherwise POST (but ideally admin only edits)
      const fd = new FormData();
      fd.append('name', name);
      fd.append('greeting', greeting);
      if (photoFile) fd.append('photo', photoFile);

      const headers = { 'Authorization': token ? `Bearer ${token}` : '' };

      let res;
      if (row && row.id) {
        res = await axios.put(`${API_BASE}/api/headmaster/${row.id}`, fd, { headers });
      } else {
        // create (in case you want create from admin UI) -- server allows POST without auth
        res = await axios.post(`${API_BASE}/api/headmaster`, fd, { headers });
      }
      alert('Sambutan berhasil disimpan');
      // reload
      const d = res.data;
      setRow(d);
      setName(d.name || '');
      setGreeting(d.greeting || '');
    } catch (err) {
      console.error('save headmaster err', err);
      setErr(err?.response?.data?.error || err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Memuat...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sambutan Kepala Sekolah</h1>
        <div>
          <button onClick={() => navigate('/admin')} className="mr-2 px-3 py-2 rounded bg-gray-200">Kembali</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
        <div className="mb-3">
          <label className="block font-semibold mb-1">Nama</label>
          <input className="w-full border p-2 rounded" value={name} onChange={(e)=>setName(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1">Sambutan</label>
          <textarea rows={8} className="w-full border p-2 rounded" value={greeting} onChange={(e)=>setGreeting(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1">Foto / Tanda Tangan (opsional)</label>
          <input type="file" accept="image/*" onChange={(e)=>setPhotoFile(e.target.files[0])} />
          {row?.photo_url && (
            <div style={{ marginTop: 8 }}>
              <img src={row.photo_url} alt="existing" style={{ width: 180, borderRadius: 8 }} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded">
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button type="button" onClick={() => { setName(row?.name || ''); setGreeting(row?.greeting || ''); setPhotoFile(null); }} className="px-4 py-2 bg-gray-200 rounded">Reset</button>
        </div>

        {err && <div className="mt-3 text-red-600">{err}</div>}
      </form>
    </div>
  );
}
