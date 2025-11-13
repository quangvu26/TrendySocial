<template>
  <div class="emoji-picker-container bg-white rounded-lg shadow-lg">
    <div class="emoji-search p-2 border-b">
      <input
        v-model="search"
        placeholder="Tìm emoji..."
        class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-orange-500"
      />
    </div>

    <div class="emoji-categories flex gap-1 p-2 border-b overflow-x-auto">
      <button
        v-for="cat in categories"
        :key="cat.name"
        @click="selectedCategory = cat.name"
        :class="selectedCategory === cat.name ? 'bg-orange-100' : ''"
        class="p-2 hover:bg-gray-100 rounded text-xl flex-shrink-0"
        :title="cat.label"
      >
        {{ cat.icon }}
      </button>
    </div>

    <div class="emoji-grid p-2">
      <button
        v-for="emoji in filteredEmojis"
        :key="emoji.emoji"
        @click="selectEmoji(emoji)"
        class="emoji-item text-2xl hover:bg-gray-100 rounded p-2 transition-colors"
        :title="emoji.name"
      >
        {{ emoji.emoji }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const emit = defineEmits(["select"]);

const search = ref("");
const selectedCategory = ref("smileys");
const emojis = ref([]);

const categories = [
  { name: "smileys", icon: "😀", label: "Cảm xúc" },
  { name: "people", icon: "👋", label: "Con người" },
  { name: "animals", icon: "🐶", label: "Động vật" },
  { name: "food", icon: "🍕", label: "Đồ ăn" },
  { name: "travel", icon: "✈️", label: "Du lịch" },
  { name: "activities", icon: "⚽", label: "Hoạt động" },
  { name: "objects", icon: "💡", label: "Đồ vật" },
  { name: "symbols", icon: "❤️", label: "Ký hiệu" },
];

const filteredEmojis = computed(() => {
  let result = emojis.value;

  if (selectedCategory.value) {
    result = result.filter((e) => e.category === selectedCategory.value);
  }

  if (search.value) {
    const query = search.value.toLowerCase();
    result = result.filter(
      (e) =>
        e.name.toLowerCase().includes(query) ||
        e.keywords?.some((k) => k.toLowerCase().includes(query))
    );
  }

  return result.slice(0, 100);
});

const selectEmoji = (emoji) => {
  emit("select", emoji.emoji);
};

onMounted(async () => {
  try {
    console.log("📥 Fetching emojis from API...");
    const res = await axios.get("https://emojihub.yurace.pro/api/all");
    console.log("✅ Loaded emojis:", res.data.length);

    emojis.value = res.data.slice(0, 300).map((item) => ({
      emoji: item.emoji || item.unicode || "😀",
      name: item.name || "emoji",
      category: item.category || "symbols",
      keywords: item.keywords || [],
    }));

    console.log("✅ Emojis formatted:", emojis.value.length);
  } catch (error) {
    console.error("Failed to fetch emojis:", error);
  }
});
</script>

<style scoped>
.emoji-picker-container {
  width: 320px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

.emoji-categories {
  white-space: nowrap;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  overflow-y: auto;
  flex: 1;
  max-height: 280px;
}

.emoji-item {
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-item:hover {
  transform: scale(1.2);
}
</style>
