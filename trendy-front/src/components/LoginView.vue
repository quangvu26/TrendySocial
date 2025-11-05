<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
    :style="{ backgroundImage: `url(/images/FormLogin/background_form.png)` }"
  >
    <div
      class="w-full max-w-5xl bg-white/95 rounded-2xl overflow-hidden shadow-2xl transition-shadow hover:shadow-2xl mx-4"
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

        <!-- Right: logo and form -->
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

          <!-- Form đăng nhập -->
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <input
                v-model="email"
                type="email"
                class="appearance-none rounded-md block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5630] focus:border-[#FF5630] sm:text-sm"
                placeholder="Email hoặc số điện thoại"
                required
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <div>
              <input
                v-model="password"
                type="password"
                class="appearance-none rounded-md block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5630] focus:border-[#FF5630] sm:text-sm"
                placeholder="Mật khẩu"
                required
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            </div>
            <p v-if="error" class="mt-2 text-center text-sm text-red-600">{{ error }}</p>
            <div class="flex justify-end">
              <a href="/forgot-password" class="text-sm text-gray-600 hover:text-[#FF5630]"
                >Quên mật khẩu?</a>
            </div>

            <div>
              <button
                type="submit"
                class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF5630] hover:bg-[#ff6647] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5630]"
              >
                Đăng nhập
              </button>
            </div>

            <div class="text-center text-sm text-gray-600">
              <span>Hoặc</span>
            </div>

            <div>
              <button
                @click="handleGoogleLogin"
                type="button"
                class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5630]"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  class="w-5 h-5 mr-2"
                  alt="Google logo"
                />
                Đăng nhập bằng Google
              </button>
            </div>

            <div class="text-center text-sm mt-2">
              <span class="text-gray-600">Bạn chưa có tài khoản? </span>
              <a
                href="/register"
                class="font-medium text-[#FF5630] hover:text-[#ff6647]"
                >Đăng ký</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login, checkEmail } from "../api/authService";
// import { getGoogleIdToken } from '../utils/googleAuth';

const router = useRouter();
const email = ref("");
const password = ref("");
const errors = ref({ email: null, password: null });
const error = ref("");
// Trong <script setup> của component
const handleLogin = async () => {
  try {
    // reset errors
    errors.value.email = null;
    errors.value.password = null;
    // If the input looks like an email, check if it exists before attempting login
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    if (isEmail) {
      try {
        const checkRes = await checkEmail(email.value);
        const exists = checkRes?.data?.exists;
        if (!exists) {
          errors.value.email = "Email này chưa được đăng ký. Vui lòng đăng ký trước khi đăng nhập.";
          return;
        }
      } catch (e) {
        // If check fails, continue to try login and let server handle errors
        console.warn('Không thể kiểm tra email trước khi đăng nhập:', e);
      }
    }

    const res = await login({ email: email.value, password: password.value });
    console.log("Login response:", res.data);
    localStorage.setItem("token", res.data.token);
    error.value = "";
    router.push("/chat");
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    // Reset all errors first
    error.value = "";
    errors.value.email = null;
    errors.value.password = null;

    if (err.response) {
      switch (err.response.status) {
        case 401:
          errors.value.password = "Mật khẩu không chính xác cho email này";
          break;
        case 404:
          errors.value.email = "Email này chưa được đăng ký trong hệ thống";
          break;
        case 403:
          error.value = "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên";
          break;
        case 400:
          if (err.response.data?.message?.includes("password")) {
            errors.value.password = "Mật khẩu không đúng định dạng";
          } else if (err.response.data?.message?.includes("email")) {
            errors.value.email = "Email không đúng định dạng";
          } else {
            error.value = err.response.data?.message || "Thông tin đăng nhập không hợp lệ";
          }
          break;
        default:
          error.value = err.response.data?.message || "Có lỗi xảy ra khi đăng nhập";
      }
    } else {
      error.value = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại";
    }
  }
};

const handleGoogleLogin = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
};
</script>