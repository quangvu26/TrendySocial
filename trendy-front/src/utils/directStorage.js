export function saveTokenDirect(token) {
  try {
    const port = window.location.port || "5173";
    const tokenKey = `trendy_${port}_token`;
    localStorage.setItem(tokenKey, token);

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
    } else {
    }
    return token;
  } catch (e) {
    console.error("❌ Failed to get token:", e);
    return null;
  }
}
