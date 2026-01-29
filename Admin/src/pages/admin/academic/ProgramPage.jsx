import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function ProgramPage() {
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await api.get("/program");
      setPrograms(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      showMessage("error", "Gagal memuat data program");
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: null,
    });
    setEditingId(null);
    setShowModal(false);
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editingId) {
        await api.put(`/program/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showMessage("success", "Program berhasil diperbarui!");
      } else {
        await api.post("/program", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showMessage("success", "Program berhasil ditambahkan!");
      }

      resetForm();
      fetchPrograms();
    } catch (err) {
      console.error("Submit error:", err);
      showMessage("error", err?.response?.data?.error || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (program) => {
    setFormData({
      title: program.title || "",
      description: program.description || "",
      image: null,
    });
    setEditingId(program.id);
    setShowModal(true);
    if (program.image) {
      setPreviewImage(`http://localhost:5000/${program.image}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus program ini?")) return;

    try {
      await api.delete(`/program/${id}`);
      showMessage("success", "Program berhasil dihapus");
      fetchPrograms();
    } catch (err) {
      console.error("Delete error:", err);
      showMessage("error", "Gagal menghapus program");
    }
  };

  const filteredPrograms = programs.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.wrapper}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .program-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .program-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2) !important;
          }
          
          .btn-hover {
            transition: all 0.2s ease;
          }
          
          .btn-hover:hover {
            transform: scale(1.05);
          }
          
          .input-focus:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
        `}
      </style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Manajemen Program Sekolah</h1>
          <p style={styles.subtitle}>Kelola program dan kegiatan sekolah dengan mudah</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={styles.addButton}
          className="btn-hover"
        >
          + Tambah Program
        </button>
      </div>

      {/* Alert */}
      {message.text && (
        <div
          style={{
            ...styles.alert,
            background: message.type === "error" ? "#ef4444" : "#10b981",
          }}
        >
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📋</div>
          <div>
            <div style={styles.statNumber}>{programs.length}</div>
            <div style={styles.statLabel}>Total Program</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔍</div>
          <div>
            <div style={styles.statNumber}>{filteredPrograms.length}</div>
            <div style={styles.statLabel}>Hasil Pencarian</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="🔍 Cari program berdasarkan judul atau deskripsi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
          className="input-focus"
        />
      </div>

      {/* Grid Cards */}
      <div style={styles.grid}>
        {filteredPrograms.map((program) => (
          <div key={program.id} style={styles.card} className="program-card">
            {/* Program Image */}
            <div style={styles.imageContainer}>
              {program.image ? (
                <img
                  src={`http://localhost:5000/${program.image}`}
                  alt={program.title}
                  style={styles.programImage}
                />
              ) : (
                <div style={styles.imagePlaceholder}>
                  <span style={styles.imagePlaceholderIcon}>🎯</span>
                </div>
              )}
            </div>

            {/* Program Content */}
            <div style={styles.cardBody}>
              <h3 style={styles.programTitle}>{program.title}</h3>
              <p style={styles.programDescription}>
                {program.description?.length > 100
                  ? program.description.substring(0, 100) + "..."
                  : program.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div style={styles.cardActions}>
              <button
                onClick={() => handleEdit(program)}
                style={styles.editBtn}
                className="btn-hover"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(program.id)}
                style={styles.deleteBtn}
                className="btn-hover"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div style={styles.empty}>
          <p style={styles.emptyText}>
            {searchTerm ? "Tidak ada hasil pencarian" : "Belum ada program"}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={resetForm}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingId ? "Edit Program" : "Tambah Program Baru"}
              </h2>
              <button onClick={resetForm} style={styles.closeBtn}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Image Upload */}
              <div style={styles.imageUploadSection}>
                <label style={styles.imageLabel}>Gambar Program</label>
                <div style={styles.imageUploadWrapper}>
                  <label style={styles.imageUploadBox}>
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={styles.imagePreview}
                      />
                    ) : (
                      <div style={styles.imageUploadPlaceholder}>
                        <span style={styles.uploadIcon}>🖼️</span>
                        <span style={styles.uploadText}>Upload Gambar</span>
                        <span style={styles.uploadSubtext}>Klik untuk memilih</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Judul Program *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  className="input-focus"
                  placeholder="Contoh: Pekan Olahraga Sekolah"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Deskripsi *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  style={styles.textarea}
                  className="input-focus"
                  placeholder="Jelaskan detail program..."
                  rows="6"
                />
              </div>

              <div style={styles.formActions}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={styles.cancelBtn}
                  className="btn-hover"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={styles.submitBtn}
                  className="btn-hover"
                  disabled={loading}
                >
                  {loading ? "Menyimpan..." : editingId ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    padding: "40px 20px",
    fontFamily: "'Outfit', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    flexWrap: "wrap",
    gap: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    color: "#fff",
    margin: 0,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    margin: "8px 0 0 0",
  },
  addButton: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "14px 28px",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
  },
  alert: {
    padding: "16px 20px",
    borderRadius: 12,
    marginBottom: 24,
    color: "#fff",
    fontWeight: 500,
    animation: "slideUp 0.3s ease",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },
  statCard: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: "24px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  statIcon: {
    fontSize: 40,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 700,
    color: "#1f2937",
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: 500,
  },
  searchBox: {
    marginBottom: 32,
  },
  searchInput: {
    width: "100%",
    padding: "16px 20px",
    fontSize: 16,
    border: "2px solid #475569",
    borderRadius: 12,
    background: "#fff",
    outline: "none",
    transition: "all 0.3s ease",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: 24,
    marginBottom: 40,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    overflow: "hidden",
    background: "#f3f4f6",
  },
  programImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
  },
  imagePlaceholderIcon: {
    fontSize: 60,
  },
  cardBody: {
    padding: 24,
  },
  programTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1f2937",
    margin: "0 0 12px 0",
  },
  programDescription: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 1.6,
    margin: 0,
  },
  cardActions: {
    display: "flex",
    gap: 12,
    padding: "0 24px 24px 24px",
  },
  editBtn: {
    flex: 1,
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  deleteBtn: {
    flex: 1,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#fff",
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: 500,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
    animation: "fadeIn 0.3s ease",
  },
  modal: {
    background: "#fff",
    borderRadius: 20,
    maxWidth: 700,
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 32px",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1f2937",
    margin: 0,
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: 28,
    cursor: "pointer",
    color: "#6b7280",
    padding: 0,
    lineHeight: 1,
  },
  form: {
    padding: 32,
  },
  imageUploadSection: {
    marginBottom: 32,
  },
  imageLabel: {
    display: "block",
    fontSize: 16,
    fontWeight: 700,
    color: "#374151",
    marginBottom: 16,
    textAlign: "center",
  },
  imageUploadWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  imageUploadBox: {
    cursor: "pointer",
    display: "block",
  },
  imagePreview: {
    width: 300,
    height: 200,
    borderRadius: 12,
    objectFit: "cover",
    border: "4px solid #3b82f6",
  },
  imageUploadPlaceholder: {
    width: 300,
    height: 200,
    borderRadius: 12,
    border: "3px dashed #cbd5e1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: "#f9fafb",
  },
  uploadIcon: {
    fontSize: 48,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: 700,
    color: "#374151",
  },
  uploadSubtext: {
    fontSize: 13,
    color: "#9ca3af",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    padding: "12px 16px",
    fontSize: 15,
    border: "2px solid #e5e7eb",
    borderRadius: 10,
    outline: "none",
    transition: "all 0.3s ease",
  },
  textarea: {
    padding: "12px 16px",
    fontSize: 15,
    border: "2px solid #e5e7eb",
    borderRadius: 10,
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "'Outfit', sans-serif",
    resize: "vertical",
  },
  formActions: {
    display: "flex",
    gap: 12,
    marginTop: 32,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    padding: "12px 28px",
    fontSize: 16,
    fontWeight: 600,
    border: "2px solid #e5e7eb",
    background: "#fff",
    color: "#6b7280",
    borderRadius: 10,
    cursor: "pointer",
  },
  submitBtn: {
    padding: "12px 32px",
    fontSize: 16,
    fontWeight: 600,
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    borderRadius: 10,
    cursor: "pointer",
  },
};