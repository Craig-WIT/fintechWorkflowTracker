import { db } from "../models/db.js";

export const userController = {
  showAddUser: {
    handler: function (request, h) {
      return h.redirect("addUser-view", { title: "Add User to Fintech Workflow" });
    },
  },
};