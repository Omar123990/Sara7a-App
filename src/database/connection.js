import mongoose from "mongoose";
import { env } from "../config/env.service.js";

export const databaseConnection = () => {
  mongoose
    .connect(env.databaseUrl, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    })
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log(err);
    });
};
