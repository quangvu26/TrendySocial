<template>
  <div
    v-if="!postContent && !selectedFile"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-lg w-full max-w-md p-8 text-center">
      <h2 class="text-xl font-bold mb-6">Tạo bài đăng mới</h2>

      <div
        @drop.prevent="handleDrop"
        @dragover.prevent
        class="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-6 hover:border-[#FF5630] transition-colors cursor-pointer"
        @click="fileInput.click()"
      >
        <img
          src="/images/New/Image upload-bro.svg"
          alt="Upload"
          class="w-32 h-32 mx-auto mb-4 object-contain"
        />
        <p class="text-gray-600 text-sm mb-3">Kéo ảnh hoặc video vào đây</p>
      </div>

      <button
        @click="fileInput.click()"
        class="w-full px-4 py-2 bg-[#FF5630] text-white rounded-lg hover:bg-[#FF4520] transition-colors font-medium"
      >
        Chọn từ máy tính
      </button>

      <button
        @click="handleClose"
        class="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Hủy
      </button>

      <input
        ref="fileInput"
        type="file"
        accept="image/*,video/*"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>
  </div>

  <div
    v-else
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="handleClose"
  >
    <div
      class="bg-white rounded-lg w-full max-w-2xl max-h-96 overflow-hidden flex flex-col"
    >
      <div
        class="px-6 py-4 border-b flex items-center justify-between flex-shrink-0"
      >
        <h2 class="text-lg font-bold">Tạo bài đăng mới</h2>
        <button @click="handleClose" class="text-gray-500 hover:text-gray-900">
          <i class="bi bi-x-lg text-xl"></i>
        </button>
      </div>

      <div class="flex-1 overflow-auto flex">
        <div class="w-1/3 bg-gray-100 flex items-center justify-center">
          <img
            v-if="isImage"
            :src="previewUrl"
            class="w-full h-full object-cover"
          />
          <video
            v-else
            :src="previewUrl"
            class="w-full h-full object-cover"
          ></video>
        </div>

        <div class="flex-1 p-6 flex flex-col">
          <div class="flex items-center gap-3 mb-4 pb-4 border-b">
            <img
              :src="userAvatar"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p class="font-medium text-sm">
                {{ user?.name }}
              </p>
              <p class="text-xs text-gray-500">@{{ user?.id }}</p>
            </div>
          </div>

          <div class="flex-1 flex flex-col mb-4">
            <div class="relative">
              <textarea
                v-model="postContent"
                maxlength="2200"
                placeholder="Bạn đang nghĩ gì?"
                class="w-full p-3 pl-10 pr-12 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
              ></textarea>

              <button
                @click="showEmojiPicker = true"
                class="absolute bottom-2 left-2 p-1 hover:bg-gray-100 rounded"
                title="Thêm emoji"
              >
                <i class="bi bi-emoji-smile text-lg text-yellow-500"></i>
              </button>

              <span class="absolute bottom-2 right-2 text-xs text-gray-500">
                {{ postContent.length }}/2200
              </span>
            </div>
          </div>

          <div class="space-y-3 text-sm border-t pt-4">
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2">
                <i class="bi bi-eye text-lg"></i>
                <span>Ai có thể xem bài viết?</span>
              </label>
              <select
                v-model="postPrivacy"
                class="px-2 py-1 border rounded text-xs"
              >
                <option value="CONG_KHAI">Công khai</option>
                <option value="BAN_BE">Bạn bè</option>
                <option value="RIENG_TU">Một mình</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 border-t flex justify-end gap-3 flex-shrink-0">
        <button
          @click="handleClose"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
        >
          Hủy
        </button>
        <button
          @click="submitPost"
          :disabled="!postContent.trim()"
          class="px-6 py-2 bg-[#FF5630] text-white rounded-lg hover:bg-[#FF4520] disabled:opacity-50 text-sm font-medium transition-colors"
        >
          Đăng bài
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showEmojiPicker"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="showEmojiPicker = false"
  >
    <div class="bg-white rounded-lg shadow-lg w-96 max-h-96 flex flex-col">
      <div class="p-4 border-b flex items-center justify-between">
        <h3 class="font-semibold">Chọn emoji</h3>
        <button
          @click="showEmojiPicker = false"
          class="text-gray-500 hover:text-gray-900"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 grid grid-cols-8 gap-2">
        <button
          v-for="emoji in emojis"
          :key="emoji"
          @click="insertEmoji(emoji)"
          class="text-2xl hover:scale-125 transition-transform p-1 cursor-pointer hover:bg-gray-100 rounded"
        >
          {{ emoji }}
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showCancelConfirm"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="showCancelConfirm = false"
  >
    <div class="bg-white rounded-lg w-full max-w-sm p-6 text-center">
      <h3 class="text-lg font-bold mb-4">Bạn có muốn hủy bài viết?</h3>
      <p class="text-gray-600 text-sm mb-6">Bài viết chưa lưu sẽ bị xóa.</p>

      <div class="flex gap-3 justify-center">
        <button
          @click="showCancelConfirm = false"
          class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          Bỏ
        </button>
        <button
          @click="confirmCancel"
          class="px-6 py-2 bg-[#FF5630] text-white rounded-lg hover:bg-[#FF4520] font-medium"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storage } from "../utils/storage";
import api from "../api/api";

const emit = defineEmits(["close"]);

// State
const fileInput = ref(null);
const selectedFile = ref(null);
const previewUrl = ref("");
const isImage = ref(true);
const postContent = ref("");
const postPrivacy = ref("CONG_KHAI");
const hideComments = ref(false);
const hideLikes = ref(false);
const hideViews = ref(false);
const showEmojiPicker = ref(false);
const showCancelConfirm = ref(false);

const user = ref(null);

// Load user from API
const loadUser = async () => {
  try {
    const storedUser = storage.getUser();
    const userId = storedUser?.id_user || storedUser?.idUser || storedUser?.id;

    if (!userId) {
      console.error("❌ No userId found");
      return;
    }

    const token = localStorage.getItem("token");
    const response = await api.get(`/trendy/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data) {
      user.value = {
        id: response.data.id_user || response.data.idUser || response.data.id,
        name: response.data.name || response.data.ten || "Người dùng",
        avatar: response.data.avatar,
        gioiTinh: response.data.gioi_tinh || response.data.gioiTinh,
      };
    }
  } catch (error) {
    console.error("❌ Failed:", error);
    const storedUser = storage.getUser();
    user.value = {
      id: storedUser?.id_user || storedUser?.idUser || storedUser?.id,
      name: storedUser?.name || storedUser?.ten || "Người dùng",
      avatar: storedUser?.avatar,
    };
  }
};

onMounted(() => {
  loadUser();
});

const emojis = [
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
  "😐",
  "😑",
  "😒",
  "😓",
  "😔",
  "😕",
  "😖",
  "😗",
  "😘",
  "😙",
  "😚",
  "😛",
  "😜",
  "😝",
  "😞",
  "😟",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "👍",
  "👎",
  "👌",
  "✌️",
  "🤞",
  "🙏",
  "🎉",
  "🎊",
  "🎈",
  "🎁",
  "⭐",
  "🔥",
  "💯",
];

const userAvatar = computed(() => {
  if (!user.value) return "/images/Avatar/male_avatar.png";
  if (user.value.avatar) return user.value.avatar;
  if (user.value.gioiTinh === false) return "/images/Avatar/female_avatar.png";
  return "/images/Avatar/male_avatar.png";
});

const handleFileSelect = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    processFile(files[0]);
  }
};

const handleDrop = (event) => {
  const files = event.dataTransfer.files;
  if (files && files.length > 0) {
    processFile(files[0]);
  }
};

const processFile = (file) => {
  selectedFile.value = file;
  isImage.value = file.type.startsWith("image/");
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const insertEmoji = (emoji) => {
  postContent.value += emoji;
  showEmojiPicker.value = false;
};

const handleClose = () => {
  if (postContent.value.trim() || selectedFile.value) {
    showCancelConfirm.value = true;
  } else {
    emit("close");
  }
};

const confirmCancel = () => {
  postContent.value = "";
  selectedFile.value = null;
  previewUrl.value = "";
  showCancelConfirm.value = false;
  emit("close");
};

const submitPost = async () => {
  if (!postContent.value.trim()) {
    alert("Vui lòng nhập nội dung");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("noiDung", postContent.value);
    formData.append("privacy", postPrivacy.value);
    formData.append("hideComments", hideComments.value);
    formData.append("hideLikes", hideLikes.value);
    formData.append("hideViews", hideViews.value);

    if (selectedFile.value) {
      formData.append("file", selectedFile.value);
    }

    const token = localStorage.getItem("token");
    await api.post("/trendy/posts/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Bài viết đã được đăng!");
    confirmCancel();
    window.dispatchEvent(new CustomEvent("post-created"));
  } catch (error) {
    console.error("Error:", error);
    alert("Không thể đăng bài viết");
  }
};
</script>

<style scoped>
/* Toggle switch styles handled by Tailwind */
</style>
