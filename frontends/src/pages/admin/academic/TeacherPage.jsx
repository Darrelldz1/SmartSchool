import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function TeacherPage() {
  const [teacher, setTeacher] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    date_joined: "",
    position: "",
    subject: "",
    photo: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  /* ================= FETCH ================= */
  const fetchTeacher = async () => {
    try {
      const res = await api.get("/teacher");
      setTeacher(res.data || []);
    } catch (err) {
      console.error(err);
      showMessage("error", "Gagal memuat data guru");
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

  /* ================= MESSAGE HANDLER ================= */
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  /* ================= FILE HANDLER ================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  /* ================= FORM HANDLER ================= */
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nip: "",
      date_joined: "",
      position: "",
      subject: "",
      photo: null,
    });
    setEditingId(null);
    setShowModal(false);
    setPreviewImage(null);
  };

  /* ================= CREATE / UPDATE ================= */
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const data = new FormData();

    data.append("name", formData.name);
    data.append("subject", formData.subject);

    if (formData.nip) data.append("nip", formData.nip);
    if (formData.position) data.append("position", formData.position);
    if (formData.date_joined) data.append("date_joined", formData.date_joined);
    if (formData.photo) data.append("photo", formData.photo);

    if (editingId) {
      // ✅ MODE EDIT
      await api.put(`/teacher/${editingId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showMessage("success", "Data guru berhasil diperbarui 🎉");
    } else {
      // ✅ MODE TAMBAH
      await api.post("/teacher", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showMessage("success", "Guru berhasil ditambahkan 🎊");
    }

    resetForm();
    fetchTeacher();
  } catch (err) {
    console.error(err.response || err);
    showMessage(
      "error",
      err?.response?.data?.error || "Gagal menyimpan data guru"
    );
  } finally {
    setLoading(false);
  }
};

  /* ================= EDIT ================= */
  const handleEdit = (teacher) => {
  setFormData({
    name: teacher.name || "",
    nip: teacher.nip || "",
    date_joined: teacher.date_joined
      ? teacher.date_joined.split("T")[0]
      : "",
    position: teacher.position || "",
    subject: teacher.subject || "",
    photo: null, // JANGAN isi file
  });

  setEditingId(teacher.id); 
  setShowModal(true);

  if (teacher.photo) {
    setPreviewImage(`http://localhost:5000/${teacher.photo}`);
  }
};


  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Hapus data guru ini?")) return;

    try {
      await api.delete(`/teacher/${id}`);
      showMessage("success", "Data guru berhasil dihapus");
      fetchTeacher();
    } catch (err) {
      showMessage("error", "Gagal menghapus data guru");
    }
  };

  /* ================= FILTER ================= */
  const filteredTeacher = teacher.filter(
    (t) =>
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nip?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'DM Sans', sans-serif;
        }
        
        .teacher-card {
          animation: slideUp 0.5s ease backwards;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .teacher-card:nth-child(1) { animation-delay: 0.1s; }
        .teacher-card:nth-child(2) { animation-delay: 0.2s; }
        .teacher-card:nth-child(3) { animation-delay: 0.3s; }
        .teacher-card:nth-child(4) { animation-delay: 0.4s; }
        .teacher-card:nth-child(5) { animation-delay: 0.5s; }
        .teacher-card:nth-child(6) { animation-delay: 0.6s; }
        
        .teacher-card:hover {
          transform: translateY(-12px) rotate(-1deg);
          box-shadow: 0 25px 60px rgba(255, 107, 107, 0.3) !important;
        }
        
        .add-btn {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .add-btn:hover {
          transform: scale(1.05) rotate(2deg);
          box-shadow: 0 15px 40px rgba(139, 92, 246, 0.4) !important;
        }
        
        .search-input:focus {
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3) !important;
          transform: translateY(-2px);
        }
        
        .action-btn {
          transition: all 0.2s ease;
        }
        
        .action-btn:hover {
          transform: scale(1.2) rotate(5deg);
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(16, 185, 129, 0.5) !important;
        }
        
        .submit-btn:active:not(:disabled) {
          transform: translateY(-1px);
        }
        
        .photo-preview-wrapper:hover {
          transform: scale(1.05) rotate(3deg);
        }
        
        .floating-shape {
          animation: float 6s ease-in-out infinite;
        }
        
        .modal-content {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .alert-message {
          animation: slideUp 0.4s ease;
        }
      `}</style>

      <div style={styles.wrapper}>
        {/* Floating Decorative Shapes */}
        <div style={styles.floatingShape1} className="floating-shape" />
        <div style={styles.floatingShape2} className="floating-shape" />
        <div style={styles.floatingShape3} className="floating-shape" />

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <span style={styles.titleEmoji}>👨‍🏫</span>
              Manajemen Guru
            </h1>
            <p style={styles.subtitle}>
              Kelola data guru dengan mudah & menyenangkan
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={styles.addButton}
            className="add-btn"
          >
            <span style={styles.addIcon}>✨</span>
            Tambah Guru Baru
          </button>
        </div>

        {/* Alert Message */}
        {message.text && (
          <div
            className="alert-message"
            style={{
              ...styles.alert,
              ...(message.type === "error" ? styles.alertError : styles.alertSuccess),
            }}
          >
            <span style={styles.alertIcon}>
              {message.type === "error" ? "⚠️" : "✅"}
            </span>
            {message.text}
          </div>
        )}

        {/* Stats Cards */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div>
              <div style={styles.statNumber}>{teacher.length}</div>
              <div style={styles.statLabel}>Total Guru</div>
            </div>
          </div>
          <div style={{ ...styles.statCard, ...styles.statCard2 }}>
            <div style={styles.statIcon}>📚</div>
            <div>
              <div style={styles.statNumber}>
                {new Set(teacher.map(t => t.subject)).size}
              </div>
              <div style={styles.statLabel}>Mata Pelajaran</div>
            </div>
          </div>
          <div style={{ ...styles.statCard, ...styles.statCard3 }}>
            <div style={styles.statIcon}>⭐</div>
            <div>
              <div style={styles.statNumber}>{filteredTeacher.length}</div>
              <div style={styles.statLabel}>Hasil Pencarian</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Cari guru berdasarkan nama, NIP, atau mata pelajaran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            className="search-input"
          />
        </div>

        {/* Teacher Cards Grid */}
        <div style={styles.grid}>
          {filteredTeacher.map((teacher, index) => (
            <div key={teacher.id} className="teacher-card" style={styles.card}>
              {/* Card Ribbon */}
              <div style={styles.cardRibbon}>
                <span style={styles.ribbonText}>#{index + 1}</span>
              </div>

              {/* Avatar Section */}
              <div style={styles.avatarSection}>
                {teacher.photo ? (
                  <img
                    src={`http://localhost:5000/${teacher.photo}`}
                    alt={teacher.name}
                    style={{width: 80,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}/>
                ) : (
                  <div style={styles.avatarPlaceholder}>
                    <span style={styles.avatarText}>
                      {teacher.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div style={styles.avatarBadge}>
                  <span>🎓</span>
                </div>
              </div>

              {/* Teacher Info */}
              <div style={styles.cardBody}>
                <h3 style={styles.teacherName}>{teacher.name}</h3>

                <div style={styles.subjectBadge}>
                  <span style={styles.subjectIcon}>📖</span>
                  {teacher.subject}
                </div>

                <div style={styles.infoGrid}>
                  {teacher.nip && (
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>NIP</span>
                      <span style={styles.infoValue}>{teacher.nip}</span>
                    </div>
                  )}
                  {teacher.position && (
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Posisi</span>
                      <span style={styles.infoValue}>{teacher.position}</span>
                    </div>
                  )}
                  {teacher.date_joined && (
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Bergabung</span>
                      <span style={styles.infoValue}>
                        {new Date(teacher.date_joined).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={styles.cardActions}>
                <button
                  onClick={() => handleEdit(teacher)}
                  style={styles.editBtn}
                  className="action-btn"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(teacher.id)}
                  style={styles.deleteBtn}
                  className="action-btn"
                  title="Hapus"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTeacher.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              {searchTerm ? "🔍" : "📚"}
            </div>
            <h3 style={styles.emptyTitle}>
              {searchTerm ? "Tidak Ada Hasil" : "Belum Ada Data Guru"}
            </h3>
            <p style={styles.emptyText}>
              {searchTerm
                ? "Coba kata kunci lain atau hapus pencarian"
                : "Klik tombol 'Tambah Guru Baru' untuk memulai"}
            </p>
          </div>
        )}

        {/* Modal Form */}
        {showModal && (
          <div style={styles.modalOverlay} onClick={resetForm}>
            <div
              className="modal-content"
              style={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {editingId ? "✏️ Edit Data Guru" : "✨ Tambah Guru Baru"}
                </h2>
                <button onClick={resetForm} style={styles.closeBtn}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                {/* Photo Upload */}
                <div style={styles.photoUploadSection}>
                  <label style={styles.photoLabel}>Foto Guru</label>
                  <div style={styles.photoUploadWrapper}>
                    <label style={styles.photoUploadBox} className="photo-preview-wrapper">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          style={styles.photoPreview}
                        />
                      ) : (
                        <div style={styles.photoPlaceholder}>
                          <span style={styles.photoIcon}>📷</span>
                          <span style={styles.photoText}>Upload Foto</span>
                          <span style={styles.photoSubtext}>Klik untuk memilih</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={styles.fileInput}
                      />
                    </label>
                  </div>
                </div>

                {/* Form Fields */}
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      <span style={styles.labelIcon}>👤</span>
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      <span style={styles.labelIcon}>🔢</span>
                      NIP
                    </label>
                    <input
                      type="text"
                      name="nip"
                      value={formData.nip}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Nomor Induk Pegawai"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      <span style={styles.labelIcon}>💼</span>
                      Posisi
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Guru Mata Pelajaran, Wali Kelas, dll"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      <span style={styles.labelIcon}>📚</span>
                      Mata Pelajaran *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                      placeholder="Matematika, Bahasa Indonesia, dll"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      <span style={styles.labelIcon}>📅</span>
                      Tanggal Bergabung
                    </label>
                    <input
                      type="date"
                      name="date_joined"
                      value={formData.date_joined}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div style={styles.formActions}>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={styles.cancelBtn}
                    disabled={loading}
                  >
                    ❌ Batal
                  </button>
                  <button
                    type="submit"
                    style={styles.submitBtn}
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? "⏳ Menyimpan..." : editingId ? "💾 Perbarui Data" : "✨ Simpan Data"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ================= STYLES ================= */
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
  },

  floatingShape1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
    top: -100,
    right: -100,
    zIndex: 0,
    animationDelay: "0s",
  },

  floatingShape2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.08)",
    bottom: 100,
    left: -50,
    zIndex: 0,
    animationDelay: "2s",
  },

  floatingShape3: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.06)",
    top: "50%",
    right: "10%",
    zIndex: 0,
    animationDelay: "4s",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    flexWrap: "wrap",
    gap: 20,
    position: "relative",
    zIndex: 1,
  },

  title: {
    fontSize: 48,
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    color: "#fff",
    margin: 0,
    textShadow: "4px 4px 8px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    gap: 15,
  },

  titleEmoji: {
    fontSize: 52,
    animation: "bounce 2s ease infinite",
  },

  subtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.95)",
    margin: "10px 0 0 0",
    fontWeight: 400,
  },

  addButton: {
    background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 16,
    padding: "16px 32px",
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(139, 92, 246, 0.4)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "'Fredoka', sans-serif",
  },

  addIcon: {
    fontSize: 24,
  },

  alert: {
    padding: "18px 24px",
    borderRadius: 16,
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontWeight: 600,
    fontSize: 16,
    position: "relative",
    zIndex: 1,
  },

  alertSuccess: {
    background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    color: "#fff",
    boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
  },

  alertError: {
    background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    color: "#fff",
    boxShadow: "0 8px 24px rgba(239, 68, 68, 0.4)",
  },

  alertIcon: {
    fontSize: 24,
  },

  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
    marginBottom: 32,
    position: "relative",
    zIndex: 1,
  },

  statCard: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: "24px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
    border: "3px solid #FF6B6B",
  },

  statCard2: {
    border: "3px solid #4ECDC4",
  },

  statCard3: {
    border: "3px solid #FFE66D",
  },

  statIcon: {
    fontSize: 42,
    lineHeight: 1,
  },

  statNumber: {
    fontSize: 32,
    fontWeight: 800,
    fontFamily: "'Fredoka', sans-serif",
    color: "#1F2937",
  },

  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: 600,
    marginTop: 4,
  },

  searchContainer: {
    position: "relative",
    marginBottom: 32,
    zIndex: 1,
  },

  searchIcon: {
    position: "absolute",
    left: 24,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 24,
    zIndex: 2,
  },

  searchInput: {
    width: "100%",
    padding: "20px 20px 20px 64px",
    fontSize: 16,
    border: "none",
    borderRadius: 20,
    background: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "'DM Sans', sans-serif",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 28,
    marginBottom: 40,
    position: "relative",
    zIndex: 1,
  },

  card: {
    background: "#fff",
    borderRadius: 24,
    padding: "28px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
    position: "relative",
    overflow: "hidden",
    border: "4px solid transparent",
  },

  cardRibbon: {
    position: "absolute",
    top: 20,
    right: -30,
    background: "linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)",
    color: "#fff",
    padding: "8px 40px",
    transform: "rotate(45deg)",
    boxShadow: "0 4px 12px rgba(255, 107, 107, 0.4)",
  },

  ribbonText: {
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "'Fredoka', sans-serif",
  },

  avatarSection: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    objectFit: "cover",
    border: "5px solid #fff",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  },

  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "5px solid #fff",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  },

  avatarText: {
    fontSize: 48,
    fontWeight: 800,
    color: "#fff",
    fontFamily: "'Fredoka', sans-serif",
  },

  avatarBadge: {
    position: "absolute",
    bottom: 5,
    right: "calc(50% - 50px)",
    background: "#FFE66D",
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    border: "3px solid #fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },

  cardBody: {
    textAlign: "center",
    marginBottom: 20,
  },

  teacherName: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1F2937",
    margin: "0 0 12px 0",
    fontFamily: "'Fredoka', sans-serif",
  },

  subjectBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
    color: "#fff",
    padding: "8px 20px",
    borderRadius: 50,
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 20,
    boxShadow: "0 4px 12px rgba(78, 205, 196, 0.4)",
  },

  subjectIcon: {
    fontSize: 18,
  },

  infoGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
  },

  infoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    background: "#F9FAFB",
    borderRadius: 12,
  },

  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: 600,
  },

  infoValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: 700,
  },

  cardActions: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
  },

  editBtn: {
    background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
    border: "none",
    width: 48,
    height: 48,
    borderRadius: "50%",
    fontSize: 20,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(59, 130, 246, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteBtn: {
    background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    border: "none",
    width: 48,
    height: 48,
    borderRadius: "50%",
    fontSize: 20,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(239, 68, 68, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
    position: "relative",
    zIndex: 1,
  },

  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
  },

  emptyTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#1F2937",
    marginBottom: 12,
    fontFamily: "'Fredoka', sans-serif",
  },

  emptyText: {
    fontSize: 16,
    color: "#6B7280",
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
    backdropFilter: "blur(8px)",
    animation: "fadeIn 0.3s ease",
  },

  modal: {
    background: "#fff",
    borderRadius: 28,
    maxWidth: 800,
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "28px 36px",
    borderBottom: "3px solid #F3F4F6",
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 10,
    borderRadius: "28px 28px 0 0",
  },

  modalTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#1F2937",
    margin: 0,
    fontFamily: "'Fredoka', sans-serif",
  },

  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: 32,
    cursor: "pointer",
    color: "#6B7280",
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "all 0.3s ease",
  },

  form: {
    padding: "36px",
  },

  photoUploadSection: {
    marginBottom: 32,
  },

  photoLabel: {
    display: "block",
    fontSize: 16,
    fontWeight: 700,
    color: "#374151",
    marginBottom: 16,
    textAlign: "center",
  },

  photoUploadWrapper: {
    display: "flex",
    justifyContent: "center",
  },

  photoUploadBox: {
    cursor: "pointer",
    display: "block",
    transition: "all 0.3s ease",
  },

  photoPreview: {
    width: 150,
    height: 150,
    borderRadius: "50%",
    objectFit: "cover",
    border: "5px solid #667eea",
    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
  },

  photoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: "50%",
    border: "4px dashed #CBD5E1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: "#F9FAFB",
    transition: "all 0.3s ease",
  },

  photoIcon: {
    fontSize: 40,
  },

  photoText: {
    fontSize: 15,
    fontWeight: 700,
    color: "#374151",
  },

  photoSubtext: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: 500,
  },

  fileInput: {
    display: "none",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  formLabel: {
    fontSize: 15,
    fontWeight: 700,
    color: "#374151",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  labelIcon: {
    fontSize: 18,
  },

  input: {
    padding: "14px 18px",
    fontSize: 15,
    border: "3px solid #E5E7EB",
    borderRadius: 14,
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "'DM Sans', sans-serif",
  },

  formActions: {
    display: "flex",
    gap: 16,
    marginTop: 36,
    justifyContent: "flex-end",
  },

  cancelBtn: {
    padding: "14px 32px",
    fontSize: 16,
    fontWeight: 700,
    border: "3px solid #E5E7EB",
    background: "#fff",
    color: "#6B7280",
    borderRadius: 14,
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "'Fredoka', sans-serif",
  },

  submitBtn: {
    padding: "14px 36px",
    fontSize: 16,
    fontWeight: 700,
    border: "none",
    background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    color: "#fff",
    borderRadius: 14,
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
    transition: "all 0.3s ease",
    fontFamily: "'Fredoka', sans-serif",
  },
};