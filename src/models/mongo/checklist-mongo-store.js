import { Checklist } from "./checklist.js";
import { ChecklistItem } from "./checklistItem.js";

export const checklistMongoStore = {
  async getAllChecklists() {
    const checklists = await Checklist.find().lean();
    return checklists;
  },

  async addChecklist(checklist) {
    const newChecklist = new Checklist(checklist);
    const checklistObj = await newChecklist.save();
    const u = await this.getChecklistById(checklistObj._id);
    return u;
  },

  async addChecklistItem(id,checklistItem) {
    const foundChecklist = await Checklist.findOne({ _id: id });
    const newChecklistItem = new ChecklistItem(checklistItem);
    const checklistItemObj = await newChecklistItem.save();
    foundChecklist.items.push(checklistItemObj._id);
    await foundChecklist.save();
    return foundChecklist;
  },

  async getChecklistById(id) {
    if (id) {
        const checklist = await Checklist.findOne({ _id: id }).lean();
        return checklist;
      }
      return null;
  },

  async getChecklistItemsById(ids) {
    const checklistItems =[];
    for (let checklistItemIndex = 0; checklistItemIndex < ids.length; checklistItemIndex += 1) {
        const checklistItemId = ids[checklistItemIndex]
        // eslint-disable-next-line no-await-in-loop
        const foundChecklistItem = await ChecklistItem.findOne({ _id: checklistItemId }).lean();
        if(foundChecklistItem){
            checklistItems.push(foundChecklistItem)
        }
    };
    return checklistItems
  },

  async deleteChecklistById(id) {
    try {
        await Checklist.deleteOne({ _id: id });
      } catch (error) {
        console.log("bad id");
      }
  },

  async deleteAll() {
    await Checklist.deleteMany({});
  },
};