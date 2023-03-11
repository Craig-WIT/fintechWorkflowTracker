// eslint-disable-next-line import/no-extraneous-dependencies
import xlsx from "xlsx";
import {db} from "../models/db.js"
import { Fund } from "../models/mongo/fund.js";
import { Team } from "../models/mongo/team.js";
import { User } from "../models/mongo/user.js";
import { ChecklistItem } from "../models/mongo/checklistItem.js";

export const ExcelHelper = {
  addFund: async function(filepath){
    const workbook = xlsx.readFile(filepath);
    const sheetnames = Object.keys(workbook.Sheets);
    const sheetname = sheetnames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetname]);

    for(let i=0; i< data.length; i += 1) {
      const newFund = new Fund({
        fundname: data[i].fundname,
        yearend: data[i].financialyearend,
      });
      // eslint-disable-next-line no-await-in-loop
      await db.fundStore.addFund(newFund);
    }
  },

  addTeam: async function(filepath){
    const workbook = xlsx.readFile(filepath);
    const sheetnames = Object.keys(workbook.Sheets);
    const sheetname = sheetnames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetname]);

    for(let i=0; i< data.length; i += 1) {
      const newTeam = new Team({
        teamname: data[i].teamname,
        location: data[i].location,
        department: data[i].department,
      });
      // eslint-disable-next-line no-await-in-loop
      await db.teamStore.addTeamExcel(newTeam);
    }
  },

  addUser: async function(filepath){
    const workbook = xlsx.readFile(filepath);
    const sheetnames = Object.keys(workbook.Sheets);
    const sheetname = sheetnames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetname]);

    for(let i=0; i< data.length; i += 1) {
      const newUser = new User({
        firstname: data[i].firstname,
        lastname: data[i].lastname,
        email: data[i].email,
        password: data[i].password,
        role: data[i].role,
        admin: data[i].admin,
      });
      // eslint-disable-next-line no-await-in-loop
      await db.userStore.addUserExcel(newUser);
    }
  },

  addChecklistItem: async function(checklistid,filepath){
    const workbook = xlsx.readFile(filepath);
    const sheetnames = Object.keys(workbook.Sheets);
    const sheetname = sheetnames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetname]);

    for(let i=0; i< data.length; i += 1) {
      const newChecklistItem = new ChecklistItem({
        title: data[i].title,
        default: data[i].default,
        preparer: data[i].default,
        firstReview: data[i].default,
        secondReview: data[i].default,
      });

      newChecklistItem.header = false
        if(data[i].header === "TRUE"){
            newChecklistItem.header = true
        }
      
      // eslint-disable-next-line no-await-in-loop
      await db.checklistStore.addChecklistItem(checklistid,newChecklistItem);
    }
  },
};