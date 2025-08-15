import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: false, 
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth");
  const token = raw ? JSON.parse(raw).token : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});