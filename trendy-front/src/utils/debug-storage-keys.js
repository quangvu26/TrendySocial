/**
 * Storage Key Debug - Check what keys are being used
 */

window.debugStorageKeys = function () {
  console.log("=== STORAGE KEY DEBUG ===\n");

  const port = window.location.port || "5173";
  const expectedPrefix = `trendy_${port}_`;
  const expectedTokenKey = expectedPrefix + "token";
  const expectedUserKey = expectedPrefix + "user";

  console.log("Expected Values:");
  console.log("  Port:", port);
  console.log("  Prefix:", expectedPrefix);
  console.log("  Token Key:", expectedTokenKey);
  console.log("  User Key:", expectedUserKey);

  console.log("\nActual localStorage keys:");
  const trendyKeys = Object.keys(localStorage).filter((k) =>
    k.includes("trendy")
  );
  if (trendyKeys.length === 0) {
    console.log("  ❌ NO TRENDY KEYS FOUND!");
  } else {
    trendyKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      console.log(`  ✅ ${key}:`);
      if (key.includes("token")) {
        console.log(`     Value: ${value?.substring(0, 50)}...`);
      } else if (key.includes("user")) {
        console.log(`     Value: ${value}`);
      }
    });
  }

  console.log("\nChecking specific keys:");
  console.log(
    `  ${expectedTokenKey}:`,
    localStorage.getItem(expectedTokenKey) ? "✅ EXISTS" : "❌ NOT FOUND"
  );
  console.log(
    `  ${expectedUserKey}:`,
    localStorage.getItem(expectedUserKey) ? "✅ EXISTS" : "❌ NOT FOUND"
  );

  console.log("\n========================\n");

  console.log(
    "Action: If keys don't match expected, you have a storage issue!"
  );
};

// Auto-run on page load
console.log("💡 Run window.debugStorageKeys() to check storage key issues");
