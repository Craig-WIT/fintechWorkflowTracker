import { db } from "../models/db.js";

export const userController = {
  showAddUser: {
    handler: async function (request, h) {
        const teams = await db.teamStore.getAllTeams();
        const users = await db.userStore.getAllUsers();
        const viewData = {
        title: "Users Dashboard",
        teams: teams,
        users: users,
      };
      return h.view("userAdmin-view", viewData);
    },
  },

  addUser: {
    handler: async function (request, h) {
        const returnedTeams = request.payload.teams
        const teams = []
        console.log(typeof returnedTeams)
        if (typeof returnedTeams === "string"){
            console.log("Single item")
            const foundTeam = await db.teamStore.getTeamById(returnedTeams)
            console.log(foundTeam)
            teams.push(foundTeam)
        }
        else{
            console.log("Multiple")
            const foundTeams = await db.teamStore.getTeamsById(returnedTeams)
            foundTeams.forEach((team) => {
                teams.push(team)
            });
        };
      const newUser = {
        firstname: request.payload.firstname,
        lastname: request.payload.lastname,
        email: request.payload.email,
        password: request.payload.password,
        role: request.payload.role,
        teams: teams
      };
      await db.userStore.addUser(newUser);
      console.log(JSON.stringify(newUser, null, 4))
      return h.redirect("/userAdmin");
    },
  },
};