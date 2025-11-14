<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
    :style="{ backgroundImage: `url(/images/FormLogin/background_form.png)` }"
  >
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h3 class="text-center text-lg font-semibold mb-4">Quên mật khẩu</h3>

      <div v-if="step === 1" class="space-y-4">
        <div>
          <label class="text-sm text-gray-600">Email</label>
          <div class="mt-1 relative">
            <input
              v-model="email"
              type="email"
              placeholder="Nhập email"
              class="w-full pr-24 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
            />
            <button
              :disabled="sending || !email"
              @click="onSendCode"
              class="absolute right-1 top-1/2 -translate-y-1/2 bg-[#FF5630] text-white px-3 py-1 rounded text-sm hover:bg-[#ff6647] disabled:opacity-50 transition"
            >
              {{ sending ? "Đang..." : "Gửi mã" }}
            </button>
          </div>
          <p v-if="errors.email" class="text-sm text-red-600 mt-1">
            {{ errors.email }}
          </p>
          <p v-if="info" class="text-sm text-green-600 mt-1">{{ info }}</p>
        </div>

        <div>
          <label class="text-sm text-gray-600">Mã xác nhận</label>
          <input
            v-model="code"
            type="text"
            placeholder="Nhập mã"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
          />
          <p v-if="errors.code" class="text-sm text-red-600 mt-1">
            {{ errors.code }}
          </p>
        </div>

        <button
          @click="onVerifyCode"
          :disabled="verifying || !code"
          class="w-full bg-[#FF5630] text-white py-2 rounded hover:bg-[#ff6647] disabled:opacity-50 transition"
        >
          {{ verifying ? "Xác nhận..." : "Xác nhận" }}
        </button>
      </div>

      <div v-if="step === 2" class="space-y-4">
        <div>
          <label class="text-sm text-gray-600">Mật khẩu mới</label>
          <input
            v-model="password"
            type="password"
            placeholder="Nhập mật khẩu"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
          />
          <p v-if="errors.password" class="text-sm text-red-600 mt-1">
            {{ errors.password }}
          </p>
        </div>

        <div>
          <label class="text-sm text-gray-600">Xác nhận mật khẩu</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Xác nhận mật khẩu"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
          />
          <p v-if="errors.confirmPassword" class="text-sm text-red-600 mt-1">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <div class="flex space-x-2">
          <button
            @click="prevStep"
            class="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50 transition"
          >
            Quay lại
          </button>
          <button
            @click="onResetPassword"
            :disabled="resetting"
            class="flex-1 bg-[#FF5630] text-white py-2 rounded hover:bg-[#ff6647] disabled:opacity-50 transition"
          >
            {{ resetting ? "Đang lưu..." : "Lưu" }}
          </button>
        </div>
      </div>

      <p class="text-center text-sm text-gray-500 mt-4">
        <router-link to="/login" class="text-[#FF5630]"
          >← Quay lại đăng nhập</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  checkEmail,
  sendVerificationCode,
  verifyEmailCode,
  resetPassword,
} from "../api/authService";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "../utils/validators";
import { handleAuthError } from "../utils/errorHandler";
import { checkEmailExists } from "../utils/asyncChecks";

const router = useRouter();
const step = ref(1);
const email = ref("");
const code = ref("");
const password = ref("");
const confirmPassword = ref("");

const sending = ref(false);
const verifying = ref(false);
const resetting = ref(false);
const info = ref("");
const errors = ref({});

const onSendCode = async () => {
  errors.value = {};
  info.value = "";

  if (!validateEmail(email.value)) {
    errors.value.email = "Email không hợp lệ";
    return;
  }

  sending.value = true;
  try {
    const { exists, error: checkError } = await checkEmailExists(email.value);
    if (checkError) {
      errors.value.email = checkError;
      return;
    }

    if (!exists) {
      errors.value.email = "Tài khoản không tồn tại";
      return;
    }

    await sendVerificationCode(email.value);
    info.value = "Mã xác nhận đã gửi";
  } catch (err) {
    errors.value.email = handleAuthError(err);
  } finally {
    sending.value = false;
  }
};

const onVerifyCode = async () => {
  errors.value = {};

  if (!code.value) {
    errors.value.code = "Vui lòng nhập mã";
    return;
  }

  verifying.value = true;
  try {
    await verifyEmailCode(email.value, code.value);
    step.value = 2;
  } catch (err) {
    errors.value.code = handleAuthError(err);
  } finally {
    verifying.value = false;
  }
};

const onResetPassword = async () => {
  errors.value = {};

  if (!validatePassword(password.value)) {
    errors.value.password = "Mật khẩu từ 6 ký tự";
    return;
  }

  if (!validatePasswordMatch(password.value, confirmPassword.value)) {
    errors.value.confirmPassword = "Mật khẩu không trùng khớp";
    return;
  }

  resetting.value = true;
  try {
    await resetPassword(email.value, password.value);
    router.push("/login");
  } catch (err) {
    errors.value.password = handleAuthError(err);
  } finally {
    resetting.value = false;
  }
};

const prevStep = () => {
  step.value = 1;
  errors.value = {};
};
</script>
