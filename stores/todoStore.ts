import { defineStore } from "pinia";
import Cookies from "js-cookie";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    // TODOリストのデータ (クッキーから読み込む)
    todos: JSON.parse(Cookies.get("todos") || "[]") as {
      id: number;
      text: string;
      completed: boolean;
    }[],
    // 最近の活動データ (クッキーから読み込む)
    activities: JSON.parse(Cookies.get("activities") || "[]") as {
      id: number;
      text: string;
      todoId?: number;
    }[],
  }),
  actions: {
    // 新しいTODOを追加
    addTodo(text: string) {
      const newTodo = { id: Date.now(), text, completed: false };
      this.todos = [...this.todos, newTodo];
      this.addActivity(`${text} リスト追加`, newTodo.id); // 活動履歴を追加
      Cookies.set("todos", JSON.stringify(this.todos), { expires: 7 }); // データをクッキーに保存
    },
    // TODOを削除
    removeTodo(id: number) {
      const removedTodo = this.todos.find((todo) => todo.id === id);
      this.todos = this.todos.filter((todo) => todo.id !== id);
      if (removedTodo) {
        this.addActivity(`${removedTodo.text} リスト削除`, removedTodo.id); // 活動履歴を追加
      }
      Cookies.set("todos", JSON.stringify(this.todos), { expires: 7 }); // データをクッキーに保存
    },
    // TODOの完了状態を切り替え
    toggleComplete(id: number) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        this.addActivity(
          `${todo.text} ${todo.completed ? "チェック済み" : "チェック解除"}`,
          todo.id
        ); // 活動履歴を追加
        Cookies.set("todos", JSON.stringify(this.todos), { expires: 7 }); // データをクッキーに保存
      }
    },
    // TODOリスト全体を更新
    updateTodos(newTodos: { id: number; text: string; completed: boolean }[]) {
      this.todos = newTodos;
      Cookies.set("todos", JSON.stringify(this.todos), { expires: 7 }); // データをクッキーに保存
    },
    // 特定のTODOの内容を更新
    updateTodo(id: number, newText: string) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.text = newText;
        this.addActivity(`${newText} 内容修正`, todo.id); // 活動履歴を追加
        Cookies.set("todos", JSON.stringify(this.todos), { expires: 7 }); // データをクッキーに保存
      }
    },
    // 活動履歴を追加
    addActivity(activity: string, todoId?: number) {
      const newActivity = { id: Date.now(), text: activity, todoId };
      this.activities = [newActivity, ...this.activities.slice(0, 9)]; // 最近の活動を最大10件まで保持
      Cookies.set("activities", JSON.stringify(this.activities), {
        expires: 7,
      }); // 活動履歴をクッキーに保存
    },
    // 活動履歴を読み込む (クッキーから読み込む)
    loadActivities() {
      this.activities = JSON.parse(Cookies.get("activities") || "[]");
    },
  },
});
