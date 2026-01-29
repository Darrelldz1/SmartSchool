// src/auth/AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("auth");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // 🔐 Sync token ke axios
  useEffect(() => {
    if (user?.token) {
      api.defaults.headers.common.Authorization = `Bearer ${user.token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [user]);

  // ================= LOGIN =================
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });

      const authObj = {
        token: res.data.token,
        role: res.data.role,
        name: res.data.user?.name,
        email: res.data.user?.email,
      };

      localStorage.setItem("auth", JSON.stringify(authObj));
      setUser(authObj);

      return { ok: true, user: authObj };
    } catch (err) {
      return {
        ok: false,
        message:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Login gagal",
      };
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      if (user?.token) {
        await api.post("/auth/logout");
      }
    } catch (e) {
      console.warn("Logout API failed, clearing session anyway");
    } finally {
      localStorage.removeItem("auth");
      setUser(null);
      delete api.defaults.headers.common.Authorization;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
