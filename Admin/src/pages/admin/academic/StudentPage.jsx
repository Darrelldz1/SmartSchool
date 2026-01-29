import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    nama_lengkap: null,
    tempat_lahir: null,
    tanggal_lahir: null,
    jenis_kelamin: null,
    nik: null,
    tinggi_cm: null,
    berat_kg: null,
    nomor_hp: null,
    hobi: null,
    cita_cita: null,
    anak_ke: null,
    jumlah_saudara: null,
    jenis_sekolah_asal: null,
    npsn_asal: null,
    nama_sekolah_asal: null,
    kabupaten_asal: null,
    nisn: null,
    status_tempat_tinggal: null,
    alamat_jalan: null,
    desa: null,
    kecamatan: null,
    kab_kota: null,
    provinsi: null,
    kode_pos: null,
    nomor_kk: null,
    jarak_rumah_km: null,
    transportasi: null,
    penerima_bsm: null,
    alasan_bsm: null,
    nomor_kks: null,
    nomor_pkh: null,
    nomor_kip: null,
    periode_bsm: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pribadi");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/siswaRoutes");
      setStudents(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      showMessage("error", "Gagal memuat data siswa");
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      nama_lengkap: null,
      tempat_lahir: null,
      tanggal_lahir: null,
      jenis_kelamin: null,
      nik: null,
      tinggi_cm: null,
      berat_kg: null,
      nomor_hp: null,
      hobi: null,
      cita_cita: null,
      anak_ke: null,
      jumlah_saudara: null,
      jenis_sekolah_asal: null,
      npsn_asal: null,
      nama_sekolah_asal: null,
      kabupaten_asal: null,
      nisn: null,
      status_tempat_tinggal: null,
      alamat_jalan: null,
      desa: null,
      kecamatan: null,
      kab_kota: null,
      provinsi: null,
      kode_pos: null,
      nomor_kk: null,
      jarak_rumah_km: null,
      transportasi: null,
      penerima_bsm: null,
      alasan_bsm: null,
      nomor_kks: null,
      nomor_pkh: null,
      nomor_kip: null,
      periode_bsm: null,
    });
    setEditingId(null);
    setShowModal(false);
    setActiveTab("pribadi");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await api.put(`/siswaRoutes/${editingId}`, formData);
        showMessage("success", "Data siswa berhasil diperbarui!");
      } else {
        await api.post("/siswaRoutes", formData);
        showMessage("success", "Siswa berhasil ditambahkan!");
      }

      resetForm();
      fetchStudents();
    } catch (err) {
      console.error("Submit error:", err);
      showMessage("error", err?.response?.data?.error || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      nama_lengkap: student.nama_lengkap || null,
      tempat_lahir: student.tempat_lahir || null,
      tanggal_lahir: student.tanggal_lahir?.split("T")[0] || null,
      jenis_kelamin: student.jenis_kelamin || null,
      nik: student.nik || null,
      tinggi_cm: student.tinggi_cm || null,
      berat_kg: student.berat_kg || null,
      nomor_hp: student.nomor_hp || null,
      hobi: student.hobi || null,
      cita_cita: student.cita_cita || null,
      anak_ke: student.anak_ke || null,
      jumlah_saudara: student.jumlah_saudara || null,
      jenis_sekolah_asal: student.jenis_sekolah_asal || null,
      npsn_asal: student.npsn_asal || null,
      nama_sekolah_asal: student.nama_sekolah_asal || null,
      kabupaten_asal: student.kabupaten_asal || null,
      nisn: student.nisn || null,
      status_tempat_tinggal: student.status_tempat_tinggal || null,
      alamat_jalan: student.alamat_jalan || null,
      desa: student.desa || null,
      kecamatan: student.kecamatan || null,
      kab_kota: student.kab_kota || null,
      provinsi: student.provinsi || null,
      kode_pos: student.kode_pos || null,
      nomor_kk: student.nomor_kk || null,
      jarak_rumah_km: student.jarak_rumah_km || null,
      transportasi: student.transportasi || null,
      penerima_bsm: student.penerima_bsm || null,
      alasan_bsm: student.alasan_bsm || null,
      nomor_kks: student.nomor_kks || null,
      nomor_pkh: student.nomor_pkh || null,
      nomor_kip: student.nomor_kip || null,
      periode_bsm: student.periode_bsm || null,
    });
    setEditingId(student.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus data siswa ini?")) return;

    try {
      await api.delete(`/siswaRoutes/${id}`);
      showMessage("success", "Data siswa berhasil dihapus");
      fetchStudents();
    } catch (err) {
      console.error("Delete error:", err);
      showMessage("error", "Gagal menghapus data siswa");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn?.toLowerCase().includes(searchTerm.toLowerCase())
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
          
          .student-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .student-card:hover {
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

          .tab-btn {
            transition: all 0.3s ease;
          }

          .tab-btn:hover {
            background: rgba(59, 130, 246, 0.1);
          }
        `}
      </style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Manajemen Data Siswa</h1>
          <p style={styles.subtitle}>Kelola informasi siswa dengan lengkap dan terorganisir</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={styles.addButton}
          className="btn-hover"
        >
          + Tambah Siswa
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
          <div style={styles.statIcon}>👨‍🎓</div>
          <div>
            <div style={styles.statNumber}>{students.length}</div>
            <div style={styles.statLabel}>Total Siswa</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔍</div>
          <div>
            <div style={styles.statNumber}>{filteredStudents.length}</div>
            <div style={styles.statLabel}>Hasil Pencarian</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="🔍 Cari nama, NIK, atau NISN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
          className="input-focus"
        />
      </div>

      {/* Grid Cards */}
      <div style={styles.grid}>
        {filteredStudents.map((student) => (
          <div key={student.id} style={styles.card} className="student-card">
            <div style={styles.cardTop}>
              <div style={styles.avatarPlaceholder}>
                {student.nama_lengkap?.charAt(0)?.toUpperCase()}
              </div>
            </div>

            <div style={styles.cardBody}>
              <h3 style={styles.studentName}>{student.nama_lengkap}</h3>
              
              {student.nisn && (
                <div style={styles.badge}>NISN: {student.nisn}</div>
              )}

              <div style={styles.infoGrid}>
                {student.tempat_lahir && student.tanggal_lahir && (
                  <div style={styles.info}>
                    <span style={styles.infoLabel}>TTL:</span>
                    <span style={styles.infoValue}>
                      {student.tempat_lahir}, {new Date(student.tanggal_lahir).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                )}

                {student.jenis_kelamin && (
                  <div style={styles.info}>
                    <span style={styles.infoLabel}>Jenis Kelamin:</span>
                    <span style={styles.infoValue}>{student.jenis_kelamin}</span>
                  </div>
                )}

                {student.kab_kota && (
                  <div style={styles.info}>
                    <span style={styles.infoLabel}>Kota:</span>
                    <span style={styles.infoValue}>{student.kab_kota}</span>
                  </div>
                )}

                {student.nama_sekolah_asal && (
                  <div style={styles.info}>
                    <span style={styles.infoLabel}>Sekolah Asal:</span>
                    <span style={styles.infoValue}>{student.nama_sekolah_asal}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.cardActions}>
              <button
                onClick={() => handleEdit(student)}
                style={styles.editBtn}
                className="btn-hover"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(student.id)}
                style={styles.deleteBtn}
                className="btn-hover"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div style={styles.empty}>
          <p style={styles.emptyText}>
            {searchTerm ? "Tidak ada hasil pencarian" : "Belum ada data siswa"}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={resetForm}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingId ? "Edit Data Siswa" : "Tambah Siswa Baru"}
              </h2>
              <button onClick={resetForm} style={styles.closeBtn}>
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div style={styles.tabContainer}>
              <button
                onClick={() => setActiveTab("pribadi")}
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === "pribadi" ? styles.tabActive : {}),
                }}
                className="tab-btn"
              >
                Data Pribadi
              </button>
              <button
                onClick={() => setActiveTab("sekolah")}
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === "sekolah" ? styles.tabActive : {}),
                }}
                className="tab-btn"
              >
                Data Sekolah
              </button>
              <button
                onClick={() => setActiveTab("alamat")}
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === "alamat" ? styles.tabActive : {}),
                }}
                className="tab-btn"
              >
                Alamat
              </button>
              <button
                onClick={() => setActiveTab("bantuan")}
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === "bantuan" ? styles.tabActive : {}),
                }}
                className="tab-btn"
              >
                Bantuan
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Tab: Data Pribadi */}
              {activeTab === "pribadi" && (
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nama Lengkap *</label>
                    <input
                      type="text"
                      name="nama_lengkap"
                      value={formData.nama_lengkap}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>NIK</label>
                    <input
                      type="text"
                      name="nik"
                      value={formData.nik}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Tempat Lahir</label>
                    <input
                      type="text"
                      name="tempat_lahir"
                      value={formData.tempat_lahir}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Tanggal Lahir</label>
                    <input
                      type="date"
                      name="tanggal_lahir"
                      value={formData.tanggal_lahir}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Jenis Kelamin</label>
                    <select
                      name="jenis_kelamin"
                      value={formData.jenis_kelamin}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    >
                      <option value="">Pilih</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nomor HP</label>
                    <input
                      type="text"
                      name="nomor_hp"
                      value={formData.nomor_hp}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Tinggi (cm)</label>
                    <input
                      type="number"
                      name="tinggi_cm"
                      value={formData.tinggi_cm}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Berat (kg)</label>
                    <input
                      type="number"
                      name="berat_kg"
                      value={formData.berat_kg}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Hobi</label>
                    <input
                      type="text"
                      name="hobi"
                      value={formData.hobi}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Cita-cita</label>
                    <input
                      type="text"
                      name="cita_cita"
                      value={formData.cita_cita}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Anak Ke-</label>
                    <input
                      type="number"
                      name="anak_ke"
                      value={formData.anak_ke}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Jumlah Saudara</label>
                    <input
                      type="number"
                      name="jumlah_saudara"
                      value={formData.jumlah_saudara}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>
                </div>
              )}

              {/* Tab: Data Sekolah */}
              {activeTab === "sekolah" && (
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>NISN</label>
                    <input
                      type="text"
                      name="nisn"
                      value={formData.nisn}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Jenis Sekolah Asal</label>
                    <input
                      type="text"
                      name="jenis_sekolah_asal"
                      value={formData.jenis_sekolah_asal}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                      placeholder="SMP/MTs/Sederajat"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>NPSN Asal</label>
                    <input
                      type="text"
                      name="npsn_asal"
                      value={formData.npsn_asal}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nama Sekolah Asal</label>
                    <input
                      type="text"
                      name="nama_sekolah_asal"
                      value={formData.nama_sekolah_asal}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Kabupaten Asal</label>
                    <input
                      type="text"
                      name="kabupaten_asal"
                      value={formData.kabupaten_asal}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>
                </div>
              )}

              {/* Tab: Alamat */}
              {activeTab === "alamat" && (
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Status Tempat Tinggal</label>
                    <input
                      type="text"
                      name="status_tempat_tinggal"
                      value={formData.status_tempat_tinggal}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                      placeholder="Milik Sendiri/Kontrak/Kos"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Alamat Jalan</label>
                    <input
                      type="text"
                      name="alamat_jalan"
                      value={formData.alamat_jalan}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Desa</label>
                    <input
                      type="text"
                      name="desa"
                      value={formData.desa}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Kecamatan</label>
                    <input
                      type="text"
                      name="kecamatan"
                      value={formData.kecamatan}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Kabupaten/Kota</label>
                    <input
                      type="text"
                      name="kab_kota"
                      value={formData.kab_kota}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Provinsi</label>
                    <input
                      type="text"
                      name="provinsi"
                      value={formData.provinsi}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Kode Pos</label>
                    <input
                      type="text"
                      name="kode_pos"
                      value={formData.kode_pos}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nomor KK</label>
                    <input
                      type="text"
                      name="nomor_kk"
                      value={formData.nomor_kk}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Jarak Rumah (km)</label>
                    <input
                      type="number"
                      name="jarak_rumah_km"
                      value={formData.jarak_rumah_km}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Transportasi</label>
                    <input
                      type="text"
                      name="transportasi"
                      value={formData.transportasi}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                      placeholder="Jalan Kaki/Motor/Angkot"
                    />
                  </div>
                </div>
              )}

              {/* Tab: Bantuan */}
              {activeTab === "bantuan" && (
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Penerima BSM</label>
                    <select
                      name="penerima_bsm"
                      value={formData.penerima_bsm}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    >
                      <option value="">Pilih</option>
                      <option value="Ya">Ya</option>
                      <option value="Tidak">Tidak</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Alasan BSM</label>
                    <input
                      type="text"
                      name="alasan_bsm"
                      value={formData.alasan_bsm}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nomor KKS</label>
                    <input
                      type="text"
                      name="nomor_kks"
                      value={formData.nomor_kks}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nomor PKH</label>
                    <input
                      type="text"
                      name="nomor_pkh"
                      value={formData.nomor_pkh}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nomor KIP</label>
                    <input
                      type="text"
                      name="nomor_kip"
                      value={formData.nomor_kip}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Periode BSM</label>
                    <input
                      type="text"
                      name="periode_bsm"
                      value={formData.periode_bsm}
                      onChange={handleInputChange}
                      style={styles.input}
                      className="input-focus"
                      placeholder="2024/2025"
                    />
                  </div>
                </div>
              )}

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
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 24,
    marginBottom: 40,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 40,
    fontWeight: 700,
  },
  cardBody: {
    textAlign: "center",
    marginBottom: 20,
  },
  studentName: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1f2937",
    margin: "0 0 12px 0",
  },
  badge: {
    display: "inline-block",
    background: "#3b82f6",
    color: "#fff",
    padding: "6px 16px",
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 16,
  },
  infoGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  info: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
    fontSize: 13,
  },
  infoLabel: {
    color: "#6b7280",
    fontWeight: 500,
  },
  infoValue: {
    color: "#1f2937",
    fontWeight: 600,
    textAlign: "right",
  },
  cardActions: {
    display: "flex",
    gap: 12,
    marginTop: 16,
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
    maxWidth: 900,
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
  tabContainer: {
    display: "flex",
    padding: "0 32px",
    gap: 8,
    borderBottom: "2px solid #e5e7eb",
    position: "sticky",
    top: 73,
    background: "#fff",
    zIndex: 9,
  },
  tabBtn: {
    padding: "12px 20px",
    background: "transparent",
    border: "none",
    fontSize: 15,
    fontWeight: 600,
    color: "#6b7280",
    cursor: "pointer",
    borderBottom: "3px solid transparent",
    marginBottom: -2,
  },
  tabActive: {
    color: "#3b82f6",
    borderBottomColor: "#3b82f6",
  },
  form: {
    padding: 32,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
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