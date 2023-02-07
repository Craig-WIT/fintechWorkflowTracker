import { db } from "../models/db.js";
import { FundSpec,FundChecklistSpec } from "../models/joi-schemas.js";

export const fundController = {
  showFundAdmin: {
    handler: async function (request, h) {
        const funds = await db.fundStore.getAllFunds();
        const viewData = {
        title: "Funds Dashboard",
        funds: funds,
      };
      return h.view("fundAdmin-view", viewData);
    },
  },

  showEditFund: {
    handler: async function (request, h) {
        const fund = await db.fundStore.getFundById(request.params.id);
        const viewData = {
        title: "Edit Fund",
        fund: fund,
      };
      return h.view("editFund-view", viewData);
    },
  },

  showFundChecklists: {
    handler: async function (request, h) {
        const fund = await db.fundStore.getFundById(request.params.id);
        const fundChecklists = await db.fundStore.getFundChecklists(fund._id);
        const loggedInUser = request.auth.credentials;
        const viewData = {
        title: "View Checklists",
        fund: fund,
        fundchecklists: fundChecklists,
        user: loggedInUser,
      };
      return h.view("fundChecklists-view", viewData);
    },
  },

  showAddFundChecklist: {
    handler: async function (request, h) {
        const fund = await db.fundStore.getFundById(request.params.id);
        const checklists = await db.checklistStore.getAllChecklists();
        const fundChecklists = await db.fundStore.getFundChecklists(fund.fundChecklists);



        const loggedInUser = request.auth.credentials;
        const viewData = {
        title: "Add Checklist",
        fund: fund,
        checklists: checklists,
        fundchecklists: fundChecklists,
        user: loggedInUser,
      };
      return h.view("addFundChecklist-view", viewData);
    },
  },

  showEditFundChecklist: {
    handler: async function (request, h) {
      const fund = await db.fundStore.getFundById(request.params.id);
      const fundChecklist = await db.fundStore.getFundChecklistById(request.params.checklistid);
      const loggedInUser = request.auth.credentials;

      const viewData = {
        title: "Edit Fund Checklist",
        fund: fund,
        fundchecklist: fundChecklist,
        user: loggedInUser,
      };
      return h.view("editFundChecklist-view", viewData);
    },
  },

  addFund: {
    validate: {
      payload: FundSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        console.log(error.details)
        const formDetails = request.payload
        const funds = await db.fundStore.getAllFunds();
        return h.view("fundAdmin-view", { title: "Sign up error", errors: error.details, form: formDetails,funds:funds }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const newFund = {
        fundname: request.payload.fundname,
        yearend: request.payload.financialyearend,
        fundChecklists: [],
      };
      await db.fundStore.addFund(newFund);
      console.log(newFund)
      return h.redirect("/fundAdmin");
    },
  },

  addFundChecklist: {
    validate: {
      payload: FundChecklistSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        console.log(error.details)
        const formDetails = request.payload
        const fund = await db.fundStore.getFundById(request.params.id);
        const checklists = await db.checklistStore.getAllChecklists();
        const fundChecklists = await db.fundStore.getFundChecklists(fund._id);
        const loggedInUser = request.auth.credentials;
        return h.view("addFundChecklist-view", { title: "Sign up error", errors: error.details, form: formDetails, fund: fund, checklists: checklists, fundchecklists: fundChecklists, user: loggedInUser }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const fund = await db.fundStore.getFundById(request.params.id);
      const returnedChecklist = await db.checklistStore.getChecklistById(request.payload.type);
      const newChecklist = JSON.parse(JSON.stringify(returnedChecklist));
      newChecklist.checklistdate = request.payload.checklistdate
      newChecklist.preparer = {userid: "No Preparer", firstname: "", lastname: ""}
      newChecklist.firstReview = {userid: "No 1st Reviewer", firstname: "", lastname: ""}

      if(returnedChecklist.reviewers === "2"){
        newChecklist.secondReview = {userid: "No 2nd Reviewer", firstname: "", lastname: ""}
      }      
     
      await db.fundStore.addFundChecklist(fund._id,newChecklist);
      console.log(JSON.stringify(fund, null, 4))
      return h.redirect(`/viewFund/${fund._id}/addFundChecklist`);
    },
  },

  deleteFund: {
    handler: async function (request, h) {
      const fund = await db.fundStore.getFundById(request.params.id);
      await db.fundStore.deleteFundById(fund._id);
      return h.redirect("/fundAdmin");
    },
  },

  editFund: {
    validate: {
      payload: FundSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        console.log(error.details)
        const formDetails = request.payload
        const fund = await db.fundStore.getFundById(request.params.id);
        return h.view("editFund-view", { title: "Sign up error", errors: error.details, form: formDetails,fund:fund }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const fund = await db.fundStore.getFundById(request.params.id);

      const editedFund = {
        fundname: request.payload.fundname,
        yearend: request.payload.financialyearend,
      };
    const viewData = {
    title: "Edit Fund",
    fund: fund,
  };
  await db.fundStore.editFund(fund._id,editedFund);
  console.log(fund)
  return h.redirect("/fundAdmin", viewData);
  },
  },

  editFundChecklist: {
    handler: async function (request, h) {
      const fundId = request.params.id
      const checklistId = request.params.checklistid
      const checklistItems = request.payload

      await db.fundStore.editFundChecklist(checklistId,checklistItems);

      Object.keys(checklistItems).forEach(key => {
        console.log(key, checklistItems[key]);
        if(key.includes("Preparer")){
          console.log("This is a preparer")
        }
        else if(key.includes("1st")){
          console.log("This is a 1st review")
        }
        else if(key.includes("2nd")){
          console.log("This is a 2nd review")
        }
      });
    
    console.log(JSON.stringify(request.payload, null, 4))
    return h.redirect(`/viewFund/${fundId}/editFundChecklist/${checklistId}`);
  },
  },

  preparerSignOff: {
    handler: async function (request, h) {
      const fundId = request.params.id
      const checklistId = request.params.checklistid
      const loggedInUser = request.auth.credentials;

      const fund = await db.fundStore.getFundById(fundId);
      const fundChecklist = await db.fundStore.getFundChecklistById(checklistId);

      if(loggedInUser._id.toString() !== fundChecklist.firstReview.userid && loggedInUser._id.toString() !== fundChecklist.secondReview.userid){
      await db.fundStore.preparerSignOff(checklistId,loggedInUser);
      return h.redirect(`/viewFund/${fundId}/editFundChecklist/${checklistId}`);
      }

      let errorMsg = ""

      if(loggedInUser._id.toString() === fundChecklist.firstReview.userid)  {
        errorMsg = "Can't Sign off - user has already signed as 1st Reviewer"
      }
      else if(loggedInUser._id.toString() === fundChecklist.secondReview.userid){
        errorMsg = "Can't Sign off - user has already signed as 2nd Reviewer"
      }
        
      const viewData = {
        title: "Edit Fund Checklist",
        fund: fund,
        fundchecklist: fundChecklist,
        user: loggedInUser,
        error: errorMsg,
      };

      return h.view("editFundChecklist-view", viewData);
  },
  },

  firstReviewSignOff: {
    handler: async function (request, h) {
      const fundId = request.params.id
      const checklistId = request.params.checklistid
      const loggedInUser = request.auth.credentials;

      const fund = await db.fundStore.getFundById(fundId);
      const fundChecklist = await db.fundStore.getFundChecklistById(checklistId);

      if(loggedInUser.role === "Reviewer" && loggedInUser._id.toString() !== fundChecklist.preparer.userid && loggedInUser._id.toString() !== fundChecklist.secondReview.userid){
      await db.fundStore.firstReviewSignOff(checklistId,loggedInUser);
      return h.redirect(`/viewFund/${fundId}/editFundChecklist/${checklistId}`);
      }

      let errorMsg = "";

        if(loggedInUser.role !== "Reviewer"){
          errorMsg = "Can't Sign off - user is not a Reviewer"
        }
        else if(loggedInUser._id.toString() === fundChecklist.preparer.userid)  {
          errorMsg = "Can't Sign off - user has already signed as Preparer"
        }
        else{
          errorMsg = "Can't Sign off - user has already signed as 2nd Reviewer"
        }
        
      const viewData = {
        title: "Edit Fund Checklist",
        fund: fund,
        fundchecklist: fundChecklist,
        user: loggedInUser,
        error: errorMsg,
      };

      return h.view("editFundChecklist-view", viewData);
  },
  },

  secondReviewSignOff: {
    handler: async function (request, h) {
      const fundId = request.params.id
      const checklistId = request.params.checklistid
      const loggedInUser = request.auth.credentials;

      const fund = await db.fundStore.getFundById(fundId);
      const fundChecklist = await db.fundStore.getFundChecklistById(checklistId);

      if(loggedInUser.role === "Reviewer" && loggedInUser._id.toString() !== fundChecklist.preparer.userid && loggedInUser._id.toString() !== fundChecklist.firstReview.userid){
        await db.fundStore.secondReviewSignOff(checklistId,loggedInUser);
        return h.redirect(`/viewFund/${fundId}/editFundChecklist/${checklistId}`);
        }
        
        let errorMsg = "";

        if(loggedInUser.role !== "Reviewer"){
          errorMsg = "Can't Sign off - user is not a Reviewer"
        }
        else if(loggedInUser._id.toString() === fundChecklist.preparer.userid)  {
          errorMsg = "Can't Sign off - user has already signed as Preparer"
        }
        else{
          errorMsg = "Can't Sign off - user has already signed as 1st Reviewer"
        }
          
        const viewData = {
          title: "Edit Fund Checklist",
          fund: fund,
          fundchecklist: fundChecklist,
          user: loggedInUser,
          error: errorMsg,
        };
  
        return h.view("editFundChecklist-view", viewData);
  },
  },

  removePreparerSignOff: {
    handler: async function (request, h) {
      const fundId = request.params.id;
      const checklistId = request.params.checklistid;
      const loggedInUser = request.auth.credentials;

      const fund = await db.fundStore.getFundById(fundId);
      const fundChecklist = await db.fundStore.getFundChecklistById(checklistId);

      if(loggedInUser.admin || loggedInUser._id.toString() === fundChecklist.preparer.userid){
        await db.fundStore.removePreparerSignOff(checklistId);
        return h.redirect(`/viewFund/${fundId}/editFundChecklist/${checklistId}`);
      }

      const errorMsg = "Can't remove Sign off - Not Admin level"
        
      const viewData = {
        title: "Edit Fund Checklist",
        fund: fund,
        fundchecklist: fundChecklist,
        user: loggedInUser,
        error: errorMsg,
      };

      return h.view("editFundChecklist-view", viewData);
      
  },
  },

  removeFirstReviewSignOff: {
    handler: async function (request, h) {
      const fundId = request.params.id;
      const checklistId = request.params.checklistid;
      const loggedInUser = request.auth.credentials;

      const fund = await db.fundStore.getFundById(fundId);
      const fundChecklist = await db.fundStore.getFundChecklistById(checklistId);

      if(loggedInUser.admin || loggedInUser._id.toString() === fundChecklist.firstReview.userid){
        await db.fundStore.removeFirstReviewSignOff(checklistId);
        return h.redirect(`/viewFund/${fundId}/editFundChecklist/${checklistId}`);
      }

      const errorMsg = "Can't remove sign off - Not Admin level"
        
      const viewData = {
        title: "Edit Fund Checklist",
        fund: fund,
        fundchecklist: fundChecklist,
        user: loggedInUser,
        error: errorMsg,
      };

      return h.view("editFundChecklist-view", viewData);
      
  },
  },

  removeSecondReviewSignOff: {
    handler: async function (request, h) {
      const fundId = request.params.id
      const checklistId = request.params.checklistid
      const loggedInUser = request.auth.credentials;

      const fund = await db.fundStore.getFundById(fundId);
      const fundChecklist = await db.fundStore.getFundChecklistById(checklistId);

      if(loggedInUser.admin || loggedInUser._id.toString() === fundChecklist.secondReview.userid){
        await db.fundStore.removeSecondReviewSignOff(checklistId);
        return h.redirect(`/viewFund/${fundId}/editFundChecklist/${checklistId}`);
      }

      const errorMsg = "Can't remove sign off"
        
      const viewData = {
        title: "Edit Fund Checklist",
        fund: fund,
        fundchecklist: fundChecklist,
        user: loggedInUser,
        error: errorMsg,
      };

      return h.view("editFundChecklist-view", viewData);
      
  },
  },
};