import "./global-polyfill";
import "./utils/migrate-storage"; // Must run FIRST

import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { clearAllAuth } from "./utils/authStorage";
import { testFriendStatus } from "./composables/useFriendStatusDebug";

clearAllAuth();

// Attach debug helper to window
if (typeof window !== "undefined") {
  window.testFriendStatus = testFriendStatus;
}

const app = createApp(App);
app.use(router);
app.mount("#app");
