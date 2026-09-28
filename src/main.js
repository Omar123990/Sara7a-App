import express from "express";
import { env } from "./config/env.service.js";
import { databaseConnection } from "./database/connection.js";

const app = express();
app.use(express.json());
databaseConnection();

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
