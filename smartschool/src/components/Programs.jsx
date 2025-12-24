// src/components/Programs.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function Programs() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${API_BASE}/api/program`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => { if (!mounted) return; setPrograms(Array.isArray(data) ? data : []); })
      .catch(e => { console.error('fetch programs err', e); if (mounted) setErr('Gagal memuat program'); })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Memuat program...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Program Unggulan</h1>
      {programs.length === 0 ? (
        <div>Belum ada program.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map(p => (
            <div key={p.id} className="bg-white rounded shadow p-4">
              {p.image && <img src={(p.image.startsWith('http') ? p.image : `${API_BASE}${p.image.startsWith('/') ? '' : '/'}${p.image}`)} alt={p.title} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 6 }} />}
              <h3 className="font-bold mt-2">{p.title}</h3>
              <p className="text-sm text-gray-600">{(p.description || '').slice(0, 140)}{(p.description && p.description.length > 140) ? '...' : ''}</p>
              <div className="mt-3">
                <button onClick={() => navigate(`/programs/${p.id}`)} className="px-3 py-1 bg-blue-600 text-white rounded">Lihat Detail</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
