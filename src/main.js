import express from "express";
import { env } from "./config/env.service.js";
import { databaseConnection } from "./database/connection.js";
import authRouter from "./module/auth/auth.controller.js";
import userRouter from "./module/user/user.controller.js";
import { fileURLToPath } from "url";
import path from "path";
import { redisConnection } from "./database/redis/redis.connection.js";

const app = express();
app.use(express.json());
app.use("/user", userRouter);
app.use("/auth", authRouter);
databaseConnection();
export const client = await redisConnection();

app.use(
  "/uploads",
  express.static(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "../uploads"),
  ),
);

app.use((err, req, res, next) => {
  const statusCode = err?.status || err?.cause?.status || 500;

  res.status(statusCode).json({
    message: err.message,
    stack: env.mood == "dev" ? err.stack : null,
    extra: env.mood == "dev" ? err.cause : null,
  });
});

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
