import { v4 } from "uuid";
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
      checklistItem._id = v4();
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

  async getFundChecklistById(checklistid) {
    const foundChecklist = await FundChecklist.findOne({ _id: checklistid }).lean();
    return foundChecklist;
  },

  async editFund(id,editedFund) {
    const foundFund = await Fund.findOne({ _id: id });
    foundFund.fundname = editedFund.fundname;
    foundFund.yearend = editedFund.yearend;
    await foundFund.save();
  },

  async editFundChecklist(checklistid,checklistItems) {
    const foundChecklist = await FundChecklist.findOne({ _id: checklistid });

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
    await foundChecklist.save();
  },

  async preparerSignOff(checklistid,user) {
    const foundChecklist = await FundChecklist.findOne({ _id: checklistid });

    foundChecklist.preparer.userid = user._id;
    foundChecklist.preparer.firstname = user.firstname;
    foundChecklist.preparer.lastname = user.lastname;

    foundChecklist.save();

  },

  async firstReviewSignOff(checklistid,user) {
    const foundChecklist = await FundChecklist.findOne({ _id: checklistid });

    foundChecklist.firstReview.userid = user._id;
    foundChecklist.firstReview.firstname = user.firstname;
    foundChecklist.firstReview.lastname = user.lastname;

    foundChecklist.save();

  },

  async secondReviewSignOff(checklistid,user) {
    const foundChecklist = await FundChecklist.findOne({ _id: checklistid });

    foundChecklist.secondReview.userid = user._id;
    foundChecklist.secondReview.firstname = user.firstname;
    foundChecklist.secondReview.lastname = user.lastname;

    foundChecklist.save();

  },

  async deleteFundById(id) {
    try {
        await Fund.deleteOne({ _id: id });
      } catch (error) {
        console.log("bad id");
      }
  },

  async deleteFundChecklistById(id) {
    try {
        await FundChecklist.deleteOne({ _id: id });
      } catch (error) {
        console.log("bad id");
      }
  },

  async deleteAll() {
    await Fund.deleteMany({});
  },
};