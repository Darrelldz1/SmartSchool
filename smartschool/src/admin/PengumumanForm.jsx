import React, { useState } from "react";

export default function PengumumanForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    // TODO: kirim ke API
    alert("Pengumuman Telah disimpan.");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Pengumuman</h2>

      <div className="form-group">
        <label>Judul Pengumuman</label>
        <input
          type="text"
          className="editor-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masukkan judul pengumuman..."
        />
      </div>

      <div className="form-group">
        <label>Isi Pengumuman</label>
        <textarea
          className="editor-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Masukkan isi pengumuman..."
        />
      </div>

      <button className="btn-submit" onClick={handleSave}>
        SIMPAN
      </button>
    </div>
  );
}
