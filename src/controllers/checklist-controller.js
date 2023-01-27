import { db } from "../models/db.js";

export const checklistController = {
  showChecklistAdmin: {
    handler: async function (request, h) {
        const checklists = await db.checklistStore.getAllChecklists();
        const viewData = {
        title: "Checklists Dashboard",
        checklists: checklists,
      };
      return h.view("checklistAdmin-view", viewData);
    },
  },

  showEditChecklist: {
    handler: async function (request, h) {
        const checklist = await db.checklistStore.getChecklistById(request.params.id);
        const viewData = {
        title: "Edit Checklist",
        checklist: checklist,
      };
      return h.view("editChecklist-view", viewData);
    },
  },

  addChecklist: {
    handler: async function (request, h) {
      const checklistItems = []
      const newChecklist = {
        checklistname: request.payload.checklistname,
        reviewers: request.payload.reviewers,
        items: checklistItems,
      };
      await db.checklistStore.addChecklist(newChecklist);
      console.log(newChecklist)
      return h.redirect("/checklistAdmin");
    },
  },

  deleteChecklist: {
    handler: async function (request, h) {
      const checklist = await db.checklistStore.getChecklistById(request.params.id);
      await db.checklistStore.deleteChecklistById(checklist._id);
      return h.redirect("/checklistAdmin");
    },
  },

  editChecklist: {
    handler: async function (request, h) {
        const checklist = await db.checklistStore.getChecklistById(request.params.id);
        const checklistId = request.params.id
        const checklistItem = []
        checklistItem.header = false
        if(request.payload.checklistheader === "on"){
            checklistItem.header = true
        }
        const newItem = {
            title: request.payload.checklistitem,
            header: checklistItem.header,
            default: request.payload.defaultvalue
          };
        const viewData = {
        title: "Edit Checklist",
        checklist: checklist,
      };
      await db.checklistStore.addChecklistItem(checklist._id,newItem);
      console.log(checklist)
      return h.redirect(`/checklistAdmin/${checklistId}/editChecklist`, viewData);
    },
  },
};