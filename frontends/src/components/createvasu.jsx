import React, { useState } from "react";

export default function CreateVisi() {
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Visi dikirim:", visi);
    console.log("Misi dikirim:", misi);

    // TODO: kirim ke API backend pakai fetch/axios
    alert("Visi & Misi berhasil ditambahkan!");

    // reset form
    setVisi("");
    setMisi("");
  };

  return (
    <main className="create-form container-centered">
      <h2>Tambah Visi & Misi</h2>
      <form onSubmit={handleSubmit} className="form-panel">
        {/* Input Visi */}
        <label>Visi</label>
        <textarea
          value={visi}
          onChange={(e) => setVisi(e.target.value)}
          placeholder="Masukkan Visi..."
          rows="4"
          required
        />

        {/* Input Misi */}
        <label>Misi</label>
        <textarea
          value={misi}
          onChange={(e) => setMisi(e.target.value)}
          placeholder="Masukkan Misi..."
          rows="4"
          required
        />

        <button type="submit" className="btn-submit">
          Simpan
        </button>
        
      </form>
    </main>
  );
}
