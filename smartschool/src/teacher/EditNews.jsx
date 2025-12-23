import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BASE = 'http://localhost:5000/api';
function authHeaders() { const t = localStorage.getItem('token'); return t ? { Authorization: `Bearer ${t}` } : {}; }

export default function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });
  const [image, setImage] = useState(null);

  useEffect(() => {
    axios.get(`${BASE}/news/${id}`, { headers: authHeaders() })
      .then(res => {
        const n = res.data || {};
        setForm({ title: n.title || '', description: n.description || '' });
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      if (image) fd.append("image", image);

      await axios.put(`${BASE}/news/${id}`, fd, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } });
      alert("Berhasil");
      navigate("/teacher/news");
    } catch (err) {
      console.error(err);
      alert("Gagal update");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Edit Berita</h1>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-2xl">
        <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full border p-2" />
        <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="w-full border p-2 h-40" />
        <input type="file" accept="image/*" onChange={e=>setImage(e.target.files[0])} />
        <button className="btn-add">Simpan</button>
      </form>
    </div>
  );
}
