import { defineStore } from "pinia";
import Cookies from "js-cookie";

export const useTodoStore = defineStore("todoStore", {
  state: () => ({
    todos: JSON.parse(Cookies.get("todos") || "[]") as {
      id: number;
      text: string;
      completed: boolean;
    }[],
  }),
  actions: {
    // 新しいTODOを追加
    addTodo(text: string) {
      const newTodo = { id: Date.now(), text, completed: false };
      this.todos.push(newTodo);
      this.saveTodos();
    },
    // TODOを削除
    removeTodo(id: number) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
      this.saveTodos();
    },
    // TODOの完了状態を切り替え
    toggleComplete(id: number) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        this.saveTodos();
      }
    },
    // TODOを更新
    updateTodo(id: number, newText: string) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.text = newText;
        this.saveTodos();
      }
    },
    // クッキーに保存する関数
    saveTodos() {
      Cookies.set("todos", JSON.stringify(this.todos), { expires: 7 });
    },
  },
});
