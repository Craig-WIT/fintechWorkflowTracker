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

  addFund: {
    handler: async function (request, h) {
      const newFund = {
        fundname: request.payload.fundname,
        yearend: request.payload.financialyearend,
      };
      await db.fundStore.addFund(newFund);
      console.log(newFund)
      return h.redirect("/fundAdmin");
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