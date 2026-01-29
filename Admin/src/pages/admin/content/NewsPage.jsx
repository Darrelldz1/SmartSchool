import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  /* ================= FETCH ================= */
  const fetchNews = async () => {
    setFetchLoading(true);
    try {
      const res = await api.get("/news");
      setNews(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (editId) {
        await api.put(`/news/${editId}`, form);
        setMessage("Berita berhasil diupdate!");
        setMessageType("success");
      } else {
        await api.post("/news", form);
        setMessage("Berita berhasil ditambahkan!");
        setMessageType("success");
      }

      resetForm();
      fetchNews();

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      setMessage(err?.response?.data?.error || "Gagal menyimpan berita");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      content: item.content,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Hapus berita ini?")) return;

    try {
      await api.delete(`/news/${id}`);
      setMessage("Berita berhasil dihapus");
      setMessageType("success");
      fetchNews();

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      setMessage("Gagal menghapus berita");
      setMessageType("error");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      title: "",
      content: "",
    });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter news
  const filteredNews = news.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (fetchLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Memuat berita...</p>
      </div>
    );
  }

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerIcon}>📰</div>
          <div style={styles.headerText}>
            <h1 style={styles.pageTitle}>Berita Sekolah</h1>
            <p style={styles.pageSubtitle}>Kelola berita dan informasi terkini sekolah</p>
          </div>
        </div>
        <div style={styles.statsBadge}>
          <span style={styles.badgeLabel}>Total Berita</span>
          <span style={styles.badgeValue}>{news.length}</span>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div style={{
          ...styles.alert,
          ...(messageType === "success" ? styles.alertSuccess : styles.alertError)
        }}>
          <span style={styles.alertIcon}>
            {messageType === "success" ? "✓" : "⚠"}
          </span>
          <span>{message}</span>
        </div>
      )}

      {/* Form Card */}
      <div style={styles.formCard}>
        <div style={styles.formHeader}>
          <h2 style={styles.formTitle}>
            {editId ? "✏️ Edit Berita" : "➕ Tambah Berita Baru"}
          </h2>
          {editId && (
            <button onClick={resetForm} style={styles.btnCancelSmall}>
              ✕ Batal Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>
              <span style={styles.labelIcon}>📝</span>
              Judul Berita
            </label>
            <input
              type="text"
              placeholder="Masukkan judul berita yang menarik..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>
              <span style={styles.labelIcon}>📄</span>
              Isi Berita
            </label>
            <textarea
              placeholder="Tulis isi berita secara lengkap dan detail..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              style={styles.formTextarea}
              rows="12"
            />
            <div style={styles.textareaFooter}>
              <span style={styles.wordCount}>{wordCount} kata</span>
              <span style={styles.charCount}>{form.content.length} karakter</span>
            </div>
          </div>

          <button
            type="submit"
            style={editId ? styles.btnUpdate : styles.btnSubmit}
            disabled={loading || !form.title.trim() || !form.content.trim()}
          >
            {loading ? "⏳ Menyimpan..." : editId ? "💾 Update Berita" : "✓ Tambah Berita"}
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <div style={styles.searchCard}>
        <div style={styles.searchLeft}>
          <div style={styles.searchIconLarge}>🔍</div>
          <div style={styles.searchContent}>
            <input
              type="text"
              placeholder="Cari berita berdasarkan judul atau isi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <p style={styles.searchHint}>
              {searchTerm ? `Menampilkan ${filteredNews.length} hasil dari "${searchTerm}"` : 'Ketik untuk mencari berita'}
            </p>
          </div>
        </div>
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} style={styles.clearSearchLarge}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* News List */}
      <div style={styles.newsSection}>
        <div style={styles.newsHeader}>
          <h2 style={styles.newsTitle}>📋 Daftar Berita</h2>
          <span style={styles.resultCount}>
            {filteredNews.length} dari {news.length} berita
          </span>
        </div>

        {filteredNews.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📰</div>
            <p style={styles.emptyText}>
              {searchTerm ? "Tidak ada berita yang cocok dengan pencarian" : "Belum ada berita"}
            </p>
            {!searchTerm && (
              <p style={styles.emptySubtext}>Mulai tambahkan berita menggunakan form di atas</p>
            )}
          </div>
        ) : (
          <div style={styles.newsGrid}>
            {filteredNews.map((item, index) => (
              <div
                key={item.id}
                style={{...styles.newsCard, animationDelay: `${index * 0.1}s`}}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.cardBadge}>
                    📰 Berita
                  </div>
                  <div style={styles.cardDate}>
                    📅 {new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                <h3 style={styles.cardTitle}>{item.title}</h3>

                <div style={styles.cardContent}>
                  {expandedId === item.id ? (
                    <p style={styles.contentText}>{item.content}</p>
                  ) : (
                    <p style={styles.contentText}>
                      {item.content.length > 200
                        ? item.content.slice(0, 200) + "..."
                        : item.content}
                    </p>
                  )}
                </div>

                {item.content.length > 200 && (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    style={styles.btnReadMore}
                  >
                    {expandedId === item.id ? "📖 Tutup" : "📖 Baca Selengkapnya"}
                  </button>
                )}

                <div style={styles.cardFooter}>
                  <button
                    onClick={() => handleEdit(item)}
                    style={styles.btnEdit}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={styles.btnDelete}
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%)',
    padding: '2rem',
  },
  
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%)',
  },
  
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #e3f2fd',
    borderTopColor: '#22c55e',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  loadingText: {
    marginTop: '1rem',
    fontSize: '1.1rem',
    color: '#22c55e',
    fontWeight: 600,
  },
  
  // Header
  header: {
    maxWidth: '1400px',
    margin: '0 auto 2rem',
    background: 'white',
    borderRadius: '24px',
    padding: '2.5rem',
    boxShadow: '0 10px 40px rgba(34, 197, 94, 0.15)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flex: 1,
  },
  
  headerIcon: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    boxShadow: '0 8px 20px rgba(34, 197, 94, 0.4)',
  },
  
  headerText: {
    flex: 1,
  },
  
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-1px',
  },
  
  pageSubtitle: {
    fontSize: '1.1rem',
    color: '#718096',
    margin: 0,
    fontWeight: 500,
  },
  
  statsBadge: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    padding: '1.5rem 2rem',
    borderRadius: '16px',
    textAlign: 'center',
    minWidth: '160px',
    boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)',
  },
  
  badgeLabel: {
    display: 'block',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  
  badgeValue: {
    display: 'block',
    color: 'white',
    fontSize: '2.5rem',
    fontWeight: 900,
    lineHeight: 1,
  },
  
  // Alert
  alert: {
    maxWidth: '1400px',
    margin: '0 auto 2rem',
    padding: '1.25rem 1.5rem',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1rem',
    fontWeight: 600,
  },
  
  alertSuccess: {
    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    color: '#065f46',
    border: '2px solid #10b981',
  },
  
  alertError: {
    background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
    color: '#991b1b',
    border: '2px solid #ef4444',
  },
  
  alertIcon: {
    fontSize: '1.5rem',
  },
  
  // Form Card
  formCard: {
    maxWidth: '1400px',
    margin: '0 auto 2rem',
    background: 'white',
    borderRadius: '24px',
    padding: '3rem',
    boxShadow: '0 10px 40px rgba(34, 197, 94, 0.15)',
  },
  
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  
  formTitle: {
    fontSize: '2rem',
    fontWeight: 900,
    color: '#2d3748',
    margin: 0,
  },
  
  btnCancelSmall: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    background: '#e5e7eb',
    color: '#4b5563',
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  formLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    fontWeight: 700,
    color: '#4a5568',
    marginBottom: '0.75rem',
  },
  
  labelIcon: {
    fontSize: '1.25rem',
  },
  
  formInput: {
    width: '100%',
    padding: '1rem 1.25rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    background: 'white',
    color: '#2d3748',
  },
  
  formTextarea: {
    width: '100%',
    padding: '1rem 1.25rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    background: 'white',
    color: '#2d3748',
    resize: 'vertical',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: '1.6',
  },
  
  textareaFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid #e2e8f0',
  },
  
  wordCount: {
    fontSize: '0.875rem',
    color: '#22c55e',
    fontWeight: 700,
  },
  
  charCount: {
    fontSize: '0.875rem',
    color: '#718096',
    fontWeight: 600,
  },
  
  btnSubmit: {
    width: '100%',
    padding: '1.25rem 2rem',
    border: 'none',
    borderRadius: '16px',
    fontSize: '1.15rem',
    fontWeight: 800,
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '1rem',
  },
  
  btnUpdate: {
    width: '100%',
    padding: '1.25rem 2rem',
    border: 'none',
    borderRadius: '16px',
    fontSize: '1.15rem',
    fontWeight: 800,
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: 'white',
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '1rem',
  },
  
  // Search
  searchCard: {
    maxWidth: '1400px',
    margin: '0 auto 2rem',
    background: 'white',
    borderRadius: '24px',
    padding: '2rem 2.5rem',
    boxShadow: '0 10px 40px rgba(34, 197, 94, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
    border: '3px solid #d1fae5',
  },
  
  searchLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flex: 1,
  },
  
  searchIconLarge: {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
  },
  
  searchContent: {
    flex: 1,
  },
  
  searchInput: {
    width: '100%',
    border: 'none',
    fontSize: '1.1rem',
    color: '#2d3748',
    outline: 'none',
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  
  searchHint: {
    fontSize: '0.875rem',
    color: '#718096',
    margin: 0,
  },
  
  clearSearchLarge: {
    padding: '0.875rem 2rem',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 700,
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  },
  
  // News Section
  newsSection: {
    maxWidth: '1400px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '24px',
    padding: '3rem',
    boxShadow: '0 10px 40px rgba(34, 197, 94, 0.15)',
  },
  
  newsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  
  newsTitle: {
    fontSize: '2rem',
    fontWeight: 900,
    color: '#2d3748',
    margin: 0,
  },
  
  resultCount: {
    background: '#d1fae5',
    color: '#22c55e',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 700,
  },
  
  // News Grid
  newsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
  },
  
  newsCard: {
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    borderRadius: '20px',
    padding: '2rem',
    border: '2px solid #e2e8f0',
    transition: 'all 0.3s ease',
    animation: 'fadeInUp 0.6s ease-out both',
  },
  
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  
  cardBadge: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: 700,
  },
  
  cardDate: {
    fontSize: '0.875rem',
    color: '#718096',
    fontWeight: 600,
  },
  
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#2d3748',
    margin: '0 0 1rem 0',
    lineHeight: '1.4',
  },
  
  cardContent: {
    marginBottom: '1.5rem',
  },
  
  contentText: {
    fontSize: '1rem',
    color: '#4a5568',
    lineHeight: '1.8',
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  
  btnReadMore: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    color: '#065f46',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: '1.5rem',
    transition: 'all 0.3s ease',
  },
  
  cardFooter: {
    display: 'flex',
    gap: '1rem',
    paddingTop: '1.5rem',
    borderTop: '2px solid #e2e8f0',
  },
  
  btnEdit: {
    flex: 1,
    padding: '0.875rem 1.5rem',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  
  btnDelete: {
    flex: 1,
    padding: '0.875rem 1.5rem',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  },
  
  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  
  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem',
    opacity: 0.5,
  },
  
  emptyText: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#4a5568',
    margin: '0 0 0.5rem 0',
  },
  
  emptySubtext: {
    fontSize: '1rem',
    color: '#718096',
    margin: 0,
  },
};

// CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .newsCard:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 50px rgba(34, 197, 94, 0.2);
      border-color: #22c55e;
    }
    .btnEdit:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
    }
    .btnDelete:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
    }
    .btnReadMore:hover {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
      transform: translateY(-2px);
    }
    .clearSearchLarge:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
    }
  `;
  if (!document.head.querySelector('[data-news-styles]')) {
    style.setAttribute('data-news-styles', 'true');
    document.head.appendChild(style);
  }
}