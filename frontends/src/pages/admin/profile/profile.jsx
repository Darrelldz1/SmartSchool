// src/pages/admin/profile/ProfilePage.jsx
import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [coreValues, setCoreValues] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= GET PROFILE ================= */
  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setProfile(res.data);
      setVision(res.data.vision || "");
      setMission(res.data.mission || "");
      setCoreValues(res.data.core_values || "");
    } catch (err) {
      // jika belum ada profile → normal
      console.log("Profile belum ada");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (profile?.id) {
        // UPDATE
        await api.put(`/profile/${profile.id}`, {
          vision,
          mission,
          core_values: coreValues,
        });
        setMessage("Profile berhasil diperbarui");
      } else {
        // CREATE
        const res = await api.post("/profile", {
          vision,
          mission,
          core_values: coreValues,
        });
        setProfile(res.data.profile);
        setMessage("Profile berhasil dibuat");
      }

      fetchProfile();
    } catch (err) {
      setMessage(
        err?.response?.data?.error || "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Profil Sekolah</h1>

      {message && <p style={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Visi</label>
        <textarea
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          rows={3}
          required
          style={styles.textarea}
        />

        <label style={styles.label}>Misi</label>
        <textarea
          value={mission}
          onChange={(e) => setMission(e.target.value)}
          rows={5}
          required
          style={styles.textarea}
        />

        <label style={styles.label}>Core Values</label>
        <textarea
          value={coreValues}
          onChange={(e) => setCoreValues(e.target.value)}
          rows={4}
          style={styles.textarea}
        />

        <button disabled={loading} style={styles.button}>
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    maxWidth: 800,
    background: "#fff",
    padding: 30,
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,.08)",
  },
  title: {
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  label: {
    fontWeight: "600",
  },
  textarea: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
    resize: "vertical",
  },
  button: {
    marginTop: 10,
    padding: "10px 14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  message: {
    marginBottom: 10,
    color: "green",
  },
};
