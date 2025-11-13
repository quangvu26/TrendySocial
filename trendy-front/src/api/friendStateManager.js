// File này KHÔNG SỬ DỤNG - logic đã merge vào useHeaderButtonState.js
// Giữ lại để reference nếu cần, nhưng đừng import
// Xóa file này sau

// filepath: f:\Du_An\TrendySocialApp\trendy-front\src\api\friendStateManager.js
import api from "./api";
import { storage } from "../utils/storage";

/**
 * Friend state manager - handles all friend-related operations
 * Maintains consistent state across the app
 */
class FriendStateManager {
  constructor() {
    this.friendStates = {}; // { userId: 'friend' | 'pending' | 'blocked' | 'none' }
    this.listeners = [];
  }

  /**
   * Subscribe to friend state changes
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  /**
   * Notify all listeners of state change
   */
  notifyChange(userId, newState) {
    this.listeners.forEach((callback) => {
      callback({ userId, state: newState });
    });
  }

  /**
   * Get friend state
   */
  getState(userId) {
    return this.friendStates[userId] || "none";
  }

  /**
   * Load all friend states for user
   */
  async loadStates(userId) {
    try {
      const res = await api.get("/trendy/friends/relations", {
        params: { userId },
      });

      const relations = res.data || [];
      this.friendStates = {};

      relations.forEach((r) => {
        const otherId = r.maNguoiGui === userId ? r.maNguoiNhan : r.maNguoiGui;
        if (r.trangThai === "XAC_NHAN") {
          this.friendStates[otherId] = "friend";
        } else if (r.trangThai === "CHO_DUYET") {
          this.friendStates[otherId] = "pending";
        }
      });

      console.log("✅ Friend states loaded:", this.friendStates);
      return true;
    } catch (error) {
      console.error("❌ Failed to load friend states:", error);
      return false;
    }
  }

  /**
   * Send friend request
   */
  async sendRequest(fromId, toId) {
    try {
      await api.post("/trendy/friends/request", { from: fromId, to: toId });
      this.friendStates[toId] = "pending";
      this.notifyChange(toId, "pending");
      return { success: true };
    } catch (error) {
      console.error("Send request failed:", error);
      return { success: false, error };
    }
  }

  /**
   * Cancel friend request
   */
  async cancelRequest(fromId, toId) {
    try {
      const relRes = await api.get("/trendy/friends/relations", {
        params: { userId: fromId },
      });
      const relations = relRes.data || [];
      const req = relations.find(
        (r) =>
          r.trangThai === "CHO_DUYET" &&
          ((r.maNguoiGui === fromId && r.maNguoiNhan === toId) ||
            (r.maNguoiGui === toId && r.maNguoiNhan === fromId))
      );

      if (req) {
        await api.post(`/trendy/friends/${req.maYeuCau}/reject`);
        this.friendStates[toId] = "none";
        this.notifyChange(toId, "none");
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Cancel request failed:", error);
      return { success: false, error };
    }
  }

  /**
   * Unfriend user
   */
  async unfriend(userId1, userId2) {
    try {
      await api.delete("/trendy/friends/unfriend", {
        params: { userId1, userId2 },
      });
      this.friendStates[userId2] = "none";
      this.notifyChange(userId2, "none");
      return { success: true };
    } catch (error) {
      console.error("Unfriend failed:", error);
      return { success: false, error };
    }
  }

  /**
   * Accept friend request
   */
  async acceptRequest(maYeuCau, userId) {
    try {
      await api.post(`/trendy/friends/${maYeuCau}/accept`);
      this.friendStates[userId] = "friend";
      this.notifyChange(userId, "friend");
      return { success: true };
    } catch (error) {
      console.error("Accept request failed:", error);
      return { success: false, error };
    }
  }

  /**
   * Clear all states
   */
  clear() {
    this.friendStates = {};
  }
}

export default new FriendStateManager();
