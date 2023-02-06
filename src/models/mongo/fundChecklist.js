/* eslint-disable import/no-extraneous-dependencies */
import Mongoose from "mongoose";

const { Schema } = Mongoose;

const fundChecklistSchema = new Schema({
  checklistname: String,
  reviewers: String,
  items: [{ type: Schema.Types.Object, ref: "ChecklistItem" }],
  checklistdate: String,
  preparer: String,
  firstReview: String, 
  secondReview: String, 
});

export const FundChecklist = Mongoose.model("fundChecklist", fundChecklistSchema);