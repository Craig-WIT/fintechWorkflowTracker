import { Team } from "./team.js";
import { fundMongoStore } from "./fund-mongo-store.js";

export const teamMongoStore =  {
  async getAllTeams() {
    const teams = await Team.find().lean();
    return teams;
  },

  async addTeam(team,funds) {
    const newTeam = new Team(team);
    funds.forEach((fundId) => {
        newTeam.funds.push(fundId)
    });
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
    const userTeams =[];
    for (let teamIndex = 0; teamIndex < ids.length; teamIndex += 1) {
        const teamId = ids[teamIndex]
        // eslint-disable-next-line no-await-in-loop
        const foundTeam = await Team.findOne({ _id: teamId }).lean();
        if(foundTeam){
            userTeams.push(foundTeam)
        }
    };
    return userTeams
  },

  async deleteTeamById(id) {
    try {
        await Team.deleteOne({ _id: id });
      } catch (error) {
        console.log("bad id");
      }
  },

  async editTeam(id,editedTeam) {
    const foundTeam = await Team.findOne({ _id: id });
    foundTeam.teamname = editedTeam.teamname;
    foundTeam.location = editedTeam.location;
    foundTeam.department = editedTeam.department;
    foundTeam.funds = editedTeam.funds;
    await foundTeam.save();
  },

  async updateTeamFunds(id,teamFunds) {
    const foundTeam = await Team.findOne({ _id: id });
    const updatedFundIds = [];
    teamFunds.forEach((fund) => {
        updatedFundIds.push(fund._id)
    })
    foundTeam.funds = updatedFundIds;
    await foundTeam.save();
  },

  async deleteAll() {
    await Team.deleteMany({});
  },
};