/**
 * Get storage prefix based on current port
 * This allows multiple dev servers to have separate auth
 */
function getStoragePrefix() {
  const port = window.location.port || "5173";
  return `trendy_${port}_`;
}

/**
 * Get item from localStorage with port-specific prefix
 */
export function getStorageItem(key) {
  const prefix = getStoragePrefix();
  return localStorage.getItem(prefix + key);
}

/**
 * Set item to localStorage with port-specific prefix
 */
export function setStorageItem(key, value) {
  const prefix = getStoragePrefix();
  localStorage.setItem(prefix + key, value);
}

/**
 * Remove item from localStorage with port-specific prefix
 */
export function removeStorageItem(key) {
  const prefix = getStoragePrefix();
  localStorage.removeItem(prefix + key);
}

/**
 * Clear all items for current port
 */
export function clearPortStorage() {
  const prefix = getStoragePrefix();
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    if (key.startsWith(prefix)) {
      localStorage.removeItem(key);
    }
  });
}

// Backward compatible wrappers
export const storage = {
  getToken: () => getStorageItem("token"),
  setToken: (token) => setStorageItem("token", token),
  removeToken: () => removeStorageItem("token"),

  getUser: () => {
    const raw = getStorageItem("user");
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user) => setStorageItem("user", JSON.stringify(user)),
  removeUser: () => removeStorageItem("user"),

  // Generic get/set for any key (for chat history, etc)
  get: (key) => getStorageItem(key),
  set: (key, value) => setStorageItem(key, value),

  clear: () => clearPortStorage(),
};
