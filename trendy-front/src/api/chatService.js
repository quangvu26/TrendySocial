import api from "./api";

export const sendPrivate = (payload) =>
  api.post("/trendy/chat/private/send", payload);

export const getPrivateHistory = (userA, userB) =>
  api.get("/trendy/chat/private/history", { params: { userA, userB } });

export const sendGroup = (maNhom, payload) =>
  api.post(`/trendy/chat/group/${maNhom}/send`, payload);

export const getGroupHistory = (maNhom) =>
  api.get(`/trendy/chat/group/${maNhom}/history`);

export const createGroup = (tenNhom, userId, memberIds = []) =>
  api.post("/trendy/chat/group/create", null, {
    params: { tenNhom, userId, memberIds: memberIds.join(",") },
  });

export const addMemberToGroup = (maNhom, idUser) =>
  api.post(`/trendy/chat/group/${maNhom}/add`, null, {
    params: { idUser },
  });

export default {
  sendPrivate,
  getPrivateHistory,
  sendGroup,
  getGroupHistory,
  createGroup,
  addMemberToGroup,
};
