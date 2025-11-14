// filepath: f:\Du_An\TrendySocialApp\trendy-front\src\composables/useFriendButtonState.js
import { ref, computed } from "vue";
import api from "../api/api";
import { storage } from "../utils/storage";

export const useFriendButtonState = () => {
  console.warn(
    "⚠️ useFriendButtonState is deprecated. Use useHeaderButtonState instead"
  );

  // ...existing code...
  const friendState = ref("none"); // 'none', 'pending', 'friend'
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Get button text based on state
   */
  const buttonText = computed(() => {
    switch (friendState.value) {
      case "pending":
        return "Đã gửi lời mời";
      case "friend":
        return "Hủy kết bạn";
      default:
        return "Kết bạn";
    }
  });

  /**
   * Check if button is disabled
   */
  const isButtonDisabled = computed(() => {
    return isLoading.value;
  });

  /**
   * Load friend state from server
   */
  const loadFriendState = async (myUserId, friendId) => {
    try {
      isLoading.value = true;
      error.value = null;

      const res = await api.get("/trendy/friends/relations", {
        params: { userId: myUserId },
      });

      const relations = res.data || [];
      const relation = relations.find(
        (r) =>
          (r.maNguoiGui === myUserId && r.maNguoiNhan === friendId) ||
          (r.maNguoiGui === friendId && r.maNguoiNhan === myUserId)
      );

      if (!relation) {
        friendState.value = "none";
      } else if (relation.trangThai === "XAC_NHAN") {
        friendState.value = "friend";
      } else if (relation.trangThai === "CHO_DUYET") {
        // Check who sent the request
        if (relation.maNguoiGui === myUserId) {
          friendState.value = "pending"; // I sent it
        } else {
          friendState.value = "incoming"; // They sent it (for future use)
        }
      }

      console.log(
        `✅ Friend state loaded for ${friendId}: ${friendState.value}`
      );
    } catch (error) {
      console.error("Failed to load friend state:", error);
      error.value = error.message;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Send friend request
   */
  const sendRequest = async (myUserId, friendId) => {
    if (isLoading.value) return false;

    try {
      isLoading.value = true;
      error.value = null;

      await api.post("/trendy/friends/request", {
        from: myUserId,
        to: friendId,
      });

      friendState.value = "pending";

      return true;
    } catch (err) {
      console.error("Send request failed:", err);
      error.value = err.response?.data?.message || err.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Cancel friend request
   */
  const cancelRequest = async (myUserId, friendId) => {
    if (isLoading.value) return false;

    try {
      isLoading.value = true;
      error.value = null;

      const relRes = await api.get("/trendy/friends/relations", {
        params: { userId: myUserId },
      });

      const relations = relRes.data || [];
      const request = relations.find(
        (r) =>
          r.trangThai === "CHO_DUYET" &&
          r.maNguoiGui === myUserId &&
          r.maNguoiNhan === friendId
      );

      if (request) {
        await api.post(`/trendy/friends/${request.maYeuCau}/reject`);
        friendState.value = "none";

        return true;
      } else {
        error.value = "Không tìm thấy lời mời để hủy";
        return false;
      }
    } catch (err) {
      console.error("Cancel request failed:", err);
      error.value = err.response?.data?.message || err.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Unfriend user - with guard to prevent double execution
   */
  const unfriend = async (myUserId, friendId) => {
    if (isLoading.value) {
      console.warn("⚠️ Unfriend already in progress, ignoring duplicate call");
      return false;
    }

    try {
      isLoading.value = true;
      error.value = null;

      await api.delete("/trendy/friends/unfriend", {
        params: { userId1: myUserId, userId2: friendId },
      });

      friendState.value = "none";

      return true;
    } catch (err) {
      console.error("Unfriend failed:", err);
      error.value = err.response?.data?.message || err.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Handle button click - route to correct action
   */
  const handleButtonClick = async (myUserId, friendId) => {
    if (friendState.value === "none") {
      // Send friend request
      const success = await sendRequest(myUserId, friendId);
      return { action: "send", success };
    } else if (friendState.value === "pending") {
      // Cancel friend request
      const success = await cancelRequest(myUserId, friendId);
      return { action: "cancel", success };
    } else if (friendState.value === "friend") {
      // Unfriend
      const success = await unfriend(myUserId, friendId);
      return { action: "unfriend", success };
    }
  };

  /**
   * Reset state
   */
  const reset = () => {
    friendState.value = "none";
    isLoading.value = false;
    error.value = null;
  };

  return {
    friendState,
    isLoading,
    error,
    buttonText,
    isButtonDisabled,
    loadFriendState,
    sendRequest,
    cancelRequest,
    unfriend,
    handleButtonClick,
    reset,
  };
};
