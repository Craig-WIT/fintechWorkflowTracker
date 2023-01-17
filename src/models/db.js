import { userMemStore } from "./mem/user-mem-store.js";
import { teamMemStore } from "./mem/team-mem-store.js";

export const db = {
  userStore: null,
  teamStore: null,

  init() {
    this.userStore = userMemStore;
    this.teamStore = teamMemStore;
  },
};