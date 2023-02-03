import { User } from "./user.js";
import { teamMongoStore } from "./team-mongo-store.js";

export const userMongoStore =  {
  async getAllUsers() {
    const users = await User.find().lean();
    return users;
  },

  async addUser(user) {
    const newUser = new User(user);
    const userObj = await newUser.save();
    const u = await this.getUserById(userObj._id);
    return u;
  },

  async getUserById(id) {
    if (id) {
        const user = await User.findOne({ _id: id }).lean();
        return user;
      }
      return null;
  },

  async getUserByEmail(email) {
    const user = await User.findOne({ email: email }).lean();
    return user;
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

        foundUser.markModified("teams");
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

  async deleteAll() {
    await User.deleteMany({});
  },
};