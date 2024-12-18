<template>
  <li
    class="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow"
    :class="{ 'bg-yellow-200': todo.id === highlightId }"
  >
    <div class="flex items-center gap-3">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="emit('toggle', todo.id)"
        class="w-5 h-5 accent-blue-500"
      />
      <span
        v-if="!isEditing"
        :class="{ 'line-through text-gray-400': todo.completed }"
        @dblclick="startEdit"
        class="cursor-pointer"
      >
        {{ todo.text }}
      </span>
      <input
        v-else
        v-model="editText"
        @keyup.enter="saveEdit"
        class="px-2 py-1 border rounded-lg"
      />
    </div>
    <div class="flex gap-2">
      <button @click="emit('remove', todo.id)" class="text-red-500">
        削除
      </button>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Todo } from "~/types/todo";

const props = defineProps<{ todo: Todo; highlightId?: number | null }>();
const emit = defineEmits(["toggle", "edit", "remove"]);

const isEditing = ref(false);
const editText = ref(props.todo.text);

const startEdit = () => (isEditing.value = true);
const saveEdit = () => {
  emit("edit", props.todo.id, editText.value);
  isEditing.value = false;
};
</script>
