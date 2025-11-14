window.verifyLoginFix = async function () {
  console.log("=== VERIFY LOGIN FIX ===\n");

  const port = window.location.port || "5173";
  const expectedTokenKey = `trendy_${port}_token`;
  const expectedUserKey = `trendy_${port}_user`;

  console.log("Step 1: Check actual storage keys");
  const allKeys = Object.keys(localStorage).filter((k) => k.includes("trendy"));
  console.log(`  Found ${allKeys.length} trendy keys:`);
  allKeys.forEach((k) => console.log(`    - ${k}`));

  console.log("\nStep 2: Check expected keys");
  const tokenExists = !!localStorage.getItem(expectedTokenKey);
  const userExists = !!localStorage.getItem(expectedUserKey);
  console.log(
    `  ${expectedTokenKey}: ${tokenExists ? "✅ EXISTS" : "❌ MISSING"}`
  );
  console.log(
    `  ${expectedUserKey}: ${userExists ? "✅ EXISTS" : "❌ MISSING"}`
  );

  console.log("\nStep 3: Verify token format");
  const token = localStorage.getItem(expectedTokenKey);
  if (token) {
    const parts = token.split(".");
    console.log(
      `  Token parts: ${parts.length} ${
        parts.length === 3 ? "✅ VALID JWT" : "❌ INVALID"
      }`
    );

    try {
      const payload = JSON.parse(atob(parts[1]));
      console.log(`  Token payload: ${JSON.stringify(payload)}`);
      console.log(`  User ID: ${payload.sub || payload.userId}`);
      console.log(`  Email: ${payload.email}`);
    } catch (e) {
      console.error(`  ❌ Failed to parse token:`, e);
    }
  } else {
    console.log(`  ❌ Token not found!`);
  }

  console.log("\nStep 4: Test direct storage functions");
  const { getTokenDirect, getUserDirect } = await import(
    "../utils/directStorage.js"
  );
  const directToken = getTokenDirect();
  const directUser = getUserDirect();
  console.log(
    `  getTokenDirect(): ${directToken ? "✅ FOUND" : "❌ NOT FOUND"}`
  );
  console.log(
    `  getUserDirect(): ${
      directUser ? `✅ FOUND (${directUser.email})` : "❌ NOT FOUND"
    }`
  );

  console.log("\n=======================");
  console.log("Summary:");
  if (tokenExists && userExists && directToken && directUser) {
    console.log("✅ ALL CHECKS PASSED - Login should work!");
  } else {
    console.log("❌ SOME CHECKS FAILED - Check console errors above");
  }
};

console.log("💡 Run window.verifyLoginFix() after login to verify fix works");
