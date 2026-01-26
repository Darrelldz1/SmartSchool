// src/admin/ProgramAdmin.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthProvider';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function ProgramAdmin() {
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const token = user?.token || user?.accessToken || localStorage.getItem('token') || null;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const request = useCallback((opts) => {
    const headers = opts.headers ? { ...opts.headers } : {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return axios({ baseURL: API_BASE, ...opts, headers });
  }, [token]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await axios.get(`${API_BASE}/api/program`);
      setItems(res.data || []);
    } catch (error) {
      console.error('load program err', error);
      setErr('Gagal memuat program');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = () => navigate('/admin/program/new');
  const handleEdit = (id) => navigate(`/admin/program/${id}/edit`);
  const handleDelete = async (id) => {
    if (!window.confirm('Hapus program ini?')) return;
    try {
      await request({ url: `/api/program/${id}`, method: 'delete' });
      alert('Program dihapus');
      load();
    } catch (error) {
      console.error('delete program err', error);
      alert(error?.response?.data?.error || 'Gagal menghapus program');
    }
  };

  if (loading) return <div className="p-6">Memuat program...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Program Unggulan</h1>
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">Tambah Program</button>
      </div>

      {items.length === 0 ? (
        <div className="p-4">Belum ada program.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(p => (
            <div key={p.id} className="bg-white rounded shadow p-4">
              {p.image ? (
                <img src={(p.image.startsWith('http') ? p.image : `${API_BASE}${p.image.startsWith('/') ? '' : '/'}${p.image}`)} alt={p.title}
                  style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
              ) : <div style={{ width: '100%', height: 160, background: '#f3f4f6', borderRadius: 6, marginBottom: 8 }} />}
              <h3 className="font-bold">{p.title}</h3>
              <p className="text-sm text-gray-600">{(p.description || '').slice(0, 140)}{(p.description && p.description.length > 140) ? '...' : ''}</p>
              <div className="mt-3 space-x-2">
                <button onClick={() => handleEdit(p.id)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-600 text-white rounded">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
