import {
  BadRequestException,
  ConflictException,
  ErrorResponse,
} from "../../common/errors/appError.js";
import { compareHash, generateHash } from "../../common/index.js";
import { env } from "../../config/env.service.js";
import { userModel } from "./../../database/model/user.model.js";
import jwt from "jsonwebtoken";
export const signUp = async (body) => {
  let { name, email, password, rePassword, age, gender, phone } = body;
  if (password != rePassword) {
    throw BadRequestException({ message: "Password not match" });
  }
  let exsistedEmail = await userModel.findOne({ email });
  if (exsistedEmail) {
    throw ConflictException({ message: "Email already exists" });
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
      throw ErrorResponse();
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
      let token = jwt.sign({ id: user._id }, env.token_key);
      return token;
    } else {
      throw BadRequestException({ message: "Invalid password" });
    }
  } else {
    throw BadRequestException({ message: "user not found" });
  }
};

