import { randomInt } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  ErrorResponse,
  UnauthorizedException,
} from "../../common/errors/appError.js";
import { compareHash, generateHash } from "../../common/index.js";
import { userModel } from "../../database/model/user.model.js";
import {
  generateAccessToken,
  generateToken,
} from "../../common/services/token.service.js";
import { sendEmail } from "../../common/services/sendEmail.js";
import { del, get, set } from "../../database/redis/redis.service.js";

const createOtp = () => String(randomInt(0, 1_000_000)).padStart(6, "0");

// Creates an account using MongoDB and bcrypt, then sends a Redis-backed OTP with Nodemailer.
export const signUp = async (body) => {
  const { name, email, password, rePassword, age, gender, phone, uniqueName } =
    body;
  if (password !== rePassword) {
    throw BadRequestException({ message: "Password not match" });
  }

  if (await userModel.findOne({ email })) {
    throw ConflictException({ message: "Email already exists" });
  }
  if (await userModel.findOne({ uniqueName })) {
    throw ConflictException({ message: "Unique name already exists" });
  }

  const hashedPassword = await generateHash({ planText: password });
  if (!hashedPassword) {
    throw ErrorResponse();
  }

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    age,
    gender,
    phone,
    uniqueName,
  });
  const otp = createOtp();
  await set(`otp::${user._id}`, otp, 5 * 60);
  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html: `<h1>Your OTP is: ${otp}</h1>`,
  });
  return user;
};

// Loads the account from MongoDB, checks its bcrypt hash, and creates JWTs.
export const signIn = async (body) => {
  const { email, password } = body;
  const user = await userModel.findOne({ email });
  if (!user) {
    throw BadRequestException({ message: "user not found" });
  }
  if (!user.isVerified) {
    throw UnauthorizedException({ message: "Email not verified" });
  }

  const isValidPassword = await compareHash({
    planText: password,
    hashedPassword: user.password,
  });
  if (!isValidPassword) {
    throw BadRequestException({ message: "Invalid password" });
  }

  const { token, refreshToken } = generateToken(user);
  return { message: "login successfully", token, refreshToken };
};

// Validates a refresh JWT and signs a new access JWT.
export const refreshToken = (body) => {
  const newToken = generateAccessToken(body.refreshToken);
  if (!newToken) {
    throw BadRequestException({ message: "Invalid refresh token" });
  }
  return { token: newToken };
};

// Verifies the account in MongoDB using its OTP stored in Redis.
export const verifyEmail = async (body) => {
  const { otp, email } = body;
  const user = await userModel.findOne({ email });
  if (!user) {
    throw BadRequestException({ message: "user not found" });
  }
  if (user.isVerified) {
    throw BadRequestException({ message: "Email already verified" });
  }

  const redisOTP = await get(`otp::${user._id}`);
  if (redisOTP !== otp) {
    throw BadRequestException({ message: "Invalid OTP" });
  }

  user.isVerified = true;
  await user.save();
  await del(`otp::${user._id}`);
  return user;
};

// Reissues an account-verification OTP through Redis and Nodemailer.
export const resendVerificationOtp = async (body) => {
  const user = await userModel.findOne({ email: body.email });
  if (!user) {
    throw BadRequestException({ message: "user not found" });
  }
  if (user.isVerified) {
    throw BadRequestException({ message: "Email already verified" });
  }

  const otp = createOtp();
  await set(`otp::${user._id}`, otp, 5 * 60);
  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html: `<h1>Your OTP is: ${otp}</h1>`,
  });
  return { message: "Verification OTP sent successfully" };
};

// Loads a verified account from MongoDB and emails a Redis-backed recovery OTP.
export const forgotPassword = async (body) => {
  const user = await userModel.findOne({ email: body.email });
  if (!user) {
    throw BadRequestException({ message: "user not found" });
  }
  if (!user.isVerified) {
    throw UnauthorizedException({ message: "Email not verified" });
  }

  const otp = createOtp();
  await set(`password-reset::${user._id}`, otp, 5 * 60);
  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: `<h1>Your password reset OTP is: ${otp}</h1>`,
  });
  return { message: "Password reset OTP sent successfully" };
};

// Verifies the Redis OTP, hashes the new password with bcrypt, and saves it in MongoDB.
export const resetPassword = async (body) => {
  const { email, otp, password, rePassword } = body;
  if (password !== rePassword) {
    throw BadRequestException({ message: "Password not match" });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw BadRequestException({ message: "user not found" });
  }
  const redisOTP = await get(`password-reset::${user._id}`);
  if (redisOTP !== otp) {
    throw BadRequestException({ message: "Invalid OTP" });
  }

  user.password = await generateHash({ planText: password });
  await user.save();
  await del(`password-reset::${user._id}`);
  return { message: "Password reset successfully" };
};
