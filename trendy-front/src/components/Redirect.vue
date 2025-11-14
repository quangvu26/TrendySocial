<template>
  <div class="flex justify-center items-center h-screen">
    <h2>Đang đăng nhập, vui lòng chờ...</h2>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import { saveToken, saveOAuthUser } from "../utils/authStorage";

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  try {
    // Try URL query params first (?token=...)
    let token = route.query.token;
    let oauthEmail = route.query.email;
    let oauthName = route.query.name;
    let oauthAvatar = route.query.picture || route.query.avatar;

    // Fallback: try URL fragment (#token=...)
    if (!token && !oauthEmail && window.location.hash) {
      const hash = window.location.hash.replace(/^#/, "");
      const params = new URLSearchParams(hash);

      token = params.get("token");
      oauthEmail = params.get("email");
      oauthName = params.get("name");
      oauthAvatar = params.get("picture") || params.get("avatar");
    }

    console.log(
      "🔍 Redirect handling - token:",
      !!token,
      "oauth:",
      !!oauthEmail
    );

    // Case 1: Has token → go to chat
    if (token && token.trim().length > 0) {
      saveToken(token);
      await router.replace("/chat");
      return;
    }

    // Case 2: Has OAuth data → go to register
    if (oauthEmail && oauthEmail.trim().length > 0) {
      const oauthData = {
        email: decodeURIComponent(oauthEmail),
        name: oauthName ? decodeURIComponent(oauthName) : "",
        avatar: oauthAvatar ? decodeURIComponent(oauthAvatar) : "",
      };
      saveOAuthUser(oauthData);
      await router.replace("/register-oauth2");
      return;
    }

    // Case 3: Nothing → go to login
    console.warn("⚠️ No token or OAuth data found - redirecting to login");
    await router.replace("/login");
  } catch (error) {
    console.error("❌ OAuth redirect error:", error);
    await router.replace("/login");
  }
});
</script>
