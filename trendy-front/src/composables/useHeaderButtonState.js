// filepath: f:\Du_An\TrendySocialApp\trendy-front\src\composables\useHeaderButtonState.js
import { ref, computed } from "vue";
import api from "../api/api";

/**
 * Composable quản lý trạng thái nút kết bạn trong header
 * Backend handles all logic, frontend just displays state
 *
 * Button chỉ hiển thị:
 * - "Kết bạn" (orange) - khi không phải bạn
 * - "Đã gửi lời mời" (yellow) - khi đã gửi lời mời
 *
 * Hủy kết bạn → Menu dots (unfriendUser)
 *
 * Backend status:
 * - "accepted" → là bạn bè
 * - "pending_from_me" → đã gửi lời mời
 * - "pending_from_them" → họ gửi lời mời (show "Kết bạn")
 * - "none" → không phải bạn
 */
export const useHeaderButtonState = () => {
  const isFriend = ref(false);
  const hasSentRequest = ref(false);
  const isLoading = ref(false);

  // Computed properties for UI
  const friendButtonText = computed(() => {
    if (isFriend.value) {
      return "Là bạn";
    }
    if (hasSentRequest.value) {
      return "⏳ Đã gửi lời mời";
    }
    return "➕ Kết bạn";
  });

  const friendButtonIsFriend = computed(() => isFriend.value);

  /**
   * Load friend state from /trendy/friends/status
   */
  const loadFriendState = async (userId, chatUserId) => {
    if (!userId || !chatUserId) {
      console.warn("Missing userId or chatUserId");
      return;
    }

    try {
      const response = await api.get("/trendy/friends/status", {
        params: { userId1: userId, userId2: chatUserId },
      });

      const status = response.data?.status || "none";

      // Update state based on status
      if (status === "accepted") {
        isFriend.value = true;
        hasSentRequest.value = false;
      } else if (status === "pending_from_me") {
        isFriend.value = false;
        hasSentRequest.value = true;
      } else {
        isFriend.value = false;
        hasSentRequest.value = false;
      }

      // Cache the status in sessionStorage
      const cacheKey = `friend-status-${userId}-${chatUserId}`;
      sessionStorage.setItem(cacheKey, status);
    } catch (error) {
      console.error("Failed to load friend state:", error);
      isFriend.value = false;
      hasSentRequest.value = false;
    }
  };

  /**
   * Handle friend button click
   */
  const handleFriendButtonClick = async (userId, chatUserId) => {
    if (isFriend.value) {
      return {
        success: false,
        action: "already_friend",
      };
    }

    isLoading.value = true;
    try {
      if (hasSentRequest.value) {
        // Cancel request

        return {
          success: false,
          action: "cancel",
        };
      }

      // Send friend request

      return await sendFriendRequestHandler(userId, chatUserId);
    } finally {
      isLoading.value = false;
    }
  };

  // Send friend request
  const sendFriendRequestHandler = async (userId, chatUserId) => {
    try {
      const response = await api.post("/trendy/friends/request", {
        from: userId,
        to: chatUserId,
      });

      hasSentRequest.value = true;
      const cacheKey = `friend-status-${userId}-${chatUserId}`;
      sessionStorage.setItem(cacheKey, "pending_from_me");

      return {
        success: true,
        action: "send",
        newStatus: "pending_from_me",
      };
    } catch (error) {
      console.error(
        "Send friend request failed:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  };

  return {
    isFriend,
    hasSentRequest,
    isLoading,
    friendButtonText,
    friendButtonIsFriend,
    loadFriendState,
    handleFriendButtonClick,
  };
};
