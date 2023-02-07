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
    secondReview: String, 
  }],
  checklistdate: String,
  preparer: { 
    userid : String,
    firstname: String,
    lastname: String,
    _id : false
  },
  firstReview: { 
    userid : String,
    firstname: String,
    lastname: String,
    _id : false
  }, 
  secondReview: { 
    userid : String,
    firstname: String,
    lastname: String,
    _id : false
  }, 
});

export const FundChecklist = Mongoose.model("fundChecklist", fundChecklistSchema);