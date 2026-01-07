// src/admin/OrangTuaAdmin.jsx
import React, { useEffect, useState } from 'react';
import { createApiClient } from './api';
import { useAuth } from '../auth/AuthProvider';

export default function OrangTuaAdmin() {
  const { user } = useAuth() || {};
  const token = user?.token || localStorage.getItem('token');
  const api = createApiClient(token);

  const [list, setList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [form, setForm] = useState({ siswa_id:'', jenis:'ayah', nama_lengkap:'', nik:'', tempat_tanggal_lahir:'', nomor_hp:'', pendidikan:'', pekerjaan:'' });
  const [editingId, setEditingId] = useState(null);

  useEffect(()=>{ loadAll(); }, []);

  async function loadAll(){
    const [r1,r2] = await Promise.all([api.get('/api/orang_tua'), api.get('/api/siswa')]);
    setList(r1.data||[]); setSiswaList(r2.data||[]);
  }

  function onChange(e){ const {name,value} = e.target; setForm(f=>({...f, [name]:value})); }
  function beginEdit(row){ setForm({...row}); setEditingId(row.id); window.scrollTo(0,0); }
  function reset(){ setForm({ siswa_id:'', jenis:'ayah', nama_lengkap:'', nik:'', tempat_tanggal_lahir:'', nomor_hp:'', pendidikan:'', pekerjaan:'' }); setEditingId(null); }

  async function submit(e){
    e.preventDefault();
    try{
      if(editingId) await api.put(`/api/orang_tua/${editingId}`, form);
      else await api.post('/api/orang_tua', form);
      alert('Berhasil'); reset(); await loadAll();
    }catch(err){ console.error(err); alert(err.response?.data?.error||'Gagal'); }
  }

  async function del(id){ if(!confirm('Hapus?')) return; await api.delete(`/api/orang_tua/${id}`); await loadAll(); }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Data Orang Tua / Wali</h1>

      <form onSubmit={submit} className="bg-white p-4 rounded mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label>Siswa</label>
            <select name="siswa_id" value={form.siswa_id} onChange={onChange} className="w-full border p-2">
              <option value="">-- pilih --</option>
              {siswaList.map(s=> <option key={s.id} value={s.id}>{s.nama_lengkap}</option>)}
            </select>
          </div>
          <div>
            <label>Jenis</label>
            <select name="jenis" value={form.jenis} onChange={onChange} className="w-full border p-2">
              <option value="ayah">Ayah</option>
              <option value="ibu">Ibu</option>
              <option value="wali">Wali</option>
            </select>
          </div>

          <div><label>Nama Lengkap</label><input name="nama_lengkap" value={form.nama_lengkap} onChange={onChange} className="w-full border p-2"/></div>
          <div><label>NIK</label><input name="nik" value={form.nik} onChange={onChange} className="w-full border p-2"/></div>

          <div><label>Tempat/Tgl Lahir</label><input name="tempat_tanggal_lahir" value={form.tempat_tanggal_lahir} onChange={onChange} className="w-full border p-2"/></div>
          <div><label>No HP</label><input name="nomor_hp" value={form.nomor_hp} onChange={onChange} className="w-full border p-2"/></div>

          <div><label>Pendidikan</label><input name="pendidikan" value={form.pendidikan} onChange={onChange} className="w-full border p-2"/></div>
          <div><label>Pekerjaan</label><input name="pekerjaan" value={form.pekerjaan} onChange={onChange} className="w-full border p-2"/></div>
        </div>

        <div className="mt-3">
          <button className="px-3 py-2 bg-blue-600 text-white rounded">{editingId ? 'Simpan' : 'Tambah'}</button>
          <button type="button" onClick={reset} className="ml-2 px-3 py-2 bg-gray-200 rounded">Reset</button>
        </div>
      </form>

      <table className="w-full bg-white rounded shadow">
        <thead><tr><th>ID</th><th>Siswa</th><th>Nama</th><th>Jenis</th><th>No HP</th><th>Aksi</th></tr></thead>
        <tbody>
          {list.map(r=>(
            <tr key={r.id}>
              <td className="border px-2 py-1">{r.id}</td>
              <td className="border px-2 py-1">{siswaList.find(s=>s.id===r.siswa_id)?.nama_lengkap || r.siswa_id}</td>
              <td className="border px-2 py-1">{r.nama_lengkap}</td>
              <td className="border px-2 py-1">{r.jenis}</td>
              <td className="border px-2 py-1">{r.nomor_hp}</td>
              <td className="border px-2 py-1">
                <button className="px-2 py-1 bg-yellow-500 text-white mr-2" onClick={()=>beginEdit(r)}>Edit</button>
                <button className="px-2 py-1 bg-red-600 text-white" onClick={()=>del(r.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
