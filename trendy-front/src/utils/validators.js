export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email && emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validatePasswordMatch = (password, confirm) => {
  return password === confirm && password.length > 0;
};

export const validateId = (id) => {
  return id && id.trim().length > 0;
};

export const validateName = (name) => {
  return name && name.trim().length > 0;
};

export const validateDate = (date) => {
  return date && date.trim().length > 0;
};

export const validateBirthDate = (date) => {
  if (!date) return false;
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age >= 13 && age <= 120; // Kiểm tra tuổi hợp lệ
};
