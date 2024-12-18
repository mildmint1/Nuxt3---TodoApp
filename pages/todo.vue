<template>
  <div class="min-h-screen bg-gray-100 py-10">
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <!-- Form -->
      <TodoForm
        :history="searchHistory"
        @add="addTodo"
        @search="searchTask"
        @select-history="selectSearchHistory"
        @delete-history="deleteSearchHistory"
      />

      <!-- 검색 리셋 버튼 -->
      <button
        v-if="isSearching"
        @click="resetSearch"
        class="px-6 py-2 mb-4 bg-gray-400 text-white rounded-lg"
      >
        すべて表示
      </button>

      <!-- Todo List -->
      <TodoList
        :todos="filteredTodos"
        :highlight-id="highlightId"
        @toggle="toggleComplete"
        @edit="editTodo"
        @remove="removeTodo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTodoStore } from "../stores/todoStore";
import type { Todo } from "../types/todo";
import TodoForm from "~/components/TodoForm.vue";

const todoStore = useTodoStore();
const searchHistory = ref<string[]>([]);
const isSearching = ref(false);
const filteredTodos = computed<Todo[]>(() => todoStore.todos);

const highlightId = ref<number | null>(null);

const selectSearchHistory = (history: string) => {
  // 선택된 검색 기록을 사용하여 검색 실행
  searchTask(history);
};

const deleteSearchHistory = (index: number) => {
  // 검색 기록 삭제
  searchHistory.value.splice(index, 1);
};

const toggleComplete = (id: number) => {
  todoStore.toggleComplete(id);
};

const editTodo = (id: number, newText: string) => {
  todoStore.updateTodo(id, newText);
};

const removeTodo = (id: number) => {
  todoStore.removeTodo(id);
};

const addTodo = (text: string) => todoStore.addTodo(text);
const searchTask = (text: string) => {
  /* 검색 로직 */
};
const resetSearch = () => {
  isSearching.value = false;
};
</script>
