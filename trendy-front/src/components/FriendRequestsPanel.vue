<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="w-full max-w-md bg-white rounded shadow p-4">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-semibold">Lời mời kết bạn</h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-900"
        >
          Đóng
        </button>
      </div>

      <div
        v-if="!requests || requests.length === 0"
        class="text-sm text-gray-500"
      >
        Không có lời mời nào.
      </div>

      <ul v-else class="space-y-3 max-h-72 overflow-auto">
        <li
          v-for="req in requests"
          :key="req.maYeuCau"
          class="flex items-center justify-between"
        >
          <div
            class="flex items-center cursor-pointer hover:opacity-80"
            @click="emit('viewUserProfile', req.from)"
          >
            <img
              src="/images/Avatar/male_avatar.png"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div class="ml-3">
              <div class="font-medium">{{ req.from }}</div>
              <div class="text-xs text-gray-400">
                {{ formatDate(req.ngayGui) }}
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              :disabled="inFlight[req.maYeuCau]"
              @click="$emit('accept', req.maYeuCau, req.from)"
              class="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-60"
            >
              Chấp nhận
            </button>
            <button
              :disabled="inFlight[req.maYeuCau]"
              @click="$emit('reject', req.maYeuCau)"
              class="px-3 py-1 border rounded disabled:opacity-60"
            >
              Từ chối
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
const props = defineProps({ requests: { type: Array, default: () => [] } });
const emit = defineEmits(["accept", "reject", "close", "viewUserProfile"]);

// simple reactive map to allow button disabled state from parent if needed
const inFlight = reactive({});

const formatDate = (d) => {
  if (!d) return "";
  try {
    const dt = new Date(d);
    return dt.toLocaleString();
  } catch (e) {
    return d;
  }
};

// note: we keep the inFlight state local for visual feedback only; parent should manage actual requests
// parent may pass events; we don't mutate requests here
</script>

<style scoped></style>
