import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const teams = await db.teamStore.updateTeams();
      const funds = await db.fundStore.updateFunds();
      const userTeams = await db.teamStore.getTeamsById(loggedInUser.teams);

      for (let teamIndex = 0; teamIndex < userTeams.length; teamIndex += 1) {
        // eslint-disable-next-line no-await-in-loop
        const teamFunds = await db.fundStore.getFundsById(userTeams[teamIndex].funds)
        if(teamFunds){
            userTeams[teamIndex].funds = teamFunds
            // eslint-disable-next-line no-await-in-loop
            await db.teamStore.updateTeamFunds(userTeams[teamIndex]._id,teamFunds)
        }
    };

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
        let teamFunds = await db.fundStore.getFundsById(team.funds);

        for (let fundIndex = 0; fundIndex < teamFunds.length; fundIndex += 1) {
        // eslint-disable-next-line no-await-in-loop
        await db.fundStore.getIncompleteFundChecklists(teamFunds[fundIndex],teamFunds[fundIndex].fundChecklists)
        // eslint-disable-next-line no-await-in-loop
        await db.fundStore.getCompletedFundChecklists(teamFunds[fundIndex],teamFunds[fundIndex].fundChecklists)
    };  

        teamFunds = await db.fundStore.getFundsById(team.funds);

        const loggedInUser = request.auth.credentials;
        const viewData = {
          title: "View Team",
          team: team,
          funds: teamFunds,
          user: loggedInUser,
      };
      return h.view("viewTeam-view", viewData);
    },
  },
};