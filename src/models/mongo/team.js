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
});

export const Team = Mongoose.model("Team", teamSchema);