
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

    avatar: {
      type: String,
      required: false,
      default: "",
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

    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    }],

    reportsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    nickName: {
      type: String,
      required: false,
      default: null,
    },

    birthDate: {
      type: Date,
      required: false,
      default: null,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },

    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
    },

    refreshToken: {
      token: {
        type: String,
        required: false,
        default: null,
      },
      expiresIn: {
        type: Number,
        required: false,
        default: null,
      },
      createdAt: {
        type: Date,
        required: false,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({
  email: 1,
  fullName: 1,
  tenantId: 1,
});

export const UserModel = mongoose.model<IUser>("User", userSchema);