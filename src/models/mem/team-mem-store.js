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

  async deleteAllTeams() {
    teams = [];
  },
};