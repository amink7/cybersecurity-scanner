import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081",
});

// Añade JWT si existe
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- AUTH ----
export const login = (username, password) =>
  API.post("/auth/usuarios/login", { username, password });

export const register = (username, password) =>
  API.post("/auth/usuarios/registrar", { username, password });

// ---- SCAN ----
export const scanPorts = (target) => API.post("/scan/scan/ports", { target });
export const scanWeb = (targetUrl) => API.post("/scan/scan/zap", { targetUrl });
export const detectTech = (target) => API.post("/scan/tech", { target });
export const fingerprint = (target) => API.post("/scan/fingerprint", { target });

// ---- REPORTS ----
export const getReports = () => API.get("/report/list");
export const downloadReport = (id, format = "json") =>
  API.get("/report/download", { params: { id, format }, responseType: "blob" });

// ---- CLIENT INFO ----
export const getClientDetails = () => API.get("/client-info/details");
export const getClientFingerprint = () => API.get("/client-info/fingerprint");
export const analyzeUserAgent = () => API.get("/client-info/analyze-user-agent");
export const getGeoIp = () => API.get("/client-info/geoip");

export default API;



