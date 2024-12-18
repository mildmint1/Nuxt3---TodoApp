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
    // アクティビティを読み込む
    loadActivities() {
      this.activities = JSON.parse(Cookies.get("activities") || "[]");
    },
    // 新しいアクティビティを追加
    addActivity(text: string, todoId?: number) {
      const newActivity = { id: Date.now(), text, todoId };
      this.activities.unshift(newActivity);
      this.activities = this.activities.slice(0, 10); // 最近のアクティビティは最大10件まで
      this.saveActivities();
    },
    // クッキーに保存する関数
    saveActivities() {
      Cookies.set("activities", JSON.stringify(this.activities), {
        expires: 7,
      });
    },
  },
});
