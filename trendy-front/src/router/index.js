import { createRouter, createWebHistory } from "vue-router";
import { storage } from "../utils/storage";
import {
  startTokenRefresh,
  stopTokenRefresh,
} from "../api/tokenRefreshService";

const routes = [
  {
    path: "/",
    redirect: "/chat",
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../components/LoginView.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../components/RegisterView.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("../components/ForgotPassword.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/register-oauth2",
    name: "RegisterOAuth2",
    component: () => import("../components/RegisterOauth2View.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/trendy/auth/oauth2/redirect",
    name: "OAuth2Redirect",
    component: () => import("../components/Redirect.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/chat",
    name: "Chat",
    component: () => import("../components/HomeView.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

import { getTokenDirect } from "../utils/directStorage.js";

router.beforeEach((to, from, next) => {
  const port = window.location.port || "5173";
  const tokenKey = `trendy_${port}_token`;

  // Use direct localStorage access (most reliable)
  const token = getTokenDirect();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // If route requires authentication
  if (requiresAuth) {
    if (!token) {
      console.warn("❌ No token found in storage, redirecting to login");
      console.warn(
        "   All storage keys:",
        Object.keys(localStorage).filter((k) => k.includes("trendy"))
      );
      next("/login");
      return;
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error("❌ Invalid token format (not JWT)");
        localStorage.removeItem(tokenKey);
        next("/login");
        return;
      }

      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp;

      if (exp && exp * 1000 < Date.now()) {
        console.warn("❌ Token expired, clearing and redirecting to login");
        localStorage.removeItem(tokenKey);
        next("/login");
        return;
      }
    } catch (e) {
      console.error("❌ Invalid token format:", e);
      localStorage.removeItem(tokenKey);
      next("/login");
      return;
    }

    next();
    return;
  }

  // If user has valid token and tries to access login/register page, redirect to chat
  if ((to.path === "/login" || to.path === "/register") && token) {
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        const exp = payload.exp;
        // Only redirect if token is still valid
        if (!exp || exp * 1000 > Date.now()) {
          next("/chat");
          return;
        }
      }
    } catch (e) {
      // Invalid token, allow to proceed to login
      console.warn("⚠️ Token parse failed, allowing login page");
    }
  }

  next();
});

// After defining router, add afterEach hook
router.afterEach((to, from) => {
  const token = storage.getToken();

  if (token && to.path === "/chat") {
    // User is logged in and on chat page - start auto-refresh
    startTokenRefresh();
  } else if (!token) {
    // No token - stop refresh
    stopTokenRefresh();
  }
});

export default router;
