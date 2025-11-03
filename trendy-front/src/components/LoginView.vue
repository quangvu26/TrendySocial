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
            </div>

            <div>
              <input
                v-model="password"
                type="password"
                class="appearance-none rounded-md block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5630] focus:border-[#FF5630] sm:text-sm"
                placeholder="Mật khẩu"
                required
              />
            </div>

            <div class="flex justify-end">
              <a href="#" class="text-sm text-gray-600 hover:text-[#FF5630]"
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

            <p v-if="error" class="mt-2 text-center text-sm text-red-600">
              {{ error }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../api/authService";
// import { getGoogleIdToken } from '../utils/googleAuth';

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");
// Trong <script setup> của component
const handleLogin = async () => {
  try {
    const res = await login({ email: email.value, password: password.value });
    console.log("Login response:", res.data);
    localStorage.setItem("token", res.data.token);
    error.value = "";
    router.push("/chat");
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    if (err.response) {
      // Nếu có phản hồi lỗi từ server (ví dụ: 401 Unauthorized)
      if (err.response.status === 401) {
        error.value = "Email hoặc mật khẩu không chính xác.";
      } else {
        // Các lỗi khác từ server
        const serverMessage = err.response.data?.message || err.response.data;
        error.value = `Lỗi từ máy chủ: ${serverMessage || 'Không có thông tin chi tiết'}`;
      }
    } else if (err.request) {
      // Nếu request được gửi đi nhưng không nhận được phản hồi
      error.value = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.";
    } else {
      // Lỗi khác (ví dụ: lỗi cài đặt request)
      error.value = "Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.";
    }
    // Thêm một gợi ý chung
    error.value += "\nNếu bạn chưa có tài khoản, hãy chắc chắn rằng bạn đã hoàn tất quá trình đăng ký.";
  }
};

const handleGoogleLogin = () => {
  // Start server-side OAuth2 flow handled by the backend (Spring Security)
  // Backend default: http://localhost:8080
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  // The Spring Security authorization endpoint for Google is usually:
  // /oauth2/authorization/google
  window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
};
</script>

<style scoped>
/* Các styles đã được chuyển thành Tailwind utility classes trong template */
</style>
