// eslint-disable-next-line import/no-extraneous-dependencies
import _ from "lodash";
import { User } from "./user.js";
import { teamMongoStore } from "./team-mongo-store.js";

export const userMongoStore =  {
  async getAllUsers() {
    let users = await User.find().lean();
    users = _.sortBy(users, o => o.firstname)
    return users;
  },

  async addUser(user) {
    const newUser = new User(user);
    const userObj = await newUser.save();
    const u = await this.getUserById(userObj._id);
    return u;
  },

  async checkIfUserExists(user) {
    const foundUser = await User.findOne({ email: user.email }).lean();
    if(foundUser){
      return true;
    }
    return false;
  },

  async getUserById(id) {
    if (id) {
        let user = await User.findOne({ _id: id }).lean();
        if (user === undefined) user = null;
        return user;
      }
      return null;
  },

  async getUserByEmail(email) {
    if (email) {
        let user = await User.findOne({ email: email }).lean();
        if (user === undefined) user = null;
        return user;
    }
    return null;
  },

  async deleteUserById(id) {
    try {
        await User.deleteOne({ _id: id });
      } catch (error) {
        console.log("bad id");
      }
  },

  async deleteUserTeamById(id) {
    const users = await User.find().lean();
    for (let userIndex = 0; userIndex < users.length; userIndex+= 1) {
        const user = users[userIndex]
        // eslint-disable-next-line no-await-in-loop
        const foundUser = await User.findOne({ _id: user._id }).lean();
        const index = foundUser.teams.findIndex((team) => team._id === id);
        foundUser.teams.splice(index, 1);

        // eslint-disable-next-line quotes
        foundUser.markModified('teams');
        foundUser.save();
        // eslint-disable-next-line no-await-in-loop
        console.log(user)
    };
  },

  async editUser(id,editedUser) {
    const foundUser = await User.findOne({ _id: id });
    foundUser.firstname = editedUser.firstname;
    foundUser.lastname = editedUser.lastname;
    foundUser.email = editedUser.email;
    foundUser.password = editedUser.password;
    foundUser.role = editedUser.role;
    foundUser.admin = editedUser.admin;
    foundUser.teams = editedUser.teams;
    await foundUser.save();
  },

  async updateUsers(){
    const users = await this.getAllUsers();
    for (let userIndex = 0; userIndex < users.length; userIndex += 1) {
      // eslint-disable-next-line no-await-in-loop
      const userTeams = await teamMongoStore.getTeamsById(users[userIndex].teams)
      if(userTeams){
          users[userIndex].teams = userTeams
          // eslint-disable-next-line no-await-in-loop
          await this.updateUserTeams(users[userIndex]._id,userTeams)
      }
  };
  return users;
  },
  
  async updateUserTeams(id,userTeams) {
    const foundUser = await User.findOne({ _id: id });
    const updatedTeamIds = [];
    userTeams.forEach((team) => {
        updatedTeamIds.push(team._id)
    })
    foundUser.teams = updatedTeamIds;
    await foundUser.save();
  },

  async deleteAll() {
    await User.deleteMany({});
  },
};