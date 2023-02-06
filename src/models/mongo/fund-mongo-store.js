import Mongoose from "mongoose";
import { Fund } from "./fund.js";
import { FundChecklist } from "./fundChecklist.js";
import { checklistMongoStore } from "./checklist-mongo-store.js";

export const fundMongoStore =  {
  async getAllFunds() {
    const funds = await Fund.find({ fundname: { $ne: null } }).lean();
    return funds;
  },

  async addFund(fund) {
    const newFund = new Fund(fund);
    const fundObj = await newFund.save();
    const u = await this.getFundById(fundObj._id);
    return u;
  },

  async addFundChecklist(id, fundChecklist) {
    const fund = await Fund.findOne({ _id: id });
    fundChecklist._id = Mongoose.Types.ObjectId();

    const checklistItems = await checklistMongoStore.getChecklistItemsById(fundChecklist.items)

    checklistItems.forEach(checklistItem => {
      checklistItem._id = Mongoose.Types.ObjectId();
    });

    fundChecklist.items = checklistItems;

    const newFundChecklist = new FundChecklist(fundChecklist);
    const fundChecklistObj = await newFundChecklist.save();
    fund.fundChecklists.push(fundChecklistObj._id);
    await fund.save();
    return fund;
  },

  async getFundById(id) {
    if (id) {
        const fund = await Fund.findOne({ _id: id }).lean();
        return fund;
      }
      return null;
  },

  async getFundChecklists(ids) {
    const fundChecklists =[];
    for (let fundChecklistIndex = 0; fundChecklistIndex < ids.length; fundChecklistIndex += 1) {
        const fundChecklistId = ids[fundChecklistIndex]
        // eslint-disable-next-line no-await-in-loop
        const foundFundChecklist = await FundChecklist.findOne({ _id: fundChecklistId }).lean();
        if(foundFundChecklist){
            fundChecklists.push(foundFundChecklist)
        }
    };
    return fundChecklists
  },

  async getFundsById(ids) {
    const teamFunds =[];
    for (let fundIndex = 0; fundIndex < ids.length; fundIndex += 1) {
        const fundId = ids[fundIndex]
        // eslint-disable-next-line no-await-in-loop
        const foundFund = await Fund.findOne({ _id: fundId }).lean();
        if(foundFund){
            teamFunds.push(foundFund)
        }
    };
    return teamFunds
  },

  async editFund(id,editedFund) {
    const foundFund = await Fund.findOne({ _id: id });
    foundFund.fundname = editedFund.fundname;
    foundFund.yearend = editedFund.yearend;
    await foundFund.save();
  },

  async deleteFundById(id) {
    try {
        await Fund.deleteOne({ _id: id });
      } catch (error) {
        console.log("bad id");
      }
  },

  async deleteAll() {
    await Fund.deleteMany({});
  },
};