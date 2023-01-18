import { view } from "@hapi/vision/lib/schemas.js";
import { db } from "../models/db.js";

export const userController = {
  showAddUser: {
    handler: async function (request, h) {
        const teams = await db.teamStore.getAllTeams();
        const viewData = {
        title: "Users Dashboard",
        teams: teams,
      };
      return h.view("addUser-view", viewData);
    },
  },

  addUser: {
    handler: async function (request, h) {
      const newUser = {
        firstname: request.payload.firstname,
        lastname: request.payload.lastname,
        email: request.payload.email,
        password: request.payload.password,
        role: request.payload.role,
        teams: request.payload.teams
      };
      console.log(newUser)
      await db.userStore.addUser(newUser);
      return h.redirect("/addUser");
    },
  },
};