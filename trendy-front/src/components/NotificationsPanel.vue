<template>
  <div class="notifications-panel">
    <div class="panel-header">
      <h2>Thông báo</h2>
      <button
        v-if="notifications.length > 0"
        @click="clearAll"
        class="btn-clear"
      >
        Xóa hết
      </button>
    </div>

    <div class="notifications-list">
      <div v-if="notifications.length === 0" class="empty">
        Không có thông báo nào
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="notif in notifications"
          :key="notif.idThongBao"
          @click="clickNotification(notif)"
          class="notification-item"
        >
          <div class="notif-icon">
            <i :class="getNotificationIcon(notif.type)"></i>
          </div>

          <div class="notif-content">
            <p class="sender">
              <strong>{{
                notif.senderName || notif.maNguoiGui || "Hệ thống"
              }}</strong>
              <span class="action">{{
                getNotificationMessage(notif.type)
              }}</span>
            </p>
            <p class="message">{{ notif.noiDung }}</p>
            <p class="time">{{ formatDate(notif.ngayTao) }}</p>
          </div>

          <button
            @click.stop="deleteNotification(notif.idThongBao)"
            class="btn-delete"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import api from "../api/api";

const notifications = ref([]);
const currentUserId = ref(null);
let refreshInterval = null;

// Load notifications từ API
const loadNotifications = async () => {
  try {
    if (!currentUserId.value) return;

    const response = await api.get(
      `/trendy/notification/list?userId=${currentUserId.value}&limit=20`
    );
    notifications.value = response.data || [];
    console.log("✅ Loaded notifications:", notifications.value.length);
  } catch (error) {
    console.error("Failed to load notifications:", error);
  }
};

// Xoá notification
const deleteNotification = async (notifId) => {
  try {
    await api.delete(`/trendy/notification/${notifId}`);
    notifications.value = notifications.value.filter(
      (n) => n.idThongBao !== notifId
    );
    console.log("✅ Notification deleted:", notifId);
  } catch (error) {
    console.error("Failed to delete notification:", error);
  }
};

// Xoá tất cả
const clearAll = async () => {
  if (!confirm("Xóa tất cả thông báo?")) return;

  for (let notif of notifications.value) {
    try {
      await api.delete(`/trendy/notification/${notif.idThongBao}`);
    } catch (e) {
      console.warn("Failed to delete:", e);
    }
  }
  notifications.value = [];
};

// Click vào notification để navigate
const clickNotification = (notif) => {
  console.log("📍 Clicking notification:", notif);

  if (!notif.postId && !notif.idPost) {
    console.warn("⚠️ No post ID found in notification");
    return;
  }

  // Mark as read
  try {
    api.put(`/trendy/notification/${notif.idThongBao}/read`, {});
  } catch (e) {
    console.warn("Failed to mark as read:", e);
  }

  const postId = notif.postId || notif.idPost;
  console.log("🔗 Navigating to post:", postId);

  // Navigate to post detail
  window.location.href = `/post/${postId}`;
};

// Get notification icon
const getNotificationIcon = (type) => {
  const icons = {
    LIKE: "bi bi-heart-fill text-red-500",
    COMMENT: "bi bi-chat-dots text-blue-500",
    MENTION: "bi bi-at text-purple-500",
    REPLY: "bi bi-reply-fill text-green-500",
    THEM_VAO_NHOM: "bi bi-people-fill text-orange-500",
    TAO_NHOM: "bi bi-plus-circle text-blue-500",
    XOA_NHOM: "bi bi-dash-circle text-red-500",
    THANH_VIEN_ROI_NHOM: "bi bi-person-dash text-gray-500",
  };
  return icons[type] || "bi bi-bell";
};

// Get notification message
const getNotificationMessage = (type) => {
  const messages = {
    LIKE: "đã thích bài viết của bạn",
    COMMENT: "đã bình luận bài viết của bạn",
    MENTION: "đã tag bạn",
    REPLY: "đã trả lời bình luận của bạn",
    THEM_VAO_NHOM: "đã thêm bạn vào nhóm",
    TAO_NHOM: "đã tạo nhóm",
    XOA_NHOM: "đã xóa nhóm",
    THANH_VIEN_ROI_NHOM: "đã rời khỏi nhóm",
  };
  return messages[type] || "";
};

// Format date
const formatDate = (date) => {
  if (!date) return "";
  try {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (mins < 1) return "Vừa xong";
    if (mins < 60) return `${mins}p trước`;
    if (hours < 24) return `${hours}h trước`;
    if (days < 7) return `${days}d trước`;
    return d.toLocaleDateString("vi-VN");
  } catch (e) {
    return date;
  }
};

onMounted(() => {
  // Get current user ID
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  currentUserId.value = user.id;

  // Load notifications once on mount
  loadNotifications();

  // Setup auto-refresh every 5 seconds (more efficient than polling on every render)
  refreshInterval = setInterval(() => {
    loadNotifications();
  }, 5000);
});

onBeforeUnmount(() => {
  // Clear interval on unmount
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
});
</script>

<style scoped>
.notifications-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.panel-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.btn-clear {
  padding: 6px 12px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s;
}

.btn-clear:hover {
  background: #ff5252;
}

.notifications-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.empty {
  text-align: center;
  color: #999;
  padding: 30px 15px;
}

.space-y-2 {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 6px;
  background: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s;
}

.notification-item:hover {
  background: #f0f0f0;
  border-color: #ddd;
}

.notif-icon {
  font-size: 20px;
  min-width: 24px;
  text-align: center;
}

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-content .sender {
  margin: 0 0 4px 0;
  font-size: 13px;
  font-weight: 500;
}

.notif-content .message {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notif-content .time {
  margin: 0;
  font-size: 11px;
  color: #999;
}

.btn-delete {
  padding: 2px 6px;
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 16px;
  transition: color 0.3s;
}

.btn-delete:hover {
  color: #f44;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
