import { db } from "../models/db.js";

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
        const fundChecklists = await db.fundStore.getFundChecklists(fund._id);
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

  addFund: {
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
    handler: async function (request, h) {
      const fund = await db.fundStore.getFundById(request.params.id);
      const returnedChecklist = await db.checklistStore.getChecklistById(request.payload.type);
      const newChecklist = JSON.parse(JSON.stringify(returnedChecklist));
      newChecklist.checklistdate = request.payload.checklistdate
     
      await db.fundStore.addFundChecklist(fund._id,newChecklist);
      console.log(fund)
      return h.redirect(`/viewFund/${fund._id}/addFundChecklist`);
    },
  },

  showEditFundChecklist: {
    handler: async function (request, h) {
      const fund = await db.fundStore.getFundById(request.params.id);
      const fundChecklist = await db.fundStore.getFundChecklistById(fund._id,request.params.checklistid);
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

  deleteFund: {
    handler: async function (request, h) {
      const fund = await db.fundStore.getFundById(request.params.id);
      await db.teamStore.deleteTeamFundById(fund._id);
      await db.fundStore.deleteFundById(fund._id);
      return h.redirect("/fundAdmin");
    },
  },

  editFund: {
    handler: async function (request, h) {
      const fund = await db.fundStore.getFundById(request.params.id);
      const fundId = request.params.id;

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
};