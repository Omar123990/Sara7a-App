import { BadRequestException } from "../../common/errors/appError.js";
import { messageModel } from "../../database/model/message.model.js";
import { userModel } from "../../database/model/user.model.js";

// Retrieves every message from MongoDB with Mongoose for administrative use.
export const getAllMessages = async () => {
  const data = await messageModel.find();
  if (data.length === 0) {
    throw BadRequestException({ message: "no messages found" });
  }
  return data;
};

// Checks the recipient in MongoDB and saves the message and optional Multer upload.
export const sendMessage = async (body, file) => {
  const { content, resiverId } = body;
  const exsistedUser = await userModel.findById(resiverId);
  if (!exsistedUser) {
    throw BadRequestException({ message: "user not found" });
  }

  const image = file ? file.path : undefined;
  const addedMessage = await messageModel.insertOne({
    content,
    resiverId,
    image,
  });
  if (!addedMessage) {
    throw BadRequestException({ message: "message not sent" });
  }
  return addedMessage;
};

// Builds the authenticated user's anonymous-message URL from MongoDB account data.
export const getUrl = async (user) => {
  const userData = await userModel.findById(user.id);
  if (!userData) {
    throw BadRequestException({ message: "user not found" });
  }
  return `https://sara7a/${userData.uniqueName}`;
};

// Resolves an account URL with Mongoose and returns only public profile fields.
export const getUserData = async (query) => {
  const uniqueName = new URL(query.url).pathname
    .split("/")
    .filter(Boolean)
    .at(-1);
  if (!uniqueName) {
    throw BadRequestException({ message: "user not found" });
  }
  const userData = await userModel
    .findOne({ uniqueName })
    .select("name uniqueName profileImg coverImg");
  if (!userData) {
    throw BadRequestException({ message: "user not found" });
  }
  return userData;
};

// Retrieves the authenticated user's received messages with a Mongoose query.
export const getUserMessages = async (user) => {
  const messages = await messageModel.find({ resiverId: user.id });
  if (messages.length === 0) {
    throw BadRequestException({ message: "messages are not found" });
  }
  return messages;
};

// Deletes a MongoDB message only when its recipient ID matches the authenticated user.
export const deleteUserMessage = async (messageId, user) => {
  const message = await messageModel.findOneAndDelete({
    _id: messageId,
    resiverId: user.id,
  });
  if (!message) {
    throw BadRequestException({ message: "message not found" });
  }
  return message;
};
