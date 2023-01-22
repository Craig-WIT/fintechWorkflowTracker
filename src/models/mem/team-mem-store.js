// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 } from "uuid";

let teams = [];

export const teamMemStore = {
  async getAllTeams() {
    return teams;
  },

  async addTeam(team) {
    team._id = v4();
    teams.push(team);
    return team;
  },

  async getTeamById(id) {
    return teams.find((team) => team._id === id);
  },

  async getTeamsById(ids) {
    const userTeams =[]
    ids.forEach((teamId) => {
        const newTeam = teams.find((team) => team._id === teamId);
        userTeams.push(newTeam)
    });
    return userTeams
  },

  async deleteTeamById(id) {
    const index = teams.findIndex((team) => team._id === id);
    teams.splice(index, 1);
  },

  async deleteTeamFundById(id) {
    teams.forEach((team) => {
        const index = team.funds.findIndex((fund) => fund._id === id);
        team.funds.splice(index, 1);
    });
  },

  async editTeam(id,editedTeam) {
    const foundTeam = await this.getTeamById(id);
    foundTeam.name = editedTeam.name;
    foundTeam.location = editedTeam.location;
    foundTeam.department = editedTeam.department;
    foundTeam.funds = editedTeam.funds;
  },

  async deleteAllTeams() {
    teams = [];
  },
};