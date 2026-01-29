// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./admin/ProtectedRoute";

// Public pages...
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import Visi from "./components/Visi";
import Sekolah from "./components/Sekolah";
import NewsListPublic from "./components/NewsListPublic";
import NewsDetail from "./components/NewsDetail";
import GalleryListPublic from "./components/GalleryListPublic";
import PengumumanDetail from "./components/PengumumanDetail";
import Listpengumuman from "./components/ListPengumuman";
import Headmaster from "./components/Headmaster";
import Teacher from "./components/Teacher";
import Programs from "./components/Programs";
import ProgramDetail from "./components/ProgramDetail";

// Admin pages
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import HistoryAdmin from "./admin/HistoryAdmin";
import ProfileAdmin from "./admin/ProfileAdmin";
import EditVisiMisiValue from "./admin/EditVisiMisiValue";
import EditSejarahForm from "./admin/EditSejarahForm";
import NewsList from "./admin/NewsList";
import CreateNews from "./admin/CreateNews";
import EditNews from "./admin/EditNews";
import GalleryList from "./admin/GalleryList";
import GalleryForm from "./admin/GalleryForm";
import PengumumanAdmin from "./admin/PengumumanAdmin";
import PengumumanForm from "./admin/PengumumanForm";
import SiswaAdmin from "./admin/SiswaAdmin";
import PrestasiAdmin from "./admin/PrestasiAdmin";
import TeacherAdmin from "./admin/TeacherAdmin";
import ProgramAdmin from "./admin/ProgramAdmin";
import ProgramForm from "./admin/ProgramForm";
import OrangTuaAdmin from "./admin/OrangTuaAdmin";
import AdminHeadmaster from "./admin/AdminHeadmaster";
import SliderAdmin from './admin/SliderAdmin';

import "./index.css";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/visi" element={<Visi />} />
      <Route path="/news" element={<NewsListPublic />} />
      <Route path="/news/:id" element={<NewsDetail />} />
      <Route path="/sekolah" element={<Sekolah />} />
      <Route path="/gallery" element={<GalleryListPublic />} />
      <Route path="/pengumuman" element={<Listpengumuman />} />
      <Route path="/pengumuman/:id" element={<PengumumanDetail />} />
      <Route path="/headmaster" element={<Headmaster />} />
      <Route path="/teacher" element={<Teacher />} />
      <Route path="/programs" element={<Programs />} />

      {/* Program detail (keduanya: singular & plural) */}
      <Route path="/program/:id" element={<ProgramDetail />} />
      <Route path="/programs/:id" element={<ProgramDetail />} />

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
        <Route path="visi" element={<ProfileAdmin />} />
        <Route path="sejarah" element={<HistoryAdmin />} />
        <Route path="edit-sejarah" element={<EditSejarahForm />} />
        <Route path="newslist" element={<NewsList />} />
        <Route path="createnews" element={<CreateNews />} />
        <Route path="editnews/:id" element={<EditNews />} />
        <Route path="slider" element={<SliderAdmin />} />

        {/* Gallery */}
        <Route path="gallery/create" element={<GalleryForm />} />
        <Route path="gallery" element={<GalleryList />} />

        {/* Pengumuman (admin) - normal paths */}
        <Route path="pengumuman" element={<PengumumanAdmin />} />
        <Route path="pengumuman/create" element={<PengumumanForm />} />
        <Route path="pengumuman/new" element={<PengumumanForm />} />

        {/* Pengumuman aliases untuk toleransi casing/url lama */}
        <Route path="Pengumuman/new" element={<PengumumanForm />} />
        <Route path="Pengumuman/create" element={<PengumumanForm />} />
        <Route path="pengumuman/:id/edit" element={<PengumumanForm />} />
        <Route path="Pengumuman/:id/edit" element={<PengumumanForm />} />

        <Route path="edit-visi" element={<EditVisiMisiValue />} />
        <Route path="siswa" element={<SiswaAdmin />} />
        <Route path="orangtua" element={<OrangTuaAdmin />} />
        <Route path="prestasi" element={<PrestasiAdmin />} />
        <Route path="teacher" element={<TeacherAdmin />} />

        {/* Program (admin) */}
        <Route path="program" element={<ProgramAdmin />} />
        <Route path="program/new" element={<ProgramForm />} />
        <Route path="program/:id/edit" element={<ProgramForm />} />

        <Route path="headmaster" element={<AdminHeadmaster />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
