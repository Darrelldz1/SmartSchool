import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

/**
 * ProtectedRoute
 * - allowedRoles: array string e.g. ["admin","guru"]
 *   if omitted => hanya butuh login (semua role boleh)
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth() || {};

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const arr = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!arr.includes(user.role)) {
      // tidak berhak -> arahkan ke home (atau halaman no-access jika ada)
      return <Navigate to="/" replace />;
    }
  }

  return children;
}