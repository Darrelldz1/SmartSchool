import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function GalleryPage() {
  const [galleries, setGalleries] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= FETCH ================= */
  const fetchGallery = async () => {
    try {
      const res = await api.get("/gallery");
      setGalleries(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  /* ================= CREATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/gallery", {
        image_url: imageUrl,
        caption,
      });

      setImageUrl("");
      setCaption("");
      setMessage("Gallery berhasil ditambahkan");
      fetchGallery();
    } catch (err) {
      setMessage(
        err?.response?.data?.error || "Gagal menambahkan gallery"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Hapus gambar ini?")) return;

    try {
      await api.delete(`/gallery/${id}`);
      fetchGallery();
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Galeri Sekolah</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={styles.form}>
        {message && <p style={styles.message}>{message}</p>}

        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={styles.input}
        />

        <button disabled={loading} style={styles.button}>
          {loading ? "Menyimpan..." : "Tambah"}
        </button>
      </form>

      {/* GRID */}
      <div style={styles.grid}>
        {galleries.map((item) => (
          <div key={item.id} style={styles.card}>
            <img
              src={item.image_url}
              alt={item.caption}
              style={styles.image}
            />
            <p style={styles.caption}>{item.caption}</p>

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
    gap: 10,
    marginBottom: 30,
    flexWrap: "wrap",
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
    minWidth: 220,
  },
  button: {
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 20,
  },
  card: {
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,.1)",
    background: "#fff",
  },
  image: {
    width: "100%",
    height: 160,
    objectFit: "cover",
  },
  caption: {
    padding: 10,
    fontSize: 14,
  },
  delete: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: 8,
    width: "100%",
    cursor: "pointer",
  },
  message: {
    color: "green",
    width: "100%",
  },
};
