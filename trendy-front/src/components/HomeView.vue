<template>
  <div>
    <h2>Chào mừng bạn!</h2>
    <button @click="logout">Đăng xuất</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>
