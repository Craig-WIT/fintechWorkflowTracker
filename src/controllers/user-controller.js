import { db } from "../models/db.js";
import { AddUserSpec, } from "../models/joi-schemas.js";

export const userController = {
  showUserAdmin: {
    handler: async function (request, h) {
        const users = await db.userStore.getAllUsers();

        for (let userIndex = 0; userIndex < users.length; userIndex += 1) {
          // eslint-disable-next-line no-await-in-loop
          const userTeams = await db.teamStore.getTeamsById(users[userIndex].teams)
          if(userTeams){
              users[userIndex].teams = userTeams
              // eslint-disable-next-line no-await-in-loop
              await db.userStore.updateUserTeams(users[userIndex]._id,userTeams)
          }
      };

        const teams = await db.teamStore.getAllTeams();

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
    validate: {
      payload: AddUserSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        console.log(error.details);
        const teams = await db.teamStore.getAllTeams();
        const users = await db.userStore.getAllUsers();
        const formDetails = request.payload

        userController.refreshUserTeams(users,teams)

        return h.view("userAdmin-view", { title: "Add user error", errors: error.details, users: users, teams: teams, form: formDetails }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
        const returnedTeams = request.payload.teams
        const teams = []
        let isAdmin = false

        console.log(request.payload.admin)

        if(request.payload.admin === "Yes"){
          isAdmin = true;
        }

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
        admin : isAdmin,
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
    validate: {
      payload: AddUserSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        console.log(error.details);
        const teams = await db.teamStore.getAllTeams();
        const user = await db.userStore.getUserById(request.params.id);
        const formDetails = request.payload

        return h.view("editUser-view", { title: "Add user error", errors: error.details, user: user, teams: teams, form: formDetails }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
        const user = await db.userStore.getUserById(request.params.id);
        const userId = request.params.id;

        let isAdmin = false

        console.log(request.payload.admin)

        if(request.payload.admin === "Yes"){
          isAdmin = true;
        }

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
        admin : isAdmin,
        teams: teams
      };
      await db.userStore.editUser(user._id,editedUser);
      console.log(JSON.stringify(user, null, 4))
      return h.redirect("/userAdmin");
    },
  },
};