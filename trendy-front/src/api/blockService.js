import api from "./api";

export const blockUser = (blockerId, blockedId) =>
  api.post("/trendy/block", { blockerId, blockedId });

export const unblockUser = (blockerId, blockedId) =>
  api.delete(`/trendy/block/${blockedId}`, {
    params: { blockerId },
  });

export const getBlockedUsers = (userId) =>
  api.get("/trendy/block/list", { params: { userId } });

export const checkIfBlocked = (blockerId, blockedId) =>
  api.get("/trendy/block/check", {
    params: { blockerId, blockedId },
  });

export default {
  blockUser,
  unblockUser,
  getBlockedUsers,
  checkIfBlocked,
};
