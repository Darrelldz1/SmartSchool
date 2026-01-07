// src/admin/NewsList.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './newslist.css';

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
      await axios.delete(`http://localhost:5000/api/news/${id}`);
      load();
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus berita (cek console)');
    }
  };

  if (loading) {
    return (
      <div className="news-list-container">
        <div className="news-list-wrapper">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Memuat data berita...</p>
          </div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="news-list-container">
        <div className="news-list-wrapper">
          <div className="error-state">
            <p>⚠️ {err}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="news-list-container">
      <div className="news-list-wrapper">
        {/* Header */}
        <div className="news-list-header">
          <h1>Daftar Berita</h1>
          <Link to="/admin/createnews" className="btn-add-news">
            Tambah Berita
          </Link>
        </div>

        {/* Table */}
        {news.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📰</div>
            <div className="empty-state-text">Belum ada berita</div>
            <div className="empty-state-subtext">Klik tombol "Tambah Berita" untuk membuat berita baru</div>
          </div>
        ) : (
          <div className="news-table-wrapper">
            <table className="news-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Judul</th>
                  <th>Tanggal</th>
                  <th>Gambar</th>
                  <th>Deskripsi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <div className="news-title">
                        {item.title || item.judul}
                      </div>
                    </td>
                    <td>
                      <div className="news-date">
                        {item.created_at 
                          ? new Date(item.created_at).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })
                          : (item.tanggal || '-')}
                      </div>
                    </td>
                    <td>
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.title} 
                          className="news-image-preview" 
                        />
                      ) : (
                        <div className="news-image-placeholder">
                          No Image
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="news-description-text">
                        {(item.description || item.content || item.deskripsi || '').slice(0, 120)}
                        {(item.description || item.content || item.deskripsi || '').length > 120 && '...'}
                      </div>
                    </td>
                    <td>
                      <div className="news-actions">
                        <Link 
                          to={`/admin/editnews/${item.id}`} 
                          className="btn-edit"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="btn-delete"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}