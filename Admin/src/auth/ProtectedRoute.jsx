import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function ProtectedRoute({ allowedRoles, role, roles }) {
  const { user, loading } = useAuth();

  const normalizedAllowedRoles =
    allowedRoles ??
    (typeof role === "string" && role.length ? [role] : null) ??
    (Array.isArray(roles) && roles.length ? roles : null);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (normalizedAllowedRoles && !normalizedAllowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
