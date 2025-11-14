import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { storage } from "../utils/storage";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

let stompClient = null;

const createClient = () => {
  if (stompClient) return stompClient;

  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws-chat`),
    connectHeaders: {},
    debug: (msg) => console.debug("STOMP:", msg),
    reconnectDelay: 5000,
  });

  return stompClient;
};

const connect = ({ onConnect, onError } = {}) => {
  try {
    const client = createClient();
    const token = storage.getToken();
    if (token) client.connectHeaders = { Authorization: `Bearer ${token}` };

    client.onConnect = (frame) => {
      console.info("STOMP connected", frame);
      if (onConnect) onConnect(frame);
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame);
      if (onError) onError(frame);
      if (frame.headers?.message?.includes("Unauthorized")) {
        window.location.href = "/login";
      }
    };

    client.onWebSocketClose = () => {
      console.info("WebSocket closed");
    };

    client.activate();
    return client;
  } catch (e) {
    console.error("Failed to connect to WebSocket:", e);
    if (onError) onError(e);
    return null;
  }
};

const disconnect = () => {
  if (!stompClient) return;
  try {
    stompClient.deactivate();
  } catch (e) {
    console.warn("Error disconnecting STOMP:", e);
  }
  stompClient = null;
};

const isConnected = () => stompClient && stompClient.active;

const subscribe = (destination, callback, headers = {}) => {
  if (!stompClient || !stompClient.active) {
    console.warn("STOMP client not connected");
    return null;
  }
  return stompClient.subscribe(
    destination,
    (message) => {
      try {
        const body = message.body ? JSON.parse(message.body) : null;
        callback(body, message);
      } catch (e) {
        console.error("Failed to parse STOMP message:", e);
        callback(null, message);
      }
    },
    headers
  );
};

const unsubscribe = (subscription) => {
  try {
    if (subscription) subscription.unsubscribe();
  } catch (e) {
    console.warn("Failed to unsubscribe:", e);
  }
};

const publish = (destination, payload = {}, headers = {}) => {
  if (!stompClient || !stompClient.active) {
    console.error("STOMP client not connected");
    return;
  }
  try {
    stompClient.publish({
      destination,
      body: JSON.stringify(payload),
      headers,
    });
  } catch (e) {
    console.error("STOMP publish failed:", e);
  }
};

const subscribeToPrivate = (userId, cb) =>
  subscribe(`/topic/private.${userId}`, cb);

const subscribeToGroup = (maNhom, cb) =>
  subscribe(`/topic/group.${maNhom}`, cb);

const subscribeToNotification = (userId, cb) =>
  subscribe(`/topic/notification.${userId}`, cb);

const getClient = () => stompClient;

export default {
  connect,
  disconnect,
  isConnected,
  subscribe,
  unsubscribe,
  publish,
  subscribeToPrivate,
  subscribeToGroup,
  subscribeToNotification,
  getClient,
  get client() {
    return stompClient;
  },
};
