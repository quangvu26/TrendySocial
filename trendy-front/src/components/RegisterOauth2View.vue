<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
    :style="{ backgroundImage: `url(/images/FormLogin/background_form.png)` }"
  >
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <div class="flex flex-col items-center space-y-3 mb-6">
        <div
          class="w-16 h-16 rounded-full bg-[#FF5630] flex items-center justify-center"
        >
          <img
            src="/images/Logo/Logo_white_nobackground.png"
            class="w-10 h-10 object-contain"
            alt="Logo"
          />
        </div>
        <h2 class="text-2xl font-bold text-[#FF5630]">LOOPA</h2>
      </div>

      <h3 class="text-xl font-semibold mb-6 text-center">
        Hoàn thiện thông tin
      </h3>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div
          v-if="errors.submit"
          class="p-3 bg-red-100 text-red-700 rounded-md text-sm"
        >
          {{ errors.submit }}
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">ID</label>
          <input
            v-model="id"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
          />
          <p v-if="errors.id" class="text-sm text-red-600 mt-1">
            {{ errors.id }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Tên</label>
          <input
            v-model="ten"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            readonly
            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
          />
          <p v-if="errors.password" class="text-sm text-red-600 mt-1">
            {{ errors.password }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Giới tính</label>
          <select
            v-model="gioiTinh"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
          >
            <option :value="true">Nam</option>
            <option :value="false">Nữ</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Ngày sinh</label>
          <input
            v-model="ngaySinh"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full px-4 py-2 bg-[#FF5630] text-white rounded-md hover:bg-[#ff6647] disabled:opacity-50 transition"
        >
          {{ isLoading ? "Đang xử lý..." : "Xác nhận" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { register, login } from "../api/authService";
import { saveToken, getOAuthUser, clearOAuthUser } from "../utils/authStorage";
import { validatePassword, validateId } from "../utils/validators";
import { handleAuthError } from "../utils/errorHandler";
import { checkIdExists } from "../utils/asyncChecks";

const router = useRouter();

const id = ref("");
const ten = ref("");
const email = ref("");
const password = ref("");
const gioiTinh = ref(true);
const ngaySinh = ref("");
const errors = ref({});
const isLoading = ref(false);

onMounted(() => {
  // First try to get OAuth data from query parameters (from backend redirect)
  const route = window.location;
  const params = new URLSearchParams(route.search);

  const emailParam = params.get("email");
  const nameParam = params.get("name");
  const pictureParam = params.get("picture");

  if (emailParam) {
    email.value = emailParam;
    ten.value = nameParam || "";
    if (!id.value && emailParam) {
      id.value = emailParam.split("@")[0];
    }
  } else {
    // Fallback to sessionStorage for OAuth user data
    const oauthUser = getOAuthUser();
    if (oauthUser) {
      email.value = oauthUser.email || "";
      ten.value = oauthUser.name || "";
      if (!id.value && oauthUser.email) {
        id.value = oauthUser.email.split("@")[0];
      }
    }
  }
});

const handleRegister = async () => {
  errors.value = {};

  // Validate
  if (!validateId(id.value)) {
    errors.value.id = "ID không được để trống";
    return;
  }

  if (!validatePassword(password.value)) {
    errors.value.password = "Mật khẩu từ 6 ký tự";
    return;
  }

  // Check ID uniqueness
  const { exists, error: checkError } = await checkIdExists(id.value);
  if (checkError) {
    errors.value.id = checkError;
    return;
  }
  if (exists) {
    errors.value.id = "ID đã tồn tại";
    return;
  }

  isLoading.value = true;
  try {
    // Register
    const payload = {
      id: id.value,
      ten: ten.value,
      email: email.value,
      password: password.value,
      gioiTinh: gioiTinh.value,
      ngaySinh: ngaySinh.value || "2000-01-01",
    };

    const res = await register(payload);
    if (res.data.token) {
      saveToken(res.data.token);
      clearOAuthUser();
      router.replace("/chat");
    } else {
      // Fallback: login
      const loginRes = await login({
        email: email.value,
        password: password.value,
      });
      if (loginRes.data.token) {
        saveToken(loginRes.data.token);
        clearOAuthUser();
        router.replace("/chat");
      }
    }
  } catch (err) {
    errors.value.submit = handleAuthError(err);
  } finally {
    isLoading.value = false;
  }
};
</script>
