import api from "./api";

export const sendFriendRequest = (from, to, message = "") =>
  api.post("/trendy/friends/request", { from, to, message });

export const acceptFriendRequest = (maYeuCau, fromId) =>
  api.post(`/trendy/friends/${maYeuCau}/accept`);

export const rejectFriendRequest = (maYeuCau) =>
  api.post(`/trendy/friends/${maYeuCau}/reject`);

export const unfriend = (userId1, userId2) =>
  api.delete("/trendy/friends/unfriend", {
    params: { userId1, userId2 },
  });

export const getFriendsList = (userId) =>
  api.get("/trendy/friends/list", { params: { userId } });

export const getPendingRequests = (userId) =>
  api.get("/trendy/friends/pending", { params: { userId } });

export const getRelations = (userId) =>
  api.get("/trendy/friends/relations", { params: { userId } });

export const validateFriendAction = async (action, myUserId, friendId) => {
  try {
    const res = await api.get("/trendy/friends/status", {
      params: { userId1: myUserId, userId2: friendId },
    });

    const status = res.data?.status;
    switch (action) {
      case "send":
        if (status === "accepted") {
          return {
            valid: false,
            error: "Bạn đã là bạn bè của người này",
            currentStatus: status,
          };
        }
        if (status === "pending_from_me") {
          return {
            valid: false,
            error: "Bạn đã gửi lời mời kết bạn cho người này",
            currentStatus: status,
          };
        }
        break;

      case "cancel":
        if (status !== "pending_from_me") {
          return {
            valid: false,
            error: "Không có lời mời để hủy",
            currentStatus: status,
          };
        }
        break;

      case "unfriend":
        if (status !== "accepted") {
          return {
            valid: false,
            error: "Bạn không phải là bạn bè của người này",
            currentStatus: status,
          };
        }
        break;
    }

    return { valid: true, currentStatus: status };
  } catch (error) {
    console.error("Failed to validate friend action:", error);
    return {
      valid: false,
      error: error.response?.data?.error || error.message,
      currentStatus: "unknown",
    };
  }
};
