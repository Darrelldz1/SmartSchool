import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

import Login from "@/pages/auth/login";
import AdminLayout from "@/layout/AdminLayout";
import Dashboard from "@/pages/admin/dashboard";
import ProfilePage from "@/pages/admin/profile/profile";
import HistoryPage from "@/pages/admin/profile/HistoryPage";
import GalleryPage from "@/pages/admin/content/GalleryPage";
import NewsPage from "@/pages/admin/content/NewsPage";
import TeacherPage from "@/pages/admin/academic/TeacherPage";
import StudentPage from "@/pages/admin/academic/StudentPage";
import ProgramPage from "@/pages/admin/academic/ProgramPage";
import AchievementPage from "@/pages/admin/academic/AchievementPage";
import ProtectedRoute from "@/auth/ProtectedRoute";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />

      {/* PROTECTED ADMIN */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="teacher" element={<TeacherPage />} />
          <Route path="siswa" element={<StudentPage />} />
          <Route path="program" element={<ProgramPage />} />
          <Route path="prestasi" element={<AchievementPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <Navigate to={user?.token ? "/admin" : "/login"} replace />
        }
      />
    </Routes>
  );
}
