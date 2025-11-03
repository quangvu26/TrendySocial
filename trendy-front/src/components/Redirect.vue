<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  try {
    // Try query param first (backwards compatibility), then fragment (#token=...)
    let token = route.query.token;
    let oauthEmail = route.query.email;
    let oauthName = route.query.name;
    let oauthAvatar = route.query.picture || route.query.avatar;

    if (!token && !oauthEmail && window.location.hash) {
      // hash is like #token=eyJ... or email=...&name=...&avatar=...
      const hash = window.location.hash.replace(/^#/, "");
      const params = new URLSearchParams(hash);

      token = params.get("token");
      oauthEmail = params.get("email");
      oauthName = params.get("name");
      oauthAvatar = params.get("picture") || params.get("avatar");
    }

    if (token) {
      console.log("Token found, redirecting to chat");
      // Save token and navigate to chat. Use replace to remove token from history.
      localStorage.setItem("token", token);
      await router.replace("/chat");
    } else if (oauthEmail) {
      console.log("OAuth data found, redirecting to register");
      // Store oauth data temporarily and navigate to register completion form
      const oauthData = {
        email: decodeURIComponent(oauthEmail),
        name: oauthName ? decodeURIComponent(oauthName) : "",
        avatar: oauthAvatar ? decodeURIComponent(oauthAvatar) : "",
        kieuDangNhap: "GOOGLE",
      };
      sessionStorage.setItem("oauthUser", JSON.stringify(oauthData));
      // navigate to OAuth registration page where user completes account
      await router.replace("/register-oauth2");
    } else {
      console.log("No token or oauth data found, redirecting to login");
      // No token or oauth data found -> go back to login
      await router.replace("/login");
    }
  } catch (error) {
    console.error("Error in OAuth redirect:", error);
    await router.replace("/login");
  }
});
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <h2>Đang đăng nhập, vui lòng chờ...</h2>
  </div>
</template>
