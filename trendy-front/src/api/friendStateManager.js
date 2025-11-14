
import api from "./api";
class FriendStateManager {
  constructor() {
    this.friendStates = {}; 
    this.listeners = [];
  }
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }
  notifyChange(userId, newState) {
    this.listeners.forEach((callback) => {
      callback({ userId, state: newState });
    });
  }
  getState(userId) {
    return this.friendStates[userId] || "none";
  }
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

      return true;
    } catch (error) {
      console.error("❌ Failed to load friend states:", error);
      return false;
    }
  }
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
  clear() {
    this.friendStates = {};
  }
}

export default new FriendStateManager();
