import { Schema, model, Document } from "mongoose";

export type UserRole = "admin" | "student";

export interface IUser extends Document {
  name: string;
  email: string;
  mobileNumber: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobileNumber: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "student"],
      default: "student",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const UserModel = model<IUser>("User", UserSchema);
