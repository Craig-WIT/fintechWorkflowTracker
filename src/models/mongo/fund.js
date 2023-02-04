/* eslint-disable import/no-extraneous-dependencies */
import Mongoose from "mongoose";

const { Schema } = Mongoose;

const fundSchema = new Schema({
  fundname: String,
  yearend: String,
  fundChecklists: [{ 
    type: Schema.Types.ObjectId, ref: "FundChecklist" 
    }],
});

export const Fund = Mongoose.model("Fund", fundSchema);