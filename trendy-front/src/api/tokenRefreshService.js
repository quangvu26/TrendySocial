import api from "./api";
import { storage } from "../utils/storage";

let refreshTimer = null;
let activityTimer = null;
let lastActivityTime = null;
let isMonitoring = false;

const REFRESH_INTERVAL = 25 * 60 * 1000; // 25 minutes (refresh before 30-min token expires)
const ACTIVITY_THROTTLE = 5 * 60 * 1000; // 5 minutes - refresh at most every 5 mins to avoid spam

/**
 * Start automatic token refresh with activity monitoring
 * Refreshes token on user activity or every 25 minutes
 */
export const startTokenRefresh = () => {
  // Clear existing timers if any
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
  stopActivityMonitoring();

  console.log(
    "🔄 Starting token auto-refresh service (activity-based + 25 min backup)"
  );

  // Refresh immediately on start
  refreshToken();

  // Start activity monitoring
  startActivityMonitoring();

  // Fallback: refresh every 25 minutes regardless of activity
  refreshTimer = setInterval(() => {
    console.log("⏱️ Timer-based token refresh (25 min interval)");
    refreshToken();
  }, REFRESH_INTERVAL);
};

/**
 * Start monitoring user activity
 * Detects: keypress, click, scroll, focus
 */
const startActivityMonitoring = () => {
  if (isMonitoring) return;
  isMonitoring = true;

  console.log("👁️ Activity monitoring started");
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

    // Only refresh if 5 minutes have passed since last refresh (throttle)
    if (timeSinceLastRefresh >= ACTIVITY_THROTTLE) {
      console.log("🎯 User activity detected - refreshing token");
      lastActivityTime = now;
      refreshToken();
    }
  };

  // Add event listeners
  activityEvents.forEach((event) => {
    document.addEventListener(event, handleActivity, true);
  });

  // Store reference for cleanup
  window._activityHandler = handleActivity;
  window._activityEvents = activityEvents;
};

/**
 * Stop monitoring user activity
 */
const stopActivityMonitoring = () => {
  if (!isMonitoring) return;
  isMonitoring = false;

  console.log("🛑 Activity monitoring stopped");

  if (window._activityHandler && window._activityEvents) {
    window._activityEvents.forEach((event) => {
      document.removeEventListener(event, window._activityHandler, true);
    });
    delete window._activityHandler;
    delete window._activityEvents;
  }
};

/**
 * Stop automatic token refresh
 */
export const stopTokenRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
  stopActivityMonitoring();
  console.log("🛑 Stopped token auto-refresh service");
};

/**
 * Manually refresh token
 */
export const refreshToken = async () => {
  try {
    const token = storage.getToken();
    if (!token) {
      console.warn("⚠️ No token found to refresh");
      return false;
    }

    console.log("🔄 Refreshing token...");

    // Call refresh endpoint
    const response = await api.post("/auth/refresh", {
      token: token,
    });

    if (response.data?.token) {
      const newToken = response.data.token;
      storage.setToken(newToken);
      console.log("✅ Token refreshed successfully");
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

    // If refresh fails (invalid/expired token), logout user
    if (error.response?.status === 401) {
      console.log("🚪 Token expired, logging out...");
      handleTokenExpiration();
    }
    return false;
  }
};

/**
 * Handle token expiration - logout and redirect to login
 */
const handleTokenExpiration = () => {
  stopTokenRefresh();
  storage.clearAuth();

  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

/**
 * Check if token will expire soon (within 2 minutes)
 */
export const isTokenExpiringSoon = () => {
  try {
    const token = storage.getToken();
    if (!token) return true;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = decoded.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;

    return timeUntilExpiry < 2 * 60 * 1000; // True if less than 2 minutes
  } catch (e) {
    console.error("Error checking token expiry:", e);
    return true; // Assume expired if can't decode
  }
};

export default {
  startTokenRefresh,
  stopTokenRefresh,
  refreshToken,
  isTokenExpiringSoon,
};
