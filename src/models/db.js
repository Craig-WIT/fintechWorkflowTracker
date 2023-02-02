import { userMemStore } from "./mem/user-mem-store.js";
import { teamMemStore } from "./mem/team-mem-store.js";
import { fundMemStore } from "./mem/fund-mem-store.js";
import { checklistMemStore } from "./mem/checklist-mem-store.js";
import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";

export const db = {
  userStore: null,
  playlistStore: null,
  trackStore: null,

  init(storeType) {
    switch (storeType) {
      case "mongo":
        this.userStore = userMongoStore;
        connectMongo();
        break;
      default:
        this.userStore = userMemStore;
        this.teamStore = teamMemStore;
        this.fundStore = fundMemStore;
        this.checklistStore = checklistMemStore;
    }
  },
};