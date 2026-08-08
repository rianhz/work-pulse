
import mongoose from "mongoose";
import { IUser } from "./interfaces";
import { baseDateFormat } from "../../helpers/date-format";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

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
        "deleted",
      ],
      default: "active",
    },

    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    }],

    leader: {
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
      default: null,
    },

    position: {
      type: String,
      required: false,
      default: "",
    },

    timezone:{
      type: String,
      required: false,
      default: "",
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

userSchema.virtual("formattedBirthDate").get(function(this: Document & IUser & { birthDate: Date }) {
  return this.birthDate ? baseDateFormat(this.birthDate) : null;
});

userSchema.virtual("formattedCreatedAt").get(function(this: Document & IUser & { createdAt: Date }) {
  return this.createdAt ? baseDateFormat(this.createdAt) : null;
});

userSchema.virtual("formattedUpdatedAt").get(function(this: Document & IUser & { updatedAt: Date }) {
  return this.updatedAt ? baseDateFormat(this.updatedAt) : null;
});

userSchema.plugin(mongooseLeanVirtuals);

userSchema.index({
  email: 1,
  fullName: 1,
  tenantId: 1,
});

userSchema.index({
  tenantId: 1,
  leader: 1,
  status: 1,
});


export const UserModel = mongoose.model<IUser>("User", userSchema);