<template>
  <div class="min-h-screen bg-gray-100 py-10" @click="hideSearchHistory">
    <div
      class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg relative"
      @click.stop
    >
      <div class="sticky top-0 bg-white z-10 px-0 py-0 rounded-lg">
        <nuxt-link
          to="/"
          class="flex items-center gap-2 px-0 py-2 text-blue-500 hover:text-blue-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span class="hidden sm:inline-block">Recent</span>
        </nuxt-link>
      </div>

      <!-- タイトル -->
      <h1 class="text-3xl font-bold text-blue-600 mb-6 text-center">
        TODO List
      </h1>

      <!-- TODO追加フォーム -->
      <form @submit.prevent="addTodo" class="flex gap-4 mb-6 relative">
        <div class="flex-1 relative">
          <input
            v-model="newTask"
            placeholder="やることを入力してください"
            @focus="showSearchHistory = true"
            class="w-full flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <!-- 最近の検索履歴リスト -->
          <ul
            v-if="showSearchHistory && searchHistory.length"
            class="absolute left-0 top-12 bg-white border border-gray-200 shadow-md w-full rounded-lg z-10"
          >
            <li
              v-for="(history, index) in searchHistory"
              :key="index"
              class="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              <span @click="selectSearchHistory(history)">
                {{ history }}
              </span>
              <button
                @click.stop="deleteSearchHistory(index)"
                class="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition"
              >
                削除
              </button>
            </li>
          </ul>
        </div>
        <button
          @click.prevent="searchTask"
          type="button"
          class="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition"
        >
          🔍
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
        >
          追加
        </button>
      </form>

      <!-- 検索リセットボタン -->
      <button
        v-if="isSearching"
        @click="resetSearch"
        class="px-6 py-2 mb-4 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 transition"
      >
        すべて表示
      </button>
      <!-- TODOリスト -->
      <ul class="space-y-4">
        <li
          v-for="(todo, index) in filteredTodos"
          :key="todo.id"
          :id="`todo-${todo.id}`"
          :class="{
            'bg-yellow-200': highlightId === todo.id,
          }"
          class="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow"
        >
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="toggleComplete(todo.id)"
              class="w-5 h-5 accent-blue-500"
            />

            <!-- 編集モード -->
            <div
              v-if="editingTodoId === todo.id"
              class="flex gap-2 items-center"
            >
              <input
                v-model="editingText"
                :ref="(el) => (editingInputs[index] = el as HTMLInputElement)"
                class="px-2 py-1 border border-gray-300 rounded-lg"
                @keyup.enter="saveEdit(todo.id)"
              />
              <button
                @click="saveEdit(todo.id)"
                class="px-6 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                保存
              </button>
              <button
                @click="cancelEdit"
                class="px-2 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                キャンセル
              </button>
            </div>

            <!-- 通常モード -->
            <span
              v-else
              :class="{ 'line-through text-gray-400': todo.completed }"
              class="text-gray-800"
            >
              {{ todo.text }}
            </span>
          </div>

          <div class="flex gap-2">
            <button
              @click="editTodo(todo, index)"
              class="px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition"
            >
              編集
            </button>
            <button
              @click="removeTodo(todo.id)"
              class="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
            >
              削除
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useTodoStore } from "~/stores/todoStore";
import { useRoute } from "vue-router";

const store = useTodoStore();
const route = useRoute();
const newTask = ref("");
const todos = computed(() => store.todos);

const searchHistory = ref<string[]>([]); // 最近の検索履歴
const showSearchHistory = ref(false); // 検索履歴の表示状態
const isSearching = ref(false); // 現在検索中かどうか

const highlightId = ref<number | null>(null); // ハイライトするID
const editingTodoId = ref<number | null>(null); // 編集中のTODO ID
const editingText = ref(""); // 編集用テキスト
const editingInputs = ref<(HTMLInputElement | null)[]>([]); // 編集用入力フィールド

// フィルタリングされたTODOリスト
const filteredTodos = ref(todos.value);

onMounted(() => {
  const highlightQuery = route.query.highlight
    ? Number(route.query.highlight)
    : null;

  if (highlightQuery) {
    highlightId.value = highlightQuery;

    // DOMの更新後、要素の存在を定期的にチェック
    nextTick(() => {
      const interval = setInterval(() => {
        const target = document.getElementById(`todo-${highlightQuery}`);
        if (target) {
          const offsetTop = target.getBoundingClientRect().top + window.scrollY;

          window.scrollTo({
            top: offsetTop - window.innerHeight / 2, // 画面中央に合わせる
            behavior: "instant",
          });

          clearInterval(interval); // 要素が見つかったらsetIntervalを終了
        }
      }, 50); // 50msごとに要素を確認
    });
  }
});

// TODOを追加
const addTodo = () => {
  if (newTask.value.trim()) {
    store.addTodo(newTask.value);
    newTask.value = "";
    resetSearch(); // 検索リセット
  }
};

// タスクを検索
const searchTask = () => {
  if (newTask.value.trim()) {
    if (!searchHistory.value.includes(newTask.value)) {
      searchHistory.value.unshift(newTask.value);
      if (searchHistory.value.length > 5) {
        searchHistory.value.pop();
      }
    }
    filteredTodos.value = todos.value.filter((todo) =>
      todo.text.includes(newTask.value)
    );
    isSearching.value = true;
    showSearchHistory.value = false;
  }
};

// 検索履歴を選択
const selectSearchHistory = (history: string) => {
  newTask.value = history;
  searchTask();
};

// 検索履歴を削除
const deleteSearchHistory = (index: number) => {
  searchHistory.value.splice(index, 1);
};

// 検索履歴を非表示
const hideSearchHistory = () => {
  showSearchHistory.value = false;
};

// 検索をリセット
const resetSearch = () => {
  filteredTodos.value = todos.value;
  isSearching.value = false;
};

// TODOを削除
const removeTodo = (id: number) => {
  store.removeTodo(id);
  resetSearch(); // 検索結果を更新
};

// TODOの完了状態を切り替え
const toggleComplete = (id: number) => {
  store.toggleComplete(id);
};

// TODOを編集
const editTodo = async (todo: { id: number; text: string }, index: number) => {
  editingTodoId.value = todo.id;
  editingText.value = todo.text;

  await nextTick();
  editingInputs.value[index]?.focus();
};

// 編集内容を保存
const saveEdit = (id: number) => {
  if (editingText.value.trim()) {
    store.updateTodo(id, editingText.value.trim());
    cancelEdit();
  }
};

// 編集をキャンセル
const cancelEdit = () => {
  editingTodoId.value = null;
  editingText.value = "";
};
</script>
