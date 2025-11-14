<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
      <div class="p-4 border-b flex items-center justify-between">
        <h3 class="font-semibold text-lg">Người dùng đã chặn</h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-900"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="p-4">
        <div v-if="loading" class="flex items-center justify-center py-8">
          <i class="bi bi-arrow-repeat animate-spin mr-2"></i>
          Đang tải...
        </div>

        <div
          v-else-if="blockedUsers.length === 0"
          class="text-center py-8 text-gray-500"
        >
          <i class="bi bi-shield-slash text-4xl mb-2"></i>
          <p>Bạn chưa chặn ai</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="user in blockedUsers"
            :key="user.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <img
                :src="user.avatar || '/images/Avatar/male_avatar.png'"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div class="font-medium">{{ user.name || user.id }}</div>
                <div class="text-xs text-gray-500">
                  Đã chặn {{ formatDate(user.blockedAt) }}
                </div>
              </div>
            </div>

            <button
              @click="$emit('unblock', user.id)"
              class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Bỏ chặn
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/api";
import { storage } from "../utils/storage";

defineEmits(["unblock"]);

const loading = ref(true);
const blockedUsers = ref([]);

const loadBlockedUsers = async () => {
  loading.value = true;
  try {
    const user = storage.getUser();
    if (!user?.id) return;

    const response = await api.get(`/trendy/block/list?userId=${user.id}`);
    blockedUsers.value = response.data || [];
  } catch (error) {
    console.error("Failed to load blocked users:", error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (date) => {
  if (!date) return "";
  try {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "hôm nay";
    if (diffDays === 1) return "hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return d.toLocaleDateString("vi-VN");
  } catch (e) {
    return "";
  }
};

onMounted(() => {
  loadBlockedUsers();
});

defineExpose({ loadBlockedUsers });
</script>
