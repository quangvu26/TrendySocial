import api from "./api";
import { storage } from "../utils/storage";

let refreshTimer = null;
let activityTimer = null;
let lastActivityTime = null;
let isMonitoring = false;

const REFRESH_INTERVAL = 25 * 60 * 1000; 
const ACTIVITY_THROTTLE = 5 * 60 * 1000; 
export const startTokenRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
  stopActivityMonitoring();
  refreshToken();

  startActivityMonitoring();
  refreshTimer = setInterval(() => {
    refreshToken();
  }, REFRESH_INTERVAL);
};
const startActivityMonitoring = () => {
  if (isMonitoring) return;
  isMonitoring = true;

  lastActivityTime = Date.now();

  const activityEvents = [
    "keypress",
    "click",
    "scroll",
    "touchstart",
    "mousemove",
  ];

  const handleActivity = () => {
    const now = Date.now();
    const timeSinceLastRefresh = now - (lastActivityTime || 0);
    if (timeSinceLastRefresh >= ACTIVITY_THROTTLE) {
      lastActivityTime = now;
      refreshToken();
    }
  };
  activityEvents.forEach((event) => {
    document.addEventListener(event, handleActivity, true);
  });
  window._activityHandler = handleActivity;
  window._activityEvents = activityEvents;
};
const stopActivityMonitoring = () => {
  if (!isMonitoring) return;
  isMonitoring = false;

  if (window._activityHandler && window._activityEvents) {
    window._activityEvents.forEach((event) => {
      document.removeEventListener(event, window._activityHandler, true);
    });
    delete window._activityHandler;
    delete window._activityEvents;
  }
};
export const stopTokenRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
  stopActivityMonitoring();
};
export const refreshToken = async () => {
  try {
    const token = storage.getToken();
    if (!token) {
      console.warn("⚠️ No token found to refresh");
      return false;
    }
    const response = await api.post("/auth/refresh", {
      token: token,
    });

    if (response.data?.token) {
      const newToken = response.data.token;
      storage.setToken(newToken);

      return true;
    } else {
      console.warn("⚠️ No new token in refresh response");
      return false;
    }
  } catch (error) {
    console.error(
      "❌ Token refresh failed:",
      error.response?.data || error.message
    );
    if (error.response?.status === 401) {
      handleTokenExpiration();
    }
    return false;
  }
};

const handleTokenExpiration = () => {
  stopTokenRefresh();
  storage.clearAuth();

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

export const isTokenExpiringSoon = () => {
  try {
    const token = storage.getToken();
    if (!token) return true;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = decoded.exp * 1000; 
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;

    return timeUntilExpiry < 2 * 60 * 1000; 
  } catch (e) {
    console.error("Error checking token expiry:", e);
    return true; 
  }
};

export default {
  startTokenRefresh,
  stopTokenRefresh,
  refreshToken,
  isTokenExpiringSoon,
};
