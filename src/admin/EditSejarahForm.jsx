import React, { useState } from "react";

export default function EditSejarahForm() {
  const [content, setContent] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // TODO: kirim ke API
    alert("Sejarah Telah disimpan.");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Sejarah Sekolah</h2>

      <div className="form-group">
        <label>Gambar Gedung Sekolah</label>
        <div className="upload-area">
          <input
            id="school-image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="school-image" className="upload-label">
            {uploadedImage ? (
              <img src={uploadedImage} alt="School" className="uploaded-image" />
            ) : (
              <div className="upload-placeholder">
                <div className="building-icon">🏫</div>
                <p>Klik untuk upload gambar</p>
              </div>
            )}
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Isi/Uraian Sejarah Sekolah</label>
        <textarea
          className="editor-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Masukkan sejarah sekolah..."
        />
      </div>

      <button className="btn-submit" onClick={handleSave}>
        SIMPAN
      </button>
    </div>
  );
}
