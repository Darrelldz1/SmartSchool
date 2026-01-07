import React, { useState } from 'react';
import './editvisimisivalue.css';

const EditorToolbar = ({ onAction }) => (
  <div className="editor-toolbar">
    <select className="font-select">
      <option>Paragraph</option>
      <option>Heading 1</option>
      <option>Heading 2</option>
    </select>

    <div className="toolbar-divider" />

    <button className="toolbar-btn" title="Bold"><strong>B</strong></button>
    <button className="toolbar-btn" title="Italic"><em>I</em></button>
    <button className="toolbar-btn" title="Underline"><u>U</u></button>
    <button className="toolbar-btn" title="Strikethrough"><s>S</s></button>

    <div className="toolbar-divider" />

    <button className="toolbar-btn" title="Text Color">A<span className="color-indicator" /></button>
    <button className="toolbar-btn" title="Background Color">🎨</button>

    <div className="toolbar-divider" />

    <button className="toolbar-btn" title="Align Left">≡</button>
    <button className="toolbar-btn" title="Align Center">≡</button>
    <button className="toolbar-btn" title="Align Right">≡</button>
    <button className="toolbar-btn" title="Justify">≡</button>

    <div className="toolbar-divider" />

    <button className="toolbar-btn" title="Numbered List">1.</button>
    <button className="toolbar-btn" title="Bullet List">•</button>
    <button className="toolbar-btn" title="Decrease Indent">←</button>
    <button className="toolbar-btn" title="Increase Indent">→</button>

    <div className="toolbar-divider" />

    <button className="toolbar-btn" title="Link">🔗</button>
    <button className="toolbar-btn" title="Image">🖼</button>
    <button className="toolbar-btn" title="Table">⊞</button>

    <div className="toolbar-divider" />

    <button className="toolbar-btn" title="Undo">↶</button>
    <button className="toolbar-btn" title="Redo">↷</button>

    <button className="toolbar-btn close-btn" title="Close">✕</button>
  </div>
);

const EditVisiMisiValue = () => {
  const [visi, setVisi] = useState('');
  const [misi, setMisi] = useState('');
  const [values, setValues] = useState('');
  const [uploadPreview, setUploadPreview] = useState({ visi: null, misi: null, values: null });

  // contoh handler upload (menampilkan preview)
  const handleFile = (e, key) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadPreview((p) => ({ ...p, [key]: reader.result }));
    reader.readAsDataURL(file);
  };

  // contoh save (ganti dengan fetch/axios ke API)
  const handleSave = async () => {
    const payload = { visi, misi, values /* + file handling */ };
    console.log('Simpan payload:', payload);

    // TODO: panggil API (POST/PUT) untuk menyimpan ke backend
    // contoh:
    // await fetch('/api/school/visi', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(payload) });

    alert('Perubahan disimpan (contoh). Implementasikan API untuk menyimpan.');
  };

  return (
    <div className="edit-container">
      {/* Page Title (tanpa header/navbar — AdminLayout yang menampilkan navbar) */}
      <div className="page-header">
        <h1 className="page-title">Visi - Misi - Values</h1>
      </div>

      <div className="content-wrapper">
        {/* Visi */}
        <div className="section-card">
          <div className="section-header">
            <label className="section-label">Gambar Visi</label>
            <div>
              <input id="visi-file" type="file" accept="image/*" onChange={(e) => handleFile(e, 'visi')} style={{ display: 'none' }} />
              <label htmlFor="visi-file" className="upload-btn" title="Upload Image">📁 Upload</label>
            </div>
          </div>

          <div className="image-preview">
            {uploadPreview.visi ? (
              <img src={uploadPreview.visi} alt="preview visi" className="preview-img" />
            ) : (
              <div className="image-placeholder visi-image"><span className="image-text">Visi</span></div>
            )}
          </div>

          <label className="section-label">Narasi Visi</label>
          <div className="editor-wrapper">
            <EditorToolbar />
            <textarea
              className="editor-content"
              value={visi}
              onChange={(e) => setVisi(e.target.value)}
              placeholder="Masukkan narasi visi..."
            />
          </div>
        </div>

        {/* Misi */}
        <div className="section-card">
          <div className="section-header">
            <label className="section-label">Gambar Misi</label>
            <div>
              <input id="misi-file" type="file" accept="image/*" onChange={(e) => handleFile(e, 'misi')} style={{ display: 'none' }} />
              <label htmlFor="misi-file" className="upload-btn" title="Upload Image">📁 Upload</label>
            </div>
          </div>

          <div className="image-preview">
            {uploadPreview.misi ? (
              <img src={uploadPreview.misi} alt="preview misi" className="preview-img" />
            ) : (
              <div className="image-placeholder misi-image"><span className="image-text">Misi</span></div>
            )}
          </div>

          <label className="section-label">Narasi Misi</label>
          <div className="editor-wrapper">
            <EditorToolbar />
            <textarea
              className="editor-content"
              value={misi}
              onChange={(e) => setMisi(e.target.value)}
              placeholder="Masukkan narasi misi..."
            />
          </div>
        </div>

        {/* Values */}
        <div className="section-card">
          <div className="section-header">
            <label className="section-label">Gambar Values</label>
            <div>
              <input id="values-file" type="file" accept="image/*" onChange={(e) => handleFile(e, 'values')} style={{ display: 'none' }} />
              <label htmlFor="values-file" className="upload-btn" title="Upload Image">📁 Upload</label>
            </div>
          </div>

          <div className="image-preview">
            {uploadPreview.values ? (
              <img src={uploadPreview.values} alt="preview values" className="preview-img" />
            ) : (
              <div className="image-placeholder values-image"><span className="image-text">Company<br/>Values</span></div>
            )}
          </div>

          <label className="section-label">Narasi Values</label>
          <div className="editor-wrapper">
            <EditorToolbar />
            <textarea
              className="editor-content"
              value={values}
              onChange={(e) => setValues(e.target.value)}
              placeholder="Masukkan narasi values..."
            />
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="action-buttons">
        <button className="save-btn" onClick={handleSave}>SIMPAN</button>
      </div>
    </div>
  );
};

export default EditVisiMisiValue;
