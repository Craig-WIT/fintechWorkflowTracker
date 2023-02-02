// eslint-disable-next-line import/no-extraneous-dependencies
import * as dotenv from "dotenv";
// eslint-disable-next-line import/no-extraneous-dependencies
import Mongoose from "mongoose";

export function connectMongo() {
  dotenv.config();

  Mongoose.connect(process.env.db);
  const db = Mongoose.connection;

  db.on("error", (err) => {
    console.log(`database connection error: ${err}`);
  });

  db.on("disconnected", () => {
    console.log("database disconnected");
  });

  db.once("open", function () {
    console.log(`database connected to ${this.name} on ${this.host}`);
  });
}