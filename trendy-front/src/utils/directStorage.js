/**
 * CRITICAL FIX: Direct localStorage access
 *
 * Problem: storage.setUser() and saveToken() may have issues
 * Solution: Use localStorage directly with correct key format
 */

export function saveTokenDirect(token) {
  try {
    const port = window.location.port || "5173";
    const tokenKey = `trendy_${port}_token`;
    localStorage.setItem(tokenKey, token);
    console.log(`✅ Token saved directly: ${tokenKey}`);
    return true;
  } catch (e) {
    console.error("❌ Failed to save token:", e);
    return false;
  }
}

export function getUserDirect() {
  try {
    const port = window.location.port || "5173";
    const userKey = `trendy_${port}_user`;
    const userJson = localStorage.getItem(userKey);
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (e) {
    console.error("❌ Failed to get user:", e);
    return null;
  }
}

export function setUserDirect(userInfo) {
  try {
    const port = window.location.port || "5173";
    const userKey = `trendy_${port}_user`;
    localStorage.setItem(userKey, JSON.stringify(userInfo));
    console.log(`✅ User saved directly: ${userKey}`);
    return true;
  } catch (e) {
    console.error("❌ Failed to save user:", e);
    return false;
  }
}

export function getTokenDirect() {
  try {
    const port = window.location.port || "5173";
    const tokenKey = `trendy_${port}_token`;
    const token = localStorage.getItem(tokenKey);
    if (token) {
      console.log(`✅ Token found: ${tokenKey}`);
    } else {
      console.log(`❌ Token NOT found: ${tokenKey}`);
    }
    return token;
  } catch (e) {
    console.error("❌ Failed to get token:", e);
    return null;
  }
}

console.log("✅ Direct storage helpers loaded");
