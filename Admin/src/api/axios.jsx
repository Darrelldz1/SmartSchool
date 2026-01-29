import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ganti jika beda
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===============================
   REQUEST INTERCEPTOR
   kirim JWT otomatis
================================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===============================
   RESPONSE INTERCEPTOR
   handle token invalid / expired
================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // token invalid / expired / blacklist
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }

    if (status === 403) {
      alert("Akses ditolak");
    }

    return Promise.reject(error);
  }
);

export default api;
