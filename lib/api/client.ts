import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Import lazily to avoid circular deps and SSR issues
    const { useAuthStore } = require("@/stores/auth.store");
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const { useAuthStore } = require("@/stores/auth.store");
      useAuthStore.getState().clearSession();
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
