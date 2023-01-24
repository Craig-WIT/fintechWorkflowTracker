// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 } from "uuid";

let users = [];

export const userMemStore = {
  async getAllUsers() {
    return users;
  },

  async addUser(user) {
    user._id = v4();
    users.push(user);
    return user;
  },

  async getUserById(id) {
    return users.find((user) => user._id === id);
  },

  async getUserByEmail(email) {
    return users.find((user) => user.email === email);
  },

  async deleteUserById(id) {
    const index = users.findIndex((user) => user._id === id);
    users.splice(index, 1);
  },

  async deleteUserTeamById(id) {
    users.forEach((user) => {
        const index = user.teams.findIndex((team) => team._id === id);
        user.teams.splice(index, 1);
    });
  },

  async editUser(id,editedUser) {
    const foundUser = await this.getUserById(id);
    foundUser.firstname = editedUser.firstname;
    foundUser.lastname = editedUser.lastname;
    foundUser.email = editedUser.email;
    foundUser.password = editedUser.password;
    foundUser.role = editedUser.role;
    foundUser.admin = editedUser.admin;
    foundUser.teams = editedUser.teams;
  },

  async deleteAll() {
    users = [];
  },
};