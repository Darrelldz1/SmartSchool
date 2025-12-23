// src/admin/EditNews.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });
  const [image, setImage] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/news/${id}`)
      .then(res => setForm(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      if (image) fd.append("image", image);

      await axios.put(`http://localhost:5000/api/news/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("News updated!");
      navigate("/admin/newslist");
    } catch (err) {
      console.error(err);
      alert("Gagal update berita!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Berita</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Judul"
          className="w-full border p-2"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Deskripsi"
          className="w-full border p-2 h-32"
        />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Simpan
        </button>
      </form>
    </div>
  );
}
