/**
 * Check what storage migration is doing
 */
window.debugMigration = function () {
  console.log("=== STORAGE MIGRATION DEBUG ===\n");

  const port = window.location.port || "5173";
  const expectedPrefix = `trendy_${port}_`;

  console.log("Current localStorage:");
  Object.keys(localStorage).forEach((key, idx) => {
    const value = localStorage.getItem(key);
    console.log(`  [${idx}] ${key}:`);
    if (key.includes("token")) {
      console.log(`      Value: ${value?.substring(0, 50)}...`);
    } else {
      console.log(`      Value: ${value?.substring(0, 100)}...`);
    }
  });

  console.log("\nExpected keys:");
  console.log(`  ${expectedPrefix}token`);
  console.log(`  ${expectedPrefix}user`);

  console.log("\n================================\n");
};

console.log("💡 Run window.debugMigration() to check storage migration");
