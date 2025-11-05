<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
    :style="{ backgroundImage: `url(/images/FormLogin/background_form.png)` }"
  >
    <div
      class="w-full max-w-3xl bg-white/95 rounded-2xl overflow-hidden shadow-2xl transition-shadow hover:shadow-2xl mx-4"
    >
      <div class="grid grid-cols-1">
        <!-- Single-column: Multi-step form (left illustration removed) -->
        <div class="p-8 flex flex-col justify-center relative overflow-hidden">
          <!-- Logo section -->
          <div class="flex flex-col items-center space-y-3 mb-6">
            <div class="flex items-center space-x-4">
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
            <p class="text-sm text-gray-600">Share the vibe, start the trend</p>
          </div>
          <!-- Progress indicator -->
          <div class="flex justify-center mb-8">
            <div class="flex items-center space-x-2">
              <div
                :class="[
                  'w-3 h-3 rounded-full transition-colors',
                  currentStep === 1 ? 'bg-[#FF5630]' : 'bg-gray-300',
                ]"
              ></div>
              <div
                :class="[
                  'w-3 h-3 rounded-full transition-colors',
                  currentStep === 2 ? 'bg-[#FF5630]' : 'bg-gray-300',
                ]"
              ></div>
              <div
                :class="[
                  'w-3 h-3 rounded-full transition-colors',
                  currentStep === 3 ? 'bg-[#FF5630]' : 'bg-gray-300',
                ]"
              ></div>
            </div>
          </div>

          <!-- Form container with sliding animation -->
          <div class="relative" style="min-height: 320px">
            <!-- Step 1: Basic Info -->
            <div v-if="currentStep === 1" class="transition-all duration-300">
              <h3 class="text-xl font-medium mb-6 text-center">Tạo tài khoản</h3>
              <form @submit.prevent="nextStep" class="space-y-4">
                <div>
                  <input
                    v-model="form.email"
                    type="email"
                    class="appearance-none rounded-md block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5630] focus:border-[#FF5630] sm:text-sm"
                    placeholder="Email của bạn"
                    required
                  />
                  <p v-if="errors.email" class="text-sm text-red-600 mt-1">{{ errors.email }}</p>
                </div>
                <div>
                  <input
                    v-model="form.ten"
                    type="text"
                    class="appearance-none rounded-md block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5630] focus:border-[#FF5630] sm:text-sm"
                    placeholder="Tên đầy đủ"
                    required
                  />
                </div>
                <div>
                  <input
                    v-model="form.id"
                    type="text"
                    class="appearance-none rounded-md block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5630] focus:border-[#FF5630] sm:text-sm"
                    placeholder="ID người dùng"
                    required
                  />
                  <p v-if="errors.id" class="text-sm text-red-600 mt-1">{{ errors.id }}</p>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >Giới tính</label
                  >
                  <div class="flex space-x-4">
                    <label class="flex items-center">
                      <input
                        type="radio"
                        v-model="form.gioiTinh"
                        :value="true"
                        class="form-radio text-[#FF5630] h-4 w-4"
                      />
                      <span class="ml-2">Nam</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        type="radio"
                        v-model="form.gioiTinh"
                        :value="false"
                        class="form-radio text-[#FF5630] h-4 w-4"
                      />
                      <span class="ml-2">Nữ</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        type="radio"
                        v-model="form.gioiTinh"
                        value="other"
                        class="form-radio text-[#FF5630] h-4 w-4"
                      />
                      <span class="ml-2">Tùy chọn</span>
                    </label>
                  </div>
                </div>

                <div>
                  <input
                    v-model="form.password"
                    type="password"
                    class="appearance-none rounded-md block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5630] focus:border-[#FF5630] sm:text-sm"
                    placeholder="Mật khẩu"
                    required
                  />
                  <p v-if="errors.password" class="text-sm text-red-600 mt-1">{{ errors.password }}</p>
                </div>
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF5630] hover:bg-[#ff6647] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5630] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <template v-if="isLoading">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang kiểm tra...
                  </template>
                  <template v-else>
                    Tiếp
                  </template>
                </button>
              </form>
            </div>

            <!-- Step 2: Birth Date -->
            <div v-if="currentStep === 2" class="transition-all duration-300">
              <h3 class="text-xl font-medium mb-6 text-center">Thêm ngày sinh</h3>
                <form @submit.prevent="nextStep" class="space-y-4">
                  <!-- Birthday illustration above the date input -->
                  <div class="flex justify-center mb-4">
                    <img
                      src="/images/FormLogin/Blowing%20out%20Birthday%20candles-pana.svg"
                      alt="Birthday illustration"
                      class="max-w-xs w-full object-contain"
                    />
                  </div>
                  <div class="mb-6">
                    <input
                      type="date"
                      v-model="form.ngaySinh"
                      class="appearance-none rounded-md block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5630] focus:border-[#FF5630] sm:text-sm"
                      required
                    />
                  </div>
                <div class="flex justify-between space-x-4">
                  <button
                    type="button"
                    @click="prevStep"
                    class="w-1/2 flex justify-center py-2 px-4 border border-[#FF5630] text-sm font-medium rounded-md text-[#FF5630] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5630]"
                  >
                    Quay lại
                  </button>
                    <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF5630] hover:bg-[#ff6647] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5630] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <template v-if="isLoading">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </template>
                    <template v-else>
                      Tiếp
                    </template>
                  </button>
                </div>
              </form>
            </div>

            <!-- Step 3: Verification Code -->
            <div v-if="currentStep === 3" class="transition-all duration-300">
              <h3 class="text-xl font-medium mb-6">Nhập mã xác nhận</h3>
              <form @submit.prevent="verifyCode" class="space-y-4">
                <p class="text-sm text-gray-600 mb-4">
                  Nhập mã xác nhận mà chúng tôi đã gửi đến địa chỉ
                  <span class="font-medium">{{ form.email }}</span>
                </p>
                <div>
                  <input
                    v-model="verificationCode"
                    type="text"
                    class="appearance-none rounded-md block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5630] focus:border-[#FF5630] sm:text-sm"
                    placeholder="Nhập mã xác nhận"
                    required
                  />
                </div>
                <div class="text-center">
                  <button
                    type="button"
                    @click="resendCode"
                    class="text-sm text-[#FF5630] hover:text-[#ff6647]"
                    :disabled="resendTimer > 0"
                  >
                    {{
                      resendTimer > 0
                        ? `Gửi lại mã sau ${resendTimer}s`
                        : "Gửi lại mã"
                    }}
                  </button>
                </div>
                <div class="flex justify-between space-x-4">
                  <button
                    type="button"
                    @click="prevStep"
                    class="w-1/2 flex justify-center py-2 px-4 border border-[#FF5630] text-sm font-medium rounded-md text-[#FF5630] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5630]"
                  >
                    Quay lại
                  </button>
                    <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF5630] hover:bg-[#ff6647] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5630] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <template v-if="isLoading">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xác nhận...
                    </template>
                    <template v-else>
                      Xác nhận
                    </template>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Login link: moved up so it's visible and not overlapped -->
          <div class="text-center text-sm mt-4 mb-4">
            <span class="text-gray-600">Bạn đã có tài khoản? </span>
            <router-link
              to="/login"
              class="font-medium text-[#FF5630] hover:text-[#ff6647]"
            >
              Đăng nhập
            </router-link>
          </div>

          <!-- Error message -->
          <p v-if="error" class="mt-2 text-center text-sm text-red-600">
            {{ error }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  register,
  sendVerificationCode,
  verifyEmailCode,
  checkEmail,
  checkId,
} from "../api/authService";

const router = useRouter();
const currentStep = ref(1);
const error = ref("");

const form = ref({
  id: "",
  ten: "",
  email: "",
  password: "",
  gioiTinh: true,
  ngaySinh: "",
});

const errors = ref({});

// UI / state refs
const isImageChanging = ref(false);
const resendTimer = ref(0);
const verificationCode = ref("");
const isLoading = ref(false);


const validateStep = () => {
  error.value = "";
  errors.value = {};

  // Step 1: basic info + password
  if (currentStep.value === 1) {
    if (!form.value.email || !form.value.ten || !form.value.id) {
      error.value = "Vui lòng điền đầy đủ thông tin";
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
      error.value = "Email không hợp lệ";
      return false;
    }
    if (!form.value.password) {
      error.value = "Vui lòng nhập mật khẩu";
      return false;
    }
    if (form.value.password.length < 6) {
      errors.value.password = "Mật khẩu phải có ít nhất 6 ký tự";
      return false;
    }
    // If id uniqueness check found an error, block
    if (errors.value.id) {
      error.value = 'Vui lòng sửa lỗi ở mục ID người dùng';
      return false;
    }
  }

  // Step 2: birthdate
  if (currentStep.value === 2) {
    if (!form.value.ngaySinh) {
      error.value = "Vui lòng nhập ngày sinh";
      return false;
    }
  }

  return true;
};

const nextStep = async () => {
  if (!validateStep()) return;

  isImageChanging.value = true;

  // If currently on step 1, perform async uniqueness checks (email + id)
  if (currentStep.value === 1) {
    isLoading.value = true;
    error.value = "";
    errors.value.email = null;
    errors.value.id = null;
    try {
      // check email only when input looks like an email
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        const res = await checkEmail(form.value.email);
        const exists = res?.data?.exists;
        if (exists) {
          errors.value.email = "Email này đã được sử dụng";
        }
      }

      // check id uniqueness
      const resId = await checkId(form.value.id);
      const idExists = resId?.data?.exists;
      if (idExists) {
        errors.value.id = 'ID này đã tồn tại';
      }

      if (errors.value.email || errors.value.id) {
        error.value = 'Vui lòng sửa các lỗi trước khi tiếp tục';
        isLoading.value = false;
        return;
      }

      // passed uniqueness checks -> advance to step 2
      currentStep.value++;
      isLoading.value = false;
      return;
    } catch (err) {
      console.error('Lỗi khi kiểm tra email/ID:', err);
      error.value = 'Lỗi khi kiểm tra thông tin. Vui lòng thử lại.';
      isLoading.value = false;
      return;
    }
  }

  if (currentStep.value === 2) {
    // This will send the verification code and advance to step 3 on success
    handleVerificationStep();
    return;
  }

  // fallback: advance
  currentStep.value++;
};

watch(currentStep, () => {
  isImageChanging.value = true;
});

const prevStep = () => {
  // guard so we don't go below step 1
  if (currentStep.value > 1) currentStep.value--;
  error.value = "";
};

const handleVerificationStep = async () => {
  error.value = "";
  isLoading.value = true;
  try {
    // ensure id is unique before registering
    await checkIdUnique();
    if (errors.value.id) {
      error.value = errors.value.id;
      isLoading.value = false;
      return;
    }
    // tạo user trước (status = true / false tùy bạn)
    await register(form.value);

    // sau đó mới gửi code
    await sendVerificationCode(form.value.email);

    startResendTimer();
    currentStep.value++;
  } catch (err) {
    console.error(err);
    error.value = "Lỗi đăng ký hoặc gửi mã xác nhận";
  } finally {
    isLoading.value = false;
  }
};

const checkIdUnique = async () => {
  errors.value.id = null;
  if (!form.value.id) return;
  try {
    const res = await checkId(form.value.id);
    const exists = res?.data?.exists;
    if (exists) {
      errors.value.id = 'ID này đã tồn tại';
    }
  } catch (e) {
    // ignore or set error
    errors.value.id = 'Không thể kiểm tra ID';
  }
};

const startResendTimer = () => {
  resendTimer.value = 60;
  const timer = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

const resendCode = async () => {
  if (resendTimer.value > 0) return;
  try {
    await sendVerificationCode(form.value.email);
    startResendTimer();
  } catch (err) {
    error.value = err?.response?.data?.message || "Không thể gửi lại mã";
  }
};

const verifyCode = async () => {
  if (!verificationCode.value) {
    error.value = "Vui lòng nhập mã xác nhận";
    return;
  }

  error.value = "";
  isLoading.value = true;

  try {
    // Gọi API verify -> backend trả token trong body { token }
    const res = await verifyEmailCode(form.value.email, verificationCode.value);

    const token = res?.data?.token;
    if (token) {
      localStorage.setItem("token", token);
      sessionStorage.removeItem("oauthUser");
      router.replace("/chat");
    } else {
      // fallback: nếu backend trả success không kèm token
      router.push("/login");
    }
  } catch (err) {
    if (err?.response?.status === 400) {
      error.value = "Mã xác nhận không chính xác";
    } else {
      error.value = err?.response?.data || "Xác nhận thất bại. Vui lòng thử lại.";
    }
  } finally {
    isLoading.value = false;
  }
};

</script>

<style scoped>
/* Transition styles */
.transform {
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>