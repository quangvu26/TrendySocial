import { ref, computed } from "vue";
import { storage } from "../utils/storage";

export const useMessageHiding = () => {
  const hiddenMessages = ref(new Set());

  // Load hidden messages from localStorage
  const loadHiddenMessages = (userId) => {
    try {
      const stored = storage.get(`hidden_messages_${userId}`);
      if (stored) {
        hiddenMessages.value = new Set(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load hidden messages:", e);
    }
  };

  // Hide message (persist to localStorage)
  const hideMessage = (messageId, userId) => {
    hiddenMessages.value.add(messageId);
    // Persist to localStorage
    storage.set(
      `hidden_messages_${userId}`,
      JSON.stringify(Array.from(hiddenMessages.value))
    );
  };

  // Check if message is hidden
  const isMessageHidden = (messageId) => {
    return hiddenMessages.value.has(messageId);
  };

  // Filter out hidden messages
  const filterVisibleMessages = (messages) => {
    return messages.filter((msg) => !isMessageHidden(msg.maTinNhan || msg.id));
  };

  return {
    hiddenMessages,
    loadHiddenMessages,
    hideMessage,
    isMessageHidden,
    filterVisibleMessages,
  };
};
