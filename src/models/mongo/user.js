/* eslint-disable import/no-extraneous-dependencies */
import Mongoose from "mongoose";

const { Schema } = Mongoose;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  role: String,
  admin: Boolean,
  teams: [{ 
    type: Schema.Types.Object, ref: "Team" 
    }],
});

export const User = Mongoose.model("User", userSchema);