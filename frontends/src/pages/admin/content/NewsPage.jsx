import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= FETCH ================= */
  const fetchNews = async () => {
    try {
      const res = await api.get("/news");
      setNews(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  /* ================= CREATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/news", {
        title,
        content,
      });

      setTitle("");
      setContent("");
      setMessage("Berita berhasil ditambahkan");
      fetchNews();
    } catch (err) {
      setMessage(err?.response?.data?.error || "Gagal menambahkan berita");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Hapus berita ini?")) return;

    try {
      await api.delete(`/news/${id}`);
      fetchNews();
    } catch (err) {
      alert("Gagal menghapus berita");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Berita Sekolah</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={styles.form}>
        {message && <p style={styles.message}>{message}</p>}

        <input
          type="text"
          placeholder="Judul Berita"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />

        <textarea
          placeholder="Isi Berita"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
          style={styles.textarea}
        />

        <button disabled={loading} style={styles.button}>
          {loading ? "Menyimpan..." : "Tambah Berita"}
        </button>
      </form>

      {/* LIST */}
      <div style={styles.list}>
        {news.map((item) => (
          <div key={item.id} style={styles.card}>
            <h3>{item.title}</h3>
            <p style={styles.content}>
              {item.content.length > 150
                ? item.content.slice(0, 150) + "..."
                : item.content}
            </p>

            <button
              onClick={() => handleDelete(item.id)}
              style={styles.delete}
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
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
    flexDirection: "column",
    gap: 12,
    marginBottom: 30,
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
  },
  textarea: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
    resize: "vertical",
  },
  button: {
    width: 160,
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  },
  card: {
    borderRadius: 10,
    padding: 16,
    background: "#f8fafc",
    boxShadow: "0 2px 8px rgba(0,0,0,.08)",
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
  },
  delete: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
  message: {
    color: "green",
  },
};
