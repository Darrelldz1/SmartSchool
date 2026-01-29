import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// ambil raw base (mis. VITE_API_BASE = http://localhost:5000 atau kosong)
const RAW_API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// normalisasi: pastikan tanpa trailing slash dan tambahkan '/api'
function buildApiBase(raw) {
  if (!raw) return '/api';
  let s = raw.trim();
  if (s.endsWith('/')) s = s.slice(0, -1);
  // jika user sudah menaruh /api di env, jangan double-add
  if (s.endsWith('/api')) return s;
  return s + '/api';
}
const API_BASE = buildApiBase(RAW_API_BASE); // ex: http://localhost:5000/api

export default function SliderAdmin() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [position, setPosition] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  // baca token (sesuaikan jika penyimpanan token beda)
  const authData = (() => {
    try {
      return JSON.parse(localStorage.getItem('auth') || '{}');
    } catch (e) {
      return {};
    }
  })();
  const token = authData?.token;

  // axios client -> baseURL = http://localhost:5000/api
  const axiosClient = axios.create({
    baseURL: API_BASE,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  // log request (bantu debug)
  axiosClient.interceptors.request.use(cfg => {
    console.log('API REQ:', cfg.method?.toUpperCase(), (cfg.baseURL || '') + (cfg.url || ''));
    return cfg;
  });

  useEffect(() => {
    fetchSliders();
    // eslint-disable-next-line
  }, []);

  async function fetchSliders() {
    setLoading(true);
    try {
      const { data } = await axiosClient.get('/slider'); // GET http://.../api/slider
      setSliders(data);
    } catch (err) {
      console.error('fetch sliders err', err?.response || err);
      alert('Gagal mengambil data slider. Cek console/server log.\n' +
            (err?.response ? `${err.response.status} ${JSON.stringify(err.response.data)}` : err.message));
    } finally {
      setLoading(false);
    }
  }

  function onFileChange(e) {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  function resetForm() {
    setEditing(null);
    setPosition('');
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      if (!editing && sliders.length >= 3) {
        alert('Maksimum 3 slider diperbolehkan');
        return;
      }
      const fd = new FormData();
      if (file) fd.append('image', file);
      if (position) fd.append('position', position);

      const url = editing ? `/slider/${editing.id}` : '/slider';
      const method = editing ? 'put' : 'post';

      console.log('Sending to:', API_BASE + url);
      const res = await axiosClient[method](url, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (editing) {
        setSliders(s => s.map(x => (x.id === res.data.id ? res.data : x)));
        alert('Slider diupdate');
      } else {
        setSliders(s => [...s, res.data]);
        alert('Slider ditambahkan');
      }
      resetForm();
    } catch (err) {
      console.error('save slider err', err);
      const status = err?.response?.status;
      const body = err?.response?.data;
      alert('Gagal menyimpan slider: ' + (status ? `${status} - ${JSON.stringify(body)}` : err.message));
    }
  }

  function startEdit(slider) {
    setEditing(slider);
    setPosition(slider.position ?? '');
    setPreview(slider.image_url || null);
    setFile(null);
    if (fileRef.current) fileRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus slider ini?')) return;
    try {
      await axiosClient.delete(`/slider/${id}`);
      setSliders(s => s.filter(x => x.id !== id));
      alert('Slider dihapus');
    } catch (err) {
      console.error('delete slider err', err?.response || err);
      alert('Gagal menghapus slider. Cek console/server log.');
    }
  }

  return (
    <div className="admin-page admin-slider">
      <h1>Slider</h1>

      <section className="slider-form" style={{ marginBottom: 24 }}>
        <h2>{editing ? 'Edit Slider' : 'Tambah Slider'}</h2>
        <form onSubmit={handleCreate}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6 }}>Gambar (max 6MB)</label>
              <input type="file" accept="image/*" onChange={onFileChange} ref={fileRef} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6 }}>Posisi (1..3) - optional</label>
              <input
                type="number"
                min="1"
                max="3"
                value={position}
                onChange={e => setPosition(e.target.value)}
                placeholder="kosongkan untuk auto"
              />
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Buat'}</button>
              {editing && <button type="button" className="btn" onClick={resetForm}>Batal</button>}
            </div>

            {preview && (
              <div style={{ maxWidth: 220 }}>
                <p>Preview:</p>
                <img src={preview} alt="preview" style={{ maxWidth: '100%', borderRadius: 6, border: '1px solid #ddd' }} />
              </div>
            )}
          </div>
        </form>
      </section>

      <section className="slider-list">
        <h2>Daftar Slider ({sliders.length})</h2>
        {loading ? <p>Memuat...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr><th>ID</th><th>Gambar</th><th>Posisi</th><th>Created</th><th>Updated</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {sliders.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.image_url ? <img src={s.image_url} alt={`slider-${s.id}`} style={{ height: 60, borderRadius: 6 }} /> : <span style={{ color: '#888' }}>No image</span>}</td>
                    <td>{s.position ?? '-'}</td>
                    <td>{new Date(s.created_at).toLocaleString()}</td>
                    <td>{new Date(s.updated_at).toLocaleString()}</td>
                    <td>
                      <button className="btn" onClick={() => startEdit(s)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>Hapus</button>
                    </td>
                  </tr>
                ))}
                {sliders.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>Belum ada slider</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
