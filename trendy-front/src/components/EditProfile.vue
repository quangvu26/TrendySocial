<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
  >
    <div
      class="bg-white rounded-lg w-full max-w-md overflow-hidden flex flex-col"
    >
      <div class="px-6 py-3 border-b flex items-center justify-between">
        <h2 class="text-base font-semibold">Chỉnh sửa trang cá nhân</h2>
        <button @click="$emit('close')" class="p-1 hover:bg-gray-100">
          <i class="bi bi-x-lg text-lg"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-4 py-4 max-h-[70vh] space-y-4">
        <div class="text-center mb-2">
          <div class="relative inline-block">
            <img
              :src="formData.avatar || '/images/Avatar/male_avatar.png'"
              class="w-20 h-20 rounded-full object-cover border-4 border-gray-300"
            />
            <button
              @click="avatarInput?.click()"
              class="absolute bottom-0 right-0 bg-[#FF5630] text-white p-1.5 rounded-full"
            >
              <i class="bi bi-camera-fill text-xs"></i>
            </button>
          </div>
          <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleAvatarChange"
          />
        </div>

        <!-- Email section with edit toggle -->
        <div>
          <label class="text-xs font-medium text-gray-600">Email</label>
          <div class="flex gap-2 items-start">
            <div class="flex-1">
              <!-- Display current email when not editing -->
              <input
                v-if="!isEditingEmail"
                :value="formData.email"
                type="email"
                disabled
                class="w-full px-3 py-1.5 border border-gray-300 rounded text-xs mt-1 disabled:bg-gray-100 disabled:text-gray-600 focus:outline-none"
              />

              <!-- Email edit form when editing -->
              <div v-else class="space-y-2 mt-1">
                <input
                  v-model="formData.newEmail"
                  type="email"
                  placeholder="Nhập email mới"
                  :disabled="emailVerified"
                  class="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#FF5630] disabled:bg-gray-100"
                />
                <button
                  v-if="!emailVerified && formData.newEmail"
                  @click="sendVerificationCode"
                  :disabled="isSendingCode || emailCodeSent"
                  class="w-full px-3 py-1 bg-[#FF5630] text-white rounded text-xs font-medium hover:bg-[#FF4520] disabled:bg-gray-300 transition"
                >
                  {{
                    isSendingCode
                      ? "Gửi..."
                      : emailCodeSent
                      ? "Đã gửi mã"
                      : "Gửi mã xác minh"
                  }}
                </button>
                <input
                  v-if="emailCodeSent && !emailVerified"
                  v-model="verificationCode"
                  type="text"
                  placeholder="Nhập mã xác minh (6 số)"
                  maxlength="6"
                  class="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#FF5630]"
                />
                <button
                  v-if="emailCodeSent && !emailVerified"
                  @click="verifyEmailCode"
                  :disabled="!verificationCode || isVerifying"
                  class="w-full px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 disabled:bg-gray-300 transition"
                >
                  {{ isVerifying ? "Xác minh..." : "Xác minh email" }}
                </button>
                <p
                  v-if="emailVerified"
                  class="text-xs text-green-500 font-medium"
                >
                  ✓ Email mới đã xác minh thành công
                </p>
              </div>
              <p v-if="emailError" class="text-xs text-red-500 mt-1">
                {{ emailError }}
              </p>
            </div>
            <button
              @click="toggleEmailEdit"
              :disabled="emailVerified"
              class="mt-0 p-2 rounded hover:bg-gray-100 disabled:opacity-50 transition"
              :title="isEditingEmail ? 'Hủy chỉnh sửa' : 'Chỉnh sửa email'"
            >
              <i
                :class="[
                  'bi text-lg',
                  isEditingEmail
                    ? 'bi-x-circle-fill text-red-500'
                    : 'bi-pencil-square text-[#FF5630]',
                ]"
              ></i>
            </button>
          </div>
        </div>

        <div>
          <label class="text-xs font-medium text-gray-600">ID tài khoản</label>
          <input
            :value="formData.id"
            type="text"
            disabled
            class="w-full px-3 py-1.5 border border-gray-300 rounded text-xs mt-1 disabled:bg-gray-100 disabled:text-gray-600 focus:outline-none"
          />
          <p class="text-xs text-gray-500 mt-0.5">
            ID tài khoản không thể thay đổi
          </p>
        </div>

        <div>
          <label class="text-xs font-medium text-gray-600">Tên</label>
          <input
            v-model="formData.ten"
            type="text"
            placeholder="Minh Quang"
            maxlength="100"
            class="w-full px-3 py-1.5 border border-gray-300 rounded text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-[#FF5630]"
          />
        </div>

        <div>
          <label class="text-xs font-medium text-gray-600">Giới tính</label>
          <select
            v-model.boolean="formData.gioiTinh"
            class="w-full px-3 py-1.5 border border-gray-300 rounded text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-[#FF5630]"
          >
            <option :value="null">Chọn giới tính</option>
            <option :value="true">Nam</option>
            <option :value="false">Nữ</option>
          </select>
        </div>

        <div>
          <label class="text-xs font-medium text-gray-600">Ngày sinh</label>
          <input
            v-model="formData.ngaySinh"
            type="date"
            class="w-full px-3 py-1.5 border border-gray-300 rounded text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-[#FF5630]"
          />
        </div>

        <div>
          <label class="text-xs font-medium text-gray-600">Tiểu sử</label>
          <textarea
            v-model="formData.tieuSu"
            placeholder="Viết gì đó..."
            rows="2"
            maxlength="500"
            class="w-full px-3 py-1.5 border border-gray-300 rounded text-xs mt-1 resize-none focus:outline-none focus:ring-1 focus:ring-[#FF5630]"
          ></textarea>
          <p class="text-xs text-gray-400 mt-0.5">
            {{ (formData.tieuSu || "").length }}/500
          </p>
        </div>
      </div>

      <div class="px-4 py-3 border-t flex gap-2">
        <button
          @click="$emit('close')"
          class="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          @click="saveProfile"
          :disabled="
            isSaving || (isEditingEmail && formData.newEmail && !emailVerified)
          "
          class="flex-1 px-3 py-1.5 bg-[#FF5630] text-white rounded text-xs font-medium hover:bg-[#FF4520] disabled:bg-gray-300 transition"
        >
          {{ isSaving ? "Đang lưu..." : "Xong" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/api";
import { storage } from "../utils/storage";

const emit = defineEmits(["close", "updated"]);
const formData = ref({
  id: "",
  ten: "",
  gioiTinh: null,
  ngaySinh: "",
  tieuSu: "",
  avatar: "",
  email: "",
  newEmail: "",
});
const currentUserId = ref("");
const isSaving = ref(false);
const idError = ref("");
const idAvailable = ref(false);
const avatarInput = ref(null);

// Email verification states
const emailCodeSent = ref(false);
const verificationCode = ref("");
const emailVerified = ref(false);
const isSendingCode = ref(false);
const isVerifying = ref(false);
const emailError = ref("");
const isEditingEmail = ref(false);

onMounted(async () => {
  const user = storage.getUser();
  if (user) {
    try {
      const res = await api.get(`/trendy/user/${user.id}`);
      if (res.data) {
        formData.value = {
          id: res.data.id || "",
          ten: res.data.ten || res.data.name || "",
          gioiTinh: res.data.gioiTinh || null,
          ngaySinh: res.data.ngaySinh || "",
          tieuSu: res.data.tieuSu || "",
          avatar: res.data.avatar || "/images/Avatar/male_avatar.png",
          email: res.data.email || "",
          newEmail: "",
        };
        currentUserId.value = res.data.id || "";
        if (formData.value.id) {
          idAvailable.value = true;
        }
      }
    } catch (e) {
      console.error("Failed to load user info:", e);
      formData.value = {
        id: user.id || "",
        ten: user.ten || user.name || "",
        gioiTinh: user.gioiTinh || null,
        ngaySinh: user.ngaySinh || "",
        tieuSu: user.tieuSu || "",
        avatar: user.avatar || "/images/Avatar/male_avatar.png",
        email: user.email || "",
        newEmail: "",
      };
      currentUserId.value = user.id || "";
      if (formData.value.id) {
        idAvailable.value = true;
      }
    }
  }
});

const checkIdExists = async () => {
  if (!formData.value.id || formData.value.id.length < 3) {
    idError.value = "ID ít nhất 3 ký tự";
    idAvailable.value = false;
    return;
  }
  if (formData.value.id === currentUserId.value) {
    idError.value = "";
    idAvailable.value = true;
    return;
  }
  try {
    await api.get(`/trendy/user/${formData.value.id}`);
    idError.value = "ID đã tồn tại";
    idAvailable.value = false;
  } catch (e) {
    if (e.response?.status === 404) {
      idError.value = "";
      idAvailable.value = true;
    }
  }
};

const sendVerificationCode = async () => {
  if (!formData.value.newEmail) {
    emailError.value = "Vui lòng nhập email";
    return;
  }

  try {
    isSendingCode.value = true;
    emailError.value = "";

    // Check if email already exists
    try {
      await api.get(
        `/trendy/user/email/${encodeURIComponent(formData.value.newEmail)}`
      );
      // If no error, email already exists
      emailError.value = "Email đã được sử dụng";
      isSendingCode.value = false;
      return;
    } catch (e) {
      if (e.response?.status !== 404) {
        throw e;
      }
      // Email không tồn tại - OK, tiếp tục gửi mã
    }

    // Send verification code
    await api.post("/trendy/send-verification-code", {
      email: formData.value.newEmail,
    });
    emailCodeSent.value = true;
    emailError.value = "";
  } catch (err) {
    console.error("Send code error:", err);
    emailError.value =
      "Không thể gửi mã: " + (err.response?.data?.message || err.message);
  } finally {
    isSendingCode.value = false;
  }
};

const verifyEmailCode = async () => {
  if (!verificationCode.value) {
    emailError.value = "Vui lòng nhập mã xác minh";
    return;
  }

  try {
    isVerifying.value = true;
    emailError.value = "";

    // Verify code
    await api.post("/trendy/verify-email-code", {
      email: formData.value.newEmail,
      code: verificationCode.value,
    });

    emailVerified.value = true;
  } catch (e) {
    console.error("Verify error:", e);
    emailError.value = "Mã xác minh không đúng hoặc hết hạn";
  } finally {
    isVerifying.value = false;
  }
};

const handleAvatarChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (evt) => (formData.value.avatar = evt.target?.result);
    reader.readAsDataURL(file);
  }
};

const toggleEmailEdit = () => {
  if (isEditingEmail.value) {
    // Cancel editing
    isEditingEmail.value = false;
    formData.value.newEmail = "";
    verificationCode.value = "";
    emailCodeSent.value = false;
    emailVerified.value = false;
    emailError.value = "";
  } else {
    // Start editing
    isEditingEmail.value = true;
    emailError.value = "";
  }
};

const saveProfile = async () => {
  if (!formData.value.ten) {
    alert("Tên không được để trống");
    return;
  }
  if (formData.value.newEmail && !emailVerified.value) {
    alert("Vui lòng xác minh email trước");
    return;
  }
  try {
    isSaving.value = true;
    const token = localStorage.getItem("token");
    const data = {
      id: formData.value.id,
      ten: formData.value.ten,
      gioiTinh: formData.value.gioiTinh,
      ngaySinh: formData.value.ngaySinh,
      tieuSu: formData.value.tieuSu,
      avatar: formData.value.avatar,
    };

    // Add email if changed and verified
    if (formData.value.newEmail && emailVerified.value) {
      data.email = formData.value.newEmail;
    }

    // Update using ID in URL instead of email
    await api.put(`/trendy/user/${formData.value.id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = storage.getUser();
    Object.assign(user, data);
    storage.setUser(user);

    alert("Hồ sơ đã cập nhật!");
    emit("updated");
    emit("close");
  } catch (e) {
    console.error("Save error:", e);
    alert("Lỗi: " + (e.response?.data?.message || e.message));
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
input:disabled {
  cursor: not-allowed;
}
</style>
