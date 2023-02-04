import { db } from "../models/db.js";
import { TeamSpec, } from "../models/joi-schemas.js";

export const teamController = {
  showTeamAdmin: {
    handler: async function (request, h) {
      const teams = await db.teamStore.getAllTeams();

      for (let teamIndex = 0; teamIndex < teams.length; teamIndex += 1) {
        // eslint-disable-next-line no-await-in-loop
        const teamFunds = await db.fundStore.getFundsById(teams[teamIndex].funds)
        if(teamFunds){
            teams[teamIndex].funds = teamFunds
        }
    };

      const funds = await db.fundStore.getAllFunds();

      const viewData = {
        title: "Teams Dashboard",
        teams: teams,
        funds: funds,
      };
      return h.view("teamAdmin-view", viewData);
    },
  },

  showEditTeam: {
    handler: async function (request, h) {
        const team = await db.teamStore.getTeamById(request.params.id);
        const funds = await db.fundStore.getAllFunds();
        const viewData = {
          title: "Edit Team",
          team: team,
          funds: funds,
      };
      return h.view("editTeam-view", viewData);
    },
  },

  addTeam: {
    validate: {
      payload: TeamSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        console.log(error.details);
        console.log(request.payload);
        const teams = await db.teamStore.getAllTeams();
        const funds = await db.fundStore.getAllFunds();
        const formDetails = request.payload
        return h.view("teamAdmin-view", { title: "Sign up error", errors: error.details, funds: funds, teams: teams, form: formDetails }).takeover().code(400);
      },
    },
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
      };
      await db.teamStore.addTeam(newTeam,funds);
      console.log(newTeam)
      return h.redirect("/teamAdmin");
    },
  },

  deleteTeam: {
    handler: async function (request, h) {
      const team = await db.teamStore.getTeamById(request.params.id);

      await db.teamStore.deleteTeamById(team._id);
      return h.redirect("/teamAdmin");
    },
  },

  editTeam: {
    validate: {
      payload: TeamSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        console.log(error.details);
        const team = await db.teamStore.getTeamById(request.params.id);
        const funds = await db.fundStore.getAllFunds();
        const formDetails = request.payload
        return h.view("editTeam-view", { title: "Sign up error", errors: error.details, funds: funds, team: team, form: formDetails }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const team = await db.teamStore.getTeamById(request.params.id);
      const teamId = request.params.id;

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
      const editedTeam = {
        name: request.payload.name,
        location: request.payload.location,
        department: request.payload.department,
        funds: funds,
      };
      const viewData = {
        title: "Edit Team",
        team: team,
      };
      await db.teamStore.editTeam(team._id,editedTeam);
      console.log(team)
      return h.redirect("/teamAdmin", viewData);
    },
  },

  refreshTeamFunds(teams,funds) {
    teams.forEach((team) => {
      console.log("Loop:")
      console.log(JSON.stringify(team, null, 4))
        if(team.funds.length > 0) {
          team.funds.forEach((teamFund) => {
              const foundFund = funds.find((fund) => fund._id === teamFund._id);
              if(foundFund === undefined){
                  const index = team.funds.findIndex((fund) => fund._id === teamFund._id);
                  team.funds.splice(index, 1);
              }
          });
      }
  console.log("After Loop:")
  console.log(JSON.stringify(team, null, 4))
  });
  },
};