import api from "./api";
import { storage } from "../utils/storage";

class NotificationService {
  /**
   * Create new message notification
   */
  async createMessageNotification(fromUserId, fromUserName, toUserId) {
    try {
      const notification = {
        idNguoiNhan: toUserId,
        loaiThongBao: "TIN_NHAN",
        noiDung: `${fromUserName} mới gửi tin nhắn cho bạn`,
        lienKet: `/chat/${fromUserId}`,
        trangThai: false,
      };

      await api.post("/trendy/notification", notification);
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  }

  /**
   * Get all notifications for user
   */
  async getNotifications(userId) {
    try {
      const response = await api.get(
        `/trendy/notification/list?userId=${userId}`
      );
      return response.data || [];
    } catch (error) {
      console.error("Failed to get notifications:", error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    try {
      await api.put(`/trendy/notification/${notificationId}/read`);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId) {
    try {
      const response = await api.get(
        `/trendy/notification/unread-count?userId=${userId}`
      );
      return response.data?.count || 0;
    } catch (error) {
      console.error("Failed to get unread count:", error);
      return 0;
    }
  }
}

export default new NotificationService();
