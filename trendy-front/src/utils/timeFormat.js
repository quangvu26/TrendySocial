/**
 * Format timestamp to relative time
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} - Relative time string
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp) return "";

  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
      return "Mới đây";
    } else if (diffMin < 60) {
      return `${diffMin} phút trước`;
    } else if (diffHour < 24) {
      return `${diffHour} giờ trước`;
    } else if (diffDay < 7) {
      return `${diffDay} ngày trước`;
    } else {
      // Show actual date for older messages
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  } catch (e) {
    return "";
  }
}

/**
 * Format timestamp to time string (HH:MM)
 * @param {string|Date} timestamp
 * @returns {string}
 */
export function formatTime(timestamp) {
  if (!timestamp) return "";

  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "";
  }
}
