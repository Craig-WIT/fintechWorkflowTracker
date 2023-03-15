// eslint-disable-next-line import/no-extraneous-dependencies
import _ from "lodash";import { v4 } from "uuid";
// eslint-disable-next-line import/no-extraneous-dependencies
import Mailgun from "mailgun.js"
// eslint-disable-next-line import/no-extraneous-dependencies
import formData from "form-data"
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
    fund.incompleteFundChecklists += 1

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
    let fundChecklists =[];
    for (let fundChecklistIndex = 0; fundChecklistIndex < ids.length; fundChecklistIndex += 1) {
        const fundChecklistId = ids[fundChecklistIndex]
        // eslint-disable-next-line no-await-in-loop
        const foundFundChecklist = await FundChecklist.findOne({ _id: fundChecklistId }).lean();
        if(foundFundChecklist){
            fundChecklists.push(foundFundChecklist)
        }
    };
    fundChecklists = _.orderBy(fundChecklists, "status", "desc");
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

  async getFundChecklistsById(ids) {
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

  async preparerSignOff(fund,checklistid,user) {
    const foundFund = await Fund.findOne({ _id: fund._id });
    const foundChecklist = await FundChecklist.findOne({ _id: checklistid });

    const timeelapsed = Date.now();
    let timestamp = new Date(timeelapsed)
    timestamp = timestamp.toUTCString();

    foundChecklist.preparer.userid = user._id;
    foundChecklist.preparer.firstname = user.firstname;
    foundChecklist.preparer.lastname = user.lastname;
    foundChecklist.preparer.timestamp = timestamp

    if(foundChecklist.reviewers === "1"){
      if(foundChecklist.preparer.userid !== "No Preparer" && foundChecklist.firstReview.userid !== "No 1st Reviewer"){
        foundChecklist.status = "Completed";
        foundFund.completedFundChecklists += 1;
        foundFund.incompleteFundChecklists -= 1;
        this.sendEmail(fund,user)
      }
      else{
        foundChecklist.status = "Incomplete"
      }
    }

    if(foundChecklist.reviewers === "2"){
      if(foundChecklist.preparer.userid !== "No Preparer" && foundChecklist.firstReview.userid !== "No 1st Reviewer" && foundChecklist.secondReview.userid !== "No 2nd Reviewer"){
        foundChecklist.status = "Completed";
        foundFund.completedFundChecklists += 1;
        foundFund.incompleteFundChecklists -= 1;
      }
      else{
        foundChecklist.status = "Incomplete"
      }
    }

    foundFund.save();
    foundChecklist.save();

  },

  async firstReviewSignOff(fund,checklistid,user) {
    const foundFund = await Fund.findOne({ _id: fund._id });
    const foundChecklist = await FundChecklist.findOne({ _id: checklistid });

    const timeelapsed = Date.now();
    let timestamp = new Date(timeelapsed)
    timestamp = timestamp.toUTCString();

    foundChecklist.firstReview.userid = user._id;
    foundChecklist.firstReview.firstname = user.firstname;
    foundChecklist.firstReview.lastname = user.lastname;
    foundChecklist.firstReview.timestamp = timestamp;

    if(foundChecklist.reviewers === "1"){
      if(foundChecklist.preparer.userid !== "No Preparer" && foundChecklist.firstReview.userid !== "No 1st Reviewer"){
        foundChecklist.status = "Completed";
        foundFund.completedFundChecklists += 1;
        foundFund.incompleteFundChecklists -= 1;
      }
      else{
        foundChecklist.status = "Incomplete"
      }
    }

    if(foundChecklist.reviewers === "2"){
      if(foundChecklist.preparer.userid !== "No Preparer" && foundChecklist.firstReview.userid !== "No 1st Reviewer" && foundChecklist.secondReview.userid !== "No 2nd Reviewer"){
        foundChecklist.status = "Completed"
        foundFund.completedFundChecklists += 1;
        foundFund.incompleteFundChecklists -= 1;
      }
      else{
        foundChecklist.status = "Incomplete"
      }
    }

    foundFund.save();
    foundChecklist.save();

  },

  async secondReviewSignOff(fund,checklistid,user) {
    const foundFund = await Fund.findOne({ _id: fund._id });
    const foundChecklist = await FundChecklist.findOne({ _id: checklistid });

    const timeelapsed = Date.now();
    let timestamp = new Date(timeelapsed)
    timestamp = timestamp.toUTCString();

    foundChecklist.secondReview.userid = user._id;
    foundChecklist.secondReview.firstname = user.firstname;
    foundChecklist.secondReview.lastname = user.lastname;
    foundChecklist.secondReview.timestamp = timestamp;

    if(foundChecklist.reviewers === "1"){
      if(foundChecklist.preparer.userid !== "No Preparer" && foundChecklist.firstReview.userid !== "No 1st Reviewer"){
        foundChecklist.status = "Completed";
        foundFund.completedFundChecklists += 1;
        foundFund.incompleteFundChecklists -= 1;
      }
      else{
        foundChecklist.status = "Incomplete";
      }
    }

    if(foundChecklist.reviewers === "2"){
      if(foundChecklist.preparer.userid !== "No Preparer" && foundChecklist.firstReview.userid !== "No 1st Reviewer" && foundChecklist.secondReview.userid !== "No 2nd Reviewer"){
        foundChecklist.status = "Completed";
        foundFund.completedFundChecklists += 1;
        foundFund.incompleteFundChecklists -= 1;
      }
      else{
        foundChecklist.status = "Incomplete"
      }
    }

    foundFund.save();
    foundChecklist.save();

  },

  async removePreparerSignOff(fund,checklistid) {
    const foundFund = await Fund.findOne({ _id: fund._id });
    const foundChecklist = await FundChecklist.findOne({ _id: checklistid });

    if(foundChecklist.status === "Completed"){
      foundFund.incompleteFundChecklists += 1;
      foundFund.completedFundChecklists -= 1;
    }

    foundChecklist.preparer = {userid: "No Preparer", firstname: "", lastname: ""}
    foundChecklist.status = "Incomplete";

    foundFund.save();
    foundChecklist.save();
  },

  async removeFirstReviewSignOff(fund,checklistid) {
    const foundFund = await Fund.findOne({ _id: fund._id });
    const foundChecklist = await FundChecklist.findOne({ _id: checklistid });

    if(foundChecklist.status === "Completed"){
      foundFund.incompleteFundChecklists += 1;
      foundFund.completedFundChecklists -= 1;
    }

    foundChecklist.firstReview = {userid: "No 1st Reviewer", firstname: "", lastname: ""}
    foundChecklist.status = "Incomplete";

    foundFund.save();
    foundChecklist.save();
  },

  async removeSecondReviewSignOff(fund,checklistid) {
    const foundFund = await Fund.findOne({ _id: fund._id });
    const foundChecklist = await FundChecklist.findOne({ _id: checklistid });

    if(foundChecklist.status === "Completed"){
      foundFund.incompleteFundChecklists += 1;
      foundFund.completedFundChecklists -= 1;
    }

    foundChecklist.secondReview = {userid: "No 2nd Reviewer", firstname: "", lastname: ""}
    foundChecklist.status = "Incomplete";

    foundFund.save();
    foundChecklist.save();
  },
  
  async getIncompleteFundChecklists(fund,ids){
    const foundFund = await Fund.findOne({ _id: fund._id });
    let incompleteChecklists = 0;
    for (let fundChecklistIndex = 0; fundChecklistIndex < ids.length; fundChecklistIndex += 1) {
        const fundChecklistId = ids[fundChecklistIndex]
        // eslint-disable-next-line no-await-in-loop
        const foundFundChecklist = await FundChecklist.findOne({ _id: fundChecklistId }).lean();
        if(foundFundChecklist){
          if(foundFundChecklist.status === "Incomplete")
            incompleteChecklists += 1
        }
    };
    foundFund.incompleteFundChecklists = incompleteChecklists;
    await foundFund.save();
  },

  async getCompletedFundChecklists(fund,ids){
    const foundFund = await Fund.findOne({ _id: fund._id });
    let completedChecklists = 0;
    for (let fundChecklistIndex = 0; fundChecklistIndex < ids.length; fundChecklistIndex += 1) {
        const fundChecklistId = ids[fundChecklistIndex]
        // eslint-disable-next-line no-await-in-loop
        const foundFundChecklist = await FundChecklist.findOne({ _id: fundChecklistId }).lean();
        if(foundFundChecklist){
          if(foundFundChecklist.status === "Completed")
            completedChecklists += 1
        }
    };
    foundFund.completedFundChecklists = completedChecklists;
    await foundFund.save();
  },

  async updateFunds(){
    const funds = await this.getAllFunds();
    for (let fundIndex = 0; fundIndex < funds.length; fundIndex += 1) {
      // eslint-disable-next-line no-await-in-loop
      const fundChecklists = await this.getFundChecklistsById(funds[fundIndex].fundChecklists)
      if(fundChecklists){
          funds[fundIndex].fundChecklists = fundChecklists;
          // eslint-disable-next-line no-await-in-loop
          await this.updateFundChecklists(funds[fundIndex]._id,fundChecklists)
      }
  };
  return funds;
  },

  async updateFundChecklists(id,fundChecklists) {
    const foundFund = await Fund.findOne({ _id: id });
    const updatedFundChecklistIds = [];
    fundChecklists.forEach((fundChecklist) => {
      updatedFundChecklistIds.push(fundChecklist._id)
    })
    foundFund.fundChecklists = updatedFundChecklistIds;
    await foundFund.save();
  },

  async deleteFundChecklists(fundChecklists){
    for (let fundChecklistsIndex = 0; fundChecklistsIndex < fundChecklists.length; fundChecklistsIndex += 1) {
      // eslint-disable-next-line no-await-in-loop
      await this.deleteFundChecklistById(fundChecklists[fundChecklistsIndex]._id)
  };
  },

  async deleteFundChecklistById(fund,id) {
    try {
        const foundFund = await Fund.findOne({ _id: fund._id });
        const foundChecklist = await FundChecklist.findOne({ _id: id });

        if(foundChecklist.status === "Completed"){
          foundFund.completedFundChecklists -= 1;
        }
        else{
          foundFund.incompleteFundChecklists -= 1;
        }

        foundFund.save();
        await FundChecklist.deleteOne({ _id: id });
      } catch (error) {
        console.log("bad id");
      }
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

  async sendEmail(fund, user) {

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({username: "api", key: process.env.MAILGUN_API_KEY});
  
    mg.messages.create(process.env.DOMAIN, {
      from: "Checklist Update <noreply@fintechworkflowtracker>",
      to: ["craig.grehan@centaurfs.com"],
      subject: `A checklist for ${  fund.fundname  } has changed status`,
      text: `Checklist marked as completed by ${user.firstname} ${user.firstname}`,
      html: `<h1>Checklist marked as completed by ${user.firstname} ${user.lastname}</h1>`
    })
    .then(msg => console.log(msg)) // logs response data
    .catch(err => console.error(err)); // logs any error
  
  },
};