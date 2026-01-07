// src/components/Sekolah.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Sekolah() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);

    axios.get(`${API_BASE}/api/history`)
      .then(res => {
        if (!mounted) return;
        setHistory(res.data);
      })
      .catch(error => {
        console.error("fetch history err", error);
        if (error.response && error.response.status === 404) {
          setHistory(null);
        } else {
          setErr("Gagal memuat tentang sekolah");
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Memuat...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4" style={{ color: "#1e5ba8" }}>Tentang Sekolah</h1>

      {!history ? (
        <div className="bg-white p-6 rounded shadow">
          <p>Belum ada informasi tentang sekolah.</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow">
          <div style={{ whiteSpace: "pre-wrap", color: "#333" }}>{history.description}</div>
          <div className="mt-4 text-sm text-gray-500">Diperbarui: {history.updated_at ? new Date(history.updated_at).toLocaleString() : (history.created_at ? new Date(history.created_at).toLocaleString() : "")}</div>
        </div>
      )}
    </div>
  );
}
