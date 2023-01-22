import { db } from "../models/db.js";

export const userController = {
  showUserAdmin: {
    handler: async function (request, h) {
        const teams = await db.teamStore.getAllTeams();
        const users = await db.userStore.getAllUsers();

        users.forEach((user) => {
            console.log("Loop:")
            console.log(JSON.stringify(user, null, 4))
            if(user.teams.length > 0) {
            user.teams.forEach((userTeam) => {
                const foundTeam = teams.find((team) => team._id === userTeam._id);
                if(foundTeam === undefined){
                    const index = user.teams.findIndex((team) => team._id === userTeam._id);
                    user.teams.splice(index, 1);
                }
            });
        }
        console.log("After Loop:")
        console.log(JSON.stringify(user, null, 4))
        });

        const viewData = {
        title: "Users Dashboard",
        teams: teams,
        users: users,
      };
      return h.view("userAdmin-view", viewData);
    },
  },

  showEditUser: {
    handler: async function (request, h) {
        const user = await db.userStore.getUserById(request.params.id);
        const teams = await db.teamStore.getAllTeams();
        const viewData = {
          title: "Edit User",
          teams: teams,
          user: user,
      };
      return h.view("editUser-view", viewData);
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

  deleteUser: {
    handler: async function (request, h) {
      const user = await db.userStore.getUserById(request.params.id);
      await db.userStore.deleteUserById(user._id);
      return h.redirect("/userAdmin");
    },
  },
  
  editUser: {
    handler: async function (request, h) {
        const user = await db.userStore.getUserById(request.params.id);
        const userId = request.params.id;

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
      const editedUser = {
        firstname: request.payload.firstname,
        lastname: request.payload.lastname,
        email: request.payload.email,
        password: request.payload.password,
        role: request.payload.role,
        teams: teams
      };
      await db.userStore.editUser(user._id,editedUser);
      console.log(JSON.stringify(user, null, 4))
      return h.redirect("/userAdmin");
    },
  },
};