// eslint-disable-next-line import/no-extraneous-dependencies
import xlsx from "xlsx";
import {db} from "../models/db.js"
import { Fund } from "../models/mongo/fund.js";

export const ExcelHelper = {
  parseExcel: async function(filepath){
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
};