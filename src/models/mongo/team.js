/* eslint-disable import/no-extraneous-dependencies */
import Mongoose from "mongoose";

const { Schema } = Mongoose;

const teamSchema = new Schema({
  name: String,
  location: String,
  department: String,
  funds: [{ 
    type: Schema.Types.Object, ref: "Fund" 
    }],
});

export const Team = Mongoose.model("Team", teamSchema);