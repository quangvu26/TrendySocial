export function saveLoginDataDirectly(token, userInfo, port = null) {
  try {
    port = port || window.location.port || "5173";

    // Save token
    const tokenKey = `trendy_${port}_token`;
    localStorage.setItem(tokenKey, token);

    // Save user
    const userKey = `trendy_${port}_user`;
    localStorage.setItem(userKey, JSON.stringify(userInfo));

    // Verify
    const tokenCheck = localStorage.getItem(tokenKey);
    const userCheck = localStorage.getItem(userKey);

    return tokenCheck && userCheck;
  } catch (e) {
    console.error("❌ Error saving login data:", e);
    return false;
  }
}
