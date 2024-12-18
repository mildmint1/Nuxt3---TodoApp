<template>
  <ul class="space-y-4">
    <TodoItem
      v-for="(todo, index) in todos"
      :key="todo.id"
      :todo="todo"
      :highlight-id="highlightId"
      @toggle="onToggle"
      @edit="onEdit"
      @remove="onRemove"
    />
  </ul>
</template>

<script setup lang="ts">
import type { Todo } from "~/types/todo";
import TodoItem from "./TodoItem.vue";

defineProps<{ todos: Todo[]; highlightId?: number | null }>();
const emit = defineEmits(["toggle", "edit", "remove"]);

const onToggle = (id: number) => emit("toggle", id);
const onEdit = (todo: Todo, index: number) => emit("edit", todo, index);
const onRemove = (id: number) => emit("remove", id);
</script>
