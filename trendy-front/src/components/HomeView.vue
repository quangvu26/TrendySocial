<template>
  <div class="relative w-full h-screen bg-gray-50 overflow-hidden">
    <div class="flex h-full relative">
      <aside
        class="w-20 md:w-64 bg-white border-r h-full flex flex-col items-center md:items-stretch flex-shrink-0"
      >
        <div
          class="p-4 flex items-center justify-center md:justify-start cursor-pointer"
        >
          <div class="relative w-10 h-10">
            <div class="absolute inset-0 bg-[#FF5630] rounded-full"></div>
            <img
              src="/images/Logo/Logo_white_nobackground.png"
              alt="Loopa Logo"
              class="relative w-full h-full p-1 object-contain"
            />
          </div>
          <span class="hidden md:inline ml-3 font-bold text-[#FF5630]"
            >LOOPA</span
          >
        </div>

        <nav class="flex-1 w-full px-2">
          <ul class="space-y-2">
            <li>
              <button
                @click="onNavigate('chat')"
                :class="{ 'text-[#FF5630]': activePanel === 'chat' }"
                class="w-full flex items-center px-3 py-2 rounded hover:bg-gray-100"
              >
                <i class="bi bi-chat-left-text text-xl"></i>
                <span class="hidden md:inline ml-3">Đoạn chat</span>
              </button>
            </li>
            <li>
              <button
                @click="onNavigate('posts')"
                class="w-full flex items-center px-3 py-2 rounded hover:bg-gray-100 text-gray-600 hover:text-[#FF5630]"
              >
                <i class="bi bi-plus-circle text-xl"></i>
                <span class="hidden md:inline ml-3">Tạo bài viết</span>
              </button>
            </li>
            <li>
              <button
                @click="onNavigate('friends')"
                :class="{ 'text-[#FF5630]': activePanel === 'friends' }"
                class="w-full flex items-center px-3 py-2 rounded hover:bg-gray-100 relative"
              >
                <i class="bi bi-people text-xl"></i>
                <span class="hidden md:inline ml-3">Bạn bè</span>
              </button>
            </li>
            <li>
              <button
                @click="onNavigate('notifications')"
                :class="{ 'text-[#FF5630]': activePanel === 'notifications' }"
                class="w-full flex items-center px-3 py-2 rounded hover:bg-gray-100 relative notifications-btn"
              >
                <i class="bi bi-bell text-xl"></i>
                <span class="hidden md:inline ml-3">Thông báo</span>
                <span
                  v-if="notificationsBadgeCount > 0"
                  class="absolute right-3 top-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium text-white bg-red-600 rounded badge"
                >
                  {{ notificationsBadgeCount }}
                </span>
              </button>
            </li>
          </ul>
        </nav>

        <nav class="p-4 w-full px-2">
          <ul class="space-y-2">
            <li>
              <button
                @click="onNavigate('profile')"
                :class="{ 'text-[#FF5630]': activePanel === 'profile' }"
                class="w-full flex items-center px-3 py-2 rounded hover:bg-gray-100"
              >
                <i class="bi bi-person text-xl"></i>
                <span class="hidden md:inline ml-3">Trang cá nhân</span>
              </button>
            </li>
            <li>
              <button
                @click="openSettings"
                class="w-full flex items-center px-3 py-2 rounded hover:bg-gray-100"
              >
                <i class="bi bi-gear text-xl"></i>
                <span class="hidden md:inline ml-3">Cài đặt</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div class="flex-1 flex relative">
        <div
          v-if="!showProfileFullPage"
          :class="showChatOnMobile ? 'hidden sm:flex' : 'flex'"
          class="w-full sm:w-72 md:w-200 border-r flex flex-col absolute sm:static left-0 top-0 bottom-0 right-0 z-20 sm:z-0 bg-white"
        >
          <div class="p-3 flex-shrink-0">
            <div class="font-semibold text-sm sm:text-base">Đoạn chat</div>
          </div>
          <div class="flex-1 min-h-0 overflow-hidden">
            <ChatList
              :chats="chats"
              :friends="friends"
              @select="onSelectChat"
              @group-created="onGroupCreated"
              @friend-request="sendFriendRequest"
              @hide-chat="handleHideChat"
              @block-user="handleBlockUser"
              @leave-group="handleLeaveGroup"
              @viewUserProfile="handleViewUserProfile"
            />
          </div>
        </div>

        <div
          v-if="!showProfileFullPage"
          :class="showChatOnMobile ? 'flex' : 'hidden sm:flex'"
          class="flex-1 flex-col z-0 absolute sm:static inset-0 sm:inset-auto bg-white"
        >
          <Suspense>
            <template #default>
              <ChatWindow
                v-if="user"
                :chat="selectedChat"
                :userId="user?.id || user?.email"
                :connectionState="chatConnectionState"
                @sent="onSent"
                @message-received="onMessageReceived"
                @error="chatError = $event"
                @hide-chat="handleHideChat"
                @block-user="handleBlockUser"
                @unfriend="handleUnfriend"
                @back-to-list="backToChatList"
                @viewUserProfile="handleViewUserProfile"
              />
            </template>
            <template #fallback>
              <div
                class="flex-1 flex items-center justify-center text-gray-500"
              >
                <i class="bi bi-arrow-repeat animate-spin mr-2"></i>
                Đang tải...
              </div>
            </template>
          </Suspense>

          <div
            v-if="chatConnectionState === 'connecting'"
            class="absolute top-0 left-0 right-0 bg-yellow-100 text-yellow-700 px-4 py-2 text-sm"
          >
            <i class="bi bi-arrow-repeat animate-spin mr-1"></i>
            Đang kết nối lại...
          </div>

          <div
            v-if="chatError"
            class="absolute bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg"
          >
            <div class="flex items-center">
              <i class="bi bi-exclamation-triangle-fill mr-2"></i>
              <p class="text-sm">
                {{ chatError.message || "Đã xảy ra lỗi. Vui lòng thử lại." }}
              </p>
              <button
                @click="chatError = null"
                class="ml-3 text-red-500 hover:text-red-700"
              >
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="
          showFriendsPanel ||
          showPostsPanel ||
          showProfilePanel ||
          showFriendSearch ||
          showBlockedPanel
        "
        class="absolute left-64 top-0 bottom-0 bg-white w-[28rem] shadow-lg flex flex-col overflow-hidden"
        :style="{ zIndex: panelZIndex.sidePanel }"
      >
        <div class="p-4 border-b">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">
              {{
                showFriendSearch
                  ? "Tìm kiếm bạn bè"
                  : showBlockedPanel
                  ? "Người dùng đã chặn"
                  : getPanelTitle()
              }}
            </h3>
            <button
              @click.stop="closeAllPanels"
              class="text-gray-500 hover:text-gray-900"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-auto">
          <BlockedUsersPanel
            v-if="showBlockedPanel"
            @unblock="handleUnblockUser"
          />

          <div v-if="showFriendSearch" class="p-4">
            <div class="mb-4">
              <div class="relative">
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Nhập tên hoặc ID người dùng..."
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  @input="searchUsers"
                />
                <i
                  class="bi bi-search absolute right-3 top-2.5 text-gray-400"
                ></i>
              </div>
            </div>

            <div class="space-y-4">
              <div
                v-if="searchQuery && searchResults.length === 0"
                class="text-center text-gray-500 py-4"
              >
                Không tìm thấy người dùng
              </div>

              <div
                v-for="user in searchResults"
                :key="user.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <img
                    :src="user.avatar || '/images/Avatar/default-avatar.png'"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div class="font-medium">
                      {{ user.name || user.id }}
                    </div>
                    <div class="text-sm text-gray-500">
                      <span v-if="user.online" class="text-green-500">
                        <i class="bi bi-circle-fill text-xs mr-1"></i>Online
                      </span>
                      <span v-else>ID: {{ user.id }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    v-if="!user.isFriend"
                    @click="sendFriendRequest(user.id)"
                    class="px-3 py-1 text-sm text-white bg-[#FF5630] rounded-full hover:bg-[#FF4520] transition-colors"
                  >
                    Kết bạn
                  </button>
                  <button
                    @click="startChatWith(user)"
                    class="px-3 py-1 text-sm text-white bg-[#FF5630] rounded-full hover:bg-[#FF4520] transition-colors"
                  >
                    Nhắn tin
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="showFriendsPanel" class="p-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-medium">Danh sách bạn bè</h4>
              <button
                @click="
                  () => {
                    showFriendSearch = true;
                    showFriendsPanel = false;
                  }
                "
                class="px-3 py-1.5 text-sm bg-[#FF5630] text-white rounded-lg hover:bg-[#FF4520]"
              >
                Thêm bạn
              </button>
            </div>

            <div
              v-if="isLoading"
              class="flex items-center justify-center py-8 text-gray-500"
            >
              <i class="bi bi-arrow-repeat animate-spin mr-2"></i>
              Đang tải danh sách bạn bè...
            </div>

            <div v-else-if="loadingError" class="text-center py-8">
              <div class="text-red-500 mb-2">
                <i class="bi bi-exclamation-circle text-xl"></i>
                <div class="mt-2">{{ loadingError }}</div>
              </div>
              <button
                @click="loadFriendsList"
                class="mt-2 px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Thử lại
              </button>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="friend in friends"
                :key="friend.id"
                class="flex items-center p-2 hover:bg-gray-50 rounded-lg"
              >
                <img
                  :src="avatarFor(friend)"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div class="ml-3 flex-1">
                  <div class="font-medium">
                    {{ friend.name || friend.id }}
                  </div>
                  <div class="text-sm text-gray-500">@{{ friend.id }}</div>
                </div>
                <button
                  @click="startChatWith(friend)"
                  class="p-2 text-gray-400 hover:text-[#FF5630]"
                >
                  <i class="bi bi-chat-text"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-if="showPostsPanel" class="p-4">
            <textarea
              v-model="newPost"
              rows="4"
              placeholder="Bạn đang nghĩ gì?"
              class="w-full p-3 border rounded-lg resize-none focus:outline-none focus:border-[#FF5630]"
            ></textarea>
            <div class="mt-3 flex items-center justify-between">
              <div class="flex space-x-2">
                <button class="p-2 text-gray-500 hover:text-[#FF5630]">
                  <i class="bi bi-image"></i>
                </button>
                <button class="p-2 text-gray-500 hover:text-[#FF5630]">
                  <i class="bi bi-emoji-smile"></i>
                </button>
              </div>
              <button
                @click="createPost"
                class="px-4 py-2 bg-[#FF5630] text-white rounded-lg hover:bg-[#FF4520]"
              >
                Đăng
              </button>
            </div>
          </div>

          <div v-if="showProfilePanel" class="p-4">PROFILE_PANEL_REMOVED</div>
        </div>
      </div>

      <div
        v-if="showNotificationsPanel"
        class="absolute left-64 top-0 bottom-0 bg-white w-[28rem] shadow-lg flex flex-col overflow-hidden"
        :style="{ zIndex: panelZIndex.sidePanel }"
      >
        <div class="p-4 border-b">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Thông báo</h3>
            <button
              @click.stop="closeAllPanels"
              class="text-gray-500 hover:text-gray-900"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-auto">
          <div
            v-if="
              messageNotifications.length > 0 || incomingRequests.length > 0
            "
            class="p-4 space-y-6"
          >
            <div v-if="messageNotifications.length > 0">
              <h4 class="font-medium mb-3">Tin nhắn mới</h4>
              <div class="space-y-3">
                <div
                  v-for="notif in messageNotifications"
                  :key="notif.idThongBao"
                  @click="handleNotificationClick(notif)"
                  class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  :class="
                    !notif.trangThai ? 'bg-orange-50 border-orange-200' : ''
                  "
                >
                  <div class="flex items-center flex-1 min-w-0">
                    <i
                      class="bi bi-chat-dots text-orange-500 text-xl mr-3 flex-shrink-0"
                    ></i>
                    <div class="flex-1 min-w-0">
                      <div class="font-medium text-sm">{{ notif.noiDung }}</div>
                      <div class="text-xs text-gray-400">
                        {{ formatDate(notif.ngayTao) }}
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-1 flex-shrink-0 ml-2">
                    <div
                      v-if="!notif.trangThai"
                      class="w-2 h-2 bg-orange-500 rounded-full"
                    ></div>
                    <button
                      @click.stop="deleteNotification(notif.idThongBao)"
                      class="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-all"
                      title="Xóa thông báo"
                    >
                      <i class="bi bi-x-lg text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="incomingRequests.length > 0">
              <h4 class="font-medium mb-3">Lời mời kết bạn</h4>
              <div class="space-y-3">
                <div
                  v-for="req in incomingRequests"
                  :key="req.maYeuCau"
                  class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div class="flex items-center flex-1 min-w-0">
                    <img
                      :src="avatarFor({ id: req.from })"
                      class="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div class="ml-3 flex-1 min-w-0">
                      <div class="font-medium text-sm">{{ req.from }}</div>
                      <div class="text-xs text-gray-400">
                        {{ formatDate(req.ngayGui) }}
                      </div>
                    </div>
                  </div>
                  <div class="flex space-x-2 flex-shrink-0 ml-2">
                    <button
                      @click="acceptRequest(req.maYeuCau, req.from)"
                      class="px-2 py-1 text-xs bg-[#FF5630] text-white rounded hover:bg-[#FF4520]"
                    >
                      Đồng ý
                    </button>
                    <button
                      @click="rejectRequest(req.maYeuCau)"
                      class="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="flex items-center justify-center h-full text-center text-gray-500 p-4"
          >
            <div>
              <i class="bi bi-inbox text-4xl mb-2 opacity-50 block"></i>
              <div class="mt-2">Không có thông báo mới</div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!showProfileFullPage"
        class="absolute inset-0 -z-10 bg-black bg-opacity-25"
        @click="closeAllPanels"
      ></div>
    </div>

    <div
      v-if="showProfileFullPage"
      class="absolute top-0 left-20 md:left-64 bottom-0 bg-white shadow-lg overflow-hidden"
      :style="{ zIndex: panelZIndex.profileView, right: 0 }"
    >
      <ProfileView
        @close="
          () => {
            showProfileFullPage = false;
          }
        "
        @viewUserProfile="handleViewUserProfile"
      />
    </div>

    <div
      v-if="showOtherUserProfile"
      class="absolute top-0 left-20 md:left-64 bottom-0 bg-white shadow-lg overflow-hidden"
      :style="{ zIndex: panelZIndex.otherUserProfile, right: 0 }"
    >
      <UserOtherProfile
        :userId="otherUserId"
        @close="
          () => {
            showOtherUserProfile = false;
          }
        "
        @startChat="handleStartChatFromProfile"
      />
    </div>
  </div>

  <Teleport to="body">
    <FriendRequestsPanel
      v-if="showRequests"
      :requests="incomingRequests"
      @accept="acceptRequest"
      @reject="rejectRequest"
      @close="showRequests = false"
      @viewUserProfile="handleViewUserProfile"
    />
  </Teleport>

  <Teleport to="body">
    <SettingsModal
      v-if="showSettings"
      @close="closeSettings"
      @logout="logout"
      @navigate="navigateFromSettings"
      @show-blocked-users="handleShowBlockedUsers"
    />
  </Teleport>

  <Teleport to="body">
    <BlockedUsersPanel
      v-if="showBlockedPanel"
      @close="showBlockedPanel = false"
      @unblock="handleUnblockUser"
    />
  </Teleport>

  <Teleport to="body">
    <CreatePostModal
      v-if="showCreatePostModal"
      @close="showCreatePostModal = false"
    />
  </Teleport>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, nextTick } from "vue";
import { useRouter } from "vue-router";
import ChatList from "./ChatList.vue";
import ChatWindow from "./ChatWindow.vue";
import FriendRequestsPanel from "./FriendRequestsPanel.vue";
import SettingsModal from "./SettingsModal.vue";
import BlockedUsersPanel from "./BlockedUsersPanel.vue";
import ProfileView from "./ProfileView.vue";
import UserOtherProfile from "./UserOtherProfile.vue";
import CreatePostModal from "./CreatePostModal.vue";
import socketService from "../api/socketService";
import api from "../api/api";
import { storage } from "../utils/storage";
import notificationService from "../api/notificationService";

// State management
const chatConnectionState = ref("disconnected");
const chatError = ref(null);

// Z-index management
const currentZIndex = ref(1000);

const getNextZIndex = () => {
  currentZIndex.value += 1;

  return currentZIndex.value;
};

const panelZIndex = ref({
  sidePanel: 1200,
  profileView: 1300,
  otherUserProfile: 1400,
});

const router = useRouter();
const user = ref(null);
const chats = ref([]); // [{ id, name, avatar, lastMessage, gender }]
const selectedChat = ref(null);
const showChatOnMobile = ref(false); // Track if chat is selected on mobile
const incomingRequests = ref([]); // Already declared elsewhere - line removed to prevent duplicate
const friends = ref([]); // For group creation and friend search
const showRequests = ref(false);
const messageNotifications = ref([]);
const notificationsUnread = ref(0);
const notificationsBadgeCount = computed(() => {
  // Tính tổng: unread message notifications + incoming friend requests
  const msgCount = messageNotifications.value.filter(
    (n) => !n.trangThai
  ).length;
  const friendReqCount = incomingRequests.value?.length || 0;
  return msgCount + friendReqCount;
});

// UI States
const activePanel = ref("chat");
const newPost = ref("");
const userBio = ref("");
const searchQuery = ref("");
const searchResults = ref([]);
const notificationClicked = ref(false);
const friendRequestCount = ref(0);
const notificationsLoaded = ref(false); // Flag: notifications already loaded
const showCreatePostModal = ref(false);

// Search functionality
const searchUsers = async () => {
  if (!searchQuery.value || searchQuery.value.trim().length < 2) {
    searchResults.value = [];
    return;
  }
  try {
    const currentUserId = user.value?.id || user.value?.email;

    // Try searching by ID first
    const isEmailOrId =
      searchQuery.value.includes("@") ||
      /^[a-zA-Z0-9_-]+$/.test(searchQuery.value);
    let response;

    if (isEmailOrId) {
      // Search by exact ID/email
      response = await api.get(
        `/trendy/user/${encodeURIComponent(searchQuery.value)}`
      );
      if (response.data) {
        searchResults.value = [response.data];
      }
    } else {
      // Fallback to name search
      response = await api.get(
        `/trendy/user/search?q=${encodeURIComponent(searchQuery.value)}`
      );
      searchResults.value = response.data || [];
    }

    // Get blocked users list
    let blockedUserIds = [];
    try {
      const blockRes = await api.get(
        `/trendy/block/list?userId=${currentUserId}`
      );
      blockedUserIds = (blockRes.data || []).map((b) => b.id);

      // Also get users who blocked me
      const blockedByRes = await api.get(
        `/trendy/block/blocked-by?userId=${currentUserId}`
      );
      const blockedByIds = (blockedByRes.data || []).map((b) => b.id);
      blockedUserIds = [...blockedUserIds, ...blockedByIds];
    } catch (e) {
      console.warn("Failed to load blocked users:", e);
    }

    // Filter out current user, existing friends, and blocked users
    const friendIds = friends.value.map((f) => f.id);
    searchResults.value = searchResults.value.filter(
      (r) =>
        r.id !== currentUserId &&
        !friendIds.includes(r.id) &&
        !blockedUserIds.includes(r.id)
    );
  } catch (error) {
    console.error("Error searching users:", error);
    if (error.response?.status === 404) {
      searchResults.value = [];
    } else {
      chatError.value = {
        message: "Không thể tìm kiếm người dùng. Vui lòng thử lại sau.",
      };
    }
  }
};

// Start new chat
const startChatWith = async (friend) => {
  try {
    const userId = user.value?.id || user.value?.email;
    if (!userId) return;

    // Kiểm tra xem đã có chat chưa
    const existingChat = chats.value.find(
      (c) => c.id === friend.id && c.type === "private"
    );

    if (existingChat) {
      selectedChat.value = existingChat;
      closeAllPanels();
      return;
    }

    // Tạo hoặc lấy solo_chat từ backend
    const response = await api.post(
      `/trendy/chat/solo?userId1=${userId}&userId2=${friend.id}`
    );
    const soloChatData = response.data;

    // Tạo chat mới với maNhomSolo
    const newChat = {
      id: friend.id,
      maNhomSolo: soloChatData.maNhomSolo, // CRITICAL!
      name: friend.name || friend.id,
      avatar: friend.avatar,
      lastMessage: "",
      time: "",
      type: "private",
      gender: friend.gioiTinh,
    };

    chats.value.unshift(newChat);
    selectedChat.value = newChat;
    closeAllPanels();
  } catch (error) {
    console.error("Failed to start chat:", error);
    alert("Không thể bắt đầu cuộc trò chuyện");
  }
};

// Panel visibility states
const showFriendsPanel = ref(false);
const showPostsPanel = ref(false);
const showNotificationsPanel = ref(false);
const showProfilePanel = ref(false);
const showProfileFullPage = ref(false); // Full page profile view
const showFriendSearch = ref(false);
const showCreateGroup = ref(false);
const showSettings = ref(false);
const showBlockedPanel = ref(false);
const showOtherUserProfile = ref(false); // Other user profile
const otherUserId = ref(null); // Which user to show

const userAvatar = computed(() => {
  if (!user.value) return "/images/Avatar/male_avatar.png";
  if (user.value.avatar) return user.value.avatar;
  if (user.value.gioiTinh === false) return "/images/Avatar/female_avatar.png";
  return "/images/Avatar/male_avatar.png";
});

const getPanelTitle = () => {
  if (showFriendsPanel.value) return "Bạn bè";
  if (showPostsPanel.value) return "Tạo bài viết";
  if (showProfilePanel.value) return "Trang cá nhân";
  return "";
};

const closeAllPanels = () => {
  showFriendsPanel.value = false;
  showPostsPanel.value = false;
  showNotificationsPanel.value = false;
  showProfilePanel.value = false;
  showProfileFullPage.value = false;
  showFriendSearch.value = false;
  showCreateGroup.value = false;
  showBlockedPanel.value = false;
  // 🚫 DON'T reset showOtherUserProfile here - it's set by handleViewUserProfile
  activePanel.value = "chat"; // Reset to chat panel

  // Reset search state
  searchQuery.value = "";
  searchResults.value = [];
};

const handleViewUserProfile = (userId) => {
  if (!userId) return;

  // SET STATE FIRST before closing panels
  otherUserId.value = userId;
  showOtherUserProfile.value = true;

  // Tăng z-index khi mở trang người khác
  panelZIndex.value.otherUserProfile = getNextZIndex();

  // THEN close panels
  closeAllPanels();
};
const handleStartChatFromProfile = (chatData) => {
  selectedChat.value = chatData;
  showOtherUserProfile.value = false;
  showChatOnMobile.value = true;
};

const formatDate = (d) => {
  if (!d) return "";
  try {
    const dt = new Date(d);
    const now = new Date();
    const diff = now - dt;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Format relative time
    if (days > 0) {
      return `${days} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else {
      return "Vừa xong";
    }
  } catch (e) {
    return d;
  }
};

const avatarFor = (user) => {
  if (user?.avatar) return user.avatar;
  if (user?.gioiTinh === false) return "/images/Avatar/female_avatar.png";
  return "/images/Avatar/male_avatar.png";
};

// Loading states for panels
const isLoading = ref(false);
const loadingError = ref(null);

// Handle navigation from sidebar
const onNavigate = async (panel) => {
  loadingError.value = null;

  // Close ALL panels first
  closeAllPanels();

  try {
    // Tăng z-index khi navigate
    panelZIndex.value.sidePanel = getNextZIndex();

    // Set active panel
    activePanel.value = panel;

    // Open corresponding panel
    if (panel === "friends") {
      isLoading.value = true;
      showFriendsPanel.value = true;
      try {
        await loadFriendsList();
      } catch (error) {
        console.error("Error loading friends:", error);
        loadingError.value =
          "Không thể tải danh sách bạn bè. Vui lòng thử lại sau.";
      } finally {
        isLoading.value = false;
      }
    } else if (panel === "posts") {
      showCreatePostModal.value = true;
      closeAllPanels(); // Đảm bảo tất cả panel khác đóng
    } else if (panel === "notifications") {
      showNotificationsPanel.value = true;

      // Load notifications only if not cached
      if (!notificationsLoaded.value) {
        try {
          await loadMessageNotifications();
          notificationsLoaded.value = true;
        } catch (error) {
          console.error("Error loading notifications:", error);
          loadingError.value = "Không thể tải thông báo. Vui lòng thử lại sau.";
        }
      } else {
      }
    } else if (panel === "profile") {
      // Close chat and show profile
      selectedChat.value = null;
      showChatOnMobile.value = false;
      activePanel.value = "profile";
      panelZIndex.value.profileView = getNextZIndex();
      showProfileFullPage.value = true;
    } else if (panel === "chat") {
      // Just show chat list - panels already closed
    }
  } catch (error) {
    console.error("Error in panel navigation:", error);
    alert("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.");
    closeAllPanels();
  }
};

// Load friends list with better error handling
const loadFriendsList = async () => {
  isLoading.value = true;
  loadingError.value = null;
  friends.value = []; // Clear existing list

  try {
    const userId = user.value?.id || user.value?.email;
    if (!userId) {
      loadingError.value = "Vui lòng đăng nhập lại để xem danh sách bạn bè";
      return;
    }

    // Check STOMP connection first
    if (!socketService.isConnected()) {
      try {
        await socketService.connect();
      } catch (e) {
        console.error("STOMP connection failed:", e);
        // Continue anyway - we can still try to load friends list
      }
    }

    const response = await api.get("/trendy/friends/list", {
      params: { userId },
    });

    if (response.data) {
      // Remove duplicates by userId
      const seenIds = new Set();
      const deduplicatedFriends = [];
      for (const friend of response.data) {
        if (!seenIds.has(friend.id)) {
          seenIds.add(friend.id);
          deduplicatedFriends.push(friend);
        }
      }
      friends.value = deduplicatedFriends;
      if (friends.value.length === 0) {
        loadingError.value = "Bạn chưa có bạn bè nào";
      }
    } else {
      loadingError.value = "Không có dữ liệu bạn bè";
    }
  } catch (error) {
    console.error("Error loading friends list:", error);
    friends.value = []; // Ensure empty array on error

    if (error.response?.status === 404) {
      loadingError.value = "Bạn chưa có bạn bè nào";
    } else if (error.response?.status === 500) {
      loadingError.value = "Lỗi máy chủ. Vui lòng thử lại sau";
      // Try STOMP reconnection on server error
      try {
        await socketService.reconnect();
      } catch (e) {
        console.error("STOMP reconnection failed:", e);
      }
    } else if (error.response?.status === 401) {
      loadingError.value = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại";
      router.push("/login");
    } else {
      loadingError.value =
        "Không thể tải danh sách bạn bè. Vui lòng thử lại sau";
    }
  } finally {
    isLoading.value = false;
  }
};

// Load incoming friend requests
const loadIncomingRequests = async () => {
  try {
    const userId = user.value?.id || user.value?.email;
    if (!userId) {
      console.warn("No userId for loading friend requests");
      return;
    }

    // Try endpoint: /trendy/friends/incoming
    const response = await api.get("/trendy/friends/incoming", {
      params: { userId },
    });

    incomingRequests.value = response.data || [];
    friendRequestCount.value = incomingRequests.value.length;
    console.log(
      `✅ Loaded ${friendRequestCount.value} incoming friend requests`
    );
  } catch (error) {
    console.error("Failed to load friend requests:", error.response?.status);
    incomingRequests.value = [];
  }
};

// Load message notifications
const loadMessageNotifications = async () => {
  try {
    const userId = user.value?.id || user.value?.email;
    if (!userId) {
      console.warn("No userId for loading notifications");
      return;
    }

    const response = await api.get("/trendy/notification/list", {
      params: { userId, limit: 15 },
    });

    messageNotifications.value = response.data || [];
    console.log(
      "✅ Loaded",
      messageNotifications.value.length,
      "notifications"
    );

    // Also refresh unread count
    try {
      const res = await api.get("/trendy/notification/unread-count", {
        params: { userId },
      });
      notificationsUnread.value = res.data?.count || 0;
    } catch (e) {
      console.warn("Failed to get unread count:", e);
    }
  } catch (error) {
    console.error("Error loading notifications:", error);
    console.error("Response data:", error.response?.data);
    messageNotifications.value = [];
  }
};

// Handle notification click
const handleNotificationClick = async (notification) => {
  try {
    // Mark as read
    await api.put(`/trendy/notification/${notification.idThongBao}/read`);
    notification.trangThai = true;

    // Decrement unread count
    notificationsUnread.value = Math.max(0, notificationsUnread.value - 1);

    // Navigate to chat
    const userId = notification.lienKet?.replace("/chat/", "");
    if (userId) {
      const chat = chats.value.find((c) => c.id === userId);
      if (chat) {
        selectedChat.value = chat;
      } else {
        // Create new chat
        const userRes = await api.get(`/trendy/user/${userId}`);
        const userData = userRes.data;

        const newChat = {
          id: userData.id,
          name: userData.ten,
          avatar: userData.avatar,
          type: "private",
        };
        chats.value.unshift(newChat);
        selectedChat.value = newChat;
      }
      closeAllPanels();
    }
  } catch (error) {
    console.error("Error handling notification:", error);
  }
};

// Delete notification
const deleteNotification = async (notificationId) => {
  try {
    await api.delete(`/trendy/notification/${notificationId}`);

    // Remove from list
    messageNotifications.value = messageNotifications.value.filter(
      (n) => n.idThongBao !== notificationId
    );

    // Invalidate cache
    notificationsLoaded.value = false;
  } catch (error) {
    console.error("Error deleting notification:", error);
    alert("Không thể xóa thông báo");
  }
};

// Refresh notifications (called when delete, mark read, etc)
const refreshNotifications = async () => {
  try {
    await loadMessageNotifications();
  } catch (e) {
    console.error("Error refreshing:", e);
  }
};
const openSettings = () => {
  showSettings.value = true;
};

const closeSettings = () => {
  showSettings.value = false;
};

const navigateFromSettings = (panel) => {
  showSettings.value = false;
  closeAllPanels(); // Close all panels first
  if (panel === "blocked") {
    showBlockedPanel.value = true;
  } else {
    onNavigate(panel);
  }
};

const logout = async () => {
  try {
    // Disconnect STOMP connection
    await socketService.disconnect();
  } catch (e) {
    console.warn("Failed to disconnect STOMP:", e);
  }

  // Clear storage
  storage.clear();

  // Redirect to login
  router.push("/login");
};

const handleShowBlockedUsers = () => {
  showBlockedPanel.value = true;
};

// Block user
const handleBlockUser = async (userId) => {
  try {
    const blockerId = user.value?.id;
    if (!blockerId) return;

    // 1. Block user
    await api.post("/trendy/block", {
      blockerId,
      blockedId: userId,
    });

    // 2. Unfriend (set status to TU_CHOI)
    try {
      // Find friend request
      const relationsRes = await api.get("/trendy/friends/relations", {
        params: { userId: blockerId },
      });
      const relations = relationsRes.data || [];
      const friendRelation = relations.find(
        (r) =>
          (r.maNguoiGui === blockerId && r.maNguoiNhan === userId) ||
          (r.maNguoiGui === userId && r.maNguoiNhan === blockerId)
      );

      if (friendRelation) {
        await api.post(`/trendy/friends/${friendRelation.maYeuCau}/reject`);
      }
    } catch (e) {
      console.warn("Failed to unfriend:", e);
    }

    // 3. Remove from chat list
    chats.value = chats.value.filter((c) => c.id !== userId);

    // 4. Remove from friends list
    friends.value = friends.value.filter((f) => f.id !== userId);

    // 5. Clear selected chat if it's the blocked user
    if (selectedChat.value?.id === userId) {
      selectedChat.value = null;
    }

    alert("Đã chặn người dùng và hủy kết bạn");
  } catch (error) {
    console.error("Failed to block user:", error);
    alert("Không thể chặn người dùng");
  }
};

// Unblock user
const handleUnblockUser = async (userId) => {
  try {
    const blockerId = user.value?.id;
    if (!blockerId) return;

    await api.delete(`/trendy/block/${userId}?blockerId=${blockerId}`);

    alert("Đã bỏ chặn người dùng");
  } catch (error) {
    console.error("Failed to unblock user:", error);
    alert("Không thể bỏ chặn người dùng");
  }
};

// Hide chat
const handleHideChat = (chatId) => {
  chats.value = chats.value.filter((c) => c.id !== chatId);
  if (selectedChat.value?.id === chatId) {
    selectedChat.value = null;
  }
};

// Leave group
const handleLeaveGroup = async (groupId) => {
  try {
    const userId = user.value?.id || user.value?.email;
    if (!userId) return;

    await api.delete(`/trendy/chat/group/${groupId}/leave?userId=${userId}`);

    // Remove from chat list
    chats.value = chats.value.filter(
      (c) => !(c.id === groupId && c.type === "group")
    );

    // Clear selected chat if it's the group
    if (
      selectedChat.value?.id === groupId &&
      selectedChat.value?.type === "group"
    ) {
      selectedChat.value = null;
    }

    alert("Đã rời khỏi nhóm");
  } catch (error) {
    console.error("Failed to leave group:", error);
    alert("Không thể rời nhóm");
  }
};

// Open create group modal
const openCreateGroup = () => {
  showCreateGroup.value = true;
};

const acceptRequest = async (maYeuCau, fromId) => {
  try {
    await api.post(`/trendy/friends/${encodeURIComponent(maYeuCau)}/accept`);
    // Remove from pending list
    incomingRequests.value = incomingRequests.value.filter(
      (r) => r.maYeuCau !== maYeuCau
    );
    // Add to friends list (check for duplicates first)
    const alreadyExists = friends.value.some((f) => f.id === fromId);
    if (!alreadyExists) {
      friends.value.push({ id: fromId, name: fromId });
    }
    alert("Đã chấp nhận lời mời kết bạn");
  } catch (e) {
    console.error("Accept failed", e);
    alert("Chấp nhận thất bại: " + (e.response?.data?.message || e.message));
  }
};

const rejectRequest = async (maYeuCau) => {
  try {
    await api.post(`/trendy/friends/${encodeURIComponent(maYeuCau)}/reject`);
    incomingRequests.value = incomingRequests.value.filter(
      (r) => r.maYeuCau !== maYeuCau
    );
    alert("Đã từ chối lời mời kết bạn");
  } catch (e) {
    console.error("Reject failed", e);
    alert("Từ chối thất bại: " + (e.response?.data?.message || e.message));
  }
};

// Send friend request (from search results)
const sendFriendRequest = async (userId) => {
  try {
    const token = storage.getToken();
    if (!token) {
      alert("Vui lòng đăng nhập lại để gửi lời mời kết bạn");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const fromUserId = payload.userId || payload.sub;

    if (!fromUserId) {
      alert("Không thể lấy user ID từ token");
      return;
    }

    if (!userId) {
      alert("User ID không hợp lệ");
      return;
    }

    await api.post(`/trendy/friends/request`, {
      from: String(fromUserId),
      to: String(userId),
    });

    // Update search results UI
    const userIdx = searchResults.value.findIndex((u) => u.id === userId);
    if (userIdx >= 0) {
      searchResults.value[userIdx].isFriend = true;
    }

    chatError.value = null;
    alert("Đã gửi lời mời kết bạn thành công");
  } catch (error) {
    console.error("Error sending friend request:", error);
    const message =
      error.response?.data?.message || "Không thể gửi lời mời kết bạn";
    chatError.value = { message };
    alert(message);
  }
};

// Unfriend user handler
const handleUnfriend = async (userId) => {
  try {
    const blockerId = user.value?.id || user.value?.email;
    if (!blockerId) return;

    if (!confirm(`Hủy kết bạn với ${userId}?`)) return;

    // Call unfriend API
    await api.delete("/trendy/friends/unfriend", {
      params: { userId1: blockerId, userId2: userId },
    });

    // Remove from friends list
    friends.value = friends.value.filter((f) => f.id !== userId);

    // Remove from chats if exists
    chats.value = chats.value.filter((c) => c.id !== userId);

    alert("Đã hủy kết bạn");
  } catch (error) {
    console.error("❌ Unfriend failed:", error);
    alert(
      "Hủy kết bạn thất bại: " +
        (error.response?.data?.message || error.message)
    );
  }
};

const onGroupCreated = (group) => {
  try {
    const maNhom = group.maNhom || group.id || `group-${Date.now()}`;
    const name = group.tenNhom || group.name || "Nhóm";
    const newGroup = {
      id: maNhom,
      name,
      avatar: null,
      lastMessage: "",
      gender: null,
      type: "group",
    };
    chats.value.unshift(newGroup);
    socketService.subscribeToGroup(maNhom, (msg) => {
      if (!msg) return;
      const idx = chats.value.findIndex(
        (c) => c.id === maNhom && c.type === "group"
      );
      const content = msg.noiDung || msg.content || "";
      if (idx >= 0) chats.value[idx].lastMessage = content;
    });
  } catch (e) {
    console.error("group created handling failed", e);
  }
  showCreateGroup.value = false;
};

const onSelectChat = (chat) => {
  selectedChat.value = chat;
  showChatOnMobile.value = true; // Show chat on mobile
  try {
    storage.set(
      "lastSelectedChat",
      JSON.stringify({ id: chat.id, type: chat.type })
    );
  } catch (e) {}
};

const backToChatList = () => {
  showChatOnMobile.value = false;
  selectedChat.value = null;
};

const onSent = (payload) => {
  // Update lastMessage in chat list
  if (selectedChat.value) {
    const chatIdx = chats.value.findIndex(
      (c) =>
        c.id === selectedChat.value.id && c.type === selectedChat.value.type
    );

    const now = new Date().toISOString();

    if (chatIdx >= 0) {
      // Update existing chat
      // If has attachments, show attachment preview instead of text
      if (payload.attachments) {
        try {
          const attachments = JSON.parse(payload.attachments);
          const hasImage = attachments.some((a) => {
            const imageExts = [
              ".jpg",
              ".jpeg",
              ".png",
              ".gif",
              ".bmp",
              ".webp",
            ];
            return imageExts.some((ext) => a.name.toLowerCase().endsWith(ext));
          });
          chats.value[chatIdx].lastMessage = hasImage
            ? "Bạn đã gửi hình ảnh"
            : `Bạn đã gửi ${attachments.length} file`;
        } catch (e) {
          chats.value[chatIdx].lastMessage = payload.noiDung || "";
        }
      } else {
        chats.value[chatIdx].lastMessage = payload.noiDung || "";
      }

      chats.value[chatIdx].time = payload.ngayGui || now;

      // Move to top of list
      const chat = chats.value.splice(chatIdx, 1)[0];
      chats.value.unshift(chat);
    } else {
      // New chat - add to list
      let lastMsg = payload.noiDung || "";
      if (payload.attachments) {
        try {
          const attachments = JSON.parse(payload.attachments);
          const hasImage = attachments.some((a) => {
            const imageExts = [
              ".jpg",
              ".jpeg",
              ".png",
              ".gif",
              ".bmp",
              ".webp",
            ];
            return imageExts.some((ext) => a.name.toLowerCase().endsWith(ext));
          });
          lastMsg = hasImage
            ? "Bạn đã gửi hình ảnh"
            : `Bạn đã gửi ${attachments.length} file`;
        } catch (e) {
          lastMsg = payload.noiDung || "";
        }
      }

      const newChat = {
        id: selectedChat.value.id,
        name: selectedChat.value.name,
        avatar: selectedChat.value.avatar,
        gender: selectedChat.value.gender,
        type: selectedChat.value.type,
        maNhomSolo: selectedChat.value.maNhomSolo,
        lastMessage: lastMsg,
        time: payload.ngayGui || now,
      };
      chats.value.unshift(newChat);
    }
  }
};

// ✅ Handle message received từ ChatWindow (WebSocket)
const onMessageReceived = (data) => {
  try {
    const { chatId, chatType, lastMessage, time, sender } = data;

    if (!chatId) return;

    console.log(
      "📨 Message received for chat:",
      chatId,
      "- Text:",
      lastMessage
    );

    // Tìm chat cần cập nhật
    const chatIdx = chats.value.findIndex(
      (c) => c.id === chatId && c.type === chatType
    );

    if (chatIdx >= 0) {
      // Cập nhật tin nhắn cuối cùng và thời gian
      chats.value[chatIdx].lastMessage = lastMessage || "";
      chats.value[chatIdx].time = time || new Date().toISOString();

      // Nếu tin nhắn từ người khác (không phải của bạn), tăng unreadCount
      const isFromOther = sender !== (user.value?.id || user.value?.email);
      if (isFromOther) {
        chats.value[chatIdx].unreadCount =
          (chats.value[chatIdx].unreadCount || 0) + 1;
        console.log(
          "📌 Unread count for",
          chatId,
          ":",
          chats.value[chatIdx].unreadCount
        );
      }

      // Di chuyển lên đầu danh sách (chat mới nhất)
      const chat = chats.value.splice(chatIdx, 1)[0];
      chats.value.unshift(chat);

      console.log("✅ Chat list updated and reordered");
    }
  } catch (e) {
    console.error("Error in onMessageReceived:", e);
  }
};

let panelListener = null;

// Load chats from API
const loadChats = async () => {
  if (!user.value?.id) {
    console.warn("No user ID, cannot load chats");
    return;
  }

  try {
    const userId = user.value.id;

    // ... existing code ...

    // Load solo chats
    try {
      const soloRes = await api.get(`/trendy/chat/solo?userId=${userId}`);

      // Use Promise.all to fetch history for each chat in parallel
      const soloChats = await Promise.all(
        (soloRes.data || []).map(async (c) => {
          const chatData = {
            id: c.otherUserId,
            maNhomSolo: c.maNhomSolo,
            name: c.otherUserName || c.otherUserId,
            avatar: c.avatar,
            lastMessage: "",
            time: "",
            gender: c.gender,
            type: "private",
          };

          // Fetch latest message for this chat
          try {
            const historyRes = await api.get(
              `/trendy/chat/private/history?userA=${userId}&userB=${c.otherUserId}`
            );
            const messages = historyRes.data || [];
            if (messages.length > 0) {
              const lastMsg = messages[messages.length - 1];
              chatData.time = lastMsg.ngayGui || "";

              // Check if has attachments
              if (lastMsg.attachments) {
                try {
                  const attachments = JSON.parse(lastMsg.attachments);
                  const imageExts = [
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".gif",
                    ".bmp",
                    ".webp",
                  ];
                  const hasImage = attachments.some((a) =>
                    imageExts.some((ext) => a.name.toLowerCase().endsWith(ext))
                  );
                  chatData.lastMessage = hasImage
                    ? lastMsg.maNguoiGui === userId
                      ? "Bạn đã gửi hình ảnh"
                      : "Đã gửi hình ảnh"
                    : lastMsg.maNguoiGui === userId
                    ? `Bạn đã gửi ${attachments.length} file`
                    : `Đã gửi ${attachments.length} file`;
                } catch (e) {
                  chatData.lastMessage = lastMsg.noiDung || "";
                }
              } else {
                chatData.lastMessage = lastMsg.noiDung || "";
              }
            }
          } catch (e) {
            console.warn("Failed to load chat history for", c.otherUserId, e);
          }

          return chatData;
        })
      );

      chats.value.push(...soloChats);
      console.log(
        "✅ Loaded",
        soloChats.length,
        "solo chats with latest messages"
      );
    } catch (e) {
      console.error("❌ Failed to load solo chats:", e);
    }

    // Load group chats
    try {
      const groupRes = await api.get(`/trendy/chat/group?userId=${userId}`);

      // FIX: Map group chats with correct ID field and load latest message time
      const groupChats = await Promise.all(
        (groupRes.data || []).map(async (g) => {
          const chatData = {
            id: g.maNhom || g.id, // FIX: Use maNhom as primary ID
            maNhom: g.maNhom, // Keep maNhom for reference
            name: g.tenNhom,
            avatar: null,
            lastMessage: g.lastMessage || "",
            time: g.ngayGui || g.time || "", // Include time from response
            gender: null,
            type: "group",
          };

          // Fetch latest message for this group to get ngayGui
          try {
            const historyRes = await api.get(
              `/trendy/chat/group/${g.maNhom}/history`
            );
            const messages = historyRes.data || [];
            if (messages.length > 0) {
              const lastMsg = messages[messages.length - 1];
              chatData.time = lastMsg.ngayGui || "";

              // Check if has attachments
              if (lastMsg.attachments) {
                try {
                  const attachments = JSON.parse(lastMsg.attachments);
                  const imageExts = [
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".gif",
                    ".bmp",
                    ".webp",
                  ];
                  const hasImage = attachments.some((a) =>
                    imageExts.some((ext) => a.name.toLowerCase().endsWith(ext))
                  );
                  chatData.lastMessage = hasImage
                    ? lastMsg.maNguoiGui === userId
                      ? "Bạn đã gửi hình ảnh"
                      : "Đã gửi hình ảnh"
                    : lastMsg.maNguoiGui === userId
                    ? `Bạn đã gửi ${attachments.length} file`
                    : `Đã gửi ${attachments.length} file`;
                } catch (e) {
                  chatData.lastMessage = lastMsg.noiDung || "";
                }
              } else {
                chatData.lastMessage = lastMsg.noiDung || "";
              }
            }
          } catch (e) {
            console.warn("Failed to load group history for", g.maNhom, e);
          }

          return chatData;
        })
      );

      chats.value.push(...groupChats);
      console.log(
        "✅ Loaded",
        groupChats.length,
        "group chats with latest messages"
      );
    } catch (e) {
      console.error("❌ Failed to load group chats:", e);
    }
  } catch (error) {
    console.error("❌ Error loading chats:", error);
    chatError.value = "Không thể tải danh sách chat";
  }
};

// ✅ Refresh chats list - Polling để lấy latest messages
const lastFetchTime = ref(new Date());

const refreshChatList = async () => {
  if (!user.value?.id) return;

  try {
    const userId = user.value.id;

    // Fetch solo chats from backend (now includes lastMessage and ngayGui)
    const soloRes = await api.get(`/trendy/chat/solo?userId=${userId}`);
    const groupRes = await api.get(`/trendy/chat/group?userId=${userId}`);

    // Get list of current chat IDs
    const newChatIds = [];

    // Check solo chats
    for (const c of soloRes.data || []) {
      const chatKey = `private-${c.otherUserId}`;
      newChatIds.push(chatKey);

      let existingChat = chats.value.find(
        (ch) => ch.id === c.otherUserId && ch.type === "private"
      );

      if (!existingChat) {
        // New chat - add it
        existingChat = {
          id: c.otherUserId,
          maNhomSolo: c.maNhomSolo,
          name: c.otherUserName || c.otherUserId,
          avatar: c.avatar,
          lastMessage: c.lastMessage || "",
          time: c.ngayGui || "",
          gender: c.gender,
          type: "private",
        };
        chats.value.push(existingChat);
      } else {
        // Update existing chat with new data
        const oldTime = new Date(existingChat.time || 0).getTime();
        const newTime = new Date(c.ngayGui || 0).getTime();

        existingChat.name = c.otherUserName || c.otherUserId;
        existingChat.avatar = c.avatar;

        // Only update if new message is fresher
        if (newTime > oldTime) {
          existingChat.lastMessage = c.lastMessage || "";
          existingChat.time = c.ngayGui || "";
        }
      }
    }

    // Check group chats
    for (const g of groupRes.data || []) {
      const chatKey = `group-${g.maNhom}`;
      newChatIds.push(chatKey);

      let existingChat = chats.value.find(
        (ch) => ch.id === g.maNhom && ch.type === "group"
      );

      if (!existingChat) {
        // New group - add it
        existingChat = {
          id: g.maNhom,
          maNhom: g.maNhom,
          name: g.tenNhom,
          avatar: null,
          lastMessage: g.lastMessage || "",
          time: g.ngayGui || "",
          type: "group",
        };
        chats.value.push(existingChat);
      } else {
        // Update existing group
        const oldTime = new Date(existingChat.time || 0).getTime();
        const newTime = new Date(g.ngayGui || 0).getTime();

        existingChat.name = g.tenNhom;

        // Only update if new message is fresher
        if (newTime > oldTime) {
          existingChat.lastMessage = g.lastMessage || "";
          existingChat.time = g.ngayGui || "";
        }
      }
    }

    // Remove chats that no longer exist
    chats.value = chats.value.filter((c) =>
      newChatIds.includes(`${c.type}-${c.id}`)
    );

    // Sort by time (newest first)
    chats.value.sort((a, b) => {
      const timeA = new Date(a.time || 0).getTime();
      const timeB = new Date(b.time || 0).getTime();
      return timeB - timeA;
    });

    lastFetchTime.value = new Date();
    console.log("✅ Chat list refreshed", new Date().toLocaleTimeString());
  } catch (error) {
    console.warn("Error refreshing chat list:", error);
  }
};

onBeforeUnmount(() => {
  try {
    if (panelListener) window.removeEventListener("open-panel", panelListener);
  } catch (e) {}
});
onMounted(async () => {
  // Check authentication first
  const token = storage.getToken();
  if (!token) {
    router.push("/login");
    return;
  }

  // Parse user from storage
  try {
    const storedUser = storage.getUser();
    if (storedUser) {
      user.value = storedUser;
    } else {
      // Fallback: parse from token
      const payload = JSON.parse(atob(token.split(".")[1]));
      user.value = {
        id: payload.sub || payload.userId,
        email: payload.email,
        ten: payload.ten,
      };
      storage.setUser(user.value);
    }
  } catch (e) {
    console.error("Failed to get user info:", e);
    router.push("/login");
    return;
  }
  // Initialize STOMP connection with retries
  chatConnectionState.value = "connecting";
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      await socketService.connect();

      chatConnectionState.value = "connected";
      chatError.value = null;
      break;
    } catch (err) {
      console.error(`STOMP connection attempt ${retries + 1} failed:`, err);
      retries++;
      if (retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
      } else {
        chatConnectionState.value = "disconnected";
        chatError.value = {
          message: "Không thể kết nối tới máy chủ. Vui lòng tải lại trang.",
        };
      }
    }
  }

  // đăng ký listener panel
  panelListener = (ev) => {
    const name = ev?.detail;
    // Use router for navigation
    if (name) {
      router.push(`/${name}`);
    }
  };
  window.addEventListener("open-panel", panelListener);

  if (chatConnectionState.value !== "connected") {
    console.warn("⚠️ STOMP not connected, but continuing...");
  }

  // Load chats

  await loadChats();

  // load friends list for group creation
  try {
    const friendsRes = await api.get("/trendy/friends/list", {
      params: { userId: user.value?.id || user.value?.email },
    });
    friends.value = friendsRes.data || [];
  } catch (e) {
    console.error("Failed to load friends list:", e);
    friends.value = [];
  }

  // load incoming friend requests (to show pending)
  try {
    await loadIncomingRequests();
  } catch (e) {
    incomingRequests.value = [];
  }

  // Load message notifications on mount (not lazy)
  try {
    // Load in parallel (Promise.all) instead of sequential
    await Promise.all([loadMessageNotifications(), loadIncomingRequests()]);
  } catch (e) {
    console.warn("Failed to load initial notifications:", e);
    messageNotifications.value = [];
  }

  // connect socket and subscribe to private topic
  socketService.connect({
    onConnect: async () => {
      const uid = user.value?.id || user.value?.email;
      if (uid) {
        // Notification subscription
        socketService.subscribeToNotification(uid, async (notif) => {
          try {
            if (!notif) return;

            // Push notification into list and increment unread badge
            const existingIdx = messageNotifications.value.findIndex(
              (n) => n.idThongBao === notif.idThongBao
            );

            if (existingIdx >= 0) {
              messageNotifications.value[existingIdx] = notif;
            } else {
              messageNotifications.value.unshift(notif);
              notificationsUnread.value = (notificationsUnread.value || 0) + 1;
              console.log(
                "✅ Added new notification, unread count:",
                notificationsUnread.value
              );
            }
          } catch (e) {
            console.error("Failed to handle incoming notification", e);
          }
        });
      }
    },
  });

  // ✅ Polling chat list mỗi 3 giây để cập nhật tin nhắn mới
  const chatListRefreshInterval = setInterval(() => {
    try {
      refreshChatList().catch((e) => {
        console.warn("Failed to refresh chat list:", e);
      });
    } catch (e) {
      console.error("Chat list refresh error:", e);
    }
  }, 3000);

  onBeforeUnmount(() => {
    try {
      if (panelListener)
        window.removeEventListener("open-panel", panelListener);
      clearInterval(chatListRefreshInterval); // ✅ Cleanup interval
    } catch (e) {}
  });
});
</script>

<style scoped>
/* Notification badge styles */
.notifications-btn {
  position: relative;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff5630;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
