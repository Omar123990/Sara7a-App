import { env } from "../../config/env.service.js";
import bcrypt from "bcrypt";
export const generateHash = async ({ planText, salt = env.salt }) => {
  let hashData = await bcrypt.hash(planText, Number(salt));
  return hashData;
};
export const compareHash = async ({ planText, hashedPassword }) => {
  let isValidPassword = await bcrypt.compare(planText, hashedPassword);
  return isValidPassword;
}