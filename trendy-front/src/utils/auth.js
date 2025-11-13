import { storage } from "./storage";

/**
 * Utility to clear all authentication data
 * Call this when:
 * - User logs out
 * - Token is invalid/expired
 * - App detects authentication error
 */
export function clearAuthData() {
  console.log("🧹 Clearing all authentication data...");

  storage.clear();
  sessionStorage.clear();

  console.log("✅ Authentication data cleared");
}

/**
 * Check if user has valid authentication
 */
export function hasValidAuth() {
  const token = storage.getToken();
  if (!token) return false;

  // Basic JWT format check (has 3 parts separated by dots)
  const parts = token.split(".");
  if (parts.length !== 3) {
    console.warn("⚠️ Invalid token format detected");
    clearAuthData();
    return false;
  }

  try {
    // Parse token payload
    const payload = JSON.parse(atob(parts[1]));

    // Check expiration
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        console.warn("⚠️ Token expired");
        clearAuthData();
        return false;
      }
    }

    return true;
  } catch (e) {
    console.error("❌ Failed to parse token:", e);
    clearAuthData();
    return false;
  }
}
