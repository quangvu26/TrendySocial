const TOKEN_KEY = "authToken";
const OAUTH_USER_KEY = "oauthUser";

/**
 * Token Management
 */
export function saveToken(token) {
  const port = window.location.port || "5173";
  // FIXED: Use exact key format
  const key = `trendy_${port}_token`;
  localStorage.setItem(key, token);

  return token;
}

export function getToken() {
  const port = window.location.port || "5173";
  // FIXED: Use exact key format to match saveToken
  const key = `trendy_${port}_token`;
  const token = localStorage.getItem(key);
  if (token) {
  } else {
  }
  return token;
}

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const hasToken = () => {
  return !!getToken();
};

/**
 * OAuth User Data Management
 */
export const saveOAuthUser = (userData) => {
  if (!userData) return;
  sessionStorage.setItem(OAUTH_USER_KEY, JSON.stringify(userData));
};

export const getOAuthUser = () => {
  try {
    const data = sessionStorage.getItem(OAUTH_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to parse OAuth user:", e);
    return null;
  }
};

export const clearOAuthUser = () => {
  sessionStorage.removeItem(OAUTH_USER_KEY);
};

/**
 * Clear all authentication data
 */
export const clearAllAuth = () => {
  clearToken();
  clearOAuthUser();
};

/**
 * Get auth header for API calls
 */
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export function setUser(user) {
  const port = window.location.port || "5173";
  // FIXED: Use exact key format
  const key = `trendy_${port}_user`;
  localStorage.setItem(key, JSON.stringify(user));
}

export function getUser() {
  const port = window.location.port || "5173";
  // FIXED: Use exact key format to match setUser
  const key = `trendy_${port}_user`;
  const userJson = localStorage.getItem(key);
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error("Failed to parse user JSON:", e);
      return null;
    }
  }
  return null;
}
