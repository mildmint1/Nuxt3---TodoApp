<template>
  <ul class="absolute left-0 top-12 bg-white border rounded-lg shadow-md">
    <li
      v-for="(item, index) in history"
      :key="index"
      class="flex items-center justify-between px-4 py-2 hover:bg-gray-100"
    >
      <span @click="select(item)" class="cursor-pointer">{{ item }}</span>
      <button
        @click.stop="remove(index)"
        class="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        削除
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{ history: string[] }>();
const emit = defineEmits(["select", "delete"]);

const select = (item: string) => emit("select", item);
const remove = (index: number) => emit("delete", index);
</script>
