import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function HistoryPage() {
  const [history, setHistory] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* ================= GET HISTORY ================= */
  const fetchHistory = async () => {
    setFetchLoading(true);
    try {
      const res = await api.get("/history");
      setHistory(res.data);
      setDescription(res.data.description || "");
    } catch (err) {
      console.log("History belum ada");
      setHistory(null);
      setDescription("");
    } finally {
      setFetchLoading(false);
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
        await api.put(`/history/${history.id}`, { description });
        setMessage("Sejarah berhasil diperbarui!");
        setMessageType("success");
      } else {
        const res = await api.post("/history", { description });
        setHistory(res.data.history);
        setMessage("Sejarah berhasil ditambahkan!");
        setMessageType("success");
      }
      fetchHistory();
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      setMessage(err?.response?.data?.error || "Terjadi kesalahan");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!window.confirm("Hapus sejarah sekolah? Anda harus membuat ulang setelahnya.")) return;
    
    try {
      await api.delete(`/history/${history.id}`);
      setHistory(null);
      setDescription("");
      setMessage("Sejarah berhasil dihapus");
      setMessageType("success");
      
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      setMessage("Gagal menghapus sejarah");
      setMessageType("error");
    }
  };

  if (fetchLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Memuat data sejarah...</p>
      </div>
    );
  }

  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
  const charCount = description.length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerIcon}>📜</div>
          <div style={styles.headerText}>
            <h1 style={styles.pageTitle}>Sejarah Sekolah</h1>
            <p style={styles.pageSubtitle}>Ceritakan perjalanan dan sejarah berdirinya sekolah</p>
          </div>
        </div>
        <div style={styles.statusBadge}>
          <span style={styles.badgeLabel}>Status</span>
          <span style={styles.badgeValue}>
            {history ? "✓ Sudah Ada" : "⚠ Belum Ada"}
          </span>
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

      {/* Main Card */}
      <div style={styles.mainCard}>
        <div style={styles.cardHeader}>
          <div style={styles.cardHeaderLeft}>
            <h2 style={styles.cardTitle}>
              {history ? "✏️ Edit Sejarah" : "➕ Tambah Sejarah"}
            </h2>
            <p style={styles.cardSubtitle}>
              Tuliskan sejarah lengkap tentang perjalanan sekolah dari awal hingga sekarang
            </p>
          </div>
          {history && (
            <div style={styles.metaInfo}>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>Terakhir diubah</span>
                <span style={styles.metaValue}>
                  {new Date(history.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Textarea */}
          <div style={styles.editorWrapper}>
            <div style={styles.editorToolbar}>
              <div style={styles.toolbarLeft}>
                <span style={styles.toolbarIcon}>📝</span>
                <span style={styles.toolbarText}>Editor Konten</span>
              </div>
              <div style={styles.toolbarRight}>
                <span style={styles.counterBadge}>
                  {wordCount} kata
                </span>
                <span style={styles.counterBadge}>
                  {charCount} karakter
                </span>
              </div>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan sejarah sekolah di sini...&#10;&#10;Contoh:&#10;&#10;Sekolah kami didirikan pada tahun 1985 dengan visi untuk menyediakan pendidikan berkualitas tinggi. Dimulai dengan hanya 3 kelas dan 50 siswa, kini sekolah kami telah berkembang menjadi...&#10;&#10;Perjalanan panjang kami dimulai ketika..."
              required
              style={styles.textarea}
              rows="20"
            />
          </div>

          {/* Guidelines */}
          <div style={styles.guidelinesCard}>
            <h3 style={styles.guidelinesTitle}>💡 Tips Menulis Sejarah</h3>
            <ul style={styles.guidelinesList}>
              <li>Mulai dengan tahun berdiri dan latar belakang pendirian</li>
              <li>Ceritakan tokoh-tokoh penting dan pendiri sekolah</li>
              <li>Jelaskan perkembangan dari masa ke masa</li>
              <li>Sertakan pencapaian dan milestone penting</li>
              <li>Gunakan bahasa yang mudah dipahami dan menarik</li>
              <li>Tambahkan detail yang membuat cerita lebih hidup</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            {history && (
              <button
                type="button"
                onClick={handleDelete}
                style={styles.btnDelete}
              >
                🗑️ Hapus Sejarah
              </button>
            )}
            <button
              type="submit"
              style={history ? styles.btnUpdate : styles.btnCreate}
              disabled={loading || !description.trim()}
            >
              {loading ? "⏳ Menyimpan..." : history ? "💾 Update Sejarah" : "✓ Simpan Sejarah"}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Card */}
      {description && (
        <div style={styles.previewCard}>
          <div style={styles.previewHeader}>
            <div style={styles.previewHeaderIcon}>👁️</div>
            <div>
              <h2 style={styles.previewTitle}>Preview</h2>
              <p style={styles.previewSubtitle}>Tampilan untuk user/pengunjung</p>
            </div>
          </div>
          <div style={styles.previewContent}>
            <div style={styles.previewBanner}>
              <span style={styles.previewBannerIcon}>📜</span>
              <h3 style={styles.previewBannerText}>SEJARAH SEKOLAH</h3>
            </div>
            <div style={styles.previewText}>
              {description.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} style={styles.previewParagraph}>
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </div>
        </div>
      )}
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
    borderTopColor: '#667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  loadingText: {
    marginTop: '1rem',
    fontSize: '1.1rem',
    color: '#667eea',
    fontWeight: 600,
  },
  
  // Header
  header: {
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    background: 'white',
    borderRadius: '24px',
    padding: '2.5rem',
    boxShadow: '0 10px 40px rgba(33, 150, 243, 0.15)',
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
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
  },
  
  headerText: {
    flex: 1,
  },
  
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
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
  
  statusBadge: {
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    padding: '1.5rem 2rem',
    borderRadius: '16px',
    textAlign: 'center',
    minWidth: '160px',
    boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
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
    fontSize: '1.25rem',
    fontWeight: 900,
    lineHeight: 1,
  },
  
  // Alert
  alert: {
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    padding: '1.25rem 1.5rem',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1rem',
    fontWeight: 600,
    animation: 'slideDown 0.3s ease-out',
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
  
  // Main Card
  mainCard: {
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    background: 'white',
    borderRadius: '24px',
    padding: '3rem',
    boxShadow: '0 10px 40px rgba(33, 150, 243, 0.15)',
  },
  
  cardHeader: {
    marginBottom: '2rem',
  },
  
  cardHeaderLeft: {
    marginBottom: '1rem',
  },
  
  cardTitle: {
    fontSize: '2rem',
    fontWeight: 900,
    color: '#2d3748',
    margin: '0 0 0.5rem 0',
  },
  
  cardSubtitle: {
    fontSize: '1rem',
    color: '#718096',
    margin: 0,
    lineHeight: '1.6',
  },
  
  metaInfo: {
    display: 'flex',
    gap: '2rem',
    paddingTop: '1rem',
    borderTop: '2px solid #e2e8f0',
  },
  
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  
  metaLabel: {
    fontSize: '0.875rem',
    color: '#718096',
    fontWeight: 600,
  },
  
  metaValue: {
    fontSize: '1rem',
    color: '#2d3748',
    fontWeight: 700,
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  
  // Editor
  editorWrapper: {
    border: '3px solid #e2e8f0',
    borderRadius: '16px',
    overflow: 'hidden',
    background: 'white',
  },
  
  editorToolbar: {
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  
  toolbarIcon: {
    fontSize: '1.5rem',
  },
  
  toolbarText: {
    color: 'white',
    fontWeight: 700,
    fontSize: '1rem',
  },
  
  toolbarRight: {
    display: 'flex',
    gap: '0.75rem',
  },
  
  counterBadge: {
    background: 'rgba(255, 255, 255, 0.25)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: 700,
    backdropFilter: 'blur(10px)',
  },
  
  textarea: {
    width: '100%',
    padding: '1.5rem',
    border: 'none',
    fontSize: '1.05rem',
    lineHeight: '1.8',
    background: '#f8fafc',
    color: '#2d3748',
    resize: 'vertical',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    outline: 'none',
  },
  
  // Guidelines
  guidelinesCard: {
    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    padding: '2rem',
    borderRadius: '16px',
    border: '2px solid #f59e0b',
  },
  
  guidelinesTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#92400e',
    margin: '0 0 1rem 0',
  },
  
  guidelinesList: {
    margin: 0,
    paddingLeft: '1.5rem',
    color: '#78350f',
    fontSize: '1rem',
    lineHeight: '1.8',
  },
  
  // Action Buttons
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    paddingTop: '2rem',
    borderTop: '2px solid #e2e8f0',
  },
  
  btnCreate: {
    flex: 1,
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
  },
  
  btnUpdate: {
    flex: 1,
    padding: '1.25rem 2rem',
    border: 'none',
    borderRadius: '16px',
    fontSize: '1.15rem',
    fontWeight: 800,
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: 'white',
    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  
  btnDelete: {
    flex: '0 0 auto',
    minWidth: '200px',
    padding: '1.25rem 2rem',
    border: 'none',
    borderRadius: '16px',
    fontSize: '1.15rem',
    fontWeight: 800,
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  
  // Preview Card
  previewCard: {
    maxWidth: '1200px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '24px',
    padding: '3rem',
    boxShadow: '0 10px 40px rgba(33, 150, 243, 0.15)',
  },
  
  previewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '3px solid #e2e8f0',
  },
  
  previewHeaderIcon: {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    flexShrink: 0,
  },
  
  previewTitle: {
    fontSize: '1.75rem',
    fontWeight: 900,
    color: '#2d3748',
    margin: '0 0 0.25rem 0',
  },
  
  previewSubtitle: {
    fontSize: '1rem',
    color: '#718096',
    margin: 0,
  },
  
  previewContent: {
    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    padding: '2.5rem',
    borderRadius: '16px',
  },
  
  previewBanner: {
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    padding: '2rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  
  previewBannerIcon: {
    fontSize: '2.5rem',
  },
  
  previewBannerText: {
    color: 'white',
    fontSize: '2rem',
    fontWeight: 900,
    margin: 0,
    letterSpacing: '2px',
  },
  
  previewText: {
    fontSize: '1.05rem',
    lineHeight: '2',
    color: '#374151',
  },
  
  previewParagraph: {
    margin: '0 0 1.5rem 0',
    textAlign: 'justify',
  },
};