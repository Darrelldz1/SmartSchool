// src/admin/ProfileAdmin.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import './editvisimisivalue.css';

const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:5000";

export default function ProfileAdmin() {
  const { user } = useAuth() || {};
  const token = (user && (user.token || user.accessToken || user.authToken)) || localStorage.getItem("token") || null;
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState({ vision: "", mission: "", core_values: "" });

  // files + preview urls per field
  const [visionFile, setVisionFile] = useState(null);
  const [missionFile, setMissionFile] = useState(null);
  const [coreFile, setCoreFile] = useState(null);

  const [visionPreview, setVisionPreview] = useState(null);
  const [missionPreview, setMissionPreview] = useState(null);
  const [corePreview, setCorePreview] = useState(null);

  // refs to revoke object URLs
  const visionRef = useRef(null);
  const missionRef = useRef(null);
  const coreRef = useRef(null);

  const request = useCallback(
    (opts) => {
      const headers = opts.headers ? { ...opts.headers } : {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      // don't set Content-Type for FormData (axios will auto set boundary)
      if (!(opts.data instanceof FormData) && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
      return axios({ baseURL: API_BASE, ...opts, headers });
    },
    [token]
  );

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await request({ url: "/api/profile", method: "get" });
      const p = res.data;
      setProfile(p);
      setForm({
        vision: p.vision || "",
        mission: p.mission || "",
        core_values: p.core_values || ""
      });

      // set previews to server URLs (if present)
      setVisionPreview(p.vision_image_url || null);
      setMissionPreview(p.mission_image_url || null);
      setCorePreview(p.core_values_image_url || null);

      // clear local file selections
      setVisionFile(null);
      setMissionFile(null);
      setCoreFile(null);
      setEditing(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setProfile(null);
        setForm({ vision: "", mission: "", core_values: "" });
        setVisionPreview(null);
        setMissionPreview(null);
        setCorePreview(null);
      } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate("/login");
      } else {
        console.error(err);
        setError(err.response?.data?.error || "Gagal memuat profile");
      }
    } finally {
      setLoading(false);
    }
  }, [request, navigate]);

  useEffect(() => {
    loadProfile();
    return () => {
      // revoke any created object URLs
      [visionRef.current, missionRef.current, coreRef.current].forEach(u => {
        if (u) URL.revokeObjectURL(u);
      });
    };
  }, [loadProfile]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  }

  function handleFileChange(e, which) {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      // clear selection
      if (which === "vision") {
        if (visionRef.current) { URL.revokeObjectURL(visionRef.current); visionRef.current = null; }
        setVisionFile(null);
        setVisionPreview(profile?.vision_image_url || null);
      } else if (which === "mission") {
        if (missionRef.current) { URL.revokeObjectURL(missionRef.current); missionRef.current = null; }
        setMissionFile(null);
        setMissionPreview(profile?.mission_image_url || null);
      } else {
        if (coreRef.current) { URL.revokeObjectURL(coreRef.current); coreRef.current = null; }
        setCoreFile(null);
        setCorePreview(profile?.core_values_image_url || null);
      }
      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB");
      e.target.value = "";
      return;
    }

    const objUrl = URL.createObjectURL(f);

    if (which === "vision") {
      if (visionRef.current) URL.revokeObjectURL(visionRef.current);
      visionRef.current = objUrl;
      setVisionFile(f);
      setVisionPreview(objUrl);
    } else if (which === "mission") {
      if (missionRef.current) URL.revokeObjectURL(missionRef.current);
      missionRef.current = objUrl;
      setMissionFile(f);
      setMissionPreview(objUrl);
    } else {
      if (coreRef.current) URL.revokeObjectURL(coreRef.current);
      coreRef.current = objUrl;
      setCoreFile(f);
      setCorePreview(objUrl);
    }
  }

  function buildFormData(formObj, files = {}) {
    const fd = new FormData();
    fd.append("vision", formObj.vision || "");
    fd.append("mission", formObj.mission || "");
    fd.append("core_values", formObj.core_values || "");
    if (files.vision) fd.append("vision_image", files.vision);
    if (files.mission) fd.append("mission_image", files.mission);
    if (files.core) fd.append("core_values_image", files.core);
    return fd;
  }

  async function doSubmit(isCreate = false) {
    setSaving(true);
    setError(null);
    setUploadProgress(0);
    try {
      let res;
      const fd = buildFormData(form, { vision: visionFile, mission: missionFile, core: coreFile });
      if (isCreate) {
        res = await request({
          url: "/api/profile",
          method: "post",
          data: fd,
          onUploadProgress: (evt) => { if (evt.total) setUploadProgress(Math.round((evt.loaded * 100) / evt.total)); }
        });
      } else {
        if (!profile?.id) throw new Error("Tidak ada profile untuk diupdate");
        res = await request({
          url: `/api/profile/${profile.id}`,
          method: "put",
          data: fd,
          onUploadProgress: (evt) => { if (evt.total) setUploadProgress(Math.round((evt.loaded * 100) / evt.total)); }
        });
      }

      setProfile(res.data.profile);
      // update preview urls from response if server returned image_url
      setVisionPreview(res.data.profile.vision_image_url || null);
      setMissionPreview(res.data.profile.mission_image_url || null);
      setCorePreview(res.data.profile.core_values_image_url || null);

      setVisionFile(null);
      setMissionFile(null);
      setCoreFile(null);
      setEditing(false);
      alert(isCreate ? "Profile berhasil dibuat" : "Profile berhasil diupdate");
      await loadProfile();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Gagal menyimpan profile");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    await doSubmit(true);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    await doSubmit(false);
  }

  async function handleDelete() {
    if (!profile?.id) return;
    if (!window.confirm("Hapus profile ini?")) return;
    try {
      await request({ url: `/api/profile/${profile.id}`, method: "delete" });
      setProfile(null);
      setForm({ vision: "", mission: "", core_values: "" });
      setVisionPreview(null);
      setMissionPreview(null);
      setCorePreview(null);
      alert("Profile dihapus");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Gagal menghapus profile");
    } finally {
      await loadProfile();
    }
  }

  if (loading) return <div className="loading-container">Memuat...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="profile-admin-container">
      <div className="profile-admin-wrapper">
        {/* Header */}
        <div className="profile-admin-header">
          <h1>Admin - Profile (Visi / Misi / Core Values)</h1>
          <div className="header-buttons">
            <button onClick={() => navigate("/admin")} className="btn-back">
              Kembali
            </button>
            <button 
              onClick={() => { if (!profile) setEditing(true); else setEditing(s => !s); }} 
              className="btn-edit"
            >
              {editing ? "Batal" : profile ? "Edit" : "Buat"}
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="profile-content-container">
          {/* View Mode */}
          {profile && !editing && (
            <div className="profile-view-container">
              {/* Images Grid */}
              <div className="profile-images-grid">
                {profile.vision_image_url && (
                  <div className="profile-image-item">
                    <div className="image-title">Gambar Visi</div>
                    <img src={profile.vision_image_url} alt="vision" />
                  </div>
                )}
                {profile.mission_image_url && (
                  <div className="profile-image-item">
                    <div className="image-title">Gambar Misi</div>
                    <img src={profile.mission_image_url} alt="mission" />
                  </div>
                )}
                {profile.core_values_image_url && (
                  <div className="profile-image-item">
                    <div className="image-title">Gambar Core Values</div>
                    <img src={profile.core_values_image_url} alt="core" />
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="profile-text-content">
                <h3>Visi</h3>
                <p>{profile.vision || "-"}</p>

                <h3>Misi</h3>
                <p>{profile.mission || "-"}</p>

                <h3>Core Values</h3>
                <p>{profile.core_values || "-"}</p>
              </div>

              {/* Action Buttons */}
              <div className="view-actions">
                <button onClick={() => setEditing(true)} className="btn-edit">
                  Edit
                </button>
                <button onClick={handleDelete} className="btn-delete">
                  Hapus
                </button>
              </div>
            </div>
          )}

          {/* Edit/Create Mode */}
          {editing && (
            <form onSubmit={profile ? handleUpdate : handleCreate} className="profile-form-section">
              {/* Visi Section */}
              <div className="profile-item">
                <div className="image-upload-section">
                  <div className="image-upload-wrapper">
                    <label className="image-label">Gambar Visi</label>
                    <div className="image-preview-container">
                      {visionPreview ? (
                        <img src={visionPreview} alt="vision preview" />
                      ) : (
                        <div className="image-placeholder vision-badge">V</div>
                      )}
                    </div>
                    <div className="file-input-wrapper">
                      <label htmlFor="vision-upload" className="file-input-label">
                        Choose file
                      </label>
                      <input 
                        id="vision-upload"
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, "vision")} 
                      />
                    </div>
                  </div>
                  
                  <div className="text-input-section">
                    <label className="input-label">Inputan Visi</label>
                    <textarea 
                      name="vision" 
                      value={form.vision} 
                      onChange={onChange} 
                      className="text-input"
                      placeholder="Masukkan visi..."
                      rows={4}
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Misi Section */}
              <div className="profile-item">
                <div className="image-upload-section">
                  <div className="image-upload-wrapper">
                    <label className="image-label">Gambar Misi</label>
                    <div className="image-preview-container">
                      {missionPreview ? (
                        <img src={missionPreview} alt="mission preview" />
                      ) : (
                        <div className="image-placeholder mission-badge">M</div>
                      )}
                    </div>
                    <div className="file-input-wrapper">
                      <label htmlFor="mission-upload" className="file-input-label">
                        Choose file
                      </label>
                      <input 
                        id="mission-upload"
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, "mission")} 
                      />
                    </div>
                  </div>
                  
                  <div className="text-input-section">
                    <label className="input-label">Inputan Misi</label>
                    <textarea 
                      name="mission" 
                      value={form.mission} 
                      onChange={onChange} 
                      className="text-input"
                      placeholder="Masukkan misi..."
                      rows={5}
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Core Values Section */}
              <div className="profile-item">
                <div className="image-upload-section">
                  <div className="image-upload-wrapper">
                    <label className="image-label">Gambar Core Values</label>
                    <div className="image-preview-container">
                      {corePreview ? (
                        <img src={corePreview} alt="core values preview" />
                      ) : (
                        <div className="image-placeholder core-values-badge">CV</div>
                      )}
                    </div>
                    <div className="file-input-wrapper">
                      <label htmlFor="core-upload" className="file-input-label">
                        Choose file
                      </label>
                      <input 
                        id="core-upload"
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, "core")} 
                      />
                    </div>
                  </div>
                  
                  <div className="text-input-section">
                    <label className="input-label">Inputan Core Values</label>
                    <textarea 
                      name="core_values" 
                      value={form.core_values} 
                      onChange={onChange} 
                      className="text-input"
                      placeholder="Masukkan core values (pisahkan baris dengan newline)..."
                      rows={5}
                    />
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <div className="progress-text">{uploadProgress}%</div>
                </div>
              )}

              {/* Save Buttons */}
              <div className="save-button-section">
                <button type="submit" disabled={saving} className="btn-save">
                  {saving ? "Menyimpan..." : profile ? "Simpan Perubahan" : "Simpan"}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="btn-cancel">
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}