<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
      <!-- Header -->
      <div class="p-4 border-b flex items-center justify-between">
        <h3 class="font-semibold text-lg">Cài đặt</h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-900"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-3">
        <!-- Account Settings -->
        <div class="space-y-2">
          <h4 class="font-medium text-sm text-gray-700">Tài khoản</h4>

          <button
            @click="$emit('navigate', 'profile')"
            class="w-full flex items-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <i class="bi bi-person text-xl text-gray-600"></i>
            <span class="ml-3 flex-1 text-left">Thông tin cá nhân</span>
            <i class="bi bi-chevron-right text-gray-400"></i>
          </button>

          <button
            class="w-full flex items-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <i class="bi bi-shield-lock text-xl text-gray-600"></i>
            <span class="ml-3 flex-1 text-left">Quyền riêng tư</span>
            <i class="bi bi-chevron-right text-gray-400"></i>
          </button>
        </div>

        <div class="border-t"></div>

        <!-- App Settings -->
        <div class="space-y-2">
          <h4 class="font-medium text-sm text-gray-700">Ứng dụng</h4>

          <button
            @click="$emit('navigate', 'blocked')"
            class="w-full flex items-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <i class="bi bi-shield-slash text-xl text-gray-600"></i>
            <span class="ml-3 flex-1 text-left">Người dùng đã chặn</span>
            <i class="bi bi-chevron-right text-gray-400"></i>
          </button>

          <button
            class="w-full flex items-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <i class="bi bi-palette text-xl text-gray-600"></i>
            <span class="ml-3 flex-1 text-left">Giao diện</span>
            <i class="bi bi-chevron-right text-gray-400"></i>
          </button>
        </div>
        <div class="border-t"></div>

        <!-- Logout -->
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
</template>

<script setup>
defineEmits(["close", "logout", "navigate"]);
</script>

<style scoped></style>
