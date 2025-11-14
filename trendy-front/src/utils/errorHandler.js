/**
 * Extract error message từ error object
 * @param {Error} error - Error object từ API
 * @param {string} defaultMsg - Default message nếu không tìm được
 * @returns {string} Error message
 */
export const getErrorMessage = (error, defaultMsg = "Có lỗi xảy ra") => {
  if (!error) return defaultMsg;

  // API response error
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data) {
    return typeof error.response.data === "string"
      ? error.response.data
      : defaultMsg;
  }

  // Network error
  if (error.message) {
    return error.message;
  }

  return defaultMsg;
};

/**
 * Handle auth-specific errors với status code mapping
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const handleAuthError = (error) => {
  const status = error.response?.status;

  const errorMap = {
    400: "Thông tin không hợp lệ",
    401: "Email hoặc mật khẩu không chính xác",
    404: "Tài khoản không tồn tại",
    403: "Tài khoản đã bị khóa. Liên hệ quản trị viên",
    409: "Email hoặc ID đã tồn tại",
    422: "Dữ liệu nhập không hợp lệ",
    500: "Lỗi máy chủ. Vui lòng thử lại sau",
    503: "Máy chủ đang bảo trì. Vui lòng thử lại sau",
  };

  return errorMap[status] || getErrorMessage(error);
};

/**
 * Handle network/timeout errors
 * @param {Error} error
 * @returns {string}
 */
export const handleNetworkError = (error) => {
  if (!error.response) {
    return "Lỗi kết nối. Vui lòng kiểm tra internet";
  }
  return handleAuthError(error);
};
