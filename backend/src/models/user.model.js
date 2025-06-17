import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'password is required']
    },
    refreshToken:{
            type: String
    }
  },
  { timestamps: true }
);

export const User=mongoose.model("User",userSchema);