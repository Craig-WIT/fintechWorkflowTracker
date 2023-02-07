/* eslint-disable import/no-extraneous-dependencies */
import Mongoose from "mongoose";

const { Schema } = Mongoose;

const fundChecklistSchema = new Schema({
  checklistname: String,
  reviewers: String,
  items: [{ 
    _id : String,
    title: String,
    header: Boolean,
    default: String,
    preparer: String,
    firstReview: String,
    secondReview: String, }],
  checklistdate: String,
  preparer: String,
  firstReview: String, 
  secondReview: String, 
});

export const FundChecklist = Mongoose.model("fundChecklist", fundChecklistSchema);