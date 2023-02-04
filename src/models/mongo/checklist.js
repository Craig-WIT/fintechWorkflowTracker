/* eslint-disable import/no-extraneous-dependencies */
import Mongoose from "mongoose";

const { Schema } = Mongoose;

const checklistSchema = new Schema({
  checklistname: String,
  reviewers: String,
  items: [{ 
    type: Schema.Types.ObjectId, ref: "ChecklistItem" 
    }],
});

export const Checklist = Mongoose.model("Checklist", checklistSchema);