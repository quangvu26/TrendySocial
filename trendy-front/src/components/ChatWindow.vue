<template>
  <div class="flex flex-col h-full">
    <header
      class="px-4 py-3 border-b flex items-center justify-between hover:bg-gray-50 transition-colors"
    >
      <div class="flex items-center space-x-3">
        <button
          @click.stop="$emit('back-to-list')"
          class="sm:hidden p-2 hover:bg-gray-100 rounded -mx-2"
          title="Quay lại"
        >
          <i class="bi bi-chevron-left text-xl"></i>
        </button>

        <img
          v-if="chat"
          :src="avatar"
          alt="avatar"
          class="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80"
          @click.stop="
            props.chat?.type === 'private' && goToUserProfile(props.chat?.id)
          "
          :title="chat?.type === 'private' ? 'Xem trang cá nhân' : ''"
        />
        <div
          @click="
            props.chat?.type === 'private' && goToUserProfile(props.chat?.id)
          "
          :class="
            props.chat?.type === 'private'
              ? 'cursor-pointer hover:text-blue-600'
              : ''
          "
          class="flex-1"
        >
          <div class="font-semibold">
            {{ chat?.name || "Chọn cuộc trò chuyện" }}
          </div>

          <div v-if="chat?.type === 'private'" class="text-xs text-gray-400">
            {{ chat?.id ? "@" + chat.id : "" }}
          </div>
        </div>
      </div>
      <div v-if="chat" class="flex items-center space-x-2">
        <button
          v-if="chat.type === 'private' && !friendButtonIsFriend"
          @click="handleFriendHeaderButtonClick"
          :disabled="friendButtonLoading"
          :class="{
            'bg-[#FF5630] text-white hover:bg-[#FF4520]': !hasSentRequest,
            'bg-yellow-500 text-white hover:bg-yellow-600': hasSentRequest,
          }"
          class="px-3 py-1 text-sm rounded transition-colors disabled:opacity-50"
        >
          {{ friendButtonText }}
        </button>

        <button
          @click="toggleChatMenu"
          ref="menuButton"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <i class="bi bi-three-dots text-xl"></i>
        </button>
      </div>
    </header>
    <div
      v-if="pinnedMessages.length > 0"
      class="border-b bg-orange-50 relative z-10"
    >
      <div class="p-2 sm:p-3">
        <div class="flex items-center justify-between mb-1 sm:mb-2">
          <div
            class="flex items-center text-xs sm:text-sm font-medium text-orange-600"
          >
            <i class="bi bi-pin-angle-fill mr-1 sm:mr-2"></i>
            {{ pinnedMessages.length }} tin nhắn đã ghim
          </div>
          <button
            v-if="pinnedMessages.length > 1"
            @click="showAllPinned = !showAllPinned"
            class="p-1 hover:bg-orange-100 rounded transition-colors"
            :title="showAllPinned ? 'Thu gọn' : 'Xem tất cả'"
          >
            <i
              :class="showAllPinned ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"
              class="text-sm"
            ></i>
          </button>
        </div>

        <div
          v-if="!showAllPinned && pinnedMessages.length > 0"
          class="space-y-1"
        >
          <div
            class="bg-white border border-orange-300 rounded-lg p-1.5 sm:p-2 flex items-start justify-between text-xs sm:text-sm"
          >
            <div class="flex-1 min-w-0">
              <div class="text-gray-900 line-clamp-1 sm:line-clamp-2">
                {{ pinnedMessages[0].content }}
              </div>
              <div class="text-gray-500 text-xs mt-0.5">
                {{ formatRelativeTime(pinnedMessages[0].time) }}
              </div>
            </div>
            <button
              @click="removePinnedMessage(pinnedMessages[0].id)"
              class="ml-1 p-0.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600 flex-shrink-0"
              title="Bỏ ghim"
            >
              <i class="bi bi-x-lg text-xs"></i>
            </button>
          </div>
        </div>

        <div v-else class="space-y-1 max-h-40 sm:max-h-60 overflow-y-auto">
          <div
            v-for="msg in pinnedMessages"
            :key="msg.id"
            class="bg-white border border-orange-300 rounded-lg p-1.5 sm:p-2 flex items-start justify-between hover:bg-gray-50 transition-colors text-xs sm:text-sm"
          >
            <div class="flex-1 min-w-0">
              <div class="text-gray-900">
                {{ msg.content }}
              </div>
              <div class="text-gray-500 text-xs mt-0.5">
                {{ formatRelativeTime(msg.time) }}
              </div>
            </div>
            <button
              @click="removePinnedMessage(msg.id)"
              class="ml-1 p-0.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600 flex-shrink-0"
              title="Bỏ ghim"
            >
              <i class="bi bi-x-lg text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <main class="flex-1 overflow-auto p-4 relative z-0" ref="msgList">
      <div
        v-if="displayedMessages.length === 0"
        class="text-center text-gray-400 mt-8"
      >
        Hãy cùng nhắn tin nào
      </div>
      <div
        v-for="(m, idx) in displayedMessages"
        :key="m.id"
        :data-message-id="m.id"
        @mouseenter="handleMessageHover(m.id)"
        @mouseleave="handleMessageLeave"
        :class="m.outgoing ? 'justify-end' : 'justify-start'"
        class="flex items-end mb-4 group relative"
      >
        <img
          v-if="!m.outgoing"
          :src="avatar"
          class="w-8 h-8 rounded-full object-cover flex-shrink-0 mr-2"
        />

        <div :class="m.outgoing ? 'ml-auto' : ''" class="max-w-[70%]">
          <div
            v-if="m.replyToId || m.replyTo"
            class="text-xs bg-gray-100 p-2 rounded-t mb-1 border-l-4 border-orange-500 cursor-pointer hover:bg-orange-50 transition-colors"
            @click="scrollToOriginalMessage(m.replyToId || m.replyTo?.id)"
            :title="`Nhấn để xem: ${
              m.replyToSender || m.replyTo?.sender || 'Người gửi'
            }`"
          >
            <div class="font-semibold text-orange-600">
              ↩️ {{ m.replyToSender || m.replyTo?.sender || "Người gửi" }}
            </div>
            <div class="truncate text-gray-600">
              {{ m.replyToContent || m.replyTo?.content }}
            </div>
          </div>

          <div
            :class="
              m.outgoing
                ? 'bg-[#FF5630] text-white'
                : 'bg-white text-gray-900 border-2 border-orange-400'
            "
            class="px-3 py-2 rounded-lg inline-block max-w-full"
            style="
              word-wrap: break-word;
              word-break: break-word;
              white-space: pre-wrap;
            "
          >
            <div class="text-sm">{{ m.content }}</div>
            <div
              class="text-xs mt-1 text-right"
              :class="m.outgoing ? 'text-gray-200' : 'text-gray-500'"
            >
              {{ formatRelativeTime(m.time) }}
            </div>
          </div>

          <div
            v-if="m.reactions && m.reactions.length > 0"
            class="flex space-x-1 mt-1 flex-wrap"
          >
            <div
              v-for="(reaction, ridx) in m.reactions"
              :key="ridx"
              class="text-xs bg-white border rounded-full px-2 py-0.5 shadow-sm cursor-pointer hover:bg-red-50 group relative transition-colors"
              @click="removeReaction(m.id, reaction.emoji)"
              :title="`Click để xóa reaction này`"
            >
              <span>{{ reaction.emoji }} {{ reaction.count }}</span>
              <span
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </span>
            </div>
          </div>

          <div v-if="m.attachments" class="mt-3 space-y-2">
            <div
              v-for="(att, idx) in (() => {
                try {
                  const parsed = JSON.parse(m.attachments || '[]');
                  return Array.isArray(parsed) ? parsed : [];
                } catch {
                  return [];
                }
              })()"
              :key="idx"
            >
              <div v-if="isImage(att.name)" class="relative group inline-block">
                <img
                  :src="att.url"
                  :alt="att.name"
                  class="max-w-xs rounded-lg shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                  @click="viewImage(att.url)"
                />

                <div
                  class="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button
                    @click="viewImage(att.url)"
                    class="p-2 bg-white rounded-lg shadow-md hover:bg-blue-100"
                    title="Xem fullscreen"
                  >
                    <i class="bi bi-fullscreen text-blue-600"></i>
                  </button>
                  <button
                    @click="downloadFile(att.url, att.name)"
                    class="p-2 bg-white rounded-lg shadow-md hover:bg-green-100"
                    title="Tải xuống"
                  >
                    <i class="bi bi-download text-green-600"></i>
                  </button>
                </div>
              </div>

              <div
                v-else
                class="bg-gray-100 hover:bg-gray-200 rounded-lg p-3 flex items-center justify-between max-w-xs transition-colors"
              >
                <div class="flex items-center space-x-2 flex-1 min-w-0">
                  <i
                    class="bi bi-file-earmark text-gray-600 text-lg flex-shrink-0"
                  ></i>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-800 truncate">
                      {{ att.name }}
                    </div>
                    <div class="text-xs text-gray-600">
                      {{ formatFileSize(att.size) }}
                    </div>
                  </div>
                </div>
                <div class="flex space-x-1 ml-2 flex-shrink-0">
                  <button
                    @click="downloadFile(att.url, att.name)"
                    class="p-2 hover:bg-green-300 rounded"
                    title="Tải xuống"
                  >
                    <i class="bi bi-download text-green-600"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="m.outgoing && m.seenBy && m.seenBy.length > 0"
            class="flex mt-1 -space-x-2"
          >
            <img
              v-for="seenUser in m.seenBy"
              :key="seenUser.id"
              :src="seenUser.avatar || '/images/Avatar/male_avatar.png'"
              class="w-4 h-4 rounded-full border border-white"
              :title="`${seenUser.name || seenUser.id} đã xem`"
            />
          </div>

          <div
            v-if="hoveredMessage === m.id"
            class="absolute flex space-x-1 p-1 bg-white border rounded-lg shadow-md"
            :style="{
              top: '100%',
              left: m.outgoing ? 'auto' : '13px',
              right: m.outgoing
                ? Math.min(13, getWindowWidth() - 500) + 'px'
                : 'auto',
              marginTop: '4px',
              zIndex: '20',
            }"
            @mouseenter="handleMessageHover(m.id)"
            @mouseleave="handleMessageLeave"
            @click.stop
          >
            <button
              @click="replyToMessage(m)"
              class="p-1.5 hover:bg-blue-100 rounded transition-colors"
              title="Trả lời"
            >
              <i class="bi bi-reply text-sm text-blue-600"></i>
            </button>
            <button
              @click="toggleQuickReactions(m, $event)"
              class="p-1.5 hover:bg-yellow-100 rounded transition-colors"
              title="Thả cảm xúc"
            >
              <i class="bi bi-emoji-smile text-sm text-yellow-600"></i>
            </button>

            <button
              @click.stop="showMessageMenuFor(m, $event)"
              class="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Tùy chọn"
            >
              <i class="bi bi-three-dots text-sm text-gray-600"></i>
            </button>
          </div>
        </div>

        <img
          v-if="m.outgoing"
          :src="userAvatar"
          class="w-8 h-8 rounded-full object-cover flex-shrink-0 ml-2"
        />
      </div>
    </main>

    <div
      v-if="replyingTo"
      class="px-4 py-2 bg-gray-100 border-t flex items-center justify-between"
    >
      <div class="flex-1 min-w-0">
        <div class="text-xs text-gray-500 font-semibold">
          Trả lời {{ replyingTo.senderName || replyingTo.sender }}
        </div>
        <div class="text-sm text-gray-700 truncate">
          {{ replyingTo.content }}
        </div>
      </div>
      <button
        @click="cancelReply"
        class="ml-2 text-gray-500 hover:text-gray-700"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <footer v-if="chat" class="p-3 border-t">
      <div class="flex items-center space-x-2">
        <button @click="toggleEmoji" class="px-2 py-2 rounded">
          <i class="bi bi-emoji-smile text-xl"></i>
        </button>
        <input
          v-model="text"
          @keydown.enter.prevent="send"
          placeholder="Nhập tin nhắn"
          class="flex-1 px-3 py-2 border rounded"
        />
        <button @click="onPickImage" class="px-2 py-2 rounded">
          <i class="bi bi-image text-xl"></i>
        </button>
        <button @click="send" class="px-4 py-2 bg-[#FF5630] text-white rounded">
          Gửi
        </button>
      </div>
      <div v-if="showEmoji" class="mt-2 bg-white border p-2 rounded max-w-xs">
        <button
          v-for="e in emojis"
          :key="e"
          @click="appendEmoji(e)"
          class="px-2 py-1"
        >
          {{ e }}
        </button>
      </div>
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        @change="onFileSelected"
      />
    </footer>

    <Teleport to="body">
      <div
        v-if="showGroupMembers"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        @click.self="showGroupMembers = false"
      >
        <div class="bg-white rounded-lg shadow-lg w-96 max-h-96 flex flex-col">
          <div class="flex-1 overflow-y-auto">
            <div
              v-if="groupMembers.length === 0"
              class="p-4 text-center text-gray-500"
            >
              Không có thành viên
            </div>

            <div
              v-for="member in groupMembers"
              :key="member.idUser"
              class="p-3 border-b hover:bg-gray-50 flex items-center justify-between"
            >
              <div class="flex items-center">
                <img
                  :src="member.avatar || '/images/Avatar/male_avatar.png'"
                  class="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <div class="font-medium text-sm">
                    {{ member.ten || member.idUser }}
                  </div>
                  <div class="text-xs text-gray-500">@{{ member.idUser }}</div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span
                  v-if="member.vaiTro === 'ADMIN'"
                  class="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                >
                  👑 Admin
                </span>
                <span
                  v-else-if="member.idUser === groupInfo?.nguoiTao"
                  class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  Người tạo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="showChatMenu && chat"
        @click.stop
        class="fixed bg-white border rounded-lg shadow-lg py-1 w-48"
        style="z-index: 9999"
        :style="{
          top: menuPos.top + 'px',
          left: menuPos.left + 'px',
        }"
      >
        <button
          @click="hideConversation"
          class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm"
        >
          <i class="bi bi-eye-slash mr-2"></i>
          Ẩn cuộc trò chuyện
        </button>
        <button
          v-if="chat.type === 'private'"
          @click="blockUserConfirm"
          class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-red-600"
        >
          <i class="bi bi-shield-slash mr-2"></i>
          Chặn người dùng
        </button>
        <button
          v-if="chat.type === 'private' && isFriend"
          @click="unfriendUser"
          class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-red-600"
        >
          <i class="bi bi-person-x mr-2"></i>
          Hủy kết bạn
        </button>
        <button
          v-if="chat.type === 'group'"
          @click="loadGroupMembers"
          class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-blue-600"
        >
          <i class="bi bi-people-fill mr-2"></i>
          Xem thành viên
        </button>
        <button
          v-if="chat.type === 'group'"
          @click="openAddMemberModal"
          class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-green-600"
        >
          <i class="bi bi-person-plus mr-2"></i>
          Thêm thành viên
        </button>
        <button
          v-if="chat.type === 'group'"
          @click="leaveGroup"
          class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-orange-600"
        >
          <i class="bi bi-box-arrow-right mr-2"></i>
          Rời khỏi nhóm
        </button>
        <button
          v-if="chat.type === 'group'"
          @click="deleteGroup"
          class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-red-600"
        >
          <i class="bi bi-trash mr-2"></i>
          Xóa nhóm
        </button>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="activeMessageMenu"
        @click.stop
        class="fixed bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-48 z-[9999]"
        :style="{
          top: messageMenuPos.top + 'px',
          left: messageMenuPos.left + 'px',
        }"
      >
        <button
          @click="
            props.chat?.type === 'group'
              ? togglePinGroupMessage(
                  messages.find((m) => m.id === activeMessageMenu)
                )
              : togglePinPrivateMessage(
                  messages.find((m) => m.id === activeMessageMenu)
                )
          "
          class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm"
        >
          <i class="bi bi-pin-angle-fill mr-2"></i>
          {{
            messages.find((m) => m.id === activeMessageMenu)?.pinned
              ? "Bỏ ghim"
              : "Ghim tin nhắn"
          }}
        </button>

        <button
          @click="hideMessage(messages.find((m) => m.id === activeMessageMenu))"
          class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-red-600"
        >
          <i class="bi bi-eye-slash mr-2"></i>
          Ẩn tin nhắn
        </button>

        <button
          v-if="messages.find((m) => m.id === activeMessageMenu)?.outgoing"
          @click="
            deleteMessage(messages.find((m) => m.id === activeMessageMenu)?.id)
          "
          class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-red-600"
        >
          <i class="bi bi-trash mr-2"></i>
          Xóa tin nhắn
        </button>
      </div>
    </Teleport>
    <AddMemberModal
      :isOpen="showAddMemberModal"
      :groupId="props.chat?.maNhom || props.chat?.id"
      :currentMembers="groupMembers"
      @close="showAddMemberModal = false"
      @added="handleMemberAdded"
    />

    <Teleport to="body">
      <div
        v-if="showQuickReactions"
        @click.stop
        class="fixed bg-white border rounded-lg shadow-lg p-3 z-[9999] flex gap-2 items-center w-auto"
        :style="{
          top: Math.max(0, reactionPickerPos.top) + 'px',
          left:
            Math.max(
              10,
              Math.min(getWindowWidth() - 280, reactionPickerPos.left - 100)
            ) + 'px',
        }"
      >
        <button
          v-for="reaction in quickReactions.slice(0, 4)"
          :key="reaction.name"
          @click="reactToMessage(showQuickReactions, reaction.name)"
          class="text-2xl hover:scale-125 transition-transform p-2 cursor-pointer hover:bg-gray-100 rounded"
          :title="reaction.name"
        >
          {{ reaction.emoji }}
        </button>

        <button
          @click="showFullEmojiPicker = true"
          class="text-2xl hover:scale-125 transition-transform p-2 cursor-pointer hover:bg-gray-100 rounded font-bold text-gray-600"
          title="Thêm emoji"
        >
          ➕
        </button>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="showFullEmojiPicker"
        class="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center"
        @click.self="showFullEmojiPicker = false"
      >
        <div class="bg-white rounded-lg shadow-lg w-96 max-h-96 flex flex-col">
          <div class="p-4 border-b flex items-center justify-between">
            <h3 class="font-semibold">Thêm cảm xúc</h3>
            <button
              @click="showFullEmojiPicker = false"
              class="text-gray-500 hover:text-gray-900"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="p-3 border-b">
            <input
              v-model="emojiSearch"
              type="text"
              placeholder="Tìm emoji..."
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#FF5630]"
            />
          </div>

          <div class="flex-1 overflow-y-auto p-3 grid grid-cols-8 gap-2">
            <button
              v-for="emoji in filteredAllEmojis"
              :key="emoji"
              @click="reactToMessage(showQuickReactions, getEmojiName(emoji))"
              class="text-2xl hover:scale-125 transition-transform p-1 cursor-pointer hover:bg-gray-100 rounded"
              :title="getEmojiName(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, onUnmounted, nextTick } from "vue";
import socketService from "../api/socketService";
import chatService from "../api/chatService";
import api from "../api/api";
import { storage, getStorageItem, setStorageItem } from "../utils/storage";
import { formatRelativeTime, formatTime } from "../utils/timeFormat";
import AddMemberModal from "./AddMemberModal.vue";
import EmojiReactionPicker from "./EmojiReactionPicker.vue";
import { useHeaderButtonState } from "../composables/useHeaderButtonState";
import { useMessageHiding } from "../composables/useMessageHiding";

const props = defineProps({
  chat: Object,
  userId: String,
  connectionState: String,
});

const emits = defineEmits([
  "delete-group",
  "unfriend",
  "sent",
  "error",
  "hide-chat",
  "block-user",
  "back-to-list",
  "viewUserProfile",
  "message-received", // Emit khi tin nhắn mới đến
]);

// Initialize friend button state composable
const {
  isFriend: friendButtonIsFriend,
  hasSentRequest,
  isLoading: friendButtonLoading,
  friendButtonText,
  loadFriendState,
  handleFriendButtonClick,
} = useHeaderButtonState();

const {
  loadHiddenMessages,
  hideMessage: hideMessageLocal,
  isMessageHidden,
} = useMessageHiding();

const messages = ref([]);
const chatInputs = ref({}); // Store input text per chat
const msgList = ref(null);
const fileInput = ref(null);
const showEmoji = ref(false);
const connectionStatus = ref("disconnected");
const showChatMenu = ref(false);
const menuButton = ref(null);
const menuPos = ref({ top: 0, left: 0 });
const showGroupMembers = ref(false);
const groupMembers = ref([]);
const groupInfo = ref(null);
const isFriend = ref(false);
const isBlocked = ref(false);
const showAddMemberModal = ref(false);

const hoveredMessage = ref(null);
const activeMessageMenu = ref(null);
const messageMenuPos = ref({ top: 0, left: 0 });
const showQuickReactions = ref(null);
const reactionPickerPos = ref({ top: 0, left: 0 });
const replyingTo = ref(null);
const showFullEmojiPicker = ref(false);
const emojiSearch = ref("");
let hoverTimeout = null;

// Pinned messages
const pinnedMessages = ref([]);
const showAllPinned = ref(false);
const maxPinnedMessages = 3;

// Computed text per chat - độc lập cho mỗi cuộc trò chuyện
const text = computed({
  get() {
    if (!props.chat?.id) return "";
    return chatInputs.value[props.chat.id] || "";
  },
  set(value) {
    if (props.chat?.id) {
      chatInputs.value[props.chat.id] = value;
    }
  },
});

// Displayed messages (filter hidden messages)
const displayedMessages = computed(() => {
  return messages.value.filter((m) => !isMessageHidden(m.id));
});

const quickReactions = [
  { name: "LIKE", emoji: "👍" },
  { name: "LOVE", emoji: "❤️" },
  { name: "HAHA", emoji: "😂" },
  { name: "WOW", emoji: "😮" },
];

// Danh sách emoji đầy đủ cho picker
const allEmojis = [
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
  "😠",
  "😡",
  "😢",
  "😣",
  "😤",
  "😥",
  "😦",
  "😧",
  "😨",
  "😩",
  "😪",
  "😫",
  "😬",
  "😭",
  "😮",
  "😯",
  "😰",
  "😱",
  "😲",
  "😳",
  "😴",
  "😵",
  "😶",
  "😷",
  "👍",
  "👎",
  "👌",
  "👊",
  "✊",
  "✋",
  "🖐",
  "🖖",
  "👋",
  "🤚",
  "🤛",
  "🤜",
  "🤞",
  "🤟",
  "🤘",
  "🤙",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "🎉",
  "🎊",
  "🎈",
  "🎁",
  "🎀",
  "🎂",
  "🎃",
  "🎄",
  "⭐",
  "🌟",
  "✨",
  "⚡",
  "🔥",
  "💥",
  "👑",
  "🏆",
  "🚀",
  "🎯",
  "💯",
  "📱",
  "💻",
  "🎮",
  "🎬",
  "🎤",
];

const filteredAllEmojis = computed(() => {
  if (!emojiSearch.value) return allEmojis;

  // Tìm kiếm đơn giản theo tên emoji
  const searchTerm = emojiSearch.value.toLowerCase();
  const emojiNames = {
    "😀": "grinning",
    "😁": "beaming",
    "😂": "joy",
    "😃": "smiley",
    "�": "smile",
    "❤️": "heart",
    "👍": "like",
    "🎉": "party",
    "🔥": "fire",
    "⭐": "star",
    "💯": "100",
    "🚀": "rocket",
    "😍": "love",
    "😂": "laugh",
    "�": "cool",
  };

  return allEmojis.filter((emoji) => {
    const name = emojiNames[emoji] || emoji;
    return name.includes(searchTerm);
  });
});

// Close menu when clicking outside
onMounted(() => {
  const closeAllMenus = (event) => {
    // Check if click is outside all menus
    const clickedElement = event.target;
    const isMenuClick = clickedElement.closest(
      ".message-menu, .reaction-picker, .chat-menu, .message-actions"
    );

    if (!isMenuClick) {
      showChatMenu.value = false;
      activeMessageMenu.value = null;
      showQuickReactions.value = null;
    }
  };

  document.addEventListener("click", closeAllMenus);

  // Cleanup on unmount
  onUnmounted(() => {
    document.removeEventListener("click", closeAllMenus);
  });
});

// Cleanup function for subscriptions
const cleanupSubscriptions = async () => {
  try {
    if (subscription && typeof subscription.unsubscribe === "function") {
      subscription.unsubscribe();
    }
  } catch (e) {
    console.warn("Error unsubscribing from private messages:", e);
  }
  subscription = null;

  try {
    if (
      groupSubscription &&
      typeof groupSubscription.unsubscribe === "function"
    ) {
      groupSubscription.unsubscribe();
    }
  } catch (e) {
    console.warn("Error unsubscribing from group:", e);
  }
  groupSubscription = null;
};
const emojis = ["😀", "😁", "😂", "😍", "👍", "🙏", "🎉"];

const avatar = computed(() => {
  if (props.chat?.avatar) return props.chat.avatar;
  if (props.chat?.gender === false) return "/images/Avatar/female_avatar.png";
  return "/images/Avatar/male_avatar.png";
});

const userAvatar = computed(() => {
  const user = storage.getUser();
  if (!user) return "/images/Avatar/male_avatar.png";
  if (user.avatar) return user.avatar;
  if (user.gioiTinh === false) return "/images/Avatar/female_avatar.png";
  return "/images/Avatar/male_avatar.png";
});

let subscription = null;
let groupSubscription = null;

const setupSubscription = async () => {
  if (!props.userId || !props.chat?.id) {
    console.warn("No userId or chat provided for subscription");
    return;
  }

  try {
    // Clean up existing subscriptions first
    await cleanupSubscriptions();

    // Ensure STOMP connection is active
    let retries = 3;
    while (retries > 0 && !socketService.isConnected()) {
      await new Promise((r) => setTimeout(r, 500));
      retries--;
    }

    if (!socketService.isConnected()) {
      console.error("STOMP not connected after retries");
      return;
    }

    // Subscribe to conversation-specific topic
    // IMPORTANT: Match backend broadcast topic exactly!
    let conversationTopic;

    if (props.chat.type === "group") {
      // Group messages: /topic/group.{maNhom}
      conversationTopic = `/topic/group.${props.chat.id}`;
    } else {
      // Private messages: MUST use maNhomSolo from chat object
      if (!props.chat.maNhomSolo) {
        console.error("❌ No maNhomSolo in chat object:", props.chat);
        console.error("Chat object:", JSON.stringify(props.chat, null, 2));
        return;
      }
      conversationTopic = `/topic/chat/private/${props.chat.maNhomSolo}`;
    }

    const client = socketService.getClient();
    if (!client) {
      console.error("STOMP client is null");
      return;
    }

    subscription = client.subscribe(conversationTopic, (msg) => {
      try {
        const parsed = JSON.parse(msg.body);

        // Check if message already exists (prevent duplicate)
        const messageId = parsed.maTinNhan || parsed.id || Date.now();
        const exists = messages.value.some((m) => m.id === messageId);
        if (exists) {
          return;
        }

        // Determine if message is outgoing (from current user)
        const isOutgoing =
          parsed.maNguoiGui === props.userId || parsed.from === props.userId;

        // Add to messages array with reply data
        const newMessage = {
          id: messageId,
          content: parsed.noiDung || parsed.text,
          time: parsed.ngayGui || new Date().toISOString(),
          outgoing: isOutgoing,
          replyToId: parsed.replyToId || null,
          replyToContent: parsed.replyToContent || null,
          replyToSender: parsed.replyToSender || null,
          sender: parsed.maNguoiGui,
          attachments: parsed.attachments || null, // Load attachments từ WebSocket
        };

        messages.value.push(newMessage);

        // Force Vue reactivity - deep trigger re-render
        const updatedMessages = JSON.parse(JSON.stringify(messages.value));
        messages.value = updatedMessages;

        console.log(
          "✅ Message added and rendered, total:",
          messages.value.length
        );

        // ✅ EMIT event để cập nhật chat list
        emits("message-received", {
          chatId: props.chat?.id,
          chatType: props.chat?.type,
          lastMessage: newMessage.content,
          time: newMessage.time,
          sender: newMessage.sender,
        });

        try {
          const key = `chat-history-${props.chat?.type || "unknown"}-${
            props.chat?.id
          }`;
          const raw = getStorageItem(key);
          const arr = raw ? JSON.parse(raw) : [];
          arr.push(newMessage);
          setStorageItem(key, JSON.stringify(arr));
        } catch (e) {
          console.warn("Failed to persist message:", e);
        }

        nextTick(() => {
          scrollToBottom();
        });
      } catch (e) {
        console.error("Failed to parse message:", e);
      }
    });
  } catch (error) {
    console.error("Failed to setup chat subscription:", error);
  }
};

watch(
  () => props.chat,
  async (newChat, oldChat) => {
    try {
      // Clear existing state
      messages.value = [];
      replyingTo.value = null; // Clear reply input when switching chat
      pinnedMessages.value = [];
      showAllPinned.value = false;
      await cleanupSubscriptions();

      if (!newChat) {
        return;
      }

      // Load friend state for private chats
      if (newChat.type === "private" && props.userId) {
        await loadFriendState(props.userId, newChat.id);
        // Sync with composable state
        isFriend.value = friendButtonIsFriend.value;
      } // Set up new subscriptions
      await setupSubscription();

      // Load saved local messages first
      try {
        const key = `chat-history-${newChat?.type || "unknown"}-${newChat?.id}`;
        const raw = getStorageItem(key);
        if (raw) {
          messages.value = JSON.parse(raw);
        } else {
          messages.value = [];
        }
      } catch (e) {
        messages.value = [];
      }

      // Load history from server and merge
      try {
        if (newChat.type === "group") {
          const res = await chatService.getGroupHistory(newChat.id);
          const data = res.data || [];
          const serverMsgs = data.map((m) => ({
            id: m.maTinNhan || m.id,
            content: m.noiDung || m.content,
            time: m.ngayGui || "",
            outgoing: m.maNguoiGui === props.userId,
            replyToId: m.replyToId,
            replyToContent: m.replyToContent,
            replyToSender: m.replyToSender,
            sender: m.maNguoiGui,
            reactions: m.reactions || [],
            attachments: m.attachments,
          }));
          const map = new Map();
          [...messages.value, ...serverMsgs].forEach((m) => map.set(m.id, m));
          messages.value = Array.from(map.values());
        } else {
          // private
          const res = await chatService.getPrivateHistory(
            props.userId,
            newChat.id
          );
          const data = res.data || [];
          const serverMsgs = data.map((m) => ({
            id: m.maTinNhan || m.id,
            content: m.noiDung || m.content,
            time: m.ngayGui || "",
            outgoing: m.maNguoiGui === props.userId,
            replyToId: m.replyToId,
            replyToContent: m.replyToContent,
            replyToSender: m.replyToSender,
            sender: m.maNguoiGui,
            reactions: m.reactions || [],
            attachments: m.attachments,
          }));
          const map = new Map();
          [...messages.value, ...serverMsgs].forEach((m) => map.set(m.id, m));
          messages.value = Array.from(map.values());
        }
      } catch (e) {
        console.warn(
          "Không lấy được lịch sử chat từ server, sử dụng localStorage nếu có",
          e
        );
      }

      // persist merged history
      try {
        const key = `chat-history-${newChat?.type || "unknown"}-${newChat?.id}`;
        setStorageItem(key, JSON.stringify(messages.value));
      } catch (e) {}

      // Load pinned messages from database
      try {
        if (newChat.type === "group") {
          const pinnedRes = await api.get("/trendy/chat/group/pinned", {
            params: { maNhom: newChat.id },
          });
          const pinned = pinnedRes.data || [];
          pinnedMessages.value = pinned.map((m) => ({
            id: m.maTinNhan || m.id,
            content: m.noiDung || m.content,
            time: m.ngayGui || "",
            pinned: true,
          }));
          console.log(
            "📌 Loaded",
            pinnedMessages.value.length,
            "pinned group messages"
          );
        } else {
          const pinnedRes = await api.get("/trendy/chat/private/pinned", {
            params: { maNhomSolo: newChat.maNhomSolo },
          });
          const pinned = pinnedRes.data || [];
          pinnedMessages.value = pinned.map((m) => ({
            id: m.maTinNhan || m.id,
            content: m.noiDung || m.content,
            time: m.ngayGui || "",
            pinned: true,
          }));
          console.log(
            "📌 Loaded",
            pinnedMessages.value.length,
            "pinned private messages"
          );
        }
      } catch (e) {
        console.warn("Failed to load pinned messages:", e);
        pinnedMessages.value = [];
      }

      scrollToBottom();
    } catch (e) {
      console.warn("Không lấy được lịch sử chat", e);
    }
  }
);

// Sync isFriend with composable state
watch(
  () => friendButtonIsFriend.value,
  (newVal) => {
    isFriend.value = newVal;
  }
);

onMounted(async () => {
  try {
    await setupSubscription();
    // Load hidden messages
    if (props.userId) {
      loadHiddenMessages(props.userId);
    }
  } catch (e) {
    console.error("Failed to setup initial chat subscription:", e);
  }
});

onUnmounted(async () => {
  await cleanupSubscriptions();
});

// Watch both userId and chat changes to reset subscriptions
watch(
  [() => props.userId, () => props.chat],
  async ([newUserId, newChat], [oldUserId, oldChat]) => {
    if (newUserId !== oldUserId || newChat?.id !== oldChat?.id) {
      try {
        await setupSubscription();
      } catch (e) {
        console.error("Failed to update chat subscription:", e);
      }
    }
  }
);

const scrollToBottom = () => {
  // simple scroll
  setTimeout(() => {
    const el = msgList.value;
    if (el) el.scrollTop = el.scrollHeight;
  }, 50);
};

const send = async () => {
  if (!text.value || !props.chat) {
    console.warn("No text or chat selected");
    return;
  }

  const payload = {
    maNguoiGui: props.userId,
    noiDung: text.value,
  };

  // Add reply information if replying
  if (replyingTo.value) {
    payload.replyToId = replyingTo.value.id;
    payload.replyToContent = replyingTo.value.content;
    payload.replyToSender = replyingTo.value.sender || props.userId;
    payload.replyToSenderName = replyingTo.value.senderName;
    console.log(
      "📌 Replying to message:",
      payload.replyToId,
      "Content:",
      payload.replyToContent
    );
  }

  const messageContent = text.value;
  text.value = ""; // Clear input immediately

  try {
    // Send message via REST API
    if (props.chat.type === "group") {
      const groupId = props.chat.maNhom || props.chat.id;

      payload.maNhom = groupId;

      await chatService.sendGroup(groupId, payload);
    } else {
      payload.maNguoiNhan = props.chat.id;

      await chatService.sendPrivate(payload);
    }

    // Clear reply state after sending
    replyingTo.value = null;

    // Message will be added via WebSocket callback
    emits("sent", payload);
    scrollToBottom();
  } catch (e) {
    console.error("Gửi tin thất bại:", e);
    text.value = messageContent; // Restore on error
    emits("error", { message: "Không thể gửi tin nhắn. Vui lòng thử lại." });
  }
};

const toggleEmoji = () => {
  showEmoji.value = !showEmoji.value;
};

const appendEmoji = (e) => {
  text.value = (text.value || "") + e;
  showEmoji.value = false;
};

const onPickImage = () => {
  if (fileInput.value) fileInput.value.click();
};

const onFileSelected = async (ev) => {
  const files = ev.target.files;
  if (!files || files.length === 0) return;

  const user = storage.getUser();
  if (!user?.id) {
    alert("Vui lòng đăng nhập trước");
    return;
  }

  // Upload and collect all file URLs
  const attachmentUrls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const response = await api.post("/trendy/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        const fileUrl = response.data.fileUrl;
        const fileName = response.data.fileName;

        // Ensure full URL if relative path
        const fullUrl = fileUrl.startsWith("http")
          ? fileUrl
          : `http://localhost:8080${fileUrl}`;

        // Store attachment info
        attachmentUrls.push({
          url: fullUrl,
          name: fileName,
          size: response.data.fileSize,
        });
      }
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert(`Lỗi upload file ${file.name}: ${error.message}`);
      return; // Stop if any file fails
    }
  }

  // Send message with attachments
  if (attachmentUrls.length > 0) {
    const payload = {
      maNguoiGui: user.id,
      noiDung: text.value || "", // Bỏ default message, gửi text nếu có
      attachments: JSON.stringify(attachmentUrls), // Pass as JSON string
    };

    try {
      if (props.chat.type === "group") {
        const groupId = props.chat.maNhom || props.chat.id;
        payload.maNhom = groupId;
        await chatService.sendGroup(groupId, payload);
      } else {
        payload.maNguoiNhan = props.chat.id;
        await chatService.sendPrivate(payload);
      }

      text.value = ""; // Clear input

      scrollToBottom();
    } catch (error) {
      console.error("❌ Send failed:", error);
      alert("Lỗi gửi tin nhắn: " + error.message);
    }
  }

  // Reset file input
  if (fileInput.value) fileInput.value.value = "";
}; // Toggle menu
const toggleChatMenu = (event) => {
  event.stopPropagation();

  if (!showChatMenu.value && menuButton.value) {
    // Calculate position
    const rect = menuButton.value.getBoundingClientRect();
    menuPos.value = {
      top: rect.bottom + 8,
      left: rect.right - 192, // 192px = w-48
    };
  }

  showChatMenu.value = !showChatMenu.value;
};

// Remove reaction helper
const removeReaction = async (messageId, emoji) => {
  try {
    const msg = messages.value.find((m) => m.id === messageId);
    if (!msg || !msg.reactions) return;

    // Remove from UI immediately
    msg.reactions = msg.reactions.filter((r) => r.emoji !== emoji);
    if (msg.reactions.length === 0) {
      msg.reactions = null;
    }

    messages.value = [...messages.value];

    // Persist to localStorage
    try {
      const key = `chat-history-${props.chat?.type || "unknown"}-${
        props.chat?.id
      }`;
      setStorageItem(key, JSON.stringify(messages.value));
    } catch (e) {
      console.warn("Failed to persist reaction removal:", e);
    }
  } catch (error) {
    console.error("Remove reaction failed:", error);
  }
};

const handleFriendHeaderButtonClick = async () => {
  if (!props.chat || !props.userId) {
    console.warn("Missing chat or userId");
    return;
  }

  const result = await handleFriendButtonClick(props.userId, props.chat.id);

  if (!result.success) {
    alert(`Lỗi: Không thể thực hiện hành động`);
    return;
  }

  // Update isFriend state based on result
  if (result.action === "accepted" || result.action === "send") {
    isFriend.value = result.newStatus === "accepted";
  }

  // Log action but NO ALERT
};

// Add friend helper
const addFriend = async () => {
  try {
    const token = storage.getToken();
    if (!token) return alert("Vui lòng đăng nhập");

    // Extract userId from token
    const payload = JSON.parse(atob(token.split(".")[1]));
    const from = payload.userId || payload.sub;

    if (!from) return alert("Không thể lấy user ID từ token");
    const to = props.chat?.id;
    if (!to) return;

    await api.post(`/trendy/friends/request`, {
      from: String(from),
      to: String(to),
    });
    alert("Đã gửi lời mời kết bạn");
  } catch (e) {
    console.error("Gửi lời mời thất bại", e);
    alert("Gửi lời mời thất bại: " + (e.response?.data?.message || e.message));
  }
};

// Hide conversation
const hideConversation = () => {
  showChatMenu.value = false;
  if (confirm(`Ẩn cuộc trò chuyện với ${props.chat?.name}?`)) {
    emits("hide-chat", props.chat?.id);
  }
};

// Block user with confirmation
const blockUserConfirm = async () => {
  showChatMenu.value = false;

  if (
    !confirm(
      `Chặn ${props.chat?.name}?\n\nSau khi chặn:\n- Bạn sẽ không nhận được tin nhắn từ người này\n- Hủy kết bạn tự động\n- Không thấy nhau trong tìm kiếm`
    )
  ) {
    return;
  }

  try {
    emits("block-user", props.chat?.id);
  } catch (error) {
    console.error("Block user failed:", error);
    alert("Không thể chặn người dùng");
  }
};

// Unfriend user
const unfriendUser = async () => {
  showChatMenu.value = false;

  if (!confirm(`Hủy kết bạn với ${props.chat?.name}?`)) {
    return;
  }

  try {
    const token = storage.getToken();
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const myUserId = payload.userId || payload.sub;
    const friendId = props.chat?.id;

    // Call unfriend API directly
    await api.delete("/trendy/friends/unfriend", {
      params: { userId1: myUserId, userId2: friendId },
    });

    alert("Đã hủy kết bạn");

    // Update friend state
    isFriend.value = false;
    await loadFriendState(myUserId, friendId);
  } catch (error) {
    console.error("Unfriend failed:", error);
    alert(
      "Không thể hủy kết bạn: " +
        (error.response?.data?.message || error.message)
    );
  }
};

// Message action functions
const replyToMessage = (message) => {
  replyingTo.value = message;
  activeMessageMenu.value = null;
  showQuickReactions.value = null;
  text.value = "";
};

// Scroll to original message when clicking reply preview
const scrollToOriginalMessage = (messageId) => {
  if (!messageId) return;

  const element = document.querySelector(`[data-message-id="${messageId}"]`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    element.classList.add("ring-2 ring-orange-500");
    setTimeout(() => element.classList.remove("ring-2 ring-orange-500"), 2000);
  } else {
    console.warn("Message not found:", messageId);
    alert("Tin nhắn gốc không tìm thấy hoặc đã bị xóa");
  }
};

const toggleQuickReactions = (message, event) => {
  event.stopPropagation();
  console.log(
    "🎯 Toggle reactions for:",
    message.id,
    "Current:",
    showQuickReactions.value
  );

  if (showQuickReactions.value === message.id) {
    showQuickReactions.value = null;

    return;
  }

  const rect = event.currentTarget.getBoundingClientRect();
  // Position picker above the button, adjust left/right based on window width
  let left = rect.left - 100;

  // If too close to right edge, position to the left instead
  if (rect.left > getWindowWidth() - 300) {
    left = Math.max(10, rect.left - 280);
  }

  reactionPickerPos.value = {
    top: rect.top - 250, // Position above
    left: left,
  };

  showQuickReactions.value = message.id;
  activeMessageMenu.value = null;
};

const togglePinMessage = async (message) => {
  try {
    const groupId = props.chat?.maNhom || props.chat?.id;

    if (message.pinned) {
      await api.post(`/trendy/chat/group/unpin/${message.id}`, null, {
        params: { groupId },
      });
      message.pinned = false;
      pinnedMessages.value = pinnedMessages.value.filter(
        (m) => m.id !== message.id
      );
    } else {
      if (pinnedMessages.value.length >= maxPinnedMessages) {
        alert(`Chỉ có thể ghim tối đa ${maxPinnedMessages} tin nhắn`);
        return;
      }

      await api.post(`/trendy/chat/group/pin/${message.id}`, null, {
        params: { groupId },
      });
      message.pinned = true;
      pinnedMessages.value.push(message);
    }
    activeMessageMenu.value = null;
  } catch (error) {
    console.error("Pin/unpin failed:", error);
    alert("Không thể ghim/bỏ ghim tin nhắn: " + error.response?.data?.error);
  }
};

const togglePinPrivateMessage = async (message) => {
  try {
    const messageId = message.id;
    console.log(
      "📌 Toggling private message pin:",
      messageId,
      "Current pinned:",
      message.pinned
    );

    if (message.pinned) {
      // Unpin
      await api.post(`/trendy/chat/private/unpin/${messageId}`);
      message.pinned = false;
      pinnedMessages.value = pinnedMessages.value.filter(
        (m) => m.id !== messageId
      );
    } else {
      // Pin
      if (pinnedMessages.value.length >= maxPinnedMessages) {
        alert(`Chỉ có thể ghim tối đa ${maxPinnedMessages} tin nhắn`);
        return;
      }
      await api.post(`/trendy/chat/private/pin/${messageId}`);
      message.pinned = true;
      pinnedMessages.value.push(message);
    }
    activeMessageMenu.value = null;
  } catch (error) {
    console.error(
      "❌ Private pin/unpin failed:",
      error.response?.data || error.message
    );
    alert(
      "Không thể ghim/bỏ ghim: " +
        (error.response?.data?.error || error.message)
    );
  }
};

const togglePinGroupMessage = async (message) => {
  try {
    const messageId = message.id;
    if (message.pinned) {
      await api.post(`/trendy/chat/group/unpin/${messageId}`);
      message.pinned = false;
      pinnedMessages.value = pinnedMessages.value.filter(
        (m) => m.id !== messageId
      );
    } else {
      if (pinnedMessages.value.length >= maxPinnedMessages) {
        alert(`Chỉ có thể ghim tối đa ${maxPinnedMessages} tin nhắn`);
        return;
      }
      await api.post(`/trendy/chat/group/pin/${messageId}`);
      message.pinned = true;
      pinnedMessages.value.push(message);
    }
    activeMessageMenu.value = null;
  } catch (error) {
    console.error("❌ Group pin/unpin failed:", error);
    alert(
      "Không thể ghim/bỏ ghim: " +
        (error.response?.data?.error || error.message)
    );
  }
};

const removePinnedMessage = async (messageId) => {
  try {
    const isGroup = props.chat?.type === "group";
    const endpoint = isGroup
      ? `/trendy/chat/group/unpin/${messageId}`
      : `/trendy/chat/private/unpin/${messageId}`;

    await api.post(endpoint);

    // Update local state
    const message = messages.value.find((m) => m.id === messageId);
    if (message) message.pinned = false;

    pinnedMessages.value = pinnedMessages.value.filter(
      (m) => m.id !== messageId
    );
  } catch (error) {
    console.error("❌ Unpin failed:", error);
    alert(
      "Không thể bỏ ghim tin nhắn: " +
        (error.response?.data?.error || error.message)
    );
  }
};

// Debug: Log all reactions
const debugReactions = () => {
  messages.value.forEach((m) => {
    if (m.reactions && m.reactions.length > 0) {
      console.log(
        `  Message ${m.id.substring(0, 8)}... has reactions:`,
        m.reactions
      );
    }
  });
};

// React to message - with full logging
const reactToMessage = async (messageId, reactionName) => {
  try {
    console.log(
      "🎯 REACT START - messageId:",
      messageId,
      "reaction:",
      reactionName
    );

    let emoji = null;
    for (const r of quickReactions) {
      if (r.name === reactionName) {
        emoji = r.emoji;
        break;
      }
    }
    if (!emoji) {
      for (const e of allEmojis) {
        if (getEmojiName(e) === reactionName) {
          emoji = e;
          break;
        }
      }
    }
    emoji = emoji || reactionName;

    const payload = {
      messageId,
      userId: props.userId,
      reaction: emoji,
    };

    const endpoint =
      props.chat?.type === "group"
        ? "/trendy/chat/group/react"
        : "/trendy/chat/private/react";

    const response = await api.post(endpoint, payload);

    const msg = messages.value.find((m) => m.id === messageId);

    if (msg) {
      if (!msg.reactions) msg.reactions = [];

      const existing = msg.reactions.find((r) => r.emoji === emoji);
      if (existing) {
        existing.count = (existing.count || 1) + 1;
      } else {
        msg.reactions.push({ emoji: emoji, count: 1 });
      }

      messages.value = [...messages.value];

      // Persist to localStorage
      try {
        const key = `chat-history-${props.chat?.type || "unknown"}-${
          props.chat?.id
        }`;
        setStorageItem(key, JSON.stringify(messages.value));
      } catch (e) {
        console.error("❌ Failed to save to localStorage:", e);
      }

      debugReactions();
    }
    showQuickReactions.value = null;
    showFullEmojiPicker.value = false;
  } catch (error) {
    console.error("❌ Reaction error:", error.response?.data || error.message);
  }
};

// Get window width
const getWindowWidth = () => window.innerWidth;

// Get emoji name for search (simple mapping)
const getEmojiName = (emoji) => {
  const emojiNames = {
    "😀": "grinning",
    "😁": "beaming",
    "😂": "joy",
    "😃": "smiley",
    "😄": "smile",
    "❤️": "heart",
    "👍": "like thumbs up",
    "🎉": "party celebration",
    "🔥": "fire",
    "⭐": "star",
    "💯": "100 perfect",
    "🚀": "rocket",
    "😍": "love",
    "😮": "wow surprised",
    "😂": "laugh",
    "😎": "cool sunglasses",
  };
  return emojiNames[emoji] || emoji;
};

// Extract filename from message content
const extractFileName = (content) => {
  const match = content.match(/\[📎\s*(.+?)\]/);
  return match ? match[1] : "File";
};

// Extract file URL from message content
const extractFileUrl = (content) => {
  const lines = content.split("\n");
  return lines.length > 1 ? lines[1].trim() : "";
};

// Handle message hover
const handleMessageHover = (messageId) => {
  clearTimeout(hoverTimeout);
  hoveredMessage.value = messageId;
};

// Handle message leave
const handleMessageLeave = () => {
  hoverTimeout = setTimeout(() => {
    hoveredMessage.value = null;
  }, 100);
};

// Handle member added to group
const handleMemberAdded = (newMembers) => {
  groupMembers.value = newMembers;
};

// Navigate to user profile
const goToUserProfile = (userId) => {
  if (!userId || userId === props.userId) return;

  emits("viewUserProfile", userId);
};

// Delete message helper - riêng solo & group
const deleteMessage = async (messageId) => {
  if (!confirm("Xóa tin nhắn này?")) return;
  try {
    const msg = messages.value.find((m) => m.id === messageId);

    const isGroup = props.chat?.type === "group";
    const endpoint = isGroup
      ? `/trendy/chat/group/message/${messageId}`
      : `/trendy/chat/private/message/${messageId}`;

    const response = await api.delete(endpoint, {
      params: { userId: props.userId },
    });

    messages.value = messages.value.filter((m) => m.id !== messageId);
    console.log(
      "✅ Message deleted permanently, remaining:",
      messages.value.length
    );

    // Persist to localStorage
    try {
      const key = `chat-history-${props.chat?.type || "unknown"}-${
        props.chat?.id
      }`;
      setStorageItem(key, JSON.stringify(messages.value));
    } catch (e) {}

    activeMessageMenu.value = null;
  } catch (error) {
    console.error("❌ Delete failed:", error);
    console.error("   Status:", error.response?.status);
    console.error("   Data:", error.response?.data);

    if (error.response?.status === 404) {
      console.log(
        "⚠️ Message not found on server, checking if it's only in localStorage"
      );
      // Remove from local anyway
      messages.value = messages.value.filter((m) => m.id !== messageId);
      activeMessageMenu.value = null;
      alert("Tin nhắn đã được xóa");
    } else {
      alert(
        "Không thể xóa tin nhắn: " +
          (error.response?.data?.error || error.message)
      );
    }
  }
};

// Hide message helper
const hideMessage = async (message) => {
  try {
    const endpoint =
      props.chat?.type === "group"
        ? `/trendy/chat/group-message/${message.id}/hide`
        : `/trendy/chat/message/${message.id}/hide`;

    await api.post(endpoint, null, {
      params: { userId: props.userId },
    });

    hideMessageLocal(message.id);
    messages.value = messages.value.filter((m) => m.id !== message.id);

    // Persist to localStorage
    try {
      const key = `chat-history-${props.chat?.type || "unknown"}-${
        props.chat?.id
      }`;
      setStorageItem(key, JSON.stringify(messages.value));
    } catch (e) {}

    activeMessageMenu.value = null;
  } catch (error) {
    console.error("Hide failed:", error);
    alert("Không thể ẩn tin nhắn: " + error.response?.data?.error);
  }
};

// Show message menu
const showMessageMenuFor = (message, event) => {
  event.stopPropagation();
  activeMessageMenu.value = message.id;
  const rect = event.currentTarget.getBoundingClientRect();

  let top = rect.bottom + 4;
  let left = rect.left;

  // Adjust if menu would go off-screen
  const menuWidth = 200; // w-48 = 12rem = 192px
  const menuHeight = 160; // Approximate height of menu

  // Check right boundary
  if (left + menuWidth > window.innerWidth) {
    left = Math.max(10, window.innerWidth - menuWidth - 10);
  }

  // Check bottom boundary
  if (top + menuHeight > window.innerHeight) {
    top = Math.max(10, rect.top - menuHeight - 4);
  }

  messageMenuPos.value = { top, left };
};

// Check if file is image
const isImage = (fileName) => {
  if (!fileName) return false;
  const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  return imageExts.some((ext) => fileName.toLowerCase().endsWith(ext));
};

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// Download file helper - proper method
const downloadFile = (url, fileName) => {
  try {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        const blobUrl = window.URL.createObjectURL(blob);
        link.href = blobUrl;
        link.download = fileName || "file";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("❌ Download error:", error);
        alert("Lỗi tải file: " + error.message);
      });
  } catch (error) {
    console.error("❌ Download error:", error);
    alert("Lỗi tải file");
  }
};

// View image in new tab
const viewImage = (url) => {
  window.open(url, "_blank");
};

// Format last message for preview (show file/image indicator)
const formatLastMessagePreview = (message) => {
  if (!message) return "Không có tin nhắn";

  if (message.attachments) {
    try {
      const attachments =
        typeof message.attachments === "string"
          ? JSON.parse(message.attachments)
          : message.attachments;

      if (Array.isArray(attachments) && attachments.length > 0) {
        const hasImage = attachments.some((a) => isImage(a.name));
        if (hasImage) {
          return message.outgoing
            ? "Bạn đã gửi hình ảnh"
            : `${message.senderName || "Họ"} đã gửi hình ảnh`;
        } else {
          return message.outgoing
            ? `Bạn đã gửi ${attachments.length} file`
            : `${message.senderName || "Họ"} đã gửi ${attachments.length} file`;
        }
      }
    } catch (e) {
      console.warn("Failed to parse attachments in preview:", e);
    }
  }

  return message.content || "Không có tin nhắn";
};
</script>

<style scoped>
/* Action buttons - positioned to the side of messages */
.message-actions {
  position: absolute;
  top: 0;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s;
}

.group:hover .message-actions {
  opacity: 1;
}
</style>
