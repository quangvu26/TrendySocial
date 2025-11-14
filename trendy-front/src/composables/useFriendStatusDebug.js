// filepath: f:\Du_An\TrendySocialApp\trendy-front\src\composables\useFriendStatusDebug.js
/**
 * Debug helper - test backend friend status endpoint
 */
export const testFriendStatus = async (userId1, userId2) => {
  const api = await import("../api/api").then((m) => m.default);

  try {
    const res = await api.get("/trendy/friends/status", {
      params: { userId1, userId2 },
    });

    return res.data;
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    return null;
  }
};

// Attach to window for console debugging
if (typeof window !== "undefined") {
  window.testFriendStatus = testFriendStatus;
}
