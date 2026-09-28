import { model, Schema } from "mongoose";
import { genderEnum, providerEnum, roleEnum } from "../../common/index.js";
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: genderEnum,
      default: genderEnum.male,
    },
    role: {
      type: String,
      enum: roleEnum,
      default: roleEnum.user,
    },
    phone: {
      type: Number,
      required: true,
    },
    provider: {
      type: String,
      enum: providerEnum,
      default: providerEnum.email,
    },
    profileImg: {
      type: String,
    },
    coverImg: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const userModel = model("User", userSchema);
