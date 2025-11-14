<template>
  <div class="absolute left-20 top-0 h-full w-80 bg-white shadow-lg border-r">
    <div class="flex flex-col h-full">
      <div class="p-4 border-b">
        <h3 class="font-semibold mb-4">Tìm bạn</h3>
        <div class="relative">
          <input
            v-model="query"
            @keyup.enter="search"
            placeholder="Nhập ID người dùng"
            class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF5630]"
          />
          <i
            class="bi bi-searhch absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          ></i>
        </div>
      </div>

      <div class="flex-1 overflow-auto p-4">
        <div v-if="loading" class="flex items-center justify-center py-4">
          <div
            class="animate-spin rounded-full h-6 w-6 border-2 border-[#FF5630] border-t-transparent"
          ></div>
        </div>

        <div v-if="error" class="text-sm text-red-600 mb-4">{{ error }}</div>

        <div v-if="found" class="bg-white rounded-lg border p-4 mb-4">
          <div class="flex items-center">
            <img
              :src="avatarFor(found)"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div class="ml-3 flex-1">
              <div class="font-medium">{{ found.name || found.id }}</div>
              <div class="text-sm text-gray-500">@{{ found.id }}</div>
            </div>
          </div>

          <div class="mt-3">
            <textarea
              v-model="requestMessage"
              placeholder="Gửi kèm lời nhắn (tuỳ chọn)"
              class="w-full p-2 border rounded-lg text-sm focus:outline-none focus:border-[#FF5630]"
              rows="2"
            >
            </textarea>
          </div>

          <div class="mt-4 flex space-x-2">
            <button
              @click="startChat"
              class="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-[#FF5630] hover:border-[#FF5630] hover:text-white transition duration-200"
            >
              <i class="bi bi-chat-text mr-2"></i>
              Nhắn tin
            </button>

            <button
              @click="addFriend"
              :disabled="requestSent"
              :class="{
                'bg-[#FF5630] text-white hover:bg-white hover:text-[#FF5630] hover:border-[#FF5630]':
                  !requestSent,
                'bg-gray-100 text-gray-400': requestSent,
              }"
              class="flex items-center px-3 py-1.5 rounded-lg border border-transparent transition duration-200"
            >
              <i class="bi bi-person-plus mr-2"></i>
              {{ requestSent ? "Đã gửi lời mời" : "Kết bạn" }}
            </button>
          </div>
        </div>

        <div v-else-if="searched" class="text-center text-gray-500 py-4">
          Không tìm thấy người dùng với ID này
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { checkId } from "../api/authService";
import api from "../api/api";
import { storage } from "../utils/storage";

const emit = defineEmits(["close", "start-chat", "friend-added"]);

const query = ref("");
const loading = ref(false);
const error = ref("");
const found = ref(null);
const searched = ref(false);
const requestSent = ref(false);
const requestMessage = ref("");

const avatarFor = (u) => {
  if (u?.avatar) return u.avatar;
  if (u?.gioiTinh === false) return "/images/Avatar/female_avatar.png";
  return "/images/Avatar/male_avatar.png";
};

const clear = () => {
  query.value = "";
  found.value = null;
  error.value = "";
  searched.value = false;
  requestSent.value = false;
  requestMessage.value = "";
};

const search = async () => {
  error.value = "";
  found.value = null;
  searched.value = false;
  requestSent.value = false;
  requestMessage.value = "";

  if (!query.value) {
    error.value = "Vui lòng nhập ID";
    return;
  }

  loading.value = true;
  try {
    const res = await checkId(query.value);
    const exists = res?.data?.exists;
    searched.value = true;

    if (exists) {
      try {
        // Try to get full user profile
        const userRes = await api.get(
          `/trendy/user/${encodeURIComponent(query.value)}`
        );
        found.value = userRes.data;
      } catch (e) {
        // Fallback to basic info if profile fetch fails
        found.value = {
          id: query.value,
          name: query.value,
          avatar: null,
          gioiTinh: null,
        };
      }
    } else {
      found.value = null;
    }
  } catch (e) {
    console.error("Search error", e);
    error.value = "Lỗi khi tìm kiếm. Vui lòng thử lại";
  } finally {
    loading.value = false;
  }
};

const addFriend = async () => {
  if (!found.value) return;
  requestSent.value = true;

  try {
    // Get current user info
    const current = storage.getUser();
    const from = current?.id || current?.email;

    if (!from) {
      error.value = "Vui lòng đăng nhập trước khi gửi lời mời";
      requestSent.value = false;
      return;
    }

    // Send friend request
    await api.post("/trendy/friends/request", {
      from,
      to: found.value.id,
      message: requestMessage.value?.trim() || "",
    });

    emit("friend-added", { id: found.value.id });
  } catch (e) {
    console.error("Add friend failed", e);
    error.value = e.response?.data || "Gửi lời mời thất bại";
    requestSent.value = false;
  }
};

const startChat = () => {
  if (!found.value) return;
  emit("start-chat", {
    id: found.value.id,
    name: found.value.name || found.value.id,
    avatar: found.value.avatar,
  });
  emit("close");
};
</script>

<style scoped></style>
