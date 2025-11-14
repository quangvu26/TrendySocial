// filepath:
f:\Du_An\TrendySocialApp\trendy-front\src\components\UserOtherProfile.vue
<template>
  <div class="w-full h-screen bg-gray-50 overflow-hidden flex flex-col">
    <div
      class="bg-white border-b px-2 py-0 flex items-center justify-between flex-shrink-0"
    >
      <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-lg">
        <i class="bi bi-chevron-left text-2xl"></i>
      </button>
      <h2 class="text-l font-semibold">
        {{ otherUser?.name || otherUser?.ten || "Trang cá nhân" }}
      </h2>
      <div class="w-10"></div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="bg-white border-b">
        <div class="px-6 py-6 flex flex-col items-center">
          <img
            :src="otherUserAvatar"
            class="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mb-4"
          />
          <h1 class="text-2xl font-bold mb-1">
            {{ otherUser?.name || otherUser?.ten || otherUser?.id }}
          </h1>
          <p class="text-gray-600 text-sm mb-4">@{{ otherUser?.id }}</p>
          <p class="text-gray-700 text-sm mb-6 text-center">
            {{ otherUser?.tieuSu || "Chưa có mô tả" }}
          </p>

          <div class="flex gap-2 mb-6">
            <button
              v-if="!isFriend && !hasRequestPending"
              @click="sendFriendRequest"
              class="px-6 py-2 bg-[#FF5630] text-white rounded-lg font-medium hover:bg-[#FF4520] text-sm"
            >
              Kết bạn
            </button>
            <button
              v-else-if="hasRequestPending"
              disabled
              class="px-6 py-2 bg-yellow-500 text-white rounded-lg font-medium text-sm opacity-50"
            >
              Đã gửi lời mời
            </button>
            <button
              v-else
              @click="startChat"
              class="px-6 py-2 bg-[#FF5630] text-white rounded-lg font-medium hover:bg-[#FF4520] text-sm"
            >
              Nhắn tin
            </button>
            <button
              @click="blockUser"
              class="px-6 py-2 bg-gray-200 text-black rounded-lg font-medium hover:bg-gray-300 text-sm"
            >
              Chặn
            </button>
          </div>

          <div class="flex gap-12 mb-6">
            <div class="text-center">
              <p class="font-bold text-lg">{{ postsCount }}</p>
              <p class="text-gray-600 text-sm">bài viết</p>
            </div>
            <div class="text-center">
              <p class="font-bold text-lg">{{ friendsCount }}</p>
              <p class="text-gray-600 text-sm">bạn bè</p>
            </div>
            <div class="text-center">
              <p class="font-bold text-lg">{{ likesCount }}</p>
              <p class="text-gray-600 text-sm">lượt like</p>
            </div>
          </div>

          <div class="flex gap-12 text-sm border-t w-full justify-center pt-3">
            <button
              @click="activeTab = 'posts'"
              :class="{
                'text-black border-b-2 border-black': activeTab === 'posts',
                'text-gray-600': activeTab !== 'posts',
              }"
              class="pb-3 font-medium"
            >
              <i class="bi bi-grid-3x2 mr-2"></i>Bài đăng
            </button>
          </div>
        </div>

        <div class="px-4 py-4">
          <div v-if="isLoading" class="text-center py-12">
            <i
              class="bi bi-arrow-repeat animate-spin text-2xl text-gray-400"
            ></i>
          </div>
          <div v-else-if="posts.length === 0" class="text-center py-12">
            <i class="bi bi-inbox text-4xl text-gray-300 block mb-3"></i>
            <p class="text-gray-500 text-sm">Người này chưa có bài đăng nào</p>
          </div>
          <div
            v-else
            class="grid w-full gap-1"
            style="grid-template-columns: repeat(4, 1fr); grid-auto-rows: 250px"
          >
            <div
              v-for="post in posts"
              :key="post.id"
              class="relative group cursor-pointer overflow-hidden bg-gray-200"
              @click="openPostDetail(post)"
            >
              <img
                v-if="post.images && post.images.length > 0"
                :src="getImageUrl(post.images[0])"
                :alt="post.content"
                class="w-full h-full object-cover transition-transform group-hover:scale-110"
                loading="lazy"
              />
              <div
                v-else
                class="w-full h-full bg-gray-300 flex items-center justify-center"
              >
                <i class="bi bi-image text-gray-400 text-3xl"></i>
              </div>

              <div
                class="post-overlay absolute inset-0 bg-black transition-all duration-300 flex items-center justify-center gap-6"
              >
                <div class="text-white flex items-center gap-2">
                  <i class="bi bi-heart-fill text-3xl drop-shadow-lg"></i>
                  <span class="text-lg font-bold drop-shadow-lg">{{
                    post.likes || 0
                  }}</span>
                </div>
                <div class="text-white flex items-center gap-2">
                  <i class="bi bi-chat-fill text-3xl drop-shadow-lg"></i>
                  <span class="text-lg font-bold drop-shadow-lg">{{
                    post.comments || 0
                  }}</span>
                </div>
                <div class="text-white flex items-center gap-2">
                  <i class="bi bi-eye-fill text-3xl drop-shadow-lg"></i>
                  <span class="text-lg font-bold drop-shadow-lg">{{
                    post.views || 0
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="showPostDetailModal && selectedPost"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style="z-index: 99999"
      @click.self="showPostDetailModal = false"
    >
      <div
        class="bg-white rounded-lg w-full max-w-4xl h-[600px] overflow-hidden flex"
      >
        <div class="flex-1 bg-black flex items-center justify-center relative">
          <img
            v-if="selectedPost.images && selectedPost.images.length > 0"
            :src="getImageUrl(selectedPost.images[0])"
            class="w-full h-full object-contain"
            @error="(e) => (e.target.style.display = 'none')"
          />
        </div>

        <div class="w-96 flex flex-col bg-white h-full border-l">
          <div class="p-3 border-b flex-shrink-0">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-start gap-2 flex-1">
                <img
                  :src="selectedPost.authorAvatar"
                  class="w-9 h-9 rounded-full flex-shrink-0"
                />
                <div>
                  <p class="font-semibold text-sm">
                    {{ selectedPost.authorName }}
                  </p>
                  <div class="text-xs text-gray-500">
                    {{
                      selectedPost.privacy === "CONG_KHAI"
                        ? "🌐 Công khai"
                        : selectedPost.privacy === "BAN_BE"
                        ? "👥 Bạn bè"
                        : "🔒 Một mình"
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-3 py-2 border-b flex-shrink-0">
            <p class="text-sm text-gray-800 line-clamp-2">
              {{ selectedPost.content }}
            </p>
            <p class="text-xs text-gray-400 mt-1">
              {{ formatDate(selectedPost.createdAt) }}
            </p>
          </div>

          <div class="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
            <div
              v-if="
                !selectedPost.commentsList ||
                selectedPost.commentsList.length === 0
              "
              class="text-center py-8 text-gray-500"
            >
              <i class="bi bi-chat-left text-3xl text-gray-300 block mb-2"></i>
              <p class="text-sm">Chưa có bình luận nào</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="comment in selectedPost.commentsList"
                :key="comment.id"
                class="border-l-2 border-gray-200 pl-3 pb-2"
              >
                <div class="flex gap-3">
                  <img
                    :src="
                      comment.authorAvatar || '/images/Avatar/male_avatar.png'
                    "
                    class="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                      <div class="flex-1">
                        <p class="font-medium text-sm">
                          {{ comment.authorName }}
                        </p>
                        <p class="text-sm text-gray-800 break-words">
                          {{ comment.content }}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                          {{ formatDate(comment.createdAt) }}
                        </p>
                      </div>
                      <div class="relative">
                        <button
                          @click="toggleCommentMenu(comment)"
                          class="text-gray-500 hover:text-gray-700 text-lg"
                        >
                          ⋯
                        </button>
                        <div
                          v-if="comment.showMenu"
                          class="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-max"
                          @click.stop
                        >
                          <button
                            v-if="
                              comment.authorId === currentUserId ||
                              currentUserId === selectedPost.authorId
                            "
                            @click="deleteComment(comment.id)"
                            class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                          >
                            <i class="bi bi-trash mr-2"></i>Xóa
                          </button>
                          <button
                            v-if="comment.authorId === currentUserId"
                            @click="hideComment(comment.id)"
                            class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            <i class="bi bi-eye-slash mr-2"></i>Ẩn
                          </button>
                          <button
                            v-if="comment.authorId !== currentUserId"
                            @click="hideComment(comment.id)"
                            class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            <i class="bi bi-eye-slash mr-2"></i>Ẩn
                          </button>
                          <button
                            v-if="comment.authorId !== currentUserId"
                            @click="blockCommentAuthor(comment.authorId)"
                            class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-orange-500"
                          >
                            <i class="bi bi-slash-circle mr-2"></i>Chặn
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="flex gap-4 mt-2 text-xs text-gray-500">
                      <button
                        @click="toggleCommentLike(comment)"
                        :class="
                          comment.liked ? 'text-red-500' : 'hover:text-red-500'
                        "
                        class="flex items-center gap-1 transition-colors"
                      >
                        <i
                          :class="comment.liked ? 'bi-heart-fill' : 'bi-heart'"
                          class="bi"
                        ></i>
                        <span>{{ comment.likes || 0 }}</span>
                      </button>
                      <button
                        @click="replyToComment(comment)"
                        class="hover:text-gray-700 font-medium"
                      >
                        Trả lời
                      </button>
                      <button
                        v-if="comment.replies && comment.replies.length > 0"
                        @click="toggleReplies(comment)"
                        class="text-blue-500 hover:text-blue-700 font-medium"
                      >
                        ---{{
                          comment.showReplies
                            ? "Thu gọn"
                            : `Xem ${comment.replies.length}`
                        }}
                        câu trả lời
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  v-if="comment.replies && comment.replies.length > 0"
                  class="mt-2 ml-14"
                >
                  <div v-if="comment.showReplies" class="space-y-2">
                    <div
                      v-for="reply in comment.replies"
                      :key="reply.id"
                      class="flex gap-2 border-l-2 border-gray-300 pl-2"
                    >
                      <img
                        :src="
                          reply.authorAvatar || '/images/Avatar/male_avatar.png'
                        "
                        class="w-7 h-7 rounded-full flex-shrink-0"
                      />
                      <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-2">
                          <div class="flex-1">
                            <p class="font-medium text-xs">
                              {{ reply.authorName }}
                            </p>
                            <p class="text-xs text-gray-800 break-words">
                              {{ reply.content }}
                            </p>
                            <p class="text-xs text-gray-500 mt-0.5">
                              {{ formatDate(reply.createdAt) }}
                            </p>
                          </div>
                          <div class="relative">
                            <button
                              @click="toggleReplyMenu(reply)"
                              class="text-gray-500 hover:text-gray-700 text-sm"
                            >
                              ⋯
                            </button>
                            <div
                              v-if="reply.showMenu"
                              class="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-max"
                              @click.stop
                            >
                              <button
                                v-if="reply.authorId === currentUserId"
                                @click="deleteComment(reply.id)"
                                class="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100 text-red-500"
                              >
                                <i class="bi bi-trash mr-2"></i>Xóa
                              </button>
                              <button
                                v-if="reply.authorId === currentUserId"
                                @click="hideComment(reply.id)"
                                class="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100"
                              >
                                <i class="bi bi-eye-slash mr-2"></i>Ẩn
                              </button>
                              <button
                                v-if="reply.authorId !== currentUserId"
                                @click="hideComment(reply.id)"
                                class="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100"
                              >
                                <i class="bi bi-eye-slash mr-2"></i>Ẩn
                              </button>
                              <button
                                v-if="reply.authorId !== currentUserId"
                                @click="blockCommentAuthor(reply.authorId)"
                                class="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100 text-orange-500"
                              >
                                <i class="bi bi-slash-circle mr-2"></i>Chặn
                              </button>
                            </div>
                          </div>
                        </div>

                        <div class="flex gap-3 mt-1 text-xs text-gray-500">
                          <button
                            @click="toggleReplyLike(reply)"
                            :class="
                              reply.liked
                                ? 'text-red-500'
                                : 'hover:text-red-500'
                            "
                            class="flex items-center gap-1 transition-colors"
                          >
                            <i
                              :class="
                                reply.liked ? 'bi-heart-fill' : 'bi-heart'
                              "
                              class="bi"
                            ></i>
                            <span>{{ reply.likes || 0 }}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t p-3 space-y-2 flex-shrink-0">
            <div class="flex items-center gap-3 justify-between">
              <div class="flex items-center gap-3">
                <button
                  @click="toggleLike(selectedPost.id)"
                  :class="
                    selectedPost.liked
                      ? 'text-red-500'
                      : 'text-gray-600 hover:text-red-500'
                  "
                  class="text-xl"
                >
                  <i
                    :class="selectedPost.liked ? 'bi-heart-fill' : 'bi-heart'"
                    class="bi"
                  ></i>
                </button>
                <button
                  @click="sharePost(selectedPost)"
                  class="text-gray-600 hover:text-gray-900 text-xl"
                >
                  <i class="bi bi-share"></i>
                </button>
              </div>
              <button
                @click="toggleSave(selectedPost.id)"
                :class="
                  selectedPost.saved
                    ? 'text-yellow-500'
                    : 'text-gray-600 hover:text-yellow-500'
                "
                class="text-xl"
              >
                <i
                  :class="
                    selectedPost.saved ? 'bi-bookmark-fill' : 'bi-bookmark'
                  "
                  class="bi"
                ></i>
              </button>
            </div>

            <div class="text-xs font-medium">
              {{ selectedPost.likes }} lượt thích
            </div>

            <div class="flex gap-2 border-t pt-3">
              <input
                v-model="newComment"
                placeholder="Thêm bình luận..."
                class="flex-1 text-sm bg-transparent focus:outline-none"
                @keydown.enter="submitComment"
              />
              <button
                @click="submitComment"
                :disabled="!newComment.trim()"
                class="text-[#FF5630] font-medium text-sm disabled:opacity-50 hover:font-bold"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/api";
import { storage } from "../utils/storage";

const emit = defineEmits(["close", "startChat"]);

const props = defineProps({
  userId: String,
});

const otherUser = ref(null);
const otherUserAvatar = ref("/images/Avatar/male_avatar.png");
const posts = ref([]);
const postsCount = ref(0);
const friendsCount = ref(0);
const likesCount = ref(0);
const isFriend = ref(false);
const hasRequestPending = ref(false);
const isLoading = ref(false);
const activeTab = ref("posts");
const showPostDetailModal = ref(false);
const selectedPost = ref(null);
const newComment = ref("");
const token = ref(localStorage.getItem("token"));
const currentUserId = ref(storage.getUser()?.id || null);

const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return `http://localhost:8080${img}`;
  return `http://localhost:8080/uploads/posts/${img}`;
};

const formatDate = (d) => {
  if (!d) return "";
  try {
    const dt = new Date(d);
    const now = new Date();
    const diff = now - dt;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

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

const deleteComment = async (commentId) => {
  if (!confirm("Xóa bình luận này?")) return;
  try {
    await api.delete(
      `/trendy/posts/${selectedPost.value.id}/comment/${commentId}`,
      { headers: { Authorization: `Bearer ${token.value}` } }
    );
    selectedPost.value.commentsList = selectedPost.value.commentsList.filter(
      (c) => {
        if (c.id === commentId) return false;
        if (c.replies) {
          c.replies = c.replies.filter((r) => r.id !== commentId);
        }
        return true;
      }
    );
    alert("Bình luận đã xóa");
  } catch (error) {
    console.error("Failed to delete comment:", error);
  }
};

const hideComment = async (commentId) => {
  if (!confirm("Ẩn bình luận này?")) return;
  try {
    await api
      .post(
        `/trendy/posts/${selectedPost.value.id}/comment/${commentId}/hide`,
        {},
        { headers: { Authorization: `Bearer ${token.value}` } }
      )
      .catch(() => console.warn("Hide API not available"));
    selectedPost.value.commentsList = selectedPost.value.commentsList.filter(
      (c) => {
        if (c.id === commentId) return false;
        if (c.replies) {
          c.replies = c.replies.filter((r) => r.id !== commentId);
        }
        return true;
      }
    );
    alert("Bình luận đã ẩn");
  } catch (error) {
    console.error("Failed to hide comment:", error);
  }
};

const toggleCommentMenu = (comment) => {
  comment.showMenu = !comment.showMenu;
};

const toggleReplyMenu = (reply) => {
  reply.showMenu = !reply.showMenu;
};

const blockCommentAuthor = async (userId) => {
  if (!confirm("Chặn người dùng này?")) return;
  try {
    const currentUser = storage.getUser();
    await api.post("/trendy/block", {
      blockerId: currentUser.id,
      blockedId: userId,
    });
    alert("Đã chặn người dùng");
  } catch (error) {
    console.error("Failed to block user:", error);
  }
};

const replyToComment = (comment) => {
  newComment.value = `@${comment.authorName} `;
  selectedPost.value.replyingToComment = {
    id: comment.id,
    authorName: comment.authorName,
    content: comment.content,
  };
  setTimeout(() => {
    document.querySelector('input[placeholder="Thêm bình luận..."]')?.focus();
  }, 100);
};

const toggleReplies = (comment) => {
  comment.showReplies = !comment.showReplies;
};

const submitComment = async () => {
  if (!newComment.value.trim() || !selectedPost.value) return;
  try {
    const currentUser = storage.getUser();
    let replyToId = null;
    let parentComment = null;
    let mentions = [];

    if (selectedPost.value.replyingToComment) {
      replyToId = selectedPost.value.replyingToComment.id;
      parentComment = selectedPost.value.commentsList.find(
        (c) => c.id === replyToId
      );
    }

    // Extract @mentions from comment
    const mentionRegex = /@(\w+)/g;
    let match;
    while ((match = mentionRegex.exec(newComment.value)) !== null) {
      mentions.push(match[1]);
    }

    const payload = {
      content: newComment.value,
      maTraLoi: replyToId || null,
    };

    const commentRes = await api.post(
      `/trendy/posts/${selectedPost.value.id}/comment`,
      payload,
      { headers: { Authorization: `Bearer ${token.value}` } }
    );

    if (!commentRes.data) {
      throw new Error("No comment data returned");
    }

    const userRes = await api.get(`/trendy/user/${currentUser.id}`);
    const userData = userRes.data || {};

    const newReply = {
      id: commentRes.data.id || commentRes.data.idComment || Date.now(),
      content: newComment.value,
      authorName: userData.ten || userData.name || currentUser.id,
      authorId: currentUser.id,
      authorAvatar: userData.avatar || "/images/Avatar/male_avatar.png",
      createdAt: commentRes.data.createdAt || new Date().toISOString(),
      likes: 0,
      liked: false,
      showMenu: false,
    };

    if (!selectedPost.value.commentsList) selectedPost.value.commentsList = [];

    if (replyToId && parentComment) {
      if (!parentComment.replies) parentComment.replies = [];
      parentComment.replies.push(newReply);
      parentComment.showReplies = true;
    } else {
      selectedPost.value.commentsList.push(newReply);
    }

    selectedPost.value.comments = (selectedPost.value.comments || 0) + 1;

    // Send notifications for post owner if commenter is different
    if (selectedPost.value.authorId !== currentUser.id) {
      try {
        const senderName = userData.ten || userData.name || currentUser.id;
        await api.post(
          `/trendy/notification`,
          {
            idNguoiNhan: selectedPost.value.authorId,
            maNguoiGui: currentUser.id,
            senderName: senderName,
            type: "COMMENT",
            postId: selectedPost.value.id,
            content: `đã bình luận bài viết của bạn`,
            trangThai: false,
            noiDung: `${senderName} đã bình luận bài viết của bạn`,
          },
          { headers: { Authorization: `Bearer ${token.value}` } }
        );
      } catch (e) {
        console.warn("Failed to send comment notification:", e);
      }
    }

    // Send notifications for @mentions
    for (let mentionedUser of mentions) {
      try {
        await api.post(
          `/trendy/notification`,
          {
            idNguoiNhan: mentionedUser,
            maNguoiGui: currentUser.id,
            senderName: userData.ten || userData.name || currentUser.id,
            type: "MENTION",
            postId: selectedPost.value.id,
            content: `đã tag bạn trong bình luận`,
            trangThai: false,
          },
          { headers: { Authorization: `Bearer ${token.value}` } }
        );
      } catch (e) {
        console.warn("Failed to send mention notification:", e);
      }
    }

    // Send notification for reply
    if (
      replyToId &&
      parentComment &&
      parentComment.authorId !== currentUser.id
    ) {
      try {
        await api.post(
          `/trendy/notification`,
          {
            idNguoiNhan: parentComment.authorId,
            maNguoiGui: currentUser.id,
            senderName: userData.ten || userData.name || currentUser.id,
            type: "REPLY",
            postId: selectedPost.value.id,
            content: `đã trả lời bình luận của bạn`,
            trangThai: false,
          },
          { headers: { Authorization: `Bearer ${token.value}` } }
        );
      } catch (e) {
        console.warn("Failed to send reply notification:", e);
      }
    }

    newComment.value = "";
    selectedPost.value.replyingToComment = null;
  } catch (error) {
    console.error("Failed to submit comment:", error);
    console.error("Response data:", error.response?.data);
    alert(
      "Không thể đăng bình luận: " +
        (error.response?.data?.message || error.message)
    );
  }
};

const toggleReplyLike = async (reply) => {
  try {
    if (reply.liked) {
      await api.delete(
        `/trendy/posts/${selectedPost.value.id}/comment/${reply.id}/like`,
        { headers: { Authorization: `Bearer ${token.value}` } }
      );
      reply.liked = false;
      reply.likes = Math.max(0, (reply.likes || 0) - 1);
    } else {
      await api.post(
        `/trendy/posts/${selectedPost.value.id}/comment/${reply.id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token.value}` } }
      );
      reply.liked = true;
      reply.likes = (reply.likes || 0) + 1;
    }
  } catch (error) {
    console.error("Failed to toggle reply like:", error);
  }
};

const toggleCommentLike = async (comment) => {
  try {
    if (comment.liked) {
      const unlikeRes = await api.delete(
        `/trendy/posts/${selectedPost.value.id}/comment/${comment.id}/like`,
        { headers: { Authorization: `Bearer ${token.value}` } }
      );
      comment.liked = false;
      if (unlikeRes.data?.likesCount !== undefined) {
        comment.likes = unlikeRes.data.likesCount;
      } else {
        comment.likes = Math.max(0, (comment.likes || 0) - 1);
      }
    } else {
      const likeRes = await api.post(
        `/trendy/posts/${selectedPost.value.id}/comment/${comment.id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token.value}` } }
      );
      comment.liked = true;
      if (likeRes.data?.likesCount !== undefined) {
        comment.likes = likeRes.data.likesCount;
      } else {
        comment.likes = (comment.likes || 0) + 1;
      }
    }
  } catch (error) {
    console.error("Failed to toggle comment like:", error);
    alert("Không thể thích bình luận");
    comment.liked = !comment.liked;
  }
};

const loadUserProfile = async () => {
  try {
    isLoading.value = true;
    const userRes = await api.get(`/trendy/user/${props.userId}`);
    otherUser.value = userRes.data;
    otherUserAvatar.value =
      userRes.data.avatar || "/images/Avatar/male_avatar.png";

    // Load friend status
    const currentUser = storage.getUser();
    if (currentUser) {
      try {
        const friendRes = await api.get("/trendy/friends/list", {
          params: { userId: currentUser.id },
        });
        isFriend.value = (friendRes.data || []).some(
          (f) => f.id === props.userId
        );
      } catch (e) {
        console.warn("Failed to load friend status:", e);
      }

      // Check pending requests
      try {
        const pendingRes = await api.get("/trendy/friends/incoming", {
          params: { userId: currentUser.id },
        });
        hasRequestPending.value = (pendingRes.data || []).some(
          (r) => r.from === props.userId || r.maNguoiGui === props.userId
        );
      } catch (e) {
        console.warn("Failed to load pending requests:", e);
      }
    }

    // Load posts - ONLY public posts
    try {
      const currentUser = storage.getUser();
      const currentUserId = currentUser?.id || currentUser?.email;

      const postsRes = await api.get(
        `/trendy/posts?userId=${props.userId}&viewerId=${currentUserId}`
      );
      const postsData = Array.isArray(postsRes.data) ? postsRes.data : [];

      // Backend already filters by privacy, but keep local filter as safety
      const publicPosts = postsData.filter(
        (p) => p.cheDoRiengTu === "CONG_KHAI" || p.cheDoRiengTu === "public"
      );

      // Enrich với liked/saved status
      posts.value = await Promise.all(
        publicPosts.map(async (p) => {
          try {
            const likedRes = await api
              .get(`/trendy/posts/${p.idPost}/liked`, {
                headers: { Authorization: `Bearer ${token.value}` },
              })
              .catch(() => ({ data: { liked: false } }));
            const savedRes = await api
              .get(`/trendy/posts/${p.idPost}/saved`, {
                headers: { Authorization: `Bearer ${token.value}` },
              })
              .catch(() => ({ data: { saved: false } }));

            const images = p.duongDanAnh
              ? Array.isArray(p.duongDanAnh)
                ? p.duongDanAnh
                : [p.duongDanAnh]
              : [];

            return {
              id: p.idPost,
              authorId: p.idUser,
              authorName: otherUser.value?.name || otherUser.value?.ten,
              authorAvatar: otherUserAvatar.value,
              content: p.noiDung,
              images: images,
              createdAt: p.ngayDang,
              likes: p.likesCount || 0,
              views: p.viewsCount || 0,
              comments: p.commentsCount || 0,
              privacy: p.cheDoRiengTu,
              liked: likedRes.data?.liked || false,
              saved: savedRes.data?.saved || false,
            };
          } catch (e) {
            return null;
          }
        })
      );

      posts.value = posts.value.filter((p) => p !== null);
      postsCount.value = publicPosts.length;

      // Load total likes received from API
      try {
        const totalLikesRes = await api.get(
          `/trendy/posts/user/${props.userId}/total-likes`
        );
        likesCount.value = totalLikesRes.data?.totalLikes || 0;
      } catch (e) {
        console.warn("Failed to load total likes:", e);
        // Fallback to local calculation
        likesCount.value = posts.value.reduce(
          (total, p) => total + (p.likes || 0),
          0
        );
      }
    } catch (e) {
      console.error("Failed to load posts:", e);
      posts.value = [];
    }

    // Load friends count from API
    try {
      const friendsCountRes = await api.get(
        `/trendy/friends/count/${props.userId}`
      );
      friendsCount.value = friendsCountRes.data?.friendsCount || 0;
      console.log(
        "✅ Friends count for",
        props.userId + ":",
        friendsCount.value
      );
    } catch (e) {
      console.warn("Failed to load friends count:", e);
      friendsCount.value = 0;
    }
  } catch (error) {
    console.error("Failed to load user profile:", error);
  } finally {
    isLoading.value = false;
  }
};

const sendFriendRequest = async () => {
  try {
    const currentUser = storage.getUser();
    if (!currentUser) {
      alert("Vui lòng đăng nhập");
      return;
    }

    await api.post(`/trendy/friends/request`, {
      from: currentUser.id,
      to: props.userId,
    });

    hasRequestPending.value = true;
    alert("Đã gửi lời mời kết bạn");
  } catch (error) {
    console.error("Failed to send friend request:", error);
    alert("Gửi lời mời thất bại");
  }
};

const startChat = async () => {
  try {
    const currentUser = storage.getUser();
    if (!currentUser) {
      alert("Vui lòng đăng nhập");
      return;
    }

    const soloRes = await api.post(
      `/trendy/chat/solo?userId1=${currentUser.id}&userId2=${props.userId}`
    );

    emit("startChat", {
      id: props.userId,
      maNhomSolo: soloRes.data.maNhomSolo,
      name: otherUser.value?.name || otherUser.value?.id,
      avatar: otherUserAvatar.value,
      type: "private",
    });
  } catch (error) {
    console.error("Failed to start chat:", error);
    alert("Không thể bắt đầu cuộc trò chuyện");
  }
};

const blockUser = async () => {
  if (!confirm(`Chặn ${otherUser.value?.name || otherUser.value?.id}?`)) return;

  try {
    const currentUser = storage.getUser();
    await api.post("/trendy/block", {
      blockerId: currentUser.id,
      blockedId: props.userId,
    });

    alert("Đã chặn người dùng");
    emit("close");
  } catch (error) {
    console.error("Failed to block user:", error);
    alert("Không thể chặn người dùng");
  }
};

const openPostDetail = (post) => {
  selectedPost.value = post;
  showPostDetailModal.value = true;

  // Count view when opening post
  incrementPostView(post.id);

  // Load comments từ API
  loadPostComments(post.id);
};

const incrementPostView = async (postId) => {
  try {
    await api.post(
      `/trendy/posts/${postId}/view`,
      {},
      { headers: { Authorization: `Bearer ${token.value}` } }
    );
    const post = posts.value.find((p) => p.id === postId);
    if (post) {
      post.views = (post.views || 0) + 1;
    }
  } catch (error) {
    console.error("Failed to count view:", error);
  }
};

const loadPostComments = async (postId) => {
  try {
    const commentsRes = await api.get(`/trendy/posts/${postId}/comments`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (commentsRes.data) {
      console.log(
        "📝 Raw Comments from API:",
        JSON.stringify(commentsRes.data, null, 2)
      );
      const enrichedComments = await Promise.all(
        commentsRes.data.map(async (c) => {
          try {
            const userRes = await api.get(`/trendy/user/${c.authorId}`);
            const userData = userRes.data || {};

            const likedRes = await api
              .get(`/trendy/posts/${postId}/comment/${c.id}/liked`, {
                headers: { Authorization: `Bearer ${token.value}` },
              })
              .catch(() => ({ data: { liked: false } }));

            // Get correct likes count from API
            const likesCountRes = await api
              .get(`/trendy/posts/${postId}/comment/${c.id}/likes`, {
                headers: { Authorization: `Bearer ${token.value}` },
                timeout: 5000, // 5 second timeout
              })
              .catch((err) => {
                console.warn(
                  `⚠️ Failed to get likes count for comment ${c.id}:`,
                  err.message
                );
                return { data: { likesCount: c.likes || 0 } };
              });
            console.log(
              `📌 Comment ${c.id} likes from API:`,
              likesCountRes.data
            );

            // Load replies
            let replies = [];
            try {
              const repliesRes = await api.get(
                `/trendy/posts/${postId}/comment/${c.id}/replies`,
                { headers: { Authorization: `Bearer ${token.value}` } }
              );

              replies = await Promise.all(
                (repliesRes.data || []).map(async (reply) => {
                  try {
                    const replyUserRes = await api.get(
                      `/trendy/user/${reply.authorId}`
                    );
                    const replyUserData = replyUserRes.data || {};
                    const replyLikedRes = await api
                      .get(
                        `/trendy/posts/${postId}/comment/${reply.id}/liked`,
                        {
                          headers: { Authorization: `Bearer ${token.value}` },
                        }
                      )
                      .catch(() => ({ data: { liked: false } }));
                    const replyLikesCountRes = await api
                      .get(
                        `/trendy/posts/${postId}/comment/${reply.id}/likes`,
                        {
                          headers: { Authorization: `Bearer ${token.value}` },
                          timeout: 5000,
                        }
                      )
                      .catch((err) => {
                        console.warn(
                          `⚠️ Failed to get likes for reply ${reply.id}:`,
                          err.message
                        );
                        return { data: { likesCount: reply.likes || 0 } };
                      });
                    return {
                      ...reply,
                      authorName:
                        replyUserData.ten ||
                        replyUserData.name ||
                        reply.authorId,
                      authorAvatar:
                        replyUserData.avatar ||
                        "/images/Avatar/male_avatar.png",
                      likes:
                        replyLikesCountRes.data?.likesCount || reply.likes || 0,
                      liked: replyLikedRes.data?.liked || false,
                      showMenu: false,
                    };
                  } catch (e) {
                    return {
                      ...reply,
                      likes: reply.likes || 0,
                      liked: false,
                      showMenu: false,
                    };
                  }
                })
              );
            } catch (e) {
              console.warn("Failed to load replies:", e);
            }

            return {
              ...c,
              authorName: userData.ten || userData.name || c.authorId,
              authorAvatar: userData.avatar || "/images/Avatar/male_avatar.png",
              likes: likesCountRes.data?.likesCount || c.likes || 0,
              liked: likedRes.data?.liked || false,
              replies: replies,
              showReplies: false,
              showMenu: false,
            };
          } catch (e) {
            return {
              ...c,
              likes: c.likes || 0,
              liked: false,
              replies: [],
              showReplies: false,
              showMenu: false,
            };
          }
        })
      );

      selectedPost.value.commentsList = enrichedComments;
    }
  } catch (error) {
    console.error("Failed to load comments:", error);
    selectedPost.value.commentsList = [];
  }
};

const toggleLike = async (postId) => {
  const post = posts.value.find((p) => p.id === postId);
  if (!post) return;
  try {
    const currentUser = storage.getUser();

    if (post.liked) {
      await api.delete(`/trendy/posts/${postId}/like`, {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      post.liked = false;
      post.likes = Math.max(0, post.likes - 1);
    } else {
      const likeRes = await api.post(
        `/trendy/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token.value}` } }
      );
      post.liked = true;
      // Get likes count from response
      if (likeRes.data?.likesCount !== undefined) {
        post.likes = likeRes.data.likesCount;
      } else {
        post.likes += 1;
      }

      // Send like notification to post owner
      if (post.authorId !== currentUser.id) {
        try {
          const userRes = await api.get(`/trendy/user/${currentUser.id}`);
          const userData = userRes.data || {};
          const senderName = userData.ten || userData.name || currentUser.id;

          await api.post(
            `/trendy/notification`,
            {
              idNguoiNhan: post.authorId,
              maNguoiGui: currentUser.id,
              senderName: senderName,
              type: "LIKE",
              postId: postId,
              content: `đã thích bài viết của bạn`,
              trangThai: false,
              noiDung: `${senderName} đã thích bài viết của bạn`,
            },
            { headers: { Authorization: `Bearer ${token.value}` } }
          );
        } catch (e) {
          console.warn("Failed to send like notification:", e);
        }
      }
    }

    // Cập nhật selected post nếu nó đang mở
    if (selectedPost.value && selectedPost.value.id === postId) {
      selectedPost.value.liked = post.liked;
      selectedPost.value.likes = post.likes;
    }

    // Recalculate total likes from API
    try {
      const totalLikesRes = await api.get(
        `/trendy/posts/user/${props.userId}/total-likes`
      );
      likesCount.value = totalLikesRes.data?.totalLikes || 0;
    } catch (e) {
      console.warn("Failed to reload total likes:", e);
      // Fallback to local calculation
      likesCount.value = posts.value.reduce(
        (total, p) => total + (p.likes || 0),
        0
      );
    }
  } catch (error) {
    console.error("Failed to toggle like:", error);
  }
};

const toggleSave = async (postId) => {
  const post = posts.value.find((p) => p.id === postId);
  if (!post) return;
  try {
    if (post.saved) {
      await api.delete(`/trendy/posts/${postId}/save`, {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      post.saved = false;
    } else {
      await api.post(
        `/trendy/posts/${postId}/save`,
        {},
        { headers: { Authorization: `Bearer ${token.value}` } }
      );
      post.saved = true;
    }
  } catch (error) {
    console.error("Failed to toggle save:", error);
  }
};

const sharePost = (post) => {
  navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
  alert("Đã sao chép link!");
};

onMounted(() => {
  loadUserProfile();
});
</script>

<style scoped>
.post-overlay {
  background-color: rgba(0, 0, 0, 0) !important;
  transition: all 0.3s ease;
  opacity: 0;
}

.post-overlay:hover {
  background-color: rgba(0, 0, 0, 0.4) !important;
  opacity: 1;
}
</style>
