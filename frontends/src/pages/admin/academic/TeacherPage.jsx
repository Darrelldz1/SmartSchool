import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function TeacherPage() {
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= FETCH ================= */
  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teachers");
      setTeachers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  /* ================= CREATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/teachers", {
        name,
        subject,
      });

      setName("");
      setSubject("");
      setMessage("Guru berhasil ditambahkan");
      fetchTeachers();
    } catch (err) {
      setMessage(err?.response?.data?.error || "Gagal menambahkan guru");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Hapus data guru ini?")) return;

    try {
      await api.delete(`/teachers/${id}`);
      fetchTeachers();
    } catch (err) {
      alert("Gagal menghapus data guru");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Data Guru</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={styles.form}>
        {message && <p style={styles.message}>{message}</p>}

        <input
          type="text"
          placeholder="Nama Guru"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Mata Pelajaran"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          style={styles.input}
        />

        <button disabled={loading} style={styles.button}>
          {loading ? "Menyimpan..." : "Tambah Guru"}
        </button>
      </form>

      {/* LIST */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Mata Pelajaran</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.subject}</td>
              <td>
                <button
                  onClick={() => handleDelete(t.id)}
                  style={styles.delete}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    background: "#fff",
    padding: 30,
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,.08)",
  },
  form: {
    display: "flex",
    gap: 10,
    marginBottom: 30,
    flexWrap: "wrap",
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
    minWidth: 200,
  },
  button: {
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  delete: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
  message: {
    color: "green",
    width: "100%",
  },
};
