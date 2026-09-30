import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(`./.env.${process.env.NODE_ENV}`) });

const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL;
const salt = process.env.SALT;
const token_key = process.env.TOKEN_KEY;
const mood = process.env.MOOD;

export let env = {
  port,
  databaseUrl,
  salt,
  token_key,
  mood,
};
