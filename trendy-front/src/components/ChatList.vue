<template>
  <div class="w-full h-full flex flex-col">
    <div class="px-3 py-2 sm:px-4 sm:py-3 border-b flex-shrink-0">
      <div class="flex items-center gap-2">
        <div class="relative flex-1 min-w-0">
          <i
            class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          ></i>
          <input
            v-model="search"
            placeholder="Tìm tên hoặc nhóm"
            class="w-full pl-8 pr-2 py-1.5 sm:py-2 rounded border text-sm"
          />
        </div>
        <button
          @click="showCreateGroup = true"
          class="flex-shrink-0 text-[#FF5630] hover:text-[#FF4520]"
        >
          <i class="bi bi-plus-circle text-xl"></i>
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto min-h-0">
      <ul class="w-full">
        <li
          v-for="chat in filteredChats"
          :key="chat.id"
          class="flex items-center px-2 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 cursor-pointer relative group border-b"
        >
          <div
            @click="selectChat(chat)"
            class="flex items-center flex-1 min-w-0"
          >
            <div class="relative flex-shrink-0">
              <img
                :src="avatarFor(chat)"
                class="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover cursor-pointer hover:opacity-80"
                :class="
                  chat.unreadCount > 0 ? 'border-2 border-orange-500' : ''
                "
                @click.stop="
                  chat.type === 'private' && goToUserProfile(chat.id)
                "
                :title="chat.type === 'private' ? 'Xem trang cá nhân' : ''"
              />
              <span
                v-if="chat.unreadCount > 0"
                class="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full border-2 border-white"
              ></span>
            </div>

            <div class="ml-2 sm:ml-3 flex-1 min-w-0">
              <div class="flex justify-between items-start gap-2">
                <div
                  class="truncate font-medium text-sm sm:text-base"
                  :class="
                    chat.unreadCount > 0 ? 'text-orange-600 font-bold' : ''
                  "
                >
                  {{ chat.name }}
                </div>
                <div class="text-xs text-gray-500 flex-shrink-0">
                  {{
                    chat.time
                      ? formatRelativeTime(chat.time)
                      : formatRelativeTime(
                          chat.ngayGui || chat.ngayTao || new Date()
                        )
                  }}
                </div>
              </div>
              <div
                class="text-xs sm:text-sm text-gray-500 truncate"
                :class="
                  chat.unreadCount > 0 ? 'font-semibold text-gray-900' : ''
                "
              >
                {{ chat.lastMessage || "Không có tin nhắn" }}
              </div>
            </div>
          </div>

          <div class="relative flex-shrink-0">
            <button
              @click.stop="toggleMenu(chat.id)"
              class="p-1 sm:p-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <i class="bi bi-three-dots text-lg sm:text-base"></i>
            </button>

            <div
              v-if="activeMenu === chat.id"
              @click.stop
              class="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg py-1 z-10 w-48"
            >
              <button
                @click="hideChat(chat)"
                class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm"
              >
                <i class="bi bi-eye-slash mr-2"></i>
                Ẩn cuộc trò chuyện
              </button>
              <button
                @click="blockUser(chat)"
                class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-red-600"
              >
                <i class="bi bi-shield-slash mr-2"></i>
                Chặn người dùng
              </button>
            </div>
          </div>
        </li>
      </ul>
      <div
        v-if="filteredChats.length === 0"
        class="p-4 text-center text-gray-500 text-sm"
      >
        Bạn chưa có cuộc trò chuyện nào
      </div>
    </div>

    <div v-if="showCreateGroup">
      <div
        class="fixed inset-0 bg-black bg-opacity-25 z-40"
        @click="showCreateGroup = false"
      ></div>

      <div
        class="fixed left-64 top-0 h-full w-[28rem] bg-white shadow-lg border-r z-50"
      >
        <div class="flex flex-col h-full">
          <div class="p-4 border-b">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-semibold">Tạo nhóm mới</h3>
              <button
                @click="showCreateGroup = false"
                class="text-gray-500 hover:text-gray-900"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="mb-4">
              <label class="block text-sm text-gray-700 mb-1">Tên nhóm</label>
              <input
                v-model="tenNhom"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#FF5630]"
                placeholder="Tên nhóm"
              />
            </div>

            <div class="relative">
              <input
                v-model="searchFriend"
                class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF5630]"
                placeholder="Tìm bạn bè..."
              />
              <i
                class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              ></i>
            </div>
          </div>

          <div class="flex-1 overflow-auto p-4">
            <div
              v-for="friend in filteredFriends"
              :key="friend.id"
              class="flex items-center p-2 hover:bg-gray-50 rounded-lg"
            >
              <input
                type="checkbox"
                :checked="selectedFriends.includes(friend.id)"
                @change="toggleFriend(friend)"
                class="mr-2"
              />
              <img
                :src="avatarFor(friend)"
                class="w-8 h-8 rounded-full object-cover"
              />
              <div class="ml-2">
                <div class="text-sm font-medium">{{ friend.name }}</div>
                <div class="text-xs text-gray-500">@{{ friend.id }}</div>
              </div>
            </div>
          </div>

          <div class="p-4 border-t">
            <div class="flex items-center justify-between mb-2">
              <div class="text-sm text-gray-500">
                {{ selectedFriends.length }} thành viên được chọn
              </div>
            </div>
            <button
              @click="createGroup"
              :disabled="!tenNhom || selectedFriends.length === 0"
              class="w-full px-4 py-2 bg-[#FF5630] text-white rounded-lg disabled:opacity-50 hover:bg-[#FF4520] transition-colors"
            >
              Tạo nhóm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import chatService from "../api/chatService";
import { storage } from "../utils/storage";
import { formatRelativeTime } from "../utils/timeFormat";

const props = defineProps({
  chats: { type: Array, default: () => [] },
  friends: { type: Array, default: () => [] },
});
const emit = defineEmits([
  "select",
  "group-created",
  "friend-request",
  "hide-chat",
  "block-user",
  "viewUserProfile",
]);

const search = ref("");
const showCreateGroup = ref(false);
const tenNhom = ref("");
const searchFriend = ref("");
const selectedFriends = ref([]);
const activeMenu = ref(null);

const toggleMenu = (chatId) => {
  if (activeMenu.value === chatId) {
    activeMenu.value = null;
  } else {
    activeMenu.value = chatId;
  }
};

const hideChat = (chat) => {
  activeMenu.value = null;
  if (confirm(`Ẩn cuộc trò chuyện với ${chat.name}?`)) {
    emit("hide-chat", chat.id);
  }
};

const blockUser = async (chat) => {
  activeMenu.value = null;
  if (
    confirm(`Chặn ${chat.name}? Bạn sẽ không nhận được tin nhắn từ người này.`)
  ) {
    emit("block-user", chat.id);
  }
};

// Close menu when clicking outside
onMounted(() => {
  document.addEventListener("click", () => {
    activeMenu.value = null;
  });
});

// Filtered chats based on search - sorted by latest message time
const filteredChats = computed(() => {
  // Filter out empty/invalid chats first
  const validChats = props.chats.filter((c) => c && c.id && c.name);

  // Apply search filter
  let result = validChats;
  if (search.value) {
    const q = search.value.toLowerCase();
    result = validChats.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.id || "").toLowerCase().includes(q)
    );
  }

  // Sort by latest message time (newest first)
  return result.sort((a, b) => {
    const timeA = new Date(a.time || 0).getTime();
    const timeB = new Date(b.time || 0).getTime();
    return timeB - timeA; // Descending order (newest first)
  });
});

// Filtered friends for group creation
const filteredFriends = computed(() => {
  if (!searchFriend.value) return props.friends;
  const search = searchFriend.value.toLowerCase();
  return props.friends.filter(
    (f) =>
      (f.name || "").toLowerCase().includes(search) ||
      (f.id || "").toLowerCase().includes(search)
  );
});

const avatarFor = (user) => {
  if (user?.avatar) return user.avatar;
  if (user?.gioiTinh === false || user?.gender === false)
    return "/images/Avatar/female_avatar.png";
  return "/images/Avatar/male_avatar.png";
};

const toggleFriend = (friend) => {
  const index = selectedFriends.value.indexOf(friend.id);
  if (index === -1) {
    selectedFriends.value.push(friend.id);
  } else {
    selectedFriends.value.splice(index, 1);
  }
};

const selectChat = (chat) => {
  // Ensure chat object has all required fields before emitting
  const chatData = {
    id: chat.type === "private" ? chat.id : chat.maNhom, // Use maNhom for groups!
    maNhom: chat.maNhom, // CRITICAL: Must pass for group subscription
    maNhomSolo: chat.maNhomSolo, // For WebSocket subscription in private chats
    name: chat.name,
    avatar: chat.avatar,
    gender: chat.gender,
    type: chat.type || "private",
  };

  console.log("Selecting chat:", chatData);
  emit("select", chatData);
};

const goToUserProfile = (userId) => {
  if (!userId) return;
  console.log("🔗 ChatList emitting viewUserProfile for:", userId);
  emit("viewUserProfile", userId);
};

const createGroup = async () => {
  if (!tenNhom.value) return alert("Vui lòng nhập tên nhóm");
  if (selectedFriends.value.length === 0)
    return alert("Vui lòng chọn ít nhất một thành viên");

  try {
    const current = storage.getUser();
    const userId = current?.id || current?.email;

    // Create group with name, creator, and members
    const createRes = await chatService.createGroup(
      tenNhom.value,
      userId,
      selectedFriends.value
    );
    const groupData = createRes.data;
    const groupId = groupData.maNhom || groupData.id;

    console.log("✅ Group created:", groupData);

    // Emit event with full group data
    emit("group-created", {
      id: groupId,
      maNhom: groupId,
      name: tenNhom.value,
      tenNhom: tenNhom.value,
      type: "group",
      members: [userId, ...selectedFriends.value],
    });

    // Reset and close panel
    const groupName = tenNhom.value;
    const memberCount = selectedFriends.value.length;
    tenNhom.value = "";
    searchFriend.value = "";
    selectedFriends.value = [];
    showCreateGroup.value = false;

    alert(`Đã tạo nhóm "${groupName}" với ${memberCount} thành viên`);
  } catch (e) {
    console.error("❌ Tạo nhóm thất bại", e);
    const errorMsg = e.response?.data?.error || e.response?.data || e.message;
    alert("Tạo nhóm thất bại: " + errorMsg);
  }
};
</script>

<style scoped></style>
