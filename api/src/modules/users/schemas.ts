
import mongoose from "mongoose";
import { IUser } from "./interfaces";

const userSchema = new mongoose.Schema<IUser>(
  {
    tenantId: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "owner",
        "admin",
        "manager",
        "team-leader",
        "employee",
      ],
      default: "employee",
    },

    status: {
      type: String,
      enum: [
        "active",
        "pending",
        "disabled",
      ],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({
  tenantId: 1,
  email: 1,
});

export const UserModel = mongoose.model<IUser>("User", userSchema);