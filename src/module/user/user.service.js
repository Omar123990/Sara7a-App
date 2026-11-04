import { randomInt } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from "../../common/errors/appError.js";
import { compareHash, generateHash } from "../../common/index.js";
import { userModel } from "../../database/model/user.model.js";
import { del, get, set } from "../../database/redis/redis.service.js";
import { sendEmail } from "../../common/services/sendEmail.js";

// Finds one account by its MongoDB identifier using Mongoose.
export const getUserById = async (id) => {
  let user = await userModel.findById(id);
  if (!user) {
    throw BadRequestException({ message: "user not found" });
  }
  return user;
};

// Searches account names in MongoDB with a case-insensitive regular expression.
export const searchUser = async (quary) => {
  let { search } = quary;
  if (!search || search.trim() === "") {
    throw BadRequestException({ message: "the name field is required" });
  }
  let user = await userModel.find({
    $or: [{ name: { $regex: search, $options: "i" } }],
  });
  if (!user) {
    throw BadRequestException({ message: "user not found" });
  }
  return user;
};

// Retrieves every account from MongoDB with a Mongoose query for administrative use.
export const getAllUsers = async () => {
  const users = await userModel.find();
  if (users.length === 0) {
    throw BadRequestException({ message: "No users found" });
  }
  return users;
};

// Stores the Multer-uploaded image path on the MongoDB account.
export const uploadProfileImage = async (id, image) => {
  let user = await userModel.findById(id);
  if (!user || !image) {
    throw BadRequestException({ message: "user not found" });
  }
  user.profileImg = `uploads/${image.filename}`;
  await user.save();
  return user;
};

// Updates editable MongoDB account fields and an optional Multer-uploaded image.
export const updateUser = async (body, file, userData) => {
  const user = await getUserById(userData.id);
  const fields = ["name", "uniqueName", "age", "gender", "phone"];
  let hasUpdates = false;

  for (const field of fields) {
    if (body[field] !== undefined) {
      user[field] = body[field];
      hasUpdates = true;
    }
  }

  if (file) {
    user.profileImg = `uploads/${file.filename}`;
    hasUpdates = true;
  }

  if (!hasUpdates) {
    throw BadRequestException({ message: "no user data to update" });
  }

  await user.save();
  return user;
};

// Deletes the authenticated account from MongoDB with Mongoose.
export const deleteUser = async (userData) => {
  const user = await userModel.findByIdAndDelete(userData.id);
  if (!user) {
    throw BadRequestException({ message: "user not found" });
  }
  return user;
};

// Retrieves only public profile fields from MongoDB by unique name.
export const getPublicProfile = async (uniqueName) => {
  const user = await userModel
    .findOne({ uniqueName })
    .select("name uniqueName profileImg coverImg");
  if (!user) {
    throw BadRequestException({ message: "user not found" });
  }
  return user;
};

// Checks the bcrypt password hash and saves the newly hashed password in MongoDB.
export const changePassword = async (body, userData) => {
  const user = await getUserById(userData.id);
  const isValidPassword = await compareHash({
    planText: body.currentPassword,
    hashedPassword: user.password,
  });
  if (!isValidPassword) {
    throw UnauthorizedException({ message: "Invalid current password" });
  }

  user.password = await generateHash({ planText: body.newPassword });
  await user.save();
  return { message: "Password changed successfully" };
};

// Checks the MongoDB account/password, then stores an OTP in Redis and emails it with Nodemailer.
export const requestEmailChange = async (body, userData) => {
  const user = await getUserById(userData.id);
  if (user.email === body.email) {
    throw BadRequestException({ message: "This is already your email" });
  }
  const existingUser = await userModel.findOne({ email: body.email });
  if (existingUser) {
    throw ConflictException({ message: "Email already exists" });
  }

  const otp = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await set(
    `email-change::${user._id}`,
    JSON.stringify({ email: body.email, otp }),
    5 * 60,
  );
  await sendEmail({
    to: body.email,
    subject: "Verify your new email",
    html: `<h1>Your OTP is: ${otp}</h1>`,
  });
  return { message: "Email verification OTP sent successfully" };
};

// Verifies the Redis OTP and updates the MongoDB account's email.
export const verifyEmailChange = async (body, userData) => {
  const user = await getUserById(userData.id);
  const pendingChange = await get(`email-change::${user._id}`);
  if (!pendingChange) {
    throw BadRequestException({
      message: "Email change OTP expired or missing",
    });
  }

  const { email, otp } = JSON.parse(pendingChange);
  if (otp !== body.otp) {
    throw BadRequestException({ message: "Invalid OTP" });
  }
  if (await userModel.findOne({ email, _id: { $ne: user._id } })) {
    throw ConflictException({ message: "Email already exists" });
  }

  user.email = email;
  user.isVerified = true;
  await user.save();
  await del(`email-change::${user._id}`);
  return { message: "Email changed successfully" };
};
