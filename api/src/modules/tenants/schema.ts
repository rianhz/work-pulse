import mongoose from "mongoose";
import { ITenant } from "./interfaces";


const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    plan: {
      type: String,
      default: "trial",
    },
    description: {
      type: String,
      required: false,
    },

    status: {
      type: String,
      default: "active",
    },
    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    }],
  },
  {
    timestamps: true,
  }
);

export const TenantModel = mongoose.model<ITenant>("Tenant", tenantSchema);