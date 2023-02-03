import { Team } from "./team.js";
import { fundMongoStore } from "./fund-mongo-store.js";

export const teamMongoStore =  {
  async getAllTeams() {
    const teams = await Team.find().lean();
    return teams;
  },

  async addTeam(team,funds) {
    const newTeam = new Team(team);
    newTeam.funds.push(funds);
    const teamObj = await newTeam.save();
    const u = await this.getTeamById(teamObj._id);
    return u;
  },

  async getTeamById(id) {
    if (id) {
        const team = await Team.findOne({ _id: id }).lean();
        return team;
      }
      return null;
  },

  async getTeamsById(ids) {
    const userTeams =[]
    ids.forEach((teamId) => {
        const newTeam = Team.findOne({ _id: teamId }).lean();
        userTeams.push(newTeam)
    });
    return userTeams
  },

  async deleteTeamById(id) {
    try {
        await Team.deleteOne({ _id: id });
      } catch (error) {
        console.log("bad id");
      }
  },

  async deleteTeamFundById(id) {
    const teams = await Team.find().lean();
    teams.forEach((team) => {
        const index = team.funds.findIndex((fund) => fund._id === id);
        team.funds.splice(index, 1);
        team.save()
    });
  },

  async editTeam(id,editedTeam) {
    const foundTeam = await Team.findOne({ _id: id });
    foundTeam.name = editedTeam.name;
    foundTeam.location = editedTeam.location;
    foundTeam.department = editedTeam.department;
    foundTeam.funds = editedTeam.funds;
    await foundTeam.save();
  },

  async deleteAll() {
    await Team.deleteMany({});
  },
};