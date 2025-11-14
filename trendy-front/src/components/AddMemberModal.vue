<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      @click.self="close"
    >
      <div
        class="bg-white rounded-lg shadow-lg w-96 max-h-[600px] flex flex-col"
      >
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="font-semibold text-lg">Thêm thành viên nhóm</h3>
          <button
            @click="close"
            class="text-gray-500 hover:text-gray-900 text-xl"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="p-3 border-b">
          <input
            v-model="searchQuery"
            placeholder="Tìm bạn bè..."
            class="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div class="flex-1 overflow-y-auto p-3">
          <div
            v-if="filteredFriends.length === 0"
            class="text-center text-gray-400 py-8"
          >
            Không có bạn bè nào
          </div>

          <div
            v-for="friend in filteredFriends"
            :key="friend.id"
            class="flex items-center p-2 hover:bg-gray-50 rounded mb-2 cursor-pointer"
            @click="toggleFriend(friend.id)"
          >
            <input
              type="checkbox"
              :checked="selectedFriends.includes(friend.id)"
              @change="toggleFriend(friend.id)"
              class="w-4 h-4 cursor-pointer"
            />

            <img
              :src="friend.avatar || '/images/Avatar/male_avatar.png'"
              class="w-10 h-10 rounded-full object-cover ml-3"
            />
            <div class="flex-1 ml-3 min-w-0">
              <div class="font-medium text-sm">
                {{ friend.name || friend.ten || friend.id }}
              </div>
              <div class="text-xs text-gray-500">@{{ friend.id }}</div>
            </div>

            <span
              v-if="isAlreadyMember(friend.id)"
              class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded"
            >
              Đã là thành viên
            </span>
          </div>
        </div>

        <div class="p-4 border-t flex justify-end space-x-2">
          <button
            @click="close"
            class="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            @click="addMembers"
            :disabled="selectedFriends.length === 0"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <i class="bi bi-plus-circle mr-1"></i>
            Thêm
            {{
              selectedFriends.length > 0 ? `(${selectedFriends.length})` : ""
            }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from "vue";
import api from "../api/api";

const props = defineProps({
  isOpen: Boolean,
  groupId: String,
  currentMembers: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close", "added"]);

const searchQuery = ref("");
const selectedFriends = ref([]);
const friendsList = ref([]);

// Filter friends based on search
const filteredFriends = computed(() => {
  return friendsList.value.filter((f) => {
    const query = searchQuery.value.toLowerCase();
    const name = (f.name || f.ten || "").toLowerCase();
    return f.id.toLowerCase().includes(query) || name.includes(query);
  });
});

// Check if friend is already member
const isAlreadyMember = (friendId) => {
  return props.currentMembers.some((m) => m.idUser === friendId);
};

// Toggle friend selection
const toggleFriend = (friendId) => {
  if (isAlreadyMember(friendId)) return; // Don't allow selecting already members

  const index = selectedFriends.value.indexOf(friendId);
  if (index > -1) {
    selectedFriends.value.splice(index, 1);
  } else {
    selectedFriends.value.push(friendId);
  }
};

// Load friends when modal opens
const loadFriends = async () => {
  try {
    // Try to get userId from multiple sources
    let userId = localStorage.getItem("userId");

    if (!userId) {
      // Fallback: get from storage utility
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      userId = user.id || user.email;
    }

    if (!userId) {
      console.error("❌ User ID not found in localStorage or storage");
      friendsList.value = [];
      return;
    }

    console.log("📥 Loading friends for userId:", userId);

    const res = await api.get("/trendy/friends/list", {
      params: { userId },
    });

    friendsList.value = res.data || [];
    console.log("✅ Loaded friends:", friendsList.value.length);
    console.log("📋 Friends data:", friendsList.value);
  } catch (error) {
    console.error("❌ Failed to load friends:", error);
    console.error("📝 Error response:", error.response?.data);
    friendsList.value = [];
  }
}; // Add selected members
const addMembers = async () => {
  if (selectedFriends.value.length === 0) {
    alert("Vui lòng chọn ít nhất 1 thành viên");
    return;
  }

  try {
    for (const friendId of selectedFriends.value) {
      await api.post(
        `/trendy/chat/group/${props.groupId}/add`,
        {},
        {
          params: { idUser: friendId },
        }
      );
      console.log("✅ Added member:", friendId);
    }

    alert(`Đã thêm ${selectedFriends.value.length} thành viên thành công!`);
    selectedFriends.value = [];
    searchQuery.value = "";
    emit("added");
    close();
  } catch (error) {
    console.error("Add members failed:", error);
    alert(
      "Thêm thành viên thất bại: " +
        (error.response?.data?.message || error.message)
    );
  }
};

// Close modal
const close = () => {
  selectedFriends.value = [];
  searchQuery.value = "";
  emit("close");
};

// Watch for modal open
import { watch } from "vue";
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      loadFriends();
    }
  }
);
</script>
