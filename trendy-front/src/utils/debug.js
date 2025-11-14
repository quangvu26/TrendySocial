/**
 * Debug helper - check current user info
 * Paste this into browser console
 */
window.debugUser = function () {
  const port = window.location.port || "5173";
  const prefix = `trendy_${port}_`;

  // Check all localStorage keys

  Object.keys(localStorage).forEach((key) => {});

  // Check token
  const token = localStorage.getItem(prefix + "token");

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      console.error("Failed to parse token:", e);
    }
  }

  // Check user
  const userRaw = localStorage.getItem(prefix + "user");

  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
    } catch (e) {
      console.error("Failed to parse user:", e);
    }
  }
};
