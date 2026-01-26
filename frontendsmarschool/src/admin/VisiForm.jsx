import React, { useState } from "react";

export default function VisiForm() {
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [values, setValues] = useState("");

  const handleSave = () => {
    // TODO: kirim ke API
    alert("Visi/Misi/Values disimpan (mock).");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Visi - Misi - Values</h2>

      <div className="form-group">
        <label>Gambar Visi</label>
        <div className="vision-badge">
          <div className="badge-circle vision">Vision</div>
        </div>

        <label>Isi/Uraian Visi</label>
        <textarea
          className="editor-textarea small"
          value={visi}
          onChange={(e) => setVisi(e.target.value)}
          placeholder="Masukkan visi..."
        />
      </div>

      <div className="form-group">
        <label>Gambar Misi</label>
        <div className="vision-badge">
          <div className="badge-circle mission">Mission</div>
        </div>

        <label>Isi/Uraian Misi</label>
        <textarea
          className="editor-textarea small"
          value={misi}
          onChange={(e) => setMisi(e.target.value)}
          placeholder="Masukkan misi..."
        />
      </div>

      <div className="form-group">
        <label>Gambar Values</label>
        <div className="vision-badge">
          <div className="badge-circle values">Values</div>
        </div>

        <label>Isi/Uraian Values</label>
        <textarea
          className="editor-textarea small"
          value={values}
          onChange={(e) => setValues(e.target.value)}
          placeholder="Masukkan values..."
        />
      </div>

      <button className="btn-submit" onClick={handleSave}>
        SIMPAN
      </button>
    </div>
  );
}
