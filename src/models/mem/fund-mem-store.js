// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 } from "uuid";

let funds = [];

export const fundMemStore = {
  async getAllFunds() {
    return funds;
  },

  async addFund(fund) {
    fund._id = v4();
    funds.push(fund);
    return fund;
  },

  async getFundById(id) {
    return funds.find((fund) => fund._id === id);
  },

  async getFundsById(ids) {
    const teamFunds =[]
    ids.forEach((fundId) => {
        const newFund = funds.find((fund) => fund._id === fundId);
        teamFunds.push(newFund)
    });
    return teamFunds
  },

  async getFundByEmail(email) {
    return funds.find((fund) => fund.email === email);
  },

  async deleteFundById(id) {
    const index = funds.findIndex((fund) => fund._id === id);
    funds.splice(index, 1);
  },

  async deleteAll() {
    funds = [];
  },
};