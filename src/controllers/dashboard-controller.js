import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: function (request, h) {
      const loggedInUser = request.auth.credentials;
      const userTeams = loggedInUser.teams;

      const viewData = {
        title: "Dashboard",
        teams: userTeams,
        user: loggedInUser,
      };
      
      return h.view("dashboard-view", viewData);
    },
  },

  showViewTeam: {
    handler: async function (request, h) {
        const team = await db.teamStore.getTeamById(request.params.id);
        const funds = await db.fundStore.getAllFunds();
        const loggedInUser = request.auth.credentials;
        const viewData = {
          title: "View Team",
          team: team,
          funds: funds,
          user: loggedInUser,
      };
      return h.view("viewTeam-view", viewData);
    },
  },
};