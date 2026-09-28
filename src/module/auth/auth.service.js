import { compareHash, generateHash } from "../../common/index.js";
import { userModel } from "./../../database/model/user.model.js";

export const signUp = async (body) => {
  let { name, email, password, rePassword, age, gender, phone } = body;
  if (password != rePassword) {
    // throw new Error("password and rePassword didn't match", 400);
  }
  let exsistedEmail = await userModel.findOne({ email });
  if (exsistedEmail) {
    // throw new Error("Email already exists", 400);
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
      return user;
    }
  }
};
