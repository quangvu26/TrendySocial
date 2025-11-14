/**
 * Check what storage migration is doing
 */
window.debugMigration = function () {
  const port = window.location.port || "5173";
  const expectedPrefix = `trendy_${port}_`;

  Object.keys(localStorage).forEach((key, idx) => {
    const value = localStorage.getItem(key);

    if (key.includes("token")) {
    } else {
    }
  });
};
