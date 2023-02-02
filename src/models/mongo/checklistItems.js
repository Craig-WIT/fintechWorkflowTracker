/* eslint-disable import/no-extraneous-dependencies */
import Mongoose from "mongoose";

const { Schema } = Mongoose;

const checklistItemSchema = new Schema({
    title: String,
    header: Boolean,
    default: String,
    preparer: String,
    firstReview: String,
    secondReview: String,
});

export const User = Mongoose.model("ChecklistItem", checklistItemSchema);