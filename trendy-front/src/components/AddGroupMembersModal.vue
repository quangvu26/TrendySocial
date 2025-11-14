<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Add Members to Group</h3>
        <button @click="closeModal" class="close-btn">✕</button>
      </div>

      <div class="modal-body">
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search friends..."
            class="search-input"
          />
        </div>

        <div class="friend-list">
          <div v-if="isLoading" class="empty-state">Loading friends...</div>

          <div v-else-if="filteredFriends.length === 0" class="empty-state">
            {{ searchQuery ? "No friends found" : "No friends available" }}
          </div>

          <div
            v-for="friend in filteredFriends"
            :key="friend.id"
            class="friend-item"
            @click="toggleFriend(friend)"
          >
            <input
              type="checkbox"
              :checked="selectedFriends.has(friend.id)"
              class="friend-checkbox"
            />
            <img
              :src="friend.avatar || '/images/Avatar/default-avatar.png'"
              class="friend-avatar"
            />
            <div class="friend-info">
              <div class="friend-name">{{ friend.name || friend.id }}</div>
              <div class="friend-id">@{{ friend.id }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="btn-cancel">Cancel</button>
        <button
          @click="addMembers"
          :disabled="selectedFriends.size === 0"
          class="btn-add"
        >
          Add {{ selectedFriends.size }} Member(s)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../api/api";

const props = defineProps({
  groupId: String,
  userId: String,
});

const emit = defineEmits(["close", "members-added"]);

const friends = ref([]);
const selectedFriends = ref(new Set());
const searchQuery = ref("");
const isLoading = ref(false);

const filteredFriends = computed(() => {
  if (!searchQuery.value) return friends.value;

  const query = searchQuery.value.toLowerCase();
  return friends.value.filter(
    (f) =>
      (f.name || f.id).toLowerCase().includes(query) ||
      f.id.toLowerCase().includes(query)
  );
});

onMounted(async () => {
  await loadFriends();
});

// Load friends list from backend
const loadFriends = async () => {
  isLoading.value = true;
  try {
    const response = await api.get("/trendy/friends/list", {
      params: { userId: props.userId },
    });
    friends.value = response.data || [];
    console.log("✅ Loaded", friends.value.length, "friends");
  } catch (error) {
    console.error("Failed to load friends:", error);
    alert("Cannot load friends list");
  } finally {
    isLoading.value = false;
  }
};

// Toggle friend selection
const toggleFriend = (friend) => {
  if (selectedFriends.value.has(friend.id)) {
    selectedFriends.value.delete(friend.id);
  } else {
    selectedFriends.value.add(friend.id);
  }
};

// Add selected members to group
const addMembers = async () => {
  if (selectedFriends.value.size === 0) return;

  try {
    const memberIds = Array.from(selectedFriends.value);

    // Call backend to add members
    await api.post(`/trendy/chat/group/${props.groupId}/add-members`, {
      memberIds,
    });

    console.log("✅ Members added successfully");
    emit("members-added", memberIds);
    closeModal();
  } catch (error) {
    console.error("Failed to add members:", error);
    alert(
      "Cannot add members: " + (error.response?.data?.message || error.message)
    );
  }
};

const closeModal = () => {
  emit("close");
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.search-container {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #ff5630;
  box-shadow: 0 0 0 2px rgba(255, 86, 48, 0.1);
}

.friend-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.friend-item:hover {
  background: #f5f5f5;
}

.friend-checkbox {
  margin-right: 10px;
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.friend-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  flex-shrink: 0;
}

.friend-info {
  flex: 1;
}

.friend-name {
  font-weight: 500;
  color: #333;
}

.friend-id {
  font-size: 12px;
  color: #999;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-add {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 14px;
}

.btn-cancel {
  background: #f0f0f0;
  color: #333;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-add {
  background: #ff5630;
  color: white;
}

.btn-add:hover:not(:disabled) {
  background: #ff4520;
  box-shadow: 0 2px 8px rgba(255, 86, 48, 0.3);
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
