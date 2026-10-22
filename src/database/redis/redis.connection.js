import { createClient } from "redis";
import { env } from "../../config/env.service.js";
import { BadRequestException } from "../../common/errors/appError.js";

export const redisConnection = async () => {
  const client = createClient({
    url: env.redisUrl,
  });

  client.on("error", function (err) {
    throw BadRequestException({ message: err });
  });
  await client.connect();
  console.log("redis connected");
  return client;
};
