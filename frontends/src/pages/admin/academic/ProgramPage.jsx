import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function ProgramPage() {
  const [programs, setPrograms] = useState([]);
  const [name, setName] = useState("");

  const fetchData = async () => {
    const res = await api.get("/programs");
    setPrograms(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/programs", { name });
    setName("");
    fetchData();
  };

  const remove = async (id) => {
    if (confirm("Hapus program?")) {
      await api.delete(`/programs/${id}`);
      fetchData();
    }
  };

  return (
    <div style={box}>
      <h1>Program Sekolah</h1>

      <form onSubmit={submit} style={form}>
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nama Program" required />
        <button>Tambah</button>
      </form>

      <ul>
        {programs.map(p => (
          <li key={p.id}>
            {p.name}{" "}
            <button onClick={() => remove(p.id)}>Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const box = { background:"#fff", padding:30, borderRadius:10 };
const form = { display:"flex", gap:10, marginBottom:20 };
