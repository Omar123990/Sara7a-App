import { BadRequestException } from "../../common/errors/appError.js";
import { userModel } from "../../database/model/user.model.js";

export const getUserById = async (id) => {
  let user = await userModel.findById(id);
  return user;
};

export const searchUser = async (quary) => {
  let { search } = quary;
  if (!search || search.trim() === "") {
    throw BadRequestException({ message: "the name field is required" });
  }
  let user = await userModel.find({ $or: [{ name: { $regex: search } }] });
  if (!user) {
    throw BadRequestException({ message: "user not found" });
  }
  return user;
};
