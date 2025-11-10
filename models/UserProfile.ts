import { Schema, model, models } from "mongoose";
import { dbConnect } from "@/lib/mongoose";

export const ROLES = ["user", "moderator", "admin"] as const;
export type UserRole = typeof ROLES[number];

const UserProfileSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },

    passwordHash: { type: String, required: false }, // local users only

    role: {
      type: String,
      enum: ROLES,
      default: "user",
    },
    pets: [
      {
        name: { type: String, required: true },
        species: { type: String, required: true },
        breed: String,
        birthdate: Date,
      },
    ],
    preferences: {
      theme: { type: String, default: "system" },
      newsletter: { type: Boolean, default: false },
    },
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

 export async function UserProfileModel() {
  await dbConnect();
  return (models.UserProfile as any) || model("UserProfile", UserProfileSchema);
}
