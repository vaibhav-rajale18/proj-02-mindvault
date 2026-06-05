import axios from "axios";

const TOKEN_KEY = "mindvault_token";
const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.trim().replace(/\/+$/, "")
  : "";

if (!BASE_URL) {
  console.warn(
    "VITE_API_URL is not configured. Set VITE_API_URL in frontend environment variables.",
  );
}

const API = axios.create({
  baseURL: BASE_URL || undefined,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem(TOKEN_KEY);
    }

    return Promise.reject(error);
  },
);

export default API;
