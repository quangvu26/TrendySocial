/**
 * Debug script for login issues
 * Paste into browser console to test login API
 */

window.debugLogin = async function () {
  console.log("=== DEBUG LOGIN ===\n");

  // Get token from storage
  const port = window.location.port || "5173";
  const prefix = `trendy_${port}_`;
  const token = localStorage.getItem(prefix + "token");
  const user = localStorage.getItem(prefix + "user");

  console.log("Storage Info:");
  console.log("  Token:", token ? token.substring(0, 50) + "..." : "NO TOKEN");
  console.log("  User:", user);

  // Test login API
  console.log("\nTesting Login API...");
  try {
    const response = await fetch("http://localhost:8080/trendy/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "123456",
      }),
    });

    console.log("Response Status:", response.status);
    const data = await response.json();
    console.log("Response Data:", data);

    if (data.token) {
      console.log("\n✅ Token received:", data.token.substring(0, 50) + "...");

      // Parse token
      try {
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        console.log("Token Payload:", payload);
        console.log("User ID:", payload.sub || payload.userId || payload.id);
        console.log("Email:", payload.email);
        console.log("Expires:", new Date(payload.exp * 1000));
      } catch (e) {
        console.error("Failed to parse token:", e);
      }
    } else {
      console.error("❌ No token in response");
    }
  } catch (e) {
    console.error("Login API error:", e);
  }

  console.log("\n===================");
};

window.debugGoogleLogin = async function () {
  console.log("=== DEBUG GOOGLE LOGIN ===\n");

  const backend = "http://localhost:8080";
  const frontend = window.location.origin;

  console.log("Frontend URL:", frontend);
  console.log("Backend URL:", backend);
  console.log("OAuth2 URL:", `${backend}/oauth2/authorization/google`);

  console.log("\nClick here to start Google OAuth:");
  console.log(
    `<a href="${backend}/oauth2/authorization/google">Login with Google</a>`
  );

  console.log("\n=========================");
};

window.debugStorage = function () {
  console.log("=== DEBUG STORAGE ===\n");

  const port = window.location.port || "5173";
  const prefix = `trendy_${port}_`;

  console.log("Port:", port);
  console.log("Prefix:", prefix);

  console.log("\nAll localStorage keys:");
  Object.keys(localStorage).forEach((key) => {
    const value = localStorage.getItem(key);
    console.log(
      `  ${key}: ${value?.substring(0, 50)}${value?.length > 50 ? "..." : ""}`
    );
  });

  console.log("\nAll sessionStorage keys:");
  Object.keys(sessionStorage).forEach((key) => {
    const value = sessionStorage.getItem(key);
    console.log(
      `  ${key}: ${value?.substring(0, 50)}${value?.length > 50 ? "..." : ""}`
    );
  });

  console.log("\n=====================");
};

console.log("💡 Debug functions available:");
console.log("  window.debugLogin() - Test login API");
console.log("  window.debugGoogleLogin() - Test Google OAuth");
console.log("  window.debugStorage() - Check all storage");
