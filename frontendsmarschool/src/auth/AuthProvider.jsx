// src/auth/AuthProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

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

  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // mapping respons backend (jaga fleksibilitas)
      const token = res.data.token || res.data.accessToken || null;
      const role =
        res.data.role ||
        (res.data.user && res.data.user.role) ||
        (res.data.data && res.data.data.role) ||
        "user";
      const name =
        res.data.name || (res.data.user && res.data.user.name) || null;

      const authObj = { token, role, email, name };

      // simpan ke localStorage (synchronous)
      localStorage.setItem("auth", JSON.stringify(authObj));

      // update state (asynchronous)
      setUser(authObj);

      setLoading(false);

      // kembalikan juga user supaya caller tidak harus menunggu state React
      return { ok: true, role, user: authObj };
    } catch (err) {
      setLoading(false);
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "Login failed";
      return { ok: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
