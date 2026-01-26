// src/admin/PengumumanAdmin.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthProvider';
import './pengumuman.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function PengumumanAdmin() {
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await axios.get(`${API_BASE}/api/pengumuman`);
      setItems(res.data || []);
    } catch (error) {
      console.error('load pengumuman err', error);
      setErr('Gagal memuat pengumuman');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = () => {
    navigate('/admin/Pengumuman/new'); // form create
  };

  const handleEdit = (id) => {
    // navigate to form with state.editId
    navigate('/admin/Pengumuman/new', { state: { editId: id } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus pengumuman ini?')) return;
    try {
      await axios.delete(`${API_BASE}/api/pengumuman/${id}`);
      alert('Pengumuman dihapus');
      load();
    } catch (error) {
      console.error('delete pengumuman err', error);
      const msg = error?.response?.data?.error || 'Gagal menghapus pengumuman';
      alert(msg);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="pengumuman-list-container">
        <div className="pengumuman-list-wrapper">
          <div className="pengumuman-loading-state">
            <div className="pengumuman-loading-spinner"></div>
            <p>Memuat daftar pengumuman...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (err) {
    return (
      <div className="pengumuman-list-container">
        <div className="pengumuman-list-wrapper">
          <div className="pengumuman-error-state">
            <p>{err}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pengumuman-list-container">
      <div className="pengumuman-list-wrapper">
        {/* Header */}
        <div className="pengumuman-list-header">
          <h1>Pengumuman</h1>
          {(user && (user.role === 'admin' || user.role === 'guru')) && (
            <button onClick={handleCreate} className="btn-add-pengumuman">
              Tambah Pengumuman
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="pengumuman-empty-state">
            <div className="pengumuman-empty-icon">📢</div>
            <div className="pengumuman-empty-text">Belum ada pengumuman</div>
            <div className="pengumuman-empty-subtext">
              Klik tombol "Tambah Pengumuman" untuk membuat pengumuman pertama
            </div>
          </div>
        ) : (
          /* Table */
          <div className="pengumuman-table-wrapper">
            <table className="pengumuman-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Judul</th>
                  <th>Deskripsi</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map(it => (
                  <tr key={it.id}>
                    <td>{it.id}</td>
                    <td>
                      <div className="pengumuman-title">{it.title}</div>
                    </td>
                    <td>
                      <div className="pengumuman-description-text">
                        {(it.description || '').slice(0, 120)}
                        {(it.description && it.description.length > 120) ? '...' : ''}
                      </div>
                    </td>
                    <td>
                      <div className="pengumuman-date">
                        {it.created_at 
                          ? new Date(it.created_at).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '-'}
                      </div>
                    </td>
                    <td>
                      <div className="pengumuman-actions">
                        {(user && (user.role === 'admin' || user.role === 'guru')) && (
                          <button 
                            onClick={() => handleEdit(it.id)} 
                            className="btn-pengumuman-edit"
                          >
                            Edit
                          </button>
                        )}
                        {user && user.role === 'admin' && (
                          <button 
                            onClick={() => handleDelete(it.id)} 
                            className="btn-pengumuman-delete"
                          >
                            Hapus
                          </button>
                        )}
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