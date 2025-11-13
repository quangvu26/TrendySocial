import axios from "axios";
import { storage } from "../utils/storage";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        try {
          const pathname = window.location.pathname || "";
          const authPaths = [
            "/login",
            "/register",
            "/forgot-password",
            "/reset-password",
            "/oauth2",
          ];
          const onAuthPage = authPaths.some((p) => pathname.startsWith(p));

          storage.removeToken();
          storage.removeUser();

          if (!onAuthPage) {
            // only redirect when not already on an auth-related page
            window.location.href = "/login";
          }
        } catch (e) {
          console.warn("Error while handling auth redirect", e);
        }
      }

      // Log server errors for debugging
      if (error.response.status >= 500) {
        console.error("Server error:", error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error("Network error - server unreachable");
    }
    // let the caller handle the error (so components can display field-level validation)
    return Promise.reject(error);
  }
);

export default api;
