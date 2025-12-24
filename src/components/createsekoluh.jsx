import React, { useState } from "react";

export default function CreateSekolah() {
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data sekolah dikirim:", { nama, alamat, email });

    // TODO: kirim ke API backend pakai fetch/axios
    alert("Data sekolah berhasil ditambahkan!");

    // reset form
    setNama("");
    setAlamat("");
    setEmail("");
  };

  return (
    <main className="create-form container-centered">
      <h2>Tambah Data Sekolah</h2>
      <form onSubmit={handleSubmit} className="form-panel">
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama Sekolah"
          required
        />
        <input
          type="text"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
          placeholder="Alamat Sekolah"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Sekolah"
          required
        />
        <button type="submit" className="btn-submit">
          Simpan
        </button>
      </form>
    </main>
  );
}
