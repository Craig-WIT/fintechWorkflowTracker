// eslint-disable-next-line import/no-extraneous-dependencies
import {ExcelHelper} from "../utils/excelhelper.js";
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

          const checklistItems = await db.checklistStore.getChecklistItemsById(checklist.items)
          if(checklistItems){
              checklist.items = checklistItems
          }

        const viewData = {
        title: "Edit Checklist",
        checklist: checklist,
      };
      return h.view("editChecklist-view", viewData);
    },
  },

  addChecklist: {
    handler: async function (request, h) {
      const newChecklist = {
        checklistname: request.payload.checklistname,
        reviewers: request.payload.reviewers,
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

        if(request.payload.startdate !== "" && request.payload.enddate !== ""){
          const start = new Date(request.payload.startdate);
          const end = new Date(request.payload.enddate);


          let loop = new Date(start);
          while(loop <= end){   
            
            let defaultStatus = "Checked"

            if(loop.getDay() === 6 || loop.getDay() === 0){
              defaultStatus = "N/A"
            } 

            const dateItem = {
              title: loop.toDateString(),
              header: checklistItem.header,
              default: defaultStatus,
              preparer: defaultStatus,
              firstReview: defaultStatus,
              secondReview: defaultStatus,
            };

            // eslint-disable-next-line no-await-in-loop
            await db.checklistStore.addChecklistItem(checklist._id,dateItem);
            
          const newDate = loop.setDate(loop.getDate() + 1);
          loop = new Date(newDate);
        }
        }

        const newItem = {
            title: request.payload.checklistitem,
            header: checklistItem.header,
            default: request.payload.defaultvalue,
            preparer: request.payload.defaultvalue,
            firstReview: request.payload.defaultvalue,
            secondReview: request.payload.defaultvalue
          };
        const viewData = {
        title: "Edit Checklist",
        checklist: checklist,
      };
      if(request.payload.checklistitem === ""){
        return h.redirect(`/checklistAdmin/${checklistId}/editChecklist`, viewData);
      }
      await db.checklistStore.addChecklistItem(checklist._id,newItem);
      console.log(checklist)
      return h.redirect(`/checklistAdmin/${checklistId}/editChecklist`, viewData);
    },
  },

  editChecklistExcel: {
    payload: {
      maxBytes: 209715200,
      output: "file",
      parse: true,
      multipart: true
    },
    handler: async function (request, h) {
      const filepath = request.payload.excelfile.path;
      const checklist = await db.checklistStore.getChecklistById(request.params.id);
      const checklistId = request.params.id
      await ExcelHelper.addChecklistItem(checklistId,filepath);
      const viewData = {
        title: "Edit Checklist",
        checklist: checklist,
      };
      return h.redirect(`/checklistAdmin/${checklistId}/editChecklist`, viewData);
    },
  },
};