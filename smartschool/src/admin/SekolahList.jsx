import React, { useState } from "react";

export default function SekolahList() {
  const [sekolahData] = useState([
    { id: 1, nama: "SDN 01 Jakarta", alamat: "Jl. Merdeka No. 1", kepala: "Budi Santoso", status: "Aktif" },
    { id: 2, nama: "SDN 02 Bekasi", alamat: "Jl. Raya Bekasi No. 5", kepala: "Siti Nurhaliza", status: "Aktif" },
    { id: 3, nama: "SDN 03 Tangerang", alamat: "Jl. Tangerang Raya No. 10", kepala: "Ahmad Yani", status: "Aktif" },
  ]);

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Daftar Sekolah</h2>
        <button className="btn-add">+ Tambah Sekolah</button>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Cari sekolah..." className="search-input" />
        <button className="btn-search">Cari</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Sekolah</th>
            <th>Alamat</th>
            <th>Kepala Sekolah</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {sekolahData.map((s, idx) => (
            <tr key={s.id}>
              <td>{idx + 1}</td>
              <td>{s.nama}</td>
              <td>{s.alamat}</td>
              <td>{s.kepala}</td>
              <td><span className="status-badge active">{s.status}</span></td>
              <td>
                <button className="btn-action edit">✏️</button>
                <button className="btn-action delete">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
