import api from "./api";

export const register = (userData) =>
  api.post("/trendy/auth/register", userData);
export const login = (userData) => api.post("/trendy/auth/login", userData);
export const loginWithGoogle = (tokenId) =>
  api.post("/auth/oauth2", { tokenId });

export const sendVerificationCode = (email) =>
  api.post("/trendy/auth/send-verify-code", { email });
export const verifyEmailCode = (email, code) =>
  api.post("/trendy/auth/verify-code", { email, code });
export const checkEmail = (email) =>
  api.get(`/trendy/auth/check-email?email=${encodeURIComponent(email)}`);
export const checkId = (id) =>
  api.get(`/trendy/auth/check-id/${encodeURIComponent(id)}`);
export const resetPassword = (email, password) =>
  api.post(`/trendy/auth/reset-password`, { email, password });

export const forgotPassword = (email) =>
  api.post(`/trendy/auth/forgot-password`, { email });
