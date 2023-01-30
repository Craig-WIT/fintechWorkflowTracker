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
    checklist._id = v4();
    const fund = await this.getFundById(id);
    fund.fundChecklists.push(checklist);
    return fund;
  },

  async getFundChecklistById(id,checklistid) {
    const fund = await this.getFundById(id);
    const foundChecklist = fund.fundChecklists.find((fundChecklist) => fundChecklist._id === checklistid);
    return foundChecklist;
  },

  async getFundChecklists(id) {
    const fund = await this.getFundById(id);
    return fund.fundChecklists;
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

  async editFundChecklist(id,checklistid,checklistItems) {
    const foundChecklist = await this.getFundChecklistById(id,checklistid);

    Object.keys(checklistItems).forEach(key => {
      const itemId = key.slice(-36);
      const foundItem = foundChecklist.items.find((item) => item._id === itemId);
      if(key.includes("Preparer")){
        foundItem.preparer = checklistItems[key]
      }
      else if(key.includes("1st")){
        foundItem.firstReview = checklistItems[key]
      }
      else if(key.includes("2nd")){
        foundItem.secondReview = checklistItems[key]
      }
    });
    console.log(JSON.stringify(foundChecklist, null, 4))
  },

  async preparerSignOff(id,checklistid,user) {
    const foundChecklist = await this.getFundChecklistById(id,checklistid);

    foundChecklist.preparer = user.firstname + user.lastname
  },

  async removePreparerSignOff(id,checklistid,user) {
    const foundChecklist = await this.getFundChecklistById(id,checklistid);

    foundChecklist.preparer = "No preparer Sign Off"
  },

  async deleteAll() {
    funds = [];
  },
};