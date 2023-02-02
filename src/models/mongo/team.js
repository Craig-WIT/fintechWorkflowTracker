/* eslint-disable import/no-extraneous-dependencies */
import Mongoose from "mongoose";

const { Schema } = Mongoose;

const teamSchema = new Schema({
  name: String,
  location: String,
  department: String,
  fund: [{ 
    type: Schema.Types.ObjectId, ref: "Fund" 
    }],
});

export const User = Mongoose.model("Team", teamSchema);