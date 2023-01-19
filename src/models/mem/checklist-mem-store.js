// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 } from "uuid";

let checklists = [];

export const checklistMemStore = {
  async getAllChecklists() {
    return checklists;
  },

  async addChecklist(checklist) {
    checklist._id = v4();
    checklists.push(checklist);
    return checklist;
  },

  async addChecklistItem(id,checklistItem) {
    const foundChecklist = await this.getChecklistById(id);
    foundChecklist.items.push(checklistItem);
    return foundChecklist;
  },

  async getChecklistById(id) {
    return checklists.find((checklist) => checklist._id === id);
  },

  async deleteChecklistById(id) {
    const index = checklists.findIndex((checklist) => checklist._id === id);
    checklists.splice(index, 1);
  },

  async deleteAll() {
    checklists = [];
  },
};