import api from "./axios";

export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const logout = (token) =>
  api.post("/auth/logout", { token });
