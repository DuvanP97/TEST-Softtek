// src/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: false, // no hace falta cookies para Bearer
});

// Lee el token desde donde lo guardes (localStorage, Zustand, Context, etc.)
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth");
  // Ejemplo: guardaste { token: "ey..." }
  const token = raw ? JSON.parse(raw).token : null;

  if (token) {
    // MUY importante: exactamente "Bearer " + token (con espacio y mayúscula)
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});