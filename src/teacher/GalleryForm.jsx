import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const BASE = 'http://localhost:5000/api';
function authHeaders() { const t = localStorage.getItem('token'); return t ? { Authorization: `Bearer ${t}` } : {}; }

export default function GalleryForm(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [current, setCurrent] = useState(null);

  useEffect(()=>{
    if (id) {
      axios.get(`${BASE}/gallery/${id}`, { headers: authHeaders() })
        .then(res => setCurrent(res.data))
        .catch(console.error);
    }
  }, [id]);

  async function submit(e){
    e.preventDefault();
    try {
      const fd = new FormData();
      if (file) fd.append('image', file);

      if (id) {
        await axios.put(`${BASE}/gallery/${id}`, fd, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' }});
      } else {
        await axios.post(`${BASE}/gallery`, fd, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' }});
      }
      alert('Sukses');
      navigate('/teacher/gallery');
    } catch(err){
      console.error(err);
      alert('Gagal upload');
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl mb-4">{id ? 'Edit' : 'Tambah'} Gallery</h1>
      {current && current.image_url && <img src={current.image_url} alt="" className="w-48 h-48 object-cover mb-3" />}
      <form onSubmit={submit} className="space-y-3">
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />
        <button className="btn-add">Simpan</button>
      </form>
    </div>
  );
}
