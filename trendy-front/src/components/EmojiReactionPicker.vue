<template>
  <div class="emoji-picker-wrapper">
    <button
      @click.stop="toggleFullPicker"
      class="emoji-dots-btn"
      title="Add reaction (⋯)"
    >
      ⋯
    </button>

    <teleport to="body">
      <transition name="fade">
        <div
          v-if="showFullPicker"
          class="emoji-picker-overlay"
          @click="closeFullPicker"
        >
          <div class="emoji-picker-modal" @click.stop>
            <div class="emoji-modal-header">
              <h4>Choose Emoji</h4>
              <button @click="closeFullPicker" class="modal-close-btn">
                ✕
              </button>
            </div>

            <div class="emoji-search-box">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search emojis..."
                class="emoji-search-input"
              />
            </div>

            <div class="emoji-grid-container">
              <div v-if="filteredEmojis.length === 0" class="no-emojis">
                No emojis found
              </div>
              <button
                v-for="emoji in filteredEmojis"
                :key="emoji"
                @click="selectEmoji(emoji)"
                class="emoji-grid-item"
              >
                {{ emoji }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  messageId: String,
});

const emit = defineEmits(["react"]);

const showFullPicker = ref(false);
const searchQuery = ref("");

const quickEmojis = [
  "👍",
  "❤️",
  "😂",
  "😮",
  "😢",
  "😡",
  "👏",
  "🔥",
  "⭐",
  "😎",
  "🎉",
  "🙌",
];

const allEmojis = {
  smileys: [
    "😀",
    "😁",
    "😂",
    "😃",
    "😄",
    "😅",
    "😆",
    "😇",
    "😈",
    "😉",
    "😊",
    "😋",
    "😌",
    "😍",
    "😎",
    "😏",
  ],
  hand: ["👋", "👌", "✌️", "👍", "👎", "👏", "🙌", "👐", "🤝", "🤲"],
  heart: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎"],
  face: ["😢", "😭", "😤", "😠", "😡", "🤬", "😈", "👿", "💀", "☠️"],
  celebration: ["🎉", "🎊", "🎈", "🎁", "🎀", "✨", "⭐", "🌟", "💫", "🔥"],
};

const allEmojisFlat = computed(() => {
  return Object.values(allEmojis).flat();
});

const filteredEmojis = computed(() => {
  if (!searchQuery.value) return allEmojisFlat.value;
  const query = searchQuery.value.toLowerCase();
  const emojiNames = {
    "👍": "thumbs up like",
    "❤️": "heart love",
    "😂": "laugh funny",
    "😮": "surprised wow",
    "😢": "sad cry",
    "😡": "angry mad",
    "👏": "clap applause",
    "🔥": "fire hot",
    "⭐": "star",
    "😎": "cool",
    "🎉": "party celebration",
    "🙌": "hooray hands",
  };
  return allEmojisFlat.value.filter((emoji) => {
    const name = emojiNames[emoji] || "";
    return name.toLowerCase().includes(query);
  });
});

const toggleFullPicker = () => {
  showFullPicker.value = !showFullPicker.value;
  if (!showFullPicker.value) {
    searchQuery.value = "";
  }
};

const closeFullPicker = () => {
  showFullPicker.value = false;
  searchQuery.value = "";
};

const selectEmoji = (emoji) => {
  emit("react", emoji);
  closeFullPicker();
};

// Close on outside click
const handleClickOutside = (e) => {
  const wrapper = document.querySelector(".emoji-picker-wrapper");
  if (wrapper && !wrapper.contains(e.target)) {
    closeFullPicker();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.emoji-picker-wrapper {
  position: relative;
  display: inline-block;
}

.emoji-dots-btn {
  padding: 4px 8px;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s;
  color: #666;
}

.emoji-dots-btn:hover {
  background: #f0f0f0;
  border-color: #ff5630;
  color: #ff5630;
}

.emoji-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.emoji-picker-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 600px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.emoji-modal-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.emoji-modal-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 0;
  transition: color 0.2s;
}

.modal-close-btn:hover {
  color: #ff5630;
}

.emoji-search-box {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.emoji-search-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.emoji-search-input:focus {
  border-color: #ff5630;
  box-shadow: 0 0 0 2px rgba(255, 86, 48, 0.1);
}

.emoji-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 8px;
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.emoji-grid-item {
  font-size: 28px;
  padding: 8px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.emoji-grid-item:hover {
  background: #f5f5f5;
  border-color: #ff5630;
  transform: scale(1.2);
}

.no-emojis {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
