import { defineStore } from "pinia";
import Cookies from "js-cookie";

export const useActivityStore = defineStore("activityStore", {
  state: () => ({
    activities: JSON.parse(Cookies.get("activities") || "[]") as {
      id: number;
      text: string;
      todoId?: number;
    }[],
  }),
  actions: {
    loadActivities() {
      this.activities = JSON.parse(Cookies.get("activities") || "[]");
    },
    // 새로운 활동 추가
    addActivity(text: string, todoId?: number) {
      const newActivity = { id: Date.now(), text, todoId };
      this.activities.unshift(newActivity);
      this.activities = this.activities.slice(0, 10); // 최근 활동 최대 10개
      this.saveActivities();
    },
    // 쿠키에 저장하는 함수
    saveActivities() {
      Cookies.set("activities", JSON.stringify(this.activities), {
        expires: 7,
      });
    },
  },
});
