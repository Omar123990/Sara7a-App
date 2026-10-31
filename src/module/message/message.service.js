import { BadRequestException } from "../../common/errors/appError.js";
import { messageModel } from "../../database/model/message.model.js";
import { userModel } from "../../database/model/user.model.js";

export const getAllMessages = async () => {
  let data = await messageModel.find();
  if (data.length == 0) {
    throw BadRequestException({ message: "no messages found" });
  }
  return data;
};

export const sendMessage = async (body, file) => {
  let { content, resiverId } = body;
  let image;
  let exsistedUser = await userModel.findById(resiverId);
  if (!exsistedUser) {
    throw BadRequestException({ message: "user not foune" });
  }
  if (file) {
    image = file.path;
  }

  let addedMessage = await messageModel.insertOne({
    content,
    resiverId,
    image,
  });
  if (!addedMessage) {
    throw BadRequestException({ message: "message not sent" });
  }
  return addedMessage;
};

export const getUrl = async (user) => {
  let userData = await userModel.findById(user.id);
  const url = `https://sara7a/${userData.uniqueName}`;
  return url;
};

export const getUserData = async (body) => {
  let { url } = body;
  let uniqueName = url.split("/").at(-1);
  let userData = await userModel.finOne({ uniqueName });
  if (!userData) {
    throw BadRequestException({ message: "user not found " });
  }
  return userData;
};
export const getUserMessages = async (user) => {
  let messages = await messageModel.find({ resiverId: user.id });
  if (messages.length == 0) {
    throw BadRequestException({ message: "messages are not found" });
  }
  return messages;
};

