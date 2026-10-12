import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(`./.env.${process.env.NODE_ENV}`) });

const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL;
const salt = process.env.SALT;
const userTokenKey = process.env.USER_TOKEN_KEY;
const adminTokenKey = process.env.ADMIN_TOKEN_KEY;
const userRefreshTokenKey = process.env.USER_REFRESH_TOKEN_KEY;
const adminRefreshTokenKey = process.env.ADMIN_REFRESH_TOKEN_KEY;
const userAud = process.env.USER_AUD;
const adminAud = process.env.ADMIN_AUD;
const emailService = process.env.EMAIL_SERVICE;
const emailPassword = process.env.EMAIL_PASSWORD;

const mood = process.env.MOOD;

export let env = {
  port,
  databaseUrl,
  salt,
  userTokenKey,
  adminTokenKey,
  userRefreshTokenKey,
  adminRefreshTokenKey,
  userAud,
  adminAud,
  mood,
  emailService,
  emailPassword,
};
