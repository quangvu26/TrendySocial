<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
    :style="{ backgroundImage: `url(/images/FormLogin/background_form.png)` }"
  >
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-center text-lg font-semibold mb-4">Quên mật khẩu</h3>

        <!-- Step 1: Enter email and send code -->
        <div v-if="step === 1" class="space-y-3">
          <div>
            <label class="text-sm text-gray-600">Email</label>
            <div class="mt-1 relative">
              <input
                v-model="email"
                type="email"
                placeholder="Email hoặc số điện thoại"
                class="w-full pr-24 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
              />
              <button
                :disabled="sending || !email"
                @click="onSendCode"
                class="absolute right-1 top-1/2 -translate-y-1/2 bg-[#FF5630] text-white px-3 py-1.5 rounded text-sm hover:bg-[#ff6647] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ sending ? 'Đang...' : 'Gửi mã' }}
              </button>
            </div>
            <p v-if="errors.email" class="text-sm text-red-600 mt-1">{{ errors.email }}</p>
            <p v-if="info" class="text-sm text-green-600 mt-1">{{ info }}</p>
          </div>

          <div>
            <label class="text-sm text-gray-600">Mã xác nhận</label>
            <input
              v-model="code"
              type="text"
              placeholder="Mã xác nhận"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
            />
            <p v-if="errors.code" class="text-sm text-red-600 mt-1">{{ errors.code }}</p>
          </div>

          <div class="flex space-x-2">
            <button
              @click="onVerifyCode"
              :disabled="verifying || !code"
              class="flex-1 bg-[#FF5630] text-white py-2 rounded hover:bg-[#ff6647] disabled:opacity-50"
            >
              {{ verifying ? 'Xác nhận...' : 'Xác nhận' }}
            </button>
          </div>
        </div>

        <!-- Step 2: Reset password -->
        <div v-if="step === 2" class="space-y-3">
          <div>
            <label class="text-sm text-gray-600">Mật khẩu mới</label>
            <input
              v-model="password"
              type="password"
              placeholder="Nhập mật khẩu mới"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
            />
            <p v-if="errors.password" class="text-sm text-red-600 mt-1">{{ errors.password }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-600">Xác nhận mật khẩu</label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Xác nhận mật khẩu"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
            />
            <p v-if="errors.confirmPassword" class="text-sm text-red-600 mt-1">{{ errors.confirmPassword }}</p>
          </div>
          <div class="flex space-x-2">
            <button @click="prevStep" class="flex-1 border border-gray-300 py-2 rounded">Quay lại</button>
            <button
              @click="onResetPassword"
              :disabled="resetting"
              class="flex-1 bg-[#FF5630] text-white py-2 rounded hover:bg-[#ff6647] disabled:opacity-50"
            >
              {{ resetting ? 'Đang lưu...' : 'Xác nhận' }}
            </button>
          </div>
        </div>

        <p class="text-center text-sm text-gray-500 mt-4">Bạn đã có tài khoản? <router-link to="/login" class="text-[#FF5630]">Đăng nhập</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { checkEmail, sendVerificationCode, verifyEmailCode, resetPassword } from '../api/authService';

const router = useRouter();

const step = ref(1);
const email = ref('');
const code = ref('');
const password = ref('');
const confirmPassword = ref('');

const sending = ref(false);
const verifying = ref(false);
const resetting = ref(false);
const info = ref('');
const errors = ref({});

const onSendCode = async () => {
  errors.value = {};
  info.value = '';
  if (!email.value) {
    errors.value.email = 'Vui lòng nhập email';
    return;
  }
  // basic email pattern
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Email không hợp lệ';
    return;
  }

  sending.value = true;
  try {
    const res = await checkEmail(email.value);
    const exists = res?.data?.exists;
    if (!exists) {
      errors.value.email = 'Tài khoản không tồn tại';
      return;
    }

    await sendVerificationCode(email.value);
    info.value = 'Đã gửi mã xác nhận tới email của bạn';
  } catch (err) {
    errors.value.email = err?.response?.data || 'Lỗi khi gửi mã';
  } finally {
    sending.value = false;
  }
};

const onVerifyCode = async () => {
  errors.value = {};
  if (!code.value) {
    errors.value.code = 'Vui lòng nhập mã xác nhận';
    return;
  }
  verifying.value = true;
  try {
    const res = await verifyEmailCode(email.value, code.value);
    // The backend returns a token; we won't necessarily store it, but proceed to reset
    // Move to step 2
    step.value = 2;
  } catch (err) {
    errors.value.code = err?.response?.data || 'Mã xác nhận không hợp lệ';
  } finally {
    verifying.value = false;
  }
};

const onResetPassword = async () => {
  errors.value = {};
  if (!password.value) {
    errors.value.password = 'Vui lòng nhập mật khẩu mới';
  } else if (password.value.length < 6) {
    errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Vui lòng xác nhận mật khẩu';
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Mật khẩu xác nhận không trùng khớp';
  }
  if (Object.keys(errors.value).length) return;

  resetting.value = true;
  try {
    await resetPassword(email.value, password.value);
    // success -> navigate to login
    router.push('/login');
  } catch (err) {
    errors.value.password = err?.response?.data || 'Lỗi khi lưu mật khẩu mới';
  } finally {
    resetting.value = false;
  }
};

const prevStep = () => {
  step.value = 1;
};
</script>
