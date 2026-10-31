import { BadRequestException } from "../../common/errors/appError.js";
import { userModel } from "../../database/model/user.model.js";

export const getUserById = async (id) => {
  let user = await userModel.findById(id);
  if (!user) {
    throw BadRequestException({ message: "user not found" });
  }
  return user;
};

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

export const getAllUsers = async () => {
  const users = await userModel.find();
  if (users.length === 0) {
    throw BadRequestException({ message: "No users found" });
  }
  return users;
};

export const uploadProfileImage = async (id, image) => {
  let user = await userModel.findById(id);
  if (!user || !image) {
    throw BadRequestException({ message: "user not found" });
  }
  user.profileImg = `uploads/${image.filename}`;
  await user.save();
  return user;
};

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

export const deleteUser = async (userData) => {
  const user = await userModel.findByIdAndDelete(userData.id);
  if (!user) {
    throw BadRequestException({ message: "user not found" });
  }
  return user;
};
