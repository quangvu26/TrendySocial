import { checkEmail, checkId } from "../api/authService";
import { validateEmail } from "./validators";

/**
 * Check if email exists
 * @param {string} email
 * @returns {object} { exists: boolean, error: string|null }
 */
export const checkEmailExists = async (email) => {
  if (!email || !validateEmail(email)) {
    return { exists: false, error: null };
  }

  try {
    const res = await checkEmail(email);
    return {
      exists: res.data.exists || false,
      error: null,
    };
  } catch (err) {
    console.error("Email check error:", err);
    return {
      exists: false,
      error: "Không thể kiểm tra email. Vui lòng thử lại",
    };
  }
};

/**
 * Check if ID exists
 * @param {string} id
 * @returns {object} { exists: boolean, error: string|null }
 */
export const checkIdExists = async (id) => {
  if (!id || id.trim().length === 0) {
    return { exists: false, error: null };
  }

  try {
    const res = await checkId(id);
    return {
      exists: res.data.exists || false,
      error: null,
    };
  } catch (err) {
    console.error("ID check error:", err);
    return {
      exists: false,
      error: "Không thể kiểm tra ID. Vui lòng thử lại",
    };
  }
};

/**
 * Check both email and ID simultaneously
 * @param {string} email
 * @param {string} id
 * @returns {object} { emailExists, idExists, errors }
 */
export const checkBothUnique = async (email, id) => {
  try {
    const [emailRes, idRes] = await Promise.all([
      checkEmailExists(email),
      checkIdExists(id),
    ]);

    return {
      emailExists: emailRes.exists,
      idExists: idRes.exists,
      errors: {
        email: emailRes.error,
        id: idRes.error,
      },
    };
  } catch (err) {
    console.error("Uniqueness check error:", err);
    return {
      emailExists: false,
      idExists: false,
      errors: {
        email: "Lỗi kiểm tra email",
        id: "Lỗi kiểm tra ID",
      },
    };
  }
};
