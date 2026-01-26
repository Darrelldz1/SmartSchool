// src/DebugImports.jsx
import React, { useEffect, useState } from "react";

const MODULES_TO_CHECK = [
  "./App",
  "./components/landingPage",
  "./components/landingpage",
  "./components/login",
  "./components/Login",
  "./components/landingPage.jsx",
  "./components/login.jsx",
  "./components/landingPage.jsx",
  "./components/newsListPublic",
  "./components/NewsListPublic",
  "./components/NewsDetail",
  "./components/news",
  "./components/GalleryListPublic",
  "./components/galleryListPublic",
  "./admin/AdminLayout",
  "./admin/ProtectedRoute",
  "./auth/AuthProvider",
  // tambahkan path lain yang ada di App.jsx jika perlu
];

export default function DebugImports() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const out = [];
      for (const p of MODULES_TO_CHECK) {
        try {
          // dynamic import untuk mendeteksi error import/runtime
          const mod = await import(/* webpackIgnore: true */ p).catch(e => { throw e; });
          out.push({ path: p, ok: true, message: "OK", defaultExport: typeof mod.default });
        } catch (err) {
          // tangkap error dan tampilkan
          out.push({ path: p, ok: false, message: String(err).slice(0, 1000) });
        }
        if (!mounted) break;
      }
      if (mounted) setResults(out);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "system-ui, Arial" }}>
      <h2>Import Debugger</h2>
      <p>Mengetes import module yang sering dipakai. Cari baris <strong>false</strong>.</p>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>Module Path</th>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>Status</th>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>Message</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td style={{ padding: 8, verticalAlign: "top", fontFamily: "monospace" }}>{r.path}</td>
              <td style={{ padding: 8 }}>{r.ok ? <span style={{ color: "green" }}>OK</span> : <span style={{ color: "red" }}>FAIL</span>}</td>
              <td style={{ padding: 8, whiteSpace: "pre-wrap" }}>{r.message}</td>
            </tr>
          ))}
          {results.length === 0 && (
            <tr><td colSpan={3} style={{ padding: 8 }}>Sedang mengecek... tunggu beberapa detik lalu refresh halaman jika perlu.</td></tr>
          )}
        </tbody>
      </table>
      <div style={{ marginTop: 12, color: "#666" }}>
        <p>Jika ada module yang FAIL, periksa:</p>
        <ol>
          <li>apakah path import <strong>case-sensitive</strong> cocok dengan nama file di disk?</li>
          <li>apakah file mengekspor default (`export default`)?</li>
          <li>apakah file mengimpor modul lain yang mungkin gagal saat inisialisasi?</li>
        </ol>
      </div>
    </div>
  );
}
