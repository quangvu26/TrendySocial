window.debugChats = async function () {
  // Check user
  const userRaw = localStorage.getItem("trendy_5173_user");
  if (!userRaw) {
    console.error("❌ No user found in storage");
    return;
  }

  const user = JSON.parse(userRaw);

  // Check API endpoints
  try {
    // Test solo chats
    const soloUrl = `http://localhost:8080/trendy/chat/solo?userId=${user.id}`;

    const soloRes = await fetch(soloUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trendy_5173_token")}`,
      },
    });
    const soloData = await soloRes.json();

    // Test group chats
    const groupUrl = `http://localhost:8080/trendy/chat/group?userId=${user.id}`;

    const groupRes = await fetch(groupUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trendy_5173_token")}`,
      },
    });
    const groupData = await groupRes.json();

    console.log(
      "   Total:",
      (soloData?.length || 0) + (groupData?.length || 0)
    );
  } catch (e) {
    console.error("❌ API Error:", e);
  }
};
