/**
 * Migration script to move old localStorage keys to port-specific keys
 * Run this once when app starts
 */
export function migrateOldStorage() {
  const port = window.location.port || "5173";
  const prefix = `trendy_${port}_`;

  console.log(`🔄 Running storage migration for port ${port}...`);

  // List of keys to migrate
  const keysToMigrate = ["token", "user", "lastSelectedChat"];

  keysToMigrate.forEach((key) => {
    const oldValue = localStorage.getItem(key);
    const newKey = prefix + key;

    // If old key exists but new key doesn't, migrate
    if (oldValue && !localStorage.getItem(newKey)) {
      console.log(`  Migrating ${key} → ${newKey}`);
      localStorage.setItem(newKey, oldValue);
      // Remove old key after migration
      localStorage.removeItem(key);
    }
  });

  // Clean up any chat-history keys without prefix
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("chat-history-") && !key.startsWith(prefix)) {
      console.log(`  Removing old chat history: ${key}`);
      localStorage.removeItem(key);
    }
  });

  console.log("✅ Storage migration complete");
}

// Auto-run migration
if (typeof window !== "undefined") {
  migrateOldStorage();
}
