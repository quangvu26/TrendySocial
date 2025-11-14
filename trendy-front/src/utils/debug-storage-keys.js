window.debugStorageKeys = function () {
  const port = window.location.port || "5173";
  const expectedPrefix = `trendy_${port}_`;
  const expectedTokenKey = expectedPrefix + "token";
  const expectedUserKey = expectedPrefix + "user";

  const trendyKeys = Object.keys(localStorage).filter((k) =>
    k.includes("trendy")
  );
  if (trendyKeys.length === 0) {
  } else {
    trendyKeys.forEach((key) => {
      const value = localStorage.getItem(key);

      if (key.includes("token")) {
      } else if (key.includes("user")) {
      }
    });
  }

  console.log(
    `  ${expectedTokenKey}:`,
    localStorage.getItem(expectedTokenKey) ? "✅ EXISTS" : "❌ NOT FOUND"
  );
  console.log(
    `  ${expectedUserKey}:`,
    localStorage.getItem(expectedUserKey) ? "✅ EXISTS" : "❌ NOT FOUND"
  );

  console.log(
    "Action: If keys don't match expected, you have a storage issue!"
  );
};

// Auto-run on page load
