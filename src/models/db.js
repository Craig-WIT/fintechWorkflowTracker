import { userMemStore } from "./mem/user-mem-store.js";
import { teamMemStore } from "./mem/team-mem-store.js";
import { fundMemStore } from "./mem/fund-mem-store.js";

export const db = {
  userStore: null,
  teamStore: null,
  fundStore: null,

  init() {
    this.userStore = userMemStore;
    this.teamStore = teamMemStore;
    this.fundStore = fundMemStore;
  },
};