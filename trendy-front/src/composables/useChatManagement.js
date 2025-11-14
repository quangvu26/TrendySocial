// filepath: f:\Du_An\TrendySocialApp\trendy-front\src\composables\useChatManagement.js
import { ref, computed } from "vue";
import api from "../api/api";
import { storage } from "../utils/storage";

/**
 * Composable để quản lý chat list và friend requests
 * Handles: real-time updates, deduplication, friend state tracking
 */
export const useChatManagement = () => {
  const chats = ref([]);
  const friends = ref([]);
  const friendRequests = ref({}); // { userId: 'pending'|'accepted'|'none' }
  const selectedChat = ref(null);

  /**
   * Deduplicate and update chat list
   * Ensures no duplicate chats for same person
   */
  const updateOrAddChat = (chatData) => {
    const existingIdx = chats.value.findIndex(
      (c) => c.id === chatData.id && c.type === chatData.type
    );

    if (existingIdx >= 0) {
      // Update existing
      Object.assign(chats.value[existingIdx], chatData);
      // Move to top
      const chat = chats.value.splice(existingIdx, 1)[0];
      chats.value.unshift(chat);
    } else {
      // Add new
      chats.value.unshift(chatData);
    }
  };

  /**
   * Update friend request status
   */
  const setFriendRequestStatus = (userId, status) => {
    friendRequests.value[userId] = status; // 'pending', 'accepted', 'none'
  };

  /**
   * Get friend request button state
   */
  const getFriendButtonState = (userId) => {
    return friendRequests.value[userId] || "none"; // none, pending, accepted
  };

  /**
   * Send friend request
   */
  const sendFriendRequest = async (fromId, toId) => {
    try {
      await api.post("/trendy/friends/request", {
        from: fromId,
        to: toId,
      });
      setFriendRequestStatus(toId, "pending");
      return { success: true };
    } catch (error) {
      console.error("Send friend request failed:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  /**
   * Cancel friend request
   */
  const cancelFriendRequest = async (fromId, toId) => {
    try {
      // Find and reject the request
      const relationsRes = await api.get("/trendy/friends/relations", {
        params: { userId: fromId },
      });
      const relations = relationsRes.data || [];
      const requestToCancel = relations.find(
        (r) =>
          r.trangThai === "CHO_DUYET" &&
          ((r.maNguoiGui === fromId && r.maNguoiNhan === toId) ||
            (r.maNguoiGui === toId && r.maNguoiNhan === fromId))
      );

      if (requestToCancel) {
        await api.post(`/trendy/friends/${requestToCancel.maYeuCau}/reject`);
        setFriendRequestStatus(toId, "none");
        return { success: true };
      } else {
        return { success: false, error: "Không tìm thấy lời mời" };
      }
    } catch (error) {
      console.error("Cancel friend request failed:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  /**
   * Unfriend user
   */
  const unfriendUser = async (userId1, userId2) => {
    try {
      await api.delete("/trendy/friends/unfriend", {
        params: { userId1, userId2 },
      });
      setFriendRequestStatus(userId2, "none"); // Reset to 'none'
      return { success: true };
    } catch (error) {
      console.error("Unfriend failed:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  /**
   * Load friend request statuses
   */
  const loadFriendStatuses = async (userId) => {
    try {
      // Get all relations
      const relationsRes = await api.get("/trendy/friends/relations", {
        params: { userId },
      });
      const relations = relationsRes.data || [];

      // Get friends list
      const friendsRes = await api.get("/trendy/friends/list", {
        params: { userId },
      });
      friends.value = friendsRes.data || [];

      // Reset all statuses
      friendRequests.value = {};

      // Set statuses
      relations.forEach((r) => {
        const otherId = r.maNguoiGui === userId ? r.maNguoiNhan : r.maNguoiGui;
        if (r.trangThai === "XAC_NHAN") {
          friendRequests.value[otherId] = "accepted";
        } else if (r.trangThai === "CHO_DUYET") {
          friendRequests.value[otherId] = "pending";
        }
      });

      return { success: true };
    } catch (error) {
      console.error("Load friend statuses failed:", error);
      return { success: false };
    }
  };

  /**
   * Handle incoming message - update chat list
   */
  const handleIncomingMessage = (message, senderInfo) => {
    const chatData = {
      id: senderInfo.id,
      name: senderInfo.name || senderInfo.id,
      avatar: senderInfo.avatar,
      lastMessage: message.noiDung || message.content,
      time: message.ngayGui || new Date().toISOString(),
      type: "private",
      maNhomSolo: senderInfo.maNhomSolo,
    };

    updateOrAddChat(chatData);
  };

  /**
   * Handle group message - update chat list
   */
  const handleIncomingGroupMessage = (message, groupInfo) => {
    const chatData = {
      id: groupInfo.id,
      name: groupInfo.name,
      avatar: groupInfo.avatar,
      lastMessage: message.noiDung || message.content,
      time: message.ngayGui || new Date().toISOString(),
      type: "group",
      maNhom: groupInfo.id,
    };

    updateOrAddChat(chatData);
  };

  return {
    chats,
    friends,
    friendRequests,
    selectedChat,
    updateOrAddChat,
    setFriendRequestStatus,
    getFriendButtonState,
    sendFriendRequest,
    cancelFriendRequest,
    unfriendUser,
    loadFriendStatuses,
    handleIncomingMessage,
    handleIncomingGroupMessage,
  };
};
