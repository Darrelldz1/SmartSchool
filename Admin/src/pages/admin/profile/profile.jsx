import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    id: null,
    vision: "",
    mission: "",
    core_values: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    setFetchLoading(true);
    try {
      const res = await api.get("/profile");
      if (res.data) {
        setProfile(res.data);
        setIsEdit(true);
      }
    } catch (err) {
      console.error(err);
      setIsEdit(false);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && profile.id) {
        await api.put(`/profile/${profile.id}`, {
          vision: profile.vision,
          mission: profile.mission,
          core_values: profile.core_values,
        });
        alert("Profile berhasil diupdate");
      } else {
        const res = await api.post("/profile", {
          vision: profile.vision,
          mission: profile.mission,
          core_values: profile.core_values,
        });
        setProfile(res.data.profile);
        setIsEdit(true);
        alert("Profile berhasil dibuat");
      }
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!window.confirm("Hapus profile sekolah? Anda harus membuat ulang setelahnya.")) return;
    
    try {
      await api.delete(`/profile/${profile.id}`);
      setProfile({
        id: null,
        vision: "",
        mission: "",
        core_values: "",
      });
      setIsEdit(false);
      alert("Profile berhasil dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus profile");
    }
  };

  if (fetchLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Memuat data profile...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerIconGroup}>
            <div style={styles.headerIcon}>🎯</div>
            <div style={styles.headerDivider}></div>
            <div style={styles.headerIcon}>🚀</div>
            <div style={styles.headerDivider}></div>
            <div style={styles.headerIcon}>💎</div>
          </div>
          <div style={styles.headerText}>
            <h1 style={styles.pageTitle}>Profile Sekolah</h1>
            <p style={styles.pageSubtitle}>Visi, Misi & Core Values</p>
          </div>
        </div>
        <div style={styles.statusBadge}>
          <span style={styles.statusLabel}>Status</span>
          <span style={styles.statusValue}>
            {isEdit ? "✓ Sudah Ada" : "⚠ Belum Ada"}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainCard}>
        <form onSubmit={submit}>
          {/* Vision Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIconWrapper}>
                <span style={styles.sectionIcon}>🎯</span>
              </div>
              <div style={styles.sectionTitle}>
                <h2 style={styles.sectionHeading}>VISI</h2>
                <p style={styles.sectionSubheading}>Gambaran masa depan yang ingin dicapai</p>
              </div>
            </div>
            <textarea
              value={profile.vision}
              onChange={(e) => setProfile({ ...profile, vision: e.target.value })}
              placeholder="Tuliskan visi sekolah di sini...&#10;&#10;Contoh:&#10;Menjadi sekolah unggulan yang menghasilkan generasi cerdas, berkarakter, dan berdaya saing global."
              required
              style={styles.textarea}
              rows="6"
            />
          </div>

          {/* Mission Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={{...styles.sectionIconWrapper, background: 'linear-gradient(135deg, #22c55e, #16a34a)'}}>
                <span style={styles.sectionIcon}>🚀</span>
              </div>
              <div style={styles.sectionTitle}>
                <h2 style={styles.sectionHeading}>MISI</h2>
                <p style={styles.sectionSubheading}>Langkah-langkah untuk mencapai visi</p>
              </div>
            </div>
            <textarea
              value={profile.mission}
              onChange={(e) => setProfile({ ...profile, mission: e.target.value })}
              placeholder="Tuliskan misi sekolah di sini...&#10;&#10;Contoh:&#10;1. Menyelenggarakan pendidikan berkualitas&#10;2. Mengembangkan karakter siswa&#10;3. Membangun lingkungan belajar yang kondusif"
              required
              style={styles.textarea}
              rows="8"
            />
          </div>

          {/* Core Values Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={{...styles.sectionIconWrapper, background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
                <span style={styles.sectionIcon}>💎</span>
              </div>
              <div style={styles.sectionTitle}>
                <h2 style={styles.sectionHeading}>CORE VALUES</h2>
                <p style={styles.sectionSubheading}>Nilai-nilai inti yang dipegang teguh</p>
              </div>
            </div>
            <textarea
              value={profile.core_values}
              onChange={(e) => setProfile({ ...profile, core_values: e.target.value })}
              placeholder="Tuliskan nilai-nilai inti sekolah di sini...&#10;&#10;Contoh:&#10;• Integritas - Jujur dan bertanggung jawab&#10;• Inovasi - Kreatif dan adaptif&#10;• Kolaborasi - Bekerja sama dengan baik&#10;• Prestasi - Berorientasi pada hasil terbaik"
              required
              style={styles.textarea}
              rows="8"
            />
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                style={styles.btnDelete}
              >
                🗑️ Hapus Profile
              </button>
            )}
            <button
              type="submit"
              style={isEdit ? styles.btnUpdate : styles.btnCreate}
              disabled={loading}
            >
              {loading ? "⏳ Menyimpan..." : isEdit ? "💾 Update Profile" : "✓ Buat Profile"}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      {profile.vision && (
        <div style={styles.previewCard}>
          <div style={styles.previewHeader}>
            <h2 style={styles.previewTitle}>👁️ Preview</h2>
            <p style={styles.previewSubtitle}>Tampilan untuk user/pengunjung</p>
          </div>

          <div style={styles.previewGrid}>
            <div style={styles.previewItem}>
              <div style={styles.previewItemHeader}>
                <span style={styles.previewItemIcon}>🎯</span>
                <h3 style={styles.previewItemTitle}>VISI</h3>
              </div>
              <p style={styles.previewItemText}>{profile.vision}</p>
            </div>

            <div style={styles.previewItem}>
              <div style={{...styles.previewItemHeader, borderColor: '#22c55e'}}>
                <span style={styles.previewItemIcon}>🚀</span>
                <h3 style={styles.previewItemTitle}>MISI</h3>
              </div>
              <p style={styles.previewItemText}>{profile.mission}</p>
            </div>

            <div style={styles.previewItem}>
              <div style={{...styles.previewItemHeader, borderColor: '#f59e0b'}}>
                <span style={styles.previewItemIcon}>💎</span>
                <h3 style={styles.previewItemTitle}>CORE VALUES</h3>
              </div>
              <p style={styles.previewItemText}>{profile.core_values}</p>
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
  
  headerIconGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  
  headerIcon: {
    width: '70px',
    height: '70px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
  },
  
  headerDivider: {
    width: '30px',
    height: '3px',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    borderRadius: '2px',
  },
  
  headerText: {
    flex: 1,
  },
  
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
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
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    padding: '1.5rem 2rem',
    borderRadius: '16px',
    textAlign: 'center',
    minWidth: '160px',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
  },
  
  statusLabel: {
    display: 'block',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  
  statusValue: {
    display: 'block',
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: 900,
    lineHeight: 1,
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
  
  // Section
  section: {
    marginBottom: '3rem',
  },
  
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  
  sectionIconWrapper: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
    flexShrink: 0,
  },
  
  sectionIcon: {
    fontSize: '3rem',
  },
  
  sectionTitle: {
    flex: 1,
  },
  
  sectionHeading: {
    fontSize: '2rem',
    fontWeight: 900,
    color: '#2d3748',
    margin: '0 0 0.25rem 0',
    letterSpacing: '1px',
  },
  
  sectionSubheading: {
    fontSize: '1rem',
    color: '#718096',
    margin: 0,
    fontWeight: 500,
  },
  
  textarea: {
    width: '100%',
    padding: '1.5rem',
    border: '3px solid #e2e8f0',
    borderRadius: '16px',
    fontSize: '1.05rem',
    lineHeight: '1.8',
    background: '#f8fafc',
    color: '#2d3748',
    resize: 'vertical',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    transition: 'all 0.3s ease',
  },
  
  // Action Buttons
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
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
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: 'white',
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
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
    marginBottom: '2rem',
    textAlign: 'center',
  },
  
  previewTitle: {
    fontSize: '2rem',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 0.5rem 0',
  },
  
  previewSubtitle: {
    fontSize: '1rem',
    color: '#718096',
    margin: 0,
  },
  
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  
  previewItem: {
    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    borderRadius: '20px',
    padding: '2rem',
    border: '3px solid #e2e8f0',
  },
  
  previewItemHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '3px solid #667eea',
  },
  
  previewItemIcon: {
    fontSize: '2.5rem',
  },
  
  previewItemTitle: {
    fontSize: '1.5rem',
    fontWeight: 900,
    color: '#2d3748',
    margin: 0,
    letterSpacing: '1px',
  },
  
  previewItemText: {
    fontSize: '1rem',
    lineHeight: '1.8',
    color: '#4a5568',
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
};