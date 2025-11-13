<!-- filepath: f:\Du_An\TrendySocialApp\trendy-front\src\components\FriendButton.vue -->
<template>
  <button
    @click="handleClick"
    :disabled="isButtonDisabled"
    class="px-3 py-1 text-sm rounded transition-all"
    :class="buttonClass"
    :title="buttonTitle"
  >
    {{ buttonText }}
  </button>
</template>

<script setup>
import { computed } from "vue";
import { useFriendButtonState } from "../composables/useFriendButtonState";

const props = defineProps({
  myUserId: String,
  friendId: String,
  onFriendStateChange: Function,
});

const emit = defineEmits(["unfriend", "request-sent", "request-cancelled"]);

const {
  friendState,
  isLoading,
  error,
  buttonText,
  isButtonDisabled,
  loadFriendState,
  handleButtonClick,
} = useFriendButtonState();

// Load initial state
loadFriendState(props.myUserId, props.friendId);

/**
 * Button styling based on state
 * Only show: orange (Kết bạn) or yellow (Đã gửi lời mời)
 */
const buttonClass = computed(() => {
  if (buttonText.value === "Đã gửi lời mời") {
    return "bg-yellow-500 text-white hover:bg-yellow-600";
  }
  return "bg-[#FF5630] text-white hover:bg-[#FF4520]";
});

/**
 * Button title for tooltip
 */
const buttonTitle = computed(() => {
  if (buttonText.value === "Đã gửi lời mời") {
    return "Click để hủy lời mời";
  }
  return "Gửi lời mời kết bạn";
});

/**
 * Handle button click with proper state management
 */
const handleClick = async () => {
  if (isButtonDisabled.value) return;

  console.log(`🔄 Friend button clicked. Current state: ${friendState.value}`);

  const result = await handleButtonClick(props.myUserId, props.friendId);

  if (!result.success) {
    alert(`Lỗi: ${error.value || "Không rõ"}`);
    return;
  }

  // Emit appropriate event based on action
  if (result.action === "send") {
    console.log("✅ Friend request sent");
    emit("request-sent", props.friendId);
  } else if (result.action === "cancel") {
    console.log("✅ Friend request cancelled");
    emit("request-cancelled", props.friendId);
  } else if (result.action === "unfriend") {
    console.log("✅ Unfriended");
    emit("unfriend", props.friendId);
  }

  // Notify parent of state change
  if (props.onFriendStateChange) {
    props.onFriendStateChange(friendState.value);
  }
};

// Expose state for parent component
defineExpose({
  friendState,
  loadFriendState,
});
</script>

<style scoped>
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
