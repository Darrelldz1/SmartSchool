// src/admin/NewsList.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/news');
      setNews(res.data || []);
    } catch (error) {
      console.error(error);
      setErr('Gagal mengambil daftar berita');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus berita ini?')) return;
    try {
      // pastikan axios punya header Authorization (AuthProvider biasanya menetapkannya)
      await axios.delete(`http://localhost:5000/api/news/${id}`);
      // refresh
      load();
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus berita (cek console)');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Daftar Berita</h1>
        <Link to="/admin/createnews" className="bg-blue-500 text-white px-4 py-2 rounded">Tambah Berita</Link>
      </div>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Judul</th>
            <th className="border px-3 py-2">Tanggal</th>
            <th className="border px-3 py-2">Gambar</th>
            <th className="border px-3 py-2">Deskripsi</th>
            <th className="border px-3 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item) => (
            <tr key={item.id}>
              <td className="border px-3 py-2">{item.id}</td>
              <td className="border px-3 py-2">{item.title || item.judul}</td>
              <td className="border px-3 py-2">
                {item.created_at ? new Date(item.created_at).toLocaleDateString() : (item.tanggal || '')}
              </td>
              <td className="border px-3 py-2">
  {item.image_url ? (
    <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover" />
  ) : (
    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">—</div>
  )}
</td>
<td className="border px-3 py-2">
  {(item.description || "").slice(0, 120)}...
</td>

              <td className="border px-3 py-2">{(item.content || item.deskripsi || '').slice(0, 120)}...</td>
              <td className="border px-3 py-2 space-x-2">
                <Link to={`/admin/editnews/${item.id}`} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</Link>
                <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
