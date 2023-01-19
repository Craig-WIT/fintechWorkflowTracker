import { db } from "../models/db.js";

export const teamController = {
  index: {
    handler: async function (request, h) {
      const teams = await db.teamStore.getAllTeams();
      const funds = await db.fundStore.getAllFunds();
      const viewData = {
        title: "Teams Dashboard",
        teams: teams,
        funds: funds,
      };
      return h.view("teamAdmin-view", viewData);
    },
  },

  addTeam: {
    handler: async function (request, h) {
      const returnedFunds = request.payload.funds
        const funds = []
        console.log(typeof returnedFunds)
        if (typeof returnedFunds === "string"){
            console.log("Single item")
            const foundFund = await db.fundStore.getFundById(returnedFunds)
            console.log(foundFund)
            funds.push(foundFund)
        }
        else{
            console.log("Multiple")
            const foundFunds = await db.fundStore.getFundsById(returnedFunds)
            foundFunds.forEach((fund) => {
                funds.push(fund)
            });
        };
      const newTeam = {
        name: request.payload.name,
        location: request.payload.location,
        department: request.payload.department,
        funds: funds
      };
      console.log(newTeam)
      await db.teamStore.addTeam(newTeam);
      return h.redirect("/teamAdmin");
    },
  },

  deleteTeam: {
    handler: async function (request, h) {
      const team = await db.teamStore.getTeamById(request.params.id);
      await db.userStore.deleteUserTeamById(team._id);
      await db.teamStore.deleteTeamById(team._id);
      return h.redirect("/teamAdmin");
    },
  },
};