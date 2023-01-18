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
};