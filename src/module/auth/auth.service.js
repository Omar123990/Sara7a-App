import { createError } from "../../common/errors/appError.js";
import { compareHash, generateHash } from "../../common/index.js";
import { env } from "../../config/env.service.js";
import { userModel } from "./../../database/model/user.model.js";
import jwt from 'jsonwebtoken'
export const signUp = async (body) => {
  let { name, email, password, rePassword, age, gender, phone } = body;
  if (password != rePassword) {
    throw createError("Password doesn't match", 400);
  }
  let exsistedEmail = await userModel.findOne({ email });
  if (exsistedEmail) {
    throw createError("Email already exists", 400);
  } else {
    const hashedPassword = await generateHash({ planText: password });
    if (hashedPassword) {
      let user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        age,
        gender,
        phone,
      });
      return user;
    } else {
      throw createError("Something went wrong", 500);
    }
  }
};

export const signIn = async (body) => {
  let { email, password } = body;
  let user = await userModel.findOne({ email });
  if (user) {
    let isValidPassword = await compareHash({
      planText: password,
      hashedPassword: user.password,
    });
    if (isValidPassword) {
      let token = jwt.sign({id:user._id},env.token_key)
      return token;
    } else {
      throw createError("Invalid password", 400);
    }
  } else {
    throw createError("User not found", 404);
  }
};

export const getUsetById = async(id)=>{
  let user = await userModel.find();
  return user
}