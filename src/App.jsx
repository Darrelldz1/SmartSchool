// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Auth
import ProtectedRoute from "./admin/ProtectedRoute";

// Halaman publik
import LandingPage from "./components/LandingPage"; // pastikan file: src/components/LandingPage.jsx
import Login from "./components/login";
import ResetPassword from "./components/ResetPassword";
import Visi from "./components/visi";
import Sekolah from "./components/sekolah";
import CreateVisi from "./components/createvasu";
import CreateSekolah from "./components/createsekoluh";
import NewsListPublic from "./components/newsListPublic";
import NewsDetail from "./components/NewsDetail";
import GalleryListPublic from "./components/GalleryListPublic";

// Halaman admin (children)
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import HistoryAdmin from "./admin/HistoryAdmin";
import VisiList from "./admin/ProfileAdmin";
import EditVisiMisiValue from "./admin/editvisimisivalue";
import SekolahList from "./admin/SekolahList";
import EditSejarahForm from "./admin/EditSejarahForm";
import NewsList from "./admin/NewsList";
import CreateNews from "./admin/CreateNews";
import EditNews from "./admin/Editnews";
import GalleryList from "./admin/GalleryList";
import PengumumanForm from "./admin/PengumumanForm";

import "./index.css";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/visi" element={<Visi />} />
      <Route path="/news" element={<NewsListPublic />} />
      <Route path="/news/:id" element={<NewsDetail />} />
      <Route path="/sekolah" element={<Sekolah />} />
      <Route path="/gallery" element={<GalleryListPublic />} />
      <Route path="/create-visi" element={<CreateVisi />} />
      <Route path="/create-sekolah" element={<CreateSekolah />} />

      {/* ADMIN (PROTECTED) */}
      <Route
        path="/admin/*"
        element={
    <ProtectedRoute allowedRoles={['admin','guru']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="visi" element={<VisiList />} />
        <Route path="sejarah" element={<HistoryAdmin />} />
        <Route path="edit-sejarah" element={<EditSejarahForm />} />
        <Route path="newslist" element={<NewsList />} />
        <Route path="createnews" element={<CreateNews />} />
        <Route path="editnews/:id" element={<EditNews />} />
        <Route path="gallery" element={<GalleryList />} />
        <Route path="edit-visi" element={<EditVisiMisiValue />} />
        <Route path="PengumumanForm" element={<PengumumanForm />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
