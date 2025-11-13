/**
 * Debug helper - check current user info
 * Paste this into browser console
 */
window.debugUser = function () {
  const port = window.location.port || "5173";
  const prefix = `trendy_${port}_`;

  console.log("=== DEBUG USER INFO ===");
  console.log("Current port:", port);
  console.log("Storage prefix:", prefix);

  // Check all localStorage keys
  console.log("\nAll localStorage keys:");
  Object.keys(localStorage).forEach((key) => {
    console.log(`  ${key}: ${localStorage.getItem(key)?.substring(0, 50)}...`);
  });

  // Check token
  const token = localStorage.getItem(prefix + "token");
  console.log("\nToken exists:", !!token);

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Token payload:", payload);
    } catch (e) {
      console.error("Failed to parse token:", e);
    }
  }

  // Check user
  const userRaw = localStorage.getItem(prefix + "user");
  console.log("\nUser data:", userRaw);

  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      console.log("Parsed user:", user);
    } catch (e) {
      console.error("Failed to parse user:", e);
    }
  }

  console.log("===================");
};

console.log("💡 Run window.debugUser() to check user info");
