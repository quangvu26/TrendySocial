import api from "./api";

export const replyPrivateMessage = (payload) =>
  api.post("/trendy/chat/private/reply", payload);

export const replyGroupMessage = (maNhom, payload) =>
  api.post(`/trendy/chat/group/${maNhom}/reply`, payload);

export const pinMessage = (messageId) =>
  api.post(`/trendy/chat/private/pin/${messageId}`);

export const unpinMessage = (messageId) =>
  api.post(`/trendy/chat/private/unpin/${messageId}`);

export const pinGroupMessage = (messageId) =>
  api.post(`/trendy/chat/group/pin/${messageId}`);

export const unpinGroupMessage = (messageId) =>
  api.post(`/trendy/chat/group/unpin/${messageId}`);

export const reactToMessage = (messageId, reactionName) =>
  api.post("/trendy/chat/private/react", { messageId, reactionName });

export const reactToGroupMessage = (messageId, reactionName) =>
  api.post("/trendy/chat/group/react", { messageId, reactionName });

export const getMessageReactions = (messageId) =>
  api.get(`/trendy/chat/private/reactions/${messageId}`);

export const getGroupMessageReactions = (messageId) =>
  api.get(`/trendy/chat/group/reactions/${messageId}`);

export default {
  replyPrivateMessage,
  replyGroupMessage,
  pinMessage,
  unpinMessage,
  pinGroupMessage,
  unpinGroupMessage,
  reactToMessage,
  reactToGroupMessage,
  getMessageReactions,
  getGroupMessageReactions,
};
