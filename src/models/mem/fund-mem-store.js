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

  async addFundChecklist(id, checklist) {
    const fund = await this.getFundById(id);
    fund.fundChecklists.push(checklist);
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

  async deleteFundById(id) {
    const index = funds.findIndex((fund) => fund._id === id);
    funds.splice(index, 1);
  },

  async editFund(id,editedFund) {
    const foundFund = await this.getFundById(id);
    foundFund.fundname = editedFund.fundname;
    foundFund.yearend = editedFund.yearend;
  },

  async deleteAll() {
    funds = [];
  },
};