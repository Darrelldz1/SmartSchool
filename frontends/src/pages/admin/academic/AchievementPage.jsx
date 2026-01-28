import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function AchievementPage() {
  const [achievements, setAchievements] = useState([]);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");

  const fetchData = async () => {
    const res = await api.get("/achievements");
    setAchievements(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/achievements", { title, year });
    setTitle("");
    setYear("");
    fetchData();
  };

  const remove = async (id) => {
    if (confirm("Hapus prestasi?")) {
      await api.delete(`/achievements/${id}`);
      fetchData();
    }
  };

  return (
    <div style={box}>
      <h1>Prestasi Sekolah</h1>

      <form onSubmit={submit} style={form}>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Nama Prestasi" required />
        <input value={year} onChange={(e)=>setYear(e.target.value)} placeholder="Tahun" required />
        <button>Tambah</button>
      </form>

      <table style={table}>
        <thead>
          <tr><th>Prestasi</th><th>Tahun</th><th>Aksi</th></tr>
        </thead>
        <tbody>
          {achievements.map(a => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.year}</td>
              <td>
                <button onClick={() => remove(a.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const box = { background:"#fff", padding:30, borderRadius:10 };
const form = { display:"flex", gap:10, marginBottom:20 };
const table = { width:"100%", borderCollapse:"collapse" };
