<template>
  <div class="min-h-screen bg-gray-100 overflow-auto">
    <!-- 上部セクション -->
    <div class="flex flex-col items-center justify-start pt-10">
      <h1 class="text-4xl font-bold text-blue-600 mb-6">Todo List App</h1>
      <nuxt-link
        to="/todo"
        class="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-lg hover:bg-blue-600 transition"
      >
        TODO List
      </nuxt-link>
    </div>

    <!-- 最近の活動セクション -->
    <div
      class="mt-10 w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 class="text-xl font-semibold text-gray-700 mb-4">recent</h2>
      <ul class="space-y-2">
        <li
          v-for="activity in activities"
          :key="activity.id"
          class="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow cursor-pointer hover:bg-blue-100"
          @click="goToTodo(activity.todoId)"
        >
          <span class="text-gray-600">{{ activity.text }}</span>
          <span class="text-sm text-gray-400">{{
            new Date(activity.id).toLocaleString("ja-JP")
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";

import { useRouter } from "vue-router";
import { useActivityStore } from "../stores/activityStore";

const activityStore = useActivityStore();
const activities = computed(() => activityStore.activities);
const router = useRouter();

// コンポーネントがマウントされたとき、活動データをロード
onMounted(() => {
  activityStore.loadActivities(); // クッキーから活動データをロードする
});

// Todoリストへ移動する関数
const goToTodo = (todoId?: number) => {
  if (!todoId) return;
  router.push({ path: "/todo", query: { highlight: todoId } });
};
</script>
