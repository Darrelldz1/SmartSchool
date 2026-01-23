// src/components/EditSejarahForm.jsx
import React, { useState } from "react";
import "./sejarah.css"; // Import CSS file

export default function EditSejarahForm() {
  const [content, setContent] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSaving(true);
    // TODO: kirim ke API
    setTimeout(() => {
      alert("Sejarah telah disimpan.");
      setSaving(false);
    }, 1000);
  };

  const handleCancel = () => {
    if (window.confirm("Batalkan perubahan?")) {
      setContent("");
      setUploadedImage(null);
    }
  };

  return (
    <div className="profile-admin-container">
      <div className="profile-admin-wrapper">
        {/* Header Section */}
        <div className="profile-admin-header">
          <h1>Sejarah Sekolah</h1>
          <div className="header-buttons">
            <button className="btn-back" onClick={() => window.history.back()}>
              ← Kembali
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="profile-content-container">
          <div className="profile-form-section">
            <div className="profile-item">
              <h3 style={{ color: "#2d3748", fontSize: "18px", fontWeight: 600, marginBottom: 20 }}>
                Edit Informasi Sejarah
              </h3>

              {/* Image Upload Section */}
              <div className="image-upload-section">
                <div className="image-upload-wrapper">
                  <div className="image-label">Gambar Gedung Sekolah</div>
                  <div className="image-preview-container">
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="School Building" />
                    ) : (
                      <div className="image-placeholder">🏫</div>
                    )}
                  </div>
                  <div className="file-input-wrapper">
                    <input
                      id="school-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="school-image" className="file-input-label">
                      📷 Upload Gambar
                    </label>
                  </div>
                  {uploadedImage && (
                    <button
                      type="button"
                      onClick={() => setUploadedImage(null)}
                      style={{
                        marginTop: 8,
                        padding: "6px 12px",
                        background: "#fc5c65",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        fontSize: 12,
                        cursor: "pointer"
                      }}
                    >
                      🗑️ Hapus Gambar
                    </button>
                  )}
                </div>

                {/* Text Input Section */}
                <div className="text-input-section">
                  <label className="input-label">Isi/Uraian Sejarah Sekolah</label>
                  <textarea
                    className="text-input"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Masukkan sejarah sekolah... 

Contoh:
Sekolah kami didirikan pada tahun 1985 dengan visi menciptakan generasi yang cerdas dan berakhlak mulia. Berawal dari sebuah gedung sederhana dengan 3 ruang kelas, kini telah berkembang menjadi institusi pendidikan yang modern dan lengkap."
                    style={{ minHeight: 200 }}
                  />
                  <div style={{ fontSize: 12, color: "#718096", marginTop: 8 }}>
                    💡 Tips: Ceritakan perjalanan sekolah dari awal berdiri hingga saat ini
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="pengumuman-info-box" style={{ marginTop: 24 }}>
                <div className="pengumuman-info-box-title">
                  Informasi Penting
                </div>
                <div className="pengumuman-info-box-content">
                  Pastikan informasi sejarah yang dimasukkan akurat dan lengkap. 
                  Gambar yang diunggah sebaiknya beresolusi tinggi dengan ukuran maksimal 5MB.
                </div>
              </div>

              {/* Save Button Section */}
              <div className="save-button-section">
                <button 
                  className="btn-save" 
                  onClick={handleSave}
                  disabled={saving || !content.trim()}
                >
                  {saving ? "⏳ Menyimpan..." : "💾 Simpan"}
                </button>
                <button 
                  className="btn-cancel" 
                  onClick={handleCancel}
                  disabled={saving}
                >
                  ❌ Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}