import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const BASE = 'http://localhost:5000/api';
function authHeaders() { const t = localStorage.getItem('token'); return t ? { Authorization: `Bearer ${t}` } : {}; }

export default function TeacherNewsList(){
  const [news, setNews] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{ load(); },[]);
  async function load(){
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/news`, { headers: authHeaders() });
      setNews(res.data || []);
    } catch(err){
      console.error(err);
      setNews([]);
    } finally { setLoading(false); }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus berita ini?')) return;
    try {
      await axios.delete(`${BASE}/news/${id}`, { headers: authHeaders() });
      load();
    } catch(err){ console.error(err); alert('Gagal menghapus'); }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  return (
    <div className="p-6">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <h1 className="text-2xl font-bold">Kelola Berita</h1>
        <Link to="/teacher/news/create" className="btn-add">Tambah Berita</Link>
      </div>

      <table className="data-table">
        <thead><tr><th>ID</th><th>Judul</th><th>Tanggal</th><th>Aksi</th></tr></thead>
        <tbody>
          {news.map(n=>(
            <tr key={n.id}>
              <td>{n.id}</td>
              <td>{n.title}</td>
              <td>{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</td>
              <td>
                <Link to={`/teacher/news/edit/${n.id}`} className="btn-action edit">Edit</Link>
                <button onClick={()=>handleDelete(n.id)} className="btn-action delete">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
