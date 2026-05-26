import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },

    lastName: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already existed"],
    },

    // Password optional for Google users
    password: {
      type: String,
      required: false,
    },

    profileImageUrl: {
      type: String,
      default: "",
    },

    // Google Account ID
    googleId: {
      type: String,
      default: null,
    },

    // To know how user registered
    provider: {
      type: String,
      enum: ["LOCAL", "GOOGLE"],
      default: "LOCAL",
    },

    role: {
      type: String,
      enum: ["AUTHOR", "USER", "ADMIN"],
      default: "USER",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    versionKey: false,
  }
);

// create model
export const UserTypeModel = model("user", userSchema);