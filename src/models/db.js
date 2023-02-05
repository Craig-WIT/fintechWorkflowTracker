import { userMemStore } from "./mem/user-mem-store.js";
import { teamMemStore } from "./mem/team-mem-store.js";
import { fundMemStore } from "./mem/fund-mem-store.js";
import { checklistMemStore } from "./mem/checklist-mem-store.js";
import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { teamMongoStore } from "./mongo/team-mongo-store.js";
import { fundMongoStore } from "./mongo/fund-mongo-store.js";
import { checklistMongoStore } from "./mongo/checklist-mongo-store.js";

export const db = {
  userStore: null,
  playlistStore: null,
  trackStore: null,

  init(storeType) {
    switch (storeType) {
      case "mongo":
        this.userStore = userMongoStore;
        this.teamStore = teamMongoStore;
        this.fundStore = fundMongoStore;
        this.checklistStore = checklistMongoStore;
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