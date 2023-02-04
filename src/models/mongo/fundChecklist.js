/* eslint-disable import/no-extraneous-dependencies */
import Mongoose from "mongoose";

const { Schema } = Mongoose;

const fundChecklistSchema = new Schema({
  checklistname: String,
  reviewers: String,
  items: [{ type: Schema.Types.ObjectId, ref: "ChecklistItem" }],
  checklistdate: String,
  preparer: { 
    type: Schema.Types.ObjectId, ref: "User" 
    },
  firstReview: { 
    type: Schema.Types.ObjectId, ref: "User" 
    },
  secondReview: { 
    type: Schema.Types.ObjectId, ref: "User" 
    },
});

export const User = Mongoose.model("fundChecklist", fundChecklistSchema);