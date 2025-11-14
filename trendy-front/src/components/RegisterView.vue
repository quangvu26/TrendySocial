<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
    :style="{ backgroundImage: `url(/images/FormLogin/background_form.png)` }"
  >
    <div
      class="w-full max-w-3xl bg-white/95 rounded-2xl overflow-hidden shadow-2xl mx-4"
    >
      <div class="p-8 flex flex-col justify-center">
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

        <div class="flex justify-center mb-8">
          <div class="flex items-center space-x-2">
            <div
              :class="[
                'w-3 h-3 rounded-full transition-colors',
                currentStep >= 1 ? 'bg-[#FF5630]' : 'bg-gray-300',
              ]"
            ></div>
            <div
              :class="[
                'w-3 h-3 rounded-full transition-colors',
                currentStep >= 2 ? 'bg-[#FF5630]' : 'bg-gray-300',
              ]"
            ></div>
            <div
              :class="[
                'w-3 h-3 rounded-full transition-colors',
                currentStep >= 3 ? 'bg-[#FF5630]' : 'bg-gray-300',
              ]"
            ></div>
          </div>
        </div>

        <p v-if="error" class="text-center text-sm text-red-600 mb-4">
          {{ error }}
        </p>

        <div v-if="currentStep === 1" class="space-y-4">
          <h3 class="text-xl font-medium mb-6">Tạo tài khoản</h3>
          <form @submit.prevent="nextStep" class="space-y-4">
            <div>
              <input
                v-model="form.email"
                type="email"
                placeholder="Email"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
                required
              />
              <p v-if="errors.email" class="text-sm text-red-600 mt-1">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <input
                v-model="form.ten"
                type="text"
                placeholder="Tên đầy đủ"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
                required
              />
              <p v-if="errors.ten" class="text-sm text-red-600 mt-1">
                {{ errors.ten }}
              </p>
            </div>

            <div>
              <input
                v-model="form.id"
                type="text"
                placeholder="ID người dùng"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
                required
              />
              <p v-if="errors.id" class="text-sm text-red-600 mt-1">
                {{ errors.id }}
              </p>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium">Giới tính</label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="form.gioiTinh"
                    :value="true"
                    class="form-radio text-[#FF5630]"
                  />
                  <span class="ml-2">Nam</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="form.gioiTinh"
                    :value="false"
                    class="form-radio text-[#FF5630]"
                  />
                  <span class="ml-2">Nữ</span>
                </label>
              </div>
            </div>

            <div>
              <input
                v-model="form.password"
                type="password"
                placeholder="Mật khẩu (6+ ký tự)"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
                required
              />
              <p v-if="errors.password" class="text-sm text-red-600 mt-1">
                {{ errors.password }}
              </p>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-[#FF5630] text-white py-3 rounded-md hover:bg-[#ff6647] disabled:opacity-50 transition"
            >
              {{ isLoading ? "Đang kiểm tra..." : "Tiếp" }}
            </button>
          </form>
        </div>

        <div v-if="currentStep === 2" class="space-y-4">
          <h3 class="text-xl font-medium mb-6">Ngày sinh</h3>
          <div class="flex flex-col md:flex-row gap-6 items-center">
            <div class="flex-1">
              <img
                src="/images/FormLogin/Blowing out Birthday candles-pana.svg"
                alt="Birthday"
                class="w-full h-auto"
              />
            </div>
            <form @submit.prevent="nextStep" class="flex-1 space-y-4 w-full">
              <input
                v-model="form.ngaySinh"
                type="date"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
                required
              />

              <div class="flex space-x-4">
                <button
                  type="button"
                  @click="prevStep"
                  class="flex-1 border border-[#FF5630] text-[#FF5630] py-2 rounded-md hover:bg-gray-50 transition"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  class="flex-1 bg-[#FF5630] text-white py-2 rounded-md hover:bg-[#ff6647] transition"
                >
                  Tiếp
                </button>
              </div>
            </form>
          </div>
        </div>

        <div v-if="currentStep === 3" class="space-y-4">
          <h3 class="text-xl font-medium mb-6">Xác nhận Email</h3>
          <div class="flex flex-col md:flex-row gap-6 items-center">
            <div class="flex-1">
              <img
                src="/images/FormLogin/Mail sent-bro.svg"
                alt="Email Verification"
                class="w-full h-auto"
              />
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-600 mb-4">
                Mã xác nhận đã gửi tới <strong>{{ form.email }}</strong>
              </p>

              <form @submit.prevent="handleVerifyCode" class="space-y-4">
                <input
                  v-model="verificationCode"
                  type="text"
                  placeholder="Mã xác nhận"
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
                  required
                />

                <div class="flex justify-between text-sm">
                  <button
                    type="button"
                    @click="resendCode"
                    :disabled="resendTimer > 0"
                    class="text-[#FF5630] hover:text-[#ff6647] disabled:opacity-50 transition"
                  >
                    {{
                      resendTimer > 0
                        ? `Gửi lại sau ${resendTimer}s`
                        : "Gửi lại mã"
                    }}
                  </button>
                </div>

                <div class="flex space-x-4">
                  <button
                    type="button"
                    @click="prevStep"
                    class="flex-1 border border-[#FF5630] text-[#FF5630] py-2 rounded-md hover:bg-gray-50 transition"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    :disabled="isLoading"
                    class="flex-1 bg-[#FF5630] text-white py-2 rounded-md hover:bg-[#ff6647] disabled:opacity-50 transition"
                  >
                    {{ isLoading ? "Xác nhận..." : "Xác nhận" }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <p class="text-center text-sm text-gray-600 mt-4">
          Bạn đã có tài khoản?
          <router-link
            to="/login"
            class="text-[#FF5630] font-medium hover:text-[#ff6647]"
          >
            Đăng nhập
          </router-link>
        </p>
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
} from "../api/authService";
import { saveToken, clearOAuthUser } from "../utils/authStorage";
import {
  validateEmail,
  validatePassword,
  validateId,
  validateName,
  validateDate,
} from "../utils/validators";
import { handleAuthError } from "../utils/errorHandler";
import { checkBothUnique } from "../utils/asyncChecks";

const router = useRouter();
const currentStep = ref(1);
const error = ref("");
const isLoading = ref(false);
const resendTimer = ref(0);

const form = ref({
  id: "",
  ten: "",
  email: "",
  password: "",
  gioiTinh: true,
  ngaySinh: "",
});

const errors = ref({});
const verificationCode = ref("");

// ✅ UNIFIED VALIDATION
const validateStep = (step) => {
  errors.value = {};
  error.value = "";

  if (step === 1) {
    if (!validateEmail(form.value.email)) {
      errors.value.email = "Email không hợp lệ";
      return false;
    }
    if (!validateName(form.value.ten)) {
      errors.value.ten = "Tên không được để trống";
      return false;
    }
    if (!validateId(form.value.id)) {
      errors.value.id = "ID không được để trống";
      return false;
    }
    if (!validatePassword(form.value.password)) {
      errors.value.password = "Mật khẩu phải từ 6 ký tự";
      return false;
    }
  }

  if (step === 2) {
    if (!validateDate(form.value.ngaySinh)) {
      error.value = "Vui lòng chọn ngày sinh";
      return false;
    }
  }

  return true;
};

// ✅ UNIFIED ASYNC CHECKS
const checkUniquenessStep1 = async () => {
  isLoading.value = true;
  errors.value = {};

  try {
    const {
      emailExists,
      idExists,
      errors: checkErrors,
    } = await checkBothUnique(form.value.email, form.value.id);

    if (checkErrors.email) {
      error.value = checkErrors.email;
      return false;
    }

    if (checkErrors.id) {
      error.value = checkErrors.id;
      return false;
    }

    if (emailExists) {
      errors.value.email = "Email này đã được sử dụng";
    }

    if (idExists) {
      errors.value.id = "ID này đã tồn tại";
    }

    if (emailExists || idExists) {
      error.value = "Vui lòng sửa các lỗi trước khi tiếp tục";
      return false;
    }

    return true;
  } finally {
    isLoading.value = false;
  }
};

// ✅ NEXT STEP
const nextStep = async () => {
  if (!validateStep(currentStep.value)) return;

  if (currentStep.value === 1) {
    if (!(await checkUniquenessStep1())) return;
    // Register và send code
    await handleRegisterAndSendCode();
  } else {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    error.value = "";
  }
};
const handleRegisterAndSendCode = async () => {
  error.value = "";
  isLoading.value = true;

  try {
    const regRes = await register(form.value);
    await sendVerificationCode(form.value.email);
    startResendTimer();
    isLoading.value = false;
    currentStep.value++;
  } catch (err) {
    console.error("❌ Register error:", err);
    error.value = handleAuthError(err);
    isLoading.value = false;
  }
};

// ✅ VERIFY CODE
const handleVerifyCode = async () => {
  if (!verificationCode.value) {
    error.value = "Vui lòng nhập mã xác nhận";
    return;
  }

  error.value = "";
  isLoading.value = true;

  try {
    const res = await verifyEmailCode(form.value.email, verificationCode.value);
    if (res.data.token) {
      saveToken(res.data.token);
      clearOAuthUser();
      router.replace("/chat");
    }
  } catch (err) {
    error.value = handleAuthError(err);
  } finally {
    isLoading.value = false;
  }
};

// ✅ RESEND CODE
const resendCode = async () => {
  if (resendTimer.value > 0) return;

  error.value = "";
  try {
    await sendVerificationCode(form.value.email);
    startResendTimer();
    error.value = "";
  } catch (err) {
    error.value = handleAuthError(err);
  }
};

const startResendTimer = () => {
  resendTimer.value = 60;
  const timer = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0) clearInterval(timer);
  }, 1000);
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
