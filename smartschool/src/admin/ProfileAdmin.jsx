// src/admin/ProfileAdmin.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

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

  if (loading) return <div className="p-6">Memuat...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin - Profile (Visi / Misi / Core Values)</h1>
        <div>
          <button onClick={() => navigate("/admin")} className="mr-2 px-3 py-2 rounded bg-gray-200">Kembali</button>
          <button onClick={() => { if (!profile) setEditing(true); else setEditing(s => !s); }} className="px-3 py-2 rounded bg-blue-600 text-white">
            {editing ? "Batal" : profile ? "Edit" : "Buat"}
          </button>
        </div>
      </div>

      {profile && !editing && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {profile.vision_image_url && (
              <div style={{ width: 220 }}>
                <div style={{ fontWeight: 700, fontSize: 12 }}>Gambar Visi</div>
                <img src={profile.vision_image_url} alt="vision" style={{ width: "100%", borderRadius: 8, marginTop: 6 }} />
              </div>
            )}
            {profile.mission_image_url && (
              <div style={{ width: 220 }}>
                <div style={{ fontWeight: 700, fontSize: 12 }}>Gambar Misi</div>
                <img src={profile.mission_image_url} alt="mission" style={{ width: "100%", borderRadius: 8, marginTop: 6 }} />
              </div>
            )}
            {profile.core_values_image_url && (
              <div style={{ width: 220 }}>
                <div style={{ fontWeight: 700, fontSize: 12 }}>Gambar Core Values</div>
                <img src={profile.core_values_image_url} alt="core" style={{ width: "100%", borderRadius: 8, marginTop: 6 }} />
              </div>
            )}
          </div>

          <h3 className="font-bold mt-4">Visi</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{profile.vision || "-"}</p>

          <h3 className="font-bold mt-3">Misi</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{profile.mission || "-"}</p>

          <h3 className="font-bold mt-3">Core Values</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{profile.core_values || "-"}</p>

          <div className="mt-4 space-x-2">
            <button onClick={() => setEditing(true)} className="px-3 py-1 rounded bg-yellow-500 text-white">Edit</button>
            <button onClick={handleDelete} className="px-3 py-1 rounded bg-red-600 text-white">Hapus</button>
          </div>
        </div>
      )}

      {editing && (
        <form onSubmit={profile ? handleUpdate : handleCreate} className="bg-white p-4 rounded shadow">
          <div className="mb-3">
            <label className="block font-semibold mb-1">Visi</label>
            <textarea name="vision" value={form.vision} onChange={onChange} rows={3} className="w-full border p-2 rounded" required />
          </div>

          <div className="mb-3">
            <label className="block font-semibold mb-1">Misi</label>
            <textarea name="mission" value={form.mission} onChange={onChange} rows={4} className="w-full border p-2 rounded" required />
          </div>

          <div className="mb-3">
            <label className="block font-semibold mb-1">Core Values (pisahkan baris dengan newline)</label>
            <textarea name="core_values" value={form.core_values} onChange={onChange} rows={4} className="w-full border p-2 rounded" />
          </div>

          <div className="mb-3 grid" style={{ gap: 10 }}>
            <div>
              <label className="block font-semibold mb-1">Gambar Visi</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "vision")} />
              {visionPreview && <img src={visionPreview} alt="preview" style={{ maxWidth: 280, display: "block", marginTop: 8, borderRadius: 8 }} />}
            </div>

            <div>
              <label className="block font-semibold mb-1">Gambar Misi</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "mission")} />
              {missionPreview && <img src={missionPreview} alt="preview" style={{ maxWidth: 280, display: "block", marginTop: 8, borderRadius: 8 }} />}
            </div>

            <div>
              <label className="block font-semibold mb-1">Gambar Core Values</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "core")} />
              {corePreview && <img src={corePreview} alt="preview" style={{ maxWidth: 280, display: "block", marginTop: 8, borderRadius: 8 }} />}
            </div>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ height: 8, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${uploadProgress}%`, height: "100%", background: "#3b82f6" }} />
              </div>
              <div style={{ fontSize: 12, marginTop: 6 }}>{uploadProgress}%</div>
            </div>
          )}

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded">
              {saving ? "Menyimpan..." : profile ? "Simpan Perubahan" : "Buat Profile"}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
          </div>
        </form>
      )}
    </div>
  );
}
