/**
 * Centralized error handling utility
 * Handles API errors consistently across app
 */
export const useErrorHandler = () => {
  const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
    const status = error.response?.status;

    if (status === 401) {
      return "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại";
    }
    if (status === 403) {
      return "Bạn không có quyền thực hiện thao tác này";
    }
    if (status === 404) {
      return "Không tìm thấy dữ liệu";
    }
    if (status === 500) {
      return "Lỗi máy chủ. Vui lòng thử lại sau";
    }

    return error.response?.data?.message || error.message || defaultMessage;
  };

  const logError = (context, error) => {
    console.error(`❌ [${context}]`, error);
  };

  return { handleApiError, logError };
};
