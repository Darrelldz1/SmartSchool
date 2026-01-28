import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function HistoryPage() {
  const [history, setHistory] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= GET HISTORY ================= */
  const fetchHistory = async () => {
    try {
      const res = await api.get("/history");
      setHistory(res.data);
      setContent(res.data.content || "");
    } catch (err) {
      console.log("History belum ada");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (history?.id) {
        await api.put(`/history/${history.id}`, { content });
        setMessage("Sejarah berhasil diperbarui");
      } else {
        const res = await api.post("/history", { content });
        setHistory(res.data.history);
        setMessage("Sejarah berhasil ditambahkan");
      }
      fetchHistory();
    } catch (err) {
      setMessage(
        err?.response?.data?.error || "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sejarah Sekolah</h1>

      {message && <p style={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tuliskan sejarah sekolah..."
          required
          style={styles.textarea}
        />

        <button disabled={loading} style={styles.button}>
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    maxWidth: 900,
    background: "#fff",
    padding: 30,
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,.08)",
  },
  title: {
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  textarea: {
    padding: 12,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
    resize: "vertical",
    fontSize: 14,
  },
  button: {
    alignSelf: "flex-start",
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  message: {
    color: "green",
    marginBottom: 10,
  },
};
