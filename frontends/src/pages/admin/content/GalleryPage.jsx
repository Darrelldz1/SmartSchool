import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function GalleryPage() {
  const [galleries, setGalleries] = useState([]);
  const [form, setForm] = useState({
    image_url: "",
    caption: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  /* ================= FETCH ================= */
  const fetchGallery = async () => {
    setFetchLoading(true);
    try {
      const res = await api.get("/gallery");
      setGalleries(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  useEffect(() => {
    if (form.image_url) {
      setPreviewImage(form.image_url);
    }
  }, [form.image_url]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (editId) {
        await api.put(`/gallery/${editId}`, form);
        setMessage("Galeri berhasil diupdate!");
        setMessageType("success");
      } else {
        await api.post("/gallery", form);
        setMessage("Galeri berhasil ditambahkan!");
        setMessageType("success");
      }

      resetForm();
      fetchGallery();

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      setMessage(err?.response?.data?.error || "Gagal menyimpan galeri");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      image_url: item.image_url,
      caption: item.caption || "",
    });
    setPreviewImage(item.image_url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Hapus gambar ini dari galeri?")) return;

    try {
      await api.delete(`/gallery/${id}`);
      setMessage("Galeri berhasil dihapus");
      setMessageType("success");
      fetchGallery();

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      setMessage("Gagal menghapus galeri");
      setMessageType("error");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      image_url: "",
      caption: "",
    });
    setPreviewImage("");
  };

  // Filter galleries
  const filteredGalleries = galleries.filter(item =>
    item.caption?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (fetchLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Memuat galeri...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerIcon}>🖼️</div>
          <div style={styles.headerText}>
            <h1 style={styles.pageTitle}>Galeri Sekolah</h1>
            <p style={styles.pageSubtitle}>Kelola foto dan dokumentasi kegiatan sekolah</p>
          </div>
        </div>
        <div style={styles.statsBadge}>
          <span style={styles.badgeLabel}>Total Foto</span>
          <span style={styles.badgeValue}>{galleries.length}</span>
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
            {editId ? "✏️ Edit Galeri" : "➕ Tambah Foto Baru"}
          </h2>
          {editId && (
            <button onClick={resetForm} style={styles.btnCancelSmall}>
              ✕ Batal Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            {/* Left Side - Form Inputs */}
            <div style={styles.formLeft}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <span style={styles.labelIcon}>🔗</span>
                  URL Gambar
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  required
                  style={styles.formInput}
                />
                <p style={styles.inputHint}>
                  Masukkan URL gambar yang valid (JPG, PNG, GIF)
                </p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <span style={styles.labelIcon}>💬</span>
                  Caption
                  <span style={styles.optionalBadge}>Opsional</span>
                </label>
                <textarea
                  placeholder="Deskripsi singkat tentang foto ini..."
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  style={styles.formTextarea}
                  rows="4"
                  maxLength="200"
                />
                <p style={styles.inputHint}>
                  {form.caption.length}/200 karakter
                </p>
              </div>

              <button
                type="submit"
                style={editId ? styles.btnUpdate : styles.btnSubmit}
                disabled={loading || !form.image_url}
              >
                {loading ? "⏳ Menyimpan..." : editId ? "💾 Update Galeri" : "✓ Tambah ke Galeri"}
              </button>
            </div>

            {/* Right Side - Preview */}
            <div style={styles.formRight}>
              <div style={styles.previewCard}>
                <div style={styles.previewHeader}>
                  <span style={styles.previewIcon}>👁️</span>
                  <span style={styles.previewTitle}>Preview</span>
                </div>
                {previewImage ? (
                  <div style={styles.previewImageWrapper}>
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={styles.previewImage}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div style={styles.previewError}>
                      <span style={styles.errorIcon}>⚠️</span>
                      <p style={styles.errorText}>Gambar tidak dapat dimuat</p>
                      <p style={styles.errorSubtext}>Periksa URL gambar Anda</p>
                    </div>
                    {form.caption && (
                      <div style={styles.previewCaption}>{form.caption}</div>
                    )}
                  </div>
                ) : (
                  <div style={styles.previewPlaceholder}>
                    <span style={styles.placeholderIcon}>🖼️</span>
                    <p style={styles.placeholderText}>Masukkan URL untuk melihat preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Search Bar - Enhanced */}
      <div style={styles.searchCard}>
        <div style={styles.searchLeft}>
          <div style={styles.searchIconLarge}>🔍</div>
          <div style={styles.searchContent}>
            <input
              type="text"
              placeholder="Cari foto berdasarkan caption atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <p style={styles.searchHint}>
              {searchTerm ? `Menampilkan ${filteredGalleries.length} hasil dari "${searchTerm}"` : 'Ketik untuk mencari foto'}
            </p>
          </div>
        </div>
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} style={styles.clearSearchLarge}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Gallery Grid */}
      <div style={styles.gallerySection}>
        <div style={styles.galleryHeader}>
          <h2 style={styles.galleryTitle}>📸 Koleksi Foto</h2>
          <span style={styles.resultCount}>
            {filteredGalleries.length} dari {galleries.length} foto
          </span>
        </div>

        {filteredGalleries.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🖼️</div>
            <p style={styles.emptyText}>
              {searchTerm ? "Tidak ada foto yang cocok dengan pencarian" : "Belum ada foto di galeri"}
            </p>
            {!searchTerm && (
              <p style={styles.emptySubtext}>Mulai tambahkan foto menggunakan form di atas</p>
            )}
          </div>
        ) : (
          <div style={styles.galleryGrid}>
            {filteredGalleries.map((item, index) => (
              <div
                key={item.id}
                style={{...styles.galleryCard, animationDelay: `${index * 0.1}s`}}
              >
                <div style={styles.imageWrapper}>
                  <img
                    src={item.image_url}
                    alt={item.caption || "Gallery image"}
                    style={styles.galleryImage}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23e2e8f0" width="300" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%239ca3af"%3EImage Error%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div style={styles.imageOverlay}>
                    <div style={styles.overlayButtons}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={styles.btnEditOverlay}
                        title="Edit foto ini"
                      >
                        <span style={styles.btnIcon}>✏️</span>
                        <span style={styles.btnLabel}>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={styles.btnDeleteOverlay}
                        title="Hapus foto ini"
                      >
                        <span style={styles.btnIcon}>🗑️</span>
                        <span style={styles.btnLabel}>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
                {item.caption && (
                  <div style={styles.cardCaption}>
                    <p style={styles.captionText}>{item.caption}</p>
                  </div>
                )}
                <div style={styles.cardFooter}>
                  <span style={styles.cardDate}>
                    📅 {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </span>
                  <div style={styles.cardActions}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={styles.btnEditSmall}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={styles.btnDeleteSmall}
                    >
                      🗑️ Hapus
                    </button>
                  </div>
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
    borderTopColor: '#ec4899',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  loadingText: {
    marginTop: '1rem',
    fontSize: '1.1rem',
    color: '#ec4899',
    fontWeight: 600,
  },
  
  // Header
  header: {
    maxWidth: '1400px',
    margin: '0 auto 2rem',
    background: 'white',
    borderRadius: '24px',
    padding: '2.5rem',
    boxShadow: '0 10px 40px rgba(236, 72, 153, 0.15)',
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
    background: 'linear-gradient(135deg, #ec4899, #db2777)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    boxShadow: '0 8px 20px rgba(236, 72, 153, 0.4)',
  },
  
  headerText: {
    flex: 1,
  },
  
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #ec4899, #db2777)',
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
    background: 'linear-gradient(135deg, #ec4899, #db2777)',
    padding: '1.5rem 2rem',
    borderRadius: '16px',
    textAlign: 'center',
    minWidth: '160px',
    boxShadow: '0 8px 20px rgba(236, 72, 153, 0.3)',
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
    boxShadow: '0 10px 40px rgba(236, 72, 153, 0.15)',
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
    width: '100%',
  },
  
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem',
  },
  
  formLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  
  formRight: {
    position: 'sticky',
    top: '2rem',
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
  
  optionalBadge: {
    marginLeft: 'auto',
    background: '#fce7f3',
    color: '#ec4899',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
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
  },
  
  inputHint: {
    fontSize: '0.875rem',
    color: '#718096',
    marginTop: '0.5rem',
    margin: '0.5rem 0 0 0',
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
    background: 'linear-gradient(135deg, #ec4899, #db2777)',
    color: 'white',
    boxShadow: '0 8px 24px rgba(236, 72, 153, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '1rem',
  },
  
  // Preview Card
  previewCard: {
    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    borderRadius: '20px',
    padding: '1.5rem',
    border: '3px solid #e2e8f0',
  },
  
  previewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #cbd5e0',
  },
  
  previewIcon: {
    fontSize: '1.5rem',
  },
  
  previewTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#2d3748',
  },
  
  previewImageWrapper: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  
  previewImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    display: 'block',
  },
  
  previewError: {
    width: '100%',
    height: '300px',
    display: 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
    gap: '0.5rem',
  },
  
  errorIcon: {
    fontSize: '3rem',
  },
  
  errorText: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#991b1b',
    margin: 0,
  },
  
  errorSubtext: {
    fontSize: '0.875rem',
    color: '#b91c1c',
    margin: 0,
  },
  
  previewCaption: {
    padding: '1rem',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    fontSize: '0.95rem',
    lineHeight: '1.5',
  },
  
  previewPlaceholder: {
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e2e8f0, #cbd5e0)',
    borderRadius: '12px',
  },
  
  placeholderIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    opacity: 0.5,
  },
  
  placeholderText: {
    color: '#64748b',
    fontSize: '1rem',
    fontWeight: 600,
    margin: 0,
  },
  
  // Search
  searchCard: {
    maxWidth: '1400px',
    margin: '0 auto 2rem',
    background: 'white',
    borderRadius: '24px',
    padding: '2rem 2.5rem',
    boxShadow: '0 10px 40px rgba(236, 72, 153, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
    border: '3px solid #fce7f3',
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
    background: 'linear-gradient(135deg, #ec4899, #db2777)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
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
    transition: 'all 0.3s ease',
  },
  
  // Gallery Section
  gallerySection: {
    maxWidth: '1400px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '24px',
    padding: '3rem',
    boxShadow: '0 10px 40px rgba(236, 72, 153, 0.15)',
  },
  
  galleryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  
  galleryTitle: {
    fontSize: '2rem',
    fontWeight: 900,
    color: '#2d3748',
    margin: 0,
  },
  
  resultCount: {
    background: '#fce7f3',
    color: '#ec4899',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 700,
  },
  
  // Gallery Grid
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
  },
  
  galleryCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    animation: 'fadeInUp 0.6s ease-out both',
  },
  
  imageWrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  
  galleryImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  
  overlayButtons: {
    display: 'flex',
    gap: '1rem',
  },
  
  btnEditOverlay: {
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)',
    transition: 'transform 0.3s ease',
  },
  
  btnDeleteOverlay: {
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.5)',
    transition: 'transform 0.3s ease',
  },
  
  btnIcon: {
    fontSize: '1.25rem',
  },
  
  btnLabel: {
    fontSize: '1rem',
    fontWeight: 700,
  },
  
  cardCaption: {
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
  },
  
  captionText: {
    fontSize: '0.95rem',
    color: '#4a5568',
    margin: 0,
    lineHeight: '1.6',
  },
  
  cardFooter: {
    padding: '1rem',
    background: '#f8fafc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    borderTop: '1px solid #e5e7eb',
  },
  
  cardDate: {
    fontSize: '0.875rem',
    color: '#718096',
    fontWeight: 600,
  },
  
  cardActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  
  btnEditSmall: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
  },
  
  btnDeleteSmall: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
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

// CSS keyframes need to be added via a style tag
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
    .gallery-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(236, 72, 153, 0.25);
    }
    .gallery-card:hover .galleryImage {
      transform: scale(1.1);
    }
    .gallery-card:hover .imageOverlay {
      opacity: 1;
    }
    .btnEditOverlay:hover, .btnDeleteOverlay:hover {
      transform: scale(1.1);
    }
  `;
  if (!document.head.querySelector('[data-gallery-styles]')) {
    style.setAttribute('data-gallery-styles', 'true');
    document.head.appendChild(style);
  }
}