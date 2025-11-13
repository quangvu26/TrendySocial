/**
 * Debug script - paste in browser console to check chat loading
 */

window.debugChats = async function () {
  console.log("=== DEBUG CHATS ===");

  // Check user
  const userRaw = localStorage.getItem("trendy_5173_user");
  if (!userRaw) {
    console.error("❌ No user found in storage");
    return;
  }

  const user = JSON.parse(userRaw);
  console.log("✅ User:", user);
  console.log("   ID:", user.id);

  // Check API endpoints
  try {
    console.log("\n📡 Testing API endpoints...");

    // Test solo chats
    const soloUrl = `http://localhost:8080/trendy/chat/solo?userId=${user.id}`;
    console.log("   Solo URL:", soloUrl);

    const soloRes = await fetch(soloUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trendy_5173_token")}`,
      },
    });
    const soloData = await soloRes.json();
    console.log("   Solo chats:", soloData);

    // Test group chats
    const groupUrl = `http://localhost:8080/trendy/chat/group?userId=${user.id}`;
    console.log("   Group URL:", groupUrl);

    const groupRes = await fetch(groupUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trendy_5173_token")}`,
      },
    });
    const groupData = await groupRes.json();
    console.log("   Group chats:", groupData);

    console.log("\n📊 Summary:");
    console.log("   Solo chats:", soloData?.length || 0);
    console.log("   Group chats:", groupData?.length || 0);
    console.log(
      "   Total:",
      (soloData?.length || 0) + (groupData?.length || 0)
    );
  } catch (e) {
    console.error("❌ API Error:", e);
  }

  console.log("===================");
};

console.log("💡 Run window.debugChats() to check chat loading");
