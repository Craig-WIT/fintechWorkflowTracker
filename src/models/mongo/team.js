/* eslint-disable import/no-extraneous-dependencies */
import Mongoose from "mongoose";

const { Schema } = Mongoose;

const teamSchema = new Schema({
  teamname: String,
  location: String,
  department: String,
  funds: [{ 
    type: Schema.Types.ObjectId, ref: "Fund" 
    }],
  completedFundChecklists: Number,
  incompleteFundChecklists: Number,
});

export const Team = Mongoose.model("Team", teamSchema);