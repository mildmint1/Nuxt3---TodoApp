<template>
  <div class="min-h-screen bg-gray-100 py-10">
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <!-- フォーム -->
      <TodoForm
        :history="searchHistory"
        @add="addTodo"
        @search="searchTask"
        @select-history="selectSearchHistory"
        @delete-history="deleteSearchHistory"
      />

      <!-- 検索リセットボタン -->
      <button
        v-if="isSearching"
        @click="resetSearch"
        class="px-6 py-2 mb-4 bg-gray-400 text-white rounded-lg"
      >
        すべて表示
      </button>

      <!-- Todoリスト -->
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

// 選択された検索履歴を使用して検索を実行
const selectSearchHistory = (history: string) => {
  searchTask(history);
};

// 検索履歴を削除
const deleteSearchHistory = (index: number) => {
  searchHistory.value.splice(index, 1);
};

// 完了状態を切り替える
const toggleComplete = (id: number) => {
  todoStore.toggleComplete(id);
};

// Todoを編集する
const editTodo = (id: number, newText: string) => {
  todoStore.updateTodo(id, newText);
};

// Todoを削除する
const removeTodo = (id: number) => {
  todoStore.removeTodo(id);
};

// Todoを追加する
const addTodo = (text: string) => todoStore.addTodo(text);

// 検索を実行する
const searchTask = (text: string) => {
  /* 検索ロジック */
};

// 検索をリセットする
const resetSearch = () => {
  isSearching.value = false;
};
</script>
