import express from "express";
import { env } from "./config/env.service.js";
import { databaseConnection } from "./database/connection.js";
import authRouter from "./module/auth/auth.controller.js";

const app = express();
app.use(express.json());
app.use("/auth", authRouter);
databaseConnection();

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message });
});

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
