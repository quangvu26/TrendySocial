import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../components/HomeView.vue";
import LoginView from "../components/LoginView.vue";
import RegisterOauth2View from "../components/RegisterOauth2View.vue";
import Redirect from "../components/Redirect.vue";
import RegisterView from "../components/RegisterView.vue";
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: LoginView,
  },
  {
    path: "/register-oauth2",
    component: RegisterOauth2View,
  },
  {
    path: "/register",
    component: RegisterView,
  },
  {
    // Route used by backend OAuth2 redirect: backend will redirect to
    // https://localhost:5173/trendy/auth/oauth2/redirect?token=... (see backend)
    path: "/trendy/auth/oauth2/redirect",
    name: "oauth2-redirect",
    component: Redirect,
    props: route => ({
      token: route.query.token,
      query: route.query
    })
  },
  {
    path: "/chat",
    component: HomeView,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
