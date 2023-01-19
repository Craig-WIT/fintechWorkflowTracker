import { userMemStore } from "./mem/user-mem-store.js";
import { teamMemStore } from "./mem/team-mem-store.js";
import { fundMemStore } from "./mem/fund-mem-store.js";
import { checklistMemStore } from "./mem/checklist-mem-store.js";

export const db = {
  userStore: null,
  teamStore: null,
  fundStore: null,
  checklistStore: null,

  init() {
    this.userStore = userMemStore;
    this.teamStore = teamMemStore;
    this.fundStore = fundMemStore;
    this.checklistStore = checklistMemStore;
  },
};