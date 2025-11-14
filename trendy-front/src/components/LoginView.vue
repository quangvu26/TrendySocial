<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
    :style="{ backgroundImage: `url(/images/FormLogin/background_form.png)` }"
  >
    <div
      class="w-full max-w-5xl bg-white/95 rounded-2xl overflow-hidden shadow-2xl mx-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2">
        <div
          class="hidden md:flex items-center justify-center bg-orange-50 p-10"
        >
          <img
            src="/images/FormLogin/Social update-bro.svg"
            alt="Illustration"
            class="max-w-full max-h-[420px] object-contain"
          />
        </div>

        <div class="p-10 flex flex-col justify-center">
          <div class="flex flex-col items-center space-y-3 mb-6">
            <div
              class="w-20 h-20 rounded-full bg-[#FF5630] flex items-center justify-center"
            >
              <img
                src="/images/Logo/Logo_white_nobackground.png"
                class="w-14 h-14 object-contain"
                alt="Logo"
              />
            </div>
            <h2 class="text-2xl font-bold text-gray-900">LOOPA</h2>
            <p class="text-sm text-gray-600">Share the vibe, start the trend</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <input
                v-model="email"
                type="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5630] focus:border-[#FF5630] sm:text-sm"
                placeholder="Email"
                required
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <input
                v-model="password"
                type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5630] focus:border-[#FF5630] sm:text-sm"
                placeholder="Mật khẩu"
                required
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>

            <p v-if="error" class="text-center text-sm text-red-600">
              {{ error }}
            </p>

            <div class="flex justify-end">
              <router-link
                to="/forgot-password"
                class="text-sm text-gray-600 hover:text-[#FF5630]"
              >
                Quên mật khẩu?
              </router-link>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF5630] hover:bg-[#ff6647] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5630] disabled:opacity-50 transition"
            >
              {{ isLoading ? "Đang đăng nhập..." : "Đăng nhập" }}
            </button>
          </form>

          <div class="text-center text-sm text-gray-600 my-4">Hoặc</div>

          <button
            @click="handleGoogleLogin"
            type="button"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            <img
              src="https://www.google.com/favicon.ico"
              class="w-5 h-5 mr-2"
              alt="Google"
            />
            Đăng nhập bằng Google
          </button>

          <div class="text-center text-sm mt-4">
            <span class="text-gray-600">Bạn chưa có tài khoản? </span>
            <router-link
              to="/register"
              class="font-medium text-[#FF5630] hover:text-[#ff6647]"
            >
              Đăng ký
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../api/authService";
import { saveToken } from "../utils/authStorage";
import { validateEmail } from "../utils/validators";
import { handleAuthError } from "../utils/errorHandler";
import { checkEmailExists } from "../utils/asyncChecks";
import { storage } from "../utils/storage";

const router = useRouter();
const email = ref("");
const password = ref("");
const errors = ref({ email: null, password: null });
const error = ref("");
const isLoading = ref(false);

const validateForm = () => {
  errors.value.email = null;
  errors.value.password = null;
  error.value = "";

  if (!email.value) {
    errors.value.email = "Vui lòng nhập email";
    return false;
  }

  if (!validateEmail(email.value)) {
    errors.value.email = "Email không hợp lệ";
    return false;
  }

  if (!password.value) {
    errors.value.password = "Vui lòng nhập mật khẩu";
    return false;
  }

  return true;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  error.value = "";

  try {
    // Check if email exists (optimization)
    const { exists, error: checkError } = await checkEmailExists(email.value);
    if (checkError) {
      console.warn("Email check warning:", checkError);
      // Continue với login - let server handle nếu email không tồn tại
    } else if (!exists) {
      errors.value.email = "Email này chưa được đăng ký";
      isLoading.value = false;
      return;
    }

    // Attempt login
    const res = await login({ email: email.value, password: password.value });

    if (res && res.data) {
      const responseData = res.data;

      // Check if token exists in response
      if (!responseData.token) {
        error.value = "Đăng nhập thất bại: Không nhận được token";
        console.error("No token in response:", responseData);
        isLoading.value = false;
        return;
      }

      const token = responseData.token;
      saveToken(token);

      // Parse token to get userId and email
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.sub || payload.userId || payload.id;
        const userEmail = payload.email || email.value;

        if (!userId) {
          throw new Error("Không tìm thấy userId trong token");
        }

        // Store user info with userId as id
        const userInfo = {
          id: userId,
          email: userEmail,
          ten: responseData.ten || payload.ten || "User",
          avatar: responseData.avatar || "",
        };
        storage.setUser(userInfo);

        // Navigate to chat
        router.push("/chat");
      } catch (e) {
        console.error("Token parse error:", e);
        error.value = "Lỗi xử lý token: " + e.message;
      }
    } else {
      error.value = "Đăng nhập thất bại: Không có response từ server";
      console.error("No response data:", res);
    }
  } catch (err) {
    error.value = handleAuthError(err);
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin = async () => {
  try {
    const BACKEND_URL =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
    // Open OAuth2 flow - wait for redirect
    window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
  } catch (e) {
    console.error("Google login error:", e);
    error.value = "Lỗi đăng nhập Google. Vui lòng thử lại";
  }
};
</script>
