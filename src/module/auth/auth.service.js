import {
  BadRequestException,
  ConflictException,
  ErrorResponse,
  UnauthorizedException,
} from "../../common/errors/appError.js";
import { compareHash, generateHash } from "../../common/index.js";
import { userModel } from "./../../database/model/user.model.js";
import {
  generateAccessToken,
  generateToken,
} from "../../common/services/token.service.js";
import { sendEmail } from "../../common/services/sendEmail.js";
import { get, set } from "../../database/redis/redis.service.js";
export const signUp = async (body) => {
  let { name, email, password, rePassword, age, gender, phone, uniqueName } =
    body;
  if (password != rePassword) {
    throw BadRequestException({ message: "Password not match" });
  }
  let exsistedEmail = await userModel.findOne({ email });
  if (exsistedEmail) {
    throw ConflictException({ message: "Email already exists" });
  } else {
    let userData = await userModel.findOne({ uniqueName });
    if (!userData) {
      throw ConflictException({ message: "there is no uniqueName" });
    }
    let otp = Math.floor(Math.random() * 1000000);
    const hashedPassword = await generateHash({ planText: password });
    if (hashedPassword) {
      let user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        age,
        gender,
        phone,
        uniqueName,
      });
      await set(`otp::${user._id}`, otp, 5 * 60);
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `<h1>Your OTP is: ${otp}</h1>`,
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
    if (!user.isVerified) {
      throw UnauthorizedException({ message: "Email not verified" });
    }
    let isValidPassword = await compareHash({
      planText: password,
      hashedPassword: user.password,
    });
    if (isValidPassword) {
      const { token, refreshToken } = generateToken(user);
      return {
        message: "login successfully",
        token,
        refreshToken,
      };
    } else {
      throw BadRequestException({ message: "Invalid password" });
    }
  } else {
    throw BadRequestException({ message: "user not found" });
  }
};

export const refreshToken = (body) => {
  let { refreshToken } = body;

  const newToken = generateAccessToken(refreshToken);

  if (newToken) {
    return { token: newToken };
  } else {
    throw BadRequestException({ message: "Invalid refresh token" });
  }
};

export const verifyEmail = async (body) => {
  let { otp, email } = body;
  const user = await userModel.findOne({ email });
  if (!user) {
    throw BadRequestException({ message: "user not found" });
  }
  if (user.isVerified) {
    throw BadRequestException({ message: "Email already verified" });
  }
  let redisOTP = await get(`otp::${user._id}`);
  if (redisOTP !== otp) {
    throw BadRequestException({ message: "Invalid OTP" });
  }
  user.isVerified = true;
  user.otp = null;
  await user.save();
  return user;
};
