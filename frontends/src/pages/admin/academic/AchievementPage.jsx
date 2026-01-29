import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function AchievementPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    bidang: "",
    tingkat: "",
    peringkat: "",
    tahun: "",
  });

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      const res = await api.get("/prestasi");
      setList(res.data || []);
    } catch (err) {
      console.error(err);
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
      if (editId) {
        await api.put(`/prestasi/${editId}`, form);
      } else {
        await api.post("/prestasi", form);
      }

      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan prestasi");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const edit = (data) => {
    setEditId(data.id);
    setForm({
      bidang: data.bidang,
      tingkat: data.tingkat,
      peringkat: data.peringkat,
      tahun: data.tahun,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (!window.confirm("Hapus prestasi ini?")) return;
    await api.delete(`/prestasi/${id}`);
    fetchData();
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      bidang: "",
      tingkat: "",
      peringkat: "",
      tahun: "",
    });
  };

  // Filter berdasarkan search
  const filteredList = list.filter(item => 
    item.bidang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tingkat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.peringkat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tahun?.toString().includes(searchTerm)
  );

  // Helper functions untuk badge colors
  const getTingkatClass = (tingkat) => {
    const map = {
      'Internasional': 'badge-purple',
      'Nasional': 'badge-red',
      'Provinsi': 'badge-orange',
      'Kota/Kabupaten': 'badge-blue',
      'Kecamatan': 'badge-green',
      'Sekolah': 'badge-gray'
    };
    return map[tingkat] || 'badge-gray';
  };

  const getPeringkatClass = (peringkat) => {
    if (peringkat.includes('1')) return 'badge-gold';
    if (peringkat.includes('2')) return 'badge-silver';
    if (peringkat.includes('3')) return 'badge-bronze';
    return 'badge-gray';
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerIcon}>🏆</div>
          <div style={styles.headerText}>
            <h1 style={styles.pageTitle}>Prestasi Sekolah</h1>
            <p style={styles.pageSubtitle}>Kelola data prestasi dan pencapaian</p>
          </div>
        </div>
        <div style={styles.statsBadge}>
          <span style={styles.badgeLabel}>Total Prestasi</span>
          <span style={styles.badgeValue}>{list.length}</span>
        </div>
      </div>

      {/* Form Card */}
      <div style={styles.formCard}>
        <div style={styles.formCardHeader}>
          <h2 style={styles.formTitle}>
            {editId ? "✏️ Edit Prestasi" : "➕ Tambah Prestasi Baru"}
          </h2>
        </div>

        <form onSubmit={submit} style={styles.achievementForm}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>
              <span style={styles.labelIcon}>📚</span>
              Bidang Prestasi
            </label>
            <input
              type="text"
              placeholder="Contoh: Matematika, Olahraga, Seni"
              value={form.bidang}
              onChange={(e) => setForm({ ...form, bidang: e.target.value })}
              required
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>
              <span style={styles.labelIcon}>🎯</span>
              Tingkat
            </label>
            <select
              value={form.tingkat}
              onChange={(e) => setForm({ ...form, tingkat: e.target.value })}
              required
              style={styles.formInput}
            >
              <option value="">Pilih Tingkat</option>
              <option value="Sekolah">Sekolah</option>
              <option value="Kecamatan">Kecamatan</option>
              <option value="Kota/Kabupaten">Kota/Kabupaten</option>
              <option value="Provinsi">Provinsi</option>
              <option value="Nasional">Nasional</option>
              <option value="Internasional">Internasional</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>
              <span style={styles.labelIcon}>🥇</span>
              Peringkat
            </label>
            <select
              value={form.peringkat}
              onChange={(e) => setForm({ ...form, peringkat: e.target.value })}
              required
              style={styles.formInput}
            >
              <option value="">Pilih Peringkat</option>
              <option value="Juara 1">Juara 1</option>
              <option value="Juara 2">Juara 2</option>
              <option value="Juara 3">Juara 3</option>
              <option value="Juara Harapan">Juara Harapan</option>
              <option value="Finalis">Finalis</option>
              <option value="Peserta">Peserta</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>
              <span style={styles.labelIcon}>📅</span>
              Tahun
            </label>
            <input
              type="number"
              placeholder="2024"
              value={form.tahun}
              onChange={(e) => setForm({ ...form, tahun: e.target.value })}
              required
              style={styles.formInput}
              min="2000"
              max="2100"
            />
          </div>

          <div style={styles.formActions}>
            {editId && (
              <button type="button" onClick={resetForm} style={styles.btnCancel}>
                ✕ Batal
              </button>
            )}
            <button type="submit" style={editId ? styles.btnUpdate : styles.btnSubmit} disabled={loading}>
              {loading ? "⏳ Menyimpan..." : editId ? "💾 Update Prestasi" : "✓ Tambah Prestasi"}
            </button>
          </div>
        </form>
      </div>

      {/* Search Bar */}
      <div style={styles.searchCard}>
        <div style={styles.searchIcon}>🔍</div>
        <input
          type="text"
          placeholder="Cari prestasi berdasarkan bidang, tingkat, peringkat, atau tahun..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} style={styles.clearSearch}>
            ✕
          </button>
        )}
      </div>

      {/* Table Card */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h2 style={styles.tableTitle}>📋 Daftar Prestasi</h2>
          <span style={styles.resultCount}>
            {filteredList.length} dari {list.length} prestasi
          </span>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.achievementTable}>
            <thead>
              <tr>
                <th style={styles.th}>No</th>
                <th style={styles.th}>Bidang Prestasi</th>
                <th style={styles.th}>Tingkat</th>
                <th style={styles.th}>Peringkat</th>
                <th style={styles.th}>Tahun</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.emptyState}>
                    <div style={styles.emptyIcon}>🏆</div>
                    <p style={styles.emptyText}>
                      {searchTerm ? "Tidak ada prestasi yang cocok dengan pencarian" : "Belum ada data prestasi"}
                    </p>
                    {!searchTerm && (
                      <p style={styles.emptySubtext}>Mulai tambahkan prestasi menggunakan form di atas</p>
                    )}
                  </td>
                </tr>
              ) : (
                filteredList.map((p, i) => (
                  <tr key={p.id} style={styles.tableRow}>
                    <td style={styles.cellNumber}>{i + 1}</td>
                    <td style={styles.cellBidang}>{p.bidang}</td>
                    <td style={styles.td}>
                      <span style={{...styles.badge, ...styles[getTingkatClass(p.tingkat)]}}>
                        {p.tingkat}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{...styles.badge, ...styles[getPeringkatClass(p.peringkat)]}}>
                        {p.peringkat}
                      </span>
                    </td>
                    <td style={styles.cellYear}>{p.tahun}</td>
                    <td style={styles.cellActions}>
                      <button style={styles.btnEdit} onClick={() => edit(p)}>
                        ✏️ Edit
                      </button>
                      <button style={styles.btnDelete} onClick={() => remove(p.id)}>
                        🗑️ Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
    background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    boxShadow: '0 8px 20px rgba(255, 215, 0, 0.3)',
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
  statsBadge: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    padding: '1.5rem 2rem',
    borderRadius: '16px',
    textAlign: 'center',
    minWidth: '160px',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
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
  
  // Form Card
  formCard: {
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    background: 'white',
    borderRadius: '24px',
    padding: '2.5rem',
    boxShadow: '0 10px 40px rgba(33, 150, 243, 0.15)',
  },
  formCardHeader: {
    marginBottom: '2rem',
  },
  formTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#2d3748',
    margin: 0,
  },
  achievementForm: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
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
  formActions: {
    gridColumn: '1 / -1',
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  btnSubmit: {
    flex: 1,
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: 700,
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
  },
  btnUpdate: {
    flex: 1,
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: 700,
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: 'white',
    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
  },
  btnCancel: {
    flex: '0 0 auto',
    minWidth: '150px',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: 700,
    cursor: 'pointer',
    background: '#e5e7eb',
    color: '#4b5563',
  },
  
  // Search Card
  searchCard: {
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    background: 'white',
    borderRadius: '20px',
    padding: '1.5rem 2rem',
    boxShadow: '0 8px 30px rgba(33, 150, 243, 0.12)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  searchIcon: {
    fontSize: '1.5rem',
    color: '#667eea',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    fontSize: '1rem',
    color: '#2d3748',
    outline: 'none',
  },
  clearSearch: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: '#f3f4f6',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  
  // Table Card
  tableCard: {
    maxWidth: '1200px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '24px',
    padding: '2.5rem',
    boxShadow: '0 10px 40px rgba(33, 150, 243, 0.15)',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  tableTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#2d3748',
    margin: 0,
  },
  resultCount: {
    background: '#f3f4f6',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#4b5563',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  achievementTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    padding: '1.25rem 1rem',
    textAlign: 'left',
    fontWeight: 700,
    fontSize: '0.95rem',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  td: {
    padding: '1.25rem 1rem',
    color: '#4a5568',
    borderBottom: '1px solid #e5e7eb',
  },
  tableRow: {
    transition: 'all 0.3s ease',
  },
  cellNumber: {
    padding: '1.25rem 1rem',
    fontWeight: 700,
    color: '#667eea',
    fontSize: '1rem',
    borderBottom: '1px solid #e5e7eb',
  },
  cellBidang: {
    padding: '1.25rem 1rem',
    fontWeight: 600,
    color: '#2d3748',
    fontSize: '1rem',
    borderBottom: '1px solid #e5e7eb',
  },
  cellYear: {
    padding: '1.25rem 1rem',
    fontWeight: 600,
    color: '#6b7280',
    borderBottom: '1px solid #e5e7eb',
  },
  cellActions: {
    padding: '1.25rem 1rem',
    display: 'flex',
    gap: '0.5rem',
    borderBottom: '1px solid #e5e7eb',
  },
  
  // Badges
  badge: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: 700,
    textAlign: 'center',
  },
  'badge-purple': { background: 'linear-gradient(135deg, #a855f7, #9333ea)', color: 'white' },
  'badge-red': { background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white' },
  'badge-orange': { background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white' },
  'badge-blue': { background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white' },
  'badge-green': { background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white' },
  'badge-gray': { background: '#e5e7eb', color: '#4b5563' },
  'badge-gold': { background: 'linear-gradient(135deg, #ffd700, #ffa500)', color: 'white' },
  'badge-silver': { background: 'linear-gradient(135deg, #c0c0c0, #a8a8a8)', color: 'white' },
  'badge-bronze': { background: 'linear-gradient(135deg, #cd7f32, #b87333)', color: 'white' },
  
  // Action Buttons
  btnEdit: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 700,
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: 'white',
  },
  btnDelete: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 700,
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
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