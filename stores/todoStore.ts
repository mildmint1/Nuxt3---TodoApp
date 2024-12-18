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
    // 새로운 TODO를 추가
    addTodo(text: string) {
      const newTodo = { id: Date.now(), text, completed: false };
      this.todos.push(newTodo);
      this.saveTodos();
    },
    // TODO 삭제
    removeTodo(id: number) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
      this.saveTodos();
    },
    // TODO 완료 상태 토글
    toggleComplete(id: number) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        this.saveTodos();
      }
    },
    // TODO 업데이트
    updateTodo(id: number, newText: string) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.text = newText;
        this.saveTodos();
      }
    },
    // 쿠키에 저장하는 함수
    saveTodos() {
      Cookies.set("todos", JSON.stringify(this.todos), { expires: 7 });
    },
  },
});
