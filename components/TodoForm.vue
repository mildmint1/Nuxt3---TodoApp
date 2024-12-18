<template>
  <form @submit.prevent="onAdd" class="flex gap-4 mb-6">
    <div class="flex-1 relative">
      <input
        v-model="newTask"
        placeholder="やることを入力してください"
        @focus="showSearchHistory = true"
        class="w-full px-4 py-2 border rounded-lg focus:ring-blue-400"
      />
      <SearchHistory
        v-if="showSearchHistory && searchHistory.length"
        :history="searchHistory"
        @select="onSelectHistory"
        @delete="onDeleteHistory"
      />
    </div>
    <button @click="onSearch" type="button" class="px-4 py-2 bg-gray-300">
      🔍
    </button>
    <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded-lg">
      追加
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SearchHistory from "./SearchHistory.vue";

const props = defineProps<{ history: string[] }>();
const searchHistory = props.history;
const newTask = ref("");
const showSearchHistory = ref(false);

const emit = defineEmits(["add", "search", "select-history", "delete-history"]);

const onAdd = () => emit("add", newTask.value);
const onSearch = () => emit("search", newTask.value);
const onSelectHistory = (item: string) => emit("select-history", item);
const onDeleteHistory = (index: number) => emit("delete-history", index);
</script>
