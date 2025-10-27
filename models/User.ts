import mongoose, { Schema, models, model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
    lastLogin: Date,
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;
