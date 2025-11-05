<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-52 sm:px-6 lg:px-8 bg-cover bg-center"
    :style="{ backgroundImage: `url(/images/FormLogin/background_form.png)` }"
  >
    <div class="w-full max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
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
      <h2 class="text-xl font-semibold mb-4 text-center">
        Hoàn thiện thông tin
      </h2>
      <form @submit.prevent="handleRegister" class="space-y-3">
        <div>
          <label class="block text-sm">Id người dùng</label>
          <input
            v-model="id"
            @blur="checkIdUnique"
            required
            class="w-full px-3 py-2 border rounded"
          />
          <p v-if="errors.id" class="text-sm text-red-600 mt-1">
            {{ errors.id }}
          </p>
        </div>
        <div>
          <label class="block text-sm">Họ tên</label>
          <input
            v-model="ten"
            required
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label class="block text-sm">Email</label>
          <input
            v-model="email"
            type="email"
            readonly
            class="w-full px-3 py-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label class="block text-sm">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border rounded"
          />
          <p v-if="errors.password" class="text-sm text-red-600 mt-1">
            {{ errors.password }}
          </p>
        </div>
        <div>
          <label class="block text-sm">Giới tính</label>
          <select v-model="gioiTinh" class="w-full px-3 py-2 border rounded">
            <option :value="true">Nam</option>
            <option :value="false">Nữ</option>
          </select>
        </div>
        <div>
          <label class="block text-sm">Ngày sinh</label>
          <input
            v-model="ngaySinh"
            type="date"
            required
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div class="flex justify-center">
          <button
            type="submit"
            class="px-4 py-2 bg-[#FF5630] text-white rounded"
          >
            Xác nhận
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { register, login, checkId } from "../api/authService";

const router = useRouter();
const route = useRoute();

const id = ref("");
const ten = ref("");
const email = ref("");
const password = ref("");
const gioiTinh = ref(true);
const ngaySinh = ref("");
const errors = ref({});

onMounted(() => {
  // If user comes here from OAuth flow, prefill email/name from sessionStorage
  try {
    const raw = sessionStorage.getItem("oauthUser");
    if (raw) {
      const oauth = JSON.parse(raw);
      if (oauth.email) email.value = oauth.email;
      if (oauth.name) ten.value = oauth.name;
      // set a default id suggestion
      if (!id.value && oauth.email) {
        id.value = oauth.email.split("@")[0];
      }
    }
  } catch (e) {
    // ignore
  }
});

const handleRegister = async () => {
  errors.value = {};
  if (!id.value) {
    errors.value.id = "Vui lòng nhập id";
    return;
  }
  if (password.value.length < 6) {
    errors.value.password = "Mật khẩu phải từ 6 ký tự trở lên";
    return;
  }
  // ensure id uniqueness
  await checkIdUnique();
  if (errors.value.id) return;
  try {
    const payload = {
      id: id.value,
      ten: ten.value,
      email: email.value,
      password: password.value,
      gioiTinh: gioiTinh.value,
      ngaySinh: ngaySinh.value || "2000-01-01",
    };
    const res = await register(payload);
    // If backend returned token in response, store it and go to chat
    if (res?.data?.token) {
      localStorage.setItem("token", res.data.token);
      sessionStorage.removeItem("oauthUser");
      router.replace("/chat");
      return;
    }
    // Otherwise, fall back to login to obtain token
    const loginRes = await login({
      email: email.value,
      password: password.value,
    });
    if (loginRes?.data?.token) {
      localStorage.setItem("token", loginRes.data.token);
      sessionStorage.removeItem("oauthUser");
      router.replace("/chat");
      return;
    }
    alert(
      "Đăng ký thành công, nhưng không thể đăng nhập tự động. Vui lòng đăng nhập bằng tay."
    );
    router.push("/login");
  } catch (err) {
    const msg = err?.response?.data || err?.message || "Đăng ký thất bại";
    alert(msg);
  }
};

const checkIdUnique = async () => {
  errors.value.id = null;
  if (!id.value) return;
  try {
    const res = await checkId(id.value);
    if (res?.data?.exists) {
      errors.value.id = "ID này đã tồn tại";
    }
  } catch (e) {
    errors.value.id = "Không thể kiểm tra ID";
  }
};
</script>
