/**
 * CRITICAL: Login Fix - Save token directly
 *
 * This function MUST be called after successful login
 * Saves token with correct localStorage key format
 */

export function saveLoginDataDirectly(token, userInfo, port = null) {
  try {
    port = port || window.location.port || "5173";

    // Save token
    const tokenKey = `trendy_${port}_token`;
    localStorage.setItem(tokenKey, token);
    console.log(`✅ Token saved to: ${tokenKey}`);

    // Save user
    const userKey = `trendy_${port}_user`;
    localStorage.setItem(userKey, JSON.stringify(userInfo));
    console.log(`✅ User saved to: ${userKey}`);

    // Verify
    const tokenCheck = localStorage.getItem(tokenKey);
    const userCheck = localStorage.getItem(userKey);

    console.log(`✅ Verification: token=${!!tokenCheck}, user=${!!userCheck}`);

    return tokenCheck && userCheck;
  } catch (e) {
    console.error("❌ Error saving login data:", e);
    return false;
  }
}

console.log("✅ Login data saver loaded");
