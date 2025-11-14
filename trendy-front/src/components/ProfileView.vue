<template>
  <div class="w-full h-screen bg-gray-50 overflow-hidden flex flex-col">
    <div
      class="bg-white border-b px-2 py-0 flex items-center justify-between flex-shrink-0"
    >
      <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-lg">
        <i class="bi bi-chevron-left text-2xl"></i>
      </button>
      <h2 class="text-l font-semibold">Trang cá nhân</h2>
      <div class="w-10"></div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="bg-white border-b">
        <div class="px-6 py-6 flex flex-col items-center">
          <img
            :src="userAvatar"
            @click="showAvatarModal = true"
            class="w-32 h-32 rounded-full object-cover border-4 border-gray-200 cursor-pointer hover:opacity-80 mb-4"
          />
          <h1
            class="text-2xl font-bold mb-1 cursor-pointer hover:text-blue-600"
            @click="goToUserProfile(user?.id)"
          >
            {{ user?.name || user?.ten || user?.id }}
          </h1>
          <p
            class="text-gray-600 text-sm mb-4 cursor-pointer hover:text-blue-600"
            @click="goToUserProfile(user?.id)"
          >
            @{{ user?.id }}
          </p>
          <p class="text-gray-700 text-sm mb-6 text-center">
            {{ userBio || "Chưa có mô tả" }}
          </p>
          <div class="flex gap-2 mb-6">
            <button
              @click="showEditProfile = true"
              class="px-6 py-2 bg-gray-200 text-black rounded-lg font-medium hover:bg-gray-300 text-sm"
            >
              Chỉnh sửa
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
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="{
                'text-black border-b-2 border-black': activeTab === tab.id,
                'text-gray-600': activeTab !== tab.id,
              }"
              class="pb-3 font-medium"
            >
              <i
                :class="{
                  'bi-grid-3x2': tab.id === 'posts',
                  'bi-heart': tab.id === 'likes',
                  'bi-bookmark': tab.id === 'saves',
                }"
                class="bi mr-2"
              ></i
              >{{ tab.label }}
            </button>
          </div>
        </div>

        <div class="px-4 py-4">
          <div v-if="isLoading" class="text-center py-12">
            <i
              class="bi bi-arrow-repeat animate-spin text-2xl text-gray-400"
            ></i>
          </div>
          <div v-else-if="filteredPosts.length === 0" class="text-center py-12">
            <i class="bi bi-inbox text-4xl text-gray-300 block mb-3"></i>
            <p class="text-gray-500 text-sm">Không có bài đăng nào</p>
          </div>

          <div
            v-else
            class="grid w-full gap-1"
            style="grid-template-columns: repeat(4, 1fr); grid-auto-rows: 250px"
          >
            <div
              v-for="(post, idx) in filteredPosts"
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
                @error="
                  (e) => {
                    console.error(
                      'Image failed to load:',
                      getImageUrl(post.images[0])
                    );
                    e.target.style.display = 'none';
                  }
                "
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
                <div
                  class="text-white flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300"
                >
                  <i class="bi bi-heart-fill text-3xl drop-shadow-lg"></i>
                  <span class="text-lg font-bold drop-shadow-lg">{{
                    post.likes || 0
                  }}</span>
                </div>
                <div
                  class="text-white flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300"
                >
                  <i class="bi bi-chat-fill text-3xl drop-shadow-lg"></i>
                  <span class="text-lg font-bold drop-shadow-lg">{{
                    post.comments || 0
                  }}</span>
                </div>
                <div
                  class="text-white flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300"
                >
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

    <div
      v-if="showPostDetailModal && selectedPost"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closePostDetail"
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
              <div class="relative">
                <button
                  v-if="canDeletePost(selectedPost)"
                  @click.stop="selectedPost.showMenu = !selectedPost.showMenu"
                  class="p-1 text-gray-500 hover:text-gray-900"
                >
                  <i class="bi bi-three-dots text-lg"></i>
                </button>

                <div
                  v-if="selectedPost.showMenu"
                  class="absolute right-0 top-full mt-0.5 w-48 bg-white border rounded-lg shadow-lg z-50"
                  @click.stop
                >
                  <button
                    @click="editPost(selectedPost)"
                    class="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 text-sm flex items-center gap-2"
                  >
                    <i class="bi bi-pencil"></i> Chỉnh sửa
                  </button>
                  <button
                    @click="deletePost(selectedPost.id)"
                    class="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 text-sm flex items-center gap-2"
                  >
                    <i class="bi bi-trash"></i> Xóa vĩnh viễn
                  </button>
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
            <div v-else class="space-y-2">
              <div
                v-for="comment in selectedPost.commentsList"
                :key="comment.id"
                class="flex gap-3 border-l-2 border-gray-200 pl-3"
              >
                <img
                  :src="
                    comment.authorAvatar || '/images/Avatar/male_avatar.png'
                  "
                  class="w-8 h-8 rounded-full flex-shrink-0 cursor-pointer hover:opacity-80"
                  @click="goToUserProfile(comment.authorId)"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <p
                        class="font-medium text-sm cursor-pointer hover:underline hover:text-blue-600 transition-colors"
                        @click="goToUserProfile(comment.authorId)"
                        :title="`View ${comment.authorName}'s profile`"
                      >
                        {{ comment.authorName }}
                      </p>
                      <p class="text-sm text-gray-800">
                        <span
                          v-html="renderCommentContent(comment.content)"
                        ></span>
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ formatDate(comment.createdAt) }}
                      </p>
                    </div>
                    <div class="relative">
                      <button
                        class="ml-2 p-1 text-gray-500 hover:text-gray-700 transition-opacity"
                        @click.stop="
                          toggleCommentMenu(comment, selectedPost.commentsList)
                        "
                      >
                        <i class="bi bi-three-dots text-lg"></i>
                      </button>
                      <div
                        v-if="comment.showMenu"
                        class="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-50"
                        @click.stop
                      >
                        <button
                          v-if="
                            comment.authorId === user?.id ||
                            canDeletePost(selectedPost)
                          "
                          @click="deleteComment(comment.id)"
                          class="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 text-sm flex items-center gap-2"
                        >
                          <i class="bi bi-trash"></i> Xóa vĩnh viễn
                        </button>
                        <button
                          v-if="comment.authorId === user?.id"
                          @click="hideComment(comment.id)"
                          class="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                        >
                          <i class="bi bi-eye-slash"></i> Ẩn
                        </button>
                        <button
                          v-if="comment.authorId !== user?.id"
                          @click="hideComment(comment.id)"
                          class="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                        >
                          <i class="bi bi-eye-slash"></i> Ẩn
                        </button>
                        <button
                          v-if="comment.authorId !== user?.id"
                          @click="blockCommentAuthor(comment.authorId)"
                          class="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                        >
                          <i class="bi bi-hand-thumbs-down"></i> Chặn
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

                  <div
                    v-if="comment.showReplies && comment.replies"
                    class="mt-3 space-y-2 ml-2 border-l-2 border-blue-300 pl-3"
                  >
                    <div
                      v-for="reply in comment.replies"
                      :key="reply.id"
                      class="flex gap-2 group"
                    >
                      <img
                        :src="
                          reply.authorAvatar || '/images/Avatar/male_avatar.png'
                        "
                        class="w-5 h-5 rounded-full flex-shrink-0 cursor-pointer hover:opacity-80"
                        @click="goToUserProfile(reply.authorId)"
                        :title="reply.authorName"
                      />
                      <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-1">
                          <p
                            class="font-medium text-xs cursor-pointer hover:text-blue-600 hover:underline"
                            @click="goToUserProfile(reply.authorId)"
                            :title="reply.authorName"
                          >
                            {{ reply.authorName }}
                          </p>
                          <div class="relative flex-shrink-0">
                            <button
                              class="p-0.5 text-gray-400 hover:text-gray-700 transition-colors"
                              @click.stop="
                                toggleReplyMenu(
                                  reply,
                                  selectedPost.commentsList
                                )
                              "
                            >
                              <i class="bi bi-three-dots text-xs"></i>
                            </button>
                            <div
                              v-if="reply.showMenu"
                              class="absolute right-0 mt-1 w-40 bg-white border rounded-lg shadow-lg z-50"
                              @click.stop
                            >
                              <button
                                v-if="
                                  reply.authorId === user?.id ||
                                  canDeletePost(selectedPost)
                                "
                                @click="deleteComment(reply.id)"
                                class="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-500 text-xs flex items-center gap-1"
                              >
                                <i class="bi bi-trash"></i> Xóa vĩnh viễn
                              </button>
                              <button
                                v-if="reply.authorId === user?.id"
                                @click="hideComment(reply.id)"
                                class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-xs flex items-center gap-1"
                              >
                                <i class="bi bi-eye-slash"></i> Ẩn
                              </button>
                              <button
                                v-if="reply.authorId !== user?.id"
                                @click="hideComment(reply.id)"
                                class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-xs flex items-center gap-1"
                              >
                                <i class="bi bi-eye-slash"></i> Ẩn
                              </button>
                              <button
                                v-if="reply.authorId !== user?.id"
                                @click="blockCommentAuthor(reply.authorId)"
                                class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-xs flex items-center gap-1"
                              >
                                <i class="bi bi-hand-thumbs-down"></i> Chặn
                              </button>
                            </div>
                          </div>
                        </div>
                        <p class="text-xs text-gray-800">{{ reply.content }}</p>
                        <p class="text-xs text-gray-400 mt-0.5">
                          {{ formatDate(reply.createdAt) }}
                        </p>
                        <div class="flex gap-2 mt-1 text-gray-500">
                          <button
                            @click="toggleReplyLike(reply)"
                            class="flex items-center gap-0.5 text-xs hover:text-red-500 transition-colors"
                            :class="{ 'text-red-500': reply.liked }"
                          >
                            <i
                              class="bi"
                              :class="
                                reply.liked ? 'bi-heart-fill' : 'bi-heart'
                              "
                            ></i>
                            <span>{{ reply.likes || 0 }}</span>
                          </button>
                          <button
                            @click="replyToComment(reply)"
                            class="hover:text-gray-700 text-xs"
                          >
                            Trả lời
                          </button>
                          <button
                            v-if="reply.replies && reply.replies.length > 0"
                            @click="toggleReplies(reply)"
                            class="text-blue-500 hover:text-blue-700 text-xs font-medium"
                          >
                            Xem {{ reply.replies.length }} trả lời
                          </button>
                        </div>

                        <div
                          v-if="
                            reply.showReplies &&
                            reply.replies &&
                            reply.replies.length > 0
                          "
                          class="mt-2 space-y-2 ml-0 border-l-2 border-green-300 pl-3"
                        >
                          <div
                            v-for="nestedReply in reply.replies"
                            :key="nestedReply.id"
                            class="flex gap-2 group"
                          >
                            <img
                              :src="
                                nestedReply.authorAvatar ||
                                '/images/Avatar/male_avatar.png'
                              "
                              class="w-4 h-4 rounded-full flex-shrink-0 cursor-pointer hover:opacity-80"
                              @click="goToUserProfile(nestedReply.authorId)"
                              :title="nestedReply.authorName"
                            />
                            <div class="flex-1 min-w-0">
                              <div
                                class="flex items-start justify-between gap-1"
                              >
                                <p
                                  class="font-medium text-xs cursor-pointer hover:text-blue-600 hover:underline"
                                  @click="goToUserProfile(nestedReply.authorId)"
                                  :title="nestedReply.authorName"
                                >
                                  {{ nestedReply.authorName }}
                                </p>

                                <div class="relative">
                                  <button
                                    class="p-0.5 text-gray-500 hover:text-gray-700 transition-opacity opacity-0 group-hover:opacity-100"
                                    @click.stop="
                                      toggleReplyMenu(
                                        nestedReply,
                                        selectedPost.commentsList
                                      )
                                    "
                                  >
                                    <i class="bi bi-three-dots text-xs"></i>
                                  </button>
                                  <div
                                    v-if="nestedReply.showMenu"
                                    class="absolute right-0 mt-1 w-40 bg-white border rounded-lg shadow-lg z-50"
                                    @click.stop
                                  >
                                    <button
                                      v-if="
                                        nestedReply.authorId === user?.id ||
                                        canDeletePost(selectedPost)
                                      "
                                      @click="deleteComment(nestedReply.id)"
                                      class="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-500 text-xs flex items-center gap-1"
                                    >
                                      <i class="bi bi-trash"></i> Xóa vĩnh viễn
                                    </button>
                                    <button
                                      v-if="nestedReply.authorId === user?.id"
                                      @click="hideComment(nestedReply.id)"
                                      class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-xs flex items-center gap-1"
                                    >
                                      <i class="bi bi-eye-slash"></i> Ẩn
                                    </button>
                                    <button
                                      v-if="nestedReply.authorId !== user?.id"
                                      @click="hideComment(nestedReply.id)"
                                      class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-xs flex items-center gap-1"
                                    >
                                      <i class="bi bi-eye-slash"></i> Ẩn
                                    </button>
                                    <button
                                      v-if="nestedReply.authorId !== user?.id"
                                      @click="
                                        blockCommentAuthor(nestedReply.authorId)
                                      "
                                      class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-xs flex items-center gap-1"
                                    >
                                      <i class="bi bi-hand-thumbs-down"></i>
                                      Chặn
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <p class="text-xs text-gray-700">
                                {{ nestedReply.content }}
                              </p>
                              <p class="text-xs text-gray-400 mt-0.5">
                                {{ formatDate(nestedReply.createdAt) }}
                              </p>
                              <div class="flex gap-2 mt-1 text-gray-500">
                                <button
                                  @click="toggleReplyLike(nestedReply)"
                                  class="flex items-center gap-0.5 text-xs hover:text-red-500 transition-colors"
                                  :class="{ 'text-red-500': nestedReply.liked }"
                                >
                                  <i
                                    class="bi"
                                    :class="
                                      nestedReply.liked
                                        ? 'bi-heart-fill'
                                        : 'bi-heart'
                                    "
                                  ></i>
                                  <span>{{ nestedReply.likes || 0 }}</span>
                                </button>
                                <button
                                  @click="replyToComment(nestedReply)"
                                  class="hover:text-gray-700 text-xs"
                                >
                                  Trả lời
                                </button>
                              </div>
                            </div>
                          </div>
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

            <div
              v-if="selectedPost.replyingToComment"
              class="bg-blue-50 border border-blue-200 rounded p-1 text-xs max-h-10"
            >
              <div class="flex items-center justify-between gap-1">
                <p class="font-medium text-blue-700 line-clamp-1 flex-1">
                  Trả lời: {{ selectedPost.replyingToComment.authorName }}
                </p>
                <button
                  @click="cancelReply"
                  class="text-blue-500 flex-shrink-0"
                >
                  <i class="bi bi-x text-xs"></i>
                </button>
              </div>
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

      <div
        v-if="showEditPostModal && editingPost"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="cancelEditPost"
      >
        <div
          class="bg-white rounded-lg w-full max-w-2xl max-h-96 overflow-hidden flex flex-col"
        >
          <h2 class="text-lg font-bold px-6 py-4 border-b">
            Chỉnh sửa bài viết
          </h2>

          <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Nội dung</label>
              <textarea
                v-model="editPostContent"
                rows="4"
                placeholder="Nội dung bài viết..."
                @keydown.ctrl.enter="saveEditPost"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5630] resize-none"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">💡 Ctrl+Enter để lưu</p>
            </div>

            <div class="border-t pt-4">
              <label class="flex items-center gap-2 text-sm mb-3">
                <i class="bi bi-eye text-lg"></i>
                <span>Ai có thể xem bài viết?</span>
              </label>
              <select
                v-model="editPostPrivacy"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5630] text-sm"
              >
                <option value="CONG_KHAI">🌐 Công khai</option>
                <option value="BAN_BE">👥 Bạn bè</option>
                <option value="RIENG_TU">🔒 Một mình</option>
              </select>
            </div>
          </div>

          <div class="px-6 py-4 border-t flex justify-end gap-3 flex-shrink-0">
            <button
              @click="cancelEditPost"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Hủy
            </button>
            <button
              @click="saveEditPost"
              class="px-4 py-2 bg-[#FF5630] text-white rounded-lg hover:bg-[#FF4520] text-sm font-medium"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="showEditModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
        @click.self="showEditModal = false"
      >
        <div class="bg-white rounded-lg w-full max-w-sm p-6">
          <h2 class="text-lg font-bold mb-4 text-center">Cài đặt tài khoản</h2>
          <div class="space-y-3">
            <button
              @click="
                showEditProfile = true;
                showEditModal = false;
              "
              class="w-full flex items-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50 transition text-left"
            >
              <i class="bi bi-person text-xl text-gray-600"></i>
              <div>
                <p class="font-medium text-sm">Thông tin cá nhân</p>
                <p class="text-xs text-gray-500">
                  Chỉnh sửa tên, avatar, bio...
                </p>
              </div>
            </button>

            <button
              @click="
                editBioMode = true;
                showEditModal = false;
              "
              class="w-full flex items-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50 transition text-left"
            >
              <i class="bi bi-file-text text-xl text-gray-600"></i>
              <div>
                <p class="font-medium text-sm">Tiểu sử</p>
                <p class="text-xs text-gray-500">{{ userBio || "Chưa có" }}</p>
              </div>
            </button>

            <button
              @click="showEditModal = false"
              class="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium mt-4"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="editBioMode && showEditModal === false"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
        @click.self="editBioMode = false"
      >
        <div class="bg-white rounded-lg w-full max-w-sm p-6">
          <h2 class="text-lg font-bold mb-4 text-center">Chỉnh sửa tiểu sử</h2>
          <textarea
            v-model="userBio"
            rows="4"
            placeholder="Thêm mô tả..."
            class="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
          ></textarea>
          <div class="flex gap-3">
            <button
              @click="editBioMode = false"
              class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
            >
              Hủy
            </button>
            <button
              @click="saveBio"
              class="flex-1 px-4 py-2 bg-[#FF5630] text-white rounded-lg hover:bg-[#FF4520] text-sm"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showAvatarModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4"
      @click.self="showAvatarModal = false"
    >
      <div class="relative">
        <img
          :src="userAvatar"
          class="w-96 h-96 object-cover rounded-lg shadow-2xl"
          @error="
            (e) => {
              e.target.src = '/images/Avatar/male_avatar.png';
              console.error('Avatar load failed');
            }
          "
        />
        <button
          @click="showAvatarModal = false"
          class="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-gray-200 shadow-lg z-10"
        >
          <i class="bi bi-x-lg text-2xl"></i>
        </button>
      </div>
    </div>

    <EditProfile
      v-if="showEditProfile"
      @close="showEditProfile = false"
      @updated="loadProfile"
    />
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api/api";
import { storage } from "../utils/storage";
import EditProfile from "./EditProfile.vue";

// Define emits for component events
const emit = defineEmits(["close", "viewUserProfile"]);

const user = ref(null);
const userBio = ref("");
const userAvatar = ref("/images/Avatar/male_avatar.png");
const posts = ref([]);
const postsCount = ref(0);
const friendsCount = ref(0);
const likesCount = ref(0);
const activeTab = ref("posts");
const isLoading = ref(false);
const showEditModal = ref(false);
const showEditPostModal = ref(false);
const showAvatarModal = ref(false);
const showPostOptionsModal = ref(false);
const showPostDetailModal = ref(false);
const showEditProfile = ref(false);
const selectedPost = ref(null);
const newComment = ref("");
const editingPost = ref(null);
const editPostContent = ref("");
const editPostPrivacy = ref("CONG_KHAI");
const editHideComments = ref(false);
const editHideLikes = ref(false);
const editHideViews = ref(false);
const editBioMode = ref(false);

const tabs = [
  { id: "posts", label: "Bài đăng" },
  { id: "likes", label: "Đã thích" },
  { id: "saves", label: "Lưu trữ" },
];

const filteredPosts = computed(() => {
  if (activeTab.value === "posts") return posts.value.filter((p) => !p.repost);
  if (activeTab.value === "likes") return posts.value.filter((p) => p.liked);
  if (activeTab.value === "saves") return posts.value.filter((p) => p.saved);
  return posts.value;
});

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins}p trước`;
  if (hours < 24) return `${hours}h trước`;
  if (days < 7) return `${days}d trước`;
  return d.toLocaleDateString("vi-VN");
};

const getImageUrl = (img) => {
  if (!img) return "";
  // Nếu đã là URL đầy đủ
  if (img.startsWith("http")) return img;
  // Nếu là đường dẫn tuyệt đối
  if (img.startsWith("/")) return `http://localhost:8080${img}`;
  // Nếu là tên file, thêm base path
  return `http://localhost:8080/uploads/posts/${img}`;
};

const canDeletePost = (post) => user.value?.id === post.authorId;

const loadProfile = async () => {
  try {
    isLoading.value = true;
    const storedUser = storage.getUser();
    if (storedUser) {
      user.value = storedUser;
      userAvatar.value = storedUser.avatar || "/images/Avatar/male_avatar.png";
    }

    const userRes = await api
      .get(`/trendy/user/${user.value.id}`)
      .catch(() => null);
    if (userRes?.data) {
      user.value = { ...user.value, ...userRes.data };
      // Load tieuSu from database to sync
      userBio.value = userRes.data.tieuSu || "";
      // Update avatar from database
      if (userRes.data.avatar) {
        userAvatar.value = userRes.data.avatar;
      }
    }

    // Load friends count from API
    try {
      const friendsCountRes = await api.get(
        `/trendy/friends/count/${user.value.id}`
      );
      friendsCount.value = friendsCountRes.data?.friendsCount || 0;
    } catch (e) {
      console.warn("Failed to load friends count:", e);
      friendsCount.value = 0;
    }

    const postsRes = await api.get(
      `/trendy/posts?userId=${user.value.id}&viewerId=${user.value.id}`
    );
    const postsData = Array.isArray(postsRes.data) ? postsRes.data : [];

    // Debug

    if (!postsData || postsData.length === 0) {
      console.warn("⚠️ No posts data returned");
      posts.value = [];
      postsCount.value = 0;
      isLoading.value = false;
      return;
    }

    const token = localStorage.getItem("token");
    const enrichedPosts = await Promise.all(
      postsData.map(async (post) => {
        try {
          const likedRes = await api
            .get(`/trendy/posts/${post.idPost}/liked`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch(() => ({ data: { liked: false } }));
          const savedRes = await api
            .get(`/trendy/posts/${post.idPost}/saved`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch(() => ({ data: { saved: false } }));

          const images = post.duongDanAnh
            ? Array.isArray(post.duongDanAnh)
              ? post.duongDanAnh
              : [post.duongDanAnh]
            : [];

          // Debug
          console.log(
            `📊 Post ${post.idPost} likes: ${post.likesCount}, comments: ${post.commentsCount}`
          ); // Debug

          return {
            id: post.idPost,
            authorId: post.idUser,
            authorName: user.value.name || user.value.ten,
            authorAvatar: userAvatar.value,
            content: post.noiDung,
            images: images && images.length > 0 ? images : [],
            createdAt: post.ngayDang,
            likes: post.likesCount || 0,
            views: post.viewsCount || 0,
            comments: post.commentsCount || 0,
            liked: likedRes.data?.liked || false,
            saved: savedRes.data?.saved || false,
            privacy: post.cheDoRiengTu || "CONG_KHAI",
          };
        } catch (e) {
          console.error("❌ Error enriching post:", e);
          return null;
        }
      })
    );

    posts.value = enrichedPosts.filter((p) => p !== null);
    postsCount.value = posts.value.length;

    // Load total likes received from API
    try {
      const totalLikesRes = await api.get(
        `/trendy/posts/user/${user.value.id}/total-likes`
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

    // Debug

    // Load aspect ratios for all images
    posts.value.forEach((post) => {
      if (post.images && post.images.length > 0) {
        const imgUrl = getImageUrl(post.images[0]);
        // Debug
        const img = new Image();
        img.onload = () => {
          const ratio = img.width / img.height;
        };
        img.onerror = () => {
          console.error(`❌ Failed to load image: ${imgUrl}`);
        };
        img.src = imgUrl;
      }
    });
  } catch (error) {
    console.error("Failed to load profile:", error);
  } finally {
    isLoading.value = false;
  }
};

const toggleLike = async (postId) => {
  const post = posts.value.find((p) => p.id === postId);
  if (!post) return;
  try {
    const token = localStorage.getItem("token");
    if (post.liked) {
      await api.delete(`/trendy/posts/${postId}/like`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      post.liked = false;
      post.likes = Math.max(0, post.likes - 1);
    } else {
      const likeRes = await api.post(
        `/trendy/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      post.liked = true;
      // Get likes count from response
      if (likeRes.data?.likesCount !== undefined) {
        post.likes = likeRes.data.likesCount;
      } else {
        post.likes += 1;
      }
    }

    // Recalculate total likes from API
    try {
      const totalLikesRes = await api.get(
        `/trendy/posts/user/${user.value.id}/total-likes`
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

    // Update selected post if it's open
    if (selectedPost.value && selectedPost.value.id === postId) {
      selectedPost.value.liked = post.liked;
      selectedPost.value.likes = post.likes;
    }
  } catch (error) {
    console.error("Failed to toggle like:", error);
  }
};

const toggleSave = async (postId) => {
  const post = posts.value.find((p) => p.id === postId);
  if (!post) return;
  try {
    const token = localStorage.getItem("token");
    if (post.saved) {
      await api.delete(`/trendy/posts/${postId}/save`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      post.saved = false;
    } else {
      await api.post(
        `/trendy/posts/${postId}/save`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      post.saved = true;
    }
  } catch (error) {
    console.error("Failed to toggle save:", error);
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
    const token = localStorage.getItem("token");
    await api.post(
      `/trendy/posts/${postId}/view`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // Update local view count
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
    const token = localStorage.getItem("token");
    const commentsRes = await api.get(`/trendy/posts/${postId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (commentsRes.data) {
      // Load user info for each comment
      const enrichedComments = await Promise.all(
        commentsRes.data.map(async (c) => {
          try {
            // Get user info
            const userRes = await api.get(`/trendy/user/${c.authorId}`);
            const userData = userRes.data || {};

            // Check if current user liked this comment
            const likedRes = await api.get(
              `/trendy/posts/${postId}/comment/${c.id}/liked`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // Get correct likes count for comment
            const likesCountRes = await api
              .get(`/trendy/posts/${postId}/comment/${c.id}/likes`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000,
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

            // Load replies for this comment
            const repliesRes = await api
              .get(`/trendy/posts/${postId}/comment/${c.id}/replies`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .catch(() => ({ data: [] }));

            // Enrich replies with user info
            const enrichedReplies = await Promise.all(
              (repliesRes.data || []).map(async (reply) => {
                try {
                  const replyUserRes = await api.get(
                    `/trendy/user/${reply.authorId}`
                  );
                  const replyUserData = replyUserRes.data || {};

                  const replyLikedRes = await api
                    .get(`/trendy/posts/${postId}/comment/${reply.id}/liked`, {
                      headers: { Authorization: `Bearer ${token}` },
                    })
                    .catch(() => ({ data: { liked: false } }));

                  const replyLikesCountRes = await api
                    .get(`/trendy/posts/${postId}/comment/${reply.id}/likes`, {
                      headers: { Authorization: `Bearer ${token}` },
                      timeout: 5000,
                    })
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
                      replyUserData.ten || replyUserData.name || reply.authorId,
                    authorAvatar:
                      replyUserData.avatar || "/images/Avatar/male_avatar.png",
                    likes:
                      replyLikesCountRes.data?.likesCount || reply.likes || 0,
                    liked: replyLikedRes.data?.liked || false,
                    replies: [],
                    showReplies: false,
                  };
                } catch (e) {
                  return {
                    ...reply,
                    replies: [],
                    showReplies: false,
                  };
                }
              })
            );

            return {
              ...c,
              authorName: userData.ten || userData.name || c.authorId,
              authorAvatar: userData.avatar || "/images/Avatar/male_avatar.png",
              likes: likesCountRes.data?.likesCount || c.likes || 0,
              liked: likedRes.data?.liked || false,
              replies: enrichedReplies,
              showReplies: false,
            };
          } catch (e) {
            console.error("Error loading comment user:", e);
            return {
              ...c,
              likes: c.likes || 0,
              liked: false,
              replies: [],
              showReplies: false,
            };
          }
        })
      );

      selectedPost.value.commentsList = enrichedComments;
      console.log(
        "✅ Loaded comments with replies:",
        selectedPost.value.commentsList
      );
    }
  } catch (error) {
    console.error("Failed to load comments:", error);
    selectedPost.value.commentsList = [];
  }
};

const showPostOptions = (post) => {
  selectedPost.value = post;
  showPostOptionsModal.value = true;
};

const deletePost = async (postId) => {
  if (!confirm("Xóa bài viết này? Hành động không thể hoàn tác.")) return;
  try {
    const token = localStorage.getItem("token");
    await api.delete(`/trendy/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    posts.value = posts.value.filter((p) => p.id !== postId);
    postsCount.value = posts.value.length;
    showPostDetailModal.value = false;
    alert("Bài viết đã xóa!");
  } catch (error) {
    alert("Không thể xóa bài viết");
  }
};

const sharePost = (post) => {
  navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
  alert("Đã sao chép link!");
};

const submitComment = async () => {
  if (!newComment.value.trim() || !selectedPost.value) return;
  try {
    const token = localStorage.getItem("token");

    // Check if this is a reply (has replyingToComment set)
    let replyToId = null;
    let parentComment = null;

    if (selectedPost.value.replyingToComment) {
      replyToId = selectedPost.value.replyingToComment.id;

      // Find the top-level comment (traverse up to find original comment)
      parentComment = selectedPost.value.commentsList.find(
        (c) => c.id === replyToId || c.replies?.some((r) => r.id === replyToId)
      );

      // If replying to a reply, find its top-level parent
      if (!parentComment) {
        for (let c of selectedPost.value.commentsList) {
          if (c.replies?.some((r) => r.id === replyToId)) {
            parentComment = c;
            break;
          }
        }
      }
    }

    // Call API để lưu comment
    const commentRes = await api.post(
      `/trendy/posts/${selectedPost.value.id}/comment`,
      {
        content: newComment.value,
        replyToId: replyToId,
        replyToContent: selectedPost.value.replyingToComment?.content || null,
        replyToSender: selectedPost.value.replyingToComment?.authorName || null,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!commentRes.data) {
      throw new Error("No comment data returned");
    }

    // Get user info
    const userRes = await api.get(`/trendy/user/${user.value?.id}`);
    const userData = userRes.data || {};

    const newReply = {
      id: commentRes.data.id || commentRes.data.idComment || Date.now(),
      content: newComment.value,
      authorName: userData.ten || userData.name || user.value?.id,
      authorId: user.value?.id,
      authorAvatar: userData.avatar || userAvatar.value,
      createdAt: commentRes.data.createdAt || new Date().toISOString(),
      likes: 0,
      liked: false,
      maTraLoi: replyToId,
      replies: [],
      showReplies: false,
    };

    if (!selectedPost.value.commentsList) selectedPost.value.commentsList = [];

    // If it's a reply to any comment/reply, add to the top-level comment's replies
    if (replyToId && parentComment) {
      if (!parentComment.replies) parentComment.replies = [];
      parentComment.replies.push(newReply);
      if (!parentComment.showReplies) parentComment.showReplies = true;
    } else {
      // Regular comment - add to main list
      selectedPost.value.commentsList.push(newReply);
    }

    // Tăng comments count
    selectedPost.value.comments = (selectedPost.value.comments || 0) + 1;

    newComment.value = "";
    selectedPost.value.replyingToComment = null;
  } catch (error) {
    console.error("Failed to submit comment:", error);
    alert(
      "Không thể đăng bình luận: " +
        (error.response?.data?.message || error.message)
    );
  }
};
const toggleCommentLike = async (comment) => {
  try {
    const token = localStorage.getItem("token");
    const commentId = comment.id;

    if (comment.liked) {
      // Unlike - DELETE request
      await api.delete(
        `/trendy/posts/${selectedPost.value.id}/comment/${commentId}/like`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      comment.liked = false;
      comment.likes = Math.max(0, (comment.likes || 0) - 1);
    } else {
      // Like - POST request
      await api.post(
        `/trendy/posts/${selectedPost.value.id}/comment/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      comment.liked = true;
      comment.likes = (comment.likes || 0) + 1;
    }

    // Update local state only, don't reload entire comments list
  } catch (error) {
    console.error("Failed to toggle comment like:", error);
    alert("Không thể thích bình luận");
    // Revert on error
    comment.liked = !comment.liked;
  }
};

const toggleReplyLike = async (reply) => {
  try {
    const token = localStorage.getItem("token");

    if (reply.liked) {
      await api.delete(
        `/trendy/posts/${selectedPost.value.id}/comment/${reply.id}/like`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      reply.liked = false;
      reply.likes = Math.max(0, (reply.likes || 0) - 1);
    } else {
      await api.post(
        `/trendy/posts/${selectedPost.value.id}/comment/${reply.id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      reply.liked = true;
      reply.likes = (reply.likes || 0) + 1;
    }

    // Update local state only, don't reload
  } catch (error) {
    console.error("Failed to toggle reply like:", error);
    // Revert on error
    reply.liked = !reply.liked;
  }
};

const toggleCommentMenu = (comment, commentsList) => {
  // Close all other comment menus
  if (commentsList) {
    commentsList.forEach((c) => {
      if (c.id !== comment.id) {
        c.showMenu = false;
        if (c.replies) {
          c.replies.forEach((r) => {
            r.showMenu = false;
            if (r.replies) {
              r.replies.forEach((nr) => {
                nr.showMenu = false;
              });
            }
          });
        }
      }
    });
  }
  comment.showMenu = !comment.showMenu;
};

const toggleReplyMenu = (reply, commentsList) => {
  // Close all other menus
  if (commentsList) {
    commentsList.forEach((c) => {
      c.showMenu = false;
      if (c.replies) {
        c.replies.forEach((r) => {
          if (r.id !== reply.id) {
            r.showMenu = false;
            if (r.replies) {
              r.replies.forEach((nr) => {
                nr.showMenu = false;
              });
            }
          }
        });
      }
    });
  }
  reply.showMenu = !reply.showMenu;
};

const togglePostMenu = (post) => {
  post.showMenu = !post.showMenu;
};

const handleModalClick = (e) => {
  // Only close modal if clicking on the overlay (outside the modal box)
  if (
    e.target.classList.contains("fixed") &&
    e.target.classList.contains("inset-0")
  ) {
    showPostDetailModal.value = false;
    if (selectedPost.value?.showMenu) {
      selectedPost.value.showMenu = false;
    }
  }
};

const editPost = (post) => {
  editingPost.value = post;
  editPostContent.value = post.content;
  editPostPrivacy.value = post.privacy || "CONG_KHAI";
  editHideComments.value = post.hideComments || false;
  editHideLikes.value = post.hideLikes || false;
  editHideViews.value = post.hideViews || false;
  showEditPostModal.value = true;
  post.showMenu = false;
};

const saveEditPost = async () => {
  if (!editPostContent.value.trim()) {
    alert("Nội dung bài viết không thể trống");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    await api.put(
      `/trendy/posts/${editingPost.value.id}`,
      {
        noiDung: editPostContent.value,
        cheDoRiengTu: editPostPrivacy.value,
        hideComments: editHideComments.value,
        hideLikes: editHideLikes.value,
        hideViews: editHideViews.value,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update local post
    editingPost.value.content = editPostContent.value;
    editingPost.value.privacy = editPostPrivacy.value;
    editingPost.value.hideComments = editHideComments.value;
    editingPost.value.hideLikes = editHideLikes.value;
    editingPost.value.hideViews = editHideViews.value;

    selectedPost.value.content = editPostContent.value;
    selectedPost.value.privacy = editPostPrivacy.value;

    showEditPostModal.value = false;
    editingPost.value = null;
    editPostContent.value = "";

    // Reload profile to reflect privacy changes in post list
    await loadProfile();

    alert("Bài viết đã cập nhật!");
  } catch (error) {
    console.error("Failed to edit post:", error);
    alert(
      "Không thể cập nhật bài viết: " +
        (error.response?.data?.message || error.message)
    );
  }
};

const cancelEditPost = () => {
  showEditPostModal.value = false;
  editingPost.value = null;
  editPostContent.value = "";
};

const blockCommentAuthor = (userId) => {
  alert("Chặn người dùng: " + userId);
  // TODO: Call block user API
};

const deleteComment = async (commentId) => {
  if (!confirm("Xóa bình luận này? Hành động không thể hoàn tác.")) return;

  try {
    const token = localStorage.getItem("token");
    await api.delete(
      `/trendy/posts/${selectedPost.value.id}/comment/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Remove from view locally
    selectedPost.value.commentsList = selectedPost.value.commentsList.filter(
      (c) => {
        if (c.id === commentId) return false;
        if (c.replies) {
          c.replies = c.replies.filter((r) => r.id !== commentId);
        }
        return true;
      }
    );

    // Decrease comment count
    selectedPost.value.comments = Math.max(
      0,
      (selectedPost.value.comments || 0) - 1
    );

    alert("Bình luận đã xóa");
  } catch (error) {
    console.error("Failed to delete comment:", error);
    alert(
      "Không thể xóa bình luận: " +
        (error.response?.data?.message || error.message)
    );
  }
};

const hideComment = async (commentId) => {
  if (!confirm("Ẩn bình luận này? Bạn sẽ là người duy nhất không thấy nó."))
    return;

  try {
    const token = localStorage.getItem("token");

    // Call API to hide comment
    await api
      .post(
        `/trendy/posts/${selectedPost.value.id}/comment/${commentId}/hide`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .catch(() => {
        // If API doesn't exist yet, just hide locally
        console.warn("Hide API not available, hiding locally only");
      });

    // Remove from view locally
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
    alert("Không thể ẩn bình luận");
  }
};

const replyToComment = (comment) => {
  newComment.value = `@${comment.authorName} `;
  // Store parent comment info
  selectedPost.value.replyingToComment = {
    id: comment.id,
    authorName: comment.authorName,
    content: comment.content,
  };

  // Focus on input
  setTimeout(() => {
    document.querySelector('input[placeholder="Thêm bình luận..."]')?.focus();
  }, 100);
};

const cancelReply = () => {
  newComment.value = "";
  selectedPost.value.replyingToComment = null;
};

const toggleReplies = (comment) => {
  comment.showReplies = !comment.showReplies;
};

const renderCommentContent = (content) => {
  // Xử lý @mention - thay thế @username thành link màu xanh
  return content.replace(
    /@(\w+)/g,
    '<a style="color: #3b82f6; font-weight: 500; cursor: pointer;" class="hover:underline">@$1</a>'
  );
};

const goToUserProfile = (userId) => {
  if (!userId) return;
  // Emit event to parent to navigate to other user's profile
  emit("viewUserProfile", userId);
  // Close current modal
  showPostDetailModal.value = false;
};

const openEditProfile = () => {
  showEditModal.value = true;
};

const canGoToPrevious = () => {
  if (!selectedPost.value || !filteredPosts.value) return false;
  const idx = filteredPosts.value.findIndex(
    (p) => p.id === selectedPost.value.id
  );
  return idx > 0;
};

const canGoToNext = () => {
  if (!selectedPost.value || !filteredPosts.value) return false;
  const idx = filteredPosts.value.findIndex(
    (p) => p.id === selectedPost.value.id
  );
  return idx >= 0 && idx < filteredPosts.value.length - 1;
};

const goToPreviousPost = () => {
  const idx = filteredPosts.value.findIndex(
    (p) => p.id === selectedPost.value.id
  );
  if (idx > 0) {
    openPostDetail(filteredPosts.value[idx - 1]);
  }
};

const goToNextPost = () => {
  const idx = filteredPosts.value.findIndex(
    (p) => p.id === selectedPost.value.id
  );
  if (idx >= 0 && idx < filteredPosts.value.length - 1) {
    openPostDetail(filteredPosts.value[idx + 1]);
  }
};

const closePostDetail = () => {
  if (selectedPost.value?.showMenu) {
    selectedPost.value.showMenu = false;
  } else {
    showPostDetailModal.value = false;
  }
};

const saveProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    await api.put(
      `/trendy/user/${user.value.id}`,
      { bio: userBio.value },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    storage.setUser(user.value);
    showEditModal.value = false;
    alert("Đã cập nhật!");
  } catch (error) {
    alert("Không thể lưu");
  }
};

const saveBio = async () => {
  try {
    const token = localStorage.getItem("token");
    await api.put(
      `/trendy/user/${user.value.id}`,
      { tieuSu: userBio.value },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const user_data = storage.getUser();
    user_data.tieuSu = userBio.value;
    storage.setUser(user_data);
    editBioMode.value = false;
    showEditModal.value = false;
    alert("Tiểu sử đã cập nhật!");
  } catch (error) {
    alert("Không thể lưu");
  }
};

onMounted(() => {
  loadProfile();
  window.addEventListener("post-created", () => loadProfile());
});
</script>

<style scoped>
button {
  transition: all 0.3s ease;
}

/* Post overlay - no background initially */
.post-overlay {
  background-color: rgba(0, 0, 0, 0) !important;
  transition: all 0.3s ease;
  pointer-events: auto;
}

/* Direct hover on overlay */
.post-overlay:hover {
  background-color: rgba(0, 0, 0, 0.4) !important;
}

/* Show stats on overlay hover */
.post-overlay:hover > div {
  opacity: 1 !important;
}

.post-overlay > div {
  opacity: 0;
  transition: opacity 0.3s ease;
}
</style>
