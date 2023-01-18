import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const teams = await db.teamStore.getAllTeams();
      const viewData = {
        title: "Teams Dashboard",
        teams: teams,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addTeam: {
    handler: async function (request, h) {
      const newTeam = {
        name: request.payload.name,
        location: request.payload.location,
        department: request.payload.department,
        funds: request.payload.funds
      };
      console.log(newTeam)
      await db.teamStore.addTeam(newTeam);
      return h.redirect("/dashboard");
    },
  },
};