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
            window.location.href = "/login";
          }
        } catch (e) {
          console.warn("Error while handling auth redirect", e);
        }
      }
      if (error.response.status >= 500) {
        console.error("Server error:", error.response.data);
      }
    } else if (error.request) {
      console.error("Network error - server unreachable");
    }
    return Promise.reject(error);
  }
);

export default api;
