<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
      <div class="p-4 border-b flex items-center justify-between">
        <h3 class="font-semibold text-lg">Cài đặt</h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-900"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="p-4 space-y-3">
        <div class="space-y-2">
          <h4 class="font-medium text-sm text-gray-700">Tài khoản</h4>

          <button
            @click="openEditProfile"
            class="w-full flex items-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <i class="bi bi-person text-xl text-gray-600"></i>
            <span class="ml-3 flex-1 text-left"
              >Chỉnh sửa thông tin cá nhân</span
            >
            <i class="bi bi-chevron-right text-gray-400"></i>
          </button>

          <button
            @click="openBlockedUsersAndClose"
            class="w-full flex items-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <i class="bi bi-ban text-xl text-gray-600"></i>
            <span class="ml-3 flex-1 text-left">Danh sách chặn</span>
            <i class="bi bi-chevron-right text-gray-400"></i>
          </button>
        </div>
        <div class="border-t"></div>

        <button
          @click="$emit('logout')"
          class="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <i class="bi bi-box-arrow-right text-xl"></i>
          <span class="ml-3 flex-1 text-left font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  </div>

  <EditProfile
    v-if="showEditProfile"
    @close="showEditProfile = false"
    @updated="$emit('updated')"
  />
</template>

<script setup>
import { ref } from "vue";
import EditProfile from "./EditProfile.vue";

const emit = defineEmits(["close", "logout", "navigate", "show-blocked-users"]);
const showEditProfile = ref(false);
const isDarkMode = ref(localStorage.getItem("darkMode") === "true");

const openEditProfile = () => {
  showEditProfile.value = true;
};

const openBlockedUsersAndClose = () => {
  emit("show-blocked-users");
  setTimeout(() => {
    emit("close");
  }, 0);
};

</script>

<style scoped></style>
