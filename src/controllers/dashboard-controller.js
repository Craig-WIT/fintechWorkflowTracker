import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: function (request, h) {
      const loggedInUser = request.auth.credentials;
      return h.view("dashboard-view", { user: loggedInUser });
    },
  },
};