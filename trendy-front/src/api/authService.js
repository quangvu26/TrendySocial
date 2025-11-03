// src/api/authService.js
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

