import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    log_user: "", // stores the username
  }),
  actions: {
    setUser(username) {
      this.log_user = username;
    },
    getUser() {
      return this.log_user;
    },
    clearUser() {
      this.log_user = "";
    },
  },
  persist: true, 
});
